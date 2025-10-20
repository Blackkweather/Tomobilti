const postgres = require('postgres');

async function updateAllCarImages() {
  console.log('🚗 Updating ALL car images to correct assets...');

  const useSsl = process.env.DB_SSL === 'true';
  const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: useSsl ? { rejectUnauthorized } : { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Update each car with correct images
    const updates = [
      {
        make: 'Porsche',
        model: '911 F',
        images: ['/assets/CLASSIC.png']
      },
      {
        make: 'Jaguar',
        model: 'F-Type',
        images: ['/assets/jaguar f type convertible 1.jpg', '/assets/jaguar f type convertible 2.jpeg']
      },
      {
        make: 'Tesla',
        model: 'Model X',
        images: ['/assets/Tesla.jpg']
      },
      {
        make: 'Jaguar',
        model: 'F-Pace Sport',
        images: ['/assets/f pace suv.jpeg', '/assets/f pace suv 2.jpeg', '/assets/f pace suv 3.jpeg', '/assets/f pace suv 4.jpeg']
      },
      {
        make: 'Range Rover',
        model: 'Evoque Sport',
        images: ['/assets/Range Rover.jpg']
      },
      {
        make: 'Ferrari',
        model: 'La Ferrari',
        images: ['/assets/Ferrari.jpg', '/assets/ferrari 2.jpg', '/assets/ferrari 3.jpg', '/assets/ferrari 4.jpg']
      }
    ];

    for (const update of updates) {
      const result = await sql`
        UPDATE cars 
        SET images = ARRAY[${update.images.join(', ')}]::text[]
        WHERE make = ${update.make} AND model = ${update.model}
        RETURNING title, make, model, images
      `;
      
      if (result.length > 0) {
        const car = result[0];
        console.log(`✅ Updated: ${car.title}`);
        console.log(`   Images: ${car.images.length} pictures`);
        car.images.forEach((img, i) => console.log(`     ${i+1}. ${img}`));
        console.log('');
      } else {
        console.log(`❌ Not found: ${update.make} ${update.model}`);
      }
    }

    console.log('🎉 All car images updated!');

  } catch (error) {
    console.error('❌ Error updating car images:', error.message);
  } finally {
    await sql.end();
  }
}

updateAllCarImages();








