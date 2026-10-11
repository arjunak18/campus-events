import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.string().optional().transform((val: any) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val: any) => (val ? parseInt(val, 10) : 20)),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID format. Must be a UUID.'),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine((data: any) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"]
});
