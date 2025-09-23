import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, cars, bookings, reviews } from '@shared/schema';
import type { User, Car, Booking, Review, InsertUser, InsertCar, InsertBooking, InsertReview, CarSearch } from '@shared/schema';
import { eq, and, gte, lte, inArray, like, sql as sqlOp, count, desc, asc } from 'drizzle-orm';
import type { IStorage } from './storage';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

// Initialize database connection with proper error handling
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = postgres(connectionString, {
  max: 20, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(sql);

export class DatabaseStorage implements IStorage {
  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash password before storing
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

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    // Hash password if it's being updated
    let updateData = { ...updates };
    if (updates.password) {
      updateData.password = await bcrypt.hash(updates.password, 12);
    }
    
    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Car operations
  async getCar(id: string): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car;
  }

  async getCarsByOwner(ownerId: string): Promise<Car[]> {
    return await db.select().from(cars).where(eq(cars.ownerId, ownerId));
  }

  async searchCars(filters: CarSearch): Promise<{ cars: Car[], total: number }> {
    const conditions = [eq(cars.isAvailable, true)];

    // Apply filters
    if (filters.city) {
      conditions.push(like(cars.city, `%${filters.city}%`));
    }

    if (filters.location) {
      conditions.push(like(cars.location, `%${filters.location}%`));
    }

    if (filters.fuelType && filters.fuelType.length > 0) {
      conditions.push(inArray(cars.fuelType, filters.fuelType));
    }

    if (filters.transmission) {
      conditions.push(eq(cars.transmission, filters.transmission));
    }

    if (filters.seats !== undefined) {
      conditions.push(gte(cars.seats, filters.seats));
    }

    if (filters.minPrice !== undefined) {
      conditions.push(gte(cars.pricePerDay, filters.minPrice.toString()));
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(lte(cars.pricePerDay, filters.maxPrice.toString()));
    }

    // Handle date-based availability filtering
    if (filters.startDate && filters.endDate) {
      // Subquery to find cars that don't have conflicting bookings
      const conflictingBookingsQuery = db
        .select({ carId: bookings.carId })
        .from(bookings)
        .where(
          and(
            eq(bookings.carId, cars.id),
            sqlOp`${bookings.status} != 'cancelled'`,
            sqlOp`(
              (${bookings.startDate} <= ${filters.endDate} AND ${bookings.endDate} >= ${filters.startDate})
            )`
          )
        );
      
      conditions.push(sqlOp`${cars.id} NOT IN (${conflictingBookingsQuery})`);
    }

    const whereClause = and(...conditions);

    // Get total count
    const [{ count: total }] = await db
      .select({ count: count() })
      .from(cars)
      .where(whereClause);

    // Apply sorting and pagination
    const sortColumn = filters.sortBy === 'price' ? cars.pricePerDay : cars.createdAt;
    const sortDirection = filters.sortOrder === 'desc' ? desc : asc;
    
    const offset = (filters.page - 1) * filters.limit;
    const results = await db
      .select()
      .from(cars)
      .where(whereClause)
      .orderBy(sortDirection(sortColumn))
      .limit(filters.limit)
      .offset(offset);

    return { cars: results, total };
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const carData = {
      ...insertCar,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const [car] = await db.insert(cars).values(carData).returning();
    return car;
  }

  async updateCar(id: string, updates: Partial<InsertCar>): Promise<Car | undefined> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    
    const [car] = await db
      .update(cars)
      .set(updateData)
      .where(eq(cars.id, id))
      .returning();
    return car;
  }

  async deleteCar(id: string): Promise<boolean> {
    try {
      const result = await db.delete(cars).where(eq(cars.id, id));
      return result.count > 0;
    } catch (error) {
      console.error('Error deleting car:', error);
      return false;
    }
  }

  // Booking operations
  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByRenter(renterId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.renterId, renterId));
  }

  async getBookingsByOwner(ownerId: string): Promise<Booking[]> {
    return await db
      .select({
        id: bookings.id,
        carId: bookings.carId,
        renterId: bookings.renterId,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        totalAmount: bookings.totalAmount,
        serviceFee: bookings.serviceFee,
        insurance: bookings.insurance,
        status: bookings.status,
        message: bookings.message,
        paymentStatus: bookings.paymentStatus,
        paymentIntentId: bookings.paymentIntentId,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
      })
      .from(bookings)
      .innerJoin(cars, eq(bookings.carId, cars.id))
      .where(eq(cars.ownerId, ownerId));
  }

  async getBookingsByCar(carId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.carId, carId));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const existing = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    if (existing.length === 0) return undefined;
    
    const [booking] = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
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
  async getReviewsByUser(userId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.reviewerId, userId));
  }

  async getReviewsByCarOwner(ownerId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.revieweeId, ownerId));
  }

  async getReviewsByCar(carId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.carId, carId));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
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

  // Initialize with sample data
  async initializeSampleData() {
    // Check if data already exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('Sample data already exists, skipping initialization');
      return;
    }

    // Create sample users
    const owner1 = await this.createUser({
      email: "ahmed.bennani@example.com",
      password: process.env.DEMO_USER_PASSWORD || "demo_password_123",
      firstName: "Ahmed",
      lastName: "Bennani",
      phone: "+212 6 12 34 56 78",
      userType: "owner"
    });

    const owner2 = await this.createUser({
      email: "youssef.alami@example.com", 
      password: process.env.DEMO_USER_PASSWORD || "demo_password_123",
      firstName: "Youssef",
      lastName: "Alami",
      phone: "+212 6 23 45 67 89",
      userType: "owner"
    });

    const owner3 = await this.createUser({
      email: "sara.idrissi@example.com", 
      password: process.env.DEMO_USER_PASSWORD || "demo_password_123",
      firstName: "Sara",
      lastName: "Idrissi",
      phone: "+212 6 45 67 89 01",
      userType: "owner"
    });

    await this.createUser({
      email: "fatima.zahra@example.com",
      password: process.env.DEMO_USER_PASSWORD || "demo_password_123", 
      firstName: "Fatima",
      lastName: "Zahra",
      phone: "+212 6 34 56 78 90",
      userType: "renter"
    });

    // Create realistic cars
    await this.createCar({
      ownerId: owner1.id,
      title: "Dacia Logan - Berline Familiale",
      description: "Berline spacieuse et économique, parfaite pour les familles. Climatisation, GPS intégré.",
      make: "Dacia",
      model: "Logan",
      year: 2021,
      fuelType: "essence",
      transmission: "manual",
      seats: 5,
      pricePerDay: "250.00",
      location: "Casablanca, Maarif",
      city: "Casablanca",
      images: ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Renault Clio - Citadine Moderne",
      description: "Citadine moderne avec toutes les commodités. Idéale pour la ville, consommation réduite.",
      make: "Renault",
      model: "Clio",
      year: 2022,
      fuelType: "essence",
      transmission: "automatic", 
      seats: 5,
      pricePerDay: "320.00",
      location: "Rabat, Agdal",
      city: "Rabat",
      images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner1.id,
      title: "Peugeot 208 - Compacte Élégante",
      description: "Compacte élégante avec finitions soignées. Parfaite pour les déplacements urbains.",
      make: "Peugeot",
      model: "208",
      year: 2020,
      fuelType: "diesel",
      transmission: "manual",
      seats: 4,
      pricePerDay: "280.00",
      location: "Marrakech, Guéliz",
      city: "Marrakech",
      images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner3.id,
      title: "Hyundai Tucson - SUV Confortable",
      description: "SUV spacieux et confortable pour vos voyages. 4x4, climatisation automatique.",
      make: "Hyundai",
      model: "Tucson",
      year: 2021,
      fuelType: "diesel",
      transmission: "automatic",
      seats: 7,
      pricePerDay: "480.00",
      location: "Fès, Centre-ville",
      city: "Fès",
      images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Volkswagen Golf - Compacte Premium",
      description: "Compacte premium avec finitions haut de gamme. Conduite sportive et confortable.",
      make: "Volkswagen",
      model: "Golf",
      year: 2021,
      fuelType: "essence",
      transmission: "automatic",
      seats: 5,
      pricePerDay: "380.00",
      location: "Tanger, Centre",
      city: "Tanger",
      images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner3.id,
      title: "Ford Focus - Berline Sportive",
      description: "Berline sportive avec excellent rapport qualité-prix. Conduite dynamique assurée.",
      make: "Ford",
      model: "Focus",
      year: 2020,
      fuelType: "essence",
      transmission: "manual",
      seats: 5,
      pricePerDay: "300.00",
      location: "Agadir, Secteur Touristique",
      city: "Agadir",
      images: ["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner1.id,
      title: "Nissan Qashqai - Crossover Familial",
      description: "Crossover familial alliant confort et praticité. Position de conduite surélevée.",
      make: "Nissan",
      model: "Qashqai",
      year: 2022,
      fuelType: "hybrid",
      transmission: "automatic",
      seats: 5,
      pricePerDay: "420.00",
      location: "Casablanca, Ain Diab",
      city: "Casablanca",
      images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Kia Picanto - Mini Citadine",
      description: "Mini citadine parfaite pour se faufiler en ville. Économique et facile à garer.",
      make: "Kia",
      model: "Picanto",
      year: 2021,
      fuelType: "essence",
      transmission: "manual",
      seats: 4,
      pricePerDay: "220.00",
      location: "Rabat, Hassan",
      city: "Rabat",
      images: ["https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    console.log('Sample data initialized successfully');
  }
}