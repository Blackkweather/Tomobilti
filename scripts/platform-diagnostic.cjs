#!/usr/bin/env node

/**
 * ShareWheelz Platform Diagnostic
 * Comprehensive check of all platform components
 */

const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

async function platformDiagnostic() {
  console.log('🔍 ShareWheelz Platform Diagnostic');
  console.log('==================================\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'NOT SET');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');
  console.log('');
  
  // Check build files
  console.log('📁 Build Files Check:');
  const distPath = path.join(process.cwd(), 'dist');
  const publicPath = path.join(distPath, 'public');
  const indexHtmlPath = path.join(publicPath, 'index.html');
  
  if (fs.existsSync(distPath)) {
    console.log('✅ dist/ directory exists');
  } else {
    console.log('❌ dist/ directory missing');
  }
  
  if (fs.existsSync(publicPath)) {
    console.log('✅ dist/public/ directory exists');
  } else {
    console.log('❌ dist/public/ directory missing');
  }
  
  if (fs.existsSync(indexHtmlPath)) {
    console.log('✅ index.html exists');
    const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
    console.log('   Content length:', indexContent.length);
    console.log('   Contains React root:', indexContent.includes('root') ? 'Yes' : 'No');
  } else {
    console.log('❌ index.html missing');
  }
  
  // Check assets
  const assetsPath = path.join(publicPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    const assets = fs.readdirSync(assetsPath);
    console.log('✅ assets/ directory exists');
    console.log('   Files:', assets.length);
    console.log('   Files:', assets.slice(0, 5).join(', ') + (assets.length > 5 ? '...' : ''));
  } else {
    console.log('❌ assets/ directory missing');
  }
  
  console.log('');
  
  // Check database
  if (process.env.DATABASE_URL) {
    console.log('🗄️ Database Check:');
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      max: 1,
      idle_timeout: 30,
      connect_timeout: 15,
    });
    
    try {
      // Check if users table exists
      const usersTable = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'users'
      `;
      
      if (usersTable.length > 0) {
        console.log('✅ Users table exists');
        
        // Check columns
        const columns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users'
          ORDER BY column_name
        `;
        
        console.log('   Columns:', columns.length);
        console.log('   Column names:', columns.map(c => c.column_name).join(', '));
        
        // Check for critical columns
        const criticalColumns = ['membership_tier', 'subscription_id', 'subscription_status'];
        const missingColumns = criticalColumns.filter(col => 
          !columns.some(c => c.column_name === col)
        );
        
        if (missingColumns.length === 0) {
          console.log('✅ All critical columns present');
        } else {
          console.log('❌ Missing critical columns:', missingColumns.join(', '));
        }
        
        // Test query
        const testQuery = await sql`SELECT COUNT(*) as count FROM users`;
        console.log('✅ Database connection working');
        console.log('   Users in database:', testQuery[0].count);
        
      } else {
        console.log('❌ Users table does not exist');
      }
      
    } catch (error) {
      console.log('❌ Database error:', error.message);
    } finally {
      await sql.end();
    }
  } else {
    console.log('⚠️ DATABASE_URL not set - skipping database check');
  }
  
  console.log('');
  
  // Summary
  console.log('📊 DIAGNOSTIC SUMMARY:');
  console.log('=====================');
  console.log('✅ Environment variables checked');
  console.log('✅ Build files checked');
  console.log('✅ Database schema checked');
  console.log('');
  console.log('🚀 NEXT STEPS:');
  console.log('1. Check sharewheelz.uk in browser');
  console.log('2. Open browser console for errors');
  console.log('3. Check network tab for failed requests');
  console.log('4. Verify all assets are loading');
}

// Run the diagnostic
platformDiagnostic();
