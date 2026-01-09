# Shamsi Calendar API

A comprehensive RESTful API for the Afghan Shamsi (Solar Hijri) calendar with full support for Dari, Pashto, and English languages.

## Features

- 📅 **Date Conversion**: Convert between Shamsi and Gregorian calendars with accurate algorithm
- 🗓️ **Calendar Views**: Generate day, week, month, and year calendar views
- 🎉 **Holiday Management**: Full holiday operations with comprehensive data
- 🌍 **Multi-language Support**: Dari, Pashto, and English
- 🔍 **Search & Filter**: Search holidays and filter by type
- 📊 **Statistics**: Get calendar and holiday statistics
- 📖 **Interactive API Documentation**: Swagger/OpenAPI 3.0 documentation with live testing
- 🚀 **High Performance**: Optimized with rate limiting and caching
- ✅ **Type-Safe**: Built with TypeScript
- 🧪 **Well Tested**: 151 tests with 85.6% code coverage

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Data Storage**: JSON files (no database required)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI 3.0 (swagger-jsdoc, swagger-ui-express)
- **Testing**: Jest, Supertest, ts-jest

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone 
cd shamsi-calendar-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. Build the TypeScript code:
```bash
npm run build
```

5. Start the server:
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

## API Documentation

### Interactive Documentation (Swagger UI)

Access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

The Swagger UI provides:
- Complete API reference with all endpoints
- Request/response examples
- Interactive "Try it out" functionality
- Schema definitions and validation rules

### OpenAPI Specification

Download the OpenAPI specification:
- **JSON**: `http://localhost:3000/api-docs.json`
- **YAML**: `docs/openapi.yaml`

Use these to:
- Import into Postman or Insomnia
- Generate client SDKs (TypeScript, Python, Java, etc.)
- Integrate with API management tools

### Base URL
```
http://localhost:3000
```

### Conversion Endpoints

#### Convert Shamsi to Gregorian
```http
POST /api/convert/shamsi-to-gregorian
Content-Type: application/json

{
  "year": 1403,
  "month": 10,
  "day": 19
}
```

#### Convert Gregorian to Shamsi
```http
POST /api/convert/gregorian-to-shamsi
Content-Type: application/json

{
  "year": 2025,
  "month": 1,
  "day": 8
}
```

#### Get Today's Date
```http
GET /api/convert/today?lang=english&includeGregorian=true
```

### Calendar Endpoints

#### Get Day View
```http
GET /api/calendar/day/1403/10/19?lang=english&includeHolidays=true
```

#### Get Week View
```http
GET /api/calendar/week/1403/10/19?lang=english&startOfWeek=1
```

#### Get Month View
```http
GET /api/calendar/month/1403/10?lang=english&includeHolidays=true
```

#### Get Year View
```http
GET /api/calendar/year/1403?lang=english&format=full
```

### Holiday Endpoints

#### Create Holiday
*Note: This API uses predefined holidays from a JSON file. To add/modify holidays, edit `data/holidays.json` and restart the server.*

#### Get Holidays by Year
```http
GET /api/holidays/year/1403
```

#### Get Holidays by Year and Month
```http
GET /api/holidays/year/1403/month/1
```

#### Search Holidays
```http
GET /api/holidays/search?q=nowruz&lang=english
```

#### Get Holiday Statistics
```http
GET /api/holidays/statistics?year=1403
```

*Note: Write operations (POST, PUT, DELETE) have been removed. To manage holidays, edit the `data/holidays.json` file directly.*

### Info Endpoints

#### Get API Info
```http
GET /api/info
```

#### Get Month Names
```http
GET /api/info/months
```

#### Get Day Names
```http
GET /api/info/days
```

#### Get Leap Years
```http
GET /api/info/leap-years/1400/1410
```

## Query Parameters

### Common Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `lang` | string | `english` | Language for responses (`dari`, `pashto`, `english`) |
| `includeGregorian` | boolean | `true` | Include Gregorian dates in response |
| `includeHolidays` | boolean | `true` | Include holiday information |
| `startOfWeek` | number | `1` | First day of week (1=Saturday, 2=Sunday, 3=Monday) |
| `format` | string | `full` | Response format (`full`, `compact`) |

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

## Shamsi Calendar Details

### Month Names

| # | Dari | Pashto | English | Days |
|---|------|--------|---------|------|
| 1 | حمل | وری | Hamal | 31 |
| 2 | ثور | غويی | Sawr | 31 |
| 3 | جوزا | غبرګولی | Jawza | 31 |
| 4 | سرطان | چنګاښ | Saratan | 31 |
| 5 | اسد | زمری | Asad | 31 |
| 6 | سنبله | وږی | Sonbola | 31 |
| 7 | میزان | تله | Mizan | 30 |
| 8 | عقرب | لړم | Aqrab | 30 |
| 9 | قوس | ليندۍ | Qaws | 30 |
| 10 | جدی | مرغومی | Jadi | 30 |
| 11 | دلو | سلواغه | Dalvæ | 30 |
| 12 | حوت | كب | Hut | 29/30* |

*30 days in leap years

### Day Names (Week starts on Saturday)

| # | Dari | Pashto | English |
|---|------|--------|---------|
| 1 | شنبه | شنبه | Saturday |
| 2 | یکشنبه | يکشنبه | Sunday |
| 3 | دوشنبه | دوشنبه | Monday |
| 4 | سه‌شنبه | درېشنبه | Tuesday |
| 5 | چهارشنبه | څلرشنبه | Wednesday |
| 6 | پنجشنبه | پينځشنبه | Thursday |
| 7 | جمعه | جمعه | Friday |

### Leap Years

The Shamsi calendar uses a 33-year cycle. Leap years occur at positions: 1, 5, 9, 13, 17, 22, 26, 30 in each cycle.

**Examples:**
- Year 1403: `1403 % 33 = 17` → Leap year (30 days in month 12)
- Year 1404: `1404 % 33 = 18` → Normal year (29 days in month 12)
- Year 1408: `1408 % 33 = 22` → Leap year (30 days in month 12)

### Conversion Algorithm

The API uses an accurate Julian Day Number-based algorithm for date conversions:
- **Epoch**: March 22, 622 CE (Julian Day 1948320)
- **Accuracy**: Verified with known dates like Nowruz (March 20, 2024 = 1403/1/1)
- **Bidirectional**: Seamless conversion in both directions

## Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Read Operations | 300 requests | 15 minutes |
| Write Operations | 50 requests | 1 hour |
| Search | 30 requests | 1 minute |

## Development

### Project Structure

```
shamsi-calendar-api/
├── src/
│   ├── config/
│   │   ├── constants.ts
│   │   └── swagger.ts              # Swagger/OpenAPI configuration
│   ├── data/
│   │   └── holidayData.ts
│   ├── controllers/
│   │   ├── calendarController.ts
│   │   ├── conversionController.ts
│   │   ├── holidayController.ts
│   │   └── infoController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── rateLimit.ts
│   │   └── validator.ts
│   ├── routes/
│   │   ├── calendar.ts             # With Swagger JSDoc comments
│   │   ├── conversion.ts           # With Swagger JSDoc comments
│   │   ├── holidays.ts             # With Swagger JSDoc comments
│   │   └── info.ts                 # With Swagger JSDoc comments
│   ├── services/
│   │   ├── calendarService.ts
│   │   ├── dateService.ts
│   │   ├── holidayService.ts
│   │   └── localizationService.ts
│   ├── utils/
│   │   ├── shamsiAlgorithm.ts      # Fixed conversion algorithm
│   │   └── validators.ts
│   └── app.ts
├── docs/
│   └── openapi.yaml                # OpenAPI specification
├── seeds/
│   └── holidays.json               # Holiday data
├── tests/
│   ├── integration/                # API integration tests
│   └── unit/                       # Unit tests
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

### Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

### Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- tests/unit/shamsiAlgorithm.test.ts
```

**Test Statistics:**
- **Total Tests**: 151 (150 passing, 1 skipped)
- **Test Suites**: 9 (all passing)
- **Code Coverage**: 85.6%
- **Test Types**: Unit tests, Integration tests, API tests

**What's Tested:**
- ✓ Shamsi-Gregorian date conversions (bidirectional)
- ✓ Leap year calculations
- ✓ Calendar generation (day, week, month, year views)
- ✓ Holiday search and filtering
- ✓ Multi-language localization
- ✓ API endpoints and error handling
- ✓ Request validation and edge cases

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For questions and support, please open an issue in the repository.

## Recent Updates

### Version 1.0.0 (January 2026)

**Major Improvements:**
- ✅ **Fixed Conversion Algorithm**: Completely rewrote the Shamsi-Gregorian conversion algorithm with accurate Julian Day calculations
- ✅ **Swagger Documentation**: Added comprehensive OpenAPI 3.0 documentation with interactive Swagger UI
- ✅ **Full Test Coverage**: Implemented 151 tests with 85.6% code coverage
- ✅ **Improved Validation**: Enhanced date validation and error handling
- ✅ **Bug Fixes**:
  - Fixed `/api/convert/today` endpoint returning incorrect dates
  - Fixed leap year calculations (1403 is correctly identified as a leap year)
  - Fixed port conflicts during test execution

**API Coverage:**
- 17 endpoints fully documented
- 6 reusable schemas
- 8 reusable parameters
- 4 endpoint categories (Conversion, Calendar, Holidays, Info)

## Acknowledgments

- Afghan Shamsi calendar algorithm based on astronomical calculations
- Multi-language support for Dari, Pashto, and English
- Built for the Afghan community worldwide
- Conversion algorithm verified against known dates (e.g., Nowruz 1403 = March 20, 2024)