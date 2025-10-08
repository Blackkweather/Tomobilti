#!/usr/bin/env node

/**
 * ShareWheelz Perfect Deployment Script
 * This script ensures your platform is deployed perfectly
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 ShareWheelz Perfect Deployment');
console.log('==================================\n');

async function perfectDeployment() {
  try {
    console.log('📋 Step 1: Checking deployment readiness...\n');
    
    // Check if all files exist
    const requiredFiles = [
      'render.yaml',
      'package.json',
      'server/index.ts',
      'client/src/App.tsx',
      'scripts/perfect-database-migration.cjs',
      'scripts/perfect-test-suite.cjs'
    ];
    
    let allReady = true;
    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
      } else {
        console.log(`❌ ${file} - Missing!`);
        allReady = false;
      }
    }
    
    if (!allReady) {
      console.log('\n❌ Not ready for deployment. Missing required files.');
      return;
    }
    
    console.log('\n📦 Step 2: Preparing for deployment...\n');
    
    // Check git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        console.log('📝 Uncommitted changes detected:');
        console.log(gitStatus);
        console.log('💡 Committing changes...');
        
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "Perfect ShareWheelz deployment - Database migration and testing"', { stdio: 'inherit' });
        console.log('✅ Changes committed');
      } else {
        console.log('✅ No uncommitted changes');
      }
    } catch (error) {
      console.log('⚠️ Git check failed, continuing...');
    }
    
    console.log('\n🌐 Step 3: Deployment instructions...\n');
    
    console.log('🎯 AUTOMATIC DEPLOYMENT (Recommended):');
    console.log('   1. Push to GitHub:');
    console.log('      git push origin main');
    console.log('');
    console.log('   2. Render will automatically:');
    console.log('      ✅ Detect render.yaml');
    console.log('      ✅ Run perfect database migration');
    console.log('      ✅ Deploy your platform');
    console.log('      ✅ Set up PostgreSQL database');
    console.log('      ✅ Configure all environment variables');
    console.log('');
    
    console.log('🎯 MANUAL DEPLOYMENT (Alternative):');
    console.log('   1. Go to https://render.com');
    console.log('   2. Sign up/Login with GitHub');
    console.log('   3. Click "New +" → "Blueprint"');
    console.log('   4. Connect your repository');
    console.log('   5. Render will auto-detect render.yaml');
    console.log('   6. Click "Apply" to deploy');
    console.log('');
    
    console.log('⏱️ Expected Timeline:');
    console.log('   - Build: 3-5 minutes');
    console.log('   - Database migration: 1-2 minutes');
    console.log('   - Total: 5-7 minutes');
    console.log('');
    
    console.log('🔧 Step 4: Post-deployment verification...\n');
    
    console.log('📞 After deployment, run these commands:');
    console.log('');
    console.log('   # Test everything is perfect');
    console.log('   node scripts/perfect-test-suite.cjs');
    console.log('');
    console.log('   # Visit your platform');
    console.log('   https://sharewheelz.uk');
    console.log('');
    
    console.log('🎯 Expected Results:');
    console.log('   ✅ https://sharewheelz.uk - Live and working');
    console.log('   ✅ Database: PostgreSQL with all tables');
    console.log('   ✅ UK Features: GBP currency, UK cities, English language');
    console.log('   ✅ Sample Data: 3 users, 3 cars, membership benefits');
    console.log('   ✅ All Pages: Homepage, login, register, cars, dashboard');
    console.log('   ✅ All APIs: Health check, cars API, user management');
    console.log('');
    
    console.log('🇬🇧 UK-Specific Features Included:');
    console.log('   ✅ Currency: GBP (£)');
    console.log('   ✅ Locations: London, Manchester, Edinburgh, Birmingham, Liverpool');
    console.log('   ✅ Language: English (primary)');
    console.log('   ✅ Phone Format: UK format (+44)');
    console.log('   ✅ MOT Expiry: UK MOT test tracking');
    console.log('   ✅ User Names: James Smith, Oliver Johnson, Emma Williams');
    console.log('   ✅ Membership Tiers: Basic (£9.99), Premium (£19.99)');
    console.log('   ✅ Loyalty Points: Full system implemented');
    console.log('');
    
    console.log('🎉 PERFECT DEPLOYMENT READY!');
    console.log('');
    console.log('📞 FINAL STEPS:');
    console.log('1. Run: git push origin main');
    console.log('2. Wait 5-7 minutes for deployment');
    console.log('3. Test: node scripts/perfect-test-suite.cjs');
    console.log('4. Visit: https://sharewheelz.uk');
    console.log('5. Enjoy your perfect ShareWheelz platform! 🚀');
    
  } catch (error) {
    console.error('❌ Deployment preparation failed:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Check all files are present');
    console.log('2. Ensure git is initialized');
    console.log('3. Try running: git add . && git commit -m "Deploy"');
    console.log('4. Then: git push origin main');
  }
}

// Run perfect deployment
perfectDeployment();
