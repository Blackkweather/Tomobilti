import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, cars, bookings, reviews } from '@shared/schema';
import type { User, Car, Booking, Review, InsertUser, InsertCar, InsertBooking, InsertReview, CarSearch } from '@shared/schema';
import { eq, and, gte, lte, inArray, like, sql } from 'drizzle-orm';

// Initialize database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/tomobilti';
const sql = postgres(connectionString);
export const db = drizzle(sql);

export class DatabaseStorage {
  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
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
    let query = db.select().from(cars);
    const conditions = [];

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

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Get total count
    const totalQuery = db.select({ count: sql<number>`count(*)` }).from(cars);
    if (conditions.length > 0) {
      totalQuery = totalQuery.where(and(...conditions));
    }
    const [{ count: total }] = await totalQuery;

    // Apply pagination
    const offset = (filters.page - 1) * filters.limit;
    const results = await query.limit(filters.limit).offset(offset);

    return { cars: results, total };
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const [car] = await db.insert(cars).values(insertCar).returning();
    return car;
  }

  async updateCar(id: string, updates: Partial<InsertCar>): Promise<Car | undefined> {
    const [car] = await db.update(cars).set(updates).where(eq(cars.id, id)).returning();
    return car;
  }

  async deleteCar(id: string): Promise<boolean> {
    try {
      const result = await db.delete(cars).where(eq(cars.id, id));
      return result.changes > 0;
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
      .select()
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