import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Adding sample images to existing cars...');

try {
  // Get all cars
  const cars = db.prepare('SELECT id, make, model FROM cars').all();
  
  console.log(`Found ${cars.length} cars to update`);
  
  // Sample image URLs (using placeholder images)
  const sampleImages = [
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&auto=format'
  ];
  
  // Update each car with sample images
  const updateStmt = db.prepare(`
    UPDATE cars 
    SET images = ? 
    WHERE id = ?
  `);
  
  let updatedCount = 0;
  cars.forEach(car => {
    // Add 2-3 random images to each car
    const numImages = Math.floor(Math.random() * 2) + 2; // 2-3 images
    const carImages = sampleImages
      .sort(() => Math.random() - 0.5)
      .slice(0, numImages);
    
    updateStmt.run(JSON.stringify(carImages), car.id);
    console.log(`✅ ${car.make} ${car.model}: ${numImages} images added`);
    updatedCount++;
  });
  
  console.log(`\n✅ Updated ${updatedCount} cars with sample images`);
  
  // Verify the updates
  const updatedCars = db.prepare('SELECT id, make, model, images FROM cars LIMIT 3').all();
  console.log('\nSample updated cars:');
  updatedCars.forEach(car => {
    const images = JSON.parse(car.images || '[]');
    console.log(`- ${car.make} ${car.model}: ${images.length} images`);
  });
  
} catch (error) {
  console.error('❌ Error updating cars:', error.message);
} finally {
  db.close();
}

console.log('\nSample images update completed!');

