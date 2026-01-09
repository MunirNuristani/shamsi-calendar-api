// src/services/dateService.ts

import {
  shamsiToGregorian,
  gregorianToShamsi,
  isValidShamsiDate,
  isValidGregorianDate,
  getShamsiDayOfWeek,
  isShamsiLeapYear,
  getTodayShamsi,
  getTodayGregorian,
  addDaysToShamsiDate,
  getDaysInShamsiMonth,
} from '../utils/shamsiAlgorithm';
import {
  getLocalizedMonth,
  getLocalizedDayOfWeek,
  formatShamsiDate,
  formatGregorianDate,
} from './localizationService';
import { ShamsiDate, GregorianDate, Language, WEEKEND_DAYS } from '../config/constants';

/**
 * Date Service
 * High-level date operations combining algorithm and localization
 */

export interface DateInfo {
  shamsi: ShamsiDate;
  gregorian: GregorianDate;
  dayOfWeek: {
    number: number;
    name: string;
  };
  month: {
    number: number;
    name: string;
  };
  isWeekend: boolean;
  isToday: boolean;
  formattedShamsi: string;
  formattedGregorian: string;
}

/**
 * Convert Shamsi to Gregorian with full info
 */
export const convertShamsiToGregorian = (
  shamsi: ShamsiDate,
  language: Language = 'english'
): { shamsi: ShamsiDate; gregorian: GregorianDate } => {
  if (!isValidShamsiDate(shamsi.year, shamsi.month, shamsi.day)) {
    throw new Error('Invalid Shamsi date');
  }

  const gregorian = shamsiToGregorian(shamsi);

  return { shamsi, gregorian };
};

/**
 * Convert Gregorian to Shamsi with full info
 */
export const convertGregorianToShamsi = (
  gregorian: GregorianDate,
  language: Language = 'english'
): { shamsi: ShamsiDate; gregorian: GregorianDate } => {
  if (!isValidGregorianDate(gregorian.year, gregorian.month, gregorian.day)) {
    throw new Error('Invalid Gregorian date');
  }

  const shamsi = gregorianToShamsi(gregorian);

  return { shamsi, gregorian };
};

/**
 * Get detailed information about a Shamsi date
 */
export const getShamsiDateInfo = (
  year: number,
  month: number,
  day: number,
  language: Language = 'english',
  includeGregorian: boolean = true
): DateInfo => {
  if (!isValidShamsiDate(year, month, day)) {
    throw new Error('Invalid Shamsi date');
  }

  const shamsi: ShamsiDate = { year, month, day };
  const gregorian = includeGregorian ? shamsiToGregorian(shamsi) : { year: 0, month: 0, day: 0 };
  const dayOfWeekNumber = getShamsiDayOfWeek(year, month, day);
  const dayOfWeek = getLocalizedDayOfWeek(dayOfWeekNumber, language);
  const monthInfo = getLocalizedMonth(month, language);

  const today = getTodayShamsi();
  const isToday = today.year === year && today.month === month && today.day === day;
  const isWeekend = WEEKEND_DAYS.includes(dayOfWeekNumber);

  return {
    shamsi,
    gregorian,
    dayOfWeek: {
      number: dayOfWeek.number,
      name: dayOfWeek.name,
    },
    month: {
      number: monthInfo.number,
      name: monthInfo.name,
    },
    isWeekend,
    isToday,
    formattedShamsi: formatShamsiDate(year, month, day, language, true),
    formattedGregorian: includeGregorian
      ? formatGregorianDate(gregorian.year, gregorian.month, gregorian.day, true)
      : '',
  };
};

/**
 * Get today's date with full information
 */
export const getTodayInfo = (
  language: Language = 'english',
  includeGregorian: boolean = true
): DateInfo => {
  const today = getTodayShamsi();
  return getShamsiDateInfo(today.year, today.month, today.day, language, includeGregorian);
};

/**
 * Check if a date is a weekend
 */
export const isWeekend = (year: number, month: number, day: number): boolean => {
  const dayOfWeek = getShamsiDayOfWeek(year, month, day);
  return WEEKEND_DAYS.includes(dayOfWeek);
};

/**
 * Get the first day of a month
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return getShamsiDayOfWeek(year, month, 1);
};

/**
 * Get the last day of a month
 */
export const getLastDayOfMonth = (year: number, month: number): number => {
  const daysInMonth = getDaysInShamsiMonth(month, year);
  return getShamsiDayOfWeek(year, month, daysInMonth);
};

/**
 * Get all dates in a week containing a specific date
 */
export const getWeekDates = (
  year: number,
  month: number,
  day: number,
  startOfWeek: number = 1
): ShamsiDate[] => {
  const currentDate: ShamsiDate = { year, month, day };
  const currentDayOfWeek = getShamsiDayOfWeek(year, month, day);

  // Calculate how many days back to the start of week
  let daysToSubtract = currentDayOfWeek - startOfWeek;
  if (daysToSubtract < 0) {
    daysToSubtract += 7;
  }

  const weekDates: ShamsiDate[] = [];

  // Get the start of week date
  const startDate = addDaysToShamsiDate(currentDate, -daysToSubtract);

  // Generate all 7 days of the week
  for (let i = 0; i < 7; i++) {
    weekDates.push(addDaysToShamsiDate(startDate, i));
  }

  return weekDates;
};

/**
 * Get month statistics
 */
export const getMonthStatistics = (
  year: number,
  month: number
): {
  totalDays: number;
  weekdays: number;
  weekends: number;
  startDayOfWeek: number;
  endDayOfWeek: number;
} => {
  const totalDays = getDaysInShamsiMonth(month, year);
  let weekdays = 0;
  let weekends = 0;

  for (let day = 1; day <= totalDays; day++) {
    if (isWeekend(year, month, day)) {
      weekends++;
    } else {
      weekdays++;
    }
  }

  const startDayOfWeek = getFirstDayOfMonth(year, month);
  const endDayOfWeek = getLastDayOfMonth(year, month);

  return {
    totalDays,
    weekdays,
    weekends,
    startDayOfWeek,
    endDayOfWeek,
  };
};

/**
 * Get year statistics
 */
export const getYearStatistics = (year: number): {
  totalDays: number;
  isLeapYear: boolean;
  totalWeekdays: number;
  totalWeekends: number;
} => {
  const isLeap = isShamsiLeapYear(year);
  const totalDays = isLeap ? 366 : 365;

  let totalWeekdays = 0;
  let totalWeekends = 0;

  for (let month = 1; month <= 12; month++) {
    const monthStats = getMonthStatistics(year, month);
    totalWeekdays += monthStats.weekdays;
    totalWeekends += monthStats.weekends;
  }

  return {
    totalDays,
    isLeapYear: isLeap,
    totalWeekdays,
    totalWeekends,
  };
};

/**
 * Get leap years in a range
 */
export const getLeapYearsInRange = (startYear: number, endYear: number): number[] => {
  const leapYears: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    if (isShamsiLeapYear(year)) {
      leapYears.push(year);
    }
  }

  return leapYears;
};

/**
 * Compare two Shamsi dates
 */
export const compareShamsiDates = (date1: ShamsiDate, date2: ShamsiDate): number => {
  if (date1.year !== date2.year) {
    return date1.year - date2.year;
  }
  if (date1.month !== date2.month) {
    return date1.month - date2.month;
  }
  return date1.day - date2.day;
};

/**
 * Check if date1 is before date2
 */
export const isBefore = (date1: ShamsiDate, date2: ShamsiDate): boolean => {
  return compareShamsiDates(date1, date2) < 0;
};

/**
 * Check if date1 is after date2
 */
export const isAfter = (date1: ShamsiDate, date2: ShamsiDate): boolean => {
  return compareShamsiDates(date1, date2) > 0;
};

/**
 * Check if two dates are equal
 */
export const isSameDate = (date1: ShamsiDate, date2: ShamsiDate): boolean => {
  return compareShamsiDates(date1, date2) === 0;
};

export default {
  convertShamsiToGregorian,
  convertGregorianToShamsi,
  getShamsiDateInfo,
  getTodayInfo,
  isWeekend,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getWeekDates,
  getMonthStatistics,
  getYearStatistics,
  getLeapYearsInRange,
  compareShamsiDates,
  isBefore,
  isAfter,
  isSameDate,
};