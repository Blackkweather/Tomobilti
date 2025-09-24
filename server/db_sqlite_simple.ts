import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, cars, bookings, reviews } from '@shared/sqlite-schema';
import type { User, Car, Booking, Review, InsertUser, InsertCar, InsertBooking, InsertReview, CarSearch } from '@shared/schema';
import { eq, and, gte, lte, inArray, like, sql as sqlOp, count, desc, asc } from 'drizzle-orm';
import type { IStorage } from './storage';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { cache } from './cache';

// Initialize SQLite database
const sqlite = new Database('./tomobilti.db');
export const db = drizzle(sqlite);

export class DatabaseStorage implements IStorage {
  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 12);
    const userWithHashedPassword = {
      ...insertUser,
      password: hashedPassword,
      id: randomUUID(),
    };
    
    const [user] = await db.insert(users).values(userWithHashedPassword).returning();
    return user;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    let updateData = { ...updates };
    if (updates.password) {
      updateData.password = await bcrypt.hash(updates.password, 12);
    }
    
    const [user] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Car operations
  async createCar(insertCar: InsertCar): Promise<Car> {
    const carWithId = {
      ...insertCar,
      id: randomUUID(),
    };
    
    const [car] = await db.insert(cars).values(carWithId).returning();
    
    // Invalidate car search cache
    cache.clear();
    
    return car;
  }

  async getCar(id: string): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car;
  }

  async getCarById(id: string): Promise<Car | null> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car || null;
  }

  async getCarsByOwner(ownerId: string): Promise<Car[]> {
    return await db.select().from(cars).where(eq(cars.ownerId, ownerId));
  }

  async searchCars(filters: CarSearch): Promise<{ cars: Car[]; total: number }> {
    // Create cache key from filters
    const cacheKey = `cars_search_${JSON.stringify(filters)}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let query = db.select().from(cars);
    const conditions = [];

    // Always filter by availability first for better performance
    conditions.push(eq(cars.isAvailable, true));

    if (filters.location) {
      conditions.push(like(cars.location, `%${filters.location}%`));
    }
    if (filters.city) {
      conditions.push(like(cars.city, `%${filters.city}%`));
    }
    if (filters.fuelType && Array.isArray(filters.fuelType) && filters.fuelType.length > 0) {
      conditions.push(inArray(cars.fuelType, filters.fuelType));
    }
    if (filters.transmission) {
      conditions.push(eq(cars.transmission, filters.transmission));
    }
    if (filters.seats) {
      conditions.push(eq(cars.seats, filters.seats));
    }
    if (filters.minPrice) {
      conditions.push(gte(cars.pricePerDay, filters.minPrice));
    }
    if (filters.maxPrice) {
      conditions.push(lte(cars.pricePerDay, filters.maxPrice));
    }
    if (filters.ownerId) {
      conditions.push(eq(cars.ownerId, filters.ownerId));
    }

    // Date-based availability filtering
    if (filters.startDate && filters.endDate) {
      const requestStart = new Date(filters.startDate);
      const requestEnd = new Date(filters.endDate);
      
      // Get all cars first, then filter by availability
      const allCars = await query.where(and(...conditions));
      
      // Filter out cars that have conflicting bookings
      const availableCars = await Promise.all(
        allCars.map(async (car) => {
          const bookings = await this.getBookingsByCar(car.id);
          const hasConflict = bookings.some(booking => {
            if (booking.status === "cancelled") return false;
            
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);
            
            return (requestStart <= bookingEnd && requestEnd >= bookingStart);
          });
          
          return hasConflict ? null : car;
        })
      );
      
      const filteredCars = availableCars.filter(car => car !== null) as Car[];
      const total = filteredCars.length;
      
      // Pagination
      const start = (filters.page - 1) * filters.limit;
      const end = start + filters.limit;
      const paginatedCars = filteredCars.slice(start, end);

      const result = { cars: paginatedCars, total };
      cache.set(cacheKey, result, 2 * 60 * 1000); // Cache for 2 minutes
      return result;
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const allCars = await query;
    const total = allCars.length;
    
    // Simple pagination
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    const paginatedCars = allCars.slice(start, end);

    const result = { cars: paginatedCars, total };
    cache.set(cacheKey, result, 2 * 60 * 1000); // Cache for 2 minutes
    return result;
  }

  async updateCar(id: string, updates: Partial<InsertCar>): Promise<Car | undefined> {
    const [car] = await db.update(cars)
      .set(updates)
      .where(eq(cars.id, id))
      .returning();
    
    // Invalidate car search cache
    cache.clear();
    
    return car;
  }

  async deleteCar(id: string): Promise<boolean> {
    const result = await db.delete(cars).where(eq(cars.id, id));
    
    // Invalidate car search cache
    cache.clear();
    
    return result.changes > 0;
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingWithId = {
      ...insertBooking,
      id: randomUUID(),
    };
    
    const [booking] = await db.insert(bookings).values(bookingWithId).returning();
    return booking;
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByRenter(renterId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.renterId, renterId));
  }

  async getBookingsByOwner(ownerId: string): Promise<Booking[]> {
    const ownerCars = await this.getCarsByOwner(ownerId);
    const carIds = ownerCars.map(car => car.id);
    return await db.select().from(bookings).where(inArray(bookings.carId, carIds));
  }

  async getBookingsByCar(carId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.carId, carId));
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [booking] = await db.update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async cancelBooking(id: string): Promise<boolean> {
    const [booking] = await db.update(bookings)
      .set({ status: 'cancelled' })
      .where(eq(bookings.id, id))
      .returning();
    return !!booking;
  }

  // Review operations
  async createReview(insertReview: InsertReview): Promise<Review> {
    const reviewWithId = {
      ...insertReview,
      id: randomUUID(),
    };
    
    const [review] = await db.insert(reviews).values(reviewWithId).returning();
    return review;
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.reviewerId, userId));
  }

  async getReviewsByCarOwner(ownerId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.revieweeId, ownerId));
  }

  async getReviewsByCar(carId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.carId, carId));
  }

  async getOwnerStats(ownerId: string): Promise<{
    totalEarnings: number;
    totalBookings: number;
    averageRating: number;
    activeListings: number;
  }> {
    const ownerBookings = await this.getBookingsByOwner(ownerId);
    const ownerCars = await this.getCarsByOwner(ownerId);
    const ownerReviews = await this.getReviewsByCarOwner(ownerId);

    const completedBookings = ownerBookings.filter(b => b.status === "completed");
    const totalEarnings = completedBookings.reduce((sum, booking) => 
      sum + parseFloat(booking.totalAmount), 0
    );

    const averageRating = ownerReviews.length > 0
      ? ownerReviews.reduce((sum, review) => sum + review.rating, 0) / ownerReviews.length
      : 0;

    return {
      totalEarnings,
      totalBookings: ownerBookings.length,
      averageRating,
      activeListings: ownerCars.filter(car => car.isAvailable).length
    };
  }

  // Sample data initialization
  async initializeSampleData(): Promise<void> {
    try {
      // Check if data already exists
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        console.log('Sample data already exists, skipping initialization');
        return;
      }

      // Create sample users
      const sampleUsers = [
        {
          id: randomUUID(),
          email: 'ahmed.bennani@example.com',
          password: await bcrypt.hash('password123', 12),
          firstName: 'Ahmed',
          lastName: 'Bennani',
          userType: 'owner' as const,
          phone: '+212 6 12 34 56 78',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: randomUUID(),
          email: 'fatima.zahra@example.com',
          password: await bcrypt.hash('password123', 12),
          firstName: 'Fatima',
          lastName: 'Zahra',
          userType: 'renter' as const,
          phone: '+212 6 34 56 78 90',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      await db.insert(users).values(sampleUsers);

      // Create sample cars
      const sampleCars = [
        {
          id: randomUUID(),
          ownerId: sampleUsers[0].id,
          title: 'Toyota Camry - Berline Confortable',
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          pricePerDay: '250.00',
          location: 'Casablanca, Maarif',
          city: 'Casablanca',
          description: 'Voiture confortable et fiable, parfaite pour les familles',
          fuelType: 'essence',
          transmission: 'automatic',
          seats: 5,
          images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format'],
          isAvailable: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: randomUUID(),
          ownerId: sampleUsers[0].id,
          title: 'BMW X5 - SUV de Luxe',
          make: 'BMW',
          model: 'X5',
          year: 2023,
          pricePerDay: '480.00',
          location: 'Rabat, Agdal',
          city: 'Rabat',
          description: 'SUV de luxe avec toutes les options, conduite sportive',
          fuelType: 'essence',
          transmission: 'automatic',
          seats: 7,
          images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format'],
          isAvailable: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      await db.insert(cars).values(sampleCars);

      console.log('Sample data initialized successfully');
    } catch (error) {
      console.log('Sample data initialization skipped:', error.message);
    }
  }
}
