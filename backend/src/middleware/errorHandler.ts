import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, InternalServerError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { errorResponse } from '../utils/response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error caught in middleware:', { 
    name: err.name, 
    message: err.message, 
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err instanceof AppError) {
    return errorResponse(res, err);
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e: any) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return errorResponse(res, new ValidationError('Validation failed', formattedErrors));
  }
  
  // Handle Supabase errors if any specific ones bubble up
  if (err.name === 'AuthApiError' || err.name === 'PostgrestError') {
     // You can translate specific supabase errors to AppErrors here
  }

  return errorResponse(res, new InternalServerError());
};
