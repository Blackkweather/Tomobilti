#!/usr/bin/env node

/**
 * Quick Fix: Add missing membership_tier column to production database
 * This fixes the "column membership_tier does not exist" error
 */

const postgres = require('postgres');

async function fixMembershipTierColumn() {
  console.log('🔧 FIXING: Adding missing membership_tier column to production database...\n');
  
  // Use the production database URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found in environment variables');
    console.log('   Make sure you have DATABASE_URL set in your Render environment');
    return;
  }

  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    console.log('1. Checking if membership_tier column exists...');
    
    // Check if column exists
    const columnExists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'membership_tier'
    `;
    
    if (columnExists.length > 0) {
      console.log('✅ membership_tier column already exists');
    } else {
      console.log('2. Adding membership_tier column...');
      
      // Add the missing column
      await sql`
        ALTER TABLE users 
        ADD COLUMN membership_tier VARCHAR(50) DEFAULT 'none'
      `;
      
      console.log('✅ membership_tier column added successfully');
    }
    
    console.log('\n3. Checking other membership columns...');
    
    // Check and add other membership columns if missing
    const membershipColumns = [
      { name: 'subscription_id', type: 'VARCHAR(255)' },
      { name: 'subscription_status', type: 'VARCHAR(50) DEFAULT \'inactive\'' },
      { name: 'subscription_current_period_end', type: 'TIMESTAMP' },
      { name: 'stripe_customer_id', type: 'VARCHAR(255)' },
      { name: 'loyalty_points', type: 'INTEGER DEFAULT 0' }
    ];
    
    for (const column of membershipColumns) {
      const exists = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = ${column.name}
      `;
      
      if (exists.length === 0) {
        console.log(`   Adding ${column.name}...`);
        await sql`ALTER TABLE users ADD COLUMN ${sql(column.name)} ${sql(column.type)}`;
        console.log(`   ✅ ${column.name} added`);
      } else {
        console.log(`   ✅ ${column.name} already exists`);
      }
    }
    
    console.log('\n4. Checking bookings table membership columns...');
    
    // Add membership columns to bookings table
    const bookingMembershipColumns = [
      { name: 'membership_discount', type: 'DECIMAL(10,2) DEFAULT 0' },
      { name: 'membership_discount_percentage', type: 'DECIMAL(5,2) DEFAULT 0' },
      { name: 'loyalty_points_earned', type: 'INTEGER DEFAULT 0' },
      { name: 'loyalty_points_redeemed', type: 'INTEGER DEFAULT 0' }
    ];
    
    for (const column of bookingMembershipColumns) {
      const exists = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = ${column.name}
      `;
      
      if (exists.length === 0) {
        console.log(`   Adding ${column.name} to bookings...`);
        await sql`ALTER TABLE bookings ADD COLUMN ${sql(column.name)} ${sql(column.type)}`;
        console.log(`   ✅ ${column.name} added to bookings`);
      } else {
        console.log(`   ✅ ${column.name} already exists in bookings`);
      }
    }
    
    console.log('\n5. Creating membership tables if they don\'t exist...');
    
    // Create loyalty_points_transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS loyalty_points_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
        points INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('   ✅ loyalty_points_transactions table ready');
    
    // Create membership_benefits table
    await sql`
      CREATE TABLE IF NOT EXISTS membership_benefits (
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
    console.log('   ✅ membership_benefits table ready');
    
    console.log('\n🎉 DATABASE SCHEMA FIXED!');
    console.log('   All membership columns and tables are now ready');
    console.log('   Your ShareWheelz platform should work without database errors');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Check your DATABASE_URL is correct');
    console.log('2. Ensure your database user has ALTER TABLE permissions');
    console.log('3. Try running this script again');
  } finally {
    await sql.end();
  }
}

// Run the fix
fixMembershipTierColumn();
