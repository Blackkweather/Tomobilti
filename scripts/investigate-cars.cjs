#!/usr/bin/env node

/**
 * ShareWheelz Cars Investigation Script
 * Check why only 3 cars are showing instead of 6
 */

const postgres = require('postgres');

async function investigateCars() {
  console.log('🔍 ShareWheelz Cars Investigation');
  console.log('==================================\n');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found in environment');
    console.log('   This script needs to run in production environment');
    console.log('   Or set DATABASE_URL manually for testing\n');
    
    console.log('💡 To check your cars manually:');
    console.log('   1. Visit: https://sharewheelz.uk/api/cars');
    console.log('   2. Check the response');
    console.log('   3. Count the cars in the array\n');
    
    console.log('🔧 Possible reasons for missing cars:');
    console.log('   1. Database migration didn\'t create all cars');
    console.log('   2. Some cars were deleted or not inserted');
    console.log('   3. Database connection issues');
    console.log('   4. Cars are marked as unavailable');
    console.log('   5. API filtering is hiding some cars\n');
    
    return;
  }

  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    console.log('🔍 Checking cars in database...\n');
    
    // Get all cars
    const allCars = await sql`
      SELECT id, title, make, model, year, price_per_day, currency, city, is_available, created_at
      FROM cars 
      ORDER BY created_at
    `;
    
    console.log(`📊 Total cars in database: ${allCars.length}`);
    console.log('');
    
    if (allCars.length === 0) {
      console.log('❌ NO CARS FOUND!');
      console.log('   This explains why the API shows empty results');
      console.log('   Need to add cars to the database\n');
      
      console.log('🔧 SOLUTION:');
      console.log('   1. Run the database migration script');
      console.log('   2. Or manually add cars to the database');
      console.log('   3. Redeploy the platform\n');
      
    } else {
      console.log('🚗 Cars in database:');
      allCars.forEach((car, index) => {
        console.log(`${index + 1}. ${car.title}`);
        console.log(`   Make: ${car.make} ${car.model} (${car.year})`);
        console.log(`   Price: ${car.price_per_day} ${car.currency}/day`);
        console.log(`   Location: ${car.city}`);
        console.log(`   Available: ${car.is_available ? 'Yes' : 'No'}`);
        console.log(`   Created: ${car.created_at}`);
        console.log('');
      });
      
      // Check availability
      const availableCars = allCars.filter(car => car.is_available);
      const unavailableCars = allCars.filter(car => !car.is_available);
      
      console.log(`📈 Availability Status:`);
      console.log(`   Available: ${availableCars.length}`);
      console.log(`   Unavailable: ${unavailableCars.length}`);
      console.log('');
      
      // Check currency
      const gbpCars = allCars.filter(car => car.currency === 'GBP');
      const otherCurrencyCars = allCars.filter(car => car.currency !== 'GBP');
      
      console.log(`💰 Currency Status:`);
      console.log(`   GBP: ${gbpCars.length}`);
      console.log(`   Other: ${otherCurrencyCars.length}`);
      console.log('');
      
      if (otherCurrencyCars.length > 0) {
        console.log('⚠️ Cars with non-GBP currency:');
        otherCurrencyCars.forEach(car => {
          console.log(`   - ${car.title}: ${car.currency}`);
        });
        console.log('');
      }
      
      // Check if API should show all cars
      console.log('🔍 API Analysis:');
      console.log(`   Total cars: ${allCars.length}`);
      console.log(`   Available cars: ${availableCars.length}`);
      console.log(`   GBP cars: ${gbpCars.length}`);
      console.log('');
      
      if (allCars.length === 6 && availableCars.length === 3) {
        console.log('🎯 FOUND THE ISSUE!');
        console.log('   You have 6 cars total, but only 3 are marked as available');
        console.log('   The API only shows available cars');
        console.log('   Solution: Mark all cars as available\n');
        
        console.log('🔧 Fixing availability...');
        await sql`UPDATE cars SET is_available = true WHERE is_available = false`;
        console.log('✅ All cars marked as available');
        
      } else if (allCars.length < 6) {
        console.log('❌ ISSUE: Not enough cars in database');
        console.log(`   Expected: 6 cars`);
        console.log(`   Found: ${allCars.length} cars`);
        console.log('   Solution: Add missing cars\n');
        
        console.log('🔧 Adding missing cars...');
        await addMissingCars(sql, allCars.length);
        
      } else {
        console.log('✅ Cars look good in database');
        console.log('   Issue might be in API filtering or frontend display');
      }
    }
    
    // Test API response
    console.log('🧪 Testing API response...');
    const apiCars = await sql`
      SELECT id, title, make, model, year, price_per_day, currency, city, is_available
      FROM cars 
      WHERE is_available = true
      ORDER BY created_at
    `;
    
    console.log(`📡 API would return: ${apiCars.length} cars`);
    apiCars.forEach((car, index) => {
      console.log(`   ${index + 1}. ${car.title} - ${car.price_per_day} ${car.currency}/day`);
    });
    console.log('');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Check DATABASE_URL is correct');
    console.log('2. Ensure database is accessible');
    console.log('3. Check if tables exist');
    console.log('4. Try redeploying the platform');
  } finally {
    await sql.end();
  }
}

async function addMissingCars(sql, currentCount) {
  console.log(`   Adding ${6 - currentCount} missing cars...`);
  
  const missingCars = [
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
  
  // Get a user ID to assign as owner
  const users = await sql`SELECT id FROM users LIMIT 1`;
  if (users.length === 0) {
    console.log('   ❌ No users found to assign cars to');
    return;
  }
  
  const ownerId = users[0].id;
  
  for (const car of missingCars) {
    const [created] = await sql`
      INSERT INTO cars (owner_id, title, description, make, model, year, fuel_type, transmission, seats, price_per_day, currency, location, city, latitude, longitude, images, is_available, vin, registration_number, mot_expiry, is_insured, insurance_provider, has_airbags, has_abs, has_bluetooth, has_gps, has_parking_sensors, mileage, condition)
      VALUES (${ownerId}, ${car.title}, ${car.description}, ${car.make}, ${car.model}, ${car.year}, ${car.fuel_type}, ${car.transmission}, ${car.seats}, ${car.price_per_day}, ${car.currency}, ${car.location}, ${car.city}, ${car.latitude}, ${car.longitude}, ${car.images}, ${car.is_available}, ${car.vin}, ${car.registration_number}, ${car.mot_expiry}, ${car.is_insured}, ${car.insurance_provider}, ${car.has_airbags}, ${car.has_abs}, ${car.has_bluetooth}, ${car.has_gps}, ${car.has_parking_sensors}, ${car.mileage}, ${car.condition})
      RETURNING id, title, make, model, price_per_day, currency
    `;
    console.log(`   ✅ Added: ${created.title} - ${created.price_per_day} ${created.currency}/day`);
  }
  
  console.log('   🎉 All missing cars added!');
}

// Run the investigation
investigateCars();
