import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsConfig } from './config/cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import routes from './routes';
import { successResponse } from './utils/response';

const app: Express = express();

// Security Middleware
app.use(helmet());
app.use(cors(corsConfig));

// Rate Limiting
app.use(generalLimiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(requestLogger);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  return successResponse(res, { status: 'ok', timestamp: new Date().toISOString() }, 200, 'Server is healthy');
});

// Routes
app.use('/api/v1', routes);
// Also support generic /api that maps to v1
app.use('/api', routes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error Handler (must be last)
app.use(errorHandler);

export default app;
