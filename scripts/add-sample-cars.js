import { DatabaseStorage } from '../server/db_sqlite_simple.ts';

async function addSampleCars() {
  try {
    console.log('🚗 Adding sample cars to database...');
    
    const storage = new DatabaseStorage();
    
    // First, let's check if there are any users
    const users = await storage.getAllUsers();
    console.log(`📊 Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }
    
    const owner = users[0]; // Use the first user as owner
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
    
  } catch (error) {
    console.error('❌ Error adding sample cars:', error);
  }
}

addSampleCars();
