import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import type { User } from '@shared/schema';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

// JWT utilities
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string } => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  
  try {
    return jwt.verify(token, secret) as { userId: string };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Authentication middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token manquant ou invalide' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const { userId } = verifyToken(token);
    
    const user = await storage.getUser(userId);
    if (!user) {
      res.status(401).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { userId } = verifyToken(token);
      
      const user = await storage.getUser(userId);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Ignore auth errors for optional middleware
    next();
  }
};

// Authorization helpers
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentification requise' });
    return;
  }
  next();
};

export const requireOwner = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentification requise' });
    return;
  }
  
  if (req.user.userType !== 'owner' && req.user.userType !== 'both') {
    res.status(403).json({ error: 'Accès réservé aux propriétaires' });
    return;
  }
  
  next();
};

// Resource ownership verification
export const requireCarOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentification requise' });
    return;
  }
  
  const carId = req.params.id;
  if (!carId) {
    res.status(400).json({ error: 'ID de véhicule manquant' });
    return;
  }
  
  try {
    const car = await storage.getCar(carId);
    if (!car) {
      res.status(404).json({ error: 'Véhicule non trouvé' });
      return;
    }
    
    if (car.ownerId !== req.user.id) {
      res.status(403).json({ error: 'Accès non autorisé à ce véhicule' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Car ownership check error:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Sanitize user data for API responses
export const sanitizeUser = (user: User): Omit<User, 'password'> => {
  const { password, ...safeUser } = user;
  return safeUser;
};