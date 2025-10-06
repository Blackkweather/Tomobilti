const postgres = require('postgres');
const bcrypt = require('bcrypt');

async function resetAndAddSixCars() {
  console.log('🚗 Clearing cars and adding your 6 specific cars...');
  
  const useSsl = process.env.DB_SSL === 'true';
  const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: useSsl ? { rejectUnauthorized } : false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Clear all cars
    console.log('🗑️ Clearing all cars...');
    await sql`DELETE FROM cars`;
    console.log('✅ Cars cleared');

    // Get or create owners
    let owners = await sql`SELECT id FROM users WHERE user_type = 'owner' LIMIT 3`;
    
    if (owners.length === 0) {
      console.log('👥 Creating owners...');
      const hashedPassword = await bcrypt.hash('demo_password_123', 12);
      
      owners = await sql`
        INSERT INTO users (id, email, password, first_name, last_name, phone, user_type, created_at, updated_at)
        VALUES 
          (gen_random_uuid(), 'ahmed.bennani@example.com', ${hashedPassword}, 'Ahmed', 'Bennani', '+212 6 12 34 56 78', 'owner', NOW(), NOW()),
          (gen_random_uuid(), 'youssef.alami@example.com', ${hashedPassword}, 'Youssef', 'Alami', '+212 6 23 45 67 89', 'owner', NOW(), NOW()),
          (gen_random_uuid(), 'sara.idrissi@example.com', ${hashedPassword}, 'Sara', 'Idrissi', '+212 6 45 67 89 01', 'owner', NOW(), NOW())
        RETURNING id
      `;
    }

    // Your 6 specific cars
    const cars = [
      {
        owner_id: owners[0].id,
        title: "Porsche 911 F Model - Classic Sports Car",
        description: "Iconic classic Porsche 911 F Model with timeless design and exceptional performance. Perfect for enthusiasts who appreciate automotive heritage and driving excellence.",
        make: "Porsche",
        model: "911 F",
        year: 1973,
        fuel_type: "essence",
        transmission: "manual",
        seats: 2,
        price_per_day: "120.00",
        currency: "GBP",
        location: "London, Westminster",
        city: "London",
        images: ["/assets/CLASSIC.png"],
        is_available: true
      },
      {
        owner_id: owners[1].id,
        title: "Jaguar F-Type Convertible - Luxury Sports Car",
        description: "Stunning Jaguar F-Type Convertible with breathtaking design and exhilarating performance. Experience the thrill of open-top driving with British luxury and style.",
        make: "Jaguar",
        model: "F-Type",
        year: 2023,
        fuel_type: "essence",
        transmission: "automatic",
        seats: 2,
        price_per_day: "95.00",
        currency: "GBP",
        location: "Manchester, City Centre",
        city: "Manchester",
        images: ["/assets/CONVERTIBLES.png"],
        is_available: true
      },
      {
        owner_id: owners[2].id,
        title: "Tesla Model X - Electric SUV",
        description: "Revolutionary Tesla Model X electric SUV with falcon-wing doors, autopilot capabilities, and zero emissions. Experience the future of automotive technology.",
        make: "Tesla",
        model: "Model X",
        year: 2023,
        fuel_type: "electric",
        transmission: "automatic",
        seats: 7,
        price_per_day: "110.00",
        currency: "GBP",
        location: "Edinburgh, New Town",
        city: "Edinburgh",
        images: ["/assets/ELECTRIC.png"],
        is_available: true
      },
      {
        owner_id: owners[0].id,
        title: "Jaguar F-Pace Sport - Performance SUV",
        description: "Dynamic Jaguar F-Pace Sport combining SUV practicality with sports car performance. Featuring advanced technology and luxurious interior finishes.",
        make: "Jaguar",
        model: "F-Pace Sport",
        year: 2023,
        fuel_type: "essence",
        transmission: "automatic",
        seats: 5,
        price_per_day: "85.00",
        currency: "GBP",
        location: "Birmingham, City Centre",
        city: "Birmingham",
        images: ["/assets/Sport car.png"],
        is_available: true
      },
      {
        owner_id: owners[1].id,
        title: "Range Rover Evoque Sport - Premium SUV",
        description: "Sophisticated Range Rover Evoque Sport with commanding presence and refined luxury. Perfect for urban adventures and countryside escapes.",
        make: "Range Rover",
        model: "Evoque Sport",
        year: 2023,
        fuel_type: "essence",
        transmission: "automatic",
        seats: 5,
        price_per_day: "75.00",
        currency: "GBP",
        location: "Liverpool, City Centre",
        city: "Liverpool",
        images: ["/assets/SUV.png"],
        is_available: true
      },
      {
        owner_id: owners[2].id,
        title: "Ferrari La Ferrari - Hybrid Hypercar",
        description: "Ferrari LaFerrari is a hybrid hypercar, the first in Ferrari's history, featuring a V12 engine and an electric motor for a combined output of 963 horsepower, enabling a top speed of over 217 mph and 0-60 mph in about 2.4 seconds",
        make: "Ferrari",
        model: "La Ferrari",
        year: 2022,
        fuel_type: "hybrid",
        transmission: "automatic",
        seats: 2,
        price_per_day: "5500.00",
        currency: "MAD",
        location: "Casablanca, Centre Ville",
        city: "Casablanca",
        images: ["/assets/Ferrari.jpg", "/assets/ferrari 2.jpg", "/assets/ferrari 3.jpg", "/assets/ferrari 4.jpg"],
        is_available: true
      }
    ];

    console.log('\n🚗 Adding your 6 specific cars...');
    
    for (const carData of cars) {
      const car = await sql`
        INSERT INTO cars (id, owner_id, title, description, make, model, year, fuel_type, transmission, seats, price_per_day, currency, location, city, images, is_available, created_at, updated_at)
        VALUES (gen_random_uuid(), ${carData.owner_id}, ${carData.title}, ${carData.description}, ${carData.make}, ${carData.model}, ${carData.year}, ${carData.fuel_type}, ${carData.transmission}, ${carData.seats}, ${carData.price_per_day}, ${carData.currency}, ${carData.location}, ${carData.city}, ${carData.images}, ${carData.is_available}, NOW(), NOW())
        RETURNING id, title, make, model, price_per_day, city
      `;
      console.log(`✅ Added: ${car[0].title} (${car[0].make} ${car[0].model}) - ${car[0].price_per_day} ${carData.currency}/day`);
    }

    console.log('\n🎉 Successfully added your 6 cars!');
    console.log('📊 Cars added:');
    console.log('1. Porsche 911 F Model (1973) - 120 GBP/day');
    console.log('2. Jaguar F-Type Convertible (2023) - 95 GBP/day');
    console.log('3. Tesla Model X (2023) - 110 GBP/day');
    console.log('4. Jaguar F-Pace Sport (2023) - 85 GBP/day');
    console.log('5. Range Rover Evoque Sport (2023) - 75 GBP/day');
    console.log('6. Ferrari La Ferrari (2022) - 5500 MAD/day');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

resetAndAddSixCars();
