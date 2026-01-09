// tests/integration/calendar.api.test.ts

import request from 'supertest';
import app from '../../src/app';

describe('Calendar API - GET /api/calendar/day/:year/:month/:day', () => {
  test('should get day view successfully', async () => {
    const response = await request(app)
      .get('/api/calendar/day/1403/1/1')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.date.shamsi.year).toBe(1403);
    expect(response.body.data.date.shamsi.month).toBe(1);
    expect(response.body.data.date.shamsi.day).toBe(1);
    expect(response.body.data.dayOfWeek).toBeDefined();
    expect(response.body.data.month).toBeDefined();
    expect(typeof response.body.data.isWeekend).toBe('boolean');
    expect(typeof response.body.data.isToday).toBe('boolean');
    expect(typeof response.body.data.isHoliday).toBe('boolean');
  });

  test('should return 400 for invalid date', async () => {
    const response = await request(app)
      .get('/api/calendar/day/1403/13/1')
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('should support language parameter', async () => {
    const response = await request(app)
      .get('/api/calendar/day/1403/1/1?lang=dari')
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  test('should include holidays when requested', async () => {
    const response = await request(app)
      .get('/api/calendar/day/1403/1/1?includeHolidays=true')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.holidays)).toBe(true);
  });
});

describe('Calendar API - GET /api/calendar/week/:year/:month/:day', () => {
  test('should get week view successfully', async () => {
    const response = await request(app)
      .get('/api/calendar/week/1403/1/15')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.weekNumber).toBeDefined();
    expect(response.body.data.startDate).toBeDefined();
    expect(response.body.data.endDate).toBeDefined();
    expect(Array.isArray(response.body.data.days)).toBe(true);
    expect(response.body.data.days).toHaveLength(7);
  });

  test('should support startOfWeek parameter', async () => {
    const response = await request(app)
      .get('/api/calendar/week/1403/1/15?startOfWeek=2')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.days).toHaveLength(7);
  });

  test('should return 400 for invalid date', async () => {
    const response = await request(app)
      .get('/api/calendar/week/1403/13/1')
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

describe('Calendar API - GET /api/calendar/month/:year/:month', () => {
  test('should get month view successfully', async () => {
    const response = await request(app)
      .get('/api/calendar/month/1403/1')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.year).toBe(1403);
    expect(response.body.data.month.number).toBe(1);
    expect(response.body.data.month.name).toBeDefined();
    expect(response.body.data.totalDays).toBe(31);
    expect(Array.isArray(response.body.data.weeks)).toBe(true);
    expect(response.body.data.statistics).toBeDefined();
    expect(response.body.data.statistics.totalDays).toBe(31);
  });

  test('should handle different months correctly', async () => {
    const response = await request(app)
      .get('/api/calendar/month/1403/12')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.totalDays).toBe(30); // 1403 is a leap year (1403 % 33 = 17)
  });

  test('should return 400 for invalid month', async () => {
    const response = await request(app)
      .get('/api/calendar/month/1403/13')
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('should support all query parameters', async () => {
    const response = await request(app)
      .get('/api/calendar/month/1403/1?lang=english&startOfWeek=1&includeHolidays=true')
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});

describe('Calendar API - GET /api/calendar/year/:year', () => {
  test('should get year view successfully', async () => {
    const response = await request(app)
      .get('/api/calendar/year/1403')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.year).toBe(1403);
    expect(typeof response.body.data.isLeapYear).toBe('boolean');
    expect(response.body.data.totalDays).toBeDefined();
    expect(Array.isArray(response.body.data.months)).toBe(true);
    expect(response.body.data.months).toHaveLength(12);
    expect(response.body.data.statistics).toBeDefined();
  });

  test('should detect leap year correctly', async () => {
    const response = await request(app)
      .get('/api/calendar/year/1403') // 1403 % 33 = 17, which IS a leap year
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.isLeapYear).toBe(true);
    expect(response.body.data.totalDays).toBe(366);
  });

  test('should support format parameter', async () => {
    const responseCompact = await request(app)
      .get('/api/calendar/year/1403?format=compact')
      .expect(200);

    const responseFull = await request(app)
      .get('/api/calendar/year/1403?format=full')
      .expect(200);

    expect(responseCompact.body.success).toBe(true);
    expect(responseFull.body.success).toBe(true);
  });

  test('should return 400 for invalid year', async () => {
    const response = await request(app)
      .get('/api/calendar/year/0')
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});