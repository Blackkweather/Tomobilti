// Enhanced input sanitization middleware to prevent XSS and injection attacks
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input
      .replace(/[<>"'&]/g, (match) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match] || match;
      })
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
      .replace(/\\u[0-9a-fA-F]{4}/g, '')
      .replace(/\\x[0-9a-fA-F]{2}/g, '')
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      const cleanKey = sanitizeInput(key);
      sanitized[cleanKey] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
};

export const sanitizeMiddleware = (req: any, res: any, next: any) => {
  try {
    if (req.body) {
      req.body = sanitizeInput(req.body);
    }
    if (req.query) {
      req.query = sanitizeInput(req.query);
    }
    if (req.params) {
      req.params = sanitizeInput(req.params);
    }
    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    res.status(400).json({ error: 'Invalid input data' });
  }
};

// URL validation for SSRF protection
export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return false;
    }
    
    if (blockedHosts.includes(parsedUrl.hostname)) {
      return false;
    }
    
    // Block private IP ranges
    const ip = parsedUrl.hostname;
    if (ip.match(/^10\.|^172\.(1[6-9]|2[0-9]|3[01])\.|^192\.168\./)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// Path validation for directory traversal protection
export const validatePath = (filePath: string): boolean => {
  if (!filePath || typeof filePath !== 'string') {
    return false;
  }
  
  const normalizedPath = filePath.replace(/\\/g, '/').replace(/\/+/g, '/');
  const dangerousPatterns = [
    '../', '..\\', '/etc/', '/proc/', '/sys/', '/root/', 'C:/', 'c:/',
    '\\\\', '/..', '\\..', 'file://', 'ftp://', 'data:', 'javascript:',
    '%2e%2e', '%2f', '%5c', '\0', '\x00'
  ];
  
  if (/[\x00-\x1f\x7f-\x9f]/.test(filePath)) {
    return false;
  }
  
  return !dangerousPatterns.some(pattern => normalizedPath.toLowerCase().includes(pattern.toLowerCase()));
};

// Secure logging to prevent log injection
export const secureLog = (level: string, message: string, data?: any) => {
  const sanitizedMessage = sanitizeInput(message);
  const timestamp = new Date().toISOString();
  
  if (data) {
    const sanitizedData = sanitizeInput(data);
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${sanitizedMessage}`, sanitizedData);
  } else {
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${sanitizedMessage}`);
  }
};