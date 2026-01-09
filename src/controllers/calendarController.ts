// src/controllers/calendarController.ts

import { Request, Response, NextFunction } from 'express';
import {
  generateDayView,
  generateWeekView,
  generateMonthView,
  generateYearView,
} from '../services/calendarService';
import { getHolidaysByYear, getHolidaysByYearAndMonth } from '../services/holidayService';
import { Language, StartOfWeek, ResponseFormat } from '../config/constants';

/**
 * Calendar Controller
 * Handles calendar view generation (day, week, month, year)
 */

/**
 * Get day view
 * GET /api/calendar/day/:year/:month/:day
 */
export const getDayView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { year, month, day } = req.params;
    const language = (req.query.lang as Language) || 'english';
    const includeGregorian = req.query.includeGregorian !== 'false';
    const includeHolidays = req.query.includeHolidays !== 'false';

    const holidays = includeHolidays
      ? await getHolidaysByYearAndMonth(parseInt(year), parseInt(month))
      : [];

    const dayView = generateDayView(
      parseInt(year),
      parseInt(month),
      parseInt(day),
      language,
      includeGregorian,
      holidays
    );

    res.status(200).json({
      success: true,
      data: dayView,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get week view
 * GET /api/calendar/week/:year/:month/:day
 */
export const getWeekView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { year, month, day } = req.params;
    const language = (req.query.lang as Language) || 'english';
    const startOfWeek = parseInt(req.query.startOfWeek as string) || 1;
    const includeGregorian = req.query.includeGregorian !== 'false';
    const includeHolidays = req.query.includeHolidays !== 'false';

    const holidays = includeHolidays
      ? await getHolidaysByYear(parseInt(year))
      : [];

    const weekView = generateWeekView(
      parseInt(year),
      parseInt(month),
      parseInt(day),
      language,
      startOfWeek as StartOfWeek,
      includeGregorian,
      holidays
    );

    res.status(200).json({
      success: true,
      data: weekView,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get month view
 * GET /api/calendar/month/:year/:month
 */
export const getMonthView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { year, month } = req.params;
    const language = (req.query.lang as Language) || 'english';
    const startOfWeek = parseInt(req.query.startOfWeek as string) || 1;
    const includeGregorian = req.query.includeGregorian !== 'false';
    const includeHolidays = req.query.includeHolidays !== 'false';

    const holidays = includeHolidays
      ? await getHolidaysByYearAndMonth(parseInt(year), parseInt(month))
      : [];

    const monthView = generateMonthView(
      parseInt(year),
      parseInt(month),
      language,
      startOfWeek as StartOfWeek,
      includeGregorian,
      holidays
    );

    res.status(200).json({
      success: true,
      data: monthView,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get year view
 * GET /api/calendar/year/:year
 */
export const getYearView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { year } = req.params;
    const language = (req.query.lang as Language) || 'english';
    const includeGregorian = req.query.includeGregorian !== 'false';
    const includeHolidays = req.query.includeHolidays !== 'false';
    const format = (req.query.format as ResponseFormat) || 'full';

    const holidays = includeHolidays
      ? await getHolidaysByYear(parseInt(year))
      : [];

    const yearView = generateYearView(
      parseInt(year),
      language,
      includeGregorian,
      holidays,
      format
    );

    res.status(200).json({
      success: true,
      data: yearView,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDayView,
  getWeekView,
  getMonthView,
  getYearView,
};