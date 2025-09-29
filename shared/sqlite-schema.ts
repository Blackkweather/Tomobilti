import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  profileImage: text("profile_image"),
  userType: text("user_type").notNull().default("renter"), // "owner", "renter", "both"
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  emailIdx: sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  userTypeIdx: sql`CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type)`,
}));

// Cars table
export const cars = sqliteTable("cars", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  ownerId: text("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  fuelType: text("fuel_type").notNull(), // "essence", "diesel", "electric", "hybrid"
  transmission: text("transmission").notNull(), // "manual", "automatic"
  seats: integer("seats").notNull(),
  pricePerDay: text("price_per_day").notNull(),
  currency: text("currency").notNull().default("MAD"),
  location: text("location").notNull(),
  city: text("city").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  images: text("images", { mode: 'json' }).$type<string[]>().default([]),
  features: text("features", { mode: 'json' }).$type<string[]>().default([]),
  isAvailable: integer("is_available", { mode: 'boolean' }).notNull().default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  ownerIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_cars_owner_id ON cars(owner_id)`,
  cityIdx: sql`CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city)`,
  availableIdx: sql`CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(is_available)`,
  priceIdx: sql`CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price_per_day)`,
  fuelTypeIdx: sql`CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type)`,
}));

// Bookings table
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  carId: text("car_id").notNull().references(() => cars.id),
  renterId: text("renter_id").notNull().references(() => users.id),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  totalAmount: text("total_amount").notNull(),
  serviceFee: text("service_fee").notNull(),
  insurance: text("insurance").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "active", "completed", "cancelled"
  message: text("message"),
  paymentStatus: text("payment_status").notNull().default("pending"), // "pending", "paid", "failed", "refunded"
  paymentIntentId: text("payment_intent_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  carIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id)`,
  renterIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id)`,
  statusIdx: sql`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`,
  startDateIdx: sql`CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date)`,
}));

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId: text("booking_id").notNull().references(() => bookings.id),
  reviewerId: text("reviewer_id").notNull().references(() => users.id),
  revieweeId: text("reviewee_id").notNull().references(() => users.id),
  carId: text("car_id").notNull().references(() => cars.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  carIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id)`,
  reviewerIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id)`,
  revieweeIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id)`,
  ratingIdx: sql`CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)`,
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Car = typeof cars.$inferSelect;
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Search and filter types
export const carSearchSchema = z.object({
  location: z.string().optional(),
  city: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  fuelType: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (typeof val === 'string') return [val];
    return val;
  }),
  transmission: z.string().optional(),
  seats: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  ownerId: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

export type CarSearch = z.infer<typeof carSearchSchema>;

// Additional schemas for authentication and enhanced car creation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  userType: z.enum(["owner", "renter", "both"]).default("renter"),
});

export const enhancedInsertCarSchema = insertCarSchema.extend({
  // Add any additional fields for enhanced car creation
  features: z.array(z.string()).optional(),
  vin: z.string().optional(),
  registrationNumber: z.string().optional(),
  motExpiry: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  isInsured: z.boolean().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  hasAirbags: z.boolean().optional(),
  hasAbs: z.boolean().optional(),
  hasEsp: z.boolean().optional(),
  hasBluetooth: z.boolean().optional(),
  hasGps: z.boolean().optional(),
  hasParkingSensors: z.boolean().optional(),
  hasAlarm: z.boolean().optional(),
  hasImmobilizer: z.boolean().optional(),
  hasTrackingDevice: z.boolean().optional(),
  mileage: z.number().optional(),
  lastServiceDate: z.string().optional(),
  nextServiceDue: z.string().optional(),
  condition: z.string().optional(),
});

// Notifications table
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "booking", "payment", "review", "system", "promotion"
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: 'boolean' }).notNull().default(false),
  data: text("data"), // JSON string for additional data (booking ID, etc.)
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)`,
  typeIdx: sql`CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)`,
}));

// Messaging system tables
export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId: text("booking_id").notNull().references(() => bookings.id),
  ownerId: text("owner_id").notNull().references(() => users.id),
  renterId: text("renter_id").notNull().references(() => users.id),
  lastMessageAt: text("last_message_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  bookingIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_conversations_booking_id ON conversations(booking_id)`,
  ownerIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_conversations_owner_id ON conversations(owner_id)`,
  renterIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_conversations_renter_id ON conversations(renter_id)`,
}));

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id").notNull().references(() => conversations.id),
  senderId: text("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"), // "text", "image", "file"
  isRead: integer("is_read", { mode: 'boolean' }).notNull().default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  conversationIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)`,
  senderIdIdx: sql`CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id)`,
  createdAtIdx: sql`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)`,
}));

// Types for messaging
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;