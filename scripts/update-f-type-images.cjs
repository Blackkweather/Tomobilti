const postgres = require('postgres');

async function updateFTypeImages() {
  console.log('🏎️ Updating Jaguar F-Type Convertible images to the selected assets...');

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
      '/assets/jaguar f type convertible 1.jpg',
      '/assets/jaguar f type convertible 2.jpeg',
    ];

    const result = await sql`
      UPDATE cars 
      SET images = ARRAY[${images[0]}, ${images[1]}]::text[]
      WHERE make = 'Jaguar' AND model = 'F-Type'
      RETURNING title, make, model, images
    `;
    
    if (result.length > 0) {
      const car = result[0];
      console.log('✅ Jaguar F-Type Convertible images updated:');
      console.log(`   ${car.title} (${car.make} ${car.model})`);
      console.log(`   Images: ${car.images.length} pictures`);
      car.images.forEach((img, i) => console.log(`     ${i+1}. ${img}`));
    } else {
      console.log('❌ Jaguar F-Type Convertible not found.');
    }

  } catch (error) {
    console.error('❌ Error updating Jaguar F-Type Convertible images:', error.message);
  } finally {
    await sql.end();
  }
}

updateFTypeImages();


















