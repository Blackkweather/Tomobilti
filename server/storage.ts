import { 
  type User, 
  type InsertUser, 
  type Car, 
  type InsertCar, 
  type Booking, 
  type InsertBooking,
  type Review,
  type InsertReview,
  type Notification,
  type InsertNotification,
  type CarSearch
} from "@shared/schema";
import { randomUUID } from "crypto";
// Select storage backend per environment to avoid native sqlite in production
const isProd = process.env.NODE_ENV === 'production';

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  updateUserPassword(id: string, newPassword: string): Promise<boolean>;
  deleteUser(id: string): Promise<boolean>;

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
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(notificationId: string, userId: string): Promise<boolean>;
  markAllNotificationsAsRead(userId: string): Promise<boolean>;
  
  // Messaging operations
  getUserConversations(userId: string): Promise<any[]>;
  getConversationMessages(conversationId: string, userId: string): Promise<any[]>;
  createConversation(bookingId: string, userId: string): Promise<any>;
  createMessage(conversationId: string, senderId: string, content: string, messageType?: string): Promise<any>;
  markMessageAsRead(messageId: string, userId: string): Promise<boolean>;
  
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
  private notifications: Map<string, Notification>;
  private conversations: Map<string, any>;
  private messages: Map<string, any>;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.notifications = new Map();
    this.conversations = new Map();
    this.messages = new Map();

    // Sample data initialization removed
    this.initializeSampleNotifications();
    
    // Initialize conversations synchronously
    this.initializeConversationsFromSQLiteSync();
  }

  // Initialize conversations and messages from SQLite synchronously
  private initializeConversationsFromSQLiteSync() {
    // In production we avoid touching better-sqlite3 entirely
    if (isProd) {
      return;
    }
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      
      const dbPath = path.join(process.cwd(), 'tomobilti.db');
      const db = new Database(dbPath);
      
      // Load conversations
      const conversations = db.prepare('SELECT * FROM conversations').all();
      conversations.forEach((conv: any) => {
        this.conversations.set(conv.id, {
          id: conv.id,
          bookingId: conv.booking_id,
          ownerId: conv.owner_id,
          renterId: conv.renter_id,
          lastMessageAt: conv.last_message_at,
          createdAt: conv.created_at
        });
      });
      
      // Load messages
      const messages = db.prepare('SELECT * FROM messages').all();
      messages.forEach((msg: any) => {
        this.messages.set(msg.id, {
          id: msg.id,
          conversationId: msg.conversation_id,
          senderId: msg.sender_id,
          content: msg.content,
          messageType: msg.message_type,
          isRead: Boolean(msg.is_read),
          createdAt: msg.created_at
        });
      });
      
      db.close();
      console.log(`✅ Loaded ${conversations.length} conversations and ${messages.length} messages from SQLite`);
    } catch (error: any) {
      console.log('⚠️ Could not load conversations from SQLite:', error.message);
    }
  }


  // Initialize sample notifications for testing
  private async initializeSampleNotifications() {
    // This will be called after users are created
    setTimeout(() => {
      if (typeof this.createSampleNotifications === 'function') {
        this.createSampleNotifications();
      }
    }, 1000);
  }

  private async createSampleNotifications() {
    const users = Array.from(this.users.values());
    console.log('Creating sample notifications for', users.length, 'users');
    if (users.length === 0) {
      console.log('No users found, skipping sample notifications');
      return;
    }

    const sampleNotifications = [
      {
        userId: users[0].id,
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your Ferrari La Ferrari rental has been confirmed for 15 days',
        data: JSON.stringify({ bookingId: 'sample-booking-1' })
      },
      {
        userId: users[0].id,
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of £94,875 has been processed successfully',
        data: JSON.stringify({ amount: 94875, currency: 'GBP' })
      },
      {
        userId: users[0].id,
        type: 'system',
        title: 'Welcome to ShareWheelz',
        message: 'Thank you for joining our platform! Start exploring amazing cars.',
        data: null
      }
    ];

    for (const notification of sampleNotifications) {
      await this.createNotification(notification);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    // Parse preferences JSON if it exists
    let processedUser = { ...user };
    if (user.preferences && typeof user.preferences === 'string') {
      try {
        processedUser.preferences = JSON.parse(user.preferences);
      } catch (error) {
        // If parsing fails, use default preferences
        processedUser.preferences = {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          language: 'en',
          currency: 'GBP',
          timezone: 'Europe/London'
        };
      }
    }
    
    return processedUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = Array.from(this.users.values()).find(user => user.email === email);
    if (!user) return undefined;
    
    // Parse preferences JSON if it exists
    let processedUser = { ...user };
    if (user.preferences && typeof user.preferences === 'string') {
      try {
        processedUser.preferences = JSON.parse(user.preferences);
      } catch (error) {
        // If parsing fails, use default preferences
        processedUser.preferences = {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          language: 'en',
          currency: 'GBP',
          timezone: 'Europe/London'
        };
      }
    }
    
    return processedUser;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    // Hash password before storing (keep behavior aligned with DB storage)
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { 
      ...insertUser,
      password: hashedPassword,
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
    
    // Handle preferences JSON parsing
    let processedUpdates = { ...updates };
    if (updates.preferences && typeof updates.preferences === 'object') {
      processedUpdates.preferences = JSON.stringify(updates.preferences);
    }
    
    const updatedUser = { 
      ...user, 
      ...processedUpdates, 
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserPassword(id: string, newPassword: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    
    // Hash the new password
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const updatedUser = { 
      ...user, 
      password: hashedPassword,
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return true;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    const bcrypt = await import('bcrypt');
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    
    // Delete all user's cars
    const userCars = Array.from(this.cars.values()).filter(car => car.ownerId === id);
    for (const car of userCars) {
      this.cars.delete(car.id);
    }
    
    // Delete all user's bookings (as renter)
    const userBookings = Array.from(this.bookings.values()).filter(booking => booking.renterId === id);
    for (const booking of userBookings) {
      this.bookings.delete(booking.id);
    }
    
    // Delete all user's reviews
    const userReviews = Array.from(this.reviews.values()).filter(review => review.userId === id);
    for (const review of userReviews) {
      this.reviews.delete(review.id);
    }
    
    // Finally delete the user
    this.users.delete(id);
    return true;
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

  // Messaging operations
  async getUserConversations(userId: string): Promise<any[]> {
    const conversations = Array.from(this.conversations.values())
      .filter(conv => conv.ownerId === userId || conv.renterId === userId)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    
    // Enrich with user and booking data
    return Promise.all(conversations.map(async (conv) => {
      const owner = await this.getUser(conv.ownerId);
      const renter = await this.getUser(conv.renterId);
      const booking = await this.getBooking(conv.bookingId);
      const lastMessage = Array.from(this.messages.values())
        .filter(msg => msg.conversationId === conv.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      
      return {
        ...conv,
        owner: owner ? { id: owner.id, firstName: owner.firstName, lastName: owner.lastName, profileImage: owner.profileImage } : null,
        renter: renter ? { id: renter.id, firstName: renter.firstName, lastName: renter.lastName, profileImage: renter.profileImage } : null,
        booking: booking ? { id: booking.id, carId: booking.carId } : null,
        lastMessage: lastMessage || null,
        unreadCount: Array.from(this.messages.values())
          .filter(msg => msg.conversationId === conv.id && !msg.isRead && msg.senderId !== userId).length
      };
    }));
  }

  async getConversationMessages(conversationId: string, userId: string): Promise<any[]> {
    const messages = Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Enrich with sender data
    return Promise.all(messages.map(async (msg) => {
      const sender = await this.getUser(msg.senderId);
      return {
        ...msg,
        sender: sender ? { id: sender.id, firstName: sender.firstName, lastName: sender.lastName, profileImage: sender.profileImage } : null
      };
    }));
  }

  async createConversation(bookingId: string, userId: string): Promise<any> {
    const booking = await this.getBooking(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const car = await this.getCar(booking.carId);
    if (!car) {
      throw new Error('Car not found');
    }

    // Check if conversation already exists
    const existingConv = Array.from(this.conversations.values())
      .find(conv => conv.bookingId === bookingId);
    
    if (existingConv) {
      return existingConv;
    }

    const conversation = {
      id: randomUUID(),
      bookingId,
      ownerId: car.ownerId,
      renterId: booking.renterId,
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  async createMessage(conversationId: string, senderId: string, content: string, messageType: string = 'text'): Promise<any> {
    const message = {
      id: randomUUID(),
      conversationId,
      senderId,
      content,
      messageType,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    this.messages.set(message.id, message);
    
    // Update conversation last message time
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.lastMessageAt = new Date().toISOString();
      this.conversations.set(conversationId, conversation);
    }

    return message;
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<boolean> {
    const message = this.messages.get(messageId);
    if (!message || message.senderId === userId) {
      return false; // Can't mark own messages as read
    }

    message.isRead = true;
    this.messages.set(messageId, message);
    return true;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    console.log('Storage: Getting notifications for user:', userId);
    console.log('Storage: Total notifications in map:', this.notifications.size);
    const notifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    console.log('Storage: Filtered notifications:', notifications.length);
    return notifications;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      isRead: false,
      data: insertNotification.data ?? null,
      createdAt: new Date()
    };
    console.log('Creating notification:', notification.title, 'for user:', notification.userId);
    this.notifications.set(id, notification);
    console.log('Notification created, total notifications:', this.notifications.size);
    return notification;
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);
    if (!notification || notification.userId !== userId) {
      return false;
    }
    
    const updatedNotification = { ...notification, isRead: true };
    this.notifications.set(notificationId, updatedNotification);
    return true;
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.isRead);
    
    for (const notification of userNotifications) {
      const updatedNotification = { ...notification, isRead: true };
      this.notifications.set(notification.id, updatedNotification);
    }
    
    return true;
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

  // Admin methods - enhanced versions of existing methods
  async getAllUsers(): Promise<any[]> {
    return await this.db.select().from(users);
  }

  async getUserById(id: string): Promise<any | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  async getAllCars(): Promise<any[]> {
    return await this.db.select().from(cars);
  }

  async getCarById(id: string): Promise<any | null> {
    const result = await this.db.select().from(cars).where(eq(cars.id, id)).limit(1);
    return result[0] || null;
  }

  async getAllBookings(): Promise<any[]> {
    return await this.db.select().from(bookings);
  }

  async getBookingById(id: string): Promise<any | null> {
    const result = await this.db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0] || null;
  }

  async getAllMessages(): Promise<any[]> {
    return await this.db.select().from(conversations);
  }

  async getAllSupportTickets(): Promise<any[]> {
    // For now, return empty array since we don't have support tickets table yet
    // You can implement this when you add the support tickets table
    return [];
  }

  async createSupportTicket(data: any): Promise<any> {
    // Mock implementation - you can implement this when you add the support tickets table
    return {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateSupportTicket(id: string, updates: Partial<any>): Promise<boolean> {
    // Mock implementation - you can implement this when you add the support tickets table
    console.log(`Updating support ticket ${id} with:`, updates);
    return true;
  }
}

// Use SQLite storage instead of PostgreSQL for simplicity
// export const storage = new DatabaseStorage();

// Note: HybridStorage removed - using direct DatabaseStorage in production

// Storage factory function
async function createStorageInstance() {
  if (isProd) {
    try {
      const { DatabaseStorage } = await import('./db');
      return new DatabaseStorage();
    } catch (error) {
      console.error('Failed to create DatabaseStorage:', error);
      return new MemStorage();
    }
  } else {
    // In development, use PostgreSQL if DATABASE_URL is set, otherwise use MemStorage
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
      try {
        const { DatabaseStorage } = await import('./db');
        return new DatabaseStorage();
      } catch (error) {
        console.error('Failed to create DatabaseStorage in dev:', error);
        return new MemStorage();
      }
    } else {
      return new MemStorage();
    }
  }
}

// Create storage instance
let storageInstance: any = null;

// Initialize storage
createStorageInstance().then(instance => {
  storageInstance = instance;
  console.log('✅ Storage instance created:', instance.constructor.name);
}).catch(error => {
  console.error('❌ Failed to create storage instance:', error);
  storageInstance = new MemStorage();
});

// Export storage with getter
export const storage = new Proxy({} as any, {
  get(target, prop) {
    if (!storageInstance) {
      console.warn('Storage not initialized yet, using fallback');
      return new MemStorage()[prop];
    }
    return storageInstance[prop];
  }
});

// Sample data initialization removed