import { beforeAll, afterAll } from 'vitest';

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'file:./test.db';
  process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
  process.env.ENABLE_MOCK_SERVICES = 'true';
  
  console.log('🧪 Setting up test environment...');
});

afterAll(async () => {
  // Cleanup test artifacts
  const fs = await import('fs');
  const testDbPath = './test.db';
  
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
    console.log('✅ Cleaned up test database');
  }
});
