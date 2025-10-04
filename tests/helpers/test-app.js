import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from '../../server/routes.js';
import { setupTestDatabase } from './test-db.js';

/**
 * Create Express app for testing
 */
export async function createExpressApp() {
  // Setup test database
  await setupTestDatabase();
  
  const app = express();
  
  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // CORS for testing
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Register all routes
  await registerRoutes(app);
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Test app error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
  
  return app;
}

/**
 * Setup test database
 */
export async function setupTestDatabase() {
  // Use test database URL
  process.env.DATABASE_URL = 'file:./test.db';
  
  // Ensure clean test database
  const fs = await import('fs');
  const testDbPath = './test.db';
  
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  
  console.log('✅ Test database initialized');
}
