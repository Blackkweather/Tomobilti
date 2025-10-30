const postgres = require('postgres');

async function forceUpdateLocalImages() {
  console.log('🔥 FORCE UPDATING ALL CAR IMAGES IN LOCAL DATABASE...');

  const sql = postgres('postgresql://postgres:brams324brams@localhost:5432/tomobilti', {
    ssl: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Force update each car with correct images using direct SQL
    console.log('1. FORCE updating Porsche...');
    await sql`UPDATE cars SET images = ARRAY['/assets/CLASSIC.png']::text[] WHERE make = 'Porsche' AND model = '911 F'`;
    
    console.log('2. FORCE updating Jaguar F-Type...');
    await sql`UPDATE cars SET images = ARRAY['/assets/jaguar f type convertible 1.jpg', '/assets/jaguar f type convertible 2.jpeg']::text[] WHERE make = 'Jaguar' AND model = 'F-Type'`;
    
    console.log('3. FORCE updating Tesla...');
    await sql`UPDATE cars SET images = ARRAY['/assets/Tesla.jpg']::text[] WHERE make = 'Tesla' AND model = 'Model X'`;
    
    console.log('4. FORCE updating Jaguar F-Pace...');
    await sql`UPDATE cars SET images = ARRAY['/assets/f pace suv.jpeg', '/assets/f pace suv 2.jpeg', '/assets/f pace suv 3.jpeg', '/assets/f pace suv 4.jpeg']::text[] WHERE make = 'Jaguar' AND model = 'F-Pace Sport'`;
    
    console.log('5. FORCE updating Range Rover...');
    await sql`UPDATE cars SET images = ARRAY['/assets/Range Rover.jpg']::text[] WHERE make = 'Range Rover' AND model = 'Evoque Sport'`;
    
    console.log('6. FORCE updating Ferrari...');
    await sql`UPDATE cars SET images = ARRAY['/assets/Ferrari.jpg', '/assets/ferrari 2.jpg', '/assets/ferrari 3.jpg', '/assets/ferrari 4.jpg']::text[] WHERE make = 'Ferrari' AND model = 'La Ferrari'`;

    // Verify all updates
    console.log('\n📊 VERIFYING ALL CAR IMAGES:');
    const cars = await sql`SELECT title, make, model, images FROM cars ORDER BY created_at`;
    
    cars.forEach((car, i) => {
      const imageCount = car.images ? car.images.length : 0;
      console.log(`${i+1}. ${car.title} (${car.make} ${car.model})`);
      console.log(`   Images: ${imageCount} pictures`);
      if (car.images && car.images.length > 0) {
        car.images.forEach((img, idx) => console.log(`     ${idx+1}. ${img}`));
      }
      console.log('');
    });

    console.log('🎉 ALL LOCAL CAR IMAGES FORCE UPDATED!');

  } catch (error) {
    console.error('❌ Error force updating car images:', error.message);
  } finally {
    await sql.end();
  }
}

forceUpdateLocalImages();


















