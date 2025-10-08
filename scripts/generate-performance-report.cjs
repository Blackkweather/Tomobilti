#!/usr/bin/env node

/**
 * ShareWheelz Performance Report Generator
 * Generates comprehensive performance reports
 */

const https = require('https');
const fs = require('fs');

console.log('📊 ShareWheelz Performance Report Generator');
console.log('===========================================
');

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
  const reportPath = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Display report
  displayReport(report);

  console.log(`\n📄 Report saved to: ${reportPath}`);
}

function testEndpointPerformance(path) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = `https://sharewheelz.uk${path}`;
    
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
        issue: `Slow ${key} endpoint`,
        recommendation: `Optimize ${key} endpoint performance`,
        impact: 'Medium'
      });
    }
  });
  
  return recommendations;
}

function displayReport(report) {
  console.log('\n📊 PERFORMANCE REPORT');
  console.log('====================');
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`URL: ${report.url}`);
  
  console.log('\n📈 METRICS:');
  Object.entries(report.metrics).forEach(([key, metric]) => {
    if (key === 'overall') {
      console.log(`\n🎯 Overall Score: ${metric.score}/100`);
      console.log(`   Average Response Time: ${metric.averageResponseTime.toFixed(0)}ms`);
      console.log(`   Success Rate: ${metric.successRate.toFixed(1)}%`);
    } else {
      console.log(`\n📊 ${key.toUpperCase()}:`);
      console.log(`   Status: ${metric.statusCode}`);
      console.log(`   Response Time: ${metric.responseTime}ms`);
      if (metric.contentLength) {
        console.log(`   Content Length: ${metric.contentLength} bytes`);
      }
    }
  });
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.priority}] ${rec.category}: ${rec.issue}`);
      console.log(`   Recommendation: ${rec.recommendation}`);
      console.log(`   Impact: ${rec.impact}`);
    });
  }
}

// Run the report generator
generatePerformanceReport().catch(console.error);