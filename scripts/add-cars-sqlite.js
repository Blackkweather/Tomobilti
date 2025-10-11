import Database from 'better-sqlite3';
import path from 'path';

async function addCarsToDatabase() {
  console.log('🚗 Adding cars directly to SQLite database...');
  
  const dbPath = path.join(process.cwd(), 'tomobilti.db');
  const db = new Database(dbPath);
  
  try {
    // First, create a user if none exists
    const createUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password, first_name, last_name, phone, user_type, created_at, updated_at)
      VALUES ('demo-user-123', 'demo@sharewheelz.uk', '$2b$12$demo', 'Demo', 'User', '+44 20 1234 5678', 'owner', datetime('now'), datetime('now'))
    `);
    createUser.run();
    console.log('✅ User created/verified');
    
    // Get the user ID
    const getUser = db.prepare("SELECT id FROM users WHERE email = 'demo@sharewheelz.uk'");
    const user = getUser.get();
    
    if (!user) {
      throw new Error('No user found');
    }
    
    console.log('✅ Found user:', user.id);
    
    // Add cars
    const cars = [
      {
        title: 'BMW 3 Series - Premium Sedan',
        description: 'Luxury sedan perfect for business trips and city driving.',
        make: 'BMW',
        model: '3 Series',
        year: 2022,
        fuel_type: 'essence',
        transmission: 'automatic',
        seats: 5,
        price_per_day: '45.00',
        currency: 'GBP',
        location: 'London, Westminster',
        city: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        images: '["/assets/CLASSIC.png"]',
        is_available: 1,
        features: '["Bluetooth", "GPS", "Air Conditioning", "Leather Seats"]'
      },
      {
        title: 'Tesla Model 3 - Electric',
        description: 'Premium electric vehicle with autopilot features.',
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        fuel_type: 'electric',
        transmission: 'automatic',
        seats: 5,
        price_per_day: '65.00',
        currency: 'GBP',
        location: 'Birmingham, City Centre',
        city: 'Birmingham',
        latitude: 52.4862,
        longitude: -1.8904,
        images: '["/assets/ELECTRIC.png"]',
        is_available: 1,
        features: '["Autopilot", "Supercharging", "Premium Interior", "Safety Systems"]'
      },
      {
        title: 'Mercedes A-Class - Compact Luxury',
        description: 'Compact luxury car with premium features.',
        make: 'Mercedes',
        model: 'A-Class',
        year: 2021,
        fuel_type: 'essence',
        transmission: 'automatic',
        seats: 5,
        price_per_day: '52.00',
        currency: 'GBP',
        location: 'Manchester, City Centre',
        city: 'Manchester',
        latitude: 53.4808,
        longitude: -2.2426,
        images: '["/assets/luxury Sedam.png"]',
        is_available: 1,
        features: '["Premium Interior", "Safety Systems", "Bluetooth", "GPS"]'
      },
      {
        title: 'Ford Focus - Family Car',
        description: 'Reliable family car with excellent fuel economy.',
        make: 'Ford',
        model: 'Focus',
        year: 2021,
        fuel_type: 'essence',
        transmission: 'manual',
        seats: 5,
        price_per_day: '28.00',
        currency: 'GBP',
        location: 'Liverpool, City Centre',
        city: 'Liverpool',
        latitude: 53.4084,
        longitude: -2.9916,
        images: '["/assets/SUV.png"]',
        is_available: 1,
        features: '["Bluetooth", "Air Conditioning", "Parking Sensors"]'
      }
    ];
    
    const insertCar = db.prepare(`
      INSERT OR REPLACE INTO cars (
        id, owner_id, title, description, make, model, year, fuel_type, 
        transmission, seats, price_per_day, currency, location, city, 
        latitude, longitude, images, is_available, features, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    cars.forEach((car, index) => {
      try {
        insertCar.run([
          `car-${index + 1}`,
          user.id,
          car.title,
          car.description,
          car.make,
          car.model,
          car.year,
          car.fuel_type,
          car.transmission,
          car.seats,
          car.price_per_day,
          car.currency,
          car.location,
          car.city,
          car.latitude,
          car.longitude,
          car.images,
          car.is_available,
          car.features
        ]);
        console.log(`✅ Added: ${car.title} - £${car.price_per_day}/day`);
      } catch (err) {
        console.error(`❌ Failed to add ${car.title}:`, err.message);
      }
    });
    
    // Check final count
    const countResult = db.prepare("SELECT COUNT(*) as count FROM cars").get();
    console.log(`\n🎉 Successfully added cars! Total cars in database: ${countResult.count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    db.close();
  }
}

addCarsToDatabase().catch(console.error);
