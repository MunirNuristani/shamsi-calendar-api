// src/routes/holidays.ts

import express from 'express';
import {
  getById,
  getByYear,
  getByYearAndMonth,
  getAll,
  search,
  getStatistics,
} from '../controllers/holidayController';
import { validateParams, validateQuery } from '../middleware/validator';
import {
  yearParamSchema,
  monthParamSchema,
} from '../utils/validators';
import { asyncHandler } from '../middleware/errorHandler';
import { searchLimiter, lenientLimiter } from '../middleware/rateLimit';
import Joi from 'joi';

const router = express.Router();

// ID parameter schema
const idParamSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Holiday ID is required',
    'any.required': 'Holiday ID is required',
  }),
});

// Search query schema
const searchQuerySchema = Joi.object({
  q: Joi.string().required().min(1).messages({
    'string.empty': 'Search query is required',
    'any.required': 'Search query is required',
    'string.min': 'Search query must be at least 1 character',
  }),
  lang: Joi.string().valid('dari', 'pashto', 'english').default('english'),
});

// Statistics query schema
const statisticsQuerySchema = Joi.object({
  year: Joi.number().integer().min(1).max(3000).optional(),
});

// Pagination query schema
const paginationQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).optional(),
  skip: Joi.number().integer().min(0).optional(),
});

/**
 * @swagger
 * /api/holidays/search:
 *   get:
 *     summary: Search holidays
 *     description: Search for holidays by name in the specified language
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Search query (holiday name)
 *         example: nowruz
 *       - $ref: '#/components/parameters/Language'
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Holiday'
 *                 count:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Missing search query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/search',
  searchLimiter,
  validateQuery(searchQuerySchema),
  asyncHandler(search)
);

/**
 * @swagger
 * /api/holidays/statistics:
 *   get:
 *     summary: Get holiday statistics
 *     description: Get comprehensive statistics about holidays, optionally filtered by year
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3000
 *         description: Optional year filter
 *         example: 1403
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 15
 *                       description: Total number of holidays
 *                     byType:
 *                       type: object
 *                       properties:
 *                         national:
 *                           type: integer
 *                         religious:
 *                           type: integer
 *                         cultural:
 *                           type: integer
 *                         international:
 *                           type: integer
 *                     national:
 *                       type: integer
 *                       description: Number of national holidays
 *                     public:
 *                       type: integer
 *                       description: Number of public holidays
 *       400:
 *         description: Invalid year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/statistics',
  lenientLimiter,
  validateQuery(statisticsQuerySchema),
  asyncHandler(getStatistics)
);

/**
 * @swagger
 * /api/holidays/year/{year}/month/{month}:
 *   get:
 *     summary: Get holidays by year and month
 *     description: Get all holidays for a specific Shamsi year and month
 *     tags: [Holidays]
 *     parameters:
 *       - $ref: '#/components/parameters/Year'
 *       - $ref: '#/components/parameters/Month'
 *     responses:
 *       200:
 *         description: Holidays retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Holiday'
 *                 count:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Invalid year or month
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/year/:year/month/:month',
  lenientLimiter,
  validateParams(monthParamSchema),
  asyncHandler(getByYearAndMonth)
);

/**
 * @swagger
 * /api/holidays/year/{year}:
 *   get:
 *     summary: Get holidays by year
 *     description: Get all holidays for a specific Shamsi year
 *     tags: [Holidays]
 *     parameters:
 *       - $ref: '#/components/parameters/Year'
 *     responses:
 *       200:
 *         description: Holidays retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Holiday'
 *                 count:
 *                   type: integer
 *                   example: 12
 *       400:
 *         description: Invalid year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/year/:year',
  lenientLimiter,
  validateParams(yearParamSchema),
  asyncHandler(getByYear)
);

/**
 * @swagger
 * /api/holidays/{id}:
 *   get:
 *     summary: Get holiday by ID
 *     description: Get detailed information about a specific holiday by its ID
 *     tags: [Holidays]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Holiday ID (format year-month-day, e.g., 1403-1-1)
 *         example: 1403-1-1
 *     responses:
 *       200:
 *         description: Holiday retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Holiday'
 *       404:
 *         description: Holiday not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id',
  lenientLimiter,
  validateParams(idParamSchema),
  asyncHandler(getById)
);

/**
 * @swagger
 * /api/holidays:
 *   get:
 *     summary: Get all holidays
 *     description: Get a list of all holidays with optional pagination
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of holidays to return
 *         example: 20
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of holidays to skip (for pagination)
 *         example: 0
 *     responses:
 *       200:
 *         description: Holidays retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Holiday'
 *                 count:
 *                   type: integer
 *                   example: 20
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/',
  lenientLimiter,
  validateQuery(paginationQuerySchema),
  asyncHandler(getAll)
);

export default router;