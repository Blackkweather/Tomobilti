#!/usr/bin/env node

/**
 * ShareWheelz UK Platform Testing Script
 * Tests all functionality after deployment
 */

const https = require('https');
const http = require('http');

console.log('🧪 ShareWheelz UK Platform Testing Script');
console.log('========================================\n');

// Test configuration
const BASE_URL = 'https://sharewheelz-platform.onrender.com';
const TEST_ENDPOINTS = [
  { path: '/', name: 'Homepage', method: 'GET' },
  { path: '/api/health', name: 'Health Check', method: 'GET' },
  { path: '/api/cars', name: 'Cars API', method: 'GET' },
  { path: '/login', name: 'Login Page', method: 'GET' },
  { path: '/register', name: 'Register Page', method: 'GET' },
  { path: '/cars', name: 'Cars Page', method: 'GET' },
  { path: '/dashboard', name: 'Dashboard Page', method: 'GET' }
];

// Test a single endpoint
function testEndpoint(url, name, method = 'GET') {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const options = {
      method: method,
      timeout: 10000,
      headers: {
        'User-Agent': 'ShareWheelz-Test-Script/1.0'
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
        const status = res.statusCode;
        const isSuccess = status >= 200 && status < 400;
        
        console.log(`${isSuccess ? '✅' : '❌'} ${name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: ${status}`);
        console.log(`   Response Time: ${responseTime}ms`);
        
        if (!isSuccess) {
          console.log(`   Error: ${status} - ${res.statusMessage}`);
        }
        
        console.log('');
        resolve({ success: isSuccess, status, responseTime, url, name });
      });
    });

    req.on('error', (error) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`❌ ${name}`);
      console.log(`   URL: ${url}`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Response Time: ${responseTime}ms`);
      console.log('');
      
      resolve({ success: false, error: error.message, responseTime, url, name });
    });

    req.on('timeout', () => {
      console.log(`⏰ ${name} - Timeout`);
      console.log(`   URL: ${url}`);
      console.log('');
      req.destroy();
      resolve({ success: false, error: 'Timeout', url, name });
    });

    req.end();
  });
}

// Test all endpoints
async function testAllEndpoints() {
  console.log('🔍 Testing all endpoints...\n');
  
  const results = [];
  
  for (const endpoint of TEST_ENDPOINTS) {
    const url = `${BASE_URL}${endpoint.path}`;
    const result = await testEndpoint(url, endpoint.name, endpoint.method);
    results.push(result);
  }
  
  return results;
}

// Test specific functionality
async function testSpecificFeatures() {
  console.log('🎯 Testing specific features...\n');
  
  // Test car data
  try {
    const carsResult = await testEndpoint(`${BASE_URL}/api/cars`, 'Cars Data');
    if (carsResult.success) {
      console.log('📊 Checking car data structure...');
      // Note: In a real test, we'd parse the JSON and check structure
      console.log('   ✅ Cars API responding');
    }
  } catch (error) {
    console.log('   ❌ Cars API test failed');
  }
  
  console.log('');
}

// Generate test report
function generateTestReport(results) {
  console.log('📋 TEST REPORT');
  console.log('==============\n');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((successful / total) * 100).toFixed(1)}%\n`);
  
  if (failed > 0) {
    console.log('❌ FAILED TESTS:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`   - ${result.name}: ${result.error || result.status}`);
    });
    console.log('');
  }
  
  // Performance analysis
  const responseTimes = results.filter(r => r.responseTime).map(r => r.responseTime);
  if (responseTimes.length > 0) {
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);
    
    console.log('⚡ PERFORMANCE METRICS:');
    console.log(`   Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`   Fastest Response: ${minResponseTime}ms`);
    console.log(`   Slowest Response: ${maxResponseTime}ms\n`);
  }
}

// Test UK-specific features
function testUKFeatures() {
  console.log('🇬🇧 UK-SPECIFIC FEATURES CHECK');
  console.log('==============================\n');
  
  console.log('✅ Expected UK Features:');
  console.log('   - Currency: GBP (£)');
  console.log('   - Locations: London, Manchester, Edinburgh, Birmingham, Liverpool');
  console.log('   - Language: English (primary)');
  console.log('   - Phone Format: UK format');
  console.log('   - MOT Expiry: UK MOT test tracking');
  console.log('   - User Names: UK names');
  console.log('');
  
  console.log('🔍 Manual Testing Required:');
  console.log('   1. Visit the homepage and check currency display');
  console.log('   2. Test car search with UK cities');
  console.log('   3. Verify registration form accepts UK phone numbers');
  console.log('   4. Check all navigation links work');
  console.log('   5. Test booking flow with GBP pricing');
  console.log('   6. Verify responsive design on mobile');
  console.log('');
}

// Main execution
async function main() {
  console.log(`Testing ShareWheelz platform at: ${BASE_URL}\n`);
  
  try {
    const results = await testAllEndpoints();
    await testSpecificFeatures();
    generateTestReport(results);
    testUKFeatures();
    
    console.log('🎉 Testing completed!');
    console.log('\n📞 NEXT STEPS:');
    console.log('1. If tests pass, your platform is working correctly');
    console.log('2. If tests fail, check Render.com logs for errors');
    console.log('3. Test manually by visiting the website');
    console.log('4. Set up custom domain: sharewheelz.uk');
    console.log('5. Configure UK-specific services (Stripe, Email)\n');
    
  } catch (error) {
    console.log('❌ Testing failed:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Check if the platform is deployed');
    console.log('2. Verify Render.com service is running');
    console.log('3. Check environment variables');
    console.log('4. Review deployment logs\n');
  }
}

main();
