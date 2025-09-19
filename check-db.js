import Database from 'better-sqlite3';

const db = new Database('./tomobilti.db');

console.log('=== DATABASE TABLES ===');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

console.log('\n=== USERS TABLE ===');
const users = db.prepare("SELECT COUNT(*) as count FROM users").get();
console.log('Users count:', users.count);
if (users.count > 0) {
  const userSample = db.prepare("SELECT id, email, first_name, last_name, user_type FROM users LIMIT 3").all();
  console.log('Sample users:', userSample);
}

console.log('\n=== CARS TABLE ===');
const cars = db.prepare("SELECT COUNT(*) as count FROM cars").get();
console.log('Cars count:', cars.count);
if (cars.count > 0) {
  const carSample = db.prepare("SELECT id, title, make, model, year, price_per_day, city FROM cars LIMIT 3").all();
  console.log('Sample cars:', carSample);
}

console.log('\n=== BOOKINGS TABLE ===');
const bookings = db.prepare("SELECT COUNT(*) as count FROM bookings").get();
console.log('Bookings count:', bookings.count);

console.log('\n=== REVIEWS TABLE ===');
const reviews = db.prepare("SELECT COUNT(*) as count FROM reviews").get();
console.log('Reviews count:', reviews.count);

db.close();