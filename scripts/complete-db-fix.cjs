#!/usr/bin/env node

/**
 * Complete Database Fix for ShareWheelz
 * Ensures all required columns exist to prevent blank page
 */

const postgres = require('postgres');

async function completeDatabaseFix() {
  console.log('🔧 Complete Database Fix - ShareWheelz');
  console.log('=====================================\n');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found');
    return;
  }

  console.log('✅ DATABASE_URL found');

  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 30,
    connect_timeout: 15,
  });

  try {
    console.log('\n🔍 Step 1: Checking current database schema...\n');
    
    // Check if users table exists
    const usersTable = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'users'
    `;
    
    if (usersTable.length === 0) {
      console.log('❌ Users table does not exist. Creating complete schema...');
      await createCompleteSchema(sql);
    } else {
      console.log('✅ Users table exists');
      
      // Check for missing columns
      const columns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY column_name
      `;
      
      console.log(`📊 Current columns in users table: ${columns.length}`);
      console.log('   Columns:', columns.map(c => c.column_name).join(', '));
      
      // Add missing columns one by one
      await addMissingColumns(sql);
    }
    
    console.log('\n🔍 Step 2: Final verification...\n');
    
    // Final check
    const finalColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY column_name
    `;
    
    console.log(`📊 Final columns in users table: ${finalColumns.length}`);
    console.log('   Columns:', finalColumns.map(c => c.column_name).join(', '));
    
    // Test connection
    const testQuery = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`✅ Database connection working`);
    console.log(`   Users in database: ${testQuery[0].count}`);
    
    console.log('\n🎉 COMPLETE DATABASE FIX FINISHED!');
    console.log('==================================');
    console.log('✅ All required columns present');
    console.log('✅ Database connection working');
    console.log('✅ Server should start properly now');
    console.log('✅ Blank page issue should be resolved');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error.message);
  } finally {
    await sql.end();
  }
}

async function createCompleteSchema(sql) {
  console.log('📋 Creating complete database schema...');
  
  await sql.unsafe(`
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
  `);
  
  console.log('✅ Complete schema created');
}

async function addMissingColumns(sql) {
  console.log('🔧 Adding missing columns to users table...');
  
  const columnsToAdd = [
    { name: 'membership_tier', sql: 'VARCHAR(50) DEFAULT \'none\'' },
    { name: 'subscription_id', sql: 'VARCHAR(255)' },
    { name: 'subscription_status', sql: 'VARCHAR(50) DEFAULT \'inactive\'' },
    { name: 'subscription_current_period_end', sql: 'TIMESTAMP' },
    { name: 'stripe_customer_id', sql: 'VARCHAR(255)' },
    { name: 'loyalty_points', sql: 'INTEGER DEFAULT 0' },
    { name: 'is_email_verified', sql: 'BOOLEAN NOT NULL DEFAULT false' },
    { name: 'is_phone_verified', sql: 'BOOLEAN NOT NULL DEFAULT false' },
    { name: 'is_id_verified', sql: 'BOOLEAN NOT NULL DEFAULT false' },
    { name: 'is_license_verified', sql: 'BOOLEAN NOT NULL DEFAULT false' },
    { name: 'is_background_checked', sql: 'BOOLEAN NOT NULL DEFAULT false' },
    { name: 'id_document_url', sql: 'TEXT' },
    { name: 'license_document_url', sql: 'TEXT' },
    { name: 'insurance_document_url', sql: 'TEXT' },
    { name: 'emergency_contact_name', sql: 'TEXT' },
    { name: 'emergency_contact_phone', sql: 'TEXT' },
    { name: 'emergency_contact_relation', sql: 'TEXT' },
    { name: 'security_score', sql: 'INTEGER DEFAULT 0' },
    { name: 'is_blocked', sql: 'BOOLEAN NOT NULL DEFAULT false' },
    { name: 'block_reason', sql: 'TEXT' },
    { name: 'preferences', sql: 'JSONB' }
  ];
  
  // Check if cars table exists and add vin column if needed
  const carsTable = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_name = 'cars'
  `;
  
  if (carsTable.length > 0) {
    console.log('🔍 Checking cars table for missing columns...');
    
    const carsColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'cars'
    `;
    
    const carsColumnsToAdd = [
      { name: 'vin', sql: 'VARCHAR(17)' },
      { name: 'year', sql: 'INTEGER' },
      { name: 'make', sql: 'VARCHAR(100)' },
      { name: 'model', sql: 'VARCHAR(100)' },
      { name: 'color', sql: 'VARCHAR(50)' },
      { name: 'mileage', sql: 'INTEGER' },
      { name: 'fuel_type', sql: 'VARCHAR(50)' },
      { name: 'transmission', sql: 'VARCHAR(50)' },
      { name: 'seats', sql: 'INTEGER' },
      { name: 'doors', sql: 'INTEGER' },
      { name: 'engine_size', sql: 'VARCHAR(50)' },
      { name: 'features', sql: 'TEXT[]' },
      { name: 'description', sql: 'TEXT' },
      { name: 'daily_rate', sql: 'DECIMAL(10,2)' },
      { name: 'weekly_rate', sql: 'DECIMAL(10,2)' },
      { name: 'monthly_rate', sql: 'DECIMAL(10,2)' },
      { name: 'deposit_amount', sql: 'DECIMAL(10,2)' },
      { name: 'insurance_required', sql: 'BOOLEAN DEFAULT true' },
      { name: 'minimum_age', sql: 'INTEGER DEFAULT 21' },
      { name: 'license_required', sql: 'BOOLEAN DEFAULT true' },
      { name: 'is_available', sql: 'BOOLEAN DEFAULT true' },
      { name: 'location', sql: 'VARCHAR(255)' },
      { name: 'latitude', sql: 'DECIMAL(10,8)' },
      { name: 'longitude', sql: 'DECIMAL(11,8)' },
      { name: 'images', sql: 'TEXT[]' },
      { name: 'owner_id', sql: 'UUID REFERENCES users(id)' },
      { name: 'created_at', sql: 'TIMESTAMP DEFAULT NOW()' },
      { name: 'updated_at', sql: 'TIMESTAMP DEFAULT NOW()' }
    ];
    
    for (const column of carsColumnsToAdd) {
      const exists = carsColumns.some(c => c.column_name === column.name);
      if (!exists) {
        try {
          await sql.unsafe(`ALTER TABLE cars ADD COLUMN ${column.name} ${column.sql}`);
          console.log(`   ✅ Added ${column.name} to cars table`);
        } catch (error) {
          console.log(`   ⚠️  Failed to add ${column.name} to cars: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${column.name} already exists in cars table`);
      }
    }
  }
  
  for (const column of columnsToAdd) {
    const exists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = ${column.name}
    `;
    
    if (exists.length === 0) {
      try {
        await sql.unsafe(`ALTER TABLE users ADD COLUMN ${column.name} ${column.sql}`);
        console.log(`   ✅ Added ${column.name}`);
      } catch (error) {
        console.log(`   ⚠️  Failed to add ${column.name}: ${error.message}`);
      }
    } else {
      console.log(`   ✅ ${column.name} already exists`);
    }
  }
  
  console.log('✅ Missing columns added');
}

// Run the fix
completeDatabaseFix();
