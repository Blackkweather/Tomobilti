import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, cars, bookings, reviews, conversations, messages, emailLeads } from '@shared/sqlite-schema';
import type { User as SqliteUser, Car as SqliteCar, Booking as SqliteBooking, Review as SqliteReview, EmailLead as SqliteEmailLead } from '@shared/sqlite-schema';
import type { User, Car, Booking, Review, InsertUser, InsertCar, InsertBooking, InsertReview, CarSearch, EmailLead, InsertEmailLead } from '@shared/schema';
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
    let hashedPassword = null;
    if (insertUser.password && insertUser.password.trim() !== '') {
      hashedPassword = await bcrypt.hash(insertUser.password, 12);
    }
    const userWithHashedPassword = {
      ...insertUser,
      password: hashedPassword,
      id: randomUUID(),
    };

    const [user] = await db.insert(users).values(userWithHashedPassword as any).returning();
    return user as unknown as User;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password!);
    return isValid ? (user as unknown as User) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return (user as unknown as User) || null;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user as unknown as User;
  }

  async getUserById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return (user as unknown as User) || null;
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
    return user as unknown as User;
  }

  // Car operations
  async createCar(insertCar: InsertCar): Promise<Car> {
    const carData: any = {
      ...insertCar,
      id: randomUUID(),
      title: (insertCar as any).title ?? `${insertCar.make} ${insertCar.model}`,
      fuelType: (insertCar as any).fuelType ?? "essence",
      transmission: (insertCar as any).transmission ?? "manual",
      seats: (insertCar as any).seats ?? 5,
      city: (insertCar as any).city ?? "Unknown",
      pricePerDay: String(insertCar.pricePerDay),
      latitude: insertCar.latitude ? Number(insertCar.latitude) : null,
      longitude: insertCar.longitude ? Number(insertCar.longitude) : null,
    };

    const [car] = await db.insert(cars).values(carData).returning();

    // Invalidate car search cache
    cache.clear();

    return car as unknown as Car;
  }

  async getCar(id: string): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car as unknown as Car;
  }

  async getCarById(id: string): Promise<Car | null> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return (car as unknown as Car) || null;
  }

  async getCarsByOwner(ownerId: string): Promise<Car[]> {
    const results = await db.select().from(cars).where(eq(cars.ownerId, ownerId));
    return results as unknown as Car[];
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
      conditions.push(sqlOp`CAST(${cars.pricePerDay} AS REAL) >= ${filters.minPrice}`);
    }
    if (filters.maxPrice) {
      conditions.push(sqlOp`CAST(${cars.pricePerDay} AS REAL) <= ${filters.maxPrice}`);
    }
    // if (filters.ownerId) {
    //   conditions.push(eq(cars.ownerId, filters.ownerId));
    // }

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

      const filteredCars = availableCars.filter(car => car !== null) as unknown as Car[];
      const total = filteredCars.length;

      // Pagination
      const start = (filters.page - 1) * filters.limit;
      const end = start + filters.limit;
      const paginatedCars = filteredCars.slice(start, end);

      const result = { cars: paginatedCars as unknown as Car[], total };
      cache.set(cacheKey, result, 2 * 60 * 1000); // Cache for 2 minutes
      return result;
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const allCars = await query;
    const total = allCars.length;

    // Simple pagination
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    const paginatedCars = allCars.slice(start, end);

    const result = { cars: paginatedCars as unknown as Car[], total };
    cache.set(cacheKey, result, 2 * 60 * 1000); // Cache for 2 minutes
    return result;
  }

  async updateCar(id: string, updates: Partial<InsertCar>): Promise<Car | undefined> {
    const updateData: any = { ...updates };
    if (updates.pricePerDay !== undefined) {
      updateData.pricePerDay = String(updates.pricePerDay);
    }

    const [car] = await db.update(cars)
      .set(updateData)
      .where(eq(cars.id, id))
      .returning();

    // Invalidate car search cache
    cache.clear();

    return car as unknown as Car;
  }

  async deleteCar(id: string): Promise<boolean> {
    const result = await db.delete(cars).where(eq(cars.id, id));

    // Invalidate car search cache
    cache.clear();

    return result.changes > 0;
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingData: any = {
      ...insertBooking,
      id: randomUUID(),
      totalAmount: String(insertBooking.totalPrice),
      paymentIntentId: insertBooking.paymentId,
      message: insertBooking.notes,
      startTime: "09:00",
      endTime: "17:00",
      serviceFee: "0",
      insurance: "0",
    };

    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking as unknown as Booking;
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    const results = await db.select().from(bookings).where(eq(bookings.renterId, userId)); // userId in interface is renterId in schema? No, bookings has renterId. Wait, bookings table has renterId.
    return results as unknown as Booking[];
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking as unknown as Booking;
  }

  async getBookingsByRenter(renterId: string): Promise<Booking[]> {
    const results = await db.select().from(bookings).where(eq(bookings.renterId, renterId));
    return results as unknown as Booking[];
  }

  async getBookingsByOwner(ownerId: string): Promise<Booking[]> {
    const ownerCars = await this.getCarsByOwner(ownerId);
    const carIds = ownerCars.map(car => car.id);
    const results = await db.select().from(bookings).where(inArray(bookings.carId, carIds));
    return results as unknown as Booking[];
  }

  async getBookingsByCar(carId: string): Promise<Booking[]> {
    const results = await db.select().from(bookings).where(eq(bookings.carId, carId));
    return results as unknown as Booking[];
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const updateData: any = { ...updates };
    if (updates.totalPrice !== undefined) updateData.totalAmount = String(updates.totalPrice);
    if (updates.paymentId !== undefined) updateData.paymentIntentId = updates.paymentId;
    if (updates.notes !== undefined) updateData.message = updates.notes;

    const [booking] = await db.update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();
    return booking as unknown as Booking;
  }

  async cancelBooking(id: string): Promise<boolean> {
    const [booking] = await db.update(bookings)
      .set({ status: 'cancelled' } as any)
      .where(eq(bookings.id, id))
      .returning();
    return !!booking;
  }

  // Review operations
  async createReview(insertReview: InsertReview): Promise<Review> {
    const reviewData: any = {
      ...insertReview,
      id: randomUUID(),
      reviewerId: insertReview.renterId,
      revieweeId: insertReview.ownerId,
    };

    const [review] = await db.insert(reviews).values(reviewData).returning();
    return { ...review, createdAt: new Date(review.createdAt!) } as unknown as Review;
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    const results = await db.select().from(reviews).where(eq(reviews.reviewerId, userId));
    return results.map(r => ({ ...r, createdAt: new Date(r.createdAt!) })) as unknown as Review[];
  }

  async getReviewsByCarOwner(ownerId: string): Promise<Review[]> {
    const results = await db.select().from(reviews).where(eq(reviews.revieweeId, ownerId));
    return results.map(r => ({ ...r, createdAt: new Date(r.createdAt!) })) as unknown as Review[];
  }

  async getReviewsByCar(carId: string): Promise<Review[]> {
    const results = await db.select().from(reviews).where(eq(reviews.carId, carId));
    return results.map(r => ({ ...r, createdAt: new Date(r.createdAt!) })) as unknown as Review[];
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

  async getAllCars(): Promise<any[]> {
    return await db.select().from(cars);
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
        lastMessageAt: new Date(conv.lastMessageAt!),
        createdAt: new Date(conv.createdAt!),
        owner: owner ? { id: owner.id, firstName: owner.firstName, lastName: owner.lastName, profileImage: owner.profileImage } : null,
        renter: renter ? { id: renter.id, firstName: renter.firstName, lastName: renter.lastName, profileImage: renter.profileImage } : null,
        booking: booking ? { id: booking.id, carId: booking.carId } : null,
        lastMessage: lastMessage ? { ...lastMessage, createdAt: new Date(lastMessage.createdAt!) } : null,
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
        createdAt: new Date(msg.createdAt!),
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
      .set({ lastMessageAt: new Date().toISOString() } as any)
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
      .set({ isRead: true } as any)
      .where(eq(messages.id, messageId));

    return true;
  }

  // Email leads operations
  async createEmailLead(insertLead: InsertEmailLead & { discountCode: string }): Promise<EmailLead> {
    const leadWithId = {
      ...insertLead,
      id: randomUUID(),
    };

    const [lead] = await db.insert(emailLeads).values(leadWithId).returning();
    return { ...lead, createdAt: new Date(lead.createdAt!), usedAt: lead.usedAt ? new Date(lead.usedAt) : null } as unknown as EmailLead;
  }

  async getEmailLeadByEmail(email: string): Promise<EmailLead | undefined> {
    const [lead] = await db.select().from(emailLeads).where(eq(emailLeads.email, email));
    return lead ? { ...lead, createdAt: new Date(lead.createdAt!), usedAt: lead.usedAt ? new Date(lead.usedAt) : null } as unknown as EmailLead : undefined;
  }

  async updateUserPassword(id: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const result = await db.update(users)
      .set({ password: hashedPassword } as any)
      .where(eq(users.id, id));
    return result.changes > 0;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.changes > 0;
  }
}
