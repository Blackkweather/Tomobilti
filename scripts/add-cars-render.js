#!/usr/bin/env node

/**
 * Simple script to add cars to Render production database
 * Run this after getting your DATABASE_URL from Render dashboard
 */

import postgres from 'postgres';
import bcrypt from 'bcrypt';

async function addCarsToRender() {
  console.log('🚗 Adding cars to Render production database...');
  console.log('================================================\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL environment variable not set!');
    console.log('\n📋 To fix this:');
    console.log('1. Go to https://dashboard.render.com');
    console.log('2. Click on your "tomobilti-db" database');
    console.log('3. Go to "Info" tab');
    console.log('4. Copy the "External Database URL"');
    console.log('5. Set it as DATABASE_URL environment variable');
    console.log('\nExample:');
    console.log('export DATABASE_URL="postgres://user:pass@host:port/db"');
    console.log('node scripts/add-cars-render.js');
    process.exit(1);
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
    console.log('🔍 Testing database connection...');
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful');

    // Check existing data
    const users = await sql`SELECT * FROM users`;
    const cars = await sql`SELECT * FROM cars`;
    
    console.log(`📊 Current data:`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Cars: ${cars.length}`);

    if (cars.length > 0) {
      console.log('\n✅ Cars already exist in database!');
      console.log('🌐 Your website should be showing cars now.');
      console.log('🔗 Visit: https://sharewheelz.uk');
      return;
    }

    // Create users if none exist
    if (users.length === 0) {
      console.log('\n👥 Creating sample users...');
      const hashedPassword = await bcrypt.hash('demo_password_123', 12);
      
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

    console.log('\n🚗 Creating sample cars...');
    
    const cars = [
      {
        owner_id: owners[0].id,
        title: "BMW 3 Series - Luxe et Performance",
        description: "Berline allemande haut de gamme avec un design élégant et des performances exceptionnelles. Parfaite pour les déplacements professionnels.",
        make: "BMW",
        model: "3 Series",
        year: 2022,
        fuel_type: "essence",
        transmission: "automatic",
        seats: 5,
        price_per_day: "800.00",
        location: "Casablanca, Centre Ville",
        city: "Casablanca",
        images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format"],
        is_available: true
      },
      {
        owner_id: owners[1].id,
        title: "Mercedes C-Class - Confort Premium",
        description: "Berline de luxe avec intérieur cuir et technologies avancées. Idéale pour les voyages d'affaires.",
        make: "Mercedes",
        model: "C-Class",
        year: 2021,
        fuel_type: "essence",
        transmission: "automatic",
        seats: 5,
        price_per_day: "900.00",
        location: "Rabat, Agdal",
        city: "Rabat",
        images: ["https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&h=600&fit=crop&auto=format"],
        is_available: true
      },
      {
        owner_id: owners[2].id,
        title: "Audi A4 - Élégance et Technologie",
        description: "Berline sportive avec Quattro et technologies Audi. Conduite dynamique garantie.",
        make: "Audi",
        model: "A4",
        year: 2023,
        fuel_type: "essence",
        transmission: "automatic",
        seats: 5,
        price_per_day: "750.00",
        location: "Marrakech, Guéliz",
        city: "Marrakech",
        images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&auto=format"],
        is_available: true
      },
      {
        owner_id: owners[0].id,
        title: "Tesla Model 3 - Électrique Moderne",
        description: "Véhicule électrique haute technologie avec Autopilot. Écologique et performant.",
        make: "Tesla",
        model: "Model 3",
        year: 2023,
        fuel_type: "electric",
        transmission: "automatic",
        seats: 5,
        price_per_day: "1000.00",
        location: "Casablanca, Anfa",
        city: "Casablanca",
        images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&auto=format"],
        is_available: true
      },
      {
        owner_id: owners[1].id,
        title: "Range Rover Evoque - SUV de Luxe",
        description: "SUV premium avec capacités tout-terrain. Parfait pour explorer le Maroc.",
        make: "Range Rover",
        model: "Evoque",
        year: 2022,
        fuel_type: "diesel",
        transmission: "automatic",
        seats: 5,
        price_per_day: "1200.00",
        location: "Rabat, Hay Riad",
        city: "Rabat",
        images: ["https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&auto=format"],
        is_available: true
      },
      {
        owner_id: owners[2].id,
        title: "Ford Focus - Berline Sportive",
        description: "Berline sportive avec excellent rapport qualité-prix. Conduite dynamique assurée.",
        make: "Ford",
        model: "Focus",
        year: 2020,
        fuel_type: "essence",
        transmission: "manual",
        seats: 5,
        price_per_day: "300.00",
        location: "Agadir, Secteur Touristique",
        city: "Agadir",
        images: ["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&auto=format"],
        is_available: true
      }
    ];

    for (const carData of cars) {
      const car = await sql`
        INSERT INTO cars (id, owner_id, title, description, make, model, year, fuel_type, transmission, seats, price_per_day, location, city, images, is_available, created_at, updated_at)
        VALUES (gen_random_uuid(), ${carData.owner_id}, ${carData.title}, ${carData.description}, ${carData.make}, ${carData.model}, ${carData.year}, ${carData.fuel_type}, ${carData.transmission}, ${carData.seats}, ${carData.price_per_day}, ${carData.location}, ${carData.city}, ${carData.images}, ${carData.is_available}, NOW(), NOW())
        RETURNING id, title, make, model, price_per_day, city
      `;
      console.log(`✅ Created: ${car[0].title} (${car[0].make} ${car[0].model})`);
    }

    console.log(`\n🎉 Successfully created ${cars.length} cars!`);
    console.log('🌐 Your cars should now appear on: https://sharewheelz.uk');
    console.log('\n📊 Final database status:');
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

addCarsToRender();
