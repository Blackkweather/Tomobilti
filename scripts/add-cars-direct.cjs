const { DatabaseStorage } = require('../server/db.ts');

async function addCarsDirectly() {
  console.log('🚗 Adding cars directly to database...');
  
  try {
    const storage = new DatabaseStorage();
    
    // First create a user
    const user = await storage.createUser({
      email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+44 20 1234 5678',
      userType: 'owner'
    });
    
    console.log('✅ Created user:', user.email);
    
    // Add cars directly
    const cars = [
      {
        ownerId: user.id,
        title: 'BMW 3 Series - Premium Sedan',
        description: 'Luxury sedan perfect for business trips and city driving.',
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
        images: ['/assets/CLASSIC.png'],
        isAvailable: true,
        features: ['Bluetooth', 'GPS', 'Air Conditioning', 'Leather Seats']
      },
      {
        ownerId: user.id,
        title: 'Tesla Model 3 - Electric',
        description: 'Premium electric vehicle with autopilot features.',
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        fuelType: 'electric',
        transmission: 'automatic',
        seats: 5,
        pricePerDay: '65.00',
        currency: 'GBP',
        location: 'Birmingham, City Centre',
        city: 'Birmingham',
        latitude: 52.4862,
        longitude: -1.8904,
        images: ['/assets/ELECTRIC.png'],
        isAvailable: true,
        features: ['Autopilot', 'Supercharging', 'Premium Interior', 'Safety Systems']
      },
      {
        ownerId: user.id,
        title: 'Mercedes A-Class - Compact Luxury',
        description: 'Compact luxury car with premium features.',
        make: 'Mercedes',
        model: 'A-Class',
        year: 2021,
        fuelType: 'essence',
        transmission: 'automatic',
        seats: 5,
        pricePerDay: '52.00',
        currency: 'GBP',
        location: 'Manchester, City Centre',
        city: 'Manchester',
        latitude: 53.4808,
        longitude: -2.2426,
        images: ['/assets/luxury Sedam.png'],
        isAvailable: true,
        features: ['Premium Interior', 'Safety Systems', 'Bluetooth', 'GPS']
      }
    ];
    
    for (const carData of cars) {
      try {
        const car = await storage.createCar(carData);
        console.log(`✅ Added: ${car.title} - £${car.pricePerDay}/day`);
      } catch (error) {
        console.error(`❌ Failed to add ${carData.title}:`, error.message);
      }
    }
    
    // Check final count
    const result = await storage.searchCars({});
    console.log(`\n🎉 Successfully added cars! Total cars in database: ${result.cars.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addCarsDirectly();
