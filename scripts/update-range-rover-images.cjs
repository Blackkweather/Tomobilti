const postgres = require('postgres');

async function updateRangeRoverImages() {
  console.log('🚙 Updating Range Rover Evoque Sport images to the selected asset...');

  const useSsl = process.env.DB_SSL === 'true';
  const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: useSsl ? { rejectUnauthorized } : { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    const images = [
      '/assets/Range Rover.jpg',
    ];

    const result = await sql`
      UPDATE cars 
      SET images = ARRAY[${images[0]}]::text[]
      WHERE make = 'Range Rover' AND model = 'Evoque Sport'
      RETURNING title, make, model, images
    `;
    
    if (result.length > 0) {
      const car = result[0];
      console.log('✅ Range Rover Evoque Sport images updated:');
      console.log(`   ${car.title} (${car.make} ${car.model})`);
      console.log(`   Images: ${car.images.length} picture`);
      car.images.forEach((img, i) => console.log(`     ${i+1}. ${img}`));
    } else {
      console.log('❌ Range Rover Evoque Sport not found');
    }

  } catch (error) {
    console.error('❌ Error updating Range Rover Evoque Sport images:', error.message);
  } finally {
    await sql.end();
  }
}

updateRangeRoverImages();






















