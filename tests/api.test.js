import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createExpressApp } from './helpers/test-app.js';

describe('API Tests', () => {
  let app;

  beforeAll(async () => {
    app = await createExpressApp();
  });

  afterAll(async () => {
    // Cleanup
  });

  describe('Health Check', () => {
    it('should return 200 for health check', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const userData = {
        email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
        password: 'wrongpassword'
      };

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('Cars API', () => {
    let authToken;

    beforeAll(async () => {
      // Login to get auth token
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
          password: 'password123'
        });
      
      authToken = response.body.token;
    });

    it('should get cars list', async () => {
      const response = await request(app)
        .get('/api/cars')
        .expect(200);

      expect(response.body).toHaveProperty('cars');
      expect(Array.isArray(response.body.cars)).toBe(true);
    });

    it('should create a new car', async () => {
      const carData = {
        title: 'Test Car',
        make: 'Test',
        model: 'Car',
        year: 2023,
        pricePerDay: '50',
        location: 'Test City',
        seats: 4,
        transmission: 'automatic',
        fuelType: 'gasoline',
        images: ['https://example.com/car.jpg'],
        features: ['air-conditioning', 'bluetooth']
      };

      const response = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${authToken}`)
        .send(carData)
        .expect(201);

      expect(response.body).toHaveProperty('car');
      expect(response.body.car.title).toBe(carData.title);
    });

    it('should reject unauthorized car creation', async () => {
      const carData = {
        title: 'Unauthorized Car'
      };

      await request(app)
        .post('/api/cars')
        .send(carData)
        .expect(401);
    });
  });

  describe('Booking API', () => {
    let authToken;
    let carId;

    beforeAll(async () => {
      // Login to get auth token
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
          password: 'password123'
        });
      
      authToken = response.body.token;

      // Create a car for booking
      const carResponse = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Booking Test Car',
          make: 'Test',
          model: 'Booking',
          year: 2023,
          pricePerDay: '100',
          location: 'Test City',
          seats: 5
        });

      carId = carResponse.body.car.id;
    });

    it('should create a booking', async () => {
      const bookingData = {
        carId: carId,
        startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        endDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
        pickupTime: '10:00',
        returnTime: '18:00'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(201);

      expect(response.body).toHaveProperty('booking');
    });

    it('should reject booking with invalid dates', async () => {
      const bookingData = {
        carId: carId,
        startDate: '2020-01-01', // Past date
        endDate: '2020-01-02'
      };

      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(400);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });

    it('should validate request data', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123' // Too short
        })
        .expect(400);
    });
  });
});
