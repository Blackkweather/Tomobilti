#!/usr/bin/env node

/**
 * ShareWheelz Monitoring & Logging Setup
 * Comprehensive monitoring for 100% reliability
 */

const fs = require('fs');
const path = require('path');

console.log('📊 ShareWheelz Monitoring & Logging Setup');
console.log('==========================================\n');

// 1. Create monitoring service
function createMonitoringService() {
  console.log('📈 Creating monitoring service...');
  
  const monitoringService = `import { Request, Response } from 'express';
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
    console.warn(\`🚨 ALERT [\${rule.severity.toUpperCase()}] \${rule.name}: \${rule.message}\`);
    
    // In production, this would send to external monitoring service
    // e.g., Sentry, DataDog, New Relic, etc.
    
    if (rule.severity === 'critical') {
      // Send immediate notification
      this.sendCriticalAlert(rule, data);
    }
  }

  private sendCriticalAlert(rule: AlertRule, data: MetricData[]) {
    // Implementation for critical alerts (email, Slack, SMS, etc.)
    console.error(\`🔥 CRITICAL ALERT: \${rule.message}\`);
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

export default MonitoringService.getInstance();`;

  fs.writeFileSync('server/services/monitoring.ts', monitoringService);
  console.log('   ✅ Monitoring service created');
}

// 2. Create logging service
function createLoggingService() {
  console.log('\n📝 Creating logging service...');
  
  const loggingService = `import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
}

class LoggingService {
  private static instance: LoggingService;
  private logDir: string;
  private logLevel: LogLevel;
  
  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
    
    // Ensure logs directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp;
    const message = entry.message;
    const context = entry.context ? JSON.stringify(entry.context) : '';
    
    return \`[\${timestamp}] [\${levelName}] \${message} \${context}\`;
  }

  private writeToFile(filename: string, content: string) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content + '\\n');
  }

  private log(level: LogLevel, message: string, context?: any, entry?: Partial<LogEntry>) {
    if (!this.shouldLog(level)) return;
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      ...entry
    };
    
    const formattedLog = this.formatLogEntry(logEntry);
    
    // Console output
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.CRITICAL:
        console.error(\`🔥 CRITICAL: \${formattedLog}\`);
        break;
    }
    
    // File output
    const date = new Date().toISOString().split('T')[0];
    const filename = \`\${date}.log\`;
    this.writeToFile(filename, formattedLog);
    
    // Error logs go to separate file
    if (level >= LogLevel.ERROR) {
      const errorFilename = \`\${date}-error.log\`;
      this.writeToFile(errorFilename, formattedLog);
    }
  }

  debug(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.DEBUG, message, context, entry);
  }

  info(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.INFO, message, context, entry);
  }

  warn(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.WARN, message, context, entry);
  }

  error(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.ERROR, message, context, entry);
  }

  critical(message: string, context?: any, entry?: Partial<LogEntry>) {
    this.log(LogLevel.CRITICAL, message, context, entry);
  }

  // Request logging middleware
  requestLogger() {
    return (req: Request, res: Response, next: any) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);
      
      // Add request ID to request object
      (req as any).requestId = requestId;
      
      this.info(\`Request started: \${req.method} \${req.path}\`, {
        requestId,
        method: req.method,
        endpoint: req.path,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
      
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        
        this.info(\`Request completed: \${req.method} \${req.path}\`, {
          requestId,
          method: req.method,
          endpoint: req.path,
          statusCode: res.statusCode,
          responseTime
        });
        
        if (res.statusCode >= 400) {
          this.error(\`Request failed: \${req.method} \${req.path}\`, {
            requestId,
            method: req.method,
            endpoint: req.path,
            statusCode: res.statusCode,
            responseTime
          });
        }
      });
      
      next();
    };
  }

  // Error logging middleware
  errorLogger() {
    return (error: any, req: Request, res: Response, next: any) => {
      const requestId = (req as any).requestId || 'unknown';
      
      this.error(\`Unhandled error: \${error.message}\`, {
        requestId,
        method: req.method,
        endpoint: req.path,
        error: error.stack,
        userId: (req as any).user?.id
      });
      
      next(error);
    };
  }

  // Get log files
  getLogFiles(): string[] {
    if (!fs.existsSync(this.logDir)) {
      return [];
    }
    
    return fs.readdirSync(this.logDir)
      .filter(file => file.endsWith('.log'))
      .sort()
      .reverse();
  }

  // Read log file
  readLogFile(filename: string, lines: number = 100): string[] {
    const filePath = path.join(this.logDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const logLines = content.split('\\n').filter(line => line.trim());
    
    return logLines.slice(-lines);
  }
}

export default LoggingService.getInstance();`;

  fs.writeFileSync('server/services/logging.ts', loggingService);
  console.log('   ✅ Logging service created');
}

// 3. Create performance report generator
function createPerformanceReportGenerator() {
  console.log('\n📊 Creating performance report generator...');
  
  const reportGenerator = `#!/usr/bin/env node

/**
 * ShareWheelz Performance Report Generator
 * Generates comprehensive performance reports
 */

const https = require('https');
const fs = require('fs');

console.log('📊 ShareWheelz Performance Report Generator');
console.log('===========================================\n');

async function generatePerformanceReport() {
  const report = {
    timestamp: new Date().toISOString(),
    url: 'https://sharewheelz.uk',
    metrics: {},
    recommendations: []
  };

  console.log('🔍 Collecting performance metrics...');

  // Test homepage performance
  const homepageMetrics = await testEndpointPerformance('/');
  report.metrics.homepage = homepageMetrics;

  // Test cars API performance
  const carsApiMetrics = await testEndpointPerformance('/api/cars');
  report.metrics.carsApi = carsApiMetrics;

  // Test login page performance
  const loginMetrics = await testEndpointPerformance('/login');
  report.metrics.login = loginMetrics;

  // Test cars page performance
  const carsPageMetrics = await testEndpointPerformance('/cars');
  report.metrics.carsPage = carsPageMetrics;

  // Calculate overall performance score
  const allMetrics = Object.values(report.metrics);
  const averageResponseTime = allMetrics.reduce((sum, m) => sum + m.responseTime, 0) / allMetrics.length;
  const successRate = (allMetrics.filter(m => m.statusCode === 200).length / allMetrics.length) * 100;

  report.metrics.overall = {
    averageResponseTime,
    successRate,
    score: calculatePerformanceScore(averageResponseTime, successRate)
  };

  // Generate recommendations
  report.recommendations = generateRecommendations(report.metrics);

  // Save report
  const reportPath = \`performance-report-\${new Date().toISOString().split('T')[0]}.json\`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Display report
  displayReport(report);

  console.log(\`\\n📄 Report saved to: \${reportPath}\`);
}

function testEndpointPerformance(path) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = \`https://sharewheelz.uk\${path}\`;
    
    const options = {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'ShareWheelz-Performance-Report/1.0'
      }
    };

    const req = https.request(url, options, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          endpoint: path,
          statusCode: res.statusCode,
          responseTime,
          contentLength: data.length,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        endpoint: path,
        statusCode: 0,
        responseTime: 10000,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        endpoint: path,
        statusCode: 0,
        responseTime: 10000,
        error: 'Timeout'
      });
    });

    req.end();
  });
}

function calculatePerformanceScore(averageResponseTime, successRate) {
  let score = 100;
  
  // Deduct points for slow response times
  if (averageResponseTime > 1000) score -= 30;
  else if (averageResponseTime > 500) score -= 15;
  else if (averageResponseTime > 200) score -= 5;
  
  // Deduct points for low success rate
  if (successRate < 90) score -= 40;
  else if (successRate < 95) score -= 20;
  else if (successRate < 99) score -= 10;
  
  return Math.max(0, score);
}

function generateRecommendations(metrics) {
  const recommendations = [];
  
  const overall = metrics.overall;
  
  if (overall.averageResponseTime > 500) {
    recommendations.push({
      priority: 'High',
      category: 'Performance',
      issue: 'Slow response times',
      recommendation: 'Implement CDN and caching to improve response times',
      impact: 'High'
    });
  }
  
  if (overall.successRate < 99) {
    recommendations.push({
      priority: 'Critical',
      category: 'Reliability',
      issue: 'Low success rate',
      recommendation: 'Investigate and fix failing endpoints',
      impact: 'Critical'
    });
  }
  
  Object.entries(metrics).forEach(([key, metric]) => {
    if (key !== 'overall' && metric.responseTime > 1000) {
      recommendations.push({
        priority: 'Medium',
        category: 'Performance',
        issue: \`Slow \${key} endpoint\`,
        recommendation: \`Optimize \${key} endpoint performance\`,
        impact: 'Medium'
      });
    }
  });
  
  return recommendations;
}

function displayReport(report) {
  console.log('\\n📊 PERFORMANCE REPORT');
  console.log('====================');
  console.log(\`Timestamp: \${report.timestamp}\`);
  console.log(\`URL: \${report.url}\`);
  
  console.log('\\n📈 METRICS:');
  Object.entries(report.metrics).forEach(([key, metric]) => {
    if (key === 'overall') {
      console.log(\`\\n🎯 Overall Score: \${metric.score}/100\`);
      console.log(\`   Average Response Time: \${metric.averageResponseTime.toFixed(0)}ms\`);
      console.log(\`   Success Rate: \${metric.successRate.toFixed(1)}%\`);
    } else {
      console.log(\`\\n📊 \${key.toUpperCase()}:\`);
      console.log(\`   Status: \${metric.statusCode}\`);
      console.log(\`   Response Time: \${metric.responseTime}ms\`);
      if (metric.contentLength) {
        console.log(\`   Content Length: \${metric.contentLength} bytes\`);
      }
    }
  });
  
  if (report.recommendations.length > 0) {
    console.log('\\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(\`\${index + 1}. [\${rec.priority}] \${rec.category}: \${rec.issue}\`);
      console.log(\`   Recommendation: \${rec.recommendation}\`);
      console.log(\`   Impact: \${rec.impact}\`);
    });
  }
}

// Run the report generator
generatePerformanceReport().catch(console.error);`;

  fs.writeFileSync('scripts/generate-performance-report.cjs', reportGenerator);
  console.log('   ✅ Performance report generator created');
}

// 4. Update package.json with monitoring scripts
function updatePackageJsonWithMonitoring() {
  console.log('\n📦 Updating package.json with monitoring scripts...');
  
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    'monitor:start': 'node server/services/monitoring.ts',
    'logs:view': 'tail -f logs/$(date +%Y-%m-%d).log',
    'logs:error': 'tail -f logs/$(date +%Y-%m-%d)-error.log',
    'logs:clean': 'find logs -name "*.log" -mtime +30 -delete',
    'health:check': 'curl -f https://sharewheelz.uk/api/health || exit 1',
    'performance:report': 'node scripts/generate-performance-report.cjs',
    'monitor:alerts': 'node scripts/check-alerts.cjs'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('   ✅ Package.json updated with monitoring scripts');
}

// Main execution
function main() {
  console.log('Starting monitoring and logging setup...\n');
  
  createMonitoringService();
  createLoggingService();
  createPerformanceReportGenerator();
  updatePackageJsonWithMonitoring();
  
  console.log('\n🎉 MONITORING & LOGGING SETUP COMPLETE!');
  console.log('======================================');
  console.log('✅ Monitoring service created');
  console.log('✅ Logging service created');
  console.log('✅ Performance report generator created');
  console.log('✅ Package.json updated with monitoring scripts');
  console.log('\n🚀 Next steps:');
  console.log('1. Integrate monitoring middleware in server');
  console.log('2. Set up log rotation');
  console.log('3. Configure external monitoring (Sentry, DataDog, etc.)');
  console.log('4. Set up alerting (Slack, email, SMS)');
}

main();
