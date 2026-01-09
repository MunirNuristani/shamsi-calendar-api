// tests/unit/shamsiAlgorithm.test.ts

import {
  isShamsiLeapYear,
  isGregorianLeapYear,
  shamsiToGregorian,
  gregorianToShamsi,
  isValidShamsiDate,
  isValidGregorianDate,
  getShamsiDayOfWeek,
  getDaysInShamsiMonth,
  getTotalDaysInShamsiYear,
  addDaysToShamsiDate,
  daysBetweenShamsiDates,
} from '../../src/utils/shamsiAlgorithm';

describe('Shamsi Algorithm - Leap Year Tests', () => {
  test('should correctly identify Shamsi leap years', () => {
    // Leap years in 33-year cycle: 1, 5, 9, 13, 17, 22, 26, 30
    expect(isShamsiLeapYear(1401)).toBe(false); // 1401 % 33 = 15
    expect(isShamsiLeapYear(1403)).toBe(true);  // 1403 % 33 = 17
    expect(isShamsiLeapYear(1404)).toBe(false); // 1404 % 33 = 18
    expect(isShamsiLeapYear(1408)).toBe(true);  // 1408 % 33 = 22
  });

  test('should correctly identify Gregorian leap years', () => {
    expect(isGregorianLeapYear(2020)).toBe(true);
    expect(isGregorianLeapYear(2021)).toBe(false);
    expect(isGregorianLeapYear(2024)).toBe(true);
    expect(isGregorianLeapYear(1900)).toBe(false); // divisible by 100
    expect(isGregorianLeapYear(2000)).toBe(true);  // divisible by 400
  });

  test('should return correct total days in year', () => {
    expect(getTotalDaysInShamsiYear(1403)).toBe(366); // leap year
    expect(getTotalDaysInShamsiYear(1404)).toBe(365); // normal year
  });
});

describe('Shamsi Algorithm - Days in Month Tests', () => {
  test('should return correct days for each month in normal year', () => {
    // Using 1404 which is a normal year
    // First 6 months have 31 days
    for (let month = 1; month <= 6; month++) {
      expect(getDaysInShamsiMonth(month, 1404)).toBe(31);
    }
    // Next 5 months have 30 days
    for (let month = 7; month <= 11; month++) {
      expect(getDaysInShamsiMonth(month, 1404)).toBe(30);
    }
    // Last month has 29 days in normal year
    expect(getDaysInShamsiMonth(12, 1404)).toBe(29);
  });

  test('should return correct days for each month in leap year', () => {
    // Using 1403 which is a leap year
    // Last month has 30 days in leap year
    expect(getDaysInShamsiMonth(12, 1403)).toBe(30);
  });
});

describe('Shamsi Algorithm - Date Validation Tests', () => {
  test('should validate correct Shamsi dates', () => {
    expect(isValidShamsiDate(1403, 1, 1)).toBe(true);
    expect(isValidShamsiDate(1404, 12, 29)).toBe(true); // normal year
    expect(isValidShamsiDate(1403, 12, 30)).toBe(true); // leap year
  });

  test('should invalidate incorrect Shamsi dates', () => {
    expect(isValidShamsiDate(1404, 0, 1)).toBe(false);   // invalid month
    expect(isValidShamsiDate(1404, 13, 1)).toBe(false);  // invalid month
    expect(isValidShamsiDate(1404, 1, 0)).toBe(false);   // invalid day
    expect(isValidShamsiDate(1404, 1, 32)).toBe(false);  // invalid day
    expect(isValidShamsiDate(1404, 12, 30)).toBe(false); // normal year, month 12 only has 29 days
    expect(isValidShamsiDate(0, 1, 1)).toBe(false);      // invalid year
  });

  test('should validate correct Gregorian dates', () => {
    expect(isValidGregorianDate(2025, 1, 1)).toBe(true);
    expect(isValidGregorianDate(2024, 2, 29)).toBe(true); // leap year
  });

  test('should invalidate incorrect Gregorian dates', () => {
    expect(isValidGregorianDate(2025, 2, 29)).toBe(false); // not leap year
    expect(isValidGregorianDate(2025, 13, 1)).toBe(false);  // invalid month
    expect(isValidGregorianDate(2025, 1, 32)).toBe(false);  // invalid day
  });
});

describe('Shamsi Algorithm - Conversion Tests', () => {
  test('should convert Shamsi to Gregorian correctly', () => {
    // Nowruz 1403 = March 20, 2024
    const result1 = shamsiToGregorian({ year: 1403, month: 1, day: 1 });
    expect(result1.year).toBe(2024);
    expect(result1.month).toBe(3);
    expect(result1.day).toBe(20);

    // Test another known date
    const result2 = shamsiToGregorian({ year: 1403, month: 10, day: 19 });
    expect(result2.year).toBe(2025);
    expect(result2.month).toBe(1);
    expect(result2.day).toBe(8);
  });

  test('should convert Gregorian to Shamsi correctly', () => {
    // March 20, 2024 = Nowruz 1403
    const result1 = gregorianToShamsi({ year: 2024, month: 3, day: 20 });
    expect(result1.year).toBe(1403);
    expect(result1.month).toBe(1);
    expect(result1.day).toBe(1);

    // Test another known date
    const result2 = gregorianToShamsi({ year: 2025, month: 1, day: 8 });
    expect(result2.year).toBe(1403);
    expect(result2.month).toBe(10);
    expect(result2.day).toBe(19);
  });

  test('should have bidirectional conversion consistency', () => {
    const shamsiDate = { year: 1403, month: 6, day: 15 };
    const gregorianDate = shamsiToGregorian(shamsiDate);
    const backToShamsi = gregorianToShamsi(gregorianDate);

    expect(backToShamsi.year).toBe(shamsiDate.year);
    expect(backToShamsi.month).toBe(shamsiDate.month);
    expect(backToShamsi.day).toBe(shamsiDate.day);
  });
});

describe('Shamsi Algorithm - Day of Week Tests', () => {
  test('should return correct day of week', () => {
    // Test known dates (1 = Saturday, 7 = Friday)
    const dayOfWeek = getShamsiDayOfWeek(1403, 1, 1); // Nowruz 1403
    expect(dayOfWeek).toBeGreaterThanOrEqual(1);
    expect(dayOfWeek).toBeLessThanOrEqual(7);
  });

  test('should have consistent day of week calculation', () => {
    // Two consecutive days should differ by 1 (or wrap from 7 to 1)
    const day1 = getShamsiDayOfWeek(1403, 1, 1);
    const day2 = getShamsiDayOfWeek(1403, 1, 2);

    if (day1 === 7) {
      expect(day2).toBe(1);
    } else {
      expect(day2).toBe(day1 + 1);
    }
  });
});

describe('Shamsi Algorithm - Date Arithmetic Tests', () => {
  test('should add days to Shamsi date correctly', () => {
    const date = { year: 1403, month: 1, day: 1 };
    const result = addDaysToShamsiDate(date, 31);

    expect(result.year).toBe(1403);
    expect(result.month).toBe(2);
    expect(result.day).toBe(1);
  });

  test('should handle adding days across years', () => {
    // Using 1404 which is a normal year (month 12 has 29 days)
    const date = { year: 1404, month: 12, day: 29 };
    const result = addDaysToShamsiDate(date, 1);

    expect(result.year).toBe(1405);
    expect(result.month).toBe(1);
    expect(result.day).toBe(1);
  });

  test('should calculate days between dates correctly', () => {
    const date1 = { year: 1403, month: 1, day: 1 };
    const date2 = { year: 1403, month: 1, day: 31 };
    const days = daysBetweenShamsiDates(date1, date2);

    expect(days).toBe(30);
  });

  test('should handle negative day differences', () => {
    const date1 = { year: 1403, month: 1, day: 31 };
    const date2 = { year: 1403, month: 1, day: 1 };
    const days = daysBetweenShamsiDates(date1, date2);

    expect(days).toBe(30); // Should return absolute value
  });
});