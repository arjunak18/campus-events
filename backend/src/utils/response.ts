import { Response } from 'express';
import { PaginatedResult, ApiResponse } from '../types';

export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  error: any
) => {
  const statusCode = error.statusCode || 500;
  const response: ApiResponse = {
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.errors,
  };
  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: PaginatedResult<T>['pagination'],
  statusCode = 200,
  message?: string
) => {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    pagination,
  };
  return res.status(statusCode).json(response);
};
