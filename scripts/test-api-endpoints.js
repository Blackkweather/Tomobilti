import fetch from 'node-fetch';

console.log('🌐 API ENDPOINTS TEST');
console.log('======================');

const baseUrl = 'http://localhost:5000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`${response.ok ? '✅' : '❌'} ${method} ${endpoint} - Status: ${response.status}`);
    
    if (response.ok) {
      if (Array.isArray(data)) {
        console.log(`   📊 Data: ${data.length} items`);
      } else if (data.cars) {
        console.log(`   📊 Cars: ${data.cars.length} items`);
      } else if (data.bookings) {
        console.log(`   📊 Bookings: ${data.bookings.length} items`);
      } else if (data.conversations) {
        console.log(`   📊 Conversations: ${data.conversations.length} items`);
      } else if (data.notifications) {
        console.log(`   📊 Notifications: ${data.notifications.length} items`);
      } else {
        console.log(`   📊 Data: ${Object.keys(data).length} fields`);
      }
    } else {
      console.log(`   ❌ Error: ${data.error || data.message || 'Unknown error'}`);
    }
    
    return response.ok;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n1. 🔐 AUTHENTICATION ENDPOINTS');
  await testEndpoint('/api/auth/me');
  
  console.log('\n2. 🚗 CAR ENDPOINTS');
  await testEndpoint('/api/cars');
  await testEndpoint('/api/cars/7f12f473-66c2-4fa5-9773-b9e1c649def8'); // Ferrari
  
  console.log('\n3. 📅 BOOKING ENDPOINTS');
  await testEndpoint('/api/bookings/owner/f17dce84-e26c-4bae-bf0f-4972fb134803');
  await testEndpoint('/api/bookings/renter/f17dce84-e26c-4bae-bf0f-4972fb134803');
  
  console.log('\n4. 💬 MESSAGING ENDPOINTS');
  await testEndpoint('/api/conversations');
  
  console.log('\n5. 🔔 NOTIFICATION ENDPOINTS');
  await testEndpoint('/api/notifications');
  
  console.log('\n6. ⭐ REVIEW ENDPOINTS');
  await testEndpoint('/api/reviews/car/7f12f473-66c2-4fa5-9773-b9e1c649def8');
  
  console.log('\n✅ API TESTING COMPLETED');
}

runTests().catch(console.error);
