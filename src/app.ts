// src/app.ts

import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import conversionRoutes from './routes/conversion';
import calendarRoutes from './routes/calendar';
import holidayRoutes from './routes/holidays';
import infoRoutes from './routes/info';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// ===========================
// Middleware
// ===========================

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (simple)
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===========================
// Routes
// ===========================

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Shamsi Calendar API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Shamsi Calendar API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/convert', conversionRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/info', infoRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Shamsi Calendar API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      conversion: '/api/convert',
      calendar: '/api/calendar',
      holidays: '/api/holidays',
      info: '/api/info',
    },
  });
});

// ===========================
// Error Handling
// ===========================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ===========================
// Server Start
// ===========================

const startServer = () => {
  try {
    // Start server
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📅 Shamsi Calendar API v1.0.0`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 API Endpoint: http://localhost:${PORT}`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Only start the server if this file is run directly (not imported in tests)
if (require.main === module) {
  startServer();

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: Error) => {
    console.error('❌ Unhandled Rejection:', reason);
    process.exit(1);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
  });
}

export default app;