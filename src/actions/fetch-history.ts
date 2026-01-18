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

  return {
    births: feed.births?.slice(0, MAX_EVENTS).map((event: any) => ({
      ...event,
      text: sanitizeWikipediaText(event.text),
      pages: event.pages?.slice(0, 1).map((page: any) => ({
        ...page,
        title: DOMPurify.sanitize(page.title, { ALLOWED_TAGS: [] }),
        extract: page.extract ? sanitizeWikipediaText(page.extract) : null,
      })),
    })) || [],
    deaths: feed.deaths?.slice(0, MAX_EVENTS).map((event: any) => ({
      ...event,
      text: sanitizeWikipediaText(event.text),
      pages: event.pages?.slice(0, 1).map((page: any) => ({
        ...page,
        title: DOMPurify.sanitize(page.title, { ALLOWED_TAGS: [] }),
        extract: page.extract ? sanitizeWikipediaText(page.extract) : null,
      })),
    })) || [],
    events: feed.events?.slice(0, MAX_EVENTS).map((event: any) => ({
      ...event,
      text: sanitizeWikipediaText(event.text),
      pages: event.pages?.slice(0, 1).map((page: any) => ({
        ...page,
        title: DOMPurify.sanitize(page.title, { ALLOWED_TAGS: [] }),
        extract: page.extract ? sanitizeWikipediaText(page.extract) : null,
      })),
    })) || [],
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

    const data = await wikipediaService.fetchOnThisDay(month, day);

    const validatedData = WikipediaFeedSchema.parse(data);

    const sanitizedData = sanitizeWikipediaFeed(validatedData);

    await cache.set(cacheKey, sanitizedData, CACHE_STRATEGIES.HISTORY_DATA);

    logger.info('Successfully fetched history', {
      eventsCount: sanitizedData.events?.length || 0,
      birthsCount: sanitizedData.births?.length || 0,
      deathsCount: sanitizedData.deaths?.length || 0,
    });

    return validatedData;

  } catch (error) {
    logError(error, { input });
    const appError = handleApiError(error);
    throw new Error(appError.message);
  }
}
