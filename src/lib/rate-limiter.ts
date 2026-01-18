import { LRUCache } from 'lru-cache';

interface RateLimitEntry {
  timestamps: number[];
}

class RateLimiter {
  private storage: LRUCache<string, RateLimitEntry>;

  constructor() {
    this.storage = new LRUCache<string, RateLimitEntry>({
      max: 1000,
      ttl: 60000, // 1 minute
    });
  }

  async checkLimit(
    identifier: string,
    resource: string,
    maxRequests: number,
    windowMs: number
  ): Promise<boolean> {
    const key = `${resource}:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    let entry = this.storage.get(key) || { timestamps: [] };

    entry.timestamps = entry.timestamps.filter(
      timestamp => timestamp > windowStart
    );

    if (entry.timestamps.length >= maxRequests) {
      return true;
    }

    entry.timestamps.push(now);
    this.storage.set(key, entry);

    return false;
  }

  async getRemainingRequests(
    identifier: string,
    resource: string,
    maxRequests: number,
    windowMs: number
  ): Promise<number> {
    const key = `${resource}:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const entry = this.storage.get(key) || { timestamps: [] };
    const recentTimestamps = entry.timestamps.filter(
      timestamp => timestamp > windowStart
    );

    return Math.max(0, maxRequests - recentTimestamps.length);
  }
}

export const rateLimiter = new RateLimiter();
