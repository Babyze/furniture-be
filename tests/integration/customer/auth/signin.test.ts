import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { UnauthorizedError } from '@src/errors/http.error';
import { CustomerAuthService } from '@src/services/customer/auth/auth.service';
import app from '@src/server';
import request from 'supertest';

jest.mock('@src/services/customer/auth/auth.service');

describe('Customer Auth API', () => {
  beforeAll(() => {
    (CustomerAuthService.prototype.signIn as jest.Mock).mockImplementation(async () => ({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/customer/auth/signin', () => {
    const validSignInData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return tokens when credentials are valid', async () => {
      const response = await request(app)
        .post('/api/customer/auth/signin')
        .send(validSignInData)
        .expect(HTTP_STATUS.OK);

      expect(response.body).toEqual({
        success: true,
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      });
    });

    it('should return unauthorized when credentials are invalid', async () => {
      (CustomerAuthService.prototype.signIn as jest.Mock).mockRejectedValueOnce(
        new UnauthorizedError('Invalid login information') as unknown as never,
      );

      const response = await request(app)
        .post('/api/customer/auth/signin')
        .send(validSignInData)
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(response.body).toEqual({
        success: false,
        message: 'Invalid login information',
      });
    });
  });
});
