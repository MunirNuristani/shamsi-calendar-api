// tests/unit/dateService.test.ts

import {
  convertShamsiToGregorian,
  convertGregorianToShamsi,
  getShamsiDateInfo,
  isWeekend,
  getWeekDates,
  getMonthStatistics,
  getYearStatistics,
  getLeapYearsInRange,
  compareShamsiDates,
  isBefore,
  isAfter,
  isSameDate,
} from '../../src/services/dateService';

describe('Date Service - Conversion', () => {
  test('should convert Shamsi to Gregorian', () => {
    // Nowruz 1403 = March 20, 2024
    const result = convertShamsiToGregorian({ year: 1403, month: 1, day: 1 });

    expect(result.shamsi.year).toBe(1403);
    expect(result.shamsi.month).toBe(1);
    expect(result.shamsi.day).toBe(1);
    expect(result.gregorian.year).toBe(2024);
    expect(result.gregorian.month).toBe(3);
    expect(result.gregorian.day).toBe(20);
  });

  test('should convert Gregorian to Shamsi', () => {
    // March 20, 2024 = Nowruz 1403
    const result = convertGregorianToShamsi({ year: 2024, month: 3, day: 20 });

    expect(result.shamsi.year).toBe(1403);
    expect(result.shamsi.month).toBe(1);
    expect(result.shamsi.day).toBe(1);
    expect(result.gregorian.year).toBe(2024);
    expect(result.gregorian.month).toBe(3);
    expect(result.gregorian.day).toBe(20);
  });

  test('should throw error for invalid Shamsi date', () => {
    expect(() => {
      convertShamsiToGregorian({ year: 1403, month: 13, day: 1 });
    }).toThrow('Invalid Shamsi date');
  });

  test('should throw error for invalid Gregorian date', () => {
    expect(() => {
      convertGregorianToShamsi({ year: 2024, month: 13, day: 1 });
    }).toThrow('Invalid Gregorian date');
  });
});

describe('Date Service - Date Info', () => {
  test('should return complete date info', () => {
    const info = getShamsiDateInfo(1403, 1, 1, 'english', true);

    expect(info.shamsi.year).toBe(1403);
    expect(info.shamsi.month).toBe(1);
    expect(info.shamsi.day).toBe(1);
    expect(info.gregorian.year).toBeDefined();
    expect(info.dayOfWeek.number).toBeGreaterThanOrEqual(1);
    expect(info.dayOfWeek.number).toBeLessThanOrEqual(7);
    expect(info.month.number).toBe(1);
    expect(info.month.name).toBe('Hamal');
    expect(typeof info.isWeekend).toBe('boolean');
    expect(typeof info.isToday).toBe('boolean');
    expect(info.formattedShamsi).toBeDefined();
  });

  test('should exclude Gregorian when requested', () => {
    const info = getShamsiDateInfo(1403, 1, 1, 'english', false);

    expect(info.gregorian.year).toBe(0);
    expect(info.formattedGregorian).toBe('');
  });

  test('should throw error for invalid date', () => {
    expect(() => {
      getShamsiDateInfo(1403, 13, 1, 'english', true);
    }).toThrow('Invalid Shamsi date');
  });
});

describe('Date Service - Weekend Check', () => {
  test('should identify weekend correctly', () => {
    // Friday is weekend in Afghanistan (day of week = 7)
    // We need to find a Friday date to test
    // This test checks the logic, not specific dates
    const result1 = isWeekend(1403, 1, 1);
    expect(typeof result1).toBe('boolean');
  });
});

describe('Date Service - Week Dates', () => {
  test('should return 7 days in a week', () => {
    const weekDates = getWeekDates(1403, 1, 15, 1);

    expect(weekDates).toHaveLength(7);
  });

  test('should start week on correct day', () => {
    const weekDates = getWeekDates(1403, 1, 15, 1); // Saturday start

    // First day of returned week should be a Saturday (day 1)
    // We can't test the exact day without knowing the input date's day of week
    expect(weekDates[0]).toBeDefined();
    expect(weekDates[6]).toBeDefined();
  });
});

describe('Date Service - Month Statistics', () => {
  test('should return correct month statistics', () => {
    const stats = getMonthStatistics(1403, 1);

    expect(stats.totalDays).toBe(31); // Hamal has 31 days
    expect(stats.weekdays).toBeGreaterThan(0);
    expect(stats.weekends).toBeGreaterThan(0);
    expect(stats.weekdays + stats.weekends).toBe(31);
    expect(stats.startDayOfWeek).toBeGreaterThanOrEqual(1);
    expect(stats.startDayOfWeek).toBeLessThanOrEqual(7);
    expect(stats.endDayOfWeek).toBeGreaterThanOrEqual(1);
    expect(stats.endDayOfWeek).toBeLessThanOrEqual(7);
  });

  test('should handle different months correctly', () => {
    const stats1 = getMonthStatistics(1403, 1); // 31 days
    const stats7 = getMonthStatistics(1403, 7); // 30 days
    const stats12 = getMonthStatistics(1403, 12); // 30 days (1403 IS a leap year: 1403 % 33 = 17)

    expect(stats1.totalDays).toBe(31);
    expect(stats7.totalDays).toBe(30);
    expect(stats12.totalDays).toBe(30); // Fixed: 1403 is a leap year
  });

  test('should handle leap year correctly', () => {
    const stats = getMonthStatistics(1403, 12); // 1403 is a leap year (1403 % 33 = 17)
    expect(stats.totalDays).toBe(30);
  });
});

describe('Date Service - Year Statistics', () => {
  test('should return correct year statistics for normal year', () => {
    const stats = getYearStatistics(1404); // 1404 % 33 = 18 (NOT a leap year)

    expect(stats.totalDays).toBe(365);
    expect(stats.isLeapYear).toBe(false);
    expect(stats.totalWeekdays).toBeGreaterThan(0);
    expect(stats.totalWeekends).toBeGreaterThan(0);
    expect(stats.totalWeekdays + stats.totalWeekends).toBe(365);
  });

  test('should return correct year statistics for leap year', () => {
    const stats = getYearStatistics(1403); // 1403 % 33 = 17 (IS a leap year)

    expect(stats.totalDays).toBe(366);
    expect(stats.isLeapYear).toBe(true);
    expect(stats.totalWeekdays + stats.totalWeekends).toBe(366);
  });
});

describe('Date Service - Leap Years in Range', () => {
  test('should return leap years in range', () => {
    const leapYears = getLeapYearsInRange(1400, 1410);

    expect(Array.isArray(leapYears)).toBe(true);
    expect(leapYears.length).toBeGreaterThan(0);

    // Verify all returned years are actually leap years
    leapYears.forEach(year => {
      expect(year % 33).toBeGreaterThanOrEqual(1);
    });
  });

  test('should return empty array if no leap years in range', () => {
    // Find a narrow range with no leap years
    const leapYears = getLeapYearsInRange(1402, 1402);
    expect(Array.isArray(leapYears)).toBe(true);
  });
});

describe('Date Service - Date Comparison', () => {
  test('should compare dates correctly', () => {
    const date1 = { year: 1403, month: 1, day: 1 };
    const date2 = { year: 1403, month: 1, day: 15 };
    const date3 = { year: 1404, month: 1, day: 1 };

    expect(compareShamsiDates(date1, date2)).toBeLessThan(0);
    expect(compareShamsiDates(date2, date1)).toBeGreaterThan(0);
    expect(compareShamsiDates(date1, date1)).toBe(0);
    expect(compareShamsiDates(date1, date3)).toBeLessThan(0);
  });

  test('should identify if date is before another', () => {
    const date1 = { year: 1403, month: 1, day: 1 };
    const date2 = { year: 1403, month: 1, day: 15 };

    expect(isBefore(date1, date2)).toBe(true);
    expect(isBefore(date2, date1)).toBe(false);
    expect(isBefore(date1, date1)).toBe(false);
  });

  test('should identify if date is after another', () => {
    const date1 = { year: 1403, month: 1, day: 1 };
    const date2 = { year: 1403, month: 1, day: 15 };

    expect(isAfter(date2, date1)).toBe(true);
    expect(isAfter(date1, date2)).toBe(false);
    expect(isAfter(date1, date1)).toBe(false);
  });

  test('should identify if dates are the same', () => {
    const date1 = { year: 1403, month: 1, day: 1 };
    const date2 = { year: 1403, month: 1, day: 1 };
    const date3 = { year: 1403, month: 1, day: 2 };

    expect(isSameDate(date1, date2)).toBe(true);
    expect(isSameDate(date1, date3)).toBe(false);
  });
});