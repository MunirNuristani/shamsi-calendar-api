// tests/integration/holiday.api.test.ts

import request from 'supertest';
import app from '../../src/app';

describe('Holiday API - GET /api/holidays', () => {
  test('should get all holidays successfully', async () => {
    const response = await request(app)
      .get('/api/holidays')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.count).toBeDefined();
  });

  test('should support limit parameter', async () => {
    const response = await request(app)
      .get('/api/holidays?limit=2')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeLessThanOrEqual(2);
  });

  test('should support skip and limit parameters', async () => {
    const response = await request(app)
      .get('/api/holidays?skip=1&limit=2')
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});

describe('Holiday API - GET /api/holidays/year/:year', () => {
  test('should get holidays by year successfully', async () => {
    const response = await request(app)
      .get('/api/holidays/year/1403')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.count).toBeDefined();

    // All holidays should be from 1403
    response.body.data.forEach((holiday: any) => {
      expect(holiday.shamsiYear).toBe(1403);
    });
  });

  test('should return empty array for year with no holidays', async () => {
    const response = await request(app)
      .get('/api/holidays/year/2999') // Changed from 9999 to 2999 (within MAX_YEAR limit)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(0);
  });

  test('should return 400 for invalid year', async () => {
    const response = await request(app)
      .get('/api/holidays/year/abc')
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

describe('Holiday API - GET /api/holidays/year/:year/month/:month', () => {
  test('should get holidays by year and month successfully', async () => {
    const response = await request(app)
      .get('/api/holidays/year/1403/month/1')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);

    // All holidays should be from 1403/1
    response.body.data.forEach((holiday: any) => {
      expect(holiday.shamsiYear).toBe(1403);
      expect(holiday.shamsiMonth).toBe(1);
    });
  });

  test('should return 400 for invalid month', async () => {
    const response = await request(app)
      .get('/api/holidays/year/1403/month/13')
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

describe('Holiday API - GET /api/holidays/:id', () => {
  test('should get holiday by ID successfully', async () => {
    const response = await request(app)
      .get('/api/holidays/1403-1-1')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe('1403-1-1');
  });

  test('should return 404 for non-existent ID', async () => {
    const response = await request(app)
      .get('/api/holidays/nonexistent-id')
      .expect(404);

    expect(response.body.success).toBe(false);
  });
});

describe('Holiday API - GET /api/holidays/search', () => {
  test('should search holidays successfully', async () => {
    const response = await request(app)
      .get('/api/holidays/search?q=nowruz')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('should support language parameter', async () => {
    const response = await request(app)
      .get('/api/holidays/search?q=' + encodeURIComponent('نوروز') + '&lang=dari')
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  test('should return 400 when search term is missing', async () => {
    const response = await request(app)
      .get('/api/holidays/search')
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('should return empty array for no matches', async () => {
    const response = await request(app)
      .get('/api/holidays/search?q=xyz123notfound')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(0);
  });
});

describe('Holiday API - GET /api/holidays/statistics', () => {
  test('should get holiday statistics successfully', async () => {
    const response = await request(app)
      .get('/api/holidays/statistics')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.total).toBeDefined();
    expect(response.body.data.byType).toBeDefined();
    expect(response.body.data.national).toBeDefined();
    expect(response.body.data.public).toBeDefined();
  });

  test('should support year parameter', async () => {
    const response = await request(app)
      .get('/api/holidays/statistics?year=1403')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(typeof response.body.data.total).toBe('number');
  });

  test('should return 400 for invalid year', async () => {
    const response = await request(app)
      .get('/api/holidays/statistics?year=abc')
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});