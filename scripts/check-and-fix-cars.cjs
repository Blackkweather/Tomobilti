const postgres = require('postgres');

async function checkAndFixCars() {
  console.log('🚗 Checking current cars and fixing currency...');
  
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Check current cars
    const cars = await sql`SELECT title, make, model, price_per_day, currency, images FROM cars ORDER BY created_at`;
    
    console.log('\n📊 Current cars:');
    console.log('================');
    
    cars.forEach((car, i) => {
      const imageCount = car.images ? car.images.length : 0;
      console.log(`${i+1}. ${car.title} (${car.make} ${car.model})`);
      console.log(`   Price: ${car.price_per_day} ${car.currency}/day`);
      console.log(`   Images: ${imageCount} pictures`);
      if (car.images && car.images.length > 0) {
        car.images.forEach((img, idx) => {
          console.log(`     ${idx+1}. ${img}`);
        });
      }
      console.log('');
    });

    // Fix currency to MAD for all cars
    console.log('🔧 Fixing currency to MAD for all cars...');
    await sql`UPDATE cars SET currency = 'MAD' WHERE currency != 'MAD'`;
    
    // Show updated cars
    const updatedCars = await sql`SELECT title, make, model, price_per_day, currency FROM cars ORDER BY created_at`;
    
    console.log('\n✅ Updated cars (all in MAD):');
    console.log('==============================');
    
    updatedCars.forEach((car, i) => {
      console.log(`${i+1}. ${car.title} (${car.make} ${car.model}) - ${car.price_per_day} MAD/day`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

checkAndFixCars();
