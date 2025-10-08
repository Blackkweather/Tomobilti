const postgres = require('postgres');

async function addDatabaseIndexes() {
  console.log('🔍 Adding database indexes for optimal performance...');
  
  const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:brams324brams@localhost:5432/tomobilti', {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Add indexes for frequently queried columns
    console.log('Adding indexes...');
    
    // Users table indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_membership_tier ON users(membership_tier)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)`;
    
    // Cars table indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_owner_id ON cars(owner_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_is_available ON cars(is_available)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_price_per_day ON cars(price_per_day)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at)`;
    
    // Bookings table indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_end_date ON bookings(end_date)`;
    
    // Messages table indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)`;
    
    // Reviews table indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)`;
    
    console.log('✅ All database indexes added successfully');
    
    // Analyze tables for query optimization
    console.log('Analyzing tables for optimization...');
    await sql`ANALYZE users`;
    await sql`ANALYZE cars`;
    await sql`ANALYZE bookings`;
    await sql`ANALYZE messages`;
    await sql`ANALYZE reviews`;
    
    console.log('✅ Database analysis completed');
    
  } catch (error) {
    console.error('❌ Database indexing failed:', error);
  } finally {
    await sql.end();
  }
}

addDatabaseIndexes();