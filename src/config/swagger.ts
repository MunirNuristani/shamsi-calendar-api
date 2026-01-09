// src/config/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shamsi Calendar API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for the Afghan Shamsi (Solar Hijri) calendar with full support for Dari, Pashto, and English languages.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: process.env.PRODUCTION_URL || 'https://shamsi-calendar-api.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Conversion',
        description: 'Date conversion between Shamsi and Gregorian calendars',
      },
      {
        name: 'Calendar',
        description: 'Calendar view generation (day, week, month, year)',
      },
      {
        name: 'Holidays',
        description: 'Holiday information and queries',
      },
      {
        name: 'Info',
        description: 'Utility endpoints for calendar metadata',
      },
    ],
    components: {
      schemas: {
        ShamsiDate: {
          type: 'object',
          required: ['year', 'month', 'day'],
          properties: {
            year: {
              type: 'integer',
              minimum: 1,
              maximum: 3000,
              example: 1403,
              description: 'Shamsi year',
            },
            month: {
              type: 'integer',
              minimum: 1,
              maximum: 12,
              example: 10,
              description: 'Shamsi month (1-12)',
            },
            day: {
              type: 'integer',
              minimum: 1,
              maximum: 31,
              example: 19,
              description: 'Shamsi day (1-31)',
            },
          },
        },
        GregorianDate: {
          type: 'object',
          required: ['year', 'month', 'day'],
          properties: {
            year: {
              type: 'integer',
              minimum: 1,
              maximum: 3000,
              example: 2025,
              description: 'Gregorian year',
            },
            month: {
              type: 'integer',
              minimum: 1,
              maximum: 12,
              example: 1,
              description: 'Gregorian month (1-12)',
            },
            day: {
              type: 'integer',
              minimum: 1,
              maximum: 31,
              example: 8,
              description: 'Gregorian day (1-31)',
            },
          },
        },
        LocalizedName: {
          type: 'object',
          properties: {
            dari: {
              type: 'string',
              example: 'نوروز',
              description: 'Name in Dari',
            },
            pashto: {
              type: 'string',
              example: 'نوی کال',
              description: 'Name in Pashto',
            },
            english: {
              type: 'string',
              example: 'Nowruz',
              description: 'Name in English',
            },
          },
        },
        Holiday: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '1403-1-1',
              description: 'Unique holiday identifier',
            },
            shamsiYear: {
              type: 'integer',
              example: 1403,
            },
            shamsiMonth: {
              type: 'integer',
              example: 1,
            },
            shamsiDay: {
              type: 'integer',
              example: 1,
            },
            names: {
              $ref: '#/components/schemas/LocalizedName',
            },
            descriptions: {
              $ref: '#/components/schemas/LocalizedName',
            },
            type: {
              type: 'string',
              enum: ['national', 'religious', 'cultural', 'international'],
              example: 'national',
            },
            isNationalHoliday: {
              type: 'boolean',
              example: true,
            },
            isPublicHoliday: {
              type: 'boolean',
              example: true,
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data (structure varies by endpoint)',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Invalid Shamsi date',
                },
                statusCode: {
                  type: 'integer',
                  example: 400,
                },
              },
            },
          },
        },
      },
      parameters: {
        Language: {
          in: 'query',
          name: 'lang',
          schema: {
            type: 'string',
            enum: ['dari', 'pashto', 'english'],
            default: 'english',
          },
          description: 'Response language',
        },
        IncludeGregorian: {
          in: 'query',
          name: 'includeGregorian',
          schema: {
            type: 'boolean',
            default: true,
          },
          description: 'Include Gregorian dates in response',
        },
        IncludeHolidays: {
          in: 'query',
          name: 'includeHolidays',
          schema: {
            type: 'boolean',
            default: true,
          },
          description: 'Include holiday information',
        },
        StartOfWeek: {
          in: 'query',
          name: 'startOfWeek',
          schema: {
            type: 'integer',
            enum: [1, 2, 3],
            default: 1,
          },
          description: 'First day of week (1=Saturday, 2=Sunday, 3=Monday)',
        },
        Format: {
          in: 'query',
          name: 'format',
          schema: {
            type: 'string',
            enum: ['full', 'compact'],
            default: 'full',
          },
          description: 'Response detail level',
        },
        Year: {
          in: 'path',
          name: 'year',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 3000,
          },
          description: 'Shamsi year',
        },
        Month: {
          in: 'path',
          name: 'month',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 12,
          },
          description: 'Shamsi month',
        },
        Day: {
          in: 'path',
          name: 'day',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 31,
          },
          description: 'Shamsi day',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;