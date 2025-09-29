import Database from 'better-sqlite3';

const db = new Database('./tomobilti.db');

try {
  console.log('Creating real booking with your Porsche car...');
  
  // Get your actual Porsche car
  const porscheCar = db.prepare('SELECT id, title, price_per_day FROM cars WHERE title LIKE ? LIMIT 1').get('%Porsche%');
  
  if (!porscheCar) {
    console.log('No Porsche car found. Available cars:');
    const allCars = db.prepare('SELECT id, title, price_per_day FROM cars').all();
    allCars.forEach(car => console.log('-', car.title, '(ID:', car.id + ')'));
    throw new Error('No Porsche car found');
  }
  
  console.log('Found Porsche car:', porscheCar.title, 'Price:', porscheCar.price_per_day);
  
  // Get or create a test user
  let user = db.prepare('SELECT id FROM users WHERE user_type = ? LIMIT 1').get('renter');
  
  if (!user) {
    console.log('Creating test user...');
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password, first_name, last_name, phone, user_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const userId = 'real-user-' + Date.now();
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
    user = { id: userId };
    console.log('Test user created with ID:', userId);
  }
  
  // Create a real booking with your Porsche
  const insertBooking = db.prepare(`
    INSERT INTO bookings (
      id, car_id, renter_id, start_date, end_date, start_time, end_time, 
      total_amount, service_fee, insurance, status, payment_status, message, 
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const bookingId = 'real-booking-' + Date.now();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 2);
  
  const totalAmount = porscheCar.price_per_day * 2; // 2 days rental
  
  insertBooking.run(
    bookingId,
    porscheCar.id,
    user.id,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0],
    '10:00:00',
    '18:00:00',
    totalAmount,
    50.00,
    25.00,
    'pending',
    'pending',
    'Real booking with your Porsche car',
    new Date().toISOString(),
    new Date().toISOString()
  );
  
  console.log('✅ Real booking created successfully!');
  console.log('Booking ID:', bookingId);
  console.log('Car:', porscheCar.title);
  console.log('Amount:', totalAmount);
  console.log('Payment URL:', `http://localhost:5000/payment/${bookingId}`);
  
  db.close();
  
} catch (error) {
  console.error('❌ Error creating real booking:', error);
  db.close();
}



