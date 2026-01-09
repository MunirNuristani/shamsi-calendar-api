
/**
 * Shamsi Calendar Constants and Localization Data
 */

// Types
export interface LocalizedName {
  dari: string;
  pashto: string;
  english: string;
}

export interface MonthNames {
  [key: number]: LocalizedName;
}

export interface DayNames {
  [key: number]: LocalizedName;
}

export interface DaysInMonth {
  [key: number]: number;
}

export type Language = 'dari' | 'pashto' | 'english';
export type HolidayType = 'national' | 'religious' | 'cultural' | 'international';
export type ResponseFormat = 'full' | 'compact';
export type StartOfWeek = 1 | 2 | 3; // Saturday | Sunday | Monday

export interface ShamsiDate {
  year: number;
  month: number;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

// Month names in Dari, Pashto, and English
export const MONTH_NAMES: MonthNames = {
  1: { dari: 'حمل', pashto: 'وری', english: 'Hamal' },
  2: { dari: 'ثور', pashto: 'غويی', english: 'Sawr' },
  3: { dari: 'جوزا', pashto: 'غبرګولی', english: 'Jawza' },
  4: { dari: 'سرطان', pashto: 'چنګاښ', english: 'Saratan' },
  5: { dari: 'اسد', pashto: 'زمری', english: 'Asad' },
  6: { dari: 'سنبله', pashto: 'وږی', english: 'Sonbola' },
  7: { dari: 'میزان', pashto: 'تله', english: 'Mizan' },
  8: { dari: 'عقرب', pashto: 'لړم', english: 'Aqrab' },
  9: { dari: 'قوس', pashto: 'ليندۍ', english: 'Qaws' },
  10: { dari: 'جدی', pashto: 'مرغومی', english: 'Jadi' },
  11: { dari: 'دلو', pashto: 'سلواغه', english: 'Dalvæ' },
  12: { dari: 'حوت', pashto: 'كب', english: 'Hut' }
};

// Day names (1=Saturday in Afghan week)
export const DAY_NAMES: DayNames = {
  1: { dari: 'شنبه', pashto: 'شنبه', english: 'Saturday' },
  2: { dari: 'یکشنبه', pashto: 'يکشنبه', english: 'Sunday' },
  3: { dari: 'دوشنبه', pashto: 'دوشنبه', english: 'Monday' },
  4: { dari: 'سه‌شنبه', pashto: 'درېشنبه', english: 'Tuesday' },
  5: { dari: 'چهارشنبه', pashto: 'څلرشنبه', english: 'Wednesday' },
  6: { dari: 'پنجشنبه', pashto: 'پينځشنبه', english: 'Thursday' },
  7: { dari: 'جمعه', pashto: 'جمعه', english: 'Friday' }
};

// Days in each Shamsi month (non-leap year)
export const DAYS_IN_MONTH: DaysInMonth = {
  1: 31, 2: 31, 3: 31, 4: 31, 5: 31, 6: 31,
  7: 30, 8: 30, 9: 30, 10: 30, 11: 30, 12: 29
};

// Days in each Shamsi month (leap year)
export const DAYS_IN_MONTH_LEAP: DaysInMonth = {
  1: 31, 2: 31, 3: 31, 4: 31, 5: 31, 6: 31,
  7: 30, 8: 30, 9: 30, 10: 30, 11: 30, 12: 30
};

// Supported languages
export const LANGUAGES: Language[] = ['dari', 'pashto', 'english'];

// Default language
export const DEFAULT_LANGUAGE: Language = 'english';

// Start of week options
export const START_OF_WEEK = {
  SATURDAY: 1 as StartOfWeek,
  SUNDAY: 2 as StartOfWeek,
  MONDAY: 3 as StartOfWeek
};

// Default start of week (Saturday for Afghanistan)
export const DEFAULT_START_OF_WEEK: StartOfWeek = START_OF_WEEK.SATURDAY;

// Holiday types
export const HOLIDAY_TYPES = {
  NATIONAL: 'national' as HolidayType,
  RELIGIOUS: 'religious' as HolidayType,
  CULTURAL: 'cultural' as HolidayType,
  INTERNATIONAL: 'international' as HolidayType
};

// Weekend days (Friday in Afghanistan)
export const WEEKEND_DAYS: number[] = [7]; // Friday

// API response formats
export const RESPONSE_FORMATS = {
  FULL: 'full' as ResponseFormat,
  COMPACT: 'compact' as ResponseFormat
};

// Calendar epoch - Shamsi calendar epoch (March 21, 622 CE)
export const SHAMSI_EPOCH = 1948321; // Julian Day Number

// Gregorian epoch
export const GREGORIAN_EPOCH = 1721426; // Julian Day Number

// Validation limits
export const VALIDATION = {
  MIN_YEAR: 1,
  MAX_YEAR: 3000,
  MIN_MONTH: 1,
  MAX_MONTH: 12,
  MIN_DAY: 1,
  MAX_DAY: 31
};

// Helper function to get days in a specific month
export const getDaysInMonth = (month: number, isLeapYear: boolean): number => {
  return isLeapYear ? DAYS_IN_MONTH_LEAP[month] : DAYS_IN_MONTH[month];
};