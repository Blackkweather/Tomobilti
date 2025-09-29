import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Checking for duplicate cars...');

try {
  // Get all cars
  const cars = db.prepare('SELECT id, make, model, ownerId FROM cars ORDER BY make, model').all();
  
  console.log(`Found ${cars.length} total cars`);
  
  // Group cars by make and model to find duplicates
  const carGroups = {};
  cars.forEach(car => {
    const key = `${car.make} ${car.model}`;
    if (!carGroups[key]) {
      carGroups[key] = [];
    }
    carGroups[key].push(car);
  });
  
  // Find duplicates
  const duplicates = [];
  Object.keys(carGroups).forEach(key => {
    if (carGroups[key].length > 1) {
      duplicates.push({
        name: key,
        cars: carGroups[key]
      });
    }
  });
  
  console.log(`\nFound ${duplicates.length} duplicate car types:`);
  duplicates.forEach(dup => {
    console.log(`- ${dup.name}: ${dup.cars.length} copies`);
    dup.cars.forEach((car, index) => {
      console.log(`  ${index + 1}. ID: ${car.id}, Owner: ${car.ownerId}`);
    });
  });
  
  // Remove duplicates - keep the first one, delete the rest
  let removedCount = 0;
  duplicates.forEach(dup => {
    // Keep the first car, remove the rest
    const carsToRemove = dup.cars.slice(1);
    carsToRemove.forEach(car => {
      console.log(`🗑️ Removing duplicate: ${dup.name} (ID: ${car.id})`);
      db.prepare('DELETE FROM cars WHERE id = ?').run(car.id);
      removedCount++;
    });
  });
  
  console.log(`\n✅ Removed ${removedCount} duplicate cars`);
  
  // Verify the cleanup
  const remainingCars = db.prepare('SELECT id, make, model FROM cars ORDER BY make, model').all();
  console.log(`\nRemaining cars (${remainingCars.length}):`);
  remainingCars.forEach(car => {
    console.log(`- ${car.make} ${car.model} (ID: ${car.id})`);
  });
  
} catch (error) {
  console.error('❌ Error removing duplicates:', error.message);
} finally {
  db.close();
}

console.log('\nDuplicate removal completed!');

