import { 
  type User, 
  type InsertUser, 
  type Car, 
  type InsertCar, 
  type Booking, 
  type InsertBooking,
  type Review,
  type InsertReview,
  type CarSearch
} from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Car operations
  getCar(id: string): Promise<Car | undefined>;
  getCarsByOwner(ownerId: string): Promise<Car[]>;
  searchCars(filters: CarSearch): Promise<{ cars: Car[]; total: number }>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: string, updates: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: string): Promise<boolean>;

  // Booking operations
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByRenter(renterId: string): Promise<Booking[]>;
  getBookingsByOwner(ownerId: string): Promise<Booking[]>;
  getBookingsByCar(carId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined>;
  cancelBooking(id: string): Promise<boolean>;

  // Review operations
  getReviewsByUser(userId: string): Promise<Review[]>;
  getReviewsByCarOwner(ownerId: string): Promise<Review[]>;
  getReviewsByCar(carId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Analytics operations
  getOwnerStats(ownerId: string): Promise<{
    totalEarnings: number;
    totalBookings: number;
    averageRating: number;
    activeListings: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cars: Map<string, Car>;
  private bookings: Map<string, Booking>;
  private reviews: Map<string, Review>;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser,
      phone: insertUser.phone ?? null,
      profileImage: insertUser.profileImage ?? null,
      userType: insertUser.userType ?? "renter",
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Car operations
  async getCar(id: string): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async getCarsByOwner(ownerId: string): Promise<Car[]> {
    return Array.from(this.cars.values()).filter(car => car.ownerId === ownerId);
  }

  async searchCars(filters: CarSearch): Promise<{ cars: Car[]; total: number }> {
    let results = Array.from(this.cars.values()).filter(car => car.isAvailable);

    // Date-based availability filtering
    if (filters.startDate && filters.endDate) {
      const requestStart = new Date(filters.startDate);
      const requestEnd = new Date(filters.endDate);
      
      // Filter out cars that have conflicting bookings
      const availableCars = await Promise.all(
        results.map(async (car) => {
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
      
      results = availableCars.filter(car => car !== null) as Car[];
    }

    // Apply other filters
    if (filters.city) {
      results = results.filter(car => 
        car.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.location) {
      results = results.filter(car =>
        car.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.fuelType && filters.fuelType.length > 0) {
      results = results.filter(car => filters.fuelType!.includes(car.fuelType));
    }

    if (filters.transmission) {
      results = results.filter(car => car.transmission === filters.transmission);
    }

    if (filters.seats !== undefined) {
      results = results.filter(car => car.seats >= filters.seats!);
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(car => parseFloat(car.pricePerDay) >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(car => parseFloat(car.pricePerDay) <= filters.maxPrice!);
    }

    // Pagination
    const total = results.length;
    const offset = (filters.page - 1) * filters.limit;
    const paginatedResults = results.slice(offset, offset + filters.limit);

    return { cars: paginatedResults, total };
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = randomUUID();
    const now = new Date();
    const car: Car = {
      ...insertCar,
      description: insertCar.description ?? null,
      latitude: insertCar.latitude ?? null,
      longitude: insertCar.longitude ?? null,
      currency: insertCar.currency ?? "MAD",
      isAvailable: insertCar.isAvailable ?? true,
      images: insertCar.images ?? [],
      id,
      createdAt: now,
      updatedAt: now
    };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: string, updates: Partial<InsertCar>): Promise<Car | undefined> {
    const car = this.cars.get(id);
    if (!car) return undefined;

    const updatedCar = {
      ...car,
      ...updates,
      updatedAt: new Date()
    };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async deleteCar(id: string): Promise<boolean> {
    return this.cars.delete(id);
  }

  // Booking operations
  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByRenter(renterId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.renterId === renterId);
  }

  async getBookingsByOwner(ownerId: string): Promise<Booking[]> {
    const ownerCars = await this.getCarsByOwner(ownerId);
    const carIds = ownerCars.map(car => car.id);
    return Array.from(this.bookings.values()).filter(booking => carIds.includes(booking.carId));
  }

  async getBookingsByCar(carId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.carId === carId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const now = new Date();
    const booking: Booking = {
      ...insertBooking,
      message: insertBooking.message ?? null,
      paymentIntentId: insertBooking.paymentIntentId ?? null,
      status: insertBooking.status ?? "pending",
      paymentStatus: insertBooking.paymentStatus ?? "pending",
      id,
      createdAt: now,
      updatedAt: now
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updatedBooking = {
      ...booking,
      ...updates,
      updatedAt: new Date()
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async cancelBooking(id: string): Promise<boolean> {
    const booking = this.bookings.get(id);
    if (!booking) return false;
    
    const updatedBooking = {
      ...booking,
      status: "cancelled" as const,
      updatedAt: new Date()
    };
    this.bookings.set(id, updatedBooking);
    return true;
  }

  // Review operations
  async getReviewsByUser(userId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.reviewerId === userId);
  }

  async getReviewsByCarOwner(ownerId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.revieweeId === ownerId);
  }

  async getReviewsByCar(carId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.carId === carId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      comment: insertReview.comment ?? null,
      id,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
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
  private async initializeSampleData() {
    const defaultPassword = process.env.DEMO_USER_PASSWORD || crypto.randomUUID();
    
    // Create sample users
    const owner1 = await this.createUser({
      email: "james.smith@example.com",
      password: defaultPassword,
      firstName: "James",
      lastName: "Smith",
      phone: "+44 7700 900123",
      userType: "owner"
    });

    const owner2 = await this.createUser({
      email: "sarah.johnson@example.com", 
      password: defaultPassword,
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "+44 7700 900456",
      userType: "owner"
    });

    const owner3 = await this.createUser({
      email: "michael.brown@example.com", 
      password: defaultPassword,
      firstName: "Michael",
      lastName: "Brown",
      phone: "+44 7700 900789",
      userType: "owner"
    });

    const renter1 = await this.createUser({
      email: "emma.davis@example.com",
      password: defaultPassword, 
      firstName: "Emma",
      lastName: "Davis",
      phone: "+44 7700 900012",
      userType: "renter"
    });

    // Create realistic cars with UK context
    await this.createCar({
      ownerId: owner1.id,
      title: "Ford Focus - Family Hatchback",
      description: "Spacious and economical family car perfect for UK roads. Air conditioning, built-in GPS.",
      make: "Ford",
      model: "Focus",
      year: 2021,
      fuelType: "petrol",
      transmission: "manual",
      seats: 5,
      pricePerDay: "45.00",
      location: "London, Westminster",
      city: "London",
      images: ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Vauxhall Corsa - Modern City Car",
      description: "Modern city car with all amenities. Perfect for urban driving, fuel efficient.",
      make: "Vauxhall",
      model: "Corsa",
      year: 2022,
      fuelType: "petrol",
      transmission: "automatic", 
      seats: 5,
      pricePerDay: "55.00",
      location: "Manchester, City Centre",
      city: "Manchester",
      images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner1.id,
      title: "BMW 1 Series - Elegant Compact",
      description: "Elegant compact car with refined finishes. Perfect for city commuting.",
      make: "BMW",
      model: "1 Series",
      year: 2020,
      fuelType: "diesel",
      transmission: "manual",
      seats: 4,
      pricePerDay: "75.00",
      location: "Birmingham, City Centre",
      city: "Birmingham",
      images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner3.id,
      title: "Range Rover Evoque - Comfortable SUV",
      description: "Spacious and comfortable SUV for your journeys. 4WD, automatic climate control.",
      make: "Land Rover",
      model: "Range Rover Evoque",
      year: 2021,
      fuelType: "diesel",
      transmission: "automatic",
      seats: 7,
      pricePerDay: "120.00",
      location: "Edinburgh, City Centre",
      city: "Edinburgh",
      images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Audi A3 - Premium Compact",
      description: "Premium compact with high-end finishes. Sporty and comfortable driving.",
      make: "Audi",
      model: "A3",
      year: 2021,
      fuelType: "petrol",
      transmission: "automatic",
      seats: 5,
      pricePerDay: "85.00",
      location: "Liverpool, City Centre",
      city: "Liverpool",
      images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner3.id,
      title: "Volkswagen Golf - Sporty Hatchback",
      description: "Sporty hatchback with excellent value for money. Dynamic driving guaranteed.",
      make: "Volkswagen",
      model: "Golf",
      year: 2020,
      fuelType: "petrol",
      transmission: "manual",
      seats: 5,
      pricePerDay: "65.00",
      location: "Bristol, City Centre",
      city: "Bristol",
      images: ["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner1.id,
      title: "Nissan Qashqai - Family Crossover",
      description: "Family crossover combining comfort and practicality. Elevated driving position.",
      make: "Nissan",
      model: "Qashqai",
      year: 2022,
      fuelType: "hybrid",
      transmission: "automatic",
      seats: 5,
      pricePerDay: "70.00",
      location: "Leeds, City Centre",
      city: "Leeds",
      images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Mini Cooper - Compact City Car",
      description: "Compact city car perfect for navigating UK streets. Economical and easy to park.",
      make: "Mini",
      model: "Cooper",
      year: 2021,
      fuelType: "petrol",
      transmission: "manual",
      seats: 4,
      pricePerDay: "60.00",
      location: "Glasgow, City Centre",
      city: "Glasgow",
      images: ["https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop&auto=format"],
      isAvailable: true
    });
  }
}

import { DatabaseStorage } from './db_sqlite_simple';

// Use SQLite storage instead of PostgreSQL for simplicity
export const storage = new DatabaseStorage();

// Initialize sample data on startup (non-blocking)
storage.initializeSampleData().catch((error) => {
  console.log('Sample data initialization skipped:', error.message);
  // Continue without sample data - this is not critical
});