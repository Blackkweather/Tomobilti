#!/usr/bin/env node

/**
 * ShareWheelz Deployment Monitor
 * Monitors deployment status and provides real-time updates
 */

const https = require('https');
const fs = require('fs');

class DeploymentMonitor {
  constructor() {
    this.serviceUrl = 'https://sharewheelz.uk';
    this.apiUrl = 'https://sharewheelz.uk/api';
    this.checkInterval = 30000; // 30 seconds
    this.isMonitoring = false;
  }

  async checkHealth() {
    try {
      const healthCheck = await this.makeRequest('/api/health');
      return {
        status: 'healthy',
        responseTime: healthCheck.responseTime,
        data: healthCheck.data
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  async checkCars() {
    try {
      const carsResponse = await this.makeRequest('/api/cars');
      return {
        status: 'success',
        count: carsResponse.data?.cars?.length || 0,
        data: carsResponse.data
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  async checkDatabase() {
    try {
      const dbResponse = await this.makeRequest('/api/debug/database');
      return {
        status: 'connected',
        data: dbResponse.data
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message
      };
    }
  }

  async makeRequest(path) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const url = `${this.serviceUrl}${path}`;
      
      const options = {
        method: 'GET',
        headers: {
          'User-Agent': 'ShareWheelz-Monitor/1.0',
          'Accept': 'application/json'
        },
        timeout: 10000
      };

      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          try {
            const parsed = JSON.parse(data);
            resolve({
              statusCode: res.statusCode,
              data: parsed,
              responseTime
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              data: data,
              responseTime
            });
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
      req.end();
    });
  }

  async runFullCheck() {
    console.log('🔍 Running full deployment check...\n');
    
    const timestamp = new Date().toISOString();
    console.log(`⏰ Check Time: ${timestamp}`);
    console.log('=' .repeat(50));

    // Health check
    console.log('🏥 Health Check:');
    const health = await this.checkHealth();
    if (health.status === 'healthy') {
      console.log(`✅ Service is healthy (${health.responseTime}ms)`);
      if (health.data) {
        console.log(`   - Uptime: ${health.data.uptime || 'Unknown'}`);
        console.log(`   - Memory: ${health.data.memoryUsage || 'Unknown'}`);
        console.log(`   - Version: ${health.data.version || 'Unknown'}`);
      }
    } else {
      console.log(`❌ Service is unhealthy: ${health.error}`);
    }

    // Cars check
    console.log('\n🚗 Cars API Check:');
    const cars = await this.checkCars();
    if (cars.status === 'success') {
      console.log(`✅ Cars API working (${cars.count} cars available)`);
      if (cars.count === 6) {
        console.log('🎉 All 6 cars are available!');
      } else if (cars.count < 6) {
        console.log(`⚠️ Only ${cars.count} cars available (expected 6)`);
      }
    } else {
      console.log(`❌ Cars API error: ${cars.error}`);
    }

    // Database check
    console.log('\n🗄️ Database Check:');
    const database = await this.checkDatabase();
    if (database.status === 'connected') {
      console.log('✅ Database is connected');
      if (database.data) {
        console.log(`   - Users: ${database.data.users || 0}`);
        console.log(`   - Cars: ${database.data.cars || 0}`);
      }
    } else {
      console.log(`❌ Database error: ${database.error}`);
    }

    // Performance check
    console.log('\n⚡ Performance Check:');
    const performance = await this.checkPerformance();
    if (performance.status === 'good') {
      console.log(`✅ Performance is good (avg: ${performance.avgResponseTime}ms)`);
    } else {
      console.log(`⚠️ Performance issues: ${performance.message}`);
    }

    console.log('\n' + '=' .repeat(50));
    return {
      timestamp,
      health,
      cars,
      database,
      performance
    };
  }

  async checkPerformance() {
    const endpoints = [
      '/',
      '/api/cars',
      '/api/health',
      '/login',
      '/register'
    ];

    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        await this.makeRequest(endpoint);
        const responseTime = Date.now() - startTime;
        results.push({ endpoint, responseTime, status: 'success' });
      } catch (error) {
        results.push({ endpoint, responseTime: 0, status: 'error', error: error.message });
      }
    }

    const successfulRequests = results.filter(r => r.status === 'success');
    const avgResponseTime = successfulRequests.length > 0 
      ? successfulRequests.reduce((sum, r) => sum + r.responseTime, 0) / successfulRequests.length
      : 0;

    const failedRequests = results.filter(r => r.status === 'error');

    return {
      status: failedRequests.length === 0 && avgResponseTime < 1000 ? 'good' : 'poor',
      avgResponseTime: Math.round(avgResponseTime),
      results,
      failedRequests: failedRequests.length,
      message: failedRequests.length > 0 
        ? `${failedRequests.length} endpoints failed`
        : avgResponseTime > 1000 
          ? 'Response times are slow'
          : 'All endpoints responding well'
    };
  }

  startMonitoring() {
    if (this.isMonitoring) {
      console.log('⚠️ Monitoring is already running');
      return;
    }

    console.log('🚀 Starting ShareWheelz deployment monitoring...');
    console.log(`⏰ Check interval: ${this.checkInterval / 1000} seconds`);
    console.log('Press Ctrl+C to stop monitoring\n');

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.runFullCheck();
        console.log(`\n⏳ Next check in ${this.checkInterval / 1000} seconds...\n`);
      } catch (error) {
        console.error('❌ Monitoring error:', error.message);
      }
    }, this.checkInterval);

    // Initial check
    this.runFullCheck();
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.isMonitoring = false;
      console.log('🛑 Monitoring stopped');
    }
  }

  async generateReport() {
    console.log('📊 Generating deployment report...\n');
    
    const report = await this.runFullCheck();
    
    const reportData = {
      timestamp: report.timestamp,
      service: 'ShareWheelz UK',
      url: this.serviceUrl,
      checks: {
        health: report.health,
        cars: report.cars,
        database: report.database,
        performance: report.performance
      },
      summary: {
        overallStatus: this.getOverallStatus(report),
        criticalIssues: this.getCriticalIssues(report),
        recommendations: this.getRecommendations(report)
      }
    };

    // Save report to file
    const reportFile = `deployment-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
    
    console.log(`📄 Report saved to: ${reportFile}`);
    console.log('\n📋 Summary:');
    console.log(`   Overall Status: ${reportData.summary.overallStatus}`);
    console.log(`   Critical Issues: ${reportData.summary.criticalIssues.length}`);
    console.log(`   Recommendations: ${reportData.summary.recommendations.length}`);

    return reportData;
  }

  getOverallStatus(report) {
    const issues = [];
    if (report.health.status !== 'healthy') issues.push('Health');
    if (report.cars.status !== 'success') issues.push('Cars API');
    if (report.database.status !== 'connected') issues.push('Database');
    if (report.performance.status !== 'good') issues.push('Performance');

    if (issues.length === 0) return '✅ Excellent';
    if (issues.length <= 2) return '⚠️ Good with issues';
    return '❌ Needs attention';
  }

  getCriticalIssues(report) {
    const issues = [];
    if (report.health.status !== 'healthy') {
      issues.push('Service health check failed');
    }
    if (report.cars.count < 6) {
      issues.push(`Only ${report.cars.count} cars available (expected 6)`);
    }
    if (report.database.status !== 'connected') {
      issues.push('Database connection failed');
    }
    if (report.performance.avgResponseTime > 2000) {
      issues.push('Response times are too slow');
    }
    return issues;
  }

  getRecommendations(report) {
    const recommendations = [];
    if (report.performance.avgResponseTime > 1000) {
      recommendations.push('Consider implementing CDN for better performance');
    }
    if (report.cars.count < 6) {
      recommendations.push('Run car fix script to ensure all cars are available');
    }
    if (report.database.status !== 'connected') {
      recommendations.push('Check database connection and run migrations');
    }
    return recommendations;
  }
}

// Command line interface
const command = process.argv[2];

async function main() {
  const monitor = new DeploymentMonitor();

  switch (command) {
    case 'check':
      await monitor.runFullCheck();
      break;
    
    case 'monitor':
      monitor.startMonitoring();
      // Handle graceful shutdown
      process.on('SIGINT', () => {
        monitor.stopMonitoring();
        process.exit(0);
      });
      break;
    
    case 'report':
      await monitor.generateReport();
      break;
    
    case 'help':
    default:
      console.log('🔍 ShareWheelz Deployment Monitor');
      console.log('==================================');
      console.log('Available commands:');
      console.log('  check    - Run single deployment check');
      console.log('  monitor  - Start continuous monitoring');
      console.log('  report   - Generate detailed report');
      console.log('  help     - Show this help');
      console.log('');
      console.log('Examples:');
      console.log('  node deployment-monitor.cjs check');
      console.log('  node deployment-monitor.cjs monitor');
      console.log('  node deployment-monitor.cjs report');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DeploymentMonitor };
