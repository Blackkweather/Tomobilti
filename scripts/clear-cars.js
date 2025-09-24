import { DatabaseStorage } from '../server/db_sqlite_simple.ts';

async function clearAllCars() {
  try {
    console.log('🗑️  Clearing all cars from database...');
    
    const storage = new DatabaseStorage();
    
    // Get all cars using searchCars method
    const result = await storage.searchCars({});
    const allCars = result.cars;
    console.log(`📊 Found ${allCars.length} cars to remove`);
    
    if (allCars.length === 0) {
      console.log('✅ No cars found in database');
      return;
    }
    
    // List the cars that will be removed
    console.log('\n🚗 Cars to be removed:');
    allCars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.title} - ${car.location} (£${car.pricePerDay}/day)`);
    });
    
    // Remove all cars
    for (const car of allCars) {
      await storage.deleteCar(car.id);
      console.log(`✅ Removed: ${car.title}`);
    }
    
    console.log(`\n🎉 Successfully removed ${allCars.length} cars from the database!`);
    
  } catch (error) {
    console.error('❌ Error clearing cars:', error);
  }
}

// Run the script
clearAllCars();
