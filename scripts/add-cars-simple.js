import postgres from 'postgres';
import bcrypt from 'bcrypt';

// Database configuration
const config = {
  connectionString: process.env.DATABASE_URL || 'postgresql://demo_user:demo_password@localhost:5432/tomobilti_db',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  } : false
};

const sql = postgres(config.connectionString, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: config.ssl,
});

async function addCarsToProduction() {
  try {
    console.log('🚗 Adding cars to production database...');
    
    // Check if we have any users
    const users = await sql`SELECT * FROM users`;
    console.log(`Found ${users.length} users in database`);
    
    if (users.length === 0) {
      console.log('❌ No users found. Creating sample users first...');
      
      // Create sample users
      const hashedPassword = await bcrypt.hash('demo_password_123', 12);
      
      const owner1 = await sql`
        INSERT INTO users (id, email, password, first_name, last_name, phone, user_type, created_at, updated_at)
        VALUES (gen_random_uuid(), 'ahmed.bennani@example.com', ${hashedPassword}, 'Ahmed', 'Bennani', '+212 6 12 34 56 78', 'owner', NOW(), NOW())
        RETURNING id, email, first_name, last_name, user_type
      `;
      
      const owner2 = await sql`
        INSERT INTO users (id, email, password, first_name, last_name, phone, user_type, created_at, updated_at)
        VALUES (gen_random_uuid(), 'youssef.alami@example.com', ${hashedPassword}, 'Youssef', 'Alami', '+212 6 23 45 67 89', 'owner', NOW(), NOW())
        RETURNING id, email, first_name, last_name, user_type
      `;
      
      const owner3 = await sql`
        INSERT INTO users (id, email, password, first_name, last_name, phone, user_type, created_at, updated_at)
        VALUES (gen_random_uuid(), 'sara.idrissi@example.com', ${hashedPassword}, 'Sara', 'Idrissi', '+212 6 45 67 89 01', 'owner', NOW(), NOW())
        RETURNING id, email, first_name, last_name, user_type
      `;
      
      console.log('✅ Created sample users');
      users.push(...owner1, ...owner2, ...owner3);
    }
    
    // Get owners
    const owners = users.filter(user => user.user_type === 'owner');
    console.log(`Found ${owners.length} car owners`);
    
    // Check if we have cars
    const existingCars = await sql`SELECT * FROM cars`;
    console.log(`Found ${existingCars.length} cars in database`);
    
    if (existingCars.length === 0) {
      console.log('🚗 Creating sample cars...');
      
      // Create sample cars
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
        console.log(`✅ Created car: ${car[0].title}`);
      }
      
      console.log(`🎉 Successfully created ${cars.length} cars!`);
    } else {
      console.log('✅ Cars already exist in database');
    }
    
    // Final check
    const finalCars = await sql`SELECT * FROM cars`;
    console.log(`📊 Total cars in database: ${finalCars.length}`);
    
    if (finalCars.length > 0) {
      console.log('🎉 Cars are now available on the website!');
      console.log('🌐 Visit your website to see the cars: https://sharewheelz.uk');
    }
    
  } catch (error) {
    console.error('❌ Error adding cars:', error);
  } finally {
    await sql.end();
  }
}

addCarsToProduction();