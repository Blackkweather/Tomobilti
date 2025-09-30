import Database from 'better-sqlite3';

const db = new Database('./tomobilti.db');

try {
  console.log('Creating test booking in SQLite database...');
  
  // Check if we have users and cars
  const users = db.prepare('SELECT id, email FROM users LIMIT 1').all();
  const cars = db.prepare('SELECT id, title, price_per_day FROM cars LIMIT 1').all();
  
  console.log('Existing users:', users.length);
  console.log('Existing cars:', cars.length);
  
  if (users.length === 0) {
    console.log('Creating test user...');
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password, first_name, last_name, phone, user_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const userId = 'test-user-' + Date.now();
    insertUser.run(
      userId,
      'test@example.com',
      'hashed_password',
      'Test',
      'User',
      '+1234567890',
      'renter',
      new Date().toISOString(),
      new Date().toISOString()
    );
    console.log('Test user created with ID:', userId);
  }
  
  if (cars.length === 0) {
    console.log('Creating test car...');
    const insertCar = db.prepare(`
      INSERT INTO cars (id, owner_id, title, description, make, model, year, fuel_type, transmission, seats, price_per_day, location, city, images, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const carId = 'test-car-' + Date.now();
    const ownerId = db.prepare('SELECT id FROM users WHERE user_type = ? LIMIT 1').get('owner')?.id;
    
    if (!ownerId) {
      // Create owner first
      const insertOwner = db.prepare(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, user_type, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const ownerUserId = 'test-owner-' + Date.now();
      insertOwner.run(
        ownerUserId,
        'owner@example.com',
        'hashed_password',
        'Test',
        'Owner',
        '+1234567891',
        'owner',
        new Date().toISOString(),
        new Date().toISOString()
      );
      
      insertCar.run(
        carId,
        ownerUserId,
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
        JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format']),
        new Date().toISOString(),
        new Date().toISOString()
      );
    } else {
      insertCar.run(
        carId,
        ownerId,
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
        JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format']),
        new Date().toISOString(),
        new Date().toISOString()
      );
    }
    
    console.log('Test car created with ID:', carId);
  }
  
  // Get the first user and car
  const user = db.prepare('SELECT id FROM users WHERE user_type = ? LIMIT 1').get('renter');
  const car = db.prepare('SELECT id, price_per_day FROM cars LIMIT 1').get();
  
  if (!user || !car) {
    throw new Error('No user or car found');
  }
  
  // Create a test booking
  const insertBooking = db.prepare(`
    INSERT INTO bookings (
      id, car_id, renter_id, start_date, end_date, start_time, end_time, 
      total_amount, service_fee, insurance, status, payment_status, message, 
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const bookingId = 'test-booking-' + Date.now();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);
  
  insertBooking.run(
    bookingId,
    car.id,
    user.id,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0],
    '10:00:00',
    '18:00:00',
    car.price_per_day * 2,
    50.00,
    25.00,
    'pending',
    'pending',
    'Test booking for payment system',
    new Date().toISOString(),
    new Date().toISOString()
  );
  
  console.log('✅ Test booking created successfully!');
  console.log('Booking ID:', bookingId);
  console.log('Payment URL:', `http://localhost:5000/payment/${bookingId}`);
  
  db.close();
  
} catch (error) {
  console.error('❌ Error creating test booking:', error);
  db.close();
}






