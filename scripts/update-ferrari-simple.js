import Database from 'better-sqlite3';

// Initialize SQLite database
const sqlite = new Database('./tomobilti.db');

try {
  console.log('🏎️ Updating Ferrari La Ferrari images...');
  
  const ferrariId = '7f12f473-66c2-4fa5-9773-b9e1c649def8';
  const ferrariImages = [
    '/assets/Ferrari.jpg',
    '/assets/ferrari 2.jpg', 
    '/assets/ferrari 3.jpg',
    '/assets/ferrari 4.jpg'
  ];
  
  // Update the Ferrari with all 4 images using raw SQL
  const updateStmt = sqlite.prepare(`
    UPDATE cars 
    SET images = ?, updated_at = datetime('now')
    WHERE id = ?
  `);
  
  const result = updateStmt.run(JSON.stringify(ferrariImages), ferrariId);
  
  if (result.changes > 0) {
    console.log('✅ Ferrari La Ferrari updated with 4 images:');
    ferrariImages.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img}`);
    });
    
    // Verify the update
    const selectStmt = sqlite.prepare('SELECT title, images FROM cars WHERE id = ?');
    const updatedFerrari = selectStmt.get(ferrariId);
    
    if (updatedFerrari) {
      const images = JSON.parse(updatedFerrari.images);
      console.log(`\n🎯 Verification: Ferrari now has ${images.length} images`);
      console.log(`📋 Title: ${updatedFerrari.title}`);
    }
  } else {
    console.log('❌ No Ferrari found with that ID');
  }
  
} catch (error) {
  console.error('❌ Error updating Ferrari images:', error);
} finally {
  sqlite.close();
}




