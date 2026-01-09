// src/middleware/validator.ts

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

/**
 * Validation Middleware Factory
 * Creates middleware to validate request data against a Joi schema
 */

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Validate request data against a Joi schema
 */
export const validate = (schema: Joi.ObjectSchema, source: ValidationSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      return next(new AppError(errorMessage, 400));
    }

    // Replace the request data with validated and sanitized data
    req[source] = value;
    next();
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return validate(schema, 'body');
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return validate(schema, 'query');
};

/**
 * Validate URL parameters
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return validate(schema, 'params');
};

/**
 * Validate multiple sources at once
 */
export const validateMultiple = (schemas: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validate body
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      } else {
        req.body = value;
      }
    }

    // Validate query
    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      } else {
        req.query = value;
      }
    }

    // Validate params
    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      } else {
        req.params = value;
      }
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join(', '), 400));
    }

    next();
  };
};

export default {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  validateMultiple,
};