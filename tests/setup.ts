// tests/setup.ts

/**
 * Test Setup and Configuration
 * This file runs before all tests
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Suppress console output during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Set longer timeout for integration tests
jest.setTimeout(10000);

// Global test utilities
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data helpers
export const mockShamsiDate = (year = 1403, month = 1, day = 1) => ({
  year,
  month,
  day,
});

export const mockGregorianDate = (year = 2024, month = 3, day = 20) => ({
  year,
  month,
  day,
});

export const mockHoliday = (overrides = {}) => ({
  id: '1403-1-1',
  shamsiYear: 1403,
  shamsiMonth: 1,
  shamsiDay: 1,
  names: {
    dari: 'نوروز',
    pashto: 'نوی کال',
    english: 'Nowruz',
  },
  descriptions: {
    dari: 'جشن سال نو',
    pashto: 'د نوي کال جشن',
    english: 'New Year celebration',
  },
  type: 'national' as const,
  isNationalHoliday: true,
  isPublicHoliday: true,
  ...overrides,
});

// Cleanup after all tests
afterAll(async () => {
  // Add any cleanup logic here
  await delay(100);
});