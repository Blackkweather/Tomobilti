const postgres = require('postgres');

async function listCarsInRender() {
  console.log('🚗 Cars in your Render database:');
  
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    const cars = await sql`SELECT title, make, model, year, price_per_day, currency, city, images FROM cars ORDER BY created_at`;
    
    console.log(`\n📊 Found ${cars.length} cars:`);
    console.log('==============================');
    
    cars.forEach((car, i) => {
      const imageCount = car.images ? car.images.length : 0;
      console.log(`${i+1}. ${car.title}`);
      console.log(`   ${car.make} ${car.model} (${car.year})`);
      console.log(`   Price: ${car.price_per_day} ${car.currency}/day`);
      console.log(`   Location: ${car.city}`);
      console.log(`   Images: ${imageCount} pictures`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

listCarsInRender();




