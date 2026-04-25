import { LRUCache } from 'lru-cache';

// Max 1000 unique identifiers in memory, with a default 1-minute TTL
const cache = new LRUCache<string, number>({
  max: 1000,
  ttl: 60 * 1000,
});

/**
 * Rate limiter using lru-cache for better memory management.
 * Note: In a serverless/edge environment, this is local to each instance.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const currentCount = cache.get(key) || 0;

  if (currentCount >= limit) {
    return { 
      success: false, 
      limit, 
      remaining: 0, 
      reset: Date.now() + windowMs // Rough estimate as lru-cache doesn't expose exact expiry
    };
  }

  const nextCount = currentCount + 1;
  cache.set(key, nextCount, { ttl: windowMs });

  return { 
    success: true, 
    limit, 
    remaining: limit - nextCount, 
    reset: Date.now() + windowMs 
  };
}
