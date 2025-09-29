import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Restoring proper car-specific images...');

try {
  // Get all cars
  const cars = db.prepare('SELECT id, make, model, images FROM cars').all();
  
  console.log(`Found ${cars.length} cars to update`);
  
  // Define car-specific images
  const carImages = {
    'Ferrari': ['/assets/Ferrari.jpg', '/assets/ferrari 2.jpg', '/assets/ferrari 3.jpg', '/assets/ferrari 4.jpg'],
    'Porsche': ['/assets/hero-car-1.jpg', '/assets/hero-car-2.jpg'],
    'Jaguar': ['/assets/hero-car-2.jpg', '/assets/hero-car-3.jpg'],
    'Tesla': ['/assets/hero-car-1.jpg', '/assets/hero-car-3.jpg'],
    'Range Rover': ['/assets/hero-car-2.jpg', '/assets/hero-car-1.jpg']
  };
  
  // Update each car with appropriate images
  const updateStmt = db.prepare(`
    UPDATE cars 
    SET images = ? 
    WHERE id = ?
  `);
  
  let updatedCount = 0;
  cars.forEach(car => {
    // Get appropriate images for this car's make
    const makeImages = carImages[car.make] || carImages['Porsche']; // Default to Porsche images
    updateStmt.run(JSON.stringify(makeImages), car.id);
    console.log(`✅ ${car.make} ${car.model}: Updated with ${car.make}-specific images`);
    updatedCount++;
  });
  
  console.log(`\n✅ Updated ${updatedCount} cars with car-specific images`);
  
  // Verify the updates
  const updatedCars = db.prepare('SELECT id, make, model, images FROM cars').all();
  console.log('\nUpdated cars with their specific images:');
  updatedCars.forEach(car => {
    const images = JSON.parse(car.images || '[]');
    console.log(`- ${car.make} ${car.model}: ${images.length} images`);
    images.forEach(img => console.log(`  - ${img}`));
  });
  
} catch (error) {
  console.error('❌ Error updating cars:', error.message);
} finally {
  db.close();
}

console.log('\nCar-specific images update completed!');

