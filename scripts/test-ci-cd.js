#!/usr/bin/env node

/**
 * CI/CD Test Script
 * Tests the complete build and deployment process
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

console.log('🚀 Testing CI/CD Pipeline...\n');

const tests = [
  {
    name: 'Install Dependencies',
    command: 'npm install --legacy-peer-deps',
    critical: true
  },
  {
    name: 'ESLint Check',
    command: 'npm run lint',
    critical: false
  },
  {
    name: 'TypeScript Check',
    command: 'npm run typecheck',
    critical: false
  },
  {
    name: 'Build Application',
    command: 'npm run build',
    critical: true
  },
  {
    name: 'Check Build Output',
    check: () => {
      const distExists = existsSync('dist/index.js');
      const publicExists = existsSync('dist/public/index.html');
      return distExists && publicExists;
    },
    critical: true
  }
];

let passed = 0;
let failed = 0;
let criticalFailed = false;

for (const test of tests) {
  try {
    console.log(`📋 ${test.name}...`);
    
    if (test.command) {
      execSync(test.command, { stdio: 'pipe' });
    }
    
    if (test.check) {
      const result = test.check();
      if (!result) {
        throw new Error('Check failed');
      }
    }
    
    console.log(`✅ ${test.name} - PASSED\n`);
    passed++;
  } catch (error) {
    console.log(`❌ ${test.name} - FAILED`);
    if (test.critical) {
      console.log(`   CRITICAL ERROR: ${error.message}\n`);
      criticalFailed = true;
    } else {
      console.log(`   Non-critical: ${error.message}\n`);
    }
    failed++;
  }
}

console.log('📊 CI/CD Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`🎯 Critical: ${criticalFailed ? 'FAILED' : 'PASSED'}`);

if (criticalFailed) {
  console.log('\n🚨 CRITICAL ERRORS FOUND - CI/CD will fail');
  process.exit(1);
} else {
  console.log('\n🎉 CI/CD Pipeline is ready!');
  process.exit(0);
}
