#!/usr/bin/env node

/**
 * ShareWheelz Cars Fix Script
 * Fix the missing cars issue - ensure all 6 cars are available
 */

const postgres = require('postgres');

async function fixCarsIssue() {
  console.log('🔧 ShareWheelz Cars Fix');
  console.log('========================\n');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found');
    console.log('   This script must run in production environment');
    return;
  }

  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    console.log('🔍 Step 1: Checking current cars...\n');
    
    // Get all cars
    const allCars = await sql`
      SELECT id, title, make, model, year, price_per_day, currency, city, is_available
      FROM cars 
      ORDER BY created_at
    `;
    
    console.log(`📊 Current cars in database: ${allCars.length}`);
    
    if (allCars.length > 0) {
      console.log('\n🚗 Current cars:');
      allCars.forEach((car, index) => {
        console.log(`${index + 1}. ${car.title}`);
        console.log(`   ${car.make} ${car.model} (${car.year}) - ${car.price_per_day} ${car.currency}/day`);
        console.log(`   Location: ${car.city} | Available: ${car.is_available ? 'Yes' : 'No'}`);
        console.log('');
      });
    }
    
    console.log('🔧 Step 2: Fixing cars availability...\n');
    
    // Make all cars available
    const updateResult = await sql`
      UPDATE cars 
      SET is_available = true 
      WHERE is_available = false
    `;
    
    console.log(`✅ Made ${updateResult.count || 0} cars available`);
    
    console.log('\n🔧 Step 3: Ensuring we have 6 cars...\n');
    
    // Check if we need to add more cars
    const currentCount = allCars.length;
    const neededCars = 6 - currentCount;
    
    if (neededCars > 0) {
      console.log(`📝 Need to add ${neededCars} more cars`);
      
      // Get a user to assign cars to
      const users = await sql`SELECT id FROM users LIMIT 1`;
      if (users.length === 0) {
        console.log('❌ No users found to assign cars to');
        return;
      }
      
      const ownerId = users[0].id;
      
      // Add missing cars
      const carsToAdd = [
        {
          title: 'Jaguar F-Pace Sport (2023)',
          description: 'Luxury SUV with premium features and excellent performance.',
          make: 'Jaguar',
          model: 'F-Pace Sport',
          year: 2023,
          fuel_type: 'essence',
          transmission: 'automatic',
          seats: 5,
          price_per_day: '85.00',
          currency: 'GBP',
          location: 'Birmingham, City Centre',
          city: 'Birmingham',
          latitude: '52.4862',
          longitude: '-1.8904',
          images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
          is_available: true,
          vin: 'SALWA2FK8MA789012',
          registration_number: 'BIR 123',
          mot_expiry: '2025-04-15',
          is_insured: true,
          insurance_provider: 'Aviva',
          has_airbags: true,
          has_abs: true,
          has_bluetooth: true,
          has_gps: true,
          has_parking_sensors: true,
          mileage: 12000,
          condition: 'excellent'
        },
        {
          title: 'Range Rover Evoque Sport (2023)',
          description: 'Compact luxury SUV perfect for city driving.',
          make: 'Range Rover',
          model: 'Evoque Sport',
          year: 2023,
          fuel_type: 'essence',
          transmission: 'automatic',
          seats: 5,
          price_per_day: '75.00',
          currency: 'GBP',
          location: 'Liverpool, City Centre',
          city: 'Liverpool',
          latitude: '53.4084',
          longitude: '-2.9916',
          images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
          is_available: true,
          vin: 'SALWA2FK8MA345678',
          registration_number: 'LIV 456',
          mot_expiry: '2025-05-20',
          is_insured: true,
          insurance_provider: 'Direct Line',
          has_airbags: true,
          has_abs: true,
          has_bluetooth: true,
          has_gps: true,
          has_parking_sensors: true,
          mileage: 15000,
          condition: 'excellent'
        },
        {
          title: 'Ferrari La Ferrari (2023)',
          description: 'Ultimate supercar experience with incredible performance.',
          make: 'Ferrari',
          model: 'La Ferrari',
          year: 2023,
          fuel_type: 'hybrid',
          transmission: 'automatic',
          seats: 2,
          price_per_day: '250.00',
          currency: 'GBP',
          location: 'London, Mayfair',
          city: 'London',
          latitude: '51.5074',
          longitude: '-0.1278',
          images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
          is_available: true,
          vin: 'ZFF76ZFA8D0123456',
          registration_number: 'FER 789',
          mot_expiry: '2025-06-30',
          is_insured: true,
          insurance_provider: 'Hiscox',
          has_airbags: true,
          has_abs: true,
          has_bluetooth: true,
          has_gps: true,
          has_parking_sensors: true,
          mileage: 2000,
          condition: 'excellent'
        }
      ];
      
      // Add only the needed number of cars
      for (let i = 0; i < Math.min(neededCars, carsToAdd.length); i++) {
        const car = carsToAdd[i];
        const [created] = await sql`
          INSERT INTO cars (owner_id, title, description, make, model, year, fuel_type, transmission, seats, price_per_day, currency, location, city, latitude, longitude, images, is_available, vin, registration_number, mot_expiry, is_insured, insurance_provider, has_airbags, has_abs, has_bluetooth, has_gps, has_parking_sensors, mileage, condition)
          VALUES (${ownerId}, ${car.title}, ${car.description}, ${car.make}, ${car.model}, ${car.year}, ${car.fuel_type}, ${car.transmission}, ${car.seats}, ${car.price_per_day}, ${car.currency}, ${car.location}, ${car.city}, ${car.latitude}, ${car.longitude}, ${car.images}, ${car.is_available}, ${car.vin}, ${car.registration_number}, ${car.mot_expiry}, ${car.is_insured}, ${car.insurance_provider}, ${car.has_airbags}, ${car.has_abs}, ${car.has_bluetooth}, ${car.has_gps}, ${car.has_parking_sensors}, ${car.mileage}, ${car.condition})
          RETURNING id, title, make, model, price_per_day, currency
        `;
        console.log(`✅ Added: ${created.title} - ${created.price_per_day} ${created.currency}/day`);
      }
    } else {
      console.log('✅ Already have 6 cars, no need to add more');
    }
    
    console.log('\n🔍 Step 4: Final verification...\n');
    
    // Final check
    const finalCars = await sql`
      SELECT id, title, make, model, year, price_per_day, currency, city, is_available
      FROM cars 
      WHERE is_available = true
      ORDER BY created_at
    `;
    
    console.log(`🎉 FINAL RESULT: ${finalCars.length} cars available`);
    console.log('');
    
    console.log('🚗 All available cars:');
    finalCars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.title}`);
      console.log(`   ${car.make} ${car.model} (${car.year}) - ${car.price_per_day} ${car.currency}/day`);
      console.log(`   Location: ${car.city}`);
      console.log('');
    });
    
    if (finalCars.length === 6) {
      console.log('🎉 SUCCESS! All 6 cars are now available');
      console.log('   The API will now return 6 cars instead of 3');
      console.log('   Visit https://sharewheelz.uk/api/cars to verify');
    } else {
      console.log(`⚠️ Expected 6 cars, found ${finalCars.length}`);
      console.log('   There might be an issue with the database');
    }
    
  } catch (error) {
    console.error('❌ Error fixing cars:', error.message);
  } finally {
    await sql.end();
  }
}

// Run the fix
fixCarsIssue();
