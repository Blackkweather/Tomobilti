#!/usr/bin/env node

/**
 * CI/CD Status Check
 * Quick check of CI/CD pipeline health
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🔍 CI/CD Status Check\n');

const checks = [
  {
    name: 'Package.json exists',
    check: () => existsSync('package.json'),
    critical: true
  },
  {
    name: 'ESLint config exists',
    check: () => existsSync('eslint.config.js'),
    critical: true
  },
  {
    name: 'TypeScript config exists',
    check: () => existsSync('tsconfig.json'),
    critical: true
  },
  {
    name: 'Vite config exists',
    check: () => existsSync('vite.config.ts'),
    critical: true
  },
  {
    name: 'GitHub Actions workflows exist',
    check: () => existsSync('.github/workflows/ci.yml') && existsSync('.github/workflows/ci-cd.yml'),
    critical: true
  },
  {
    name: 'Render config exists',
    check: () => existsSync('render.yaml'),
    critical: true
  },
  {
    name: 'Build script works',
    check: () => {
      try {
        execSync('npm run build', { stdio: 'pipe' });
        return existsSync('dist/index.js') && existsSync('dist/public/index.html');
      } catch {
        return false;
      }
    },
    critical: true
  }
];

let passed = 0;
let failed = 0;
let criticalFailed = false;

for (const check of checks) {
  try {
    const result = check.check();
    if (result) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
      if (check.critical) {
        criticalFailed = true;
      }
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${check.name} - Error: ${error.message}`);
    if (check.critical) {
      criticalFailed = true;
    }
    failed++;
  }
}

console.log(`\n📊 Status: ${passed} passed, ${failed} failed`);
console.log(`🎯 Critical: ${criticalFailed ? 'FAILED' : 'PASSED'}`);

if (criticalFailed) {
  console.log('\n🚨 CI/CD pipeline has critical issues');
  process.exit(1);
} else {
  console.log('\n🎉 CI/CD pipeline is healthy!');
  process.exit(0);
}
