import { Request } from 'express';

export const getPaginationParams = (req: Request) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  
  const offset = (page - 1) * limit;
  
  return {
    page,
    limit,
    offset,
  };
};

export const getPaginationMetadata = (total: number, page: number, limit: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

/** Returns Supabase range values (from, to) for pagination */
export const getPaginationOptions = (page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
};

export const createPaginatedResponse = <T>(data: T[], total: number, page: number, limit: number) => {
  return {
    data,
    pagination: getPaginationMetadata(total, page, limit),
  };
};
