// src/utils/validators.ts

import Joi from 'joi';
import { LANGUAGES, VALIDATION, HOLIDAY_TYPES, START_OF_WEEK } from '../config/constants';

/**
 * Validation schemas for API requests
 */

// Shamsi date validation schema
export const shamsiDateSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(VALIDATION.MIN_YEAR)
    .max(VALIDATION.MAX_YEAR)
    .required()
    .messages({
      'number.base': 'Year must be a number',
      'number.min': `Year must be at least ${VALIDATION.MIN_YEAR}`,
      'number.max': `Year must be at most ${VALIDATION.MAX_YEAR}`,
      'any.required': 'Year is required',
    }),
  month: Joi.number()
    .integer()
    .min(VALIDATION.MIN_MONTH)
    .max(VALIDATION.MAX_MONTH)
    .required()
    .messages({
      'number.base': 'Month must be a number',
      'number.min': 'Month must be between 1 and 12',
      'number.max': 'Month must be between 1 and 12',
      'any.required': 'Month is required',
    }),
  day: Joi.number()
    .integer()
    .min(VALIDATION.MIN_DAY)
    .max(VALIDATION.MAX_DAY)
    .required()
    .messages({
      'number.base': 'Day must be a number',
      'number.min': 'Day must be at least 1',
      'number.max': 'Day must be at most 31',
      'any.required': 'Day is required',
    }),
});

// Gregorian date validation schema
export const gregorianDateSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(VALIDATION.MIN_YEAR)
    .max(VALIDATION.MAX_YEAR)
    .required()
    .messages({
      'number.base': 'Year must be a number',
      'number.min': `Year must be at least ${VALIDATION.MIN_YEAR}`,
      'number.max': `Year must be at most ${VALIDATION.MAX_YEAR}`,
      'any.required': 'Year is required',
    }),
  month: Joi.number()
    .integer()
    .min(VALIDATION.MIN_MONTH)
    .max(VALIDATION.MAX_MONTH)
    .required()
    .messages({
      'number.base': 'Month must be a number',
      'number.min': 'Month must be between 1 and 12',
      'number.max': 'Month must be between 1 and 12',
      'any.required': 'Month is required',
    }),
  day: Joi.number()
    .integer()
    .min(VALIDATION.MIN_DAY)
    .max(VALIDATION.MAX_DAY)
    .required()
    .messages({
      'number.base': 'Day must be a number',
      'number.min': 'Day must be at least 1',
      'number.max': 'Day must be at most 31',
      'any.required': 'Day is required',
    }),
});

// Query parameters validation schema
export const queryParamsSchema = Joi.object({
  lang: Joi.string()
    .valid(...LANGUAGES)
    .default('english')
    .messages({
      'any.only': `Language must be one of: ${LANGUAGES.join(', ')}`,
    }),
  startOfWeek: Joi.number()
    .valid(START_OF_WEEK.SATURDAY, START_OF_WEEK.SUNDAY, START_OF_WEEK.MONDAY)
    .default(START_OF_WEEK.SATURDAY)
    .messages({
      'any.only': 'Start of week must be 1 (Saturday), 2 (Sunday), or 3 (Monday)',
    }),
  includeHolidays: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'includeHolidays must be a boolean',
    }),
  includeGregorian: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'includeGregorian must be a boolean',
    }),
  format: Joi.string()
    .valid('full', 'compact')
    .default('full')
    .messages({
      'any.only': 'Format must be either "full" or "compact"',
    }),
});

// Holiday creation/update validation schema
export const holidaySchema = Joi.object({
  shamsiYear: Joi.number()
    .integer()
    .min(VALIDATION.MIN_YEAR)
    .max(VALIDATION.MAX_YEAR)
    .required()
    .messages({
      'number.base': 'Shamsi year must be a number',
      'number.min': `Year must be at least ${VALIDATION.MIN_YEAR}`,
      'number.max': `Year must be at most ${VALIDATION.MAX_YEAR}`,
      'any.required': 'Shamsi year is required',
    }),
  shamsiMonth: Joi.number()
    .integer()
    .min(VALIDATION.MIN_MONTH)
    .max(VALIDATION.MAX_MONTH)
    .required()
    .messages({
      'number.base': 'Shamsi month must be a number',
      'number.min': 'Month must be between 1 and 12',
      'number.max': 'Month must be between 1 and 12',
      'any.required': 'Shamsi month is required',
    }),
  shamsiDay: Joi.number()
    .integer()
    .min(VALIDATION.MIN_DAY)
    .max(VALIDATION.MAX_DAY)
    .required()
    .messages({
      'number.base': 'Shamsi day must be a number',
      'number.min': 'Day must be at least 1',
      'number.max': 'Day must be at most 31',
      'any.required': 'Shamsi day is required',
    }),
  names: Joi.object({
    dari: Joi.string().required().messages({
      'any.required': 'Dari name is required',
      'string.empty': 'Dari name cannot be empty',
    }),
    pashto: Joi.string().required().messages({
      'any.required': 'Pashto name is required',
      'string.empty': 'Pashto name cannot be empty',
    }),
    english: Joi.string().required().messages({
      'any.required': 'English name is required',
      'string.empty': 'English name cannot be empty',
    }),
  }).required(),
  descriptions: Joi.object({
    dari: Joi.string().allow('').default(''),
    pashto: Joi.string().allow('').default(''),
    english: Joi.string().allow('').default(''),
  }).default({}),
  type: Joi.string()
    .valid(...Object.values(HOLIDAY_TYPES))
    .default('national')
    .messages({
      'any.only': `Type must be one of: ${Object.values(HOLIDAY_TYPES).join(', ')}`,
    }),
  isNationalHoliday: Joi.boolean().default(false),
  isPublicHoliday: Joi.boolean().default(true),
});

// Year parameter validation
export const yearParamSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(VALIDATION.MIN_YEAR)
    .max(VALIDATION.MAX_YEAR)
    .required()
    .messages({
      'number.base': 'Year must be a number',
      'number.min': `Year must be at least ${VALIDATION.MIN_YEAR}`,
      'number.max': `Year must be at most ${VALIDATION.MAX_YEAR}`,
      'any.required': 'Year is required',
    }),
});

// Month parameter validation
export const monthParamSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(VALIDATION.MIN_YEAR)
    .max(VALIDATION.MAX_YEAR)
    .required(),
  month: Joi.number()
    .integer()
    .min(VALIDATION.MIN_MONTH)
    .max(VALIDATION.MAX_MONTH)
    .required()
    .messages({
      'number.base': 'Month must be a number',
      'number.min': 'Month must be between 1 and 12',
      'number.max': 'Month must be between 1 and 12',
      'any.required': 'Month is required',
    }),
});

// Day parameter validation
export const dayParamSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(VALIDATION.MIN_YEAR)
    .max(VALIDATION.MAX_YEAR)
    .required(),
  month: Joi.number()
    .integer()
    .min(VALIDATION.MIN_MONTH)
    .max(VALIDATION.MAX_MONTH)
    .required(),
  day: Joi.number()
    .integer()
    .min(VALIDATION.MIN_DAY)
    .max(VALIDATION.MAX_DAY)
    .required()
    .messages({
      'number.base': 'Day must be a number',
      'number.min': 'Day must be at least 1',
      'number.max': 'Day must be at most 31',
      'any.required': 'Day is required',
    }),
});

// Year range validation
export const yearRangeSchema = Joi.object({
  startYear: Joi.number()
    .integer()
    .min(VALIDATION.MIN_YEAR)
    .max(VALIDATION.MAX_YEAR)
    .required()
    .messages({
      'any.required': 'Start year is required',
    }),
  endYear: Joi.number()
    .integer()
    .min(Joi.ref('startYear'))
    .max(VALIDATION.MAX_YEAR)
    .required()
    .messages({
      'any.required': 'End year is required',
      'number.min': 'End year must be greater than or equal to start year',
    }),
});

/**
 * Validation helper function
 */
export const validate = <T>(schema: Joi.ObjectSchema, data: any): { error?: string; value?: T } => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return { error: errorMessage };
  }

  return { value: value as T };
};