# Shamsi Calendar API

A comprehensive RESTful API for the Afghan Shamsi (Solar Hijri) calendar with full support for Dari, Pashto, and English languages.

## Features

- 📅 **Date Conversion**: Convert between Shamsi and Gregorian calendars
- 🗓️ **Calendar Views**: Generate day, week, month, and year calendar views
- 🎉 **Holiday Management**: Full CRUD operations for holidays
- 🌍 **Multi-language Support**: Dari, Pashto, and English
- 🔍 **Search & Filter**: Search holidays and filter by type
- 📊 **Statistics**: Get calendar and holiday statistics
- 🚀 **High Performance**: Optimized with rate limiting and caching
- ✅ **Type-Safe**: Built with TypeScript

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Data Storage**: JSON files (no database required)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

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

## API Endpoints

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

The Shamsi calendar uses a 33-year cycle. Leap years occur at years: 1, 5, 9, 13, 17, 22, 26, 30 in each cycle.

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
│   │   └── constants.ts
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
│   │   ├── calendar.ts
│   │   ├── conversion.ts
│   │   ├── holidays.ts
│   │   └── info.ts
│   ├── services/
│   │   ├── calendarService.ts
│   │   ├── dateService.ts
│   │   ├── holidayService.ts
│   │   └── localizationService.ts
│   ├── utils/
│   │   ├── shamsiAlgorithm.ts
│   │   └── validators.ts
│   └── app.ts
├── data/
│   └── holidays.json
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
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

# Run tests (when implemented)
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For questions and support, please open an issue in the repository.

## Acknowledgments

- Afghan Shamsi calendar algorithm based on astronomical calculations
- Multi-language support for Dari, Pashto, and English
- Built for the Afghan community worldwide