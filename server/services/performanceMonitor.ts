import { Request, Response, NextFunction } from 'express';

interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: Date;
  endpoint: string;
  method: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const startMemory = process.memoryUsage();
      
      res.on('finish', () => {
        const endTime = Date.now();
        const endMemory = process.memoryUsage();
        
        const metric: PerformanceMetrics = {
          responseTime: endTime - startTime,
          memoryUsage: {
            rss: endMemory.rss - startMemory.rss,
            heapTotal: endMemory.heapTotal - startMemory.heapTotal,
            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
            external: endMemory.external - startMemory.external,
            arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
          },
          timestamp: new Date(),
          endpoint: req.path,
          method: req.method
        };
        
        this.metrics.push(metric);
        
        // Log slow requests
        if (metric.responseTime > 1000) {
          console.warn(`🐌 Slow request: ${req.method} ${req.path} - ${metric.responseTime}ms`);
        }
        
        // Keep only last 1000 metrics
        if (this.metrics.length > 1000) {
          this.metrics = this.metrics.slice(-1000);
        }
      });
      
      next();
    };
  }

  getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, metric) => sum + metric.responseTime, 0);
    return total / this.metrics.length;
  }

  getSlowestEndpoints(): { endpoint: string; avgTime: number; count: number }[] {
    const endpointMap = new Map<string, { totalTime: number; count: number }>();
    
    this.metrics.forEach(metric => {
      const existing = endpointMap.get(metric.endpoint) || { totalTime: 0, count: 0 };
      endpointMap.set(metric.endpoint, {
        totalTime: existing.totalTime + metric.responseTime,
        count: existing.count + 1
      });
    });
    
    return Array.from(endpointMap.entries())
      .map(([endpoint, data]) => ({
        endpoint,
        avgTime: data.totalTime / data.count,
        count: data.count
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 10);
  }
}

export default PerformanceMonitor.getInstance();