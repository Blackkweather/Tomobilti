// Simple in-memory cache for performance optimization
class Cache {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const cache = new Cache();

// Cleanup expired entries every 10 minutes
setInterval(() => {
  cache.cleanup();
}, 10 * 60 * 1000);










