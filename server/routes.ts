import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  carSearchSchema, 
  insertCarSchema, 
  insertBookingSchema, 
  insertReviewSchema,
  loginSchema,
  registerSchema,
  enhancedInsertCarSchema
} from "@shared/sqlite-schema";
import { z } from "zod";
import { csrfProtection } from "./middleware/csrf";
import { sanitizeMiddleware } from "./middleware/sanitize";
import { EmailService } from "./services/email";
import { 
  authMiddleware, 
  optionalAuthMiddleware,
  requireAuth, 
  requireOwner,
  requireCarOwnership,
  generateToken,
  sanitizeUser
} from "./middleware/auth";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: { error: 'Too many login attempts, please try again later' }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply security middleware to all routes
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  }));
  app.use('/api', generalLimiter);
  app.use('/api', sanitizeMiddleware);
  
  // Authentication routes (no auth required)
  app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const token = generateToken(user.id);
      const sanitizedUser = sanitizeUser(user);
      
      res.json({ 
        message: 'Login successful',
        token,
        user: sanitizedUser
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
      
      const user = await storage.createUser(userData);
      const token = generateToken(user.id);
      const sanitizedUser = sanitizeUser(user);
      
      // Send email verification
      try {
        const verificationToken = generateToken(user.id); // You might want to create a separate verification token
        await EmailService.sendVerificationEmail({
          to: user.email,
          firstName: user.firstName,
          verificationToken: verificationToken
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }
      
      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: sanitizedUser
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/api/auth/me', authMiddleware, (req, res) => {
    const sanitizedUser = sanitizeUser(req.user!);
    res.json({ user: sanitizedUser });
  });

  app.put('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
      const updates = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
      };

      // Validate required fields
      if (!updates.firstName || !updates.lastName || !updates.email) {
        return res.status(400).json({ error: 'First name, last name and email are required' });
      }

      // Check if email is already taken by another user
      const existingUser = await storage.getUserByEmail(updates.email);
      if (existingUser && existingUser.id !== req.user!.id) {
        return res.status(400).json({ error: 'This email is already used by another account' });
      }

      const updatedUser = await storage.updateUser(req.user!.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const sanitizedUser = sanitizeUser(updatedUser);
      res.json({ 
        message: 'Profile updated successfully',
        user: sanitizedUser 
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Apply optional auth to public routes, required auth to protected routes
  app.use('/api/cars', optionalAuthMiddleware);
  app.use('/api/bookings', authMiddleware);
  app.use('/api/reviews', optionalAuthMiddleware);
  
  // Car routes
  app.get("/api/cars", async (req, res) => {
    try {
      const filters = carSearchSchema.parse(req.query);
      const result = await storage.searchCars(filters);
      
      // Enrich cars with owner info and reviews
      const enrichedCars = await Promise.all(
        result.cars.map(async (car) => {
          const owner = await storage.getUser(car.ownerId);
          const reviews = await storage.getReviewsByCar(car.id);
          
          const averageRating = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
            : 0;

          return {
            ...car,
            owner: owner ? {
              id: owner.id,
              firstName: owner.firstName,
              lastName: owner.lastName,
              profileImage: owner.profileImage
            } : null,
            rating: Number(averageRating.toFixed(1)),
            reviewCount: reviews.length
          };
        })
      );
      
      res.json({
        cars: enrichedCars,
        total: result.total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(result.total / filters.limit)
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid search parameters", details: error.errors });
      }
      console.error('Car search error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const car = await storage.getCar(req.params.id);
      if (!car) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      // Get owner info and reviews
      const owner = await storage.getUser(car.ownerId);
      const reviews = await storage.getReviewsByCar(car.id);
      
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      // Get enriched reviews with reviewer info
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          const reviewer = await storage.getUser(review.reviewerId);
          return {
            ...review,
            reviewer: reviewer ? {
              id: reviewer.id,
              firstName: reviewer.firstName,
              lastName: reviewer.lastName,
              profileImage: reviewer.profileImage
            } : null
          };
        })
      );

      res.json({
        ...car,
        owner: owner ? sanitizeUser(owner) : null,
        rating: Number(averageRating.toFixed(1)),
        reviewCount: reviews.length,
        reviews: enrichedReviews
      });
    } catch (error) {
      console.error('Get car error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get cars by owner
  app.get("/api/cars/owner/:ownerId", async (req, res) => {
    try {
      const cars = await storage.getCarsByOwner(req.params.ownerId);
      res.json({ cars });
    } catch (error) {
      console.error('Get owner cars error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/cars", authMiddleware, requireOwner, async (req, res) => {
    try {
      let carData: any = req.body;
      
      // Handle FormData with file uploads
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        carData = {};
        
        console.log('FormData received:', req.body);
        
        // Parse form fields with proper type conversion
        Object.keys(req.body).forEach(key => {
          if (key === 'features') {
            try {
              carData[key] = JSON.parse(req.body[key]);
            } catch {
              carData[key] = req.body[key];
            }
          } else if (key === 'images') {
            try {
              carData[key] = JSON.parse(req.body[key]);
            } catch {
              // If parsing fails, treat as single image URL
              carData[key] = [req.body[key]];
            }
          } else if (key === 'year' || key === 'seats') {
            carData[key] = parseInt(req.body[key]);
          } else if (key === 'isAvailable') {
            carData[key] = req.body[key] === 'true';
          } else {
            carData[key] = req.body[key];
          }
        });
        
        // Handle uploaded files
        const files = req.files as Express.Multer.File[];
        if (files && files.length > 0) {
          // For now, we'll store file URLs as placeholder URLs
          // In a real app, you'd upload these to a cloud storage service
          carData.images = files.map(file => 
            `https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format`
          );
        }
      }
      
      const validatedCarData = enhancedInsertCarSchema.parse({
        ...carData,
        ownerId: req.user!.id
      });
      
      const car = await storage.createCar(validatedCarData);
      res.status(201).json({
        message: "Vehicle created successfully",
        car
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid vehicle data", details: error.errors });
      }
      console.error('Create car error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/cars/:id", authMiddleware, requireCarOwnership, async (req, res) => {
    try {
      const updates = enhancedInsertCarSchema.partial().parse(req.body);
      const car = await storage.updateCar(req.params.id, updates);
      
      if (!car) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      
      res.json({
        message: "Véhicule mis à jour avec succès",
        car
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid vehicle data", details: error.errors });
      }
      console.error('Update car error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/cars/:id", authMiddleware, requireCarOwnership, async (req, res) => {
    try {
      const success = await storage.deleteCar(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json({ message: "Véhicule supprimé avec succès" });
    } catch (error) {
      console.error('Delete car error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Booking routes
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      // Enrich booking with car and renter information
      const car = await storage.getCar(booking.carId);
      const renter = await storage.getUser(booking.renterId);
      
      const enrichedBooking = {
        ...booking,
        car: car || null,
        renter: renter || null
      };
      
      res.json(enrichedBooking);
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bookings/renter/:renterId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByRenter(req.params.renterId);
      
      // Enrich bookings with car and owner information
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const car = await storage.getCar(booking.carId);
          const owner = car ? await storage.getUser(car.ownerId) : null;
          
          return {
            ...booking,
            car: car ? {
              id: car.id,
              title: car.title,
              make: car.make,
              model: car.model,
              location: car.location,
              images: car.images
            } : null,
            owner: owner ? {
              id: owner.id,
              firstName: owner.firstName,
              lastName: owner.lastName,
              profileImage: owner.profileImage
            } : null
          };
        })
      );
      
      res.json(enrichedBookings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bookings/owner/:ownerId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByOwner(req.params.ownerId);
      
      // Enrich bookings with car and renter information
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const car = await storage.getCar(booking.carId);
          const renter = await storage.getUser(booking.renterId);
          
          return {
            ...booking,
            car: car ? {
              id: car.id,
              title: car.title,
              make: car.make,
              model: car.model,
              location: car.location,
              images: car.images
            } : null,
            renter: renter ? {
              id: renter.id,
              firstName: renter.firstName,
              lastName: renter.lastName,
              profileImage: renter.profileImage
            } : null
          };
        })
      );
      
      res.json(enrichedBookings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/bookings", requireAuth, async (req, res) => {
    try {
      // For SQLite, dates are stored as text strings
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check if car is available for the requested dates
      const car = await storage.getCar(bookingData.carId);
      if (!car || !car.isAvailable) {
        return res.status(400).json({ error: "Car is not available" });
      }
      
      // Check for conflicting bookings
      const existingBookings = await storage.getBookingsByCar(bookingData.carId);
      const conflictingBooking = existingBookings.find(booking => {
        if (booking.status === "cancelled") return false;
        
        const requestStart = new Date(bookingData.startDate);
        const requestEnd = new Date(bookingData.endDate);
        const existingStart = new Date(booking.startDate);
        const existingEnd = new Date(booking.endDate);
        
        return (requestStart <= existingEnd && requestEnd >= existingStart);
      });
      
      if (conflictingBooking) {
        return res.status(400).json({ error: "Car is already booked for these dates" });
      }
      
      const booking = await storage.createBooking(bookingData);
      
      // Send booking confirmation email to renter
      try {
        const renter = await storage.getUser(bookingData.renterId);
        const car = await storage.getCar(bookingData.carId);
        if (renter && car) {
          await EmailService.sendBookingConfirmation({
            to: renter.email,
            firstName: renter.firstName,
            carTitle: car.title,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            totalAmount: bookingData.totalAmount,
            currency: car.currency,
            bookingId: booking.id
          });
        }
      } catch (emailError) {
        console.error('Failed to send booking confirmation email:', emailError);
        // Don't fail the booking if email fails
      }
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const updates = insertBookingSchema.partial().parse(req.body);
      const booking = await storage.updateBooking(req.params.id, updates);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      // Send confirmation email if booking status changed to confirmed
      if (updates.status === 'confirmed') {
        try {
          const renter = await storage.getUser(booking.renterId);
          const car = await storage.getCar(booking.carId);
          if (renter && car) {
            await EmailService.sendBookingConfirmation({
              to: renter.email,
              firstName: renter.firstName,
              carTitle: car.title,
              startDate: booking.startDate,
              endDate: booking.endDate,
              totalAmount: booking.totalAmount,
              currency: car.currency,
              bookingId: booking.id
            });
          }
        } catch (emailError) {
          console.error('Failed to send booking confirmation email:', emailError);
          // Don't fail the booking update if email fails
        }
      }
      
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.cancelBooking(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Review routes
  app.get("/api/reviews/car/:carId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByCar(req.params.carId);
      
      // Enrich reviews with reviewer information
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          const reviewer = await storage.getUser(review.reviewerId);
          return {
            ...review,
            reviewer: reviewer ? {
              id: reviewer.id,
              firstName: reviewer.firstName,
              lastName: reviewer.lastName,
              profileImage: reviewer.profileImage
            } : null
          };
        })
      );
      
      res.json(enrichedReviews);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Verify the booking exists and is completed
      const booking = await storage.getBooking(reviewData.bookingId);
      if (!booking || booking.status !== "completed") {
        return res.status(400).json({ error: "Can only review completed bookings" });
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid review data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Owner stats route
  app.get("/api/owners/:ownerId/stats", async (req, res) => {
    try {
      const stats = await storage.getOwnerStats(req.params.ownerId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Payment routes (only if Stripe is configured)
  if (process.env.STRIPE_SECRET_KEY) {
    app.post("/api/payments/create-intent", authMiddleware, async (req, res) => {
      try {
        const { amount, currency, bookingId, customerEmail, customerName, carTitle, mockPayment } = req.body;
        
        if (!amount || !currency || !bookingId || !customerEmail || !customerName || !carTitle) {
          return res.status(400).json({ error: "Missing required payment data" });
        }

        // Use mock payment if requested or if in development mode
        if (mockPayment || process.env.NODE_ENV === 'development') {
          // Simulate successful payment for development
          res.json({
            clientSecret: "pi_mock_" + Date.now(),
            paymentIntentId: "pi_mock_" + Date.now(),
          });
          return;
        }

        const PaymentService = (await import("./services/payment")).default;
        const result = await PaymentService.createPaymentIntent({
          amount,
          currency,
          bookingId,
          customerEmail,
          customerName,
          carTitle,
        });

        if (!result.success) {
          return res.status(400).json({ error: result.error });
        }

        res.json({
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
        });
      } catch (error) {
        console.error("Payment intent creation failed:", error);
        res.status(500).json({ error: "Payment processing failed" });
      }
    });
  } else {
    // Mock payment endpoint for development
    app.post("/api/payments/create-intent", authMiddleware, async (req, res) => {
      try {
        const { amount, currency, bookingId } = req.body;
        
        if (!amount || !currency || !bookingId) {
          return res.status(400).json({ error: "Missing required payment data" });
        }

        // Simulate successful payment for development
        res.json({
          clientSecret: "pi_mock_" + Date.now(),
          paymentIntentId: "pi_mock_" + Date.now(),
        });
      } catch (error) {
        console.error("Mock payment creation failed:", error);
        res.status(500).json({ error: "Payment processing failed" });
      }
    });
  }

  app.get("/api/payments/status/:paymentIntentId", authMiddleware, async (req, res) => {
    try {
      // Check if this is a mock payment
      if (req.params.paymentIntentId.startsWith('pi_mock_')) {
        // Mock payment status for development
        res.json({ status: "succeeded", paymentIntentId: req.params.paymentIntentId });
        return;
      }

      if (process.env.STRIPE_SECRET_KEY) {
        const PaymentService = (await import("./services/payment")).default;
        const result = await PaymentService.confirmPaymentIntent(req.params.paymentIntentId);

        if (!result.success) {
          return res.status(400).json({ error: result.error });
        }

        res.json({ status: "succeeded", paymentIntentId: result.paymentIntentId });
      } else {
        // Mock payment status for development
        res.json({ status: "succeeded", paymentIntentId: req.params.paymentIntentId });
      }
    } catch (error) {
      console.error("Payment status check failed:", error);
      res.status(500).json({ error: "Failed to check payment status" });
    }
  });

  app.post("/api/payments/refund", authMiddleware, async (req, res) => {
    try {
      const { paymentIntentId, amount } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID is required" });
      }

      if (process.env.STRIPE_SECRET_KEY) {
        const PaymentService = (await import("./services/payment")).default;
        const result = await PaymentService.refundPayment(paymentIntentId, amount);

        if (!result.success) {
          return res.status(400).json({ error: result.error });
        }

        res.json({ success: true, paymentIntentId: result.paymentIntentId });
      } else {
        // Mock refund for development
        res.json({ success: true, paymentIntentId });
      }
    } catch (error) {
      console.error("Refund failed:", error);
      res.status(500).json({ error: "Refund processing failed" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Tomobilto API is running" });
  });

  const httpServer = createServer(app);
  return httpServer;
}