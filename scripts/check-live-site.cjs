#!/usr/bin/env node

/**
 * ShareWheelz Live Site Diagnostic
 * Check what's causing the blank page on sharewheelz.uk
 */

const https = require('https');
const http = require('http');

console.log('🔍 ShareWheelz Live Site Diagnostic');
console.log('==================================\n');

async function checkLiveSite() {
  const urls = [
    'https://sharewheelz.uk',
    'https://www.sharewheelz.uk',
    'http://sharewheelz.uk'
  ];

  for (const url of urls) {
    console.log(`🌐 Checking: ${url}`);
    
    try {
      const response = await fetch(url);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      
      const text = await response.text();
      console.log(`   Content Length: ${text.length} characters`);
      
      if (text.length < 100) {
        console.log(`   ⚠️  Very short response - might be blank page`);
        console.log(`   Content: ${text.substring(0, 200)}`);
      } else {
        console.log(`   ✅ Response looks normal`);
        console.log(`   First 200 chars: ${text.substring(0, 200)}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

// Check common issues
console.log('🔧 Common Issues to Check:');
console.log('1. Deployment still in progress (wait 2-3 minutes)');
console.log('2. Server startup errors (check Render logs)');
console.log('3. Missing environment variables');
console.log('4. Database connection issues');
console.log('5. Build failures');
console.log('');

// Run the check
checkLiveSite().catch(console.error);

