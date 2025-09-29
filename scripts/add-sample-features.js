import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Adding sample features to existing cars...');

try {
  // Get all cars
  const cars = db.prepare('SELECT id, make, model FROM cars').all();
  
  console.log(`Found ${cars.length} cars to update`);
  
  // Sample features to add
  const sampleFeatures = [
    "Air Conditioning",
    "Bluetooth", 
    "GPS Navigation",
    "Backup Camera",
    "Heated Seats"
  ];
  
  // Update each car with sample features
  const updateStmt = db.prepare(`
    UPDATE cars 
    SET features = ? 
    WHERE id = ?
  `);
  
  let updatedCount = 0;
  cars.forEach(car => {
    // Add 2-4 random features to each car
    const numFeatures = Math.floor(Math.random() * 3) + 2; // 2-4 features
    const carFeatures = sampleFeatures
      .sort(() => Math.random() - 0.5)
      .slice(0, numFeatures);
    
    updateStmt.run(JSON.stringify(carFeatures), car.id);
    console.log(`✅ ${car.make} ${car.model}: [${carFeatures.join(', ')}]`);
    updatedCount++;
  });
  
  console.log(`\n✅ Updated ${updatedCount} cars with sample features`);
  
  // Verify the updates
  const updatedCars = db.prepare('SELECT id, make, model, features FROM cars LIMIT 3').all();
  console.log('\nSample updated cars:');
  updatedCars.forEach(car => {
    const features = JSON.parse(car.features || '[]');
    console.log(`- ${car.make} ${car.model}: [${features.join(', ')}]`);
  });
  
} catch (error) {
  console.error('❌ Error updating cars:', error.message);
} finally {
  db.close();
}

console.log('\nSample features update completed!');

