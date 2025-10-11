import Database from 'better-sqlite3';
import path from 'path';

// Test database connection and data
async function testDatabase() {
  console.log('🔍 Testing database connection...');
  
  const dbPath = path.join(process.cwd(), 'tomobilti.db');
  const db = new Database(dbPath);
  
  try {
    // Test users
    const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
    console.log('Users in database:', users.count);
    
    // Test cars
    const cars = db.prepare('SELECT COUNT(*) as count FROM cars').get();
    console.log('Cars in database:', cars.count);
    
    // Get sample cars
    const sampleCars = db.prepare('SELECT id, title, price_per_day FROM cars LIMIT 5').all();
    console.log('Sample cars:', sampleCars);
    
    // Test the exact query the API uses
    const apiQuery = db.prepare(`
      SELECT * FROM cars 
      WHERE is_available = 1 
      ORDER BY created_at DESC 
      LIMIT 12 OFFSET 0
    `).all();
    console.log('API query result:', apiQuery.length, 'cars');
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    db.close();
  }
}

testDatabase();