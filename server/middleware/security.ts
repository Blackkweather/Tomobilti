import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { sanitizeMiddleware } from './sanitize';
import { csrfProtection, addCSRFToken } from './csrf';

// Enhanced security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'development' ? false : {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "ws:", "wss:", "https://api.stripe.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Enhanced rate limiting
export const generalRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

export const authRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Input validation middleware
export const validateInput = (req: any, res: any, next: any) => {
  // Check for null bytes and control characters
  const checkForMaliciousInput = (obj: any): boolean => {
    if (typeof obj === 'string') {
      return /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(checkForMaliciousInput);
    }
    return false;
  };

  if (req.body && checkForMaliciousInput(req.body)) {
    return res.status(400).json({ error: 'Invalid characters in request' });
  }

  if (req.query && checkForMaliciousInput(req.query)) {
    return res.status(400).json({ error: 'Invalid characters in query' });
  }

  next();
};

// File upload security
export const fileUploadSecurity = (req: any, res: any, next: any) => {
  if (req.file || req.files) {
    const files = req.files || [req.file];
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB

    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'File type not allowed' });
      }
      if (file.size > maxSize) {
        return res.status(400).json({ error: 'File too large' });
      }
    }
  }
  next();
};

// Security middleware stack
export const applySecurity = (app: any) => {
  // Apply security headers (disabled in dev)
  if (process.env.NODE_ENV !== 'development') {
    app.use(securityHeaders);
  }
  
  // Apply rate limiting (disabled in dev)
  if (process.env.NODE_ENV !== 'development') {
    app.use('/api/auth', authRateLimit);
    app.use('/api', generalRateLimit);
  }
  
  // Apply input validation and sanitization
  app.use(validateInput);
  app.use(sanitizeMiddleware);
  
  // CSRF protection disabled in development
  if (process.env.NODE_ENV !== 'development') {
    app.use(addCSRFToken);
    app.use(csrfProtection);
  }
  
  // Apply file upload security
  app.use(fileUploadSecurity);
};