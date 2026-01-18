import { LRUCache } from 'lru-cache';

interface CacheConfig {
  ttl: number;
}

class CacheService {
  private memoryCache: LRUCache<string, any>;

  constructor() {
    this.memoryCache = new LRUCache<string, any>({
      max: 500,
      ttl: 1000 * 60 * 5, // 5 minutes
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = this.memoryCache.get(key);
    if (value !== undefined) {
      return value as T;
    }
    return null;
  }

  async set<T>(key: string, value: T, config?: CacheConfig): Promise<void> {
    this.memoryCache.set(key, value, { ttl: config?.ttl });
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    this.memoryCache.clear();
  }
}

export const cache = new CacheService();

export const CACHE_STRATEGIES = {
  HISTORY_DATA: {
    ttl: 86400,
  },
};
