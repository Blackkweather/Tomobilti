import Database from 'better-sqlite3';
import path from 'path';

async function getExistingCarsFromSQLite() {
  try {
    console.log('🚗 Getting your existing cars from SQLite database...');
    
    const dbPath = path.join(process.cwd(), 'tomobilti.db');
    const db = new Database(dbPath);
    
    // Get all cars
    const cars = db.prepare('SELECT * FROM cars').all();
    
    console.log(`\n📊 Found ${cars.length} cars:`);
    console.log('=====================================');
    
    cars.forEach((car, i) => {
      console.log(`${i+1}. ${car.title}`);
      console.log(`   Make: ${car.make} ${car.model} (${car.year})`);
      console.log(`   Price: ${car.price_per_day} MAD/day`);
      console.log(`   Location: ${car.city}`);
      console.log(`   Fuel: ${car.fuel_type}, Transmission: ${car.transmission}`);
      console.log(`   Available: ${car.is_available ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Get users for owner mapping
    const users = db.prepare('SELECT * FROM users WHERE user_type = "owner"').all();
    console.log(`👥 Found ${users.length} car owners`);
    
    db.close();
    
    // Prepare data for production deployment
    const carsData = cars.map(car => ({
      title: car.title,
      description: car.description,
      make: car.make,
      model: car.model,
      year: car.year,
      fuelType: car.fuel_type,
      transmission: car.transmission,
      seats: car.seats,
      pricePerDay: car.price_per_day,
      location: car.location,
      city: car.city,
      images: JSON.parse(car.images || '[]'),
      isAvailable: Boolean(car.is_available)
    }));
    
    console.log('✅ Cars data ready for production deployment');
    console.log('📋 Next step: Run the production deployment script with your Render DATABASE_URL');
    
    return { cars: carsData, owners: users };
    
  } catch (error) {
    console.error('❌ Error getting cars:', error);
  }
}

getExistingCarsFromSQLite();
