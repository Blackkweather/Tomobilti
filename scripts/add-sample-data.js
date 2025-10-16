// Simple script to add sample data using the API
const API_BASE = 'http://localhost:5000/api';

async function addSampleData() {
  try {
    console.log('🚗 Adding sample data to platform...');
    
    // Try to login first, if fails, create user
    console.log('🔐 Trying to login...');
    let loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('👤 User not found, creating new user...');
      const userResponse = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
          password: 'password123',
          firstName: 'John',
          lastName: 'Smith',
          phone: '+44 20 1234 5678',
          userType: 'owner'
        })
      });
      
      if (!userResponse.ok) {
        const error = await userResponse.text();
        console.log('❌ Failed to create user:', error);
        return;
      } else {
        const user = await userResponse.json();
        console.log(`✅ Created user: ${user.user.firstName} ${user.user.lastName}`);
      }
      
      // Try login again
      loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
          password: 'password123'
        })
      });
    }
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed');
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Logged in successfully');
    
    // Sample cars data
    const sampleCars = [
      {
        title: 'BMW 3 Series - Premium Sedan',
        description: 'Luxury sedan perfect for business trips and city driving. Features leather seats, navigation, and premium sound system.',
        make: 'BMW',
        model: '3 Series',
        year: 2022,
        fuelType: 'essence',
        transmission: 'automatic',
        seats: 5,
        pricePerDay: '45.00',
        currency: 'GBP',
        location: 'London, Westminster',
        city: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Bluetooth', 'GPS', 'Air Conditioning', 'Leather Seats']
      },
      {
        title: 'Ford Focus - Family Car',
        description: 'Reliable family car with excellent fuel economy. Perfect for city driving and weekend trips.',
        make: 'Ford',
        model: 'Focus',
        year: 2021,
        fuelType: 'essence',
        transmission: 'manual',
        seats: 5,
        pricePerDay: '28.00',
        currency: 'GBP',
        location: 'Manchester, City Centre',
        city: 'Manchester',
        latitude: 53.4808,
        longitude: -2.2426,
        images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Bluetooth', 'Air Conditioning', 'Parking Sensors']
      },
      {
        title: 'Tesla Model 3 - Electric',
        description: 'Premium electric vehicle with autopilot features. Zero emissions and cutting-edge technology.',
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        fuelType: 'electric',
        transmission: 'automatic',
        seats: 5,
        pricePerDay: '65.00',
        currency: 'GBP',
        location: 'Edinburgh, New Town',
        city: 'Edinburgh',
        latitude: '55.9533',
        longitude: '-3.1883',
        images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Autopilot', 'Supercharging', 'Premium Sound', 'Glass Roof']
      },
      {
        title: 'Mercedes A-Class - Compact Luxury',
        description: 'Compact luxury car perfect for city driving. Features premium interior and advanced safety systems.',
        make: 'Mercedes',
        model: 'A-Class',
        year: 2022,
        fuelType: 'essence',
        transmission: 'automatic',
        seats: 5,
        pricePerDay: '52.00',
        currency: 'GBP',
        location: 'Birmingham, City Centre',
        city: 'Birmingham',
        latitude: 52.4862,
        longitude: -1.8904,
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Premium Interior', 'Safety Systems', 'Bluetooth', 'GPS']
      },
      {
        title: 'Volkswagen Golf - Reliable Hatchback',
        description: 'Popular hatchback known for reliability and efficiency. Great for both city and highway driving.',
        make: 'Volkswagen',
        model: 'Golf',
        year: 2021,
        fuelType: 'diesel',
        transmission: 'manual',
        seats: 5,
        pricePerDay: '32.00',
        currency: 'GBP',
        location: 'Liverpool, City Centre',
        city: 'Liverpool',
        latitude: 53.4084,
        longitude: -2.9916,
        images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Fuel Efficient', 'Reliable', 'Air Conditioning', 'Bluetooth']
      },
      {
        title: 'Audi A4 - Executive Sedan',
        description: 'Executive sedan with premium features and excellent driving dynamics. Perfect for business trips.',
        make: 'Audi',
        model: 'A4',
        year: 2023,
        fuelType: 'essence',
        transmission: 'automatic',
        seats: 5,
        pricePerDay: '58.00',
        currency: 'GBP',
        location: 'Glasgow, City Centre',
        city: 'Glasgow',
        latitude: 55.8642,
        longitude: -4.2518,
        images: ['https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Executive Features', 'Premium Sound', 'Navigation', 'Leather Seats']
      }
    ];
    
    // Add each car
    console.log('🚗 Adding cars...');
    for (const carData of sampleCars) {
      try {
        const formData = new FormData();
        
        // Add all car data with proper types
        formData.append('features', JSON.stringify(carData.features));
        formData.append('title', carData.title);
        formData.append('description', carData.description);
        formData.append('make', carData.make);
        formData.append('model', carData.model);
        formData.append('year', carData.year.toString());
        formData.append('fuelType', carData.fuelType);
        formData.append('transmission', carData.transmission);
        formData.append('seats', carData.seats.toString());
        formData.append('pricePerDay', carData.pricePerDay);
        formData.append('currency', carData.currency);
        formData.append('location', carData.location);
        formData.append('city', carData.city);
        formData.append('latitude', carData.latitude.toString());
        formData.append('longitude', carData.longitude.toString());
        formData.append('images', JSON.stringify(carData.images));
        formData.append('isAvailable', carData.isAvailable.toString());
        
        const carResponse = await fetch(`${API_BASE}/cars`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (carResponse.ok) {
          const car = await carResponse.json();
          console.log(`✅ Added: ${car.title} - £${car.pricePerDay}/day`);
        } else {
          const error = await carResponse.text();
          console.error(`❌ Failed to add ${carData.title}:`, error);
        }
      } catch (error) {
        console.error(`❌ Error adding ${carData.title}:`, error.message);
      }
    }
    
    // Check final count
    console.log('\n📊 Checking final car count...');
    const carsResponse = await fetch(`${API_BASE}/cars`);
    if (carsResponse.ok) {
      const carsData = await carsResponse.json();
      console.log(`🎉 Total cars in database: ${carsData.cars.length}`);
      
      console.log('\n📋 Cars now available:');
      carsData.cars.forEach((car, index) => {
        console.log(`${index + 1}. ${car.title} - ${car.location} (£${car.pricePerDay}/day)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

addSampleData();
