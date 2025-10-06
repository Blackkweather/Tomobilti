#!/usr/bin/env node

/**
 * Test script to check Render production database status
 */

import postgres from 'postgres';

async function testRenderDatabase() {
  console.log('🔍 Testing Render Production Database');
  console.log('=====================================\n');

  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not set!');
    console.log('\n📋 To get your DATABASE_URL:');
    console.log('1. Go to https://dashboard.render.com');
    console.log('2. Click on "tomobilti-db" database');
    console.log('3. Go to "Info" tab');
    console.log('4. Copy "External Database URL"');
    console.log('5. Set it: export DATABASE_URL="your_connection_string"');
    return;
  }

  console.log('✅ DATABASE_URL found');
  console.log(`📡 Connecting to: ${process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@')}`);

  const sql = postgres(process.env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Test connection
    console.log('🔍 Testing connection...');
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful');

    // Check tables exist
    console.log('\n📋 Checking database structure...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📊 Available tables:');
    tables.forEach(table => console.log(`   - ${table.table_name}`));

    // Check data counts
    console.log('\n📊 Data counts:');
    
    try {
      const users = await sql`SELECT COUNT(*) as count FROM users`;
      console.log(`   Users: ${users[0].count}`);
    } catch (e) {
      console.log('   Users: Table not found or error');
    }

    try {
      const cars = await sql`SELECT COUNT(*) as count FROM cars`;
      console.log(`   Cars: ${cars[0].count}`);
    } catch (e) {
      console.log('   Cars: Table not found or error');
    }

    try {
      const bookings = await sql`SELECT COUNT(*) as count FROM bookings`;
      console.log(`   Bookings: ${bookings[0].count}`);
    } catch (e) {
      console.log('   Bookings: Table not found or error');
    }

    // Test API endpoint
    console.log('\n🌐 Testing production API...');
    try {
      const response = await fetch('https://sharewheelz.uk/api/cars');
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API working! Found ${data.cars?.length || 0} cars`);
      } else {
        console.log(`❌ API error: ${response.status} ${response.statusText}`);
      }
    } catch (e) {
      console.log(`❌ API test failed: ${e.message}`);
    }

    console.log('\n🎯 Next steps:');
    console.log('1. If cars count is 0, run: node scripts/add-cars-render.js');
    console.log('2. If API is failing, check Render logs');
    console.log('3. Visit: https://sharewheelz.uk');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Authentication failed - check your DATABASE_URL');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Host not found - check your DATABASE_URL hostname');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Connection refused - check your DATABASE_URL port');
    }
  } finally {
    await sql.end();
  }
}

testRenderDatabase();
