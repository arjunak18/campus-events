import morgan from 'morgan';
import { logger } from '../utils/logger';
import { Request, Response } from 'express';

// Define a custom morgan format or use a pre-defined one
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

export const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      // Log the message using our structured logger
      // Remove trailing newline added by morgan
      logger.info(message.trim());
    },
  },
  skip: (req: Request, res: Response) => {
    // Skip logging health checks to reduce noise
    return req.originalUrl === '/api/health' || req.originalUrl === '/health';
  },
});
