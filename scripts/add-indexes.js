import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'tomobilti.db');
const db = new Database(dbPath);

console.log('Adding database indexes for performance optimization...');

const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
  'CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type)',
  'CREATE INDEX IF NOT EXISTS idx_cars_owner_id ON cars(owner_id)',
  'CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city)',
  'CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(is_available)',
  'CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price_per_day)',
  'CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type)',
  'CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id)',
  'CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id)',
  'CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)',
  'CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date)',
  'CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id)',
  'CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id)',
  'CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id)',
  'CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)'
];

indexes.forEach((indexSQL, i) => {
  try {
    db.exec(indexSQL);
    console.log(`✓ Index ${i + 1}/${indexes.length} created successfully`);
  } catch (error) {
    console.error(`✗ Failed to create index ${i + 1}:`, error.message);
  }
});

console.log('Database optimization completed!');
db.close();
