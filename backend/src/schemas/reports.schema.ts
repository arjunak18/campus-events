import { z } from 'zod';

export const createReportSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  details: z.string().optional(),
});
