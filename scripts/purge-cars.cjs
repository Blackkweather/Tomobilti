// Purge cars: keep only the six allowed cars; delete everything else
// Usage: node scripts/purge-cars.cjs [optional-path-to-db]

const path = require('path');
const Database = require('better-sqlite3');

const allowedTitles = new Set([
  'Ferrari - Supercar',
  'Porsche 911 F Model - Classic Sports Car',
  'Range Rover - Luxury SUV',
  'Tesla - Electric',
  'Jaguar F-Pace - SUV',
  'Jaguar F-Type Convertible - Luxury Sports Car'
]);

try {
  const dbPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(process.cwd(), 'tomobilti.db');
  const db = new Database(dbPath);

  const countBefore = db.prepare('SELECT COUNT(*) as cnt FROM cars').get().cnt;
  db.pragma('foreign_keys = ON');
  const rows = db.prepare('SELECT id, title FROM cars').all();

  const toDelete = rows.filter(r => !allowedTitles.has(r.title));

  const carIds = toDelete.map(r => r.id);

  const deleteMessagesByBooking = db.prepare('DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE booking_id IN (SELECT id FROM bookings WHERE car_id = ?))');
  const deleteConversationsByBooking = db.prepare('DELETE FROM conversations WHERE booking_id IN (SELECT id FROM bookings WHERE car_id = ?)');
  const deleteReviewsByCar = db.prepare('DELETE FROM reviews WHERE car_id = ?');
  const deleteBookingsByCar = db.prepare('DELETE FROM bookings WHERE car_id = ?');
  // Optional tables may not exist in some deployments
  let deleteFavoritesByCar;
  try {
    db.prepare('SELECT 1 FROM favorites LIMIT 1').get();
    deleteFavoritesByCar = db.prepare('DELETE FROM favorites WHERE car_id = ?');
  } catch (_) {
    deleteFavoritesByCar = { run: () => {} };
  }
  const deleteCar = db.prepare('DELETE FROM cars WHERE id = ?');

  const tx = db.transaction(ids => {
    ids.forEach(id => {
      try { deleteMessagesByBooking.run(id); } catch (_) {}
      try { deleteConversationsByBooking.run(id); } catch (_) {}
      try { deleteReviewsByCar.run(id); } catch (_) {}
      try { deleteBookingsByCar.run(id); } catch (_) {}
      try { deleteFavoritesByCar.run(id); } catch (_) {}
      deleteCar.run(id);
    });
  });
  tx(carIds);

  const countAfter = db.prepare('SELECT COUNT(*) as cnt FROM cars').get().cnt;
  console.log(`Purged ${toDelete.length} cars. Count before=${countBefore}, after=${countAfter}`);

  // Show remaining titles for verification
  const remaining = db.prepare('SELECT title FROM cars ORDER BY title').all().map(r => r.title);
  console.log('Remaining car titles:', remaining);

  db.close();
} catch (e) {
  console.error('Failed to purge cars:', e.message);
  process.exit(1);
}


