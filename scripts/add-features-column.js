import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Adding features column to cars table...');

try {
  // Add the features column to the cars table
  db.exec(`
    ALTER TABLE cars ADD COLUMN features TEXT DEFAULT '[]';
  `);
  
  console.log('✅ Features column added successfully!');
  
  // Update existing cars to have empty features array
  const updateResult = db.prepare(`
    UPDATE cars 
    SET features = '[]' 
    WHERE features IS NULL OR features = ''
  `).run();
  
  console.log(`✅ Updated ${updateResult.changes} existing cars with empty features array`);
  
  // Verify the column was added
  const tableInfo = db.prepare("PRAGMA table_info(cars)").all();
  const featuresColumn = tableInfo.find(col => col.name === 'features');
  
  if (featuresColumn) {
    console.log('✅ Features column verified in database schema');
    console.log('Column details:', featuresColumn);
  } else {
    console.log('❌ Features column not found in schema');
  }
  
} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('✅ Features column already exists');
  } else {
    console.error('❌ Error adding features column:', error.message);
  }
} finally {
  db.close();
}

console.log('Migration completed!');

