const postgres = require('postgres');

async function checkFerrariImages() {
  console.log('🏎️ Checking Ferrari images...');
  
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    const ferrari = await sql`
      SELECT title, make, model, images 
      FROM cars 
      WHERE make = 'Ferrari' AND model = 'La Ferrari'
    `;
    
    if (ferrari.length > 0) {
      const car = ferrari[0];
      const imageCount = car.images ? car.images.length : 0;
      
      console.log(`✅ Found: ${car.title}`);
      console.log(`📸 Images: ${imageCount} pictures`);
      
      if (car.images && car.images.length > 0) {
        console.log('\n🖼️  Image files:');
        car.images.forEach((img, i) => {
          console.log(`   ${i+1}. ${img}`);
        });
      } else {
        console.log('❌ No images found');
      }
    } else {
      console.log('❌ Ferrari not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

checkFerrariImages();

