// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

/**
 * Custom Error Class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    stack?: string;
  };
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle Mongoose validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error: ' + err.message;
  }
  // Handle Mongoose duplicate key errors
  else if (err.name === 'MongoError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry: Resource already exists';
  }
  // Handle Mongoose cast errors (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  // Handle JWT expiration
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Default error
  else {
    message = err.message || message;
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      statusCode,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // Log error
  console.error('Error:', {
    message: err.message,
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Async handler wrapper to catch async errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create error responses
 */
export const createError = {
  badRequest: (message: string = 'Bad Request') => new AppError(message, 400),
  unauthorized: (message: string = 'Unauthorized') => new AppError(message, 401),
  forbidden: (message: string = 'Forbidden') => new AppError(message, 403),
  notFound: (message: string = 'Not Found') => new AppError(message, 404),
  conflict: (message: string = 'Conflict') => new AppError(message, 409),
  internal: (message: string = 'Internal Server Error') => new AppError(message, 500),
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  createError,
};