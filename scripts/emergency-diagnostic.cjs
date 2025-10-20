#!/usr/bin/env node

/**
 * Emergency Blank Page Diagnostic
 * Check what's causing the blank page issue
 */

const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

async function emergencyDiagnostic() {
  console.log('🚨 EMERGENCY BLANK PAGE DIAGNOSTIC');
  console.log('==================================\n');
  
  // Check environment
  console.log('📋 Environment Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');
  console.log('');
  
  // Check build files
  console.log('📁 Build Files Check:');
  const distPath = path.join(process.cwd(), 'dist');
  const publicPath = path.join(distPath, 'public');
  const indexHtmlPath = path.join(publicPath, 'index.html');
  
  if (fs.existsSync(indexHtmlPath)) {
    const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
    console.log('✅ index.html exists');
    console.log('   Size:', indexContent.length, 'bytes');
    console.log('   Contains React root:', indexContent.includes('root') ? 'Yes' : 'No');
    console.log('   Contains script tags:', (indexContent.match(/<script/g) || []).length);
  } else {
    console.log('❌ index.html missing');
  }
  
  // Check assets
  const assetsPath = path.join(publicPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    const assets = fs.readdirSync(assetsPath);
    console.log('✅ assets/ directory exists');
    console.log('   Files:', assets.length);
    
    // Check for main JS file
    const jsFiles = assets.filter(f => f.endsWith('.js'));
    console.log('   JS files:', jsFiles.length);
    
    // Check for main CSS file
    const cssFiles = assets.filter(f => f.endsWith('.css'));
    console.log('   CSS files:', cssFiles.length);
  } else {
    console.log('❌ assets/ directory missing');
  }
  
  console.log('');
  
  // Check database if available
  if (process.env.DATABASE_URL) {
    console.log('🗄️ Database Check:');
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      max: 1,
      idle_timeout: 30,
      connect_timeout: 15,
    });
    
    try {
      // Test basic connection
      const result = await sql`SELECT 1 as test`;
      console.log('✅ Database connection working');
      
      // Check tables
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      
      console.log('   Tables:', tables.length);
      console.log('   Table names:', tables.map(t => t.table_name).join(', '));
      
      // Check users table columns
      if (tables.some(t => t.table_name === 'users')) {
        const userColumns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users'
          ORDER BY column_name
        `;
        console.log('   Users table columns:', userColumns.length);
        
        // Check for critical columns
        const criticalColumns = ['membership_tier', 'email', 'first_name'];
        const missingColumns = criticalColumns.filter(col => 
          !userColumns.some(c => c.column_name === col)
        );
        
        if (missingColumns.length === 0) {
          console.log('✅ All critical user columns present');
        } else {
          console.log('❌ Missing user columns:', missingColumns.join(', '));
        }
      }
      
      // Check cars table columns
      if (tables.some(t => t.table_name === 'cars')) {
        const carColumns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'cars'
          ORDER BY column_name
        `;
        console.log('   Cars table columns:', carColumns.length);
        
        // Check for VIN column
        const hasVin = carColumns.some(c => c.column_name === 'vin');
        console.log('   VIN column:', hasVin ? '✅ Present' : '❌ Missing');
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
  console.log('🔍 BLANK PAGE ANALYSIS:');
  console.log('=======================');
  console.log('Possible causes:');
  console.log('1. JavaScript errors preventing React from loading');
  console.log('2. Missing or corrupted build files');
  console.log('3. Server-side errors during page rendering');
  console.log('4. Database connection issues');
  console.log('5. Environment variable problems');
  console.log('');
  console.log('🚀 RECOMMENDED ACTIONS:');
  console.log('1. Check browser console for JavaScript errors');
  console.log('2. Verify all assets are loading (Network tab)');
  console.log('3. Check server logs for errors');
  console.log('4. Test with a simple HTML page first');
}

// Run the diagnostic
emergencyDiagnostic();




