import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { createServer } from 'http';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { EmailService } from "./services/email";
import { CarRentalAgentService } from "./services/car-rental-agent";
import MessagingSocketServer from "./messaging";

const app = express();

// CORS configuration for development
app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000', 'file://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting - Disabled for development
// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
//   message: 'Too many authentication attempts, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(generalLimiter);
// app.use('/api/auth', authLimiter);

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

// Apply multer middleware to car routes
app.use('/api/cars', upload.array('images', 5));

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
  
  await registerRoutes(app);
  
  // Create HTTP server and WebSocket server
  const httpServer = createServer(app);
  const messagingServer = new MessagingSocketServer(httpServer);
  
  // Make messaging server available globally for API routes
  (global as any).messagingServer = messagingServer;

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

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
