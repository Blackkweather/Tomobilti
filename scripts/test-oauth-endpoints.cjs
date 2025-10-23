#!/usr/bin/env node

/**
 * OAuth Testing Script for Tomobilti
 * Tests OAuth endpoints without requiring actual OAuth provider access
 */

// Use built-in fetch for Node.js 18+ or import node-fetch
let fetch;
try {
  fetch = globalThis.fetch;
} catch (e) {
  fetch = require('node-fetch');
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

console.log('🔐 OAuth Endpoint Testing Script');
console.log('=====================================');
console.log(`Testing against: ${BASE_URL}`);
console.log('');

// Test 1: Check if OAuth routes are accessible
async function testOAuthRoutes() {
  console.log('📋 Test 1: OAuth Route Accessibility');
  console.log('-----------------------------------');
  
  const routes = [
    '/auth/google/callback',
    '/auth/facebook/callback',
    '/api/auth/google',
    '/api/auth/facebook'
  ];
  
  for (const route of routes) {
    try {
      const response = await fetch(`${BASE_URL}${route}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'OAuth-Test-Script/1.0'
        }
      });
      
      console.log(`✅ ${route}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`❌ ${route}: ${error.message}`);
    }
  }
  console.log('');
}

// Test 2: Test OAuth configuration
async function testOAuthConfig() {
  console.log('⚙️  Test 2: OAuth Configuration Check');
  console.log('------------------------------------');
  
  // Check environment variables
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'FACEBOOK_APP_ID',
    'FACEBOOK_APP_SECRET'
  ];
  
  console.log('Environment Variables:');
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const masked = varName.includes('SECRET') ? 
        `${value.substring(0, 8)}...` : 
        value;
      console.log(`✅ ${varName}: ${masked}`);
    } else {
      console.log(`❌ ${varName}: Not set`);
    }
  });
  console.log('');
}

// Test 3: Test OAuth callback with invalid data
async function testOAuthCallbacks() {
  console.log('🔄 Test 3: OAuth Callback Error Handling');
  console.log('----------------------------------------');
  
  // Test Google callback with invalid code
  try {
    const response = await fetch(`${BASE_URL}/auth/google/callback?code=invalid_code`, {
      method: 'GET'
    });
    
    console.log(`✅ Google callback (invalid code): ${response.status} ${response.statusText}`);
    
    if (response.status === 302) {
      const location = response.headers.get('location');
      console.log(`   Redirects to: ${location}`);
    }
  } catch (error) {
    console.log(`❌ Google callback test failed: ${error.message}`);
  }
  
  // Test Facebook callback with invalid code
  try {
    const response = await fetch(`${BASE_URL}/auth/facebook/callback?code=invalid_code`, {
      method: 'GET'
    });
    
    console.log(`✅ Facebook callback (invalid code): ${response.status} ${response.statusText}`);
    
    if (response.status === 302) {
      const location = response.headers.get('location');
      console.log(`   Redirects to: ${location}`);
    }
  } catch (error) {
    console.log(`❌ Facebook callback test failed: ${error.message}`);
  }
  console.log('');
}

// Test 4: Test OAuth API endpoints
async function testOAuthAPI() {
  console.log('🔌 Test 4: OAuth API Endpoints');
  console.log('------------------------------');
  
  // Test Google OAuth API with invalid token
  try {
    const response = await fetch(`${BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken: 'invalid_token'
      })
    });
    
    const data = await response.json();
    console.log(`✅ Google API (invalid token): ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
  } catch (error) {
    console.log(`❌ Google API test failed: ${error.message}`);
  }
  
  // Test Facebook OAuth API with invalid token
  try {
    const response = await fetch(`${BASE_URL}/api/auth/facebook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken: 'invalid_token',
        userID: 'invalid_user_id'
      })
    });
    
    const data = await response.json();
    console.log(`✅ Facebook API (invalid token): ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
  } catch (error) {
    console.log(`❌ Facebook API test failed: ${error.message}`);
  }
  console.log('');
}

// Test 5: Check frontend OAuth configuration
async function testFrontendConfig() {
  console.log('🎨 Test 5: Frontend OAuth Configuration');
  console.log('---------------------------------------');
  
  try {
    const response = await fetch(`${BASE_URL}/login`);
    const html = await response.text();
    
    // Check if OAuth buttons are present
    const hasGoogleButton = html.includes('Google') || html.includes('google');
    const hasFacebookButton = html.includes('Facebook') || html.includes('facebook');
    
    console.log(`✅ Login page accessible: ${response.status}`);
    console.log(`✅ Google button present: ${hasGoogleButton}`);
    console.log(`✅ Facebook button present: ${hasFacebookButton}`);
    
    // Check for OAuth JavaScript
    const hasOAuthJS = html.includes('oauth') || html.includes('google') || html.includes('facebook');
    console.log(`✅ OAuth JavaScript present: ${hasOAuthJS}`);
    
  } catch (error) {
    console.log(`❌ Frontend test failed: ${error.message}`);
  }
  console.log('');
}

// Main test runner
async function runTests() {
  console.log('Starting OAuth tests...\n');
  
  await testOAuthConfig();
  await testOAuthRoutes();
  await testOAuthCallbacks();
  await testOAuthAPI();
  await testFrontendConfig();
  
  console.log('🏁 OAuth Testing Complete!');
  console.log('===========================');
  console.log('');
  console.log('Next Steps:');
  console.log('1. Fix any missing environment variables');
  console.log('2. Test with real OAuth providers manually');
  console.log('3. Check browser console for JavaScript errors');
  console.log('4. Verify redirect URIs in OAuth provider consoles');
}

// Run the tests
runTests().catch(console.error);
