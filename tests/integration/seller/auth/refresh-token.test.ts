import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UnauthorizedError } from '@src/errors/http.error';
import app from '@src/server';
import { SellerAuthService } from '@src/services/seller/auth/auth.service';
import { SellerJwtService } from '@src/services/seller/auth/jwt.service';
import supertest from 'supertest';

jest.mock('@src/services/seller/auth/auth.service');
jest.mock('@src/repositories/seller.repository');

describe('POST /api/seller/auth/refresh-token', () => {
  let sellerJwtService: SellerJwtService;
  const request = supertest(app);
  const mockUser = {
    id: 1,
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sellerJwtService = new SellerJwtService();
  });

  it('should return new access token when refresh token is valid', async () => {
    const { refreshToken } = sellerJwtService.generateTokenPair(mockUser);
    const mockResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    (SellerAuthService.prototype.refreshToken as jest.Mock).mockResolvedValue(
      mockResponse as unknown as never,
    );

    const response = await request.post('/api/seller/auth/refresh-token').send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockResponse);
  });

  it('should return 401 when refresh token is invalid', async () => {
    (SellerAuthService.prototype.refreshToken as jest.Mock).mockRejectedValue(
      new UnauthorizedError('Invalid refresh token') as unknown as never,
    );

    const response = await request
      .post('/api/seller/auth/refresh-token')
      .send({ refreshToken: 'invalid-token' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid refresh token');
  });

  it('should return 400 when refresh token is missing', async () => {
    const response = await request.post('/api/seller/auth/refresh-token').send({});

    expect(response.status).toBe(400);
  });
});
