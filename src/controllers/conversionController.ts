// src/controllers/conversionController.ts

import { Request, Response, NextFunction } from 'express';
import { convertShamsiToGregorian, convertGregorianToShamsi, getTodayInfo } from '../services/dateService';
import { Language } from '../config/constants';
import { AppError } from '../middleware/errorHandler';

/**
 * Conversion Controller
 * Handles date conversion between Shamsi and Gregorian calendars
 */

/**
 * Convert Shamsi date to Gregorian
 * POST /api/convert/shamsi-to-gregorian
 */
export const shamsiToGregorian = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { year, month, day } = req.body;
    const language = (req.query.lang as Language) || 'english';

    const result = convertShamsiToGregorian(
      { year, month, day },
      language
    );

    res.status(200).json({
      success: true,
      data: {
        input: {
          calendar: 'Shamsi',
          date: result.shamsi,
        },
        output: {
          calendar: 'Gregorian',
          date: result.gregorian,
        },
      },
    });
  } catch (error) {
    // Convert validation errors to 400 status
    if (error instanceof Error && error.message.includes('Invalid')) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

/**
 * Convert Gregorian date to Shamsi
 * POST /api/convert/gregorian-to-shamsi
 */
export const gregorianToShamsi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { year, month, day } = req.body;
    const language = (req.query.lang as Language) || 'english';

    const result = convertGregorianToShamsi(
      { year, month, day },
      language
    );

    res.status(200).json({
      success: true,
      data: {
        input: {
          calendar: 'Gregorian',
          date: result.gregorian,
        },
        output: {
          calendar: 'Shamsi',
          date: result.shamsi,
        },
      },
    });
  } catch (error) {
    // Convert validation errors to 400 status
    if (error instanceof Error && error.message.includes('Invalid')) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

/**
 * Get today's date in both calendars
 * GET /api/convert/today
 */
export const getToday = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const language = (req.query.lang as Language) || 'english';
    // Joi validator converts string to boolean and sets default to true
    // After validation, this will be a boolean value
    const includeGregorian = typeof req.query.includeGregorian === 'boolean'
      ? req.query.includeGregorian
      : req.query.includeGregorian !== 'false';

    const todayInfo = getTodayInfo(language, includeGregorian);

    res.status(200).json({
      success: true,
      data: {
        shamsi: todayInfo.shamsi,
        gregorian: includeGregorian ? todayInfo.gregorian : undefined,
        dayOfWeek: todayInfo.dayOfWeek,
        month: todayInfo.month,
        isWeekend: todayInfo.isWeekend,
        formattedShamsi: todayInfo.formattedShamsi,
        formattedGregorian: includeGregorian ? todayInfo.formattedGregorian : undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  shamsiToGregorian,
  gregorianToShamsi,
  getToday,
};