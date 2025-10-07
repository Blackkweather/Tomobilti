const postgres = require('postgres');

async function checkActualImages() {
  console.log('🔍 Checking actual images in database...');

  const useSsl = process.env.DB_SSL === 'true';
  const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: useSsl ? { rejectUnauthorized } : { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    const cars = await sql`SELECT title, make, model, images FROM cars ORDER BY created_at`;
    
    console.log('📊 ACTUAL IMAGES IN DATABASE:');
    cars.forEach((car, i) => {
      const imageCount = car.images ? car.images.length : 0;
      console.log(`${i+1}. ${car.title} (${car.make} ${car.model})`);
      console.log(`   Images: ${imageCount} pictures`);
      if (car.images && car.images.length > 0) {
        car.images.forEach((img, idx) => console.log(`     ${idx+1}. ${img}`));
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking images:', error.message);
  } finally {
    await sql.end();
  }
}

checkActualImages();

