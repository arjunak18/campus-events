import { z } from 'zod';

export const createRegistrationSchema = z.object({
  // Event ID is usually in the URL
  // If there are specific fields users need to provide on registration, add them here
  ticket_code: z.string().optional(),
});
