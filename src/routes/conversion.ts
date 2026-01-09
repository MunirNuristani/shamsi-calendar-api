// src/routes/conversion.ts

import express from 'express';
import {
  shamsiToGregorian,
  gregorianToShamsi,
  getToday,
} from '../controllers/conversionController';
import { validateBody, validateQuery } from '../middleware/validator';
import { shamsiDateSchema, gregorianDateSchema, queryParamsSchema } from '../utils/validators';
import { asyncHandler } from '../middleware/errorHandler';
import { apiLimiter } from '../middleware/rateLimit';

const router = express.Router();

/**
 * @swagger
 * /api/convert/shamsi-to-gregorian:
 *   post:
 *     summary: Convert Shamsi date to Gregorian
 *     description: Convert a date from Shamsi (Solar Hijri) calendar to Gregorian calendar
 *     tags: [Conversion]
 *     parameters:
 *       - $ref: '#/components/parameters/Language'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShamsiDate'
 *     responses:
 *       200:
 *         description: Successfully converted date
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
 *                     input:
 *                       type: object
 *                       properties:
 *                         calendar:
 *                           type: string
 *                           example: Shamsi
 *                         date:
 *                           $ref: '#/components/schemas/ShamsiDate'
 *                     output:
 *                       type: object
 *                       properties:
 *                         calendar:
 *                           type: string
 *                           example: Gregorian
 *                         date:
 *                           $ref: '#/components/schemas/GregorianDate'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/shamsi-to-gregorian',
  apiLimiter,
  validateBody(shamsiDateSchema),
  validateQuery(queryParamsSchema),
  asyncHandler(shamsiToGregorian)
);

/**
 * @swagger
 * /api/convert/gregorian-to-shamsi:
 *   post:
 *     summary: Convert Gregorian date to Shamsi
 *     description: Convert a date from Gregorian calendar to Shamsi (Solar Hijri) calendar
 *     tags: [Conversion]
 *     parameters:
 *       - $ref: '#/components/parameters/Language'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GregorianDate'
 *     responses:
 *       200:
 *         description: Successfully converted date
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
 *                     input:
 *                       type: object
 *                       properties:
 *                         calendar:
 *                           type: string
 *                           example: Gregorian
 *                         date:
 *                           $ref: '#/components/schemas/GregorianDate'
 *                     output:
 *                       type: object
 *                       properties:
 *                         calendar:
 *                           type: string
 *                           example: Shamsi
 *                         date:
 *                           $ref: '#/components/schemas/ShamsiDate'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/gregorian-to-shamsi',
  apiLimiter,
  validateBody(gregorianDateSchema),
  validateQuery(queryParamsSchema),
  asyncHandler(gregorianToShamsi)
);

/**
 * @swagger
 * /api/convert/today:
 *   get:
 *     summary: Get today's date
 *     description: Get today's date in both Shamsi and Gregorian calendars with detailed information
 *     tags: [Conversion]
 *     parameters:
 *       - $ref: '#/components/parameters/Language'
 *       - $ref: '#/components/parameters/IncludeGregorian'
 *     responses:
 *       200:
 *         description: Today's date information
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
 *                     shamsi:
 *                       $ref: '#/components/schemas/ShamsiDate'
 *                     gregorian:
 *                       $ref: '#/components/schemas/GregorianDate'
 *                     dayOfWeek:
 *                       type: object
 *                       properties:
 *                         number:
 *                           type: integer
 *                           example: 4
 *                         name:
 *                           type: string
 *                           example: Tuesday
 *                     month:
 *                       type: object
 *                       properties:
 *                         number:
 *                           type: integer
 *                           example: 10
 *                         name:
 *                           type: string
 *                           example: Jadi
 *                     isWeekend:
 *                       type: boolean
 *                       example: false
 *                     formattedShamsi:
 *                       type: string
 *                       example: "Jadi 19, 1403"
 */
router.get(
  '/today',
  apiLimiter,
  validateQuery(queryParamsSchema),
  asyncHandler(getToday)
);

export default router;