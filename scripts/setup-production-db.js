import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { users, cars, bookings } from '../shared/sqlite-schema.js';

// Create production database
const sqlite = new Database('./tomobilti.db');
const db = drizzle(sqlite);

// Run migrations
migrate(db, { migrationsFolder: './migrations' });

console.log('✅ Production database setup completed');

// Add sample data for production
const sampleUsers = [
  {
    id: 'admin-user-001',
    email: 'admin@tomobilti.com',
    password: '$2b$10$rQZ8K9mN2pL3vX4wY5zA6eB7cD8fE9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9a',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+44 20 7123 4567',
    userType: 'both',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-owner-001',
    email: 'owner@tomobilti.com',
    password: '$2b$10$rQZ8K9mN2pL3vX4wY5zA6eB7cD8fE9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9a',
    firstName: 'Demo',
    lastName: 'Owner',
    phone: '+44 20 7123 4568',
    userType: 'owner',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-renter-001',
    email: 'renter@tomobilti.com',
    password: '$2b$10$rQZ8K9mN2pL3vX4wY5zA6eB7cD8fE9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9a',
    firstName: 'Demo',
    lastName: 'Renter',
    phone: '+44 20 7123 4569',
    userType: 'renter',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const sampleCars = [
  {
    id: 'car-001',
    title: 'BMW 3 Series - Premium Sedan',
    description: 'Luxury sedan perfect for business trips and city driving.',
    brand: 'BMW',
    model: '3 Series',
    year: 2022,
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 45,
    location: 'London, UK',
    images: JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format']),
    ownerId: 'demo-owner-001',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'car-002',
    title: 'Tesla Model 3 - Electric Excellence',
    description: 'Zero emissions luxury electric vehicle with autopilot.',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    fuelType: 'electric',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 65,
    location: 'Manchester, UK',
    images: JSON.stringify(['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format']),
    ownerId: 'demo-owner-001',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'car-003',
    title: 'Mercedes-Benz C-Class - Elegant Luxury',
    description: 'Sophisticated luxury sedan with premium features.',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2021,
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 55,
    location: 'Birmingham, UK',
    images: JSON.stringify(['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&auto=format']),
    ownerId: 'demo-owner-001',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Insert sample data
try {
  // Insert users
  for (const user of sampleUsers) {
    db.insert(users).values(user).run();
  }
  
  // Insert cars
  for (const car of sampleCars) {
    db.insert(cars).values(car).run();
  }
  
  console.log('✅ Sample data inserted successfully');
} catch (error) {
  console.log('⚠️ Sample data already exists or error occurred:', error.message);
}

sqlite.close();
console.log('🎉 Production database setup complete!');

