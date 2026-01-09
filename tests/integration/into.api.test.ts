// tests/integration/info.api.test.ts

import request from 'supertest';
import app from '../../src/app';

describe('Info API - GET /api/info', () => {
  test('should get API information successfully', async () => {
    const response = await request(app)
      .get('/api/info')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBeDefined();
    expect(response.body.data.version).toBeDefined();
    expect(response.body.data.description).toBeDefined();
    expect(Array.isArray(response.body.data.features)).toBe(true);
    expect(Array.isArray(response.body.data.supportedLanguages)).toBe(true);
    expect(response.body.data.endpoints).toBeDefined();
  });
});

describe('Info API - GET /api/info/months', () => {
  test('should get all month names successfully', async () => {
    const response = await request(app)
      .get('/api/info/months')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(12);

    // Check structure of first month
    expect(response.body.data[0].number).toBe(1);
    expect(response.body.data[0].names).toBeDefined();
    expect(response.body.data[0].names.dari).toBeDefined();
    expect(response.body.data[0].names.pashto).toBeDefined();
    expect(response.body.data[0].names.english).toBeDefined();
  });

  test('should have correct month names', async () => {
    const response = await request(app)
      .get('/api/info/months')
      .expect(200);

    const firstMonth = response.body.data[0];
    expect(firstMonth.names.english).toBe('Hamal');
    expect(firstMonth.names.dari).toBe('حمل');
    expect(firstMonth.names.pashto).toBe('وری');
  });
});

describe('Info API - GET /api/info/days', () => {
  test('should get all day names successfully', async () => {
    const response = await request(app)
      .get('/api/info/days')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(7);

    // Check structure of first day
    expect(response.body.data[0].number).toBe(1);
    expect(response.body.data[0].names).toBeDefined();
    expect(response.body.data[0].names.dari).toBeDefined();
    expect(response.body.data[0].names.pashto).toBeDefined();
    expect(response.body.data[0].names.english).toBeDefined();
  });

  test('should have correct day names', async () => {
    const response = await request(app)
      .get('/api/info/days')
      .expect(200);

    const firstDay = response.body.data[0];
    expect(firstDay.names.english).toBe('Saturday');

    const lastDay = response.body.data[6];
    expect(lastDay.names.english).toBe('Friday');
  });
});

describe('Info API - GET /api/info/leap-years/:startYear/:endYear', () => {
  test('should get leap years in range successfully', async () => {
    const response = await request(app)
      .get('/api/info/leap-years/1400/1410')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.count).toBeDefined();
    expect(response.body.data.length).toBe(response.body.count);
  });

  test('should only return leap years', async () => {
    const response = await request(app)
      .get('/api/info/leap-years/1400/1410')
      .expect(200);

    expect(response.body.success).toBe(true);

    // Verify all returned years are in the 33-year cycle pattern
    response.body.data.forEach((year: number) => {
      const position = year % 33;
      const leapPositions = [1, 5, 9, 13, 17, 22, 26, 30];
      expect(leapPositions.includes(position)).toBe(true);
    });
  });

  test('should return 400 for invalid year range', async () => {
    const response = await request(app)
      .get('/api/info/leap-years/abc/def')
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('should return 400 when endYear is less than startYear', async () => {
    const response = await request(app)
      .get('/api/info/leap-years/1410/1400')
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('should handle single year range', async () => {
    const response = await request(app)
      .get('/api/info/leap-years/1401/1401')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});