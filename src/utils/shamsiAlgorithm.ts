import { ShamsiDate, GregorianDate, DAYS_IN_MONTH, DAYS_IN_MONTH_LEAP } from '../config/constants';

/**
 * Shamsi (Solar Hijri) Calendar Algorithm
 * Based on astronomical calculations for the Iranian/Afghan calendar
 */

/**
 * Check if a Shamsi year is a leap year
 * Uses the 33-year cycle algorithm
 */
export const isShamsiLeapYear = (year: number): boolean => {
  // The 33-year cycle: 1, 5, 9, 13, 17, 22, 26, 30 are leap years in each 33-year cycle
  const breaks = [1, 5, 9, 13, 17, 22, 26, 30];
  const cycle = year % 33;
  return breaks.includes(cycle);
};

/**
 * Check if a Gregorian year is a leap year
 */
export const isGregorianLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Get the number of days in a Shamsi month
 */
export const getDaysInShamsiMonth = (month: number, year: number): number => {
  const isLeap = isShamsiLeapYear(year);
  return isLeap ? DAYS_IN_MONTH_LEAP[month] : DAYS_IN_MONTH[month];
};

/**
 * Get the number of days in a Gregorian month
 */
export const getDaysInGregorianMonth = (month: number, year: number): number => {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isGregorianLeapYear(year)) {
    return 29;
  }
  return daysInMonth[month - 1];
};

/**
 * Convert Gregorian date to Julian Day Number
 */
const gregorianToJulianDay = (year: number, month: number, day: number): number => {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) +
    Math.floor(y / 400) - 32045;
};

/**
 * Convert Julian Day Number to Gregorian date
 */
const julianDayToGregorian = (jd: number): GregorianDate => {
  let a = jd + 32044;
  let b = Math.floor((4 * a + 3) / 146097);
  let c = a - Math.floor((146097 * b) / 4);
  let d = Math.floor((4 * c + 3) / 1461);
  let e = c - Math.floor((1461 * d) / 4);
  let m = Math.floor((5 * e + 2) / 153);

  let day = e - Math.floor((153 * m + 2) / 5) + 1;
  let month = m + 3 - 12 * Math.floor(m / 10);
  let year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
};

/**
 * Convert Shamsi date to Julian Day Number
 * Based on the algorithm by Kazimierz M. Borkowski
 */
const shamsiToJulianDay = (year: number, month: number, day: number): number => {
  // Shamsi epoch: March 22, 622 CE (Julian Day 1948320)
  const SHAMSI_EPOCH = 1948320;

  // Calculate days from months
  let monthDays = 0;
  if (month <= 7) {
    monthDays = (month - 1) * 31;
  } else {
    monthDays = 6 * 31 + (month - 7) * 30;
  }

  // Calculate total days from years
  let y = year - 1;
  let yearDays = 365 * y;

  // Add leap days based on 33-year cycle
  // In each 33-year cycle: years 1,5,9,13,17,22,26,30 are leap (8 leap years per cycle)
  let cycles = Math.floor(y / 33);
  yearDays += cycles * 8; // 8 leap days per 33-year cycle

  // Add leap days for remaining years in current cycle
  let remainingYears = y % 33;
  const leapPositions = [1, 5, 9, 13, 17, 22, 26, 30];
  for (let i = 0; i < leapPositions.length; i++) {
    if (leapPositions[i] <= remainingYears) {
      yearDays++;
    }
  }

  return SHAMSI_EPOCH + yearDays + monthDays + day - 1;
};

/**
 * Convert Julian Day Number to Shamsi date
 */
const julianDayToShamsi = (jd: number): ShamsiDate => {
  const SHAMSI_EPOCH = 1948320;

  // Days since Shamsi epoch
  let daysSinceEpoch = jd - SHAMSI_EPOCH;

  // Estimate year using 33-year cycles (each cycle has 12053 days = 33*365 + 8 leap days)
  const daysPerCycle = 12053;
  let cycles = Math.floor(daysSinceEpoch / daysPerCycle);
  let remainingDays = daysSinceEpoch - cycles * daysPerCycle;

  // Find the year within the current cycle
  let year = cycles * 33 + 1;
  const leapPositions = [1, 5, 9, 13, 17, 22, 26, 30];

  while (remainingDays >= 365) {
    let yearInCycle = (year - 1) % 33 + 1;
    let daysInYear = leapPositions.includes(yearInCycle) ? 366 : 365;

    if (remainingDays >= daysInYear) {
      remainingDays -= daysInYear;
      year++;
    } else {
      break;
    }
  }

  // Now find month and day from remainingDays
  let month = 1;
  let day = remainingDays + 1;

  // First 6 months have 31 days each
  if (day <= 186) {
    month = Math.floor((day - 1) / 31) + 1;
    day = ((day - 1) % 31) + 1;
  } else {
    // Months 7-12 have 30 days each (except month 12 in leap years has 30)
    let daysAfterMonth6 = day - 186;
    month = Math.floor((daysAfterMonth6 - 1) / 30) + 7;
    day = ((daysAfterMonth6 - 1) % 30) + 1;
  }

  return { year, month, day };
};

/**
 * Convert Shamsi date to Gregorian date
 */
export const shamsiToGregorian = (shamsi: ShamsiDate): GregorianDate => {
  const jd = shamsiToJulianDay(shamsi.year, shamsi.month, shamsi.day);
  return julianDayToGregorian(jd);
};

/**
 * Convert Gregorian date to Shamsi date
 */
export const gregorianToShamsi = (gregorian: GregorianDate): ShamsiDate => {
  const jd = gregorianToJulianDay(gregorian.year, gregorian.month, gregorian.day);
  return julianDayToShamsi(jd);
};

/**
 * Validate Shamsi date
 */
export const isValidShamsiDate = (year: number, month: number, day: number): boolean => {
  if (year < 1 || year > 3000) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const maxDays = getDaysInShamsiMonth(month, year);
  if (day > maxDays) return false;

  return true;
};

/**
 * Validate Gregorian date
 */
export const isValidGregorianDate = (year: number, month: number, day: number): boolean => {
  if (year < 1 || year > 3000) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const maxDays = getDaysInGregorianMonth(month, year);
  if (day > maxDays) return false;

  return true;
};

/**
 * Get day of week for a Shamsi date (1=Saturday, 7=Friday)
 */
export const getShamsiDayOfWeek = (year: number, month: number, day: number): number => {
  const jd = shamsiToJulianDay(year, month, day);
  // Julian Day 0 was a Monday, adjust to make Saturday = 1
  return ((jd + 2) % 7) + 1;
};

/**
 * Get day of week for a Gregorian date (1=Saturday, 7=Friday)
 */
export const getGregorianDayOfWeek = (year: number, month: number, day: number): number => {
  const jd = gregorianToJulianDay(year, month, day);
  return ((jd + 2) % 7) + 1;
};

/**
 * Get total days in a Shamsi year
 */
export const getTotalDaysInShamsiYear = (year: number): number => {
  return isShamsiLeapYear(year) ? 366 : 365;
};

/**
 * Get today's date in Shamsi calendar
 */
export const getTodayShamsi = (): ShamsiDate => {
  const today = new Date();
  return gregorianToShamsi({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate()
  });
};

/**
 * Get today's date in Gregorian calendar
 */
export const getTodayGregorian = (): GregorianDate => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate()
  };
};

/**
 * Add days to a Shamsi date
 */
export const addDaysToShamsiDate = (shamsi: ShamsiDate, days: number): ShamsiDate => {
  const gregorian = shamsiToGregorian(shamsi);
  const jd = gregorianToJulianDay(gregorian.year, gregorian.month, gregorian.day);
  return julianDayToShamsi(jd + days);
};

/**
 * Get difference in days between two Shamsi dates
 */
export const daysBetweenShamsiDates = (date1: ShamsiDate, date2: ShamsiDate): number => {
  const jd1 = shamsiToJulianDay(date1.year, date1.month, date1.day);
  const jd2 = shamsiToJulianDay(date2.year, date2.month, date2.day);
  return Math.abs(jd2 - jd1);
};