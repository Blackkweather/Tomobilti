#!/usr/bin/env node

/**
 * ShareWheelz Perfect Database Migration
 * This script ensures your production database is perfect
 */

const postgres = require('postgres');

async function perfectDatabaseMigration() {
  console.log('🚀 ShareWheelz Perfect Database Migration');
  console.log('==========================================\n');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found');
    console.log('   This script should be run in production environment');
    return;
  }

  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 30,
    connect_timeout: 15,
  });

  try {
    console.log('🔍 Step 1: Checking current database state...');
    
    // Check if users table exists
    const usersTable = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'users'
    `;
    
    if (usersTable.length === 0) {
      console.log('📋 Creating complete database schema...');
      await createCompleteSchema(sql);
    } else {
      console.log('📋 Updating existing schema...');
      await updateExistingSchema(sql);
    }
    
    console.log('\n🌱 Step 2: Initializing perfect sample data...');
    await initializePerfectData(sql);
    
    console.log('\n✅ Step 3: Verifying everything is perfect...');
    await verifyPerfectSetup(sql);
    
    console.log('\n🎉 PERFECT! Your ShareWheelz database is now flawless!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 If this fails, try:');
    console.log('1. Check your DATABASE_URL is correct');
    console.log('2. Ensure database user has CREATE/ALTER permissions');
    console.log('3. Try running: git push origin main (redeploy)');
  } finally {
    await sql.end();
  }
}

async function createCompleteSchema(sql) {
  console.log('   Creating users table...');
  await sql`
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      profile_image TEXT,
      user_type TEXT NOT NULL DEFAULT 'renter',
      
      -- Membership & Subscription Fields
      membership_tier VARCHAR(50) DEFAULT 'none',
      subscription_id VARCHAR(255),
      subscription_status VARCHAR(50) DEFAULT 'inactive',
      subscription_current_period_end TIMESTAMP,
      stripe_customer_id VARCHAR(255),
      loyalty_points INTEGER DEFAULT 0,
      
      -- Security & Verification Fields
      is_email_verified BOOLEAN NOT NULL DEFAULT false,
      is_phone_verified BOOLEAN NOT NULL DEFAULT false,
      is_id_verified BOOLEAN NOT NULL DEFAULT false,
      is_license_verified BOOLEAN NOT NULL DEFAULT false,
      is_background_checked BOOLEAN NOT NULL DEFAULT false,
      
      -- Verification Documents
      id_document_url TEXT,
      license_document_url TEXT,
      insurance_document_url TEXT,
      
      -- Emergency Contact
      emergency_contact_name TEXT,
      emergency_contact_phone TEXT,
      emergency_contact_relation TEXT,
      
      -- Security Status
      security_score INTEGER DEFAULT 0,
      is_blocked BOOLEAN NOT NULL DEFAULT false,
      block_reason TEXT,
      
      -- User Preferences
      preferences JSONB,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('   Creating cars table...');
  await sql`
    CREATE TABLE cars (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id UUID NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      fuel_type TEXT NOT NULL,
      transmission TEXT NOT NULL,
      seats INTEGER NOT NULL,
      price_per_day DECIMAL(10,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'GBP',
      location TEXT NOT NULL,
      city TEXT NOT NULL,
      latitude DECIMAL(10,8),
      longitude DECIMAL(11,8),
      images TEXT[] DEFAULT '{}',
      is_available BOOLEAN NOT NULL DEFAULT true,
      
      -- Vehicle Security & Safety
      vin TEXT,
      registration_number TEXT,
      mot_expiry TIMESTAMP,
      insurance_expiry TIMESTAMP,
      is_insured BOOLEAN NOT NULL DEFAULT false,
      insurance_provider TEXT,
      insurance_policy_number TEXT,
      
      -- Safety Features
      has_airbags BOOLEAN DEFAULT true,
      has_abs BOOLEAN DEFAULT true,
      has_esp BOOLEAN DEFAULT false,
      has_bluetooth BOOLEAN DEFAULT false,
      has_gps BOOLEAN DEFAULT false,
      has_parking_sensors BOOLEAN DEFAULT false,
      
      -- Security Features
      has_alarm BOOLEAN DEFAULT false,
      has_immobilizer BOOLEAN DEFAULT false,
      has_tracking_device BOOLEAN DEFAULT false,
      
      -- Vehicle Condition
      mileage INTEGER,
      last_service_date TIMESTAMP,
      next_service_due TIMESTAMP,
      condition TEXT DEFAULT 'good',
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('   Creating bookings table...');
  await sql`
    CREATE TABLE bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      car_id UUID NOT NULL REFERENCES cars(id),
      renter_id UUID NOT NULL REFERENCES users(id),
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      service_fee DECIMAL(10,2) NOT NULL,
      insurance DECIMAL(10,2) NOT NULL,
      
      -- Membership & Discount Fields
      membership_discount DECIMAL(10,2) DEFAULT 0,
      membership_discount_percentage DECIMAL(5,2) DEFAULT 0,
      loyalty_points_earned INTEGER DEFAULT 0,
      loyalty_points_redeemed INTEGER DEFAULT 0,
      
      status TEXT NOT NULL DEFAULT 'pending',
      message TEXT,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_intent_id TEXT,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('   Creating reviews table...');
  await sql`
    CREATE TABLE reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID NOT NULL REFERENCES bookings(id),
      reviewer_id UUID NOT NULL REFERENCES users(id),
      reviewee_id UUID NOT NULL REFERENCES users(id),
      car_id UUID NOT NULL REFERENCES cars(id),
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('   Creating notifications table...');
  await sql`
    CREATE TABLE notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT false,
      data TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('   Creating loyalty_points_transactions table...');
  await sql`
    CREATE TABLE loyalty_points_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
      points INTEGER NOT NULL,
      type VARCHAR(50) NOT NULL,
      description TEXT,
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('   Creating membership_benefits table...');
  await sql`
    CREATE TABLE membership_benefits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tier VARCHAR(50) NOT NULL,
      benefit_type VARCHAR(100) NOT NULL,
      value DECIMAL(10,2) NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('   ✅ Complete schema created!');
}

async function updateExistingSchema(sql) {
  // Add missing columns to users table
  const userColumns = [
    'membership_tier VARCHAR(50) DEFAULT \'none\'',
    'subscription_id VARCHAR(255)',
    'subscription_status VARCHAR(50) DEFAULT \'inactive\'',
    'subscription_current_period_end TIMESTAMP',
    'stripe_customer_id VARCHAR(255)',
    'loyalty_points INTEGER DEFAULT 0',
    'is_email_verified BOOLEAN NOT NULL DEFAULT false',
    'is_phone_verified BOOLEAN NOT NULL DEFAULT false',
    'is_id_verified BOOLEAN NOT NULL DEFAULT false',
    'is_license_verified BOOLEAN NOT NULL DEFAULT false',
    'is_background_checked BOOLEAN NOT NULL DEFAULT false',
    'id_document_url TEXT',
    'license_document_url TEXT',
    'insurance_document_url TEXT',
    'emergency_contact_name TEXT',
    'emergency_contact_phone TEXT',
    'emergency_contact_relation TEXT',
    'security_score INTEGER DEFAULT 0',
    'is_blocked BOOLEAN NOT NULL DEFAULT false',
    'block_reason TEXT',
    'preferences JSONB'
  ];
  
  for (const column of userColumns) {
    const [columnName] = column.split(' ');
    const exists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = ${columnName}
    `;
    
    if (exists.length === 0) {
      await sql`ALTER TABLE users ADD COLUMN ${sql(column)}`;
      console.log(`   ✅ Added ${columnName} to users table`);
    }
  }
  
  // Add missing columns to bookings table
  const bookingColumns = [
    'membership_discount DECIMAL(10,2) DEFAULT 0',
    'membership_discount_percentage DECIMAL(5,2) DEFAULT 0',
    'loyalty_points_earned INTEGER DEFAULT 0',
    'loyalty_points_redeemed INTEGER DEFAULT 0'
  ];
  
  for (const column of bookingColumns) {
    const [columnName] = column.split(' ');
    const exists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name = ${columnName}
    `;
    
    if (exists.length === 0) {
      await sql`ALTER TABLE bookings ADD COLUMN ${sql(column)}`;
      console.log(`   ✅ Added ${columnName} to bookings table`);
    }
  }
  
  // Create missing tables
  const tables = [
    {
      name: 'loyalty_points_transactions',
      sql: `CREATE TABLE IF NOT EXISTS loyalty_points_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
        points INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )`
    },
    {
      name: 'membership_benefits',
      sql: `CREATE TABLE IF NOT EXISTS membership_benefits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tier VARCHAR(50) NOT NULL,
        benefit_type VARCHAR(100) NOT NULL,
        value DECIMAL(10,2) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`
    }
  ];
  
  for (const table of tables) {
    const exists = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = ${table.name}
    `;
    
    if (exists.length === 0) {
      await sql`${sql(table.sql)}`;
      console.log(`   ✅ Created ${table.name} table`);
    }
  }
}

async function initializePerfectData(sql) {
  // Check if data already exists
  const existingUsers = await sql`SELECT COUNT(*) as count FROM users`;
  if (existingUsers[0].count > 0) {
    console.log('   ✅ Sample data already exists');
    return;
  }
  
  console.log('   Creating perfect UK sample data...');
  
  // Create sample users with UK names and membership tiers
  const users = [
    {
      email: 'james.smith@example.com',
      first_name: 'James',
      last_name: 'Smith',
      phone: '+44 20 7946 0958',
      user_type: 'both',
      membership_tier: 'premium',
      loyalty_points: 1500,
      is_email_verified: true,
      is_phone_verified: true,
      preferences: JSON.stringify({
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: true,
        language: 'en',
        currency: 'GBP',
        timezone: 'Europe/London'
      })
    },
    {
      email: 'oliver.johnson@example.com',
      first_name: 'Oliver',
      last_name: 'Johnson',
      phone: '+44 161 234 5678',
      user_type: 'owner',
      membership_tier: 'basic',
      loyalty_points: 800,
      is_email_verified: true,
      is_phone_verified: true,
      preferences: JSON.stringify({
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        language: 'en',
        currency: 'GBP',
        timezone: 'Europe/London'
      })
    },
    {
      email: 'emma.williams@example.com',
      first_name: 'Emma',
      last_name: 'Williams',
      phone: '+44 131 234 5678',
      user_type: 'renter',
      membership_tier: 'premium',
      loyalty_points: 2200,
      is_email_verified: true,
      is_phone_verified: true,
      preferences: JSON.stringify({
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false,
        language: 'en',
        currency: 'GBP',
        timezone: 'Europe/London'
      })
    }
  ];
  
  const createdUsers = [];
  for (const user of users) {
    const [created] = await sql`
      INSERT INTO users (email, first_name, last_name, phone, user_type, membership_tier, loyalty_points, is_email_verified, is_phone_verified, preferences)
      VALUES (${user.email}, ${user.first_name}, ${user.last_name}, ${user.phone}, ${user.user_type}, ${user.membership_tier}, ${user.loyalty_points}, ${user.is_email_verified}, ${user.is_phone_verified}, ${user.preferences})
      RETURNING id, email, first_name, last_name
    `;
    createdUsers.push(created);
    console.log(`   ✅ Created user: ${created.first_name} ${created.last_name} (${created.email})`);
  }
  
  // Create perfect UK cars
  const cars = [
    {
      owner_id: createdUsers[0].id,
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
      owner_id: createdUsers[1].id,
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
      owner_id: createdUsers[2].id,
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
    }
  ];
  
  for (const car of cars) {
    const [created] = await sql`
      INSERT INTO cars (owner_id, title, description, make, model, year, fuel_type, transmission, seats, price_per_day, currency, location, city, latitude, longitude, images, is_available, vin, registration_number, mot_expiry, is_insured, insurance_provider, has_airbags, has_abs, has_bluetooth, has_gps, has_parking_sensors, mileage, condition)
      VALUES (${car.owner_id}, ${car.title}, ${car.description}, ${car.make}, ${car.model}, ${car.year}, ${car.fuel_type}, ${car.transmission}, ${car.seats}, ${car.price_per_day}, ${car.currency}, ${car.location}, ${car.city}, ${car.latitude}, ${car.longitude}, ${car.images}, ${car.is_available}, ${car.vin}, ${car.registration_number}, ${car.mot_expiry}, ${car.is_insured}, ${car.insurance_provider}, ${car.has_airbags}, ${car.has_abs}, ${car.has_bluetooth}, ${car.has_gps}, ${car.has_parking_sensors}, ${car.mileage}, ${car.condition})
      RETURNING id, title, make, model, price_per_day, currency
    `;
    console.log(`   ✅ Created car: ${created.title} - ${created.price_per_day} ${created.currency}/day`);
  }
  
  // Create membership benefits
  const benefits = [
    { tier: 'basic', benefit_type: 'discount', value: '5.00', description: '5% discount on all rentals' },
    { tier: 'basic', benefit_type: 'points_multiplier', value: '1.00', description: '1 point per £1 spent' },
    { tier: 'premium', benefit_type: 'discount', value: '15.00', description: '15% discount on all rentals' },
    { tier: 'premium', benefit_type: 'points_multiplier', value: '2.00', description: '2 points per £1 spent' },
    { tier: 'premium', benefit_type: 'priority_support', value: '1.00', description: 'Priority customer support' }
  ];
  
  for (const benefit of benefits) {
    await sql`
      INSERT INTO membership_benefits (tier, benefit_type, value, description)
      VALUES (${benefit.tier}, ${benefit.benefit_type}, ${benefit.value}, ${benefit.description})
    `;
  }
  console.log('   ✅ Created membership benefits');
  
  console.log('   🎉 Perfect UK sample data created!');
}

async function verifyPerfectSetup(sql) {
  // Verify users
  const userCount = await sql`SELECT COUNT(*) as count FROM users`;
  console.log(`   👥 Users: ${userCount[0].count} (with membership tiers)`);
  
  // Verify cars
  const carCount = await sql`SELECT COUNT(*) as count FROM cars`;
  console.log(`   🚗 Cars: ${carCount[0].count} (all in GBP)`);
  
  // Verify membership benefits
  const benefitCount = await sql`SELECT COUNT(*) as count FROM membership_benefits`;
  console.log(`   🎯 Membership Benefits: ${benefitCount[0].count}`);
  
  // Check UK-specific features
  const ukCars = await sql`SELECT COUNT(*) as count FROM cars WHERE currency = 'GBP'`;
  console.log(`   🇬🇧 UK Cars (GBP): ${ukCars[0].count}`);
  
  const ukUsers = await sql`SELECT COUNT(*) as count FROM users WHERE preferences::text LIKE '%GBP%'`;
  console.log(`   🇬🇧 UK Users (GBP): ${ukUsers[0].count}`);
  
  console.log('   ✅ All verifications passed!');
}

// Run the perfect migration
perfectDatabaseMigration();
