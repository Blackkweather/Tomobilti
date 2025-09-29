import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('🔍 Finding Ferrari car...');

// Find the Ferrari car
const ferrariCar = db.prepare(`
  SELECT * FROM cars 
  WHERE make LIKE '%Ferrari%' OR model LIKE '%Ferrari%' OR model LIKE '%LaFerrari%'
`).all();

console.log('🚗 Ferrari cars found:', ferrariCar);

if (ferrariCar.length > 0) {
  const car = ferrariCar[0];
  console.log('📝 Current description:', car.description);
  
  // Update the description
  const newDescription = "Ferrari LaFerrari is a hybrid hypercar, the first in Ferrari's history, featuring a V12 engine and an electric motor for a combined output of 963 horsepower, enabling a top speed of over 217 mph and 0-60 mph in about 2.4 seconds";
  
  db.prepare(`
    UPDATE cars 
    SET description = ? 
    WHERE id = ?
  `).run(newDescription, car.id);
  
  console.log('✅ Updated Ferrari description!');
  console.log('📝 New description:', newDescription);
  
  // Verify the update
  const updatedCar = db.prepare(`
    SELECT id, make, model, description FROM cars WHERE id = ?
  `).get(car.id);
  
  console.log('🔍 Updated car:', updatedCar);
} else {
  console.log('❌ No Ferrari car found');
}

db.close();
console.log('✅ Database operation completed');
