// src/services/calendarService.ts

import {
  getShamsiDateInfo,
  getWeekDates,
  getMonthStatistics,
  getYearStatistics,
  DateInfo,
} from './dateService';
import {
  getLocalizedMonth,
  getAllMonthNamesMultiLang,
  getAllDayNamesMultiLang,
} from './localizationService';
import {
  getDaysInShamsiMonth,
  addDaysToShamsiDate,
  getShamsiDayOfWeek,
} from '../utils/shamsiAlgorithm';
import { ShamsiDate, Language, StartOfWeek } from '../config/constants';
import { Holiday } from '../data/holidayData';

/**
 * Calendar Service
 * Generates calendar views (day, week, month, year)
 */

export interface DayView {
  date: {
    shamsi: ShamsiDate;
    gregorian?: {
      year: number;
      month: number;
      day: number;
    };
  };
  dayOfWeek: {
    number: number;
    name: string;
  };
  month: {
    number: number;
    name: string;
  };
  isHoliday: boolean;
  isWeekend: boolean;
  isToday: boolean;
  holidays: Array<{
    name: string;
    description: string;
    type: string;
  }>;
  formattedShamsi?: string;
  formattedGregorian?: string;
}

export interface WeekView {
  weekNumber: number;
  startDate: {
    shamsi: ShamsiDate;
    gregorian?: {
      year: number;
      month: number;
      day: number;
    };
  };
  endDate: {
    shamsi: ShamsiDate;
    gregorian?: {
      year: number;
      month: number;
      day: number;
    };
  };
  days: DayView[];
}

export interface MonthView {
  year: number;
  month: {
    number: number;
    name: string;
  };
  totalDays: number;
  startDayOfWeek: number;
  weeks: WeekView[];
  holidays: Holiday[];
  statistics: {
    totalDays: number;
    weekdays: number;
    weekends: number;
  };
}

export interface YearView {
  year: number;
  isLeapYear: boolean;
  totalDays: number;
  months: Array<{
    number: number;
    name: string;
    totalDays: number;
    startDayOfWeek: number;
    holidayCount: number;
  }>;
  holidays: Holiday[];
  statistics: {
    totalDays: number;
    totalWeekdays: number;
    totalWeekends: number;
    totalHolidays: number;
  };
}

/**
 * Generate day view
 */
export const generateDayView = (
  year: number,
  month: number,
  day: number,
  language: Language = 'english',
  includeGregorian: boolean = true,
  holidays: Holiday[] = []
): DayView => {
  const dateInfo = getShamsiDateInfo(year, month, day, language, includeGregorian);

  const dayHolidays = holidays.filter(
    (h) => h.shamsiYear === year && h.shamsiMonth === month && h.shamsiDay === day
  );

  return {
    date: {
      shamsi: dateInfo.shamsi,
      gregorian: includeGregorian ? dateInfo.gregorian : undefined,
    },
    dayOfWeek: dateInfo.dayOfWeek,
    month: dateInfo.month,
    isHoliday: dayHolidays.length > 0,
    isWeekend: dateInfo.isWeekend,
    isToday: dateInfo.isToday,
    holidays: dayHolidays.map((h) => ({
      name: h.names[language] || h.names.english,
      description: h.descriptions[language] || h.descriptions.english,
      type: h.type,
    })),
    formattedShamsi: dateInfo.formattedShamsi,
    formattedGregorian: includeGregorian ? dateInfo.formattedGregorian : undefined,
  };
};

/**
 * Generate week view
 */
export const generateWeekView = (
  year: number,
  month: number,
  day: number,
  language: Language = 'english',
  startOfWeek: StartOfWeek = 1,
  includeGregorian: boolean = true,
  holidays: Holiday[] = []
): WeekView => {
  const weekDates = getWeekDates(year, month, day, startOfWeek);

  const days: DayView[] = weekDates.map((date) =>
    generateDayView(
      date.year,
      date.month,
      date.day,
      language,
      includeGregorian,
      holidays
    )
  );

  // Calculate week number (simple approximation)
  const firstDayOfYear = { year, month: 1, day: 1 };
  const currentDate = { year, month, day };
  const daysSinceStart = Math.floor(
    (new Date(currentDate.year, currentDate.month - 1, currentDate.day).getTime() -
      new Date(firstDayOfYear.year, firstDayOfYear.month - 1, firstDayOfYear.day).getTime()) /
    (1000 * 60 * 60 * 24)
  );
  const weekNumber = Math.ceil((daysSinceStart + 1) / 7);

  return {
    weekNumber,
    startDate: {
      shamsi: weekDates[0],
      gregorian: includeGregorian ? days[0].date.gregorian : undefined,
    },
    endDate: {
      shamsi: weekDates[6],
      gregorian: includeGregorian ? days[6].date.gregorian : undefined,
    },
    days,
  };
};

/**
 * Generate month view
 */
export const generateMonthView = (
  year: number,
  month: number,
  language: Language = 'english',
  startOfWeek: StartOfWeek = 1,
  includeGregorian: boolean = true,
  holidays: Holiday[] = []
): MonthView => {
  const monthInfo = getLocalizedMonth(month, language);
  const totalDays = getDaysInShamsiMonth(month, year);
  const startDayOfWeek = getShamsiDayOfWeek(year, month, 1);
  const statistics = getMonthStatistics(year, month);

  // Filter holidays for this month
  const monthHolidays = holidays.filter(
    (h) => h.shamsiYear === year && h.shamsiMonth === month
  );

  // Generate weeks
  const weeks: WeekView[] = [];
  let currentDay = 1;

  while (currentDay <= totalDays) {
    const weekView = generateWeekView(
      year,
      month,
      currentDay,
      language,
      startOfWeek,
      includeGregorian,
      holidays
    );
    weeks.push(weekView);

    // Move to next week
    currentDay += 7;

    // Adjust if we've gone past the end of month
    if (currentDay > totalDays) {
      break;
    }
  }

  return {
    year,
    month: {
      number: monthInfo.number,
      name: monthInfo.name,
    },
    totalDays,
    startDayOfWeek,
    weeks,
    holidays: monthHolidays,
    statistics: {
      totalDays: statistics.totalDays,
      weekdays: statistics.weekdays,
      weekends: statistics.weekends,
    },
  };
};

/**
 * Generate year view
 */
export const generateYearView = (
  year: number,
  language: Language = 'english',
  includeGregorian: boolean = true,
  holidays: Holiday[] = [],
  format: 'full' | 'compact' = 'full'
): YearView => {
  const yearStats = getYearStatistics(year);

  // Filter holidays for this year
  const yearHolidays = holidays.filter((h) => h.shamsiYear === year);

  const months = [];

  for (let month = 1; month <= 12; month++) {
    const monthInfo = getLocalizedMonth(month, language);
    const totalDays = getDaysInShamsiMonth(month, year);
    const startDayOfWeek = getShamsiDayOfWeek(year, month, 1);
    const monthHolidayCount = yearHolidays.filter((h) => h.shamsiMonth === month).length;

    months.push({
      number: month,
      name: monthInfo.name,
      totalDays,
      startDayOfWeek,
      holidayCount: monthHolidayCount,
    });
  }

  return {
    year,
    isLeapYear: yearStats.isLeapYear,
    totalDays: yearStats.totalDays,
    months,
    holidays: format === 'full' ? yearHolidays : [],
    statistics: {
      totalDays: yearStats.totalDays,
      totalWeekdays: yearStats.totalWeekdays,
      totalWeekends: yearStats.totalWeekends,
      totalHolidays: yearHolidays.length,
    },
  };
};

/**
 * Generate full month calendar grid (including padding days)
 */
export const generateMonthGrid = (
  year: number,
  month: number,
  language: Language = 'english',
  startOfWeek: StartOfWeek = 1,
  includeGregorian: boolean = true,
  holidays: Holiday[] = [],
  includePadding: boolean = true
): {
  month: MonthView;
  grid: (DayView | null)[][];
} => {
  const monthView = generateMonthView(
    year,
    month,
    language,
    startOfWeek,
    includeGregorian,
    holidays
  );

  const grid: (DayView | null)[][] = [];
  const totalDays = getDaysInShamsiMonth(month, year);
  const firstDayOfWeek = getShamsiDayOfWeek(year, month, 1);

  // Calculate padding
  let paddingBefore = firstDayOfWeek - startOfWeek;
  if (paddingBefore < 0) {
    paddingBefore += 7;
  }

  let currentWeek: (DayView | null)[] = [];
  let dayCounter = 1;

  // Add padding before first day
  if (includePadding) {
    for (let i = 0; i < paddingBefore; i++) {
      currentWeek.push(null);
    }
  }

  // Add all days of the month
  while (dayCounter <= totalDays) {
    const dayView = generateDayView(
      year,
      month,
      dayCounter,
      language,
      includeGregorian,
      holidays
    );
    currentWeek.push(dayView);

    if (currentWeek.length === 7) {
      grid.push(currentWeek);
      currentWeek = [];
    }

    dayCounter++;
  }

  // Add padding after last day
  if (includePadding && currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    grid.push(currentWeek);
  } else if (currentWeek.length > 0) {
    grid.push(currentWeek);
  }

  return {
    month: monthView,
    grid,
  };
};

/**
 * Get month and day info for all languages
 */
export const getCalendarInfo = () => {
  return {
    months: getAllMonthNamesMultiLang(),
    days: getAllDayNamesMultiLang(),
  };
};

export default {
  generateDayView,
  generateWeekView,
  generateMonthView,
  generateYearView,
  generateMonthGrid,
  getCalendarInfo,
};