// src/middleware/rateLimit.ts

import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Middleware
 * Protects API from abuse by limiting request rates
 */

/**
 * General API rate limiter
 * Applies to all API routes
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      statusCode: 429,
    },
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests from this IP, please try again later.',
        statusCode: 429,
        retryAfter: res.getHeader('Retry-After'),
      },
    });
  },
});

/**
 * Strict rate limiter for sensitive operations
 * Use for authentication, password reset, etc.
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error: {
      message: 'Too many attempts, please try again later.',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Lenient rate limiter for read-only operations
 * Use for GET requests that are less sensitive
 */
export const lenientLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later.',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Create operation rate limiter
 * Use for POST, PUT, DELETE operations
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 create operations per hour
  message: {
    success: false,
    error: {
      message: 'Too many create operations, please try again later.',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Search rate limiter
 * Use for search endpoints
 */
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: {
    success: false,
    error: {
      message: 'Too many search requests, please slow down.',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  apiLimiter,
  strictLimiter,
  lenientLimiter,
  createLimiter,
  searchLimiter,
};