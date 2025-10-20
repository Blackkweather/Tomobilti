import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { applySecurity } from './middleware/security';
import { createServer } from 'http';
import registerRoutes from "./routes";
import uploadRoutes from "./routes/upload";
import { setupVite, serveStatic, log } from "./vite";
import { EmailService } from "./services/email";
import { CarRentalAgentService } from "./services/car-rental-agent";
import MessagingSocketServer from "./messaging";
import MonitoringService from "./services/monitoring";
import LoggingService from "./services/logging";

const app = express();

// Initialize monitoring and logging services
const monitoringService = MonitoringService;
const loggingService = LoggingService;

// Add monitoring and logging middleware
app.use(monitoringService.middleware());
app.use(loggingService.requestLogger());

// CORS configuration for development
app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000', 'file://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Apply comprehensive security middleware
applySecurity(app);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Add multer for handling multipart/form-data (file uploads)
import multer from 'multer';
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Apply multer middleware only in routes that need it (POST/PUT in routes.ts)
// app.use('/api/cars', upload.array('images', 5));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize email service
  EmailService.initialize();
  
  // Initialize Car Rental Agent service
  const agentService = new CarRentalAgentService({
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 200,
  });
  
  // Wait for storage to be initialized
  if (process.env.NODE_ENV === 'production') {
    // Waiting for storage initialization
    // Give storage time to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Add health check endpoint with monitoring
  app.get('/api/health', (req, res) => {
    const healthStatus = monitoringService.getHealthStatus();
    const alerts = monitoringService.getAlerts();
    
    res.json({
      status: healthStatus.status,
      timestamp: new Date().toISOString(),
      uptime: healthStatus.uptime,
      memoryUsage: healthStatus.memoryUsage,
      averageResponseTime: healthStatus.averageResponseTime,
      activeAlerts: healthStatus.activeAlerts,
      alerts: alerts.slice(-5), // Last 5 alerts
      version: process.env.npm_package_version || '1.0.0'
    });
  });

  app.use('/api/upload', uploadRoutes);
  await registerRoutes(app);

  // Initialize sample data in production if database is empty
  if (process.env.NODE_ENV === 'production') {
    // Use setTimeout to defer database initialization after server starts
    setTimeout(async () => {
      try {
        console.log('Starting production database initialization...');
        const { DatabaseStorage } = await import('./db');
        const dbStorage = new DatabaseStorage();
        
        // Retry logic for database connection
        let retries = 5; // Increased retries
        let connected = false;
        
        while (retries > 0 && !connected) {
          try {
            // Test database connection
            const testUsers = await dbStorage.getAllUsers();
            console.log(`Database connected with ${testUsers.length} users`);
            connected = true;
          } catch (error) {
            retries--;
            console.log(`Database connection failed, retries left: ${retries}`);
            console.log('Connection error:', error.message);
            
            // If it's a schema error, try to fix it with comprehensive approach
            if (error.message.includes('membership_tier') || error.message.includes('vin') || error.message.includes('column') || error.message.includes('does not exist')) {
              console.log('🔧 Detected database schema issue - attempting simple fix...');
              try {
                const { exec } = await import('child_process');
                const { promisify } = await import('util');
                const execAsync = promisify(exec);
                
                console.log('Running ultimate database fix...');
                const result = await execAsync('node scripts/ultimate-db-fix.cjs');
                console.log('✅ Simple database fix completed');
                console.log('Fix output:', result.stdout);
                
                // Wait a moment for the fix to take effect
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Try connecting again
                const testUsers = await dbStorage.getAllUsers();
                console.log(`Database connected with ${testUsers.length} users`);
                connected = true;
                break; // Exit the retry loop
              } catch (fixError) {
                console.log('❌ Simple database fix failed:', fixError.message);
              }
            }
            
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
            }
          }
        }
        
        if (!connected) {
          console.error('Failed to connect to database after retries - using in-memory storage');
          console.log('Initializing in-memory storage with sample data...');
          
          // Switch to in-memory storage
          const { switchToInMemoryStorage } = await import('./storage');
          switchToInMemoryStorage();
          
          // Get the storage instance
          const { storage } = await import('./storage');
          const memStorage = storage;
          
          // Create sample users and cars in memory
          const owner1 = await memStorage.createUser({
            email: process.env.DEMO_USER_EMAIL || "demo@sharewheelz.uk",
            password: process.env.DEMO_USER_PASSWORD || "SecureDemo123!",
            firstName: "John",
            lastName: "Smith",
            phone: "+44 20 1234 5678",
            userType: "owner"
          });
          
          const owner2 = await memStorage.createUser({
            email: process.env.DEMO_USER2_EMAIL || "demo2@sharewheelz.uk",
            password: process.env.DEMO_USER_PASSWORD || "SecureDemo123!",
            firstName: "Sarah",
            lastName: "Jones",
            phone: "+44 20 8765 4321",
            userType: "owner"
          });
          
          // Create only the 6 initial cars
          await memStorage.createCar({
            ownerId: owner1.id,
            title: "Ferrari - Supercar",
            description: "High-performance Ferrari with stunning design and exhilarating drive.",
            make: "Ferrari",
            model: "",
            year: 2022,
            fuelType: "essence",
            transmission: "automatic",
            seats: 2,
            pricePerDay: "150.00",
            currency: "GBP",
            location: "London, Westminster",
            city: "London",
            latitude: 51.5074,
            longitude: -0.1278,
            images: ["/assets/Ferrari.jpg"],
            isAvailable: true
          });

          await memStorage.createCar({
            ownerId: owner2.id,
            title: "Porsche 911 F Model - Classic Sports Car",
            description: "Iconic classic Porsche 911 F Model with timeless design and exceptional performance.",
            make: "Porsche",
            model: "911 F",
            year: 1973,
            fuelType: "essence",
            transmission: "manual",
            seats: 2,
            pricePerDay: "120.00",
            currency: "GBP",
            location: "Manchester, City Centre",
            city: "Manchester",
            latitude: 53.4808,
            longitude: -2.2426,
            images: ["/assets/CLASSIC.png"],
            isAvailable: true
          });

          await memStorage.createCar({
            ownerId: owner1.id,
            title: "Range Rover - Luxury SUV",
            description: "Premium Range Rover SUV offering luxury and capability.",
            make: "Land Rover",
            model: "Range Rover",
            year: 2021,
            fuelType: "essence",
            transmission: "automatic",
            seats: 5,
            pricePerDay: "100.00",
            currency: "GBP",
            location: "Birmingham, City Centre",
            city: "Birmingham",
            latitude: 52.4862,
            longitude: -1.8904,
            images: ["/assets/Range Rover.jpg"],
            isAvailable: true
          });

          await memStorage.createCar({
            ownerId: owner2.id,
            title: "Tesla - Electric",
            description: "Modern Tesla electric car with zero emissions.",
            make: "Tesla",
            model: "",
            year: 2023,
            fuelType: "electric",
            transmission: "automatic",
            seats: 5,
            pricePerDay: "110.00",
            currency: "GBP",
            location: "Edinburgh, New Town",
            city: "Edinburgh",
            latitude: 55.9533,
            longitude: -3.1883,
            images: ["/assets/Tesla.jpg"],
            isAvailable: true
          });

          await memStorage.createCar({
            ownerId: owner1.id,
            title: "Jaguar F-Pace - SUV",
            description: "Luxury Jaguar F-Pace SUV with refined comfort and performance.",
            make: "Jaguar",
            model: "F-Pace",
            year: 2022,
            fuelType: "essence",
            transmission: "automatic",
            seats: 5,
            pricePerDay: "90.00",
            currency: "GBP",
            location: "Leeds, City Centre",
            city: "Leeds",
            latitude: 53.8008,
            longitude: -1.5491,
            images: ["/assets/Jaguar F pace.jpg"],
            isAvailable: true
          });

          await memStorage.createCar({
            ownerId: owner2.id,
            title: "Jaguar F-Type Convertible - Luxury Sports Car",
            description: "Stunning Jaguar F-Type Convertible with breathtaking design and exhilarating performance.",
            make: "Jaguar",
            model: "F-Type Convertible",
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
            images: ["/assets/jaguar f type convertible 1.jpg"],
            isAvailable: true
          });
          
          console.log('In-memory storage initialized with sample data');
          return;
        }
        
        // Check if cars already exist
        const existingCars = await dbStorage.getAllCars();
        console.log(`Found ${existingCars.length} existing cars`);
        
        // Only initialize cars if none exist
        if (existingCars.length === 0) {
          console.log('No cars found, initializing cars...');
          await dbStorage.forceInitializeCars();
          
          // Verify cars were created
          const finalCars = await dbStorage.getAllCars();
          console.log(`Successfully created ${finalCars.length} cars`);
        } else {
          console.log('Cars already exist, skipping initialization');
        }
        
      } catch (error) {
        console.error('CRITICAL: Failed to initialize production database:', error);
        console.log('Server will continue with in-memory storage');
        // Don't throw - let the server start even if initialization fails
      }
    }, 15000); // Wait 15 seconds after server starts
  }
  
  // Create HTTP server and WebSocket server
  const httpServer = createServer(app);
  const messagingServer = new MessagingSocketServer(httpServer);
  
  // Make messaging server available globally for API routes
  (global as any).messagingServer = messagingServer;

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error
    loggingService.error('Unhandled error', {
      error: err.stack,
      status,
      message
    });

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
  
  // Debug logging for deployment
  log(`Environment: ${process.env.NODE_ENV}`);
  log(`Binding to: ${host}:${port}`);
  
  httpServer.listen(port, host, () => {
    log(`✅ Server successfully started on ${host}:${port}`);
    log(`✅ WebSocket messaging server initialized`);
  });
  
  // Handle server errors
  httpServer.on('error', (error: any) => {
    log(`❌ Server error: ${error.message}`);
    if (error.code === 'EADDRINUSE') {
      log(`Port ${port} is already in use`);
    }
  });
})();
