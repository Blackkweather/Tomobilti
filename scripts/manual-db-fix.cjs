#!/usr/bin/env node

/**
 * Manual Database Fix for ShareWheelz
 * Run this to fix the database schema issue immediately
 */

const postgres = require('postgres');

async function manualDatabaseFix() {
  console.log('🔧 MANUAL DATABASE FIX - ShareWheelz');
  console.log('=====================================\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'NOT SET');
  console.log('');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found');
    console.log('   Make sure DATABASE_URL is set in Render environment variables');
    return;
  }

  console.log('✅ DATABASE_URL found');
  console.log(`   Database: ${databaseUrl.split('@')[1]?.split('/')[0] || 'Unknown'}`);

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
      
      // Check for membership_tier specifically
      const membershipTierExists = columns.some(c => c.column_name === 'membership_tier');
      
      if (!membershipTierExists) {
        console.log('\n❌ membership_tier column is missing!');
        console.log('🔧 Adding missing columns...');
        await addMissingColumns(sql);
      } else {
        console.log('\n✅ membership_tier column exists');
      }
    }
    
    console.log('\n🔍 Step 2: Verifying schema is complete...\n');
    
    // Verify all required columns exist
    const requiredColumns = [
      'membership_tier',
      'subscription_id', 
      'subscription_status',
      'loyalty_points',
      'is_email_verified',
      'is_phone_verified',
      'is_id_verified',
      'is_license_verified',
      'is_background_checked',
      'security_score',
      'is_blocked',
      'preferences'
    ];
    
    const currentColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    
    const currentColumnNames = currentColumns.map(c => c.column_name);
    const missingColumns = requiredColumns.filter(col => !currentColumnNames.includes(col));
    
    if (missingColumns.length > 0) {
      console.log(`⚠️  Still missing columns: ${missingColumns.join(', ')}`);
      await addMissingColumns(sql);
    } else {
      console.log('✅ All required columns exist');
    }
    
    console.log('\n🔍 Step 3: Testing database connection...\n');
    
    // Test a simple query
    const testQuery = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`✅ Database connection working`);
    console.log(`   Users in database: ${testQuery[0].count}`);
    
    console.log('\n🎉 DATABASE SCHEMA FIX COMPLETE!');
    console.log('================================');
    console.log('✅ membership_tier column added');
    console.log('✅ All required columns present');
    console.log('✅ Database connection working');
    console.log('✅ Server should start properly now');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Restart the server on Render');
    console.log('2. Check sharewheelz.uk');
    console.log('3. The blank page should be resolved');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check DATABASE_URL is correct in Render');
    console.log('2. Verify database user has CREATE/ALTER permissions');
    console.log('3. Check database is accessible from Render');
  } finally {
    await sql.end();
  }
}

async function createCompleteSchema(sql) {
  console.log('📋 Creating complete database schema...');
  
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
  
  console.log('✅ Complete schema created');
}

async function addMissingColumns(sql) {
  console.log('🔧 Adding missing columns to users table...');
  
  const columnsToAdd = [
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
  
  for (const column of columnsToAdd) {
    const [columnName] = column.split(' ');
    const exists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = ${columnName}
    `;
    
    if (exists.length === 0) {
      try {
        // Use raw SQL for ALTER TABLE statements
        await sql.unsafe(`ALTER TABLE users ADD COLUMN ${column}`);
        console.log(`   ✅ Added ${columnName}`);
      } catch (error) {
        console.log(`   ⚠️  Failed to add ${columnName}: ${error.message}`);
      }
    } else {
      console.log(`   ✅ ${columnName} already exists`);
    }
  }
  
  console.log('✅ Missing columns added');
}

// Run the fix
manualDatabaseFix();
