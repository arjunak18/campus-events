import { z } from 'zod';

export const createOrganizationSchema = z.object({
  college_id: z.string().uuid('Invalid college ID'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  website: z.string().url('Invalid URL').optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial().extend({
  logo_url: z.string().url().optional(),
  cover_url: z.string().url().optional(),
  social_links: z.any().optional(),
});

export const verificationRequestSchema = z.object({
  notes: z.string().optional(),
  documents: z.any().optional(),
});
