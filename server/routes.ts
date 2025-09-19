import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { carSearchSchema, insertCarSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

// Simple auth middleware (for demo purposes)
const authMiddleware = (req: any, res: any, next: any) => {
  // For demo: mock user ID - in real app, verify JWT token
  req.userId = req.headers['x-user-id'] || 'demo-user-1';
  next();
};

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply auth middleware to all routes
  app.use('/api', authMiddleware);
  
  // Car routes
  app.get("/api/cars", async (req, res) => {
    try {
      const filters = carSearchSchema.parse(req.query);
      const result = await storage.searchCars(filters);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid search parameters" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const car = await storage.getCar(req.params.id);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }

      // Get owner info and reviews
      const owner = await storage.getUser(car.ownerId);
      const reviews = await storage.getReviewsByCar(car.id);
      
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      res.json({
        ...car,
        owner: owner ? {
          id: owner.id,
          firstName: owner.firstName,
          lastName: owner.lastName,
          profileImage: owner.profileImage
        } : null,
        rating: averageRating,
        reviewCount: reviews.length
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/cars", requireAuth, async (req, res) => {
    try {
      const carData = insertCarSchema.parse(req.body);
      const car = await storage.createCar(carData);
      res.status(201).json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid car data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/cars/:id", requireAuth, async (req, res) => {
    try {
      const updates = insertCarSchema.partial().parse(req.body);
      const car = await storage.updateCar(req.params.id, updates);
      
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid car data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/cars/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteCar(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Booking routes
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

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Tomobilto API is running" });
  });

  const httpServer = createServer(app);
  return httpServer;
}