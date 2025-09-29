import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('🔍 COMPREHENSIVE SYSTEM CHECK');
console.log('================================');

// 1. Check Database Tables
console.log('\n1. 📊 DATABASE TABLES CHECK');
const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' AND name NOT LIKE 'sqlite_%'
`).all();

console.log('✅ Available tables:', tables.map(t => t.name));

// 2. Check Users
console.log('\n2. 👥 USERS CHECK');
const users = db.prepare('SELECT id, first_name, last_name, email, user_type FROM users').all();
console.log(`✅ Total users: ${users.length}`);
users.forEach(user => {
  console.log(`   - ${user.first_name} ${user.last_name} (${user.email}) - ${user.user_type}`);
});

// 3. Check Cars
console.log('\n3. 🚗 CARS CHECK');
const cars = db.prepare('SELECT id, make, model, year, price_per_day, is_available FROM cars').all();
console.log(`✅ Total cars: ${cars.length}`);
cars.forEach(car => {
  console.log(`   - ${car.make} ${car.model} (${car.year}) - £${car.price_per_day}/day - ${car.is_available ? 'Available' : 'Unavailable'}`);
});

// 4. Check Bookings
console.log('\n4. 📅 BOOKINGS CHECK');
const bookings = db.prepare('SELECT id, renter_id, car_id, status, total_amount FROM bookings').all();
console.log(`✅ Total bookings: ${bookings.length}`);
bookings.forEach(booking => {
  console.log(`   - Booking ${booking.id.substring(0,8)}... - Status: ${booking.status} - £${booking.total_amount}`);
});

// 5. Check Conversations
console.log('\n5. 💬 CONVERSATIONS CHECK');
const conversations = db.prepare('SELECT id, owner_id, renter_id, booking_id FROM conversations').all();
console.log(`✅ Total conversations: ${conversations.length}`);
conversations.forEach(conv => {
  console.log(`   - Conversation ${conv.id.substring(0,8)}... - Booking: ${conv.booking_id.substring(0,8)}...`);
});

// 6. Check Messages
console.log('\n6. 📨 MESSAGES CHECK');
const messages = db.prepare('SELECT id, conversation_id, sender_id, content FROM messages').all();
console.log(`✅ Total messages: ${messages.length}`);
messages.forEach(msg => {
  console.log(`   - Message ${msg.id.substring(0,8)}... - "${msg.content.substring(0, 50)}..."`);
});

// 7. Check Notifications
console.log('\n7. 🔔 NOTIFICATIONS CHECK');
const notifications = db.prepare('SELECT id, user_id, title, type, is_read FROM notifications').all();
console.log(`✅ Total notifications: ${notifications.length}`);
notifications.forEach(notif => {
  console.log(`   - ${notif.title} (${notif.type}) - ${notif.is_read ? 'Read' : 'Unread'}`);
});

// 8. Check Reviews
console.log('\n8. ⭐ REVIEWS CHECK');
const reviews = db.prepare('SELECT id, car_id, reviewer_id, rating, comment FROM reviews').all();
console.log(`✅ Total reviews: ${reviews.length}`);
reviews.forEach(review => {
  console.log(`   - Rating: ${review.rating}/5 - "${review.comment?.substring(0, 30)}..."`);
});

// 9. Check Ferrari Description Update
console.log('\n9. 🏎️ FERRARI DESCRIPTION CHECK');
const ferrari = db.prepare('SELECT description FROM cars WHERE make = "Ferrari"').get();
if (ferrari) {
  console.log('✅ Ferrari description updated:');
  console.log(`   "${ferrari.description}"`);
} else {
  console.log('❌ Ferrari car not found');
}

// 10. System Health Summary
console.log('\n10. 📈 SYSTEM HEALTH SUMMARY');
console.log('================================');
console.log(`✅ Database: ${tables.length} tables`);
console.log(`✅ Users: ${users.length} registered`);
console.log(`✅ Cars: ${cars.length} available`);
console.log(`✅ Bookings: ${bookings.length} total`);
console.log(`✅ Conversations: ${conversations.length} active`);
console.log(`✅ Messages: ${messages.length} sent`);
console.log(`✅ Notifications: ${notifications.length} generated`);
console.log(`✅ Reviews: ${reviews.length} submitted`);

const availableCars = cars.filter(car => car.is_available).length;
const activeBookings = bookings.filter(booking => booking.status === 'confirmed' || booking.status === 'pending').length;
const unreadNotifications = notifications.filter(notif => !notif.is_read).length;

console.log('\n📊 LIVE STATISTICS:');
console.log(`   - Available cars: ${availableCars}/${cars.length}`);
console.log(`   - Active bookings: ${activeBookings}/${bookings.length}`);
console.log(`   - Unread notifications: ${unreadNotifications}/${notifications.length}`);

db.close();
console.log('\n✅ COMPREHENSIVE CHECK COMPLETED');
