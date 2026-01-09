# Shamsi Calendar API - Testing Guide

Comprehensive test suite for the Shamsi Calendar API with unit and integration tests.

## Test Structure

```
tests/
├── unit/
│   ├── shamsiAlgorithm.test.ts      # Algorithm tests (conversions, leap years)
│   ├── localizationService.test.ts  # Localization tests (translations)
│   ├── dateService.test.ts          # Date service tests
│   └── holidayService.test.ts       # Holiday service tests
├── integration/
│   ├── conversion.api.test.ts       # Conversion API endpoint tests
│   ├── calendar.api.test.ts         # Calendar API endpoint tests
│   ├── holiday.api.test.ts          # Holiday API endpoint tests
│   ├── info.api.test.ts             # Info API endpoint tests
│   └── general.api.test.ts          # General API tests (health, errors, etc.)
└── setup.ts                          # Test configuration and utilities
```

## Running Tests

### Install Dependencies

```bash
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Only Unit Tests

```bash
npm run test:unit
```

### Run Only Integration Tests

```bash
npm run test:integration
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

## Test Coverage

The test suite covers:

### Unit Tests (60+ tests)

**shamsiAlgorithm.test.ts:**
- ✅ Leap year calculations (Shamsi and Gregorian)
- ✅ Days in month calculations
- ✅ Date validation
- ✅ Date conversions (Shamsi ↔ Gregorian)
- ✅ Day of week calculations
- ✅ Date arithmetic (adding days, calculating differences)

**localizationService.test.ts:**
- ✅ Month name translations (Dari, Pashto, English)
- ✅ Day name translations
- ✅ Date formatting
- ✅ Label translations
- ✅ Holiday type name translations
- ✅ Language validation

**dateService.test.ts:**
- ✅ Date conversion with full info
- ✅ Date info retrieval
- ✅ Weekend detection
- ✅ Week date generation
- ✅ Month statistics
- ✅ Year statistics
- ✅ Leap year range queries
- ✅ Date comparisons

**holidayService.test.ts:**
- ✅ Holiday retrieval (by year, month, date)
- ✅ Holiday filtering (national, public, by type)
- ✅ Holiday search
- ✅ Holiday statistics
- ✅ Utility functions

### Integration Tests (50+ tests)

**conversion.api.test.ts:**
- ✅ POST /api/convert/shamsi-to-gregorian
- ✅ POST /api/convert/gregorian-to-shamsi
- ✅ GET /api/convert/today
- ✅ Error handling and validation
- ✅ Query parameter support

**calendar.api.test.ts:**
- ✅ GET /api/calendar/day/:year/:month/:day
- ✅ GET /api/calendar/week/:year/:month/:day
- ✅ GET /api/calendar/month/:year/:month
- ✅ GET /api/calendar/year/:year
- ✅ All query parameters
- ✅ Error handling

**holiday.api.test.ts:**
- ✅ GET /api/holidays
- ✅ GET /api/holidays/year/:year
- ✅ GET /api/holidays/year/:year/month/:month
- ✅ GET /api/holidays/:id
- ✅ GET /api/holidays/search
- ✅ GET /api/holidays/statistics
- ✅ Pagination support
- ✅ Error handling

**info.api.test.ts:**
- ✅ GET /api/info
- ✅ GET /api/info/months
- ✅ GET /api/info/days
- ✅ GET /api/info/leap-years/:startYear/:endYear
- ✅ Data validation

**general.api.test.ts:**
- ✅ Root endpoint
- ✅ Health check
- ✅ 404 handling
- ✅ Error handling
- ✅ CORS support
- ✅ Content type validation
- ✅ Query parameter validation
- ✅ HTTP method validation


## Test Examples

### Unit Test Example

```typescript
test('should convert Shamsi to Gregorian correctly', () => {
  const result = shamsiToGregorian({ year: 1403, month: 1, day: 1 });
  expect(result.year).toBe(2024);
  expect(result.month).toBe(3);
  expect(result.day).toBe(20);
});
```

### Integration Test Example

```typescript
test('should get month view successfully', async () => {
  const response = await request(app)
    .get('/api/calendar/month/1403/1')
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.data.totalDays).toBe(31);
});
```

## Coverage Goals

Target coverage metrics:
- **Statements:** 90%+
- **Branches:** 85%+
- **Functions:** 90%+
- **Lines:** 90%+

View coverage report:
```bash
npm test -- --coverage
# Then open: coverage/lcov-report/index.html
```

## Continuous Integration

Tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Writing New Tests

### Unit Test Template

```typescript
// tests/unit/myService.test.ts
import { myFunction } from '../../src/services/myService';

describe('My Service', () => {
  test('should do something', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### Integration Test Template

```typescript
// tests/integration/myApi.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('My API', () => {
  test('should return data', async () => {
    const response = await request(app)
      .get('/api/my-endpoint')
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

## Best Practices

1. **Keep tests isolated** - Each test should be independent
2. **Use descriptive names** - Test names should clearly describe what's being tested
3. **Test edge cases** - Include boundary conditions and error scenarios
4. **Mock external dependencies** - Use mocks for external services
5. **Keep tests fast** - Optimize for quick execution
6. **Maintain tests** - Update tests when code changes

## Troubleshooting

### Tests Failing

1. Check if all dependencies are installed: `npm install`
2. Ensure TypeScript is compiled: `npm run build`
3. Check environment variables in test setup
4. Look at detailed error messages

### Slow Tests

1. Check if any tests are making real HTTP requests
2. Reduce timeout values if possible
3. Run specific test files instead of all tests

### Coverage Issues

1. Identify uncovered code: `npm test -- --coverage`
2. Add tests for uncovered lines
3. Focus on critical paths first

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this README if needed

## Support

For test-related questions:
- Check existing test files for examples
- Review Jest documentation: https://jestjs.io/
- Review Supertest documentation: https://github.com/visionmedia/supertest