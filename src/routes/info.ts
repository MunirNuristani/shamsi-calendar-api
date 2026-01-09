// src/routes/info.ts

import express from 'express';
import {
  getMonths,
  getDays,
  getLeapYears,
  getApiInfo,
} from '../controllers/infoController';
import { validateParams } from '../middleware/validator';
import { yearRangeSchema } from '../utils/validators';
import { asyncHandler } from '../middleware/errorHandler';
import { lenientLimiter } from '../middleware/rateLimit';

const router = express.Router();

/**
 * @swagger
 * /api/info:
 *   get:
 *     summary: Get API information
 *     description: Get comprehensive information about the Shamsi Calendar API including supported features and metadata
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
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
 *                     name:
 *                       type: string
 *                       example: Shamsi Calendar API
 *                     version:
 *                       type: string
 *                       example: 1.0.0
 *                     description:
 *                       type: string
 *                       example: RESTful API for Afghan Shamsi calendar
 *                     supportedLanguages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [dari, pashto, english]
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [Date conversion, Calendar views, Holiday management]
 */
router.get(
  '/',
  lenientLimiter,
  asyncHandler(getApiInfo)
);

/**
 * @swagger
 * /api/info/months:
 *   get:
 *     summary: Get all month names
 *     description: Get names of all 12 Shamsi calendar months in Dari, Pashto, and English
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: Month names retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       number:
 *                         type: integer
 *                         example: 1
 *                       names:
 *                         $ref: '#/components/schemas/LocalizedName'
 *                       days:
 *                         type: integer
 *                         example: 31
 *                         description: Number of days in this month (for a normal year)
 */
router.get(
  '/months',
  lenientLimiter,
  asyncHandler(getMonths)
);

/**
 * @swagger
 * /api/info/days:
 *   get:
 *     summary: Get all day names
 *     description: Get names of all 7 days of the week in Dari, Pashto, and English
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: Day names retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       number:
 *                         type: integer
 *                         example: 1
 *                         description: Day number (1=Saturday, 7=Friday)
 *                       names:
 *                         $ref: '#/components/schemas/LocalizedName'
 */
router.get(
  '/days',
  lenientLimiter,
  asyncHandler(getDays)
);

/**
 * @swagger
 * /api/info/leap-years/{startYear}/{endYear}:
 *   get:
 *     summary: Get leap years in range
 *     description: Get all Shamsi leap years within a specified year range (inclusive)
 *     tags: [Info]
 *     parameters:
 *       - in: path
 *         name: startYear
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3000
 *         description: Start year of the range
 *         example: 1400
 *       - in: path
 *         name: endYear
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3000
 *         description: End year of the range (must be >= startYear)
 *         example: 1410
 *     responses:
 *       200:
 *         description: Leap years retrieved successfully
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
 *                     startYear:
 *                       type: integer
 *                       example: 1400
 *                     endYear:
 *                       type: integer
 *                       example: 1410
 *                     leapYears:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1403, 1408]
 *                       description: List of leap years in the range
 *                     count:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Invalid year range
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/leap-years/:startYear/:endYear',
  lenientLimiter,
  validateParams(yearRangeSchema),
  asyncHandler(getLeapYears)
);

export default router;