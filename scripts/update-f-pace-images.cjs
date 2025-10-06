const postgres = require('postgres');

async function updateFPaceImages() {
  console.log('🚙 Updating Jaguar F-Pace images to the selected white-square assets...');

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
      '/assets/f pace suv.jpeg',
      '/assets/f pace suv 2.jpeg',
      '/assets/f pace suv 3.jpeg',
      '/assets/f pace suv 4.jpeg',
    ];

    const result = await sql`
      UPDATE cars 
      SET images = ARRAY[${images[0]}, ${images[1]}, ${images[2]}, ${images[3]}]::text[]
      WHERE make = 'Jaguar' AND model = 'F-Pace Sport'
      RETURNING title, make, model, images
    `;

    if (result.length === 0) {
      console.log('❌ Jaguar F-Pace not found');
    } else {
      const car = result[0];
      console.log(`✅ Updated: ${car.title} (${car.make} ${car.model})`);
      console.log(`📸 Images count: ${car.images.length}`);
      car.images.forEach((img, i) => console.log(`   ${i + 1}. ${img}`));
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await sql.end();
  }
}

updateFPaceImages();
