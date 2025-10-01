import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, cars, bookings, reviews, conversations, messages, notifications } from '@shared/sqlite-schema';
import type { User, Car, Booking, Review, InsertUser, InsertCar, InsertBooking, InsertReview, CarSearch, Notification, InsertNotification } from '@shared/schema';
import { eq, and, gte, lte, inArray, like, sql as sqlOp, count, desc, asc, or } from 'drizzle-orm';
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

  // Notification operations - Mock implementation for now
  async getNotifications(userId: string): Promise<any[]> {
    // Return empty array for now since notifications table doesn't exist in SQLite schema
    return [];
  }

  async createNotification(notification: any): Promise<any> {
    // Mock implementation
    return { id: randomUUID(), ...notification, createdAt: new Date() };
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    // Mock implementation
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
    return await db.select().from(conversations);
  }

  async getAllSupportTickets(): Promise<any[]> {
    // Mock implementation - return empty array for now
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
    console.log(`Updating support ticket ${id} with:`, updates);
    return true;
  }

  // Messaging operations
  async getUserConversations(userId: string): Promise<any[]> {
    const userConversations = await db
      .select()
      .from(conversations)
      .where(or(eq(conversations.ownerId, userId), eq(conversations.renterId, userId)))
      .orderBy(desc(conversations.lastMessageAt));

    // Enrich with user and booking data
    return Promise.all(userConversations.map(async (conv) => {
      const owner = await this.getUser(conv.ownerId);
      const renter = await this.getUser(conv.renterId);
      const booking = await this.getBooking(conv.bookingId);
      
      // Get last message
      const lastMessageResult = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conv.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);
      const lastMessage = lastMessageResult[0] || null;
      
      // Get unread count
      const unreadCountResult = await db
        .select({ count: count() })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, conv.id),
            eq(messages.isRead, false),
            sqlOp`${messages.senderId} != ${userId}`
          )
        );
      const unreadCount = unreadCountResult[0]?.count || 0;
      
      return {
        ...conv,
        owner: owner ? { id: owner.id, firstName: owner.firstName, lastName: owner.lastName, profileImage: owner.profileImage } : null,
        renter: renter ? { id: renter.id, firstName: renter.firstName, lastName: renter.lastName, profileImage: renter.profileImage } : null,
        booking: booking ? { id: booking.id, carId: booking.carId } : null,
        lastMessage: lastMessage || null,
        unreadCount
      };
    }));
  }

  async getConversationMessages(conversationId: string, userId: string): Promise<any[]> {
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
    
    // Enrich with sender data
    return Promise.all(conversationMessages.map(async (msg) => {
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
    const existingConv = await db
      .select()
      .from(conversations)
      .where(eq(conversations.bookingId, bookingId))
      .limit(1);
    
    if (existingConv.length > 0) {
      return existingConv[0];
    }

    const conversation = {
      id: randomUUID(),
      bookingId,
      ownerId: car.ownerId,
      renterId: booking.renterId,
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await db.insert(conversations).values(conversation);
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

    await db.insert(messages).values(message);
    
    // Update conversation last message time
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date().toISOString() })
      .where(eq(conversations.id, conversationId));

    return message;
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<boolean> {
    const messageResult = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);
    
    const message = messageResult[0];
    if (!message || message.senderId === userId) {
      return false; // Can't mark own messages as read
    }

    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
    
    return true;
  }

  // Sample data initialization removed
}
