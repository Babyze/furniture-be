import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { ConflictError } from '@src/errors/http.error';
import app from '@src/server';
import { CustomerAuthService } from '@src/services/customer/auth/auth.service';
import request from 'supertest';

jest.mock('@src/repositories/user.repository');
jest.mock('@src/services/customer/auth/auth.service');

describe('Customer Auth API', () => {
  beforeAll(() => {
    (CustomerAuthService.prototype.signUp as jest.Mock).mockImplementation(async () => ({
      id: 'test-id',
      fullName: 'Test User',
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/customer/auth/signup', () => {
    const validSignUpData = {
      email: 'test@example.com',
      fullName: 'Test User',
      username: 'testuser',
      password: 'password123',
    };

    it('should create new user successfully', async () => {
      const response = await request(app)
        .post('/api/customer/auth/signup')
        .send(validSignUpData)
        .expect(HTTP_STATUS.CREATED);

      expect(response.body).toEqual({
        success: true,
        data: {
          id: 'test-id',
          fullName: 'Test User',
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      });
    });

    it('should not create user if email exists', async () => {
      (CustomerAuthService.prototype.signUp as jest.Mock).mockRejectedValueOnce(
        new ConflictError('Email or username already exists') as unknown as never,
      );

      await request(app)
        .post('/api/customer/auth/signup')
        .send(validSignUpData)
        .expect(HTTP_STATUS.CONFLICT);
    });
  });
});
