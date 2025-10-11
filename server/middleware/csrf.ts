import { randomBytes } from 'crypto';

// Enhanced CSRF protection middleware
export const csrfProtection = (req: any, res: any, next: any) => {
  // Skip CSRF for safe methods and API routes that don't need it
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  // Skip CSRF for certain API endpoints that use other security measures
  const skipCSRFPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
    '/api/oauth/',
    '/api/webhooks/',
    '/api/chatgpt/'
  ];

  if (skipCSRFPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  // For development, be more lenient
  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 CSRF check skipped in development mode');
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    console.warn('🚫 CSRF token validation failed:', {
      path: req.path,
      method: req.method,
      hasToken: !!token,
      hasSessionToken: !!sessionToken,
      ip: req.ip
    });
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