
import {
  MONTH_NAMES,
  DAY_NAMES,
  Language,
  LocalizedName,
  DEFAULT_LANGUAGE,
} from '../config/constants';

/**
 * Localization Service
 * Handles translation and formatting for different languages
 */

/**
 * Get month name by number and language
 */
export const getMonthName = (month: number, language: Language = DEFAULT_LANGUAGE): string => {
  const monthName = MONTH_NAMES[month];
  if (!monthName) {
    throw new Error(`Invalid month number: ${month}`);
  }
  return monthName[language] || monthName.english;
};

/**
 * Get all month names for a specific language
 */
export const getAllMonthNames = (language: Language = DEFAULT_LANGUAGE): string[] => {
  return Object.keys(MONTH_NAMES).map((key) => {
    const month = parseInt(key);
    return getMonthName(month, language);
  });
};

/**
 * Get month names in all languages
 */
export const getAllMonthNamesMultiLang = (): Array<{ number: number; names: LocalizedName }> => {
  return Object.keys(MONTH_NAMES).map((key) => {
    const month = parseInt(key);
    return {
      number: month,
      names: MONTH_NAMES[month],
    };
  });
};

/**
 * Get day name by number and language
 */
export const getDayName = (dayOfWeek: number, language: Language = DEFAULT_LANGUAGE): string => {
  const dayName = DAY_NAMES[dayOfWeek];
  if (!dayName) {
    throw new Error(`Invalid day of week: ${dayOfWeek}`);
  }
  return dayName[language] || dayName.english;
};

/**
 * Get all day names for a specific language
 */
export const getAllDayNames = (language: Language = DEFAULT_LANGUAGE): string[] => {
  return Object.keys(DAY_NAMES).map((key) => {
    const day = parseInt(key);
    return getDayName(day, language);
  });
};

/**
 * Get day names in all languages
 */
export const getAllDayNamesMultiLang = (): Array<{ number: number; names: LocalizedName }> => {
  return Object.keys(DAY_NAMES).map((key) => {
    const day = parseInt(key);
    return {
      number: day,
      names: DAY_NAMES[day],
    };
  });
};

/**
 * Get localized month object
 */
export const getLocalizedMonth = (
  month: number,
  language: Language = DEFAULT_LANGUAGE
): { number: number; name: string; nameMultiLang?: LocalizedName } => {
  return {
    number: month,
    name: getMonthName(month, language),
    nameMultiLang: MONTH_NAMES[month],
  };
};

/**
 * Get localized day of week object
 */
export const getLocalizedDayOfWeek = (
  dayOfWeek: number,
  language: Language = DEFAULT_LANGUAGE
): { number: number; name: string; nameMultiLang?: LocalizedName } => {
  return {
    number: dayOfWeek,
    name: getDayName(dayOfWeek, language),
    nameMultiLang: DAY_NAMES[dayOfWeek],
  };
};

/**
 * Format a Shamsi date as a string
 */
export const formatShamsiDate = (
  year: number,
  month: number,
  day: number,
  language: Language = DEFAULT_LANGUAGE,
  includeMonthName: boolean = false
): string => {
  if (includeMonthName) {
    const monthName = getMonthName(month, language);

    // Different formatting based on language
    switch (language) {
      case 'dari':
      case 'pashto':
        return `${day} ${monthName} ${year}`;
      case 'english':
      default:
        return `${monthName} ${day}, ${year}`;
    }
  }

  // Numeric format
  return `${year}/${month}/${day}`;
};

/**
 * Format a Gregorian date as a string
 */
export const formatGregorianDate = (
  year: number,
  month: number,
  day: number,
  includeMonthName: boolean = false
): string => {
  if (includeMonthName) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[month - 1]} ${day}, ${year}`;
  }

  return `${year}/${month}/${day}`;
};

/**
 * Get localized date labels
 */
export const getDateLabels = (language: Language = DEFAULT_LANGUAGE): {
  year: string;
  month: string;
  day: string;
  dayOfWeek: string;
} => {
  const labels: { [key in Language]: any } = {
    dari: {
      year: 'سال',
      month: 'ماه',
      day: 'روز',
      dayOfWeek: 'روز هفته',
    },
    pashto: {
      year: 'کال',
      month: 'مياشت',
      day: 'ورځ',
      dayOfWeek: 'د اونۍ ورځ',
    },
    english: {
      year: 'Year',
      month: 'Month',
      day: 'Day',
      dayOfWeek: 'Day of Week',
    },
  };

  return labels[language] || labels.english;
};

/**
 * Get localized calendar labels
 */
export const getCalendarLabels = (language: Language = DEFAULT_LANGUAGE): {
  today: string;
  holiday: string;
  weekend: string;
  weekday: string;
  leapYear: string;
  totalDays: string;
  weekNumber: string;
} => {
  const labels: { [key in Language]: any } = {
    dari: {
      today: 'امروز',
      holiday: 'تعطیلات',
      weekend: 'آخر هفته',
      weekday: 'روز کاری',
      leapYear: 'سال کبیسه',
      totalDays: 'مجموع روزها',
      weekNumber: 'شماره هفته',
    },
    pashto: {
      today: 'نن',
      holiday: 'رخصتي',
      weekend: 'د اونۍ پای',
      weekday: 'کاري ورځ',
      leapYear: 'کبيسه کال',
      totalDays: 'ټولې ورځې',
      weekNumber: 'د اونۍ شمېره',
    },
    english: {
      today: 'Today',
      holiday: 'Holiday',
      weekend: 'Weekend',
      weekday: 'Weekday',
      leapYear: 'Leap Year',
      totalDays: 'Total Days',
      weekNumber: 'Week Number',
    },
  };

  return labels[language] || labels.english;
};

/**
 * Get localized holiday type name
 */
export const getHolidayTypeName = (
  type: string,
  language: Language = DEFAULT_LANGUAGE
): string => {
  const typeNames: { [key: string]: { [key in Language]: string } } = {
    national: {
      dari: 'ملی',
      pashto: 'ملي',
      english: 'National',
    },
    religious: {
      dari: 'مذهبی',
      pashto: 'ديني',
      english: 'Religious',
    },
    cultural: {
      dari: 'فرهنگی',
      pashto: 'کلتوري',
      english: 'Cultural',
    },
    international: {
      dari: 'بین‌المللی',
      pashto: 'نړيوال',
      english: 'International',
    },
  };

  return typeNames[type]?.[language] || type;
};

/**
 * Validate language and return default if invalid
 */
export const validateLanguage = (language: string): Language => {
  const validLanguages: Language[] = ['dari', 'pashto', 'english'];
  return validLanguages.includes(language as Language)
    ? (language as Language)
    : DEFAULT_LANGUAGE;
};

export default {
  getMonthName,
  getAllMonthNames,
  getAllMonthNamesMultiLang,
  getDayName,
  getAllDayNames,
  getAllDayNamesMultiLang,
  getLocalizedMonth,
  getLocalizedDayOfWeek,
  formatShamsiDate,
  formatGregorianDate,
  getDateLabels,
  getCalendarLabels,
  getHolidayTypeName,
  validateLanguage,
};