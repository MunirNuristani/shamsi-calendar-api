# Shamsi Calendar API - Swagger Documentation Guide

Interactive API documentation using Swagger/OpenAPI 3.0

## 📚 Accessing the Documentation

### Interactive UI
Once your server is running, access the Swagger UI at:
```
http://localhost:3000/api-docs
```

### OpenAPI JSON
Get the raw OpenAPI specification at:
```
http://localhost:3000/api-docs.json
```

### Static YAML File
The complete OpenAPI spec is also available as a standalone file:
```
docs/openapi.yaml
```

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
```

### Step 2: Start the Server

```bash
npm run dev
```

### Step 3: Open Swagger UI

Navigate to `http://localhost:3000/api-docs` in your browser

## 🎨 Using Swagger UI

### 1. Explore Endpoints

- Click on any endpoint to expand it
- See request/response schemas
- View example values
- Check required parameters

### 2. Try It Out

1. Click **"Try it out"** button
2. Fill in parameters
3. Click **"Execute"**
4. See the response below

### 3. View Schemas

- Scroll to **"Schemas"** section at the bottom
- See all data models
- Click on any schema to expand details

### 4. Authentication

Currently no authentication required. If added in future:
- Click **"Authorize"** button (🔒 icon)
- Enter credentials
- All requests will include auth headers

## 📋 Documentation Structure

### Tags (Categories)

**Conversion** - Date conversion endpoints
- POST /api/convert/shamsi-to-gregorian
- POST /api/convert/gregorian-to-shamsi
- GET /api/convert/today

**Calendar** - Calendar view endpoints
- GET /api/calendar/day/{year}/{month}/{day}
- GET /api/calendar/week/{year}/{month}/{day}
- GET /api/calendar/month/{year}/{month}
- GET /api/calendar/year/{year}

**Holidays** - Holiday management endpoints
- GET /api/holidays
- GET /api/holidays/year/{year}
- GET /api/holidays/year/{year}/month/{month}
- GET /api/holidays/{id}
- GET /api/holidays/search
- GET /api/holidays/statistics

**Info** - Utility and metadata endpoints
- GET /api/info
- GET /api/info/months
- GET /api/info/days
- GET /api/info/leap-years/{startYear}/{endYear}

## 🔍 Key Features

### 1. Request Examples

Each endpoint includes pre-filled examples:
- Nowruz date (1403/1/1)
- Current date examples
- Common use cases

### 2. Parameter Descriptions

All parameters are documented with:
- Data type
- Constraints (min/max values)
- Default values
- Example values
- Descriptions

### 3. Response Schemas

Every response includes:
- Success response structure
- Error response structure
- Example responses
- Status codes

### 4. Common Parameters

Reusable parameters across endpoints:
- `lang` - Language (dari, pashto, english)
- `includeGregorian` - Include Gregorian dates
- `includeHolidays` - Include holiday info
- `startOfWeek` - Week start day
- `format` - Response detail level

### 5. Schemas (Data Models)

Pre-defined schemas:
- `ShamsiDate` - Shamsi date structure
- `GregorianDate` - Gregorian date structure
- `Holiday` - Holiday information
- `LocalizedName` - Multi-language names
- Error responses

## 📝 Testing Endpoints

### Example 1: Convert Date

1. Expand **POST /api/convert/shamsi-to-gregorian**
2. Click **"Try it out"**
3. Use default values or enter:
   ```json
   {
     "year": 1403,
     "month": 1,
     "day": 1
   }
   ```
4. Click **"Execute"**
5. See converted Gregorian date in response

### Example 2: Get Month Calendar

1. Expand **GET /api/calendar/month/{year}/{month}**
2. Click **"Try it out"**
3. Enter:
   - year: `1403`
   - month: `10`
   - lang: `english`
4. Click **"Execute"**
5. See full month calendar in response

### Example 3: Search Holidays

1. Expand **GET /api/holidays/search**
2. Click **"Try it out"**
3. Enter:
   - q: `nowruz`
   - lang: `english`
4. Click **"Execute"**
5. See search results

## 🎯 Advanced Features

### Curl Commands

Swagger generates curl commands for each request:
1. Execute any request
2. Scroll to **"Curl"** tab
3. Copy the command
4. Use in terminal

### Request URL

See the exact URL being called:
1. Execute any request
2. Check **"Request URL"** field
3. Use this URL in your own applications

### Download Specification

Download the OpenAPI spec:
1. Top right corner
2. Click download icon
3. Choose JSON or YAML format

## 🔧 Customization

### Update Server URLs

Edit `src/config/swagger.ts`:
```typescript
servers: [
  {
    url: 'http://localhost:3000',
    description: 'Development server',
  },
  {
    url: 'https://your-production-url.com',
    description: 'Production server',
  },
]
```

### Add More Examples

In route files, add JSDoc comments:
```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Your endpoint description
 *     ...
 */
```

### Custom Styling

Modify Swagger UI in `src/app.ts`:
```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Your Custom Title',
  customfavIcon: '/path/to/favicon.ico',
}));
```

## 📖 OpenAPI Specification

### Version
Using OpenAPI 3.0.0 (latest stable version)

### Format
- YAML for readability
- JSON for programmatic access

### Standards
Following OpenAPI best practices:
- Proper use of schemas
- Reusable components
- Clear descriptions
- Example values
- Error responses

## 🔗 Integration

### Import into Other Tools

The OpenAPI spec can be imported into:

**Postman:**
1. Postman → Import
2. Enter: `http://localhost:3000/api-docs.json`

**Insomnia:**
1. Import/Export → Import Data
2. Select OpenAPI format
3. Choose the JSON file

**API Clients:**
Generate client code using:
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)

Example:
```bash
# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:3000/api-docs.json \
  -g typescript-axios \
  -o ./client
```

## 🐛 Troubleshooting

### Swagger UI Not Loading

**Problem:** Page shows blank or error

**Solutions:**
1. Check if server is running: `npm run dev`
2. Clear browser cache
3. Check console for errors
4. Verify Swagger dependencies installed

### Endpoints Not Showing

**Problem:** Some endpoints missing from docs

**Solutions:**
1. Check JSDoc comments in route files
2. Verify `apis` path in `swagger.ts`
3. Restart server
4. Check for TypeScript compilation errors

### Try It Out Not Working

**Problem:** Requests fail when using "Try it out"

**Solutions:**
1. Check CORS settings
2. Verify server is running
3. Check network tab for errors
4. Ensure request body is valid JSON

### Schema Validation Errors

**Problem:** Validation errors in Swagger UI

**Solutions:**
1. Check OpenAPI spec syntax
2. Validate spec at [Swagger Validator](https://validator.swagger.io/)
3. Review schema definitions
4. Check for circular references

## 📚 Additional Resources

### Official Documentation
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)

### Tutorials
- [OpenAPI 3.0 Tutorial](https://swagger.io/docs/specification/about/)
- [Swagger Editor](https://editor.swagger.io/) - Online editor

### Tools
- [Swagger Inspector](https://inspector.swagger.io/) - API testing
- [Swagger Hub](https://swagger.io/tools/swaggerhub/) - API design platform

## 🎉 Benefits

### For Developers
- ✅ Interactive testing without Postman
- ✅ Auto-generated documentation
- ✅ Always up-to-date
- ✅ Easy to share with team

### For API Users
- ✅ Clear endpoint descriptions
- ✅ Request/response examples
- ✅ Try before implementing
- ✅ Schema validation

### For Team
- ✅ Standardized documentation
- ✅ Version controlled
- ✅ Export to other tools
- ✅ Generate client SDKs

## 📝 Best Practices

1. **Keep Documentation Updated**
   - Update Swagger comments when changing endpoints
   - Add examples for new endpoints
   - Document breaking changes

2. **Use Clear Descriptions**
   - Explain what each endpoint does
   - Describe parameters clearly
   - Include use cases

3. **Provide Examples**
   - Add realistic example values
   - Show common use cases
   - Include edge cases

4. **Document Errors**
   - List possible error responses
   - Explain error codes
   - Show error message format

5. **Version Your API**
   - Include version in URL or header
   - Document version changes
   - Support multiple versions

## 🚀 Next Steps

1. ✅ Access Swagger UI at `/api-docs`
2. ✅ Try out different endpoints
3. ✅ Share documentation with your team
4. ✅ Export to Postman if needed
5. ✅ Generate client SDKs if required

---

**Happy Documenting! 📖**

For questions or issues, refer to the main API documentation or Swagger official resources.