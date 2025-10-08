import { Request, Response, NextFunction } from 'express';
import redisCache from './redisCache';

interface CacheConfig {
  ttl?: number;
  keyGenerator?: (req: Request) => string;
  skipCache?: (req: Request) => boolean;
  invalidateOn?: string[];
}

class CachingMiddleware {
  private static instance: CachingMiddleware;
  
  static getInstance(): CachingMiddleware {
    if (!CachingMiddleware.instance) {
      CachingMiddleware.instance = new CachingMiddleware();
    }
    return CachingMiddleware.instance;
  }

  // Cache GET requests
  cache(config: CacheConfig = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Skip cache if configured
      if (config.skipCache && config.skipCache(req)) {
        return next();
      }

      // Generate cache key
      const cacheKey = config.keyGenerator 
        ? config.keyGenerator(req)
        : this.generateDefaultKey(req);

      try {
        // Try to get from cache
        const cachedData = await redisCache.get(cacheKey, {
          ttl: config.ttl,
          prefix: 'api'
        });

        if (cachedData) {
          // Cache hit - return cached data
          res.set('X-Cache', 'HIT');
          res.set('X-Cache-Key', cacheKey);
          return res.json(cachedData);
        }

        // Cache miss - continue to handler
        res.set('X-Cache', 'MISS');
        res.set('X-Cache-Key', cacheKey);

        // Override res.json to cache the response
        const originalJson = res.json;
        res.json = function(data: any) {
          // Cache the response
          redisCache.set(cacheKey, data, {
            ttl: config.ttl || 300, // Default 5 minutes
            prefix: 'api'
          }).catch(error => {
            console.error('Failed to cache response:', error);
          });

          // Call original json method
          return originalJson.call(this, data);
        };

        next();
      } catch (error) {
        console.error('Cache middleware error:', error);
        next();
      }
    };
  }

  // Invalidate cache on specific methods
  invalidate(config: CacheConfig = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Only invalidate on specified methods
      if (!config.invalidateOn || !config.invalidateOn.includes(req.method)) {
        return next();
      }

      try {
        // Generate cache key pattern
        const cacheKeyPattern = config.keyGenerator 
          ? config.keyGenerator(req)
          : this.generateDefaultKey(req);

        // Invalidate cache
        await redisCache.flush(`sharewheelz:api:${cacheKeyPattern}*`);

        res.set('X-Cache-Invalidated', 'true');
        next();
      } catch (error) {
        console.error('Cache invalidation error:', error);
        next();
      }
    };
  }

  private generateDefaultKey(req: Request): string {
    const path = req.path;
    const query = req.query;
    
    // Create a hash of the query parameters
    const queryString = Object.keys(query)
      .sort()
      .map(key => `${key}=${query[key]}`)
      .join('&');
    
    return `${path}?${queryString}`;
  }

  // Specific cache configurations
  carsCache() {
    return this.cache({
      ttl: 300, // 5 minutes
      keyGenerator: (req) => {
        const { city, priceMin, priceMax, make, model } = req.query;
        return `cars:${city || 'all'}:${priceMin || '0'}:${priceMax || '9999'}:${make || 'all'}:${model || 'all'}`;
      }
    });
  }

  userCache() {
    return this.cache({
      ttl: 600, // 10 minutes
      keyGenerator: (req) => {
        const userId = (req as any).user?.id || 'anonymous';
        return `user:${userId}`;
      }
    });
  }

  bookingsCache() {
    return this.cache({
      ttl: 180, // 3 minutes
      keyGenerator: (req) => {
        const userId = (req as any).user?.id || 'anonymous';
        return `bookings:${userId}`;
      }
    });
  }

  // Cache invalidation for cars
  carsInvalidation() {
    return this.invalidate({
      invalidateOn: ['POST', 'PUT', 'DELETE'],
      keyGenerator: (req) => 'cars'
    });
  }

  // Cache invalidation for user data
  userInvalidation() {
    return this.invalidate({
      invalidateOn: ['POST', 'PUT', 'DELETE'],
      keyGenerator: (req) => {
        const userId = (req as any).user?.id || 'anonymous';
        return `user:${userId}`;
      }
    });
  }
}

export default CachingMiddleware.getInstance();