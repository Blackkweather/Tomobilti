#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Tomobilti Platform - Render Deployment Script');
console.log('===============================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if git is initialized
try {
  execSync('git status', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Error: Git repository not initialized. Please run: git init');
  process.exit(1);
}

// Check if render.yaml exists
if (!fs.existsSync('render.yaml')) {
  console.error('❌ Error: render.yaml not found. Please ensure deployment files are created.');
  process.exit(1);
}

console.log('✅ Pre-deployment checks passed\n');

// Step 1: Build the project
console.log('📦 Building project for production...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed. Please fix errors and try again.');
  process.exit(1);
}

// Step 2: Check git status
console.log('📋 Checking git status...');
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('📝 Uncommitted changes detected:');
    console.log(status);
    console.log('\n⚠️  Please commit your changes before deploying:');
    console.log('   git add .');
    console.log('   git commit -m "Prepare for deployment"');
    console.log('   git push origin main\n');
  } else {
    console.log('✅ All changes committed\n');
  }
} catch (error) {
  console.error('❌ Error checking git status:', error.message);
}

// Step 3: Display deployment instructions
console.log('🌐 Render Deployment Instructions:');
console.log('=====================================\n');

console.log('1. Go to https://render.com and sign up/login');
console.log('2. Click "New +" → "Web Service"');
console.log('3. Connect your GitHub repository');
console.log('4. Configure the service:');
console.log('   - Name: tomobilti-platform');
console.log('   - Environment: Node');
console.log('   - Build Command: npm install && npm run build');
console.log('   - Start Command: npm start');
console.log('   - Plan: Free');
console.log('\n5. Add environment variables:');
console.log('   NODE_ENV=production');
console.log('   PORT=10000');
console.log('   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production');
console.log('\n6. Click "Create Web Service"');
console.log('\n7. Create a PostgreSQL database:');
console.log('   - Click "New +" → "PostgreSQL"');
console.log('   - Name: tomobilti-db');
console.log('   - Plan: Free');
console.log('\n8. Update DATABASE_URL in your web service environment variables');

console.log('\n🎉 Your Tomobilti platform will be live at:');
console.log('   https://tomobilti-platform.onrender.com');

console.log('\n📚 For detailed instructions, see DEPLOYMENT.md');

console.log('\n✨ Deployment preparation complete!');

