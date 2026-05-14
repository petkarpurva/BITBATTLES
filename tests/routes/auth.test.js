const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');

describe('Auth API Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'newuser@example.com');

      // Verify user was saved to DB
      const dbUser = await User.findOne({ email: 'newuser@example.com' });
      expect(dbUser).not.toBeNull();
      expect(dbUser.name).toBe('New User');
    });

    it('should not register a user with an existing email', async () => {
      // Create user first
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Existing',
          email: 'existing@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
