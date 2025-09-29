import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Updating all cars with Ferrari pictures...');

try {
  // Get all cars
  const cars = db.prepare('SELECT id, make, model, images FROM cars').all();
  
  console.log(`Found ${cars.length} cars to update`);
  
  // Use Ferrari images instead of generic hero car images
  const ferrariImages = [
    '/assets/Ferrari.jpg',
    '/assets/ferrari 2.jpg',
    '/assets/ferrari 3.jpg',
    '/assets/ferrari 4.jpg'
  ];
  
  // Update each car with local images only
  const updateStmt = db.prepare(`
    UPDATE cars 
    SET images = ? 
    WHERE id = ?
  `);
  
  let updatedCount = 0;
  cars.forEach(car => {
    // Replace ALL cars with Ferrari images - use all 4 Ferrari pictures
    const carImages = ferrariImages; // Use all Ferrari images
    updateStmt.run(JSON.stringify(carImages), car.id);
    console.log(`✅ ${car.make} ${car.model}: Updated with Ferrari pictures`);
    updatedCount++;
  });
  
  console.log(`\n✅ Updated ${updatedCount} cars with Ferrari pictures`);
  
  // Verify the updates
  const updatedCars = db.prepare('SELECT id, make, model, images FROM cars LIMIT 3').all();
  console.log('\nSample updated cars:');
  updatedCars.forEach(car => {
    const images = JSON.parse(car.images || '[]');
    console.log(`- ${car.make} ${car.model}: ${images.length} Ferrari images`);
    images.forEach(img => console.log(`  - ${img}`));
  });
  
} catch (error) {
  console.error('❌ Error updating cars:', error.message);
} finally {
  db.close();
}

console.log('\nFerrari images update completed!');
