import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UnauthorizedError } from '@src/errors/http.error';
import app from '@src/server';
import { CustomerAuthService } from '@src/services/customer/auth/auth.service';
import { generateTokenPair } from '@src/utils/jwt.util';
import supertest from 'supertest';

jest.mock('@src/services/customer/auth/auth.service');
jest.mock('@src/repositories/user.repository');

describe('POST /api/customer/auth/refresh-token', () => {
  const request = supertest(app);
  const mockUser = {
    id: '123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return new access token when refresh token is valid', async () => {
    const { refreshToken } = generateTokenPair(mockUser);
    const mockResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    (CustomerAuthService.prototype.refreshToken as jest.Mock).mockResolvedValue(
      mockResponse as unknown as never,
    );

    const response = await request.post('/api/customer/auth/refresh-token').send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockResponse);
  });

  it('should return 401 when refresh token is invalid', async () => {
    (CustomerAuthService.prototype.refreshToken as jest.Mock).mockRejectedValue(
      new UnauthorizedError('Invalid refresh token') as unknown as never,
    );

    const response = await request
      .post('/api/customer/auth/refresh-token')
      .send({ refreshToken: 'invalid-token' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid refresh token');
  });

  it('should return 400 when refresh token is missing', async () => {
    const response = await request.post('/api/customer/auth/refresh-token').send({});

    expect(response.status).toBe(400);
  });
});
