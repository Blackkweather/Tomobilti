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
    // Create sample users
    const owner1 = await this.createUser({
      email: "ahmed.bennani@example.com",
      password: "hashed_password",
      firstName: "Ahmed",
      lastName: "Bennani",
      phone: "+212 6 12 34 56 78",
      userType: "owner"
    });

    const owner2 = await this.createUser({
      email: "youssef.alami@example.com", 
      password: "hashed_password",
      firstName: "Youssef",
      lastName: "Alami",
      phone: "+212 6 23 45 67 89",
      userType: "owner"
    });

    const renter1 = await this.createUser({
      email: "fatima.zahra@example.com",
      password: "hashed_password", 
      firstName: "Fatima",
      lastName: "Zahra",
      phone: "+212 6 34 56 78 90",
      userType: "renter"
    });

    // Create sample cars
    await this.createCar({
      ownerId: owner1.id,
      title: "BMW Série 3 - Berline Premium",
      description: "Berline premium en excellent état, parfaite pour les déplacements d'affaires ou les sorties en famille.",
      make: "BMW",
      model: "Série 3",
      year: 2020,
      fuelType: "essence",
      transmission: "automatic",
      seats: 5,
      pricePerDay: "450.00",
      location: "Casablanca, Maarif",
      city: "Casablanca",
      images: ["/assets/generated_images/Car_rental_listing_photo_bdcce465.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Tesla Model 3 - Électrique",
      description: "Voiture électrique moderne avec autopilot, parfaite pour découvrir le Maroc en mode écologique.",
      make: "Tesla",
      model: "Model 3",
      year: 2022,
      fuelType: "electric",
      transmission: "automatic", 
      seats: 5,
      pricePerDay: "650.00",
      location: "Rabat, Agdal",
      city: "Rabat",
      images: ["/assets/generated_images/Electric_car_in_Morocco_b06b165b.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner1.id,
      title: "Peugeot 208 - Citadine Économique",
      description: "Citadine économique idéale pour les déplacements urbains à Marrakech.",
      make: "Peugeot",
      model: "208",
      year: 2019,
      fuelType: "diesel",
      transmission: "manual",
      seats: 4,
      pricePerDay: "280.00",
      location: "Marrakech, Guéliz",
      city: "Marrakech",
      images: ["/assets/generated_images/Car_rental_listing_photo_bdcce465.png"],
      isAvailable: true
    });
  }
}

export const storage = new MemStorage();