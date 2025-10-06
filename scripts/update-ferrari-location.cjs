const postgres = require('postgres');

async function updateFerrariLocation() {
  console.log('🏎️ Updating Ferrari location to London...');
  
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Update Ferrari location to London
    const result = await sql`
      UPDATE cars 
      SET location = 'London, Westminster', city = 'London'
      WHERE make = 'Ferrari' AND model = 'La Ferrari'
      RETURNING title, make, model, location, city
    `;
    
    if (result.length > 0) {
      console.log('✅ Ferrari location updated:');
      console.log(`   ${result[0].title}`);
      console.log(`   Location: ${result[0].location}`);
      console.log(`   City: ${result[0].city}`);
    } else {
      console.log('❌ Ferrari not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

updateFerrariLocation();
