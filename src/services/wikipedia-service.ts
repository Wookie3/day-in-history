import { env } from '@/lib/env';
import { WikipediaApiError } from '@/lib/errors';
import { WikipediaFeed } from '@/lib/types';

interface WikipediaConfig {
  baseUrl: string;
  userAgent: string;
  timeout: number;
  retries: number;
}

class WikipediaService {
  private config: WikipediaConfig;

  constructor() {
    this.config = {
      baseUrl: env.WIKIPEDIA_API_URL,
      userAgent: env.WIKIPEDIA_API_USER_AGENT,
      timeout: 10000,
      retries: 2,
    };
  }

  async fetchOnThisDay(month: number, day: number): Promise<WikipediaFeed> {
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    const url = `${this.config.baseUrl}/feed/onthisday/all/${paddedMonth}/${paddedDay}`;
    return this.fetchWithRetry(url);
  }

  private async fetchWithRetry(url: string, attempt = 0): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        headers: {
          'Api-User-Agent': this.config.userAgent,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new WikipediaApiError(
          `API request failed: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data;

    } catch (error) {
      if (attempt < this.config.retries && this.isRetryable(error)) {
        await this.backoff(attempt);
        return this.fetchWithRetry(url, attempt + 1);
      }
      throw error;
    }
  }

  private isRetryable(error: any): boolean {
    if (error instanceof WikipediaApiError) {
      return error.status >= 500;
    }
    return error.name === 'AbortError' || error.name === 'TypeError';
  }

  private async backoff(attempt: number): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const wikipediaService = new WikipediaService();
