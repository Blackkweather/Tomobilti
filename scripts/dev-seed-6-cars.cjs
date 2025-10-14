// Dev seed: ensure ONLY the 6 required cars exist in local SQLite (tomobilti.db)
// Usage: node scripts/dev-seed-6-cars.cjs

const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

const allowed = [
  {
    id: 'car-ferrari',
    title: 'Ferrari - Supercar',
    description: 'High-performance Ferrari with stunning design and exhilarating drive.',
    make: 'Ferrari',
    model: '',
    year: 2022,
    fuel_type: 'essence',
    transmission: 'automatic',
    seats: 2,
    price_per_day: '150.00',
    currency: 'GBP',
    location: 'London, Westminster',
    city: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    images: JSON.stringify(['/assets/Ferrari.jpg','/assets/ferrari 2.jpg','/assets/ferrari 3.jpg','/assets/ferrari 4.jpg']),
    is_available: 1
  },
  {
    id: 'car-porsche-911f',
    title: 'Porsche 911 F Model - Classic Sports Car',
    description: 'Iconic classic Porsche 911 F Model with timeless design and exceptional performance.',
    make: 'Porsche',
    model: '911 F',
    year: 1973,
    fuel_type: 'essence',
    transmission: 'manual',
    seats: 2,
    price_per_day: '120.00',
    currency: 'GBP',
    location: 'Manchester, City Centre',
    city: 'Manchester',
    latitude: 53.4808,
    longitude: -2.2426,
    images: JSON.stringify(['/assets/CLASSIC.png']),
    is_available: 1
  },
  {
    id: 'car-rangerover',
    title: 'Range Rover - Luxury SUV',
    description: 'Premium Range Rover SUV offering luxury and capability.',
    make: 'Land Rover',
    model: 'Range Rover',
    year: 2021,
    fuel_type: 'essence',
    transmission: 'automatic',
    seats: 5,
    price_per_day: '100.00',
    currency: 'GBP',
    location: 'Birmingham, City Centre',
    city: 'Birmingham',
    latitude: 52.4862,
    longitude: -1.8904,
    images: JSON.stringify(['/assets/Range Rover.jpg']),
    is_available: 1
  },
  {
    id: 'car-tesla',
    title: 'Tesla - Electric',
    description: 'Modern Tesla electric car with zero emissions.',
    make: 'Tesla',
    model: '',
    year: 2023,
    fuel_type: 'electric',
    transmission: 'automatic',
    seats: 5,
    price_per_day: '110.00',
    currency: 'GBP',
    location: 'Edinburgh, New Town',
    city: 'Edinburgh',
    latitude: 55.9533,
    longitude: -3.1883,
    images: JSON.stringify(['/assets/Tesla.jpg']),
    is_available: 1
  },
  {
    id: 'car-jaguar-fpace',
    title: 'Jaguar F-Pace - SUV',
    description: 'Luxury Jaguar F-Pace SUV with refined comfort and performance.',
    make: 'Jaguar',
    model: 'F-Pace',
    year: 2022,
    fuel_type: 'essence',
    transmission: 'automatic',
    seats: 5,
    price_per_day: '90.00',
    currency: 'GBP',
    location: 'Leeds, City Centre',
    city: 'Leeds',
    latitude: 53.8008,
    longitude: -1.5491,
    images: JSON.stringify(['/assets/f pace suv.jpeg','/assets/f pace suv 2.jpeg','/assets/f pace suv 3.jpeg','/assets/f pace suv 4.jpeg']),
    is_available: 1
  },
  {
    id: 'car-jaguar-ftype',
    title: 'Jaguar F-Type Convertible - Luxury Sports Car',
    description: 'Stunning Jaguar F-Type Convertible with breathtaking design and exhilarating performance.',
    make: 'Jaguar',
    model: 'F-Type Convertible',
    year: 2023,
    fuel_type: 'essence',
    transmission: 'automatic',
    seats: 2,
    price_per_day: '95.00',
    currency: 'GBP',
    location: 'Manchester, City Centre',
    city: 'Manchester',
    latitude: 53.4808,
    longitude: -2.2426,
    images: JSON.stringify(['/assets/jaguar f type convertible 1.jpg']),
    is_available: 1
  }
];

try {
  db.pragma('foreign_keys = ON');

  // Ensure at least one owner exists
  const ownerRow = db.prepare("SELECT id FROM users WHERE user_type = 'owner' LIMIT 1").get();
  let ownerId = ownerRow?.id;
  if (!ownerId) {
    const insertOwner = db.prepare("INSERT INTO users (id, email, first_name, last_name, user_type) VALUES (?, ?, ?, ?, 'owner')");
    ownerId = 'owner-seed-local-1';
    insertOwner.run(ownerId, 'owner@local.dev', 'Share', 'Wheelz');
  }

  // Delete cars not in allowed list
  const existing = db.prepare('SELECT id, title FROM cars').all();
  const allowedIds = new Set(allowed.map(c => c.id));
  const toDelete = existing.filter(r => !allowedIds.has(r.id));

  const delMessages = db.prepare('DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE booking_id IN (SELECT id FROM bookings WHERE car_id = ?))');
  const delConvs = db.prepare('DELETE FROM conversations WHERE booking_id IN (SELECT id FROM bookings WHERE car_id = ?)');
  const delReviews = db.prepare('DELETE FROM reviews WHERE car_id = ?');
  const delBookings = db.prepare('DELETE FROM bookings WHERE car_id = ?');
  const delCars = db.prepare('DELETE FROM cars WHERE id = ?');

  const txPurge = db.transaction(ids => {
    ids.forEach(id => {
      delMessages.run(id);
      delConvs.run(id);
      delReviews.run(id);
      delBookings.run(id);
      delCars.run(id);
    });
  });
  txPurge(toDelete.map(r => r.id));

  // Upsert allowed cars
  const upsert = db.prepare(`
    INSERT OR REPLACE INTO cars (
      id, owner_id, title, description, make, model, year, fuel_type, transmission, seats,
      price_per_day, currency, location, city, latitude, longitude, images, is_available,
      created_at, updated_at
    ) VALUES (
      @id, @owner_id, @title, @description, @make, @model, @year, @fuel_type, @transmission, @seats,
      @price_per_day, @currency, @location, @city, @latitude, @longitude, @images, @is_available,
      datetime('now'), datetime('now')
    )
  `);

  const txUpsert = db.transaction(rows => {
    rows.forEach(r => upsert.run({ ...r, owner_id: ownerId }));
  });
  txUpsert(allowed);

  const count = db.prepare('SELECT COUNT(*) as c FROM cars').get().c;
  console.log(`✅ Dev seed complete. Cars in DB: ${count}`);
} catch (e) {
  console.error('❌ Dev seed failed:', e.message);
  process.exit(1);
} finally {
  db.close();
}


