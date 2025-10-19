// Dev seed: ensure ONLY the 6 required cars exist in local SQLite (tomobilti.db)
// Usage: node scripts/dev-seed-6-cars.cjs

const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

const allowed = [
  {
    id: 'car-ferrari',
    title: 'Ferrari LaFerrari',
    description: 'Hybrid hypercar with 950 HP, combining electric motor and V12 engine for ultimate performance.',
    make: 'Ferrari',
    model: 'LaFerrari',
    year: 2022,
    fuel_type: 'hybrid',
    transmission: 'automatic',
    seats: 2,
    price_per_day: '500.00',
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
    title: 'Porsche 911 F-Type',
    description: 'Classic 1973 Porsche 911 F-Type with timeless design and pure driving experience.',
    make: 'Porsche',
    model: '911 F-Type',
    year: 1973,
    fuel_type: 'essence',
    transmission: 'manual',
    seats: 2,
    price_per_day: '200.00',
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
    title: 'Range Rover Sport',
    description: 'Luxury SUV with commanding presence, refined interior, and exceptional off-road capability.',
    make: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2023,
    fuel_type: 'diesel',
    transmission: 'automatic',
    seats: 5,
    price_per_day: '180.00',
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
    title: 'Tesla Model S Plaid',
    description: 'Fastest production sedan with 1,020 HP, 0-60 in 1.99s, and 396 mile range.',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    fuel_type: 'electric',
    transmission: 'automatic',
    seats: 5,
    price_per_day: '250.00',
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
    title: 'Jaguar F-Pace SVR',
    description: 'Performance SUV with 550 HP supercharged V8, combining luxury with thrilling dynamics.',
    make: 'Jaguar',
    model: 'F-Pace SVR',
    year: 2023,
    fuel_type: 'essence',
    transmission: 'automatic',
    seats: 5,
    price_per_day: '220.00',
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
    title: 'Jaguar F-Type R Convertible',
    description: 'British sports car with 575 HP supercharged V8, stunning design, and exhilarating open-top driving.',
    make: 'Jaguar',
    model: 'F-Type R Convertible',
    year: 2023,
    fuel_type: 'essence',
    transmission: 'automatic',
    seats: 2,
    price_per_day: '280.00',
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


