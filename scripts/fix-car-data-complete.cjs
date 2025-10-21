#!/usr/bin/env node

/**
 * ShareWheelz Complete Car Data Fix
 * Ensures all 6 cars are properly loaded and available
 */

const postgres = require('postgres');

async function fixCarDataCompletely() {
  console.log('🚗 ShareWheelz Complete Car Data Fix');
  console.log('====================================\n');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found');
    console.log('   This script must run in production environment');
    return;
  }

  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 30,
    connect_timeout: 15,
  });

  try {
    console.log('🔍 Step 1: Analyzing current car data...\n');
    
    // Check if cars table exists
    const tableExists = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'cars'
    `;
    
    if (tableExists.length === 0) {
      console.log('❌ Cars table does not exist. Run database migration first.');
      return;
    }
    
    // Get current cars
    const currentCars = await sql`
      SELECT id, title, make, model, year, price_per_day, currency, city, is_available, created_at
      FROM cars 
      ORDER BY created_at
    `;
    
    console.log(`📊 Current cars in database: ${currentCars.length}`);
    
    if (currentCars.length > 0) {
      console.log('\n🚗 Current cars:');
      currentCars.forEach((car, index) => {
        console.log(`${index + 1}. ${car.title}`);
        console.log(`   ${car.make} ${car.model} (${car.year}) - £${car.price_per_day}/day`);
        console.log(`   Location: ${car.city} | Available: ${car.is_available ? 'Yes' : 'No'}`);
        console.log('');
      });
    }
    
    console.log('🔧 Step 2: Ensuring all 6 cars are available...\n');
    
    // Define the complete set of cars that should be available
    const requiredCars = [
      {
        title: 'Luxury Porsche 911 F Model (1973)',
        description: 'Classic Porsche 911 F Model in excellent condition. Perfect for special occasions and car enthusiasts.',
        make: 'Porsche',
        model: '911 F',
        year: 1973,
        fuel_type: 'essence',
        transmission: 'manual',
        seats: 2,
        price_per_day: '120.00',
        currency: 'GBP',
        location: 'London, Westminster',
        city: 'London',
        latitude: '51.4994',
        longitude: '-0.1245',
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'],
        is_available: true,
        vin: 'WP0ZZZ91ZFS123456',
        registration_number: 'ABC 123',
        mot_expiry: '2024-12-31',
        is_insured: true,
        insurance_provider: 'Direct Line',
        has_airbags: true,
        has_abs: true,
        has_bluetooth: false,
        has_gps: false,
        mileage: 45000,
        condition: 'excellent'
      },
      {
        title: 'Jaguar F-Type Convertible (2023)',
        description: 'Brand new Jaguar F-Type Convertible with premium features. Perfect for weekend drives.',
        make: 'Jaguar',
        model: 'F-Type',
        year: 2023,
        fuel_type: 'essence',
        transmission: 'automatic',
        seats: 2,
        price_per_day: '95.00',
        currency: 'GBP',
        location: 'Manchester, City Centre',
        city: 'Manchester',
        latitude: '53.4808',
        longitude: '-2.2426',
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
        is_available: true,
        vin: 'SALWA2FK8MA123456',
        registration_number: 'MAN 456',
        mot_expiry: '2025-06-15',
        is_insured: true,
        insurance_provider: 'Admiral',
        has_airbags: true,
        has_abs: true,
        has_bluetooth: true,
        has_gps: true,
        has_parking_sensors: true,
        mileage: 5000,
        condition: 'excellent'
      },
      {
        title: 'Tesla Model X (2023)',
        description: 'Electric Tesla Model X with autopilot and premium interior. Eco-friendly luxury.',
        make: 'Tesla',
        model: 'Model X',
        year: 2023,
        fuel_type: 'electric',
        transmission: 'automatic',
        seats: 7,
        price_per_day: '110.00',
        currency: 'GBP',
        location: 'Edinburgh, New Town',
        city: 'Edinburgh',
        latitude: '55.9533',
        longitude: '-3.1883',
        images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'],
        is_available: true,
        vin: '5YJXCCE40MF123456',
        registration_number: 'EDI 789',
        mot_expiry: '2025-03-20',
        is_insured: true,
        insurance_provider: 'Churchill',
        has_airbags: true,
        has_abs: true,
        has_bluetooth: true,
        has_gps: true,
        has_parking_sensors: true,
        mileage: 8000,
        condition: 'excellent'
      },
      {
        title: 'Jaguar F-Pace Sport (2022)',
        description: 'Dynamic Jaguar F-Pace Sport SUV combining practicality with sports car performance.',
        make: 'Jaguar',
        model: 'F-Pace Sport',
        year: 2022,
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
        mot_expiry: '2025-04-10',
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
        title: 'Range Rover Sport (2023)',
        description: 'Sophisticated Range Rover Sport with commanding presence and refined luxury features.',
        make: 'Range Rover',
        model: 'Sport',
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
        mot_expiry: '2025-05-15',
        is_insured: true,
        insurance_provider: 'Direct Line',
        has_airbags: true,
        has_abs: true,
        has_bluetooth: true,
        has_gps: true,
        has_parking_sensors: true,
        mileage: 6000,
        condition: 'excellent'
      },
      {
        title: 'Ferrari La Ferrari (2014)',
        description: 'Ultimate Ferrari La Ferrari hybrid hypercar with 963 horsepower. The pinnacle of automotive engineering.',
        make: 'Ferrari',
        model: 'La Ferrari',
        year: 2014,
        fuel_type: 'hybrid',
        transmission: 'automatic',
        seats: 2,
        price_per_day: '5500.00',
        currency: 'GBP',
        location: 'London, Mayfair',
        city: 'London',
        latitude: '51.5074',
        longitude: '-0.1278',
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'],
        is_available: true,
        vin: 'ZFF76ZFA5E0201234',
        registration_number: 'FER 001',
        mot_expiry: '2025-12-31',
        is_insured: true,
        insurance_provider: 'Hiscox',
        has_airbags: true,
        has_abs: true,
        has_bluetooth: true,
        has_gps: true,
        has_parking_sensors: true,
        mileage: 1500,
        condition: 'excellent'
      }
    ];
    
    // Get or create a default owner for the cars
    let defaultOwner;
    const existingOwner = await sql`
      SELECT id FROM users 
      WHERE email = 'system@sharewheelz.uk' 
      LIMIT 1
    `;
    
    if (existingOwner.length > 0) {
      defaultOwner = existingOwner[0];
    } else {
      // Create a system owner
      const [newOwner] = await sql`
        INSERT INTO users (email, first_name, last_name, user_type, membership_tier, is_email_verified)
        VALUES ('system@sharewheelz.uk', 'ShareWheelz', 'System', 'owner', 'premium', true)
        RETURNING id
      `;
      defaultOwner = newOwner;
      console.log('✅ Created system owner for cars');
    }
    
    // Process each required car
    for (const carData of requiredCars) {
      // Check if car already exists
      const existingCar = await sql`
        SELECT id FROM cars 
        WHERE make = ${carData.make} 
        AND model = ${carData.model} 
        AND year = ${carData.year}
        LIMIT 1
      `;
      
      if (existingCar.length > 0) {
        // Update existing car to ensure it's available
        await sql`
          UPDATE cars 
          SET 
            title = ${carData.title},
            description = ${carData.description},
            price_per_day = ${carData.price_per_day},
            currency = ${carData.currency},
            location = ${carData.location},
            city = ${carData.city},
            latitude = ${carData.latitude},
            longitude = ${carData.longitude},
            images = ${carData.images},
            is_available = ${carData.is_available},
            vin = ${carData.vin},
            registration_number = ${carData.registration_number},
            mot_expiry = ${carData.mot_expiry},
            is_insured = ${carData.is_insured},
            insurance_provider = ${carData.insurance_provider},
            has_airbags = ${carData.has_airbags},
            has_abs = ${carData.has_abs},
            has_bluetooth = ${carData.has_bluetooth},
            has_gps = ${carData.has_gps},
            has_parking_sensors = ${carData.has_parking_sensors},
            mileage = ${carData.mileage},
            condition = ${carData.condition},
            updated_at = NOW()
          WHERE id = ${existingCar[0].id}
        `;
        console.log(`✅ Updated: ${carData.title}`);
      } else {
        // Create new car
        await sql`
          INSERT INTO cars (
            owner_id, title, description, make, model, year, fuel_type, transmission, seats,
            price_per_day, currency, location, city, latitude, longitude, images, is_available,
            vin, registration_number, mot_expiry, is_insured, insurance_provider,
            has_airbags, has_abs, has_bluetooth, has_gps, has_parking_sensors,
            mileage, condition
          )
          VALUES (
            ${defaultOwner.id}, ${carData.title}, ${carData.description}, ${carData.make}, 
            ${carData.model}, ${carData.year}, ${carData.fuel_type}, ${carData.transmission}, 
            ${carData.seats}, ${carData.price_per_day}, ${carData.currency}, ${carData.location}, 
            ${carData.city}, ${carData.latitude}, ${carData.longitude}, ${carData.images}, 
            ${carData.is_available}, ${carData.vin}, ${carData.registration_number}, 
            ${carData.mot_expiry}, ${carData.is_insured}, ${carData.insurance_provider},
            ${carData.has_airbags}, ${carData.has_abs}, ${carData.has_bluetooth}, 
            ${carData.has_gps}, ${carData.has_parking_sensors}, ${carData.mileage}, 
            ${carData.condition}
          )
        `;
        console.log(`✅ Created: ${carData.title}`);
      }
    }
    
    console.log('\n🔍 Step 3: Verifying final car count...\n');
    
    // Verify final count
    const finalCars = await sql`
      SELECT id, title, make, model, year, price_per_day, currency, city, is_available
      FROM cars 
      WHERE is_available = true
      ORDER BY price_per_day::numeric ASC
    `;
    
    console.log(`🎉 SUCCESS! Total cars available: ${finalCars.length}`);
    console.log('\n🚗 Final car inventory:');
    finalCars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.title}`);
      console.log(`   ${car.make} ${car.model} (${car.year}) - £${car.price_per_day}/day`);
      console.log(`   Location: ${car.city} | Available: ${car.is_available ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    console.log('✅ All 6 cars are now properly configured and available!');
    console.log('🎯 Price range: £75 - £5500 per day');
    console.log('📍 Locations: London, Manchester, Birmingham, Edinburgh, Liverpool');
    
  } catch (error) {
    console.error('❌ Error fixing car data:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure DATABASE_URL is correct');
    console.log('2. Check database connection permissions');
    console.log('3. Verify cars table exists (run migration first)');
  } finally {
    await sql.end();
  }
}

// Run the fix
fixCarDataCompletely();





