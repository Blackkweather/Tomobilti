import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { users, cars, bookings, reviews } from '@shared/sqlite-schema';

async function resetDatabase() {
  try {
    console.log('🗑️  Resetting entire database...');
    
    // Connect to database
    const sqlite = new Database('./tomobilti.db');
    const db = drizzle(sqlite);
    
    // Clear all tables
    console.log('📊 Clearing all tables...');
    
    // Delete all records from each table
    await db.delete(reviews);
    console.log('✅ Cleared reviews table');
    
    await db.delete(bookings);
    console.log('✅ Cleared bookings table');
    
    await db.delete(cars);
    console.log('✅ Cleared cars table');
    
    await db.delete(users);
    console.log('✅ Cleared users table');
    
    sqlite.close();
    
    console.log('\n🎉 Database completely reset!');
    console.log('📝 All hardcoded data has been removed.');
    console.log('🚀 Your platform is now clean and ready for real users!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }
}

// Run the script
resetDatabase();
