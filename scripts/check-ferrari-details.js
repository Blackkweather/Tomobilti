import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('🔍 Checking Ferrari car details...');

// Get the Ferrari car with exact model name
const ferrariCar = db.prepare(`
  SELECT * FROM cars 
  WHERE make = 'Ferrari'
`).all();

console.log('🚗 Ferrari cars:', ferrariCar.map(car => ({
  id: car.id,
  make: car.make,
  model: car.model,
  title: car.title,
  description: car.description
})));

db.close();
console.log('✅ Database check completed');
