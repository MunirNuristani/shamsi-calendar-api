// src/controllers/infoController.ts

import { Request, Response, NextFunction } from 'express';
import {
  getAllMonthNamesMultiLang,
  getAllDayNamesMultiLang,
} from '../services/localizationService';
import { getLeapYearsInRange } from '../services/dateService';

/**
 * Info Controller
 * Handles utility endpoints for calendar information
 */

/**
 * Get all month names in all languages
 * GET /api/info/months
 */
export const getMonths = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const months = getAllMonthNamesMultiLang();

    res.status(200).json({
      success: true,
      data: months,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all day names in all languages
 * GET /api/info/days
 */
export const getDays = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const days = getAllDayNamesMultiLang();

    res.status(200).json({
      success: true,
      data: days,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get leap years in a range
 * GET /api/info/leap-years/:startYear/:endYear
 */
export const getLeapYears = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startYear, endYear } = req.params;

    const leapYears = getLeapYearsInRange(parseInt(startYear), parseInt(endYear));

    res.status(200).json({
      success: true,
      count: leapYears.length,
      data: leapYears,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get API information
 * GET /api/info
 */
export const getApiInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: {
        name: 'Shamsi Calendar API',
        version: '1.0.0',
        description: 'A comprehensive API for the Afghan Shamsi (Solar Hijri) calendar',
        features: [
          'Date conversion between Shamsi and Gregorian calendars',
          'Calendar views (day, week, month, year)',
          'Holiday management',
          'Multi-language support (Dari, Pashto, English)',
          'Leap year calculations',
        ],
        supportedLanguages: ['dari', 'pashto', 'english'],
        endpoints: {
          conversion: '/api/convert',
          calendar: '/api/calendar',
          holidays: '/api/holidays',
          info: '/api/info',
        },
        documentation: '/api/docs',
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getMonths,
  getDays,
  getLeapYears,
  getApiInfo,
};