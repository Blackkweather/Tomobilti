import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// GET /api/cars - Return all cars for split-screen view
router.get('/cars', async (req, res) => {
  try {
    const cars = await storage.getAllCars();
    
    // Return all cars without pagination
    res.json({
      cars,
      total: cars.length
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

export default router;
