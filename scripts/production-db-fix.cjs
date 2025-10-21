#!/usr/bin/env node

/**
 * ShareWheelz Production Database Fix
 * Automatically fixes the database schema on Render deployment
 */

console.log('🚀 ShareWheelz Production Database Fix');
console.log('=====================================\n');

// Check if we're in production
if (process.env.NODE_ENV !== 'production') {
  console.log('⚠️  This script is designed for production deployment');
  console.log('   Set NODE_ENV=production to run');
  process.exit(0);
}

console.log('✅ Running in production mode');
console.log('🔧 Starting database schema fix...\n');

// Import and run the database fix
require('./fix-database-schema.cjs');





