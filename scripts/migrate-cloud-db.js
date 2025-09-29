#!/usr/bin/env node

/**
 * Cloud Database Migration Script for ShareWheelz
 * 
 * This script runs database migrations on your cloud PostgreSQL database
 * and initializes sample data.
 */

const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function runCloudMigrations() {
  console.log('🌐 ShareWheelz Cloud Database Migration');
  console.log('========================================\n');

  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
    console.log('❌ No cloud database URL found.');
    console.log('Please run: node scripts/setup-cloud-db.js first');
    process.exit(1);
  }

  console.log('📡 Connecting to cloud database...');
  
  // Database configuration
  const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
    } : false
  };

  const sql = postgres(config.connectionString, {
    max: 20,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: config.ssl,
    retry_delay: 1000,
    max_attempts: 3,
  });

  const db = drizzle(sql);

  try {
    // Test connection
    console.log('🔍 Testing database connection...');
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!\n');

    // Read and execute migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

      console.log(`📋 Found ${migrationFiles.length} migration files`);

      for (const file of migrationFiles) {
        console.log(`🔄 Running migration: ${file}`);
        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            await sql.unsafe(statement.trim());
          }
        }
        
        console.log(`✅ Migration ${file} completed`);
      }
    } else {
      console.log('⚠️  No migrations directory found, creating basic schema...');
      
      // Create basic tables if no migrations exist
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          phone VARCHAR(20),
          user_type VARCHAR(20) DEFAULT 'renter',
          is_verified BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS cars (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          make VARCHAR(100),
          model VARCHAR(100),
          year INTEGER,
          fuel_type VARCHAR(50),
          transmission VARCHAR(50),
          seats INTEGER,
          price_per_day DECIMAL(10,2),
          location VARCHAR(255),
          city VARCHAR(100),
          images TEXT[],
          is_available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
          renter_id UUID REFERENCES users(id) ON DELETE CASCADE,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          start_time TIME,
          end_time TIME,
          total_amount DECIMAL(10,2),
          service_fee DECIMAL(10,2),
          insurance DECIMAL(10,2),
          status VARCHAR(50) DEFAULT 'pending',
          message TEXT,
          payment_status VARCHAR(50) DEFAULT 'pending',
          payment_intent_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
          reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
          reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;

      // Create membership and subscription tables
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
        );
      `;

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
        );
      `;

      // Add membership fields to users table if they don't exist
      await sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS membership_tier VARCHAR(50) DEFAULT 'none',
        ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255),
        ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'inactive',
        ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP,
        ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
        ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
      `;

      // Add membership fields to bookings table if they don't exist
      await sql`
        ALTER TABLE bookings 
        ADD COLUMN IF NOT EXISTS membership_discount DECIMAL(10,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS membership_discount_percentage DECIMAL(5,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS loyalty_points_earned INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS loyalty_points_redeemed INTEGER DEFAULT 0;
      `;

      console.log('✅ Enhanced schema with membership features created');
    }

    // Initialize sample data
    console.log('\n🌱 Initializing sample data...');
    
    // Check if data already exists
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users`;
    if (existingUsers[0].count > 0) {
      console.log('ℹ️  Sample data already exists, skipping initialization');
    } else {
      // Create sample users
      const owner1 = await sql`
        INSERT INTO users (email, password, first_name, last_name, phone, user_type)
        VALUES ('ahmed.bennani@example.com', $1, 'Ahmed', 'Bennani', '+212 6 12 34 56 78', 'owner')
        RETURNING id
      `[await hashPassword('demo_password_123')];

      const owner2 = await sql`
        INSERT INTO users (email, password, first_name, last_name, phone, user_type)
        VALUES ('youssef.alami@example.com', $1, 'Youssef', 'Alami', '+212 6 23 45 67 89', 'owner')
        RETURNING id
      `[await hashPassword('demo_password_123')];

      const owner3 = await sql`
        INSERT INTO users (email, password, first_name, last_name, phone, user_type)
        VALUES ('sara.idrissi@example.com', $1, 'Sara', 'Idrissi', '+212 6 45 67 89 01', 'owner')
        RETURNING id
      `[await hashPassword('demo_password_123')];

      await sql`
        INSERT INTO users (email, password, first_name, last_name, phone, user_type)
        VALUES ('fatima.zahra@example.com', $1, 'Fatima', 'Zahra', '+212 6 34 56 78 90', 'renter')
      `[await hashPassword('demo_password_123')];

      // Create sample cars
      await sql`
        INSERT INTO cars (owner_id, title, description, make, model, year, fuel_type, transmission, seats, price_per_day, location, city, images)
        VALUES 
          ($1, 'Dacia Logan - Berline Familiale', 'Berline spacieuse et économique, parfaite pour les familles. Climatisation, GPS intégré.', 'Dacia', 'Logan', 2021, 'essence', 'manual', 5, 250.00, 'Casablanca, Maarif', 'Casablanca', ARRAY['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format']),
          ($2, 'Renault Clio - Citadine Moderne', 'Citadine moderne avec toutes les commodités. Idéale pour la ville, consommation réduite.', 'Renault', 'Clio', 2022, 'essence', 'automatic', 5, 320.00, 'Rabat, Agdal', 'Rabat', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format']),
          ($1, 'Peugeot 208 - Compacte Élégante', 'Compacte élégante avec finitions soignées. Parfaite pour les déplacements urbains.', 'Peugeot', '208', 2020, 'diesel', 'manual', 4, 280.00, 'Marrakech, Guéliz', 'Marrakech', ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format']),
          ($3, 'Hyundai Tucson - SUV Confortable', 'SUV spacieux et confortable pour vos voyages. 4x4, climatisation automatique.', 'Hyundai', 'Tucson', 2021, 'diesel', 'automatic', 7, 480.00, 'Fès, Centre-ville', 'Fès', ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format'])
      `[owner1[0].id, owner2[0].id, owner3[0].id];

      // Initialize membership benefits
      console.log('🎯 Initializing ShareWheelz membership benefits...');
      await sql`
        INSERT INTO membership_benefits (tier, benefit_type, value, description) VALUES
        ('basic', 'discount_percentage', 5.00, '5% discount on all rentals'),
        ('basic', 'points_multiplier', 1.00, '1 point per £1 spent'),
        ('basic', 'support_level', 1.00, 'Standard customer support'),
        ('basic', 'verification_level', 1.00, 'Basic verification'),
        ('basic', 'vehicle_access', 1.00, 'Access to member-only vehicles'),
        ('basic', 'digital_card', 1.00, 'ShareWheelz Digital Membership Card'),
        
        ('premium', 'discount_percentage', 15.00, '15% discount on all rentals'),
        ('premium', 'points_multiplier', 2.00, '2 points per £1 spent'),
        ('premium', 'support_level', 2.00, 'Priority customer support'),
        ('premium', 'verification_level', 2.00, 'Enhanced verification & insurance'),
        ('premium', 'vehicle_access', 2.00, 'Access to luxury vehicles'),
        ('premium', 'cancellation_policy', 1.00, 'Free cancellation up to 24h'),
        ('premium', 'exclusive_access', 1.00, 'Exclusive member events'),
        ('premium', 'digital_card', 1.00, 'ShareWheelz Premium Digital Card')
      `;

      // Update sample users with different membership tiers
      console.log('👥 Setting up sample users with membership tiers...');
      
      // Make owner1 a Premium member
      await sql`
        UPDATE users 
        SET membership_tier = 'premium', 
            subscription_status = 'active',
            subscription_current_period_end = NOW() + INTERVAL '1 month',
            loyalty_points = 1500
        WHERE email = 'ahmed.bennani@example.com'
      `;

      // Make owner2 a Basic member
      await sql`
        UPDATE users 
        SET membership_tier = 'basic', 
            subscription_status = 'active',
            subscription_current_period_end = NOW() + INTERVAL '1 month',
            loyalty_points = 800
        WHERE email = 'youssef.alami@example.com'
      `;

      // Make owner3 a Premium member
      await sql`
        UPDATE users 
        SET membership_tier = 'premium', 
            subscription_status = 'active',
            subscription_current_period_end = NOW() + INTERVAL '1 month',
            loyalty_points = 2200
        WHERE email = 'sara.idrissi@example.com'
      `;

      // Make renter a Basic member
      await sql`
        UPDATE users 
        SET membership_tier = 'basic', 
            subscription_status = 'active',
            subscription_current_period_end = NOW() + INTERVAL '1 month',
            loyalty_points = 450
        WHERE email = 'fatima.zahra@example.com'
      `;

      // Add some sample loyalty point transactions
      console.log('⭐ Adding sample loyalty point transactions...');
      await sql`
        INSERT INTO loyalty_points_transactions (user_id, points, type, description)
        SELECT 
          u.id,
          CASE 
            WHEN u.membership_tier = 'premium' THEN 200
            WHEN u.membership_tier = 'basic' THEN 100
            ELSE 50
          END,
          'bonus',
          'Welcome bonus for new member'
        FROM users u
        WHERE u.membership_tier IN ('basic', 'premium')
      `;

      console.log('✅ Sample data with membership features initialized successfully!');
    }

    console.log('\n🎉 Cloud database setup completed successfully!');
    console.log('🚀 You can now start your development server with: npm run dev');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

async function hashPassword(password) {
  const bcrypt = require('bcrypt');
  return await bcrypt.hash(password, 12);
}

// Run migrations
runCloudMigrations().catch(console.error);
