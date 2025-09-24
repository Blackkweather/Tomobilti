import { DatabaseStorage } from '../server/db_sqlite_simple.ts';

async function addSampleCars() {
  try {
    console.log('🚗 Adding sample cars to database...');
    
    const storage = new DatabaseStorage();
    
    // First, let's check if there are any users
    const users = await storage.getAllUsers();
    console.log(`📊 Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('❌ No users found. Creating a sample user first...');
      
      // Create a sample user
      const sampleUser = await storage.createUser({
        email: 'john.owner@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Smith',
        phone: '+44 20 1234 5678',
        userType: 'owner'
      });
      
      console.log(`✅ Created sample user: ${sampleUser.firstName} ${sampleUser.lastName}`);
    }
    
    // Get the first user as owner
    const updatedUsers = await storage.getAllUsers();
    const owner = updatedUsers[0];
    console.log(`👤 Using owner: ${owner.firstName} ${owner.lastName}`);
    
    // Sample cars data
    const sampleCars = [
      {
        ownerId: owner.id,
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
        latitude: '51.5074',
        longitude: '-0.1278',
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Bluetooth', 'GPS', 'Air Conditioning', 'Leather Seats']
      },
      {
        ownerId: owner.id,
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
        latitude: '53.4808',
        longitude: '-2.2426',
        images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Bluetooth', 'Air Conditioning', 'Parking Sensors']
      },
      {
        ownerId: owner.id,
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
        ownerId: owner.id,
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
        latitude: '52.4862',
        longitude: '-1.8904',
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Premium Interior', 'Safety Systems', 'Bluetooth', 'GPS']
      },
      {
        ownerId: owner.id,
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
        latitude: '53.4084',
        longitude: '-2.9916',
        images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Fuel Efficient', 'Reliable', 'Air Conditioning', 'Bluetooth']
      },
      {
        ownerId: owner.id,
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
        latitude: '55.8642',
        longitude: '-4.2518',
        images: ['https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&h=600&fit=crop&auto=format'],
        isAvailable: true,
        features: ['Executive Features', 'Premium Sound', 'Navigation', 'Leather Seats']
      }
    ];
    
    // Add each car
    for (const carData of sampleCars) {
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
    
    // List all cars
    console.log('\n📋 Cars now available:');
    result.cars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.title} - ${car.location} (£${car.pricePerDay}/day)`);
    });
    
  } catch (error) {
    console.error('❌ Error adding sample cars:', error);
  }
}

addSampleCars();
