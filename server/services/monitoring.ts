import { Request, Response } from 'express';
import { performance } from 'perf_hooks';

interface MetricData {
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  userAgent?: string;
  ip?: string;
}

interface AlertRule {
  name: string;
  condition: (metrics: MetricData[]) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

class MonitoringService {
  private static instance: MonitoringService;
  private metrics: MetricData[] = [];
  private alertRules: AlertRule[] = [];
  private alerts: Array<{ rule: AlertRule; timestamp: Date; data: any }> = [];
  
  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  constructor() {
    this.setupAlertRules();
    this.startHealthChecks();
  }

  private setupAlertRules() {
    this.alertRules = [
      {
        name: 'High Response Time',
        condition: (metrics) => {
          const recent = metrics.slice(-10);
          return recent.length >= 5 && recent.every(m => m.responseTime > 2000);
        },
        severity: 'high',
        message: 'Average response time exceeds 2 seconds'
      },
      {
        name: 'High Error Rate',
        condition: (metrics) => {
          const recent = metrics.slice(-20);
          const errorCount = recent.filter(m => m.statusCode >= 400).length;
          return recent.length >= 10 && (errorCount / recent.length) > 0.2;
        },
        severity: 'critical',
        message: 'Error rate exceeds 20%'
      },
      {
        name: 'Memory Usage High',
        condition: (metrics) => {
          const recent = metrics.slice(-5);
          return recent.length >= 3 && recent.every(m => m.memoryUsage.heapUsed > 500 * 1024 * 1024);
        },
        severity: 'medium',
        message: 'Memory usage consistently high (>500MB)'
      },
      {
        name: 'Endpoint Down',
        condition: (metrics) => {
          const recent = metrics.slice(-5);
          return recent.length >= 3 && recent.every(m => m.statusCode >= 500);
        },
        severity: 'critical',
        message: 'Endpoint returning server errors'
      }
    ];
  }

  recordMetric(data: MetricData) {
    this.metrics.push(data);
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
    
    // Check alert rules
    this.checkAlerts();
  }

  private checkAlerts() {
    this.alertRules.forEach(rule => {
      if (rule.condition(this.metrics)) {
        const existingAlert = this.alerts.find(
          alert => alert.rule.name === rule.name && 
          (Date.now() - alert.timestamp.getTime()) < 300000 // 5 minutes
        );
        
        if (!existingAlert) {
          this.alerts.push({
            rule,
            timestamp: new Date(),
            data: this.metrics.slice(-10)
          });
          
          this.sendAlert(rule, this.metrics.slice(-10));
        }
      }
    });
  }

  private sendAlert(rule: AlertRule, data: MetricData[]) {
    console.warn(`🚨 ALERT [${rule.severity.toUpperCase()}] ${rule.name}: ${rule.message}`);
    
    // In production, this would send to external monitoring service
    // e.g., Sentry, DataDog, New Relic, etc.
    
    if (rule.severity === 'critical') {
      // Send immediate notification
      this.sendCriticalAlert(rule, data);
    }
  }

  private sendCriticalAlert(rule: AlertRule, data: MetricData[]) {
    // Implementation for critical alerts (email, Slack, SMS, etc.)
    console.error(`🔥 CRITICAL ALERT: ${rule.message}`);
  }

  private startHealthChecks() {
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute
  }

  private async performHealthCheck() {
    try {
      const startTime = performance.now();
      
      // Check database connection
      // Check external services
      // Check memory usage
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      const healthMetric: MetricData = {
        timestamp: new Date(),
        endpoint: '/health-check',
        method: 'INTERNAL',
        statusCode: 200,
        responseTime,
        memoryUsage: process.memoryUsage()
      };
      
      this.recordMetric(healthMetric);
      
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  getMetrics(): MetricData[] {
    return this.metrics;
  }

  getAlerts(): Array<{ rule: AlertRule; timestamp: Date; data: any }> {
    return this.alerts;
  }

  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    activeAlerts: number;
    averageResponseTime: number;
  } {
    const recentMetrics = this.metrics.slice(-100);
    const averageResponseTime = recentMetrics.length > 0 
      ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length 
      : 0;
    
    const activeAlerts = this.alerts.filter(
      alert => (Date.now() - alert.timestamp.getTime()) < 300000
    ).length;
    
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (activeAlerts > 0) {
      status = 'warning';
    }
    if (this.alerts.some(alert => alert.rule.severity === 'critical')) {
      status = 'critical';
    }
    
    return {
      status,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      activeAlerts,
      averageResponseTime
    };
  }

  middleware() {
    return (req: Request, res: Response, next: any) => {
      const startTime = performance.now();
      const startMemory = process.memoryUsage();
      
      res.on('finish', () => {
        const endTime = performance.now();
        const endMemory = process.memoryUsage();
        
        const metric: MetricData = {
          timestamp: new Date(),
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          responseTime: endTime - startTime,
          memoryUsage: {
            rss: endMemory.rss - startMemory.rss,
            heapTotal: endMemory.heapTotal - startMemory.heapTotal,
            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
            external: endMemory.external - startMemory.external,
            arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
          },
          userAgent: req.get('User-Agent'),
          ip: req.ip
        };
        
        this.recordMetric(metric);
      });
      
      next();
    };
  }
}

export default MonitoringService.getInstance();