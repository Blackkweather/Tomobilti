import { Request, Response, NextFunction } from 'express';

// Custom error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
  }
}

// Error handling middleware
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  // Handle custom AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  }
  // Handle validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
    isOperational = true;
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    isOperational = true;
  }
  // Handle database errors
  else if (error.name === 'DatabaseError') {
    statusCode = 500;
    message = 'Database operation failed';
    isOperational = true;
  }
  // Handle multer errors (file upload)
  else if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
    isOperational = true;
  }

  // Log error details
  const errorDetails = {
    message: error.message,
    statusCode,
    isOperational,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };

  // Log operational errors as warnings, others as errors
  if (isOperational) {
    console.warn('🚨 Operational Error:', errorDetails);
  } else {
    console.error('💥 System Error:', errorDetails);
  }

  // Send error response
  const errorResponse: any = {
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString()
  };

  // Include error code for client-side handling
  if (error instanceof AppError) {
    errorResponse.code = error.constructor.name;
  }

  // Include additional details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = {
      stack: error.stack,
      path: req.path,
      method: req.method
    };
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Global unhandled rejection handler
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    
    // Close server gracefully
    process.exit(1);
  });
};

// Global uncaught exception handler
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error: Error) => {
    console.error('💥 Uncaught Exception:', error);
    
    // Close server gracefully
    process.exit(1);
  });
};

// Database error handler
export const handleDatabaseError = (error: any): AppError => {
  if (error.code === '23505') { // Unique constraint violation
    return new ConflictError('Resource already exists');
  }
  if (error.code === '23503') { // Foreign key constraint violation
    return new ValidationError('Invalid reference to related resource');
  }
  if (error.code === '23502') { // Not null constraint violation
    return new ValidationError('Required field is missing');
  }
  
  return new AppError('Database operation failed', 500);
};

// Validation error formatter
export const formatValidationError = (error: any): string => {
  if (error.details && Array.isArray(error.details)) {
    return error.details.map((detail: any) => detail.message).join(', ');
  }
  return error.message || 'Validation failed';
};













