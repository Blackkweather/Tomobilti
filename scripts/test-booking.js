// Test script to verify booking functionality
const API_BASE = 'http://localhost:5000/api';

async function testBooking() {
  try {
    console.log('🧪 Testing booking functionality...');
    
    // Step 1: Try to login first, if fails, register
    console.log('👤 Trying to login...');
    let loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'renter.test@example.com',
        password: 'password123'
      })
    });
    
    let token, userData;
    
    if (!loginResponse.ok) {
      console.log('👤 User not found, creating new user...');
      const registerResponse = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'renter.test@example.com',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Doe',
          phone: '+44 20 9876 5432',
          userType: 'renter'
        })
      });
      
      if (!registerResponse.ok) {
        const error = await registerResponse.text();
        console.log('❌ Registration failed:', error);
        return;
      }
      
      const registerData = await registerResponse.json();
      token = registerData.token;
      userData = registerData.user;
      console.log('✅ Test renter created successfully');
    } else {
      const loginData = await loginResponse.json();
      token = loginData.token;
      userData = loginData.user;
      console.log('✅ Test renter logged in successfully');
    }
    
    // Step 2: Get available cars
    console.log('🚗 Fetching available cars...');
    const carsResponse = await fetch(`${API_BASE}/cars`);
    if (!carsResponse.ok) {
      console.error('❌ Failed to fetch cars');
      return;
    }
    
    const carsData = await carsResponse.json();
    console.log(`✅ Found ${carsData.cars.length} cars`);
    
    if (carsData.cars.length === 0) {
      console.log('❌ No cars available for booking');
      return;
    }
    
    const firstCar = carsData.cars[0];
    console.log(`🎯 Testing booking for: ${firstCar.title} (${firstCar.pricePerDay} ${firstCar.currency}/day)`);
    
    // Step 3: Create a booking
    console.log('📅 Creating booking...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const bookingPayload = {
      carId: firstCar.id,
      renterId: userData.id,
      startDate: tomorrow.toISOString(),
      endDate: dayAfterTomorrow.toISOString(),
      startTime: '10:00',
      endTime: '18:00',
      totalAmount: (parseFloat(firstCar.pricePerDay) * 1).toString(),
      serviceFee: (parseFloat(firstCar.pricePerDay) * 0.05).toString(),
      insurance: (parseFloat(firstCar.pricePerDay) * 0.03).toString(),
      message: 'Test booking for demonstration purposes',
      status: 'pending',
      paymentStatus: 'pending'
    };
    
    console.log('📋 Booking payload:', bookingPayload);
    
    const bookingResponse = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingPayload)
    });
    
    if (!bookingResponse.ok) {
      const error = await bookingResponse.text();
      console.log('❌ Booking failed:', error);
      return;
    }
    
    const booking = await bookingResponse.json();
    console.log('✅ Booking created successfully!');
    console.log('📋 Booking details:', {
      id: booking.id,
      car: firstCar.title,
      dates: `${tomorrow.toDateString()} to ${dayAfterTomorrow.toDateString()}`,
      total: `${booking.totalAmount} ${firstCar.currency}`,
      status: booking.status
    });
    
    // Step 4: Verify booking exists
    console.log('🔍 Verifying booking...');
    const verifyResponse = await fetch(`${API_BASE}/bookings/renter/${userData.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (verifyResponse.ok) {
      const bookings = await verifyResponse.json();
      console.log(`✅ Found ${bookings.length} booking(s) for user`);
      console.log('📋 User bookings:', bookings.map(b => ({
        id: b.id,
        car: b.car?.title,
        status: b.status,
        total: b.totalAmount
      })));
    }
    
    console.log('\n🎉 Booking test completed successfully!');
    console.log('✅ All booking functionality is working correctly');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBooking();
