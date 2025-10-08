#!/usr/bin/env node

/**
 * Enhanced Car Fix Script - Guarantees all 6 cars are available
 * This script will be more robust and ensure cars are added to the database
 */

const { Client } = require('pg');

console.log('🚗 Enhanced Car Fix Script');
console.log('==========================\n');

// Sample cars data - all 6 cars that should be available
const sampleCars = [
  {
    id: 'porsche-911',
    title: 'Porsche 911 F Model - Classic Sports Car',
    make: 'Porsche',
    model: '911 F',
    year: 2020,
    pricePerDay: 120.00,
    city: 'London',
    description: 'Experience the thrill of driving a classic Porsche 911 F Model. This iconic sports car combines timeless design with modern performance.',
    images: ['/assets/Porsche.jpg'],
    seats: 2,
    mileage: 15000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    isAvailable: true,
    ownerId: 'owner-1'
  },
  {
    id: 'jaguar-f-type',
    title: 'Jaguar F-Type Convertible - Luxury Sports Car',
    make: 'Jaguar',
    model: 'F-Type',
    year: 2021,
    pricePerDay: 95.00,
    city: 'Manchester',
    description: 'Drive in style with the Jaguar F-Type Convertible. Perfect for luxury city tours and countryside adventures.',
    images: ['/assets/jaguar f type convertible 1.jpg'],
    seats: 2,
    mileage: 12000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    isAvailable: true,
    ownerId: 'owner-2'
  },
  {
    id: 'tesla-model-x',
    title: 'Tesla Model X - Electric SUV',
    make: 'Tesla',
    model: 'Model X',
    year: 2022,
    pricePerDay: 110.00,
    city: 'Edinburgh',
    description: 'Experience the future with the Tesla Model X. Electric, eco-friendly, and packed with cutting-edge technology.',
    images: ['/assets/Tesla.jpg'],
    seats: 7,
    mileage: 8000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    isAvailable: true,
    ownerId: 'owner-3'
  },
  {
    id: 'ferrari-488',
    title: 'Ferrari 488 GTB - Super Sports Car',
    make: 'Ferrari',
    model: '488 GTB',
    year: 2021,
    pricePerDay: 180.00,
    city: 'Birmingham',
    description: 'Feel the power of Italian engineering with the Ferrari 488 GTB. A true supercar experience.',
    images: ['/assets/Ferrari.jpg'],
    seats: 2,
    mileage: 5000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    isAvailable: true,
    ownerId: 'owner-1'
  },
  {
    id: 'range-rover',
    title: 'Range Rover Sport - Luxury SUV',
    make: 'Range Rover',
    model: 'Sport',
    year: 2022,
    pricePerDay: 140.00,
    city: 'Liverpool',
    description: 'Conquer any terrain with the Range Rover Sport. Luxury meets capability in this premium SUV.',
    images: ['/assets/Range Rover.jpg'],
    seats: 5,
    mileage: 10000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    isAvailable: true,
    ownerId: 'owner-2'
  },
  {
    id: 'bentley-continental',
    title: 'Bentley Continental GT - Grand Tourer',
    make: 'Bentley',
    model: 'Continental GT',
    year: 2021,
    pricePerDay: 200.00,
    city: 'London',
    description: 'Travel in ultimate luxury with the Bentley Continental GT. The perfect grand tourer for long journeys.',
    images: ['/assets/Bentley.jpg'],
    seats: 4,
    mileage: 7000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    isAvailable: true,
    ownerId: 'owner-3'
  }
];

async function connectToDatabase() {
  console.log('🔌 Connecting to database...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Database connected successfully');
    return client;
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`);
    return null;
  }
}

async function checkCurrentCars(client) {
  console.log('\n🔍 Checking current cars in database...');
  
  try {
    const result = await client.query('SELECT id, title, make, model, city FROM cars ORDER BY created_at');
    console.log(`📊 Found ${result.rows.length} cars in database:`);
    
    result.rows.forEach((car, index) => {
      console.log(`  ${index + 1}. ${car.title} (${car.make} ${car.model}) - ${car.city}`);
    });
    
    return result.rows;
  } catch (error) {
    console.log(`❌ Error checking cars: ${error.message}`);
    return [];
  }
}

async function addMissingCars(client, existingCars) {
  console.log('\n🚗 Adding missing cars...');
  
  const existingIds = existingCars.map(car => car.id);
  const missingCars = sampleCars.filter(car => !existingIds.includes(car.id));
  
  console.log(`📊 Missing cars: ${missingCars.length}`);
  
  if (missingCars.length === 0) {
    console.log('✅ All cars are already in the database');
    return;
  }
  
  for (const car of missingCars) {
    try {
      console.log(`➕ Adding: ${car.title}`);
      
      const query = `
        INSERT INTO cars (
          id, title, make, model, year, price_per_day, city, description, 
          images, seats, mileage, fuel_type, transmission, is_available, owner_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          make = EXCLUDED.make,
          model = EXCLUDED.model,
          year = EXCLUDED.year,
          price_per_day = EXCLUDED.price_per_day,
          city = EXCLUDED.city,
          description = EXCLUDED.description,
          images = EXCLUDED.images,
          seats = EXCLUDED.seats,
          mileage = EXCLUDED.mileage,
          fuel_type = EXCLUDED.fuel_type,
          transmission = EXCLUDED.transmission,
          is_available = EXCLUDED.is_available,
          updated_at = NOW()
      `;
      
      const values = [
        car.id, car.title, car.make, car.model, car.year, car.pricePerDay, car.city, car.description,
        JSON.stringify(car.images), car.seats, car.mileage, car.fuelType, car.transmission, car.isAvailable, car.ownerId
      ];
      
      await client.query(query, values);
      console.log(`   ✅ Added successfully`);
      
    } catch (error) {
      console.log(`   ❌ Error adding ${car.title}: ${error.message}`);
    }
  }
}

async function verifyCarsCount(client) {
  console.log('\n✅ Verifying final car count...');
  
  try {
    const result = await client.query('SELECT COUNT(*) as count FROM cars WHERE is_available = true');
    const count = parseInt(result.rows[0].count);
    
    console.log(`📊 Total available cars: ${count}`);
    
    if (count === 6) {
      console.log('🎉 SUCCESS! All 6 cars are now available!');
    } else if (count > 6) {
      console.log(`⚠️ More than expected: ${count} cars (expected 6)`);
    } else {
      console.log(`❌ Still missing cars: ${count} cars (expected 6)`);
    }
    
    return count;
  } catch (error) {
    console.log(`❌ Error verifying count: ${error.message}`);
    return 0;
  }
}

async function main() {
  console.log('Starting enhanced car fix...\n');
  
  const client = await connectToDatabase();
  if (!client) {
    console.log('❌ Cannot proceed without database connection');
    process.exit(1);
  }
  
  try {
    const existingCars = await checkCurrentCars(client);
    await addMissingCars(client, existingCars);
    const finalCount = await verifyCarsCount(client);
    
    console.log('\n🎉 CAR FIX COMPLETE');
    console.log('==================');
    console.log(`Final car count: ${finalCount}/6`);
    
    if (finalCount === 6) {
      console.log('✅ All cars are now available!');
      console.log('🚀 The ShareWheelz platform now has all 6 cars!');
    } else {
      console.log('⚠️ Some cars may still be missing');
      console.log('🔧 Check the logs above for any errors');
    }
    
  } catch (error) {
    console.error('❌ Error during car fix:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { sampleCars, addMissingCars, verifyCarsCount };
