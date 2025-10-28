#!/usr/bin/env node

/**
 * Simple Database Schema Fix
 * Adds the missing membership_tier column to fix the blank page
 */

const postgres = require('postgres');

async function simpleDatabaseFix() {
  console.log('🔧 Simple Database Fix');
  console.log('=====================\n');
  
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
    console.log('\n🔍 Checking if membership_tier column exists...');
    
    // Check if membership_tier column exists
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'membership_tier'
    `;
    
    if (columns.length === 0) {
      console.log('❌ membership_tier column is missing!');
      console.log('🔧 Adding membership_tier column...');
      
      // Add the membership_tier column
      await sql.unsafe(`ALTER TABLE users ADD COLUMN membership_tier VARCHAR(50) DEFAULT 'none'`);
      console.log('✅ membership_tier column added successfully!');
    } else {
      console.log('✅ membership_tier column already exists');
    }
    
    console.log('\n🔍 Testing database connection...');
    
    // Test a simple query
    const testQuery = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`✅ Database connection working`);
    console.log(`   Users in database: ${testQuery[0].count}`);
    
    console.log('\n🎉 DATABASE FIX COMPLETE!');
    console.log('========================');
    console.log('✅ membership_tier column is present');
    console.log('✅ Database connection working');
    console.log('✅ Server should start properly now');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error.message);
  } finally {
    await sql.end();
  }
}

// Run the fix
simpleDatabaseFix();













