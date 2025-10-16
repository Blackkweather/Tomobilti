import { randomBytes, timingSafeEqual } from 'crypto';
import { secureLog } from './sanitize';

// Enhanced CSRF protection middleware
export const csrfProtection = (req: any, res: any, next: any) => {
  // Skip CSRF for safe methods and API routes that don't need it
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  // Only skip CSRF for essential auth endpoints
  const skipCSRFPaths = [
    '/api/auth/login',
    '/api/auth/register'
  ];

  if (skipCSRFPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  // CSRF protection enabled in all environments for security

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || !timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken))) {
    secureLog('warn', 'CSRF token validation failed', { path: req.path });
    return res.status(403).json({ 
      error: 'Invalid CSRF token',
      code: 'CSRF_TOKEN_INVALID'
    });
  }

  next();
};

export const generateCSRFToken = () => {
  return randomBytes(32).toString('hex');
};

// Middleware to add CSRF token to response
export const addCSRFToken = (req: any, res: any, next: any) => {
  if (!req.session) {
    req.session = {};
  }
  
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCSRFToken();
  }
  
  res.locals.csrfToken = req.session.csrfToken;
  next();
};