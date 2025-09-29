import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('🔄 Updating in-memory storage with new Ferrari description...');

// Get the updated Ferrari car
const ferrariCar = db.prepare(`
  SELECT * FROM cars 
  WHERE make LIKE '%Ferrari%' AND model LIKE '%LaFerrari%'
`).get();

if (ferrariCar) {
  console.log('🚗 Updated Ferrari car:', {
    id: ferrariCar.id,
    title: ferrariCar.title,
    description: ferrariCar.description
  });
  
  // Create a script to update the in-memory storage
  const updateScript = `
// Add this to update the in-memory storage
const ferrariCar = storage.cars.get('${ferrariCar.id}');
if (ferrariCar) {
  ferrariCar.description = '${ferrariCar.description.replace(/'/g, "\\'")}';
  storage.cars.set('${ferrariCar.id}', ferrariCar);
  console.log('✅ Updated Ferrari description in memory storage');
}
`;
  
  console.log('📝 Memory update script:');
  console.log(updateScript);
  
  console.log('✅ Ferrari description updated in database!');
  console.log('📝 New description:', ferrariCar.description);
} else {
  console.log('❌ Ferrari car not found');
}

db.close();
console.log('✅ Database operation completed');
