'use server';

import { wikipediaService } from '@/services/wikipedia-service';
import { logger } from '@/lib/logger';
import { rateLimiter } from '@/lib/rate-limiter';
import { cache, CACHE_STRATEGIES } from '@/lib/cache';
import { WikipediaFeedSchema, WikipediaFeed, type FetchHistoryInput } from '@/lib/types';
import { handleApiError, logError } from '@/lib/errors';
import DOMPurify from 'isomorphic-dompurify';

const FetchHistorySchema = {
  month: (input: number) => {
    const num = Number(input);
    if (isNaN(num) || num < 1 || num > 12) {
      throw new Error('Month must be between 1 and 12');
    }
    return num;
  },
  day: (input: number) => {
    const num = Number(input);
    if (isNaN(num) || num < 1 || num > 31) {
      throw new Error('Day must be between 1 and 31');
    }
    return num;
  },
};

function sanitizeWikipediaText(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'title', 'class'],
    ALLOW_DATA_ATTR: false,
  });
}

function sanitizeWikipediaFeed(feed: WikipediaFeed): WikipediaFeed {
  const MAX_EVENTS = 20;

  const sanitizeEvent = (event: any) => ({
    ...event,
    text: event.text ? sanitizeWikipediaText(event.text) : '',
    pages: (event.pages || []).slice(0, 1).map((page: any) => ({
      ...page,
      title: page.title ? DOMPurify.sanitize(page.title, { ALLOWED_TAGS: [] }) : '',
      extract: page.extract ? sanitizeWikipediaText(page.extract) : null,
    })),
  });

  return {
    births: (feed.births || []).slice(0, MAX_EVENTS).map(sanitizeEvent),
    deaths: (feed.deaths || []).slice(0, MAX_EVENTS).map(sanitizeEvent),
    events: (feed.events || []).slice(0, MAX_EVENTS).map(sanitizeEvent),
  };
}

export async function fetchHistory(input: FetchHistoryInput): Promise<WikipediaFeed> {
  try {
    const ip = 'anonymous';
    const rateLimited = await rateLimiter.checkLimit(ip, 'fetch-history', 30, 60000);

    if (rateLimited) {
      logger.warn('Rate limit exceeded', { ip, action: 'fetch-history' });
      throw new Error('Too many requests. Please try again later.');
    }

    const month = FetchHistorySchema.month(input.month);
    const day = FetchHistorySchema.day(input.day);

    const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day > daysInMonth[month]) {
      throw new Error('Invalid day for the given month');
    }

    const cacheKey = `history:${month}:${day}`;

    if (!input.bypassCache) {
      const cached = await cache.get<WikipediaFeed>(cacheKey);
      if (cached) {
        logger.info('Cache hit', { cacheKey });
        return cached;
      }
    }

    logger.info('Fetching Wikipedia data', { month, day });

    let data;
    try {
      data = await wikipediaService.fetchOnThisDay(month, day);
      logger.info('Wikipedia API response received', { hasData: !!data });
    } catch (apiError) {
      logger.error('Wikipedia API fetch failed', { error: apiError instanceof Error ? apiError.message : String(apiError), month, day });
      throw apiError;
    }

    let validatedData;
    try {
      validatedData = WikipediaFeedSchema.parse(data);
      logger.info('Wikipedia data validated', {
        events: validatedData.events?.length,
        births: validatedData.births?.length,
        deaths: validatedData.deaths?.length,
      });
    } catch (validationError) {
      logger.error('Wikipedia data validation failed', { error: validationError instanceof Error ? validationError.message : String(validationError) });
      throw validationError;
    }

    let sanitizedData;
    try {
      sanitizedData = sanitizeWikipediaFeed(validatedData);
      logger.info('Wikipedia data sanitized');
    } catch (sanitizationError) {
      logger.error('Wikipedia data sanitization failed', { error: sanitizationError instanceof Error ? sanitizationError.message : String(sanitizationError) });
      throw sanitizationError;
    }

    try {
      await cache.set(cacheKey, sanitizedData, CACHE_STRATEGIES.HISTORY_DATA);
      logger.info('Data cached successfully');
    } catch (cacheError) {
      logger.error('Cache set failed', { error: cacheError instanceof Error ? cacheError.message : String(cacheError) });
      throw cacheError;
    }

    logger.info('Successfully fetched history', {
      eventsCount: sanitizedData.events?.length || 0,
      birthsCount: sanitizedData.births?.length || 0,
      deathsCount: sanitizedData.deaths?.length || 0,
    });

    return sanitizedData;

  } catch (error) {
    logError(error, { input });
    const appError = handleApiError(error);
    throw new Error(appError.message);
  }
}
