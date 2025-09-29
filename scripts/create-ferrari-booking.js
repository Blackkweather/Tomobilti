import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Creating Ferrari booking for 15 days...');

try {
  // First, let's find the Ferrari and its owner
  const ferrari = db.prepare('SELECT * FROM cars WHERE make = ?').get('Ferrari');
  
  if (!ferrari) {
    console.log('❌ Ferrari not found!');
    process.exit(1);
  }
  
  console.log(`✅ Found Ferrari: ${ferrari.title}`);
  console.log(`   Owner ID: ${ferrari.owner_id}`);
  console.log(`   Price per day: ${ferrari.price_per_day}`);
  
  // Find a different user (not the owner)
  const otherUsers = db.prepare('SELECT * FROM users WHERE id != ?').all(ferrari.owner_id);
  
  if (otherUsers.length === 0) {
    console.log('❌ No other users found to book the Ferrari!');
    process.exit(1);
  }
  
  // Use the first available user
  const bookingUser = otherUsers[0];
  console.log(`✅ Using user: ${bookingUser.email} (ID: ${bookingUser.id})`);
  
  // Calculate booking details
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 15); // 15 days from now
  
  const totalDays = 15;
  const pricePerDay = parseFloat(ferrari.price_per_day);
  const totalAmount = pricePerDay * totalDays;
  
  console.log(`📅 Booking period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
  console.log(`💰 Total amount: ${ferrari.currency} ${totalAmount.toFixed(2)}`);
  
  // Create the booking
  const bookingId = crypto.randomUUID();
  const serviceFee = totalAmount * 0.1; // 10% service fee
  const insurance = totalAmount * 0.05; // 5% insurance
  
  const bookingData = {
    id: bookingId,
    car_id: ferrari.id,
    renter_id: bookingUser.id,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    start_time: '09:00',
    end_time: '17:00',
    total_amount: totalAmount.toString(),
    service_fee: serviceFee.toString(),
    insurance: insurance.toString(),
    status: 'confirmed',
    message: 'Ferrari booking for 15 days',
    payment_status: 'paid',
    payment_intent_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const insertBooking = db.prepare(`
    INSERT INTO bookings (
      id, car_id, renter_id, start_date, end_date, start_time, end_time,
      total_amount, service_fee, insurance, status, message, payment_status, 
      payment_intent_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertBooking.run(
    bookingData.id,
    bookingData.car_id,
    bookingData.renter_id,
    bookingData.start_date,
    bookingData.end_date,
    bookingData.start_time,
    bookingData.end_time,
    bookingData.total_amount,
    bookingData.service_fee,
    bookingData.insurance,
    bookingData.status,
    bookingData.message,
    bookingData.payment_status,
    bookingData.payment_intent_id,
    bookingData.created_at,
    bookingData.updated_at
  );
  
  console.log(`✅ Booking created successfully!`);
  console.log(`   Booking ID: ${bookingId}`);
  console.log(`   Car: ${ferrari.title}`);
  console.log(`   Renter: ${bookingUser.email}`);
  console.log(`   Duration: 15 days`);
  console.log(`   Base amount: ${ferrari.currency} ${totalAmount.toFixed(2)}`);
  console.log(`   Service fee: ${ferrari.currency} ${serviceFee.toFixed(2)}`);
  console.log(`   Insurance: ${ferrari.currency} ${insurance.toFixed(2)}`);
  console.log(`   Status: confirmed`);
  
  // Verify the booking was created
  const createdBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
  if (createdBooking) {
    console.log(`\n✅ Booking verified in database!`);
  } else {
    console.log(`\n❌ Booking not found in database!`);
  }
  
} catch (error) {
  console.error('❌ Error creating booking:', error.message);
} finally {
  db.close();
}

console.log('\nFerrari booking completed!');
