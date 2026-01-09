

import express from 'express';
import {
  getDayView,
  getWeekView,
  getMonthView,
  getYearView,
} from '../controllers/calendarController';
import { validateParams, validateQuery } from '../middleware/validator';
import {
  dayParamSchema,
  monthParamSchema,
  yearParamSchema,
  queryParamsSchema,
} from '../utils/validators';
import { asyncHandler } from '../middleware/errorHandler';
import { lenientLimiter } from '../middleware/rateLimit';

const router = express.Router();

/**
 * @swagger
 * /api/calendar/day/{year}/{month}/{day}:
 *   get:
 *     summary: Get day view
 *     description: Get complete information for a specific Shamsi calendar day including Gregorian date, day of week, month info, and holidays
 *     tags: [Calendar]
 *     parameters:
 *       - $ref: '#/components/parameters/Year'
 *       - $ref: '#/components/parameters/Month'
 *       - $ref: '#/components/parameters/Day'
 *       - $ref: '#/components/parameters/Language'
 *       - $ref: '#/components/parameters/IncludeHolidays'
 *     responses:
 *       200:
 *         description: Day information retrieved successfully
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
 *                     date:
 *                       type: object
 *                       properties:
 *                         shamsi:
 *                           $ref: '#/components/schemas/ShamsiDate'
 *                         gregorian:
 *                           $ref: '#/components/schemas/GregorianDate'
 *                     dayOfWeek:
 *                       type: object
 *                       properties:
 *                         number:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Saturday
 *                     month:
 *                       type: object
 *                       properties:
 *                         number:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Hamal
 *                     isWeekend:
 *                       type: boolean
 *                       example: false
 *                     isToday:
 *                       type: boolean
 *                       example: false
 *                     isHoliday:
 *                       type: boolean
 *                       example: true
 *                     holidays:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Holiday'
 *       400:
 *         description: Invalid date parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/day/:year/:month/:day',
  lenientLimiter,
  validateParams(dayParamSchema),
  validateQuery(queryParamsSchema),
  asyncHandler(getDayView)
);

/**
 * @swagger
 * /api/calendar/week/{year}/{month}/{day}:
 *   get:
 *     summary: Get week view
 *     description: Get the full week containing the specified date (7 days) with all day information
 *     tags: [Calendar]
 *     parameters:
 *       - $ref: '#/components/parameters/Year'
 *       - $ref: '#/components/parameters/Month'
 *       - $ref: '#/components/parameters/Day'
 *       - $ref: '#/components/parameters/Language'
 *       - $ref: '#/components/parameters/StartOfWeek'
 *       - $ref: '#/components/parameters/IncludeHolidays'
 *     responses:
 *       200:
 *         description: Week information retrieved successfully
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
 *                     weekNumber:
 *                       type: integer
 *                       example: 3
 *                       description: Week number in the year
 *                     startDate:
 *                       $ref: '#/components/schemas/ShamsiDate'
 *                     endDate:
 *                       $ref: '#/components/schemas/ShamsiDate'
 *                     days:
 *                       type: array
 *                       description: Array of 7 days
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             $ref: '#/components/schemas/ShamsiDate'
 *                           dayOfWeek:
 *                             type: object
 *                           isWeekend:
 *                             type: boolean
 *                           isToday:
 *                             type: boolean
 *       400:
 *         description: Invalid date parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/week/:year/:month/:day',
  lenientLimiter,
  validateParams(dayParamSchema),
  validateQuery(queryParamsSchema),
  asyncHandler(getWeekView)
);

/**
 * @swagger
 * /api/calendar/month/{year}/{month}:
 *   get:
 *     summary: Get month view
 *     description: Get complete month calendar with all weeks, days, and statistics
 *     tags: [Calendar]
 *     parameters:
 *       - $ref: '#/components/parameters/Year'
 *       - $ref: '#/components/parameters/Month'
 *       - $ref: '#/components/parameters/Language'
 *       - $ref: '#/components/parameters/StartOfWeek'
 *       - $ref: '#/components/parameters/IncludeHolidays'
 *     responses:
 *       200:
 *         description: Month calendar retrieved successfully
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
 *                     year:
 *                       type: integer
 *                       example: 1403
 *                     month:
 *                       type: object
 *                       properties:
 *                         number:
 *                           type: integer
 *                           example: 10
 *                         name:
 *                           type: string
 *                           example: Jadi
 *                     totalDays:
 *                       type: integer
 *                       example: 30
 *                       description: Number of days in this month
 *                     weeks:
 *                       type: array
 *                       description: Array of weeks in the month
 *                       items:
 *                         type: object
 *                         properties:
 *                           weekNumber:
 *                             type: integer
 *                           days:
 *                             type: array
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalDays:
 *                           type: integer
 *                         weekdays:
 *                           type: integer
 *                         weekends:
 *                           type: integer
 *                         holidays:
 *                           type: integer
 *       400:
 *         description: Invalid month or year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/month/:year/:month',
  lenientLimiter,
  validateParams(monthParamSchema),
  validateQuery(queryParamsSchema),
  asyncHandler(getMonthView)
);

/**
 * @swagger
 * /api/calendar/year/{year}:
 *   get:
 *     summary: Get year view
 *     description: Get complete year calendar with all 12 months and annual statistics
 *     tags: [Calendar]
 *     parameters:
 *       - $ref: '#/components/parameters/Year'
 *       - $ref: '#/components/parameters/Language'
 *       - $ref: '#/components/parameters/Format'
 *       - $ref: '#/components/parameters/IncludeHolidays'
 *     responses:
 *       200:
 *         description: Year calendar retrieved successfully
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
 *                     year:
 *                       type: integer
 *                       example: 1403
 *                     isLeapYear:
 *                       type: boolean
 *                       example: true
 *                       description: Whether this is a leap year
 *                     totalDays:
 *                       type: integer
 *                       example: 366
 *                       description: Total days in the year (365 or 366)
 *                     months:
 *                       type: array
 *                       description: All 12 months
 *                       items:
 *                         type: object
 *                         properties:
 *                           number:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: Hamal
 *                           totalDays:
 *                             type: integer
 *                             example: 31
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalDays:
 *                           type: integer
 *                         totalWeekdays:
 *                           type: integer
 *                         totalWeekends:
 *                           type: integer
 *                         totalHolidays:
 *                           type: integer
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
  validateQuery(queryParamsSchema),
  asyncHandler(getYearView)
);

export default router;