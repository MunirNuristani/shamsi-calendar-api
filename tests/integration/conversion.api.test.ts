// tests/integration/conversion.api.test.ts

import request from 'supertest';
import app from '../../src/app';

describe('Conversion API - POST /api/convert/shamsi-to-gregorian', () => {
  test('should convert Shamsi to Gregorian successfully', async () => {
    // 1403/1/1 should convert to March 20, 2024
    const response = await request(app)
      .post('/api/convert/shamsi-to-gregorian')
      .send({ year: 1403, month: 1, day: 1 })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.input.calendar).toBe('Shamsi');
    expect(response.body.data.output.calendar).toBe('Gregorian');
    expect(response.body.data.output.date.year).toBe(2024);
    expect(response.body.data.output.date.month).toBe(3);
    expect(response.body.data.output.date.day).toBe(20);
  });

  test('should return 400 for invalid Shamsi date', async () => {
    const response = await request(app)
      .post('/api/convert/shamsi-to-gregorian')
      .send({ year: 1403, month: 13, day: 1 })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  test('should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/api/convert/shamsi-to-gregorian')
      .send({ year: 1403, month: 1 })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('should return 400 for invalid data types', async () => {
    const response = await request(app)
      .post('/api/convert/shamsi-to-gregorian')
      .send({ year: 'abc', month: 1, day: 1 })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

describe('Conversion API - POST /api/convert/gregorian-to-shamsi', () => {
  test('should convert Gregorian to Shamsi successfully', async () => {
    // March 20, 2024 should convert to 1403/1/1
    const response = await request(app)
      .post('/api/convert/gregorian-to-shamsi')
      .send({ year: 2024, month: 3, day: 20 })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.input.calendar).toBe('Gregorian');
    expect(response.body.data.output.calendar).toBe('Shamsi');
    expect(response.body.data.output.date.year).toBe(1403);
    expect(response.body.data.output.date.month).toBe(1);
    expect(response.body.data.output.date.day).toBe(1);
  });

  test('should return 400 for invalid Gregorian date', async () => {
    const response = await request(app)
      .post('/api/convert/gregorian-to-shamsi')
      .send({ year: 2024, month: 2, day: 30 })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('should support language query parameter', async () => {
    const response = await request(app)
      .post('/api/convert/gregorian-to-shamsi?lang=dari')
      .send({ year: 2024, month: 3, day: 20 })
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});

describe('Conversion API - GET /api/convert/today', () => {
  test('should get today\'s date successfully', async () => {
    const response = await request(app)
      .get('/api/convert/today')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.shamsi).toBeDefined();
    expect(response.body.data.gregorian).toBeDefined();
    expect(response.body.data.dayOfWeek).toBeDefined();
    expect(response.body.data.month).toBeDefined();
    expect(typeof response.body.data.isWeekend).toBe('boolean');
  });

  test('should support language parameter', async () => {
    const response = await request(app)
      .get('/api/convert/today?lang=dari')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.dayOfWeek.name).toBeDefined();
  });

  test('should support includeGregorian parameter', async () => {
    const response = await request(app)
      .get('/api/convert/today?includeGregorian=false')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.gregorian).toBeUndefined();
  });
});