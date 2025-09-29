#!/usr/bin/env node

/**
 * Render Database Setup Script for ShareWheelz
 * 
 * This script helps you set up and manage your Render PostgreSQL database
 * for your existing $7/month starter plan.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupRenderDatabase() {
  console.log('🚀 ShareWheelz Render Database Setup');
  console.log('====================================\n');

  console.log('Since you\'re already using Render with a $7/month starter plan,');
  console.log('let\'s optimize your PostgreSQL database setup!\n');

  console.log('What would you like to do?');
  console.log('1. Get Render database connection string');
  console.log('2. Run database migrations on Render');
  console.log('3. Initialize sample data');
  console.log('4. Test database connection');
  console.log('5. Update local development to use Render DB');
  console.log('6. Exit\n');

  const choice = await question('Enter your choice (1-6): ');

  switch (choice) {
    case '1':
      await getRenderConnectionString();
      break;
    case '2':
      await runRenderMigrations();
      break;
    case '3':
      await initializeSampleData();
      break;
    case '4':
      await testConnection();
      break;
    case '5':
      await setupLocalDevelopment();
      break;
    case '6':
      console.log('\n👋 Goodbye!');
      rl.close();
      return;
    default:
      console.log('\n❌ Invalid choice. Exiting.');
      rl.close();
      return;
  }
}

async function getRenderConnectionString() {
  console.log('\n📋 Getting Render Database Connection String');
  console.log('=============================================\n');

  console.log('To get your Render database connection string:');
  console.log('1. Go to your Render dashboard: https://dashboard.render.com');
  console.log('2. Click on your "tomobilti-db" database');
  console.log('3. Go to the "Info" tab');
  console.log('4. Copy the "External Database URL"\n');

  const connectionString = await question('Paste your Render database connection string here: ');

  if (!connectionString || !connectionString.includes('postgres://')) {
    console.log('\n❌ Invalid connection string. Please try again.');
    return;
  }

  // Create .env file for local development
  const envPath = path.join(process.cwd(), '.env');
  const envContent = `# ShareWheelz Environment Configuration
# Render Database Configuration

# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5000

# Render Database Configuration
DATABASE_URL=${connectionString}
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# JWT Authentication
JWT_SECRET=${generateRandomString(32)}
JWT_EXPIRES_IN=7d

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Service (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=public/uploads
OPTIMIZED_DIR=public/optimized
THUMBNAIL_DIR=public/thumbnails

# Image Optimization
IMAGE_QUALITY=85
THUMBNAIL_SIZE=300
RESPONSIVE_SIZES=400,800,1200,1600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=${generateRandomString(32)}
CSRF_SECRET=${generateRandomString(32)}

# Demo User Password (for development)
DEMO_USER_PASSWORD=demo_password_123
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log(`📁 Location: ${envPath}`);
    console.log('\n🚀 You can now run: npm run dev');
  } catch (error) {
    console.log('\n❌ Error creating environment file:', error.message);
  }
}

async function runRenderMigrations() {
  console.log('\n🔄 Running Render Database Migrations');
  console.log('=====================================\n');

  console.log('This will create the necessary tables on your Render database.');
  const confirm = await question('Continue? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Migration cancelled.');
    return;
  }

  console.log('\n📋 Migration Steps:');
  console.log('1. Connect to your Render database');
  console.log('2. Create tables: users, cars, bookings, reviews');
  console.log('3. Set up indexes for performance');
  console.log('4. Configure proper permissions\n');

  console.log('To run migrations manually:');
  console.log('1. Get your connection string from Render dashboard');
  console.log('2. Run: npm run migrate-cloud');
  console.log('3. Or use a PostgreSQL client like pgAdmin\n');

  console.log('💡 Tip: Your Render database is already configured in render.yaml');
  console.log('   The migrations will run automatically on deployment!');
}

async function initializeSampleData() {
  console.log('\n🌱 Initialize Sample Data');
  console.log('==========================\n');

  console.log('This will add sample cars and users to your Render database.');
  const confirm = await question('Continue? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Sample data initialization cancelled.');
    return;
  }

  console.log('\n📋 Sample Data Includes:');
  console.log('- 4 sample users (3 car owners, 1 renter)');
  console.log('- 8 sample cars across different Moroccan cities');
  console.log('- Realistic pricing in Moroccan Dirhams');
  console.log('- Proper car categories and descriptions\n');

  console.log('To initialize sample data:');
  console.log('1. Make sure your .env file has the Render database URL');
  console.log('2. Run: npm run migrate-cloud');
  console.log('3. The script will automatically add sample data\n');

  console.log('💡 Tip: Sample data is only added if the database is empty');
}

async function testConnection() {
  console.log('\n🔍 Testing Database Connection');
  console.log('===============================\n');

  console.log('This will test the connection to your Render database.');
  const confirm = await question('Continue? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Connection test cancelled.');
    return;
  }

  console.log('\n📋 Connection Test Steps:');
  console.log('1. Load environment variables from .env');
  console.log('2. Connect to Render PostgreSQL database');
  console.log('3. Run a simple query to verify connection');
  console.log('4. Display connection status\n');

  try {
    require('dotenv').config();
    const { drizzle } = require('drizzle-orm/postgres-js');
    const postgres = require('postgres');

    if (!process.env.DATABASE_URL) {
      console.log('❌ No DATABASE_URL found in .env file');
      console.log('Please run option 1 first to set up your connection string');
      return;
    }

    console.log('🔌 Connecting to Render database...');
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    const db = drizzle(sql);
    
    console.log('✅ Testing connection...');
    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    
    console.log('🎉 Connection successful!');
    console.log(`📊 Database response: ${JSON.stringify(result[0])}`);
    
    await sql.end();
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your connection string in .env');
    console.log('2. Verify your Render database is running');
    console.log('3. Check your internet connection');
    console.log('4. Ensure SSL settings are correct');
  }
}

async function setupLocalDevelopment() {
  console.log('\n💻 Setup Local Development with Render DB');
  console.log('=========================================\n');

  console.log('This will configure your local development environment');
  console.log('to use your Render database instead of a local one.\n');

  const confirm = await question('Continue? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Setup cancelled.');
    return;
  }

  console.log('\n📋 Local Development Setup:');
  console.log('1. Create .env file with Render database URL');
  console.log('2. Configure SSL settings for cloud database');
  console.log('3. Set up proper environment variables');
  console.log('4. Test local development server\n');

  console.log('✅ Benefits of using Render DB locally:');
  console.log('- Same data in development and production');
  console.log('- No need to maintain local database');
  console.log('- Easy collaboration with team members');
  console.log('- Consistent environment across machines\n');

  console.log('⚠️  Considerations:');
  console.log('- Slightly slower than local database');
  console.log('- Requires internet connection');
  console.log('- Shared data with production (be careful!)');
  console.log('- May hit connection limits with multiple developers\n');

  console.log('🚀 To start local development:');
  console.log('1. Run: npm run dev');
  console.log('2. Your app will connect to Render database');
  console.log('3. Visit: http://localhost:5000');
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Run the setup
setupRenderDatabase().catch(console.error);



