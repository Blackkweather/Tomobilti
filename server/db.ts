import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, cars, bookings, reviews, notifications } from '@shared/schema';
import type { User, Car, Booking, Review, InsertUser, InsertCar, InsertBooking, InsertReview, CarSearch, Notification, InsertNotification } from '@shared/schema';
import { eq, and, gte, lte, inArray, like, sql as sqlOp, count, desc, asc } from 'drizzle-orm';
import type { IStorage } from './storage';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

// Database configuration with cloud support
const getDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  console.log('Database configuration check:');
  console.log('DATABASE_URL:', databaseUrl ? 'SET' : 'NOT SET');
  console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // If DATABASE_URL is provided, use it (cloud or local PostgreSQL)
  if (databaseUrl && !databaseUrl.startsWith('file:')) {
    console.log('Using DATABASE_URL for connection');
    return {
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false
    };
  }
  
  // Fallback to individual parameters for cloud providers
  if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
    const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    console.log('Using individual DB parameters for connection');
    return {
      connectionString,
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
      } : false
    };
  }
  
  // For Render production, try to use Render's PostgreSQL if available
  if (process.env.NODE_ENV === 'production') {
    console.log('Production environment detected, checking for Render PostgreSQL...');
    
    // Check for Render PostgreSQL environment variables
    const renderDbUrl = process.env.RENDER_POSTGRES_URL || process.env.POSTGRES_URL;
    if (renderDbUrl) {
      console.log('Using Render PostgreSQL URL');
      return {
        connectionString: renderDbUrl,
        ssl: { rejectUnauthorized: false }
      };
    }
    
    // If no Render DB, try to construct from Render environment variables
    const renderDbHost = process.env.RENDER_POSTGRES_HOST || process.env.POSTGRES_HOST;
    const renderDbPort = process.env.RENDER_POSTGRES_PORT || process.env.POSTGRES_PORT || '5432';
    const renderDbName = process.env.RENDER_POSTGRES_DB || process.env.POSTGRES_DB;
    const renderDbUser = process.env.RENDER_POSTGRES_USER || process.env.POSTGRES_USER;
    const renderDbPassword = process.env.RENDER_POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD;
    
    if (renderDbHost && renderDbName && renderDbUser && renderDbPassword) {
      const connectionString = `postgresql://${renderDbUser}:${renderDbPassword}@${renderDbHost}:${renderDbPort}/${renderDbName}`;
      console.log('Using Render PostgreSQL parameters');
      return {
        connectionString,
        ssl: { rejectUnauthorized: false }
      };
    }
  }
  
  // Default local PostgreSQL
  console.log('Using localhost fallback for connection');
  return {
    connectionString: databaseUrl || 'postgresql://demo_user:demo_password@localhost:5432/tomobilti_db',
    ssl: false
  };
};

const config = getDatabaseConfig();

const sql = postgres(config.connectionString, {
  max: 20, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: config.ssl,
});

export const db = drizzle(sql);

export class DatabaseStorage implements IStorage {
  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const userData: any = {
      email: insertUser.email,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      phone: insertUser.phone,
      profileImage: insertUser.profileImage,
      userType: insertUser.userType || 'renter',
      id: randomUUID(),
    };

    // Only hash password if provided (for regular registration)
    if (insertUser.password) {
      userData.password = await bcrypt.hash(insertUser.password, 12);
    }
    
    const [user] = await db.insert(users).values(userData).returning();
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
    let updateData: any = { ...updates };
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
    if (filters.city && filters.city.trim() !== '') {
      conditions.push(like(cars.city, `%${filters.city}%`));
    }

    if (filters.location && filters.location.trim() !== '') {
      conditions.push(like(cars.location, `%${filters.location}%`));
    }

    if (filters.fuelType && filters.fuelType.length > 0) {
      conditions.push(inArray(cars.fuelType, filters.fuelType));
    }

    if (filters.transmission && filters.transmission.trim() !== '') {
      conditions.push(eq(cars.transmission, filters.transmission));
    }

    if (filters.seats !== undefined) {
      conditions.push(gte(cars.seats, filters.seats));
    }

    if (filters.minPrice !== undefined) {
      conditions.push(sqlOp`${cars.pricePerDay}::numeric >= ${filters.minPrice}`);
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(sqlOp`${cars.pricePerDay}::numeric <= ${filters.maxPrice}`);
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
    const carData: any = {
      ...insertCar,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const [car] = await db.insert(cars).values(carData).returning();
    return car;
  }

  async updateCar(id: string, updates: Partial<InsertCar>): Promise<Car | undefined> {
    const updateData: any = {
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
    const bookingData: any = {
      ...insertBooking,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const [booking] = await db.insert(bookings).values(bookingData).returning();
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
      .set({ status: 'cancelled' as any })
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
    const reviewData: any = {
      ...insertReview,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const [review] = await db.insert(reviews).values(reviewData).returning();
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
      // Sample data already exists, skipping initialization
      return;
    }

    await this.createSampleUsersAndCars();
  }

  // Force initialize cars even if users exist
  async forceInitializeCars() {
    try {
      console.log('Force initializing cars...');
      
      // Get existing users or create them
      let existingUsers = await db.select().from(users);
      console.log(`Found ${existingUsers.length} existing users`);
      
      let owners = existingUsers.filter(user => user.userType === 'owner');
      console.log(`Found ${owners.length} existing owners`);
      
      if (owners.length === 0) {
        console.log('No owners found, creating sample users and cars...');
        await this.createSampleUsersAndCars();
        console.log('Sample users and cars created successfully');
        return; // createSampleUsersAndCars already creates cars
      }
      
      // Check if cars exist
      const existingCars = await db.select().from(cars);
      console.log(`Found ${existingCars.length} existing cars`);
      
      if (existingCars.length > 0) {
        console.log('Cars already exist, skipping creation');
        return;
      }
      
      // If we have owners but no cars, we need to create cars
      console.log('Creating cars for existing owners...');
      await this.createSampleCarsForOwners(owners);
      
      // Verify cars were created
      const finalCars = await db.select().from(cars);
      console.log(`Successfully created ${finalCars.length} cars`);
      
    } catch (error) {
      console.error('Error in forceInitializeCars:', error);
      throw error;
    }
  }

  private async createSampleCarsForOwners(owners: any[]) {
    console.log(`Creating cars for ${owners.length} owners...`);
    
    const owner1 = owners[0];
    const owner2 = owners[1] || owners[0]; // Use first owner if only one exists
    
    // Create YOUR UK luxury cars for ShareWheelz platform
    await this.createCar({
      ownerId: owner1.id,
      title: "Porsche 911 F Model - Classic Sports Car",
      description: "Iconic classic Porsche 911 F Model with timeless design and exceptional performance. Perfect for enthusiasts who appreciate automotive heritage and driving excellence.",
      make: "Porsche",
      model: "911 F",
      year: 1973,
      fuelType: "essence",
      transmission: "manual",
      seats: 2,
      pricePerDay: "120.00",
      currency: "GBP",
      location: "London, Westminster",
      city: "London",
      latitude: 51.5074,
      longitude: -0.1278,
      images: ["/assets/CLASSIC.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Jaguar F-Type Convertible - Luxury Sports Car",
      description: "Stunning Jaguar F-Type Convertible with breathtaking design and exhilarating performance. Experience the thrill of open-top driving with British luxury and style.",
      make: "Jaguar",
      model: "F-Type",
      year: 2023,
      fuelType: "essence",
      transmission: "automatic",
      seats: 2,
      pricePerDay: "95.00",
      currency: "GBP",
      location: "Manchester, City Centre",
      city: "Manchester",
      latitude: 53.4808,
      longitude: -2.2426,
      images: ["/assets/CONVERTIBLES.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner1.id,
      title: "Tesla Model X - Electric SUV",
      description: "Revolutionary Tesla Model X electric SUV with falcon-wing doors, autopilot capabilities, and zero emissions. Experience the future of automotive technology.",
      make: "Tesla",
      model: "Model X",
      year: 2023,
      fuelType: "electric",
      transmission: "automatic",
      seats: 7,
      pricePerDay: "110.00",
      currency: "GBP",
      location: "Edinburgh, New Town",
      city: "Edinburgh",
      latitude: 55.9533,
      longitude: -3.1883,
      images: ["/assets/ELECTRIC.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Jaguar F-Pace Sport - Performance SUV",
      description: "Dynamic Jaguar F-Pace Sport combining SUV practicality with sports car performance. Featuring advanced technology and luxurious interior finishes.",
      make: "Jaguar",
      model: "F-Pace Sport",
      year: 2023,
      fuelType: "essence",
      transmission: "automatic",
      seats: 5,
      pricePerDay: "85.00",
      currency: "GBP",
      location: "Birmingham, City Centre",
      city: "Birmingham",
      latitude: 52.4862,
      longitude: -1.8904,
      images: ["/assets/SUV.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner1.id,
      title: "Ferrari LaFerrari - Hybrid Hypercar",
      description: "Ferrari LaFerrari is a hybrid hypercar, the first in Ferrari's history, featuring a V12 engine and an electric motor for a combined output of 963 horsepower, enabling a top speed of over 217 mph and 0-60 mph in about 2.4 seconds",
      make: "Ferrari",
      model: "LaFerrari",
      year: 2013,
      fuelType: "essence",
      transmission: "automatic",
      seats: 2,
      pricePerDay: "500.00",
      currency: "GBP",
      location: "London, Mayfair",
      city: "London",
      latitude: 51.5074,
      longitude: -0.1278,
      images: ["/assets/SPORTS.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Range Rover Evoque - Luxury Compact SUV",
      description: "Sophisticated Range Rover Evoque combining compact dimensions with luxury and capability. Perfect for urban adventures with premium comfort and advanced technology.",
      make: "Range Rover",
      model: "Evoque",
      year: 2023,
      fuelType: "essence",
      transmission: "automatic",
      seats: 5,
      pricePerDay: "75.00",
      currency: "GBP",
      location: "Liverpool, City Centre",
      city: "Liverpool",
      latitude: 53.4084,
      longitude: -2.9916,
      images: ["/assets/SUV.png"],
      isAvailable: true
    });

    console.log('Sample cars created successfully');
  }

  private async createSampleUsersAndCars() {
    const owner1 = await this.createUser({
      email: "john.smith@example.com",
      password: process.env.DEMO_USER_PASSWORD || "demo_password_123",
      firstName: "John",
      lastName: "Smith",
      phone: "+44 20 1234 5678",
      userType: "owner"
    });

    const owner2 = await this.createUser({
      email: "james.wilson@example.com", 
      password: process.env.DEMO_USER_PASSWORD || "demo_password_123",
      firstName: "James",
      lastName: "Wilson",
      phone: "+44 161 234 5678",
      userType: "owner"
    });

    const owner3 = await this.createUser({
      email: "sarah.jones@example.com", 
      password: process.env.DEMO_USER_PASSWORD || "demo_password_123",
      firstName: "Sarah",
      lastName: "Jones",
      phone: "+44 151 234 5678",
      userType: "owner"
    });

    await this.createUser({
      email: "emma.brown@example.com",
      password: process.env.DEMO_USER_PASSWORD || "demo_password_123", 
      firstName: "Emma",
      lastName: "Brown",
      phone: "+44 131 234 5678",
      userType: "renter"
    });

    // Create YOUR UK luxury cars for ShareWheelz platform
    await this.createCar({
      ownerId: owner1.id,
      title: "Porsche 911 F Model - Classic Sports Car",
      description: "Iconic classic Porsche 911 F Model with timeless design and exceptional performance. Perfect for enthusiasts who appreciate automotive heritage and driving excellence.",
      make: "Porsche",
      model: "911 F",
      year: 1973,
      fuelType: "essence",
      transmission: "manual",
      seats: 2,
      pricePerDay: "120.00",
      currency: "GBP",
      location: "London, Westminster",
      city: "London",
      latitude: 51.5074,
      longitude: -0.1278,
      images: ["/assets/CLASSIC.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Jaguar F-Type Convertible - Luxury Sports Car",
      description: "Stunning Jaguar F-Type Convertible with breathtaking design and exhilarating performance. Experience the thrill of open-top driving with British luxury and style.",
      make: "Jaguar",
      model: "F-Type",
      year: 2023,
      fuelType: "essence",
      transmission: "automatic",
      seats: 2,
      pricePerDay: "95.00",
      currency: "GBP",
      location: "Manchester, City Centre",
      city: "Manchester",
      latitude: 53.4808,
      longitude: -2.2426,
      images: ["/assets/CONVERTIBLES.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner1.id,
      title: "Tesla Model X - Electric SUV",
      description: "Revolutionary Tesla Model X electric SUV with falcon-wing doors, autopilot capabilities, and zero emissions. Experience the future of automotive technology.",
      make: "Tesla",
      model: "Model X",
      year: 2023,
      fuelType: "electric",
      transmission: "automatic",
      seats: 7,
      pricePerDay: "110.00",
      currency: "GBP",
      location: "Edinburgh, New Town",
      city: "Edinburgh",
      latitude: 55.9533,
      longitude: -3.1883,
      images: ["/assets/ELECTRIC.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner2.id,
      title: "Jaguar F-Pace Sport - Performance SUV",
      description: "Dynamic Jaguar F-Pace Sport combining SUV practicality with sports car performance. Featuring advanced technology and luxurious interior finishes.",
      make: "Jaguar",
      model: "F-Pace Sport",
      year: 2023,
      fuelType: "essence",
      transmission: "automatic",
      seats: 5,
      pricePerDay: "85.00",
      currency: "GBP",
      location: "Birmingham, City Centre",
      city: "Birmingham",
      latitude: 52.4862,
      longitude: -1.8904,
      images: ["/assets/Sport car.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner3.id,
      title: "Range Rover Evoque Sport - Premium SUV",
      description: "Sophisticated Range Rover Evoque Sport with commanding presence and refined luxury. Perfect for urban adventures and countryside escapes.",
      make: "Range Rover",
      model: "Evoque Sport",
      year: 2023,
      fuelType: "essence",
      transmission: "automatic",
      seats: 5,
      pricePerDay: "75.00",
      currency: "GBP",
      location: "Liverpool, City Centre",
      city: "Liverpool",
      latitude: 53.4084,
      longitude: -2.9916,
      images: ["/assets/SUV.png"],
      isAvailable: true
    });

    await this.createCar({
      ownerId: owner1.id,
      title: "Ferrari LaFerrari - Hybrid Hypercar",
      description: "Ferrari LaFerrari is a hybrid hypercar, the first in Ferrari's history, featuring a V12 engine and an electric motor for a combined output of 963 horsepower, enabling a top speed of over 217 mph and 0-60 mph in about 2.4 seconds",
      make: "Ferrari",
      model: "LaFerrari",
      year: 2013,
      fuelType: "hybrid",
      transmission: "automatic",
      seats: 2,
      pricePerDay: "500.00",
      currency: "GBP",
      location: "London, Mayfair",
      city: "London",
      latitude: 51.5074,
      longitude: -0.1278,
      images: ["/assets/Ferrari.jpg", "/assets/ferrari 2.jpg", "/assets/ferrari 3.jpg", "/assets/ferrari 4.jpg"],
      isAvailable: true
    });

    // Created UK luxury cars for ShareWheelz platform
  }

  // Missing methods to implement IStorage interface
  async updateUserPassword(id: string, newPassword: string): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, id));
      return true;
    } catch (error) {
      // Error updating user password
      return false;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      // Error deleting user
      return false;
    }
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      return await db.select().from(notifications).where(eq(notifications.userId, userId));
    } catch (error) {
      // Error getting notifications
      return [];
    }
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values({
      ...notification,
      id: randomUUID(),
      createdAt: new Date()
    } as any).returning();
    return newNotification;
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await db
        .update(notifications)
        .set({ isRead: true } as any)
        .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
      return true;
    } catch (error) {
      // Error marking notification as read
      return false;
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    try {
      await db
        .update(notifications)
        .set({ isRead: true } as any)
        .where(eq(notifications.userId, userId));
      return true;
    } catch (error) {
      // Error marking all notifications as read
      return false;
    }
  }

  async getUserConversations(userId: string): Promise<any[]> {
    // Conversations table not implemented yet
    return [];
  }

  async getConversationMessages(conversationId: string, userId: string): Promise<any[]> {
    // Messages table not implemented yet
    return [];
  }

  async createConversation(bookingId: string, userId: string): Promise<any> {
    // Conversations table not implemented yet
    return { id: randomUUID(), bookingId, userId };
  }

  async createMessage(conversationId: string, senderId: string, content: string, messageType?: string): Promise<any> {
    // Messages table not implemented yet
    return { id: randomUUID(), conversationId, senderId, content, messageType };
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<boolean> {
    // Messages table not implemented yet
    return true;
  }

  // Admin methods
  async getAllUsers(): Promise<any[]> {
    return await db.select().from(users);
  }

  async getUserById(id: string): Promise<any | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  async getAllCars(): Promise<any[]> {
    return await db.select().from(cars);
  }

  async getCarById(id: string): Promise<any | null> {
    const result = await db.select().from(cars).where(eq(cars.id, id)).limit(1);
    return result[0] || null;
  }

  async getAllBookings(): Promise<any[]> {
    return await db.select().from(bookings);
  }

  async getBookingById(id: string): Promise<any | null> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0] || null;
  }

  async getAllMessages(): Promise<any[]> {
    // Messages table not implemented yet
    return [];
  }

  async getAllSupportTickets(): Promise<any[]> {
    // Support tickets table not implemented yet
    return [];
  }

  async createSupportTicket(data: any): Promise<any> {
    // Mock implementation
    return {
      id: randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateSupportTicket(id: string, updates: Partial<any>): Promise<boolean> {
    // Mock implementation
    // Updating support ticket
    return true;
  }
}