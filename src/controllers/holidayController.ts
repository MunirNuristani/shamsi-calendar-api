// src/controllers/holidayController.ts

import { Request, Response, NextFunction } from 'express';
import {
  getHolidayById,
  getHolidaysByYear,
  getHolidaysByYearAndMonth,
  getAllHolidays,
  searchHolidays,
  getHolidayStatistics,
} from '../services/holidayService';
import { Language } from '../config/constants';
import { createError } from '../middleware/errorHandler';

/**
 * Holiday Controller
 * Handles holiday query operations (read-only)
 */

/**
 * Get holiday by ID
 * GET /api/holidays/:id
 */
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const holiday = getHolidayById(id);

    if (!holiday) {
      throw createError.notFound('Holiday not found');
    }

    res.status(200).json({
      success: true,
      data: holiday,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all holidays for a year
 * GET /api/holidays/year/:year
 */
export const getByYear = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { year } = req.params;

    const holidays = getHolidaysByYear(parseInt(year));

    res.status(200).json({
      success: true,
      count: holidays.length,
      data: holidays,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all holidays for a specific month
 * GET /api/holidays/year/:year/month/:month
 */
export const getByYearAndMonth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { year, month } = req.params;

    const holidays = getHolidaysByYearAndMonth(parseInt(year), parseInt(month));

    res.status(200).json({
      success: true,
      count: holidays.length,
      data: holidays,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all holidays
 * GET /api/holidays
 */
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;

    const holidays = getAllHolidays(limit, skip);

    res.status(200).json({
      success: true,
      count: holidays.length,
      data: holidays,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search holidays by name
 * GET /api/holidays/search
 */
export const search = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const searchTerm = req.query.q as string;
    const language = (req.query.lang as Language) || 'english';

    if (!searchTerm) {
      throw createError.badRequest('Search term is required');
    }

    const holidays = searchHolidays(searchTerm, language);

    res.status(200).json({
      success: true,
      count: holidays.length,
      data: holidays,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get holiday statistics
 * GET /api/holidays/statistics
 */
export const getStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const statistics = getHolidayStatistics(year);

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getById,
  getByYear,
  getByYearAndMonth,
  getAll,
  search,
  getStatistics,
};