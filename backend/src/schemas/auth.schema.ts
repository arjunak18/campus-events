import { z } from 'zod';

export const registerProfileSchema = z.object({
  email: z.string().email('Invalid email'),
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  collegeId: z.string().uuid().optional().nullable(),
  department: z.string().max(200).optional().nullable(),
  academicYear: z.string().max(50).optional().nullable(),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address').regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i, 'Only registered @gmail.com accounts are permitted'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  department: z.string().max(200).optional().nullable(),
  academicYear: z.string().max(50).optional().nullable(),
  collegeId: z.string().uuid().optional().nullable(),
});

export const updateProfileSchema = z.object({
  display_name: z.string().min(2).max(100).optional(),
  avatar_url: z.string().url().optional().nullable(),
  college_id: z.string().uuid().optional().nullable(),
  department: z.string().max(200).optional().nullable(),
  academic_year: z.string().max(50).optional().nullable(),
  interests: z.array(z.string()).optional(),
  notification_preferences: z.object({
    event_reminders: z.boolean(),
    event_updates: z.boolean(),
    new_events: z.boolean(),
    registration_updates: z.boolean(),
  }).optional(),
}).strict();
