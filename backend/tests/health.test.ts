import request from 'supertest';
import app from '../src/app';

describe('Health Check API', () => {
  it('should return 200 OK and healthy status', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.timestamp).toBeDefined();
    expect(response.body.message).toBe('Server is healthy');
  });
});
