const postgres = require('postgres');

async function fixCurrencyToGBP() {
  console.log('🔧 Fixing currency to GBP for UK platform...');
  
  const useSsl = process.env.DB_SSL === 'true';
  const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: useSsl ? { rejectUnauthorized } : false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Update all cars to use GBP
    await sql`UPDATE cars SET currency = 'GBP'`;
    
    // Show updated cars
    const cars = await sql`SELECT title, make, model, price_per_day, currency FROM cars ORDER BY created_at`;
    
    console.log('\n✅ All cars now use GBP currency:');
    console.log('==================================');
    
    cars.forEach((car, i) => {
      console.log(`${i+1}. ${car.title} (${car.make} ${car.model}) - ${car.price_per_day} GBP/day`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

fixCurrencyToGBP();
