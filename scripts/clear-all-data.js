import { DatabaseStorage } from '../server/db_sqlite_simple.ts';

async function clearAllData() {
  try {
    console.log('🗑️  Clearing ALL hardcoded data from database...');
    
    const storage = new DatabaseStorage();
    
    // Clear all cars
    console.log('\n🚗 Clearing cars...');
    const carsResult = await storage.searchCars({});
    const allCars = carsResult.cars;
    console.log(`📊 Found ${allCars.length} cars to remove`);
    
    for (const car of allCars) {
      await storage.deleteCar(car.id);
      console.log(`✅ Removed car: ${car.title}`);
    }
    
    // Clear all bookings
    console.log('\n📅 Clearing bookings...');
    // Note: We'll need to add a method to get all bookings or clear them directly
    
    // Clear all reviews
    console.log('\n⭐ Clearing reviews...');
    // Note: We'll need to add a method to get all reviews or clear them directly
    
    // Clear sample users (but keep your main user)
    console.log('\n👥 Checking users...');
    const sampleEmails = [
      'james.smith@example.com',
      'sarah.johnson@example.com', 
      'michael.brown@example.com',
      'emma.davis@example.com'
    ];
    
    for (const email of sampleEmails) {
      const user = await storage.getUserByEmail(email);
      if (user) {
        // Note: We'll need to add a deleteUser method
        console.log(`⚠️  Found sample user: ${user.firstName} ${user.lastName} (${email})`);
        console.log('   Note: User deletion method needs to be implemented');
      }
    }
    
    console.log('\n🎉 Data clearing completed!');
    console.log('📝 Note: Some data clearing methods may need to be implemented in the storage class');
    
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

// Run the script
clearAllData();
