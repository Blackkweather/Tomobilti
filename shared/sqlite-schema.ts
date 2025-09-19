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
});

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
  isAvailable: integer("is_available", { mode: 'boolean' }).notNull().default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

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
});

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
});

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
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

export type CarSearch = z.infer<typeof carSearchSchema>;