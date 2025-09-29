import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, cars, bookings } from '@shared/schema';

// Database configuration
const config = {
  connectionString: process.env.DATABASE_URL || 'postgresql://demo_user:demo_password@localhost:5432/tomobilti_db',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  } : false
};

const sql = postgres(config.connectionString, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: config.ssl,
});

const db = drizzle(sql);

async function createTestBooking() {
  try {
    console.log('Creating test booking...');
    
    // First, let's check if we have any users and cars
    const existingUsers = await sql`SELECT id, email FROM users LIMIT 1`;
    const existingCars = await sql`SELECT id, title, price_per_day FROM cars LIMIT 1`;
    
    if (existingUsers.length === 0) {
      console.log('No users found. Creating a test user...');
      const testUser = await sql`
        INSERT INTO users (email, password, first_name, last_name, phone, user_type)
        VALUES ('test@example.com', 'hashed_password', 'Test', 'User', '+1234567890', 'renter')
        RETURNING id
      `;
      console.log('Test user created:', testUser[0].id);
    }
    
    if (existingCars.length === 0) {
      console.log('No cars found. Creating a test car...');
      const testCar = await sql`
        INSERT INTO cars (owner_id, title, description, make, model, year, fuel_type, transmission, seats, price_per_day, location, city, images)
        VALUES (
          (SELECT id FROM users WHERE user_type = 'owner' LIMIT 1),
          'Test Car - BMW 3 Series',
          'A beautiful test car for payment testing',
          'BMW',
          '3 Series',
          2022,
          'essence',
          'automatic',
          5,
          500.00,
          'Test Location',
          'Test City',
          ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format']
        )
        RETURNING id
      `;
      console.log('Test car created:', testCar[0].id);
    }
    
    // Get the first user and car
    const user = await sql`SELECT id FROM users WHERE user_type = 'renter' LIMIT 1`;
    const car = await sql`SELECT id, price_per_day FROM cars LIMIT 1`;
    
    if (user.length === 0 || car.length === 0) {
      throw new Error('No user or car found');
    }
    
    // Create a test booking
    const testBooking = await sql`
      INSERT INTO bookings (
        car_id, 
        renter_id, 
        start_date, 
        end_date, 
        start_time, 
        end_time, 
        total_amount, 
        service_fee, 
        insurance, 
        status, 
        payment_status, 
        message
      )
      VALUES (
        ${car[0].id},
        ${user[0].id},
        CURRENT_DATE + INTERVAL '1 day',
        CURRENT_DATE + INTERVAL '3 days',
        '10:00:00',
        '18:00:00',
        ${car[0].price_per_day * 2},
        50.00,
        25.00,
        'pending',
        'pending',
        'Test booking for payment system'
      )
      RETURNING id
    `;
    
    console.log('✅ Test booking created successfully!');
    console.log('Booking ID:', testBooking[0].id);
    console.log('Payment URL:', `http://localhost:5000/payment/${testBooking[0].id}`);
    
    await sql.end();
    
  } catch (error) {
    console.error('❌ Error creating test booking:', error);
    await sql.end();
  }
}

createTestBooking();
