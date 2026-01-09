// src/services/holidayService.ts

import { holidayStore, Holiday } from '../data/holidayData';
import { Language, HolidayType } from '../config/constants';

/**
 * Holiday Service
 * Manages holiday queries using in-memory data store
 */

/**
 * Get holiday by ID
 */
export const getHolidayById = (id: string): Holiday | undefined => {
  return holidayStore.getById(id);
};

/**
 * Get all holidays for a specific year
 */
export const getHolidaysByYear = (year: number): Holiday[] => {
  return holidayStore.getByYear(year);
};

/**
 * Get all holidays for a specific year and month
 */
export const getHolidaysByYearAndMonth = (year: number, month: number): Holiday[] => {
  return holidayStore.getByYearAndMonth(year, month);
};

/**
 * Get holiday by specific date
 */
export const getHolidaysByDate = (year: number, month: number, day: number): Holiday[] => {
  return holidayStore.getByDate(year, month, day);
};

/**
 * Get all national holidays
 */
export const getNationalHolidays = (year?: number): Holiday[] => {
  return holidayStore.getNationalHolidays(year);
};

/**
 * Get holidays by type
 */
export const getHolidaysByType = (type: HolidayType, year?: number): Holiday[] => {
  return holidayStore.getByType(type, year);
};

/**
 * Get all public holidays
 */
export const getPublicHolidays = (year?: number): Holiday[] => {
  return holidayStore.getPublicHolidays(year);
};

/**
 * Get all holidays (with optional pagination)
 */
export const getAllHolidays = (limit?: number, skip?: number): Holiday[] => {
  const allHolidays = holidayStore.getAll();

  if (skip !== undefined && limit !== undefined) {
    return allHolidays.slice(skip, skip + limit);
  } else if (limit !== undefined) {
    return allHolidays.slice(0, limit);
  }

  return allHolidays;
};

/**
 * Count holidays by criteria
 */
export const countHolidays = (year?: number): number => {
  return holidayStore.count(year);
};

/**
 * Search holidays by name
 */
export const searchHolidays = (searchTerm: string, language: Language = 'english'): Holiday[] => {
  return holidayStore.search(searchTerm, language);
};

/**
 * Get holiday statistics
 */
export const getHolidayStatistics = (year?: number): {
  total: number;
  byType: { [key: string]: number };
  national: number;
  public: number;
} => {
  return holidayStore.getStatistics(year);
};

/**
 * Check if a date is a holiday
 */
export const isHoliday = (year: number, month: number, day: number): boolean => {
  return holidayStore.isHoliday(year, month, day);
};

/**
 * Get upcoming holidays
 */
export const getUpcomingHolidays = (
  fromYear: number,
  fromMonth: number,
  fromDay: number,
  limit: number = 10
): Holiday[] => {
  return holidayStore.getUpcoming(fromYear, fromMonth, fromDay, limit);
};

export default {
  getHolidayById,
  getHolidaysByYear,
  getHolidaysByYearAndMonth,
  getHolidaysByDate,
  getNationalHolidays,
  getHolidaysByType,
  getPublicHolidays,
  getAllHolidays,
  countHolidays,
  searchHolidays,
  getHolidayStatistics,
  isHoliday,
  getUpcomingHolidays,
};