/**
 * Minimal rate limiter using native Map to avoid external dependencies in Edge middleware.
 */

// Simple in-memory cache for rate limiting
const cache = new Map<string, { count: number, expires: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && cached.expires > now) {
    if (cached.count >= limit) {
      return { 
        success: false, 
        limit, 
        remaining: 0, 
        reset: cached.expires 
      };
    }
    
    cached.count += 1;
    return { 
      success: true, 
      limit, 
      remaining: limit - cached.count, 
      reset: cached.expires 
    };
  }

  // Reset or initialize for this key
  const expires = now + windowMs;
  cache.set(key, { count: 1, expires });

  // Cleanup old entries periodically (simple way)
  if (cache.size > 1000) {
    let deletedCount = 0;
    cache.forEach((v, k) => {
      if (deletedCount < 100 && v.expires < now) {
        cache.delete(k);
        deletedCount++;
      }
    });
  }

  return { 
    success: true, 
    limit, 
    remaining: limit - 1, 
    reset: expires 
  };
}
