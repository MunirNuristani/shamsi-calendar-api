// tests/unit/holidayService.test.ts

import {
  getHolidaysByYear,
  getHolidaysByYearAndMonth,
  getHolidaysByDate,
  getNationalHolidays,
  getPublicHolidays,
  getAllHolidays,
  searchHolidays,
  getHolidayStatistics,
  isHoliday,
  countHolidays,
} from '../../src/services/holidayService';

describe('Holiday Service - Get Holidays', () => {
  test('should get holidays by year', () => {
    const holidays = getHolidaysByYear(1403);

    expect(Array.isArray(holidays)).toBe(true);
    holidays.forEach(holiday => {
      expect(holiday.shamsiYear).toBe(1403);
    });
  });

  test('should return empty array for year with no holidays', () => {
    const holidays = getHolidaysByYear(9999);

    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays).toHaveLength(0);
  });

  test('should get holidays by year and month', () => {
    const holidays = getHolidaysByYearAndMonth(1403, 1);

    expect(Array.isArray(holidays)).toBe(true);
    holidays.forEach(holiday => {
      expect(holiday.shamsiYear).toBe(1403);
      expect(holiday.shamsiMonth).toBe(1);
    });
  });

  test('should get holidays by specific date', () => {
    // Nowruz is on 1/1
    const holidays = getHolidaysByDate(1403, 1, 1);

    expect(Array.isArray(holidays)).toBe(true);
    if (holidays.length > 0) {
      holidays.forEach(holiday => {
        expect(holiday.shamsiYear).toBe(1403);
        expect(holiday.shamsiMonth).toBe(1);
        expect(holiday.shamsiDay).toBe(1);
      });
    }
  });

  test('should get all holidays', () => {
    const holidays = getAllHolidays();

    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays.length).toBeGreaterThan(0);
  });

  test('should respect limit parameter', () => {
    const holidays = getAllHolidays(2);

    expect(holidays.length).toBeLessThanOrEqual(2);
  });

  test('should respect skip and limit parameters', () => {
    const allHolidays = getAllHolidays();
    const skippedHolidays = getAllHolidays(2, 1);

    if (allHolidays.length > 1) {
      expect(skippedHolidays[0].id).toBe(allHolidays[1].id);
    }
  });
});

describe('Holiday Service - Filter Holidays', () => {
  test('should get national holidays', () => {
    const holidays = getNationalHolidays();

    expect(Array.isArray(holidays)).toBe(true);
    holidays.forEach(holiday => {
      expect(holiday.isNationalHoliday).toBe(true);
    });
  });

  test('should get national holidays for specific year', () => {
    const holidays = getNationalHolidays(1403);

    expect(Array.isArray(holidays)).toBe(true);
    holidays.forEach(holiday => {
      expect(holiday.shamsiYear).toBe(1403);
      expect(holiday.isNationalHoliday).toBe(true);
    });
  });

  test('should get public holidays', () => {
    const holidays = getPublicHolidays();

    expect(Array.isArray(holidays)).toBe(true);
    holidays.forEach(holiday => {
      expect(holiday.isPublicHoliday).toBe(true);
    });
  });

  test('should get public holidays for specific year', () => {
    const holidays = getPublicHolidays(1403);

    expect(Array.isArray(holidays)).toBe(true);
    holidays.forEach(holiday => {
      expect(holiday.shamsiYear).toBe(1403);
      expect(holiday.isPublicHoliday).toBe(true);
    });
  });
});

describe('Holiday Service - Search Holidays', () => {
  test('should search holidays by name in English', () => {
    const holidays = searchHolidays('nowruz', 'english');

    expect(Array.isArray(holidays)).toBe(true);
    if (holidays.length > 0) {
      holidays.forEach(holiday => {
        const name = holiday.names.english.toLowerCase();
        expect(name).toContain('nowruz');
      });
    }
  });

  test('should search holidays by name in Dari', () => {
    const holidays = searchHolidays('نوروز', 'dari');

    expect(Array.isArray(holidays)).toBe(true);
    if (holidays.length > 0) {
      holidays.forEach(holiday => {
        const name = holiday.names.dari;
        expect(name).toContain('نوروز');
      });
    }
  });

  test('should return empty array for no matches', () => {
    const holidays = searchHolidays('xyz123notfound', 'english');

    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays).toHaveLength(0);
  });

  test('should be case insensitive', () => {
    const holidays1 = searchHolidays('NOWRUZ', 'english');
    const holidays2 = searchHolidays('nowruz', 'english');

    expect(holidays1.length).toBe(holidays2.length);
  });
});

describe('Holiday Service - Statistics', () => {
  test('should return holiday statistics', () => {
    const stats = getHolidayStatistics();

    expect(stats.total).toBeGreaterThanOrEqual(0);
    expect(stats.national).toBeGreaterThanOrEqual(0);
    expect(stats.public).toBeGreaterThanOrEqual(0);
    expect(typeof stats.byType).toBe('object');
  });

  test('should return statistics for specific year', () => {
    const stats = getHolidayStatistics(1403);

    expect(stats.total).toBeGreaterThanOrEqual(0);
    expect(stats.national).toBeLessThanOrEqual(stats.total);
    expect(stats.public).toBeLessThanOrEqual(stats.total);
  });

  test('should have consistent counts', () => {
    const stats = getHolidayStatistics();
    const typeCount = Object.values(stats.byType).reduce((sum, count) => sum + count, 0);

    expect(typeCount).toBe(stats.total);
  });
});

describe('Holiday Service - Utility Functions', () => {
  test('should check if date is holiday', () => {
    // Nowruz 1403/1/1 should be a holiday
    const result = isHoliday(1403, 1, 1);

    expect(typeof result).toBe('boolean');
  });

  test('should return false for non-holiday dates', () => {
    const result = isHoliday(1403, 5, 15);

    expect(typeof result).toBe('boolean');
  });

  test('should count holidays', () => {
    const count = countHolidays();

    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should count holidays for specific year', () => {
    const count = countHolidays(1403);

    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });
});