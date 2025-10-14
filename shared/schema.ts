import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  profileImage: text("profile_image"),
  userType: text("user_type").notNull().default("renter"), // "owner", "renter", "both"
  
  // Membership & Subscription Fields
  membershipTier: text("membership_tier").default("none"), // "none", "basic", "premium"
  subscriptionId: text("subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"), // "active", "inactive", "cancelled", "past_due"
  subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end"),
  stripeCustomerId: text("stripe_customer_id"),
  loyaltyPoints: integer("loyalty_points").default(0),
  
  // Security & Verification Fields
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
  isIdVerified: boolean("is_id_verified").notNull().default(false),
  isLicenseVerified: boolean("is_license_verified").notNull().default(false),
  isBackgroundChecked: boolean("is_background_checked").notNull().default(false),
  
  // Verification Documents
  idDocumentUrl: text("id_document_url"),
  licenseDocumentUrl: text("license_document_url"),
  insuranceDocumentUrl: text("insurance_document_url"),
  
  // Emergency Contact
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),
  
  // Security Status
  securityScore: integer("security_score").default(0), // 0-100
  isBlocked: boolean("is_blocked").notNull().default(false),
  blockReason: text("block_reason"),
  
  // User Preferences
  preferences: text("preferences").$type<{
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    language: string;
    currency: string;
    timezone: string;
  }>(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cars table
export const cars = pgTable("cars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  fuelType: text("fuel_type").notNull(), // "essence", "diesel", "electric", "hybrid"
  transmission: text("transmission").notNull(), // "manual", "automatic"
  seats: integer("seats").notNull(),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("GBP"),
  location: text("location").notNull(),
  city: text("city").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  images: text("images").array().default([]),
  isAvailable: boolean("is_available").notNull().default(true),
  
  // Vehicle Security & Safety
  vin: text("vin"), // Vehicle Identification Number
  registrationNumber: text("registration_number"),
  motExpiry: timestamp("mot_expiry"), // UK MOT test expiry
  insuranceExpiry: timestamp("insurance_expiry"),
  isInsured: boolean("is_insured").notNull().default(false),
  insuranceProvider: text("insurance_provider"),
  insurancePolicyNumber: text("insurance_policy_number"),
  
  // Safety Features
  hasAirbags: boolean("has_airbags").default(true),
  hasAbs: boolean("has_abs").default(true),
  hasEsp: boolean("has_esp").default(false),
  hasBluetooth: boolean("has_bluetooth").default(false),
  hasGps: boolean("has_gps").default(false),
  hasParkingSensors: boolean("has_parking_sensors").default(false),
  
  // Security Features
  hasAlarm: boolean("has_alarm").default(false),
  hasImmobilizer: boolean("has_immobilizer").default(false),
  hasTrackingDevice: boolean("has_tracking_device").default(false),
  
  // Vehicle Condition
  mileage: integer("mileage"),
  lastServiceDate: timestamp("last_service_date"),
  nextServiceDue: timestamp("next_service_due"),
  condition: text("condition").default("good"), // "excellent", "good", "fair", "poor"
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  carId: varchar("car_id").notNull().references(() => cars.id),
  renterId: varchar("renter_id").notNull().references(() => users.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  serviceFee: decimal("service_fee", { precision: 10, scale: 2 }).notNull(),
  insurance: decimal("insurance", { precision: 10, scale: 2 }).notNull(),
  
  // Membership & Discount Fields
  membershipDiscount: decimal("membership_discount", { precision: 10, scale: 2 }).default("0"),
  membershipDiscountPercentage: decimal("membership_discount_percentage", { precision: 5, scale: 2 }).default("0"),
  loyaltyPointsEarned: integer("loyalty_points_earned").default(0),
  loyaltyPointsRedeemed: integer("loyalty_points_redeemed").default(0),
  
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "active", "completed", "cancelled"
  message: text("message"),
  paymentStatus: text("payment_status").notNull().default("pending"), // "pending", "paid", "failed", "refunded"
  paymentIntentId: text("payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  revieweeId: varchar("reviewee_id").notNull().references(() => users.id),
  carId: varchar("car_id").notNull().references(() => cars.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "booking", "payment", "review", "system", "promotion"
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  data: text("data"), // JSON string for additional data (booking ID, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

// Loyalty Points Transactions table
export const loyaltyPointsTransactions = pgTable("loyalty_points_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  bookingId: varchar("booking_id").references(() => bookings.id),
  points: integer("points").notNull(), // positive for earned, negative for redeemed
  type: text("type").notNull(), // "earned", "redeemed", "bonus", "expired"
  description: text("description"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Membership Benefits table
export const membershipBenefits = pgTable("membership_benefits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tier: text("tier").notNull(), // "basic", "premium"
  benefitType: text("benefit_type").notNull(), // "discount", "points_multiplier", "priority_support", etc.
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  userType: z.enum(["owner", "renter", "both"]).default("renter"),
  membershipTier: z.string().optional(),
  subscriptionId: z.string().optional(),
  subscriptionStatus: z.string().default("inactive"),
  isVerified: z.boolean().default(false),
  googleId: z.string().optional(),
  facebookId: z.string().optional(),
  microsoftId: z.string().optional(),
  appleId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertCarSchema = z.object({
  ownerId: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number(),
  color: z.string(),
  licensePlate: z.string(),
  location: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  pricePerDay: z.number(),
  currency: z.string().default("USD"),
  images: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  description: z.string().optional(),
  isAvailable: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const insertBookingSchema = z.object({
  carId: z.string(),
  renterId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalPrice: z.number(),
  currency: z.string().default("USD"),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).default("pending"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  paymentId: z.string().optional(),
  notes: z.string().optional(),
});

export const insertReviewSchema = z.object({
  bookingId: z.string(),
  carId: z.string(),
  renterId: z.string(),
  ownerId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  isActive: z.boolean().default(true),
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

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export type LoyaltyPointsTransaction = typeof loyaltyPointsTransactions.$inferSelect;
export type InsertLoyaltyPointsTransaction = typeof loyaltyPointsTransactions.$inferInsert;
export type MembershipBenefit = typeof membershipBenefits.$inferSelect;
export type InsertMembershipBenefit = typeof membershipBenefits.$inferInsert;

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
  transmission: z.enum(['manual', 'automatic']).optional(),
  seats: z.coerce.number().min(1).max(9).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['price', 'date', 'rating']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
});

// Register schema  
export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
  firstName: z.string().min(2, 'First name must contain at least 2 characters'),
  lastName: z.string().min(2, 'Last name must contain at least 2 characters'),
  phone: z.string().optional(),
  userType: z.enum(['renter', 'owner', 'both']).default('renter'),
});

// Enhanced car schema with better validation
export const enhancedInsertCarSchema = insertCarSchema.extend({
  fuelType: z.enum(['essence', 'diesel', 'electric', 'hybrid']),
  transmission: z.enum(['manual', 'automatic']),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  seats: z.number().min(1).max(9),
  pricePerDay: z.string().regex(/^\d+(\.\d{2})?$/, 'Prix invalide'),
  images: z.array(z.string().url()).min(1, 'Au moins une image est requise'),
});

export type CarSearch = z.infer<typeof carSearchSchema>;