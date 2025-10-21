#!/usr/bin/env node

/**
 * Quick Database Migration Runner
 * Runs the perfect database migration to fix schema issues
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running ShareWheelz Database Migration...');
console.log('==========================================\n');

try {
  // Run the perfect database migration
  const migrationPath = path.join(__dirname, 'perfect-database-migration.cjs');
  execSync(`node "${migrationPath}"`, { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('\n✅ Database migration completed successfully!');
  console.log('🎉 Your database schema is now up to date!');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Ensure DATABASE_URL is set in environment variables');
  console.log('2. Check database connection permissions');
  console.log('3. Verify database is accessible from deployment environment');
  process.exit(1);
}





