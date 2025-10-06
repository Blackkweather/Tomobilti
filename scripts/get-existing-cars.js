import { DatabaseStorage } from '../server/db.ts';

async function getExistingCars() {
  try {
    console.log('🚗 Getting your existing cars from local database...');
    
    const storage = new DatabaseStorage();
    const result = await storage.searchCars({});
    
    console.log(`\n📊 Found ${result.cars.length} cars:`);
    console.log('=====================================');
    
    result.cars.forEach((car, i) => {
      console.log(`${i+1}. ${car.title}`);
      console.log(`   Make: ${car.make} ${car.model} (${car.year})`);
      console.log(`   Price: ${car.pricePerDay} MAD/day`);
      console.log(`   Location: ${car.city}`);
      console.log(`   Fuel: ${car.fuelType}, Transmission: ${car.transmission}`);
      console.log(`   Available: ${car.isAvailable ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Export cars data for production script
    const carsData = result.cars.map(car => ({
      title: car.title,
      description: car.description,
      make: car.make,
      model: car.model,
      year: car.year,
      fuelType: car.fuelType,
      transmission: car.transmission,
      seats: car.seats,
      pricePerDay: car.pricePerDay,
      location: car.location,
      city: car.city,
      images: car.images,
      isAvailable: car.isAvailable
    }));
    
    console.log('✅ Cars data ready for production deployment');
    console.log('📋 Next step: Run the production deployment script');
    
    return carsData;
    
  } catch (error) {
    console.error('❌ Error getting cars:', error);
  }
}

getExistingCars();
