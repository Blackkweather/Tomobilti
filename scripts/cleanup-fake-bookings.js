import Database from 'better-sqlite3';

const db = new Database('./tomobilti.db');

try {
  console.log('Cleaning up fake bookings...');
  
  // Remove all bookings that start with 'test-booking-' or 'real-booking-'
  const deleteFakeBookings = db.prepare(`
    DELETE FROM bookings 
    WHERE id LIKE 'test-booking-%' OR id LIKE 'real-booking-%'
  `);
  
  const result = deleteFakeBookings.run();
  console.log('✅ Removed', result.changes, 'fake bookings');
  
  // Show remaining bookings
  const remainingBookings = db.prepare('SELECT id, car_id, total_amount, status FROM bookings').all();
  console.log('\nRemaining real bookings:');
  remainingBookings.forEach(booking => {
    console.log('- ID:', booking.id, 'Amount:', booking.total_amount, 'Status:', booking.status);
  });
  
  db.close();
  
} catch (error) {
  console.error('❌ Error cleaning up:', error);
  db.close();
}













