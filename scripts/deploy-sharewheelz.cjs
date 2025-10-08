#!/usr/bin/env node

/**
 * ShareWheelz UK Platform Deployment Script
 * This script helps deploy ShareWheelz to production
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 ShareWheelz UK Platform Deployment Helper');
console.log('==============================================\n');

// Check if we're ready for deployment
function checkDeploymentReadiness() {
  console.log('📋 Checking deployment readiness...\n');
  
  const checks = [
    {
      name: 'render.yaml exists',
      check: () => fs.existsSync('render.yaml'),
      fix: 'Create render.yaml configuration file'
    },
    {
      name: 'package.json exists',
      check: () => fs.existsSync('package.json'),
      fix: 'Ensure package.json is present'
    },
    {
      name: 'server/index.ts exists',
      check: () => fs.existsSync('server/index.ts'),
      fix: 'Ensure server entry point exists'
    },
    {
      name: 'client/src/App.tsx exists',
      check: () => fs.existsSync('client/src/App.tsx'),
      fix: 'Ensure React app exists'
    }
  ];

  let allReady = true;
  
  checks.forEach(({ name, check, fix }) => {
    if (check()) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name} - ${fix}`);
      allReady = false;
    }
  });

  return allReady;
}

// Generate deployment instructions
function generateDeploymentInstructions() {
  console.log('\n🚀 DEPLOYMENT INSTRUCTIONS');
  console.log('==========================\n');
  
  console.log('1. 📦 Push to GitHub:');
  console.log('   git add .');
  console.log('   git commit -m "Deploy ShareWheelz UK platform"');
  console.log('   git push origin main\n');
  
  console.log('2. 🌐 Deploy on Render.com:');
  console.log('   - Go to https://render.com');
  console.log('   - Sign up/Login with GitHub');
  console.log('   - Click "New +" → "Blueprint"');
  console.log('   - Connect your GitHub repository');
  console.log('   - Render will auto-detect render.yaml\n');
  
  console.log('3. 🔧 Environment Variables (Auto-configured):');
  console.log('   ✅ NODE_ENV=production');
  console.log('   ✅ PORT=10000');
  console.log('   ✅ DATABASE_URL (from database)');
  console.log('   ✅ JWT_SECRET (auto-generated)');
  console.log('   ✅ SESSION_SECRET (auto-generated)');
  console.log('   ✅ CSRF_SECRET (auto-generated)');
  console.log('   ✅ FRONTEND_URL=https://sharewheelz-platform.onrender.com\n');
  
  console.log('4. 🗄️ Database Setup:');
  console.log('   - PostgreSQL database will be created automatically');
  console.log('   - Database name: sharewheelz');
  console.log('   - User: sharewheelz_user\n');
  
  console.log('5. 🌍 Custom Domain (Optional):');
  console.log('   - In Render Dashboard → Settings → Custom Domains');
  console.log('   - Add: sharewheelz.uk');
  console.log('   - Configure DNS records as instructed\n');
  
  console.log('6. ✅ Verify Deployment:');
  console.log('   - Visit: https://sharewheelz-platform.onrender.com');
  console.log('   - Test: Registration, Login, Car browsing');
  console.log('   - Check: All buttons and links work\n');
}

// Generate UK-specific configuration
function generateUKConfiguration() {
  console.log('\n🇬🇧 UK-SPECIFIC CONFIGURATION');
  console.log('==============================\n');
  
  console.log('✅ Already Configured:');
  console.log('   - Currency: GBP (£)');
  console.log('   - Locations: London, Manchester, Edinburgh, Birmingham, Liverpool');
  console.log('   - Language: English (with French/Arabic support)');
  console.log('   - User Names: UK names (James Smith, Oliver Johnson, Emma Williams)');
  console.log('   - Phone Format: UK format');
  console.log('   - MOT Expiry: UK MOT test tracking\n');
  
  console.log('🔧 To Configure After Deployment:');
  console.log('   - Stripe UK Account: Set up UK payment processing');
  console.log('   - Email Service: Configure SMTP for UK users');
  console.log('   - Legal Pages: Add UK-specific terms and privacy policy');
  console.log('   - Insurance: UK car rental insurance requirements\n');
}

// Main execution
function main() {
  const isReady = checkDeploymentReadiness();
  
  if (isReady) {
    console.log('\n🎉 Ready for deployment!');
    generateDeploymentInstructions();
    generateUKConfiguration();
    
    console.log('\n📞 NEXT STEPS:');
    console.log('1. Push code to GitHub');
    console.log('2. Deploy on Render.com using Blueprint');
    console.log('3. Test the platform at: https://sharewheelz-platform.onrender.com');
    console.log('4. Set up custom domain: sharewheelz.uk');
    console.log('5. Configure UK-specific services (Stripe, Email, Legal)\n');
    
    console.log('🚀 Your ShareWheelz UK platform will be live!');
  } else {
    console.log('\n❌ Not ready for deployment. Please fix the issues above.');
  }
}

main();
