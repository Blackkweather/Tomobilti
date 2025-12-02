import Redis from 'ioredis';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
}

class RedisCacheService {
  private static instance: RedisCacheService;
  private redis: Redis;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalRequests: 0
  };
  
  static getInstance(): RedisCacheService {
    if (!RedisCacheService.instance) {
      RedisCacheService.instance = new RedisCacheService();
    }
    return RedisCacheService.instance;
  }

  constructor() {
    // Initialize Redis connection
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      // retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000
    });

    this.redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });

    this.redis.on('ready', () => {
      console.log('🚀 Redis ready for operations');
    });
  }

  private getKey(key: string, prefix?: string): string {
    const keyPrefix = prefix || 'sharewheelz';
    return `${keyPrefix}:${key}`;
  }

  private updateStats(hit: boolean) {
    this.stats.totalRequests++;
    if (hit) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    this.stats.hitRate = this.stats.hits / this.stats.totalRequests;
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    try {
      const fullKey = this.getKey(key, options?.prefix);
      const value = await this.redis.get(fullKey);
      
      if (value) {
        this.updateStats(true);
        return JSON.parse(value);
      } else {
        this.updateStats(false);
        return null;
      }
    } catch (error) {
      console.error('Redis get error:', error);
      this.updateStats(false);
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    try {
      const fullKey = this.getKey(key, options?.prefix);
      const serializedValue = JSON.stringify(value);
      
      if (options?.ttl) {
        await this.redis.setex(fullKey, options.ttl, serializedValue);
      } else {
        await this.redis.set(fullKey, serializedValue);
      }
      
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async del(key: string, options?: CacheOptions): Promise<boolean> {
    try {
      const fullKey = this.getKey(key, options?.prefix);
      await this.redis.del(fullKey);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  async exists(key: string, options?: CacheOptions): Promise<boolean> {
    try {
      const fullKey = this.getKey(key, options?.prefix);
      const result = await this.redis.exists(fullKey);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  async flush(pattern?: string): Promise<boolean> {
    try {
      if (pattern) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } else {
        await this.redis.flushall();
      }
      return true;
    } catch (error) {
      console.error('Redis flush error:', error);
      return false;
    }
  }

  async getStats(): Promise<CacheStats> {
    return { ...this.stats };
  }

  async getRedisInfo(): Promise<any> {
    try {
      const info = await this.redis.info();
      return this.parseRedisInfo(info);
    } catch (error) {
      console.error('Redis info error:', error);
      return null;
    }
  }

  private parseRedisInfo(info: string): any {
    const lines = info.split('\r\n');
    const result: any = {};
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = isNaN(Number(value)) ? value : Number(value);
      }
    }
    
    return result;
  }

  // Cache warming methods
  async warmCarsCache(): Promise<void> {
    console.log('🔥 Warming cars cache...');
    
    try {
      // This would typically fetch from database
      const cars = [
        { id: 1, make: 'Porsche', model: '911 F', price: 120 },
        { id: 2, make: 'Jaguar', model: 'F-Type', price: 150 },
        { id: 3, make: 'Tesla', model: 'Model X', price: 200 },
        { id: 4, make: 'Jaguar', model: 'F-Pace Sport', price: 180 },
        { id: 5, make: 'Range Rover', model: 'Evoque Sport', price: 160 },
        { id: 6, make: 'Ferrari', model: 'La Ferrari', price: 500 }
      ];
      
      await this.set('cars:all', cars, { ttl: 300 }); // 5 minutes
      await this.set('cars:count', cars.length, { ttl: 300 });
      
      // Cache individual cars
      for (const car of cars) {
        await this.set(`cars:${car.id}`, car, { ttl: 600 }); // 10 minutes
      }
      
      console.log(`✅ Cached ${cars.length} cars`);
    } catch (error) {
      console.error('❌ Failed to warm cars cache:', error);
    }
  }

  async warmUsersCache(): Promise<void> {
    console.log('🔥 Warming users cache...');
    
    try {
      // Cache user statistics
      const userStats = {
        totalUsers: 150,
        activeUsers: 120,
        premiumUsers: 45,
        lastUpdated: new Date().toISOString()
      };
      
      await this.set('users:stats', userStats, { ttl: 1800 }); // 30 minutes
      
      console.log('✅ Cached user statistics');
    } catch (error) {
      console.error('❌ Failed to warm users cache:', error);
    }
  }

  // Cache invalidation methods
  async invalidateCarsCache(): Promise<void> {
    console.log('🗑️ Invalidating cars cache...');
    await this.flush('sharewheelz:cars:*');
  }

  async invalidateUserCache(userId: string): Promise<void> {
    console.log(`🗑️ Invalidating user cache: ${userId}`);
    await this.flush(`sharewheelz:users:${userId}:*`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; info: any }> {
    try {
      await this.redis.ping();
      const info = await this.getRedisInfo();
      return {
        status: 'healthy',
        info: {
          connected: true,
          stats: await this.getStats(),
          redisInfo: info
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        info: {
          connected: false,
          error: error.message
        }
      };
    }
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('✅ Redis disconnected gracefully');
    } catch (error) {
      console.error('❌ Redis disconnect error:', error);
    }
  }
}

export default RedisCacheService.getInstance();