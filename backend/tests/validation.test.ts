import request from 'supertest';
import app from '../src/app';
import { createEventSchema } from '../src/schemas/events.schema';
import { registerProfileSchema } from '../src/schemas/auth.schema';

describe('API Security and Schema Validation', () => {
  it('should return 404 for unknown endpoints', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid auth registration bodies via Zod schema', () => {
    const result = registerProfileSchema.safeParse({
      email: 'not-an-email',
      displayName: 'A', // too short
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid auth registration schema', () => {
    const result = registerProfileSchema.safeParse({
      email: 'student@campus.edu',
      displayName: 'Valid Name',
      collegeId: '123e4567-e89b-12d3-a456-426614174000',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid event creation bodies without required fields', () => {
    const result = createEventSchema.safeParse({
      title: 'Only a title',
    });
    expect(result.success).toBe(false);
  });

  it('should reject unauthorized access to protected endpoints without Bearer token', async () => {
    const res = await request(app).post('/api/events').send({
      title: 'Hackathon',
    });
    expect(res.status).toBe(401);
  });
});
