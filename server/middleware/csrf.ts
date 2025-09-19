import { randomBytes } from 'crypto';

// Simple CSRF protection middleware
export const csrfProtection = (req: any, res: any, next: any) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

export const generateCSRFToken = () => {
  return randomBytes(32).toString('hex');
};