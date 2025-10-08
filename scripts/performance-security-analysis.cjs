#!/usr/bin/env node

/**
 * ShareWheelz Performance & Security Analysis
 * Comprehensive analysis of performance, security, and optimization opportunities
 */

const https = require('https');

console.log('🔍 ShareWheelz Performance & Security Analysis');
console.log('===============================================\n');

const ANALYSIS_RESULTS = {
  performance: { score: 0, maxScore: 0, issues: [], recommendations: [] },
  security: { score: 0, maxScore: 0, issues: [], recommendations: [] },
  optimization: { score: 0, maxScore: 0, issues: [], recommendations: [] }
};

// Test performance metrics
async function analyzePerformance() {
  console.log('⚡ Performance Analysis...\n');
  
  const endpoints = [
    { name: 'Homepage', path: '/' },
    { name: 'Cars Page', path: '/cars' },
    { name: 'Cars API', path: '/api/cars' },
    { name: 'Login Page', path: '/login' },
    { name: 'Register Page', path: '/register' }
  ];

  const performanceMetrics = [];

  for (const endpoint of endpoints) {
    const result = await testPerformance(endpoint);
    performanceMetrics.push(result);
  }

  // Analyze results
  const avgResponseTime = performanceMetrics.reduce((sum, r) => sum + r.responseTime, 0) / performanceMetrics.length;
  const maxResponseTime = Math.max(...performanceMetrics.map(r => r.responseTime));
  const minResponseTime = Math.min(...performanceMetrics.map(r => r.responseTime));

  console.log('📊 Performance Metrics:');
  console.log(`   Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`   Fastest Response: ${minResponseTime}ms`);
  console.log(`   Slowest Response: ${maxResponseTime}ms`);
  console.log('');

  // Score performance
  ANALYSIS_RESULTS.performance.maxScore += 30;
  if (avgResponseTime < 500) {
    ANALYSIS_RESULTS.performance.score += 30;
    console.log('🚀 Performance: EXCELLENT (< 500ms)');
  } else if (avgResponseTime < 1000) {
    ANALYSIS_RESULTS.performance.score += 25;
    console.log('✅ Performance: GOOD (< 1s)');
  } else if (avgResponseTime < 2000) {
    ANALYSIS_RESULTS.performance.score += 20;
    console.log('⚠️ Performance: FAIR (< 2s)');
  } else {
    ANALYSIS_RESULTS.performance.score += 15;
    console.log('❌ Performance: POOR (> 2s)');
  }

  // Check for performance issues
  if (avgResponseTime > 1000) {
    ANALYSIS_RESULTS.performance.issues.push('Slow response times');
    ANALYSIS_RESULTS.performance.recommendations.push('Implement caching and CDN');
  }

  if (maxResponseTime > 2000) {
    ANALYSIS_RESULTS.performance.issues.push('Some endpoints are very slow');
    ANALYSIS_RESULTS.performance.recommendations.push('Optimize slow endpoints');
  }

  console.log('');
}

// Test single endpoint performance
function testPerformance(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = `https://sharewheelz.uk${endpoint.path}`;
    
    const options = {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'ShareWheelz-Performance-Test/1.0'
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
        console.log(`${res.statusCode === 200 ? '✅' : '❌'} ${endpoint.name}: ${responseTime}ms`);
        resolve({ 
          name: endpoint.name, 
          responseTime, 
          status: res.statusCode,
          size: data.length 
        });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
      resolve({ 
        name: endpoint.name, 
        responseTime: 10000, 
        status: 0, 
        error: error.message 
      });
    });

    req.on('timeout', () => {
      console.log(`⏰ ${endpoint.name}: Timeout`);
      req.destroy();
      resolve({ 
        name: endpoint.name, 
        responseTime: 10000, 
        status: 0, 
        error: 'Timeout' 
      });
    });

    req.end();
  });
}

// Analyze security
async function analyzeSecurity() {
  console.log('🔒 Security Analysis...\n');
  
  // Test SSL Certificate
  const sslResult = await testSSLCertificate();
  
  ANALYSIS_RESULTS.security.maxScore += 20;
  if (sslResult.valid) {
    ANALYSIS_RESULTS.security.score += 20;
    console.log('✅ SSL Certificate: Valid');
    console.log(`   Issuer: ${sslResult.issuer}`);
    console.log(`   Protocol: ${sslResult.protocol}`);
  } else {
    ANALYSIS_RESULTS.security.issues.push('Invalid SSL certificate');
    ANALYSIS_RESULTS.security.recommendations.push('Fix SSL certificate');
    console.log('❌ SSL Certificate: Invalid');
  }
  
  console.log('');
  
  // Test security headers
  const headersResult = await testSecurityHeaders();
  
  ANALYSIS_RESULTS.security.maxScore += 20;
  if (headersResult.score >= 15) {
    ANALYSIS_RESULTS.security.score += 20;
    console.log('✅ Security Headers: Good');
  } else if (headersResult.score >= 10) {
    ANALYSIS_RESULTS.security.score += 15;
    console.log('⚠️ Security Headers: Fair');
  } else {
    ANALYSIS_RESULTS.security.score += 10;
    console.log('❌ Security Headers: Poor');
  }
  
  console.log('');
  
  // Test API security
  const apiSecurityResult = await testAPISecurity();
  
  ANALYSIS_RESULTS.security.maxScore += 20;
  if (apiSecurityResult.score >= 15) {
    ANALYSIS_RESULTS.security.score += 20;
    console.log('✅ API Security: Good');
  } else if (apiSecurityResult.score >= 10) {
    ANALYSIS_RESULTS.security.score += 15;
    console.log('⚠️ API Security: Fair');
  } else {
    ANALYSIS_RESULTS.security.score += 10;
    console.log('❌ API Security: Poor');
  }
  
  console.log('');
}

// Test SSL certificate
function testSSLCertificate() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'sharewheelz.uk',
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      const cert = res.connection.getPeerCertificate();
      const result = {
        valid: cert && cert.valid_to && new Date(cert.valid_to) > new Date(),
        issuer: cert ? cert.issuer.CN : 'Unknown',
        protocol: res.connection.getProtocol()
      };
      resolve(result);
    });

    req.on('error', (error) => {
      resolve({ valid: false, error: error.message });
    });

    req.end();
  });
}

// Test security headers
async function testSecurityHeaders() {
  const headers = await getHeaders('https://sharewheelz.uk/');
  let score = 0;
  
  const securityHeaders = [
    { name: 'Strict-Transport-Security', weight: 5 },
    { name: 'X-Content-Type-Options', weight: 3 },
    { name: 'X-Frame-Options', weight: 3 },
    { name: 'X-XSS-Protection', weight: 2 },
    { name: 'Content-Security-Policy', weight: 4 },
    { name: 'Referrer-Policy', weight: 2 }
  ];
  
  console.log('🔍 Security Headers:');
  for (const header of securityHeaders) {
    if (headers[header.name.toLowerCase()]) {
      score += header.weight;
      console.log(`   ✅ ${header.name}`);
    } else {
      console.log(`   ❌ ${header.name}`);
      ANALYSIS_RESULTS.security.issues.push(`Missing ${header.name} header`);
      ANALYSIS_RESULTS.security.recommendations.push(`Add ${header.name} header`);
    }
  }
  
  return { score, headers };
}

// Test API security
async function testAPISecurity() {
  let score = 0;
  
  console.log('🔍 API Security Tests:');
  
  // Test protected endpoints
  const protectedEndpoints = [
    { path: '/api/admin/users', expectedStatus: 401 },
    { path: '/api/bookings', expectedStatus: 401 }
  ];
  
  for (const endpoint of protectedEndpoints) {
    const result = await testEndpoint(`https://sharewheelz.uk${endpoint.path}`, endpoint.expectedStatus);
    if (result.status === endpoint.expectedStatus) {
      score += 10;
      console.log(`   ✅ ${endpoint.path}: Properly protected`);
    } else {
      console.log(`   ❌ ${endpoint.path}: Not properly protected`);
      ANALYSIS_RESULTS.security.issues.push(`${endpoint.path} not properly protected`);
      ANALYSIS_RESULTS.security.recommendations.push(`Secure ${endpoint.path} endpoint`);
    }
  }
  
  return { score };
}

// Test single endpoint
function testEndpoint(url, expectedStatus) {
  return new Promise((resolve) => {
    const options = {
      method: 'GET',
      timeout: 5000,
      headers: {
        'User-Agent': 'ShareWheelz-Security-Test/1.0'
      }
    };

    const req = https.request(url, options, (res) => {
      resolve({ status: res.statusCode });
    });

    req.on('error', () => {
      resolve({ status: 0 });
    });

    req.end();
  });
}

// Get headers
function getHeaders(url) {
  return new Promise((resolve) => {
    const options = {
      method: 'HEAD',
      timeout: 5000
    };

    const req = https.request(url, options, (res) => {
      resolve(res.headers);
    });

    req.on('error', () => {
      resolve({});
    });

    req.end();
  });
}

// Analyze optimization opportunities
function analyzeOptimization() {
  console.log('🚀 Optimization Analysis...\n');
  
  ANALYSIS_RESULTS.optimization.maxScore += 25;
  
  console.log('📋 Optimization Opportunities:');
  
  // Performance optimizations
  const optimizations = [
    {
      name: 'Image Optimization',
      description: 'Implement WebP format and lazy loading',
      impact: 'High',
      effort: 'Medium'
    },
    {
      name: 'CDN Implementation',
      description: 'Use CloudFlare or AWS CloudFront',
      impact: 'High',
      effort: 'Low'
    },
    {
      name: 'Database Indexing',
      description: 'Optimize database queries and indexes',
      impact: 'Medium',
      effort: 'Medium'
    },
    {
      name: 'Caching Strategy',
      description: 'Implement Redis caching for API responses',
      impact: 'High',
      effort: 'Medium'
    },
    {
      name: 'Code Splitting',
      description: 'Implement React code splitting',
      impact: 'Medium',
      effort: 'High'
    }
  ];
  
  for (const opt of optimizations) {
    console.log(`   📈 ${opt.name}`);
    console.log(`      Impact: ${opt.impact} | Effort: ${opt.effort}`);
    console.log(`      ${opt.description}`);
    console.log('');
    
    ANALYSIS_RESULTS.optimization.recommendations.push(`${opt.name}: ${opt.description}`);
  }
  
  ANALYSIS_RESULTS.optimization.score += 20; // Good optimization opportunities identified
}

// Generate comprehensive report
function generateAnalysisReport() {
  console.log('📋 COMPREHENSIVE ANALYSIS REPORT');
  console.log('==================================\n');
  
  const categories = [
    { name: 'Performance', data: ANALYSIS_RESULTS.performance },
    { name: 'Security', data: ANALYSIS_RESULTS.security },
    { name: 'Optimization', data: ANALYSIS_RESULTS.optimization }
  ];
  
  let totalScore = 0;
  let totalMaxScore = 0;
  
  for (const category of categories) {
    const score = category.data.score;
    const maxScore = category.data.maxScore;
    const percentage = maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 0;
    
    totalScore += score;
    totalMaxScore += maxScore;
    
    console.log(`${category.name}: ${score}/${maxScore} (${percentage}%)`);
    
    if (category.data.issues.length > 0) {
      console.log(`   Issues: ${category.data.issues.length}`);
      category.data.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
    
    if (category.data.recommendations.length > 0) {
      console.log(`   Recommendations: ${category.data.recommendations.length}`);
      category.data.recommendations.slice(0, 3).forEach(rec => {
        console.log(`   - ${rec}`);
      });
    }
    console.log('');
  }
  
  const overallPercentage = totalMaxScore > 0 ? ((totalScore / totalMaxScore) * 100).toFixed(1) : 0;
  
  console.log(`🎯 OVERALL SCORE: ${totalScore}/${totalMaxScore} (${overallPercentage}%)`);
  console.log('');
  
  if (overallPercentage >= 85) {
    console.log('🎉 EXCELLENT! Your platform is performing exceptionally well.');
  } else if (overallPercentage >= 70) {
    console.log('✅ GOOD! Your platform is performing well with room for improvement.');
  } else if (overallPercentage >= 55) {
    console.log('⚠️ FAIR! Your platform needs attention in several areas.');
  } else {
    console.log('❌ POOR! Your platform requires significant improvements.');
  }
  
  console.log('\n📞 PRIORITY ACTIONS:');
  
  // Get all issues sorted by priority
  const allIssues = [];
  for (const category of categories) {
    for (const issue of category.data.issues) {
      allIssues.push({ category: category.name, issue });
    }
  }
  
  if (allIssues.length === 0) {
    console.log('✅ No critical issues found!');
  } else {
    allIssues.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. [${item.category}] ${item.issue}`);
    });
  }
  
  console.log('\n🚀 ENHANCEMENT RECOMMENDATIONS:');
  console.log('1. Implement CDN for faster global access');
  console.log('2. Add Redis caching for API responses');
  console.log('3. Optimize images with WebP format');
  console.log('4. Add security headers (CSP, HSTS)');
  console.log('5. Implement database query optimization');
}

// Main analysis execution
async function runAnalysis() {
  try {
    console.log('Starting comprehensive analysis of sharewheelz.uk...\n');
    
    // Analyze performance
    await analyzePerformance();
    
    // Analyze security
    await analyzeSecurity();
    
    // Analyze optimization
    analyzeOptimization();
    
    // Generate report
    generateAnalysisReport();
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

// Run the analysis
runAnalysis();
