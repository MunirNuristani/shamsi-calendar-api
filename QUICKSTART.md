# Quick Start Guide - Shamsi Calendar API (No Database Required!)

## 🚀 Get Your API Running in 3 Minutes

### Step 1: Install Dependencies
```bash
npm install express dotenv cors helmet express-rate-limit joi
npm install --save-dev typescript @types/express @types/node @types/cors nodemon ts-node
```

### Step 2: Initialize TypeScript
```bash
npx tsc --init
```

Then update your `tsconfig.json` with:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 3: Update package.json Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "nodemon --exec ts-node src/app.ts"
  }
}
```

### Step 4: Create .env File
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 5: Create Folder Structure
```bash
mkdir -p src/{config,data,controllers,middleware,routes,services,utils}
mkdir data
```

### Step 6: Run the API
```bash
# Development mode
npm run dev

# Production mode (build first)
npm run build
npm start
```

### Step 7: Test the API

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Get Today's Date
```bash
curl http://localhost:3000/api/convert/today
```

#### Convert Date
```bash
curl -X POST http://localhost:3000/api/convert/shamsi-to-gregorian \
  -H "Content-Type: application/json" \
  -d '{"year": 1403, "month": 10, "day": 19}'
```

#### Get Month Calendar
```bash
curl "http://localhost:3000/api/calendar/month/1403/10?lang=english"
```

## 📁 File Structure

### Core Files You Need:

**Root Directory:**
- `.env` - Environment variables
- `.gitignore` - Git ignore rules
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies

**Data (data/):**
- `holidays.json` - Holiday definitions (copy from artifacts)

**Source (src/):**

**Config:**
- `src/config/constants.ts` - All constants and types

**Data:**
- `src/data/holidayData.ts` - Holiday data loader (NEW - replaces database)

**Utils:**
- `src/utils/shamsiAlgorithm.ts` - Calendar algorithms
- `src/utils/validators.ts` - Validation schemas

**Services:**
- `src/services/localizationService.ts` - Multi-language
- `src/services/dateService.ts` - Date operations
- `src/services/calendarService.ts` - Calendar generation
- `src/services/holidayService.ts` - Holiday queries

**Middleware:**
- `src/middleware/errorHandler.ts` - Error handling
- `src/middleware/validator.ts` - Request validation
- `src/middleware/rateLimit.ts` - Rate limiting

**Controllers:**
- `src/controllers/conversionController.ts`
- `src/controllers/calendarController.ts`
- `src/controllers/holidayController.ts`
- `src/controllers/infoController.ts`

**Routes:**
- `src/routes/conversion.ts`
- `src/routes/calendar.ts`
- `src/routes/holidays.ts`
- `src/routes/info.ts`

**Main:**
- `src/app.ts` - Main application

## 🎯 Managing Holidays

### Adding New Holidays

Edit `data/holidays.json`:

```json
{
  "1403": [
    {
      "id": "1403-1-1",
      "shamsiYear": 1403,
      "shamsiMonth": 1,
      "shamsiDay": 1,
      "names": {
        "dari": "نوروز",
        "pashto": "نوی کال",
        "english": "Nowruz"
      },
      "descriptions": {
        "dari": "جشن سال نو",
        "pashto": "د نوي کال جشن",
        "english": "New Year celebration"
      },
      "type": "national",
      "isNationalHoliday": true,
      "isPublicHoliday": true
    }
  ]
}
```

After editing, restart the server to load new holidays.

## ✨ Key Advantages of This Approach

✅ **No Database Setup** - Just JSON files
✅ **Fast** - All data in memory
✅ **Simple Deployment** - No external dependencies
✅ **Easy Maintenance** - Edit JSON file to update holidays
✅ **Version Control** - Track holiday changes in git
✅ **Portable** - Works anywhere Node.js runs

## 🎯 Quick API Examples

### 1. Date Conversion
```javascript
fetch('http://localhost:3000/api/convert/shamsi-to-gregorian', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ year: 1403, month: 10, day: 19 })
})
```

### 2. Get Month Calendar
```javascript
fetch('http://localhost:3000/api/calendar/month/1403/10?lang=dari')
  .then(res => res.json())
  .then(data => console.log(data))
```

### 3. Search Holidays
```javascript
fetch('http://localhost:3000/api/holidays/search?q=nowruz&lang=english')
  .then(res => res.json())
  .then(data => console.log(data))
```

## 📚 What Changed from Database Version?

❌ **Removed:**
- MongoDB/Mongoose dependency
- Database connection logic
- Holiday model
- POST/PUT/DELETE endpoints for holidays

✅ **Added:**
- `holidayData.ts` - In-memory data loader
- JSON file-based holiday storage
- Simpler deployment

✅ **Kept Everything Else:**
- All calendar algorithms
- Date conversion
- Multi-language support
- All query/search functionality

## 🎉 You're All Set!

Your Shamsi Calendar API is now running with:
- ✅ Full date conversion
- ✅ Calendar views (day, week, month, year)
- ✅ Holiday queries and search
- ✅ Multi-language support
- ✅ NO DATABASE REQUIRED!

Happy coding! 🚀