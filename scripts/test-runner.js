#!/usr/bin/env node

/**
 * Test Runner Script for Tomobilti Platform
 * Runs all tests with proper environment setup
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Test environment setup
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.ENABLE_MOCK_SERVICES = 'true';

// Clean up test database
const testDbPath = './test.db';
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
  console.log('✅ Cleaned up test database');
}

try {
  console.log('🧪 Running tests...\n');
  
  // Run Vitest with coverage
  execSync('npx vitest run --api --coverage', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('\n✅ All tests passed!');
  
} catch (error) {
  console.error('\n❌ Tests failed:', error.message);
  process.exit(1);
}
