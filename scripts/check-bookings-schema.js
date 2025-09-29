import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Checking bookings table schema...');

try {
  // Check the bookings table structure
  const tableInfo = db.prepare("PRAGMA table_info(bookings)").all();
  console.log('Bookings table columns:');
  tableInfo.forEach(col => {
    console.log(`- ${col.name} (${col.type})`);
  });
  
  // Also check if there are any existing bookings
  const existingBookings = db.prepare('SELECT * FROM bookings LIMIT 3').all();
  console.log(`\nExisting bookings: ${existingBookings.length}`);
  if (existingBookings.length > 0) {
    console.log('Sample booking structure:');
    console.log(JSON.stringify(existingBookings[0], null, 2));
  }
  
} catch (error) {
  console.error('❌ Error checking schema:', error.message);
} finally {
  db.close();
}

console.log('\nSchema check completed!');

