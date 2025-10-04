import fs from 'fs';

/**
 * Setup test database
 */
export async function setupTestDatabase() {
  // Use test database URL
  process.env.DATABASE_URL = 'file:./test.db';
  
  // Ensure clean test database
  const testDbPath = './test.db';
  
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  
  console.log('✅ Test database initialized');
}
