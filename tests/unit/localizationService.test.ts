// tests/unit/localizationService.test.ts

import {
  getMonthName,
  getAllMonthNames,
  getDayName,
  getAllDayNames,
  formatShamsiDate,
  formatGregorianDate,
  getDateLabels,
  getCalendarLabels,
  getHolidayTypeName,
  validateLanguage,
} from '../../src/services/localizationService';

describe('Localization Service - Month Names', () => {
  test('should return month names in English', () => {
    expect(getMonthName(1, 'english')).toBe('Hamal');
    expect(getMonthName(6, 'english')).toBe('Sonbola');
    expect(getMonthName(12, 'english')).toBe('Hut');
  });

  test('should return month names in Dari', () => {
    expect(getMonthName(1, 'dari')).toBe('حمل');
    expect(getMonthName(6, 'dari')).toBe('سنبله');
    expect(getMonthName(12, 'dari')).toBe('حوت');
  });

  test('should return month names in Pashto', () => {
    expect(getMonthName(1, 'pashto')).toBe('وری');
    expect(getMonthName(6, 'pashto')).toBe('وږی');
    expect(getMonthName(12, 'pashto')).toBe('كب');
  });

  test('should return all month names in correct order', () => {
    const months = getAllMonthNames('english');
    expect(months).toHaveLength(12);
    expect(months[0]).toBe('Hamal');
    expect(months[11]).toBe('Hut');
  });

  test('should throw error for invalid month', () => {
    expect(() => getMonthName(0, 'english')).toThrow();
    expect(() => getMonthName(13, 'english')).toThrow();
  });
});

describe('Localization Service - Day Names', () => {
  test('should return day names in English', () => {
    expect(getDayName(1, 'english')).toBe('Saturday');
    expect(getDayName(4, 'english')).toBe('Tuesday');
    expect(getDayName(7, 'english')).toBe('Friday');
  });

  test('should return day names in Dari', () => {
    expect(getDayName(1, 'dari')).toBe('شنبه');
    expect(getDayName(7, 'dari')).toBe('جمعه');
  });

  test('should return day names in Pashto', () => {
    expect(getDayName(1, 'pashto')).toBe('شنبه');
    expect(getDayName(7, 'pashto')).toBe('جمعه');
  });

  test('should return all day names in correct order', () => {
    const days = getAllDayNames('english');
    expect(days).toHaveLength(7);
    expect(days[0]).toBe('Saturday');
    expect(days[6]).toBe('Friday');
  });

  test('should throw error for invalid day', () => {
    expect(() => getDayName(0, 'english')).toThrow();
    expect(() => getDayName(8, 'english')).toThrow();
  });
});

describe('Localization Service - Date Formatting', () => {
  test('should format Shamsi date without month name', () => {
    const formatted = formatShamsiDate(1403, 10, 19, 'english', false);
    expect(formatted).toBe('1403/10/19');
  });

  test('should format Shamsi date with month name in English', () => {
    const formatted = formatShamsiDate(1403, 10, 19, 'english', true);
    expect(formatted).toContain('Jadi');
    expect(formatted).toContain('19');
    expect(formatted).toContain('1403');
  });

  test('should format Shamsi date with month name in Dari', () => {
    const formatted = formatShamsiDate(1403, 10, 19, 'dari', true);
    expect(formatted).toContain('جدی');
    expect(formatted).toContain('19');
    expect(formatted).toContain('1403');
  });

  test('should format Gregorian date without month name', () => {
    const formatted = formatGregorianDate(2025, 1, 8, false);
    expect(formatted).toBe('2025/1/8');
  });

  test('should format Gregorian date with month name', () => {
    const formatted = formatGregorianDate(2025, 1, 8, true);
    expect(formatted).toContain('January');
    expect(formatted).toContain('8');
    expect(formatted).toContain('2025');
  });
});

describe('Localization Service - Labels', () => {
  test('should return date labels in English', () => {
    const labels = getDateLabels('english');
    expect(labels.year).toBe('Year');
    expect(labels.month).toBe('Month');
    expect(labels.day).toBe('Day');
    expect(labels.dayOfWeek).toBe('Day of Week');
  });

  test('should return date labels in Dari', () => {
    const labels = getDateLabels('dari');
    expect(labels.year).toBe('سال');
    expect(labels.month).toBe('ماه');
  });

  test('should return calendar labels in English', () => {
    const labels = getCalendarLabels('english');
    expect(labels.today).toBe('Today');
    expect(labels.holiday).toBe('Holiday');
    expect(labels.weekend).toBe('Weekend');
    expect(labels.leapYear).toBe('Leap Year');
  });

  test('should return calendar labels in Dari', () => {
    const labels = getCalendarLabels('dari');
    expect(labels.today).toBe('امروز');
    expect(labels.holiday).toBe('تعطیلات');
  });
});

describe('Localization Service - Holiday Type Names', () => {
  test('should return holiday type names in English', () => {
    expect(getHolidayTypeName('national', 'english')).toBe('National');
    expect(getHolidayTypeName('religious', 'english')).toBe('Religious');
    expect(getHolidayTypeName('cultural', 'english')).toBe('Cultural');
    expect(getHolidayTypeName('international', 'english')).toBe('International');
  });

  test('should return holiday type names in Dari', () => {
    expect(getHolidayTypeName('national', 'dari')).toBe('ملی');
    expect(getHolidayTypeName('religious', 'dari')).toBe('مذهبی');
  });

  test('should return original type for unknown types', () => {
    expect(getHolidayTypeName('unknown', 'english')).toBe('unknown');
  });
});

describe('Localization Service - Language Validation', () => {
  test('should validate correct languages', () => {
    expect(validateLanguage('english')).toBe('english');
    expect(validateLanguage('dari')).toBe('dari');
    expect(validateLanguage('pashto')).toBe('pashto');
  });

  test('should return default language for invalid input', () => {
    expect(validateLanguage('spanish')).toBe('english');
    expect(validateLanguage('french')).toBe('english');
    expect(validateLanguage('')).toBe('english');
  });
});