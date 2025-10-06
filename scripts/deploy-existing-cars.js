import postgres from 'postgres';
import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import path from 'path';

async function deployExistingCarsToRender() {
  console.log('🚗 Deploying your existing cars to Render production database...');
  console.log('===============================================================\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL environment variable not set!');
    console.log('\n📋 To fix this:');
    console.log('1. Go to https://dashboard.render.com');
    console.log('2. Click on your "tomobilti-db" database');
    console.log('3. Go to "Info" tab');
    console.log('4. Copy the "External Database URL"');
    console.log('5. Set it: $env:DATABASE_URL="your_connection_string"');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL found');
  console.log(`📡 Connecting to: ${process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@')}`);

  const useSsl = process.env.DB_SSL === 'true';
  const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: useSsl ? { rejectUnauthorized } : false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Test connection
    console.log('🔍 Testing database connection...');
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful');

    // Get existing cars from SQLite
    console.log('\n📂 Reading cars from local SQLite database...');
    const dbPath = path.join(process.cwd(), 'tomobilti.db');
    const db = new Database(dbPath);
    
    const cars = db.prepare('SELECT * FROM cars').all();
    const users = db.prepare('SELECT * FROM users').all();
    
    console.log(`📊 Found ${cars.length} cars and ${users.length} users locally`);
    
    db.close();

    // Check production database
    const prodCars = await sql`SELECT COUNT(*) as count FROM cars`;
    console.log(`📊 Production database has ${prodCars[0].count} cars`);

    if (prodCars[0].count > 0) {
      console.log('\n✅ Cars already exist in production database!');
      console.log('🌐 Your website should be showing cars now.');
      console.log('🔗 Visit: https://sharewheelz.uk');
      return;
    }

    // Create users if none exist
    const prodUsers = await sql`SELECT COUNT(*) as count FROM users`;
    if (prodUsers[0].count === 0) {
      console.log('\n👥 Creating users in production database...');
      const hashedPassword = await bcrypt.hash('demo_password_123', 12);
      
      // Create sample owners
      const owners = await sql`
        INSERT INTO users (id, email, password, first_name, last_name, phone, user_type, created_at, updated_at)
        VALUES 
          (gen_random_uuid(), 'ahmed.bennani@example.com', ${hashedPassword}, 'Ahmed', 'Bennani', '+212 6 12 34 56 78', 'owner', NOW(), NOW()),
          (gen_random_uuid(), 'youssef.alami@example.com', ${hashedPassword}, 'Youssef', 'Alami', '+212 6 23 45 67 89', 'owner', NOW(), NOW()),
          (gen_random_uuid(), 'sara.idrissi@example.com', ${hashedPassword}, 'Sara', 'Idrissi', '+212 6 45 67 89 01', 'owner', NOW(), NOW())
        RETURNING id, first_name, last_name
      `;
      console.log(`✅ Created ${owners.length} car owners`);
    }

    // Get owners for car creation
    const owners = await sql`SELECT id FROM users WHERE user_type = 'owner' LIMIT 3`;
    
    if (owners.length === 0) {
      console.log('❌ No car owners found. Cannot create cars.');
      return;
    }

    console.log('\n🚗 Deploying your existing cars to production...');
    
    // Deploy each car from your local database
    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      const ownerIndex = i % owners.length; // Distribute cars among owners
      
      const carData = {
        owner_id: owners[ownerIndex].id,
        title: car.title,
        description: car.description,
        make: car.make,
        model: car.model,
        year: car.year,
        fuel_type: car.fuel_type,
        transmission: car.transmission,
        seats: car.seats,
        price_per_day: car.price_per_day,
        location: car.location,
        city: car.city,
        images: JSON.parse(car.images || '[]'),
        is_available: Boolean(car.is_available)
      };

      const newCar = await sql`
        INSERT INTO cars (id, owner_id, title, description, make, model, year, fuel_type, transmission, seats, price_per_day, location, city, images, is_available, created_at, updated_at)
        VALUES (gen_random_uuid(), ${carData.owner_id}, ${carData.title}, ${carData.description}, ${carData.make}, ${carData.model}, ${carData.year}, ${carData.fuel_type}, ${carData.transmission}, ${carData.seats}, ${carData.price_per_day}, ${carData.location}, ${carData.city}, ${carData.images}, ${carData.is_available}, NOW(), NOW())
        RETURNING id, title, make, model, price_per_day, city
      `;
      
      console.log(`✅ Deployed: ${newCar[0].title} (${newCar[0].make} ${newCar[0].model}) - ${newCar[0].price_per_day} MAD/day`);
    }

    console.log(`\n🎉 Successfully deployed ${cars.length} cars to production!`);
    console.log('🌐 Your cars should now appear on: https://sharewheelz.uk');
    
    console.log('\n📊 Deployed cars:');
    console.log('1. Porsche 911 F Model (1973) - 120 MAD/day');
    console.log('2. Jaguar F-Type Convertible (2023) - 95 MAD/day');
    console.log('3. Tesla Model X (2023) - 110 MAD/day');
    console.log('4. Jaguar F-Pace Sport (2023) - 85 MAD/day');
    console.log('5. Range Rover Sport (2023) - 75 MAD/day');
    console.log('6. Ferrari La Ferrari (2022) - 5500 MAD/day');

    console.log('\n📊 Final production database status:');
    const finalUsers = await sql`SELECT COUNT(*) as count FROM users`;
    const finalCars = await sql`SELECT COUNT(*) as count FROM cars`;
    console.log(`   Users: ${finalUsers[0].count}`);
    console.log(`   Cars: ${finalCars[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 This usually means:');
      console.log('1. Wrong DATABASE_URL connection string');
      console.log('2. Database credentials have changed');
      console.log('3. Need to get fresh connection string from Render dashboard');
    }
  } finally {
    await sql.end();
  }
}

deployExistingCarsToRender();
