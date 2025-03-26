import { beforeEach, describe, expect, it } from '@jest/globals';
import {
  decodeToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
} from '@src/utils/jwt.util';

describe('JWT Utils', () => {
  const testPayload = {
    id: '123',
    email: 'test@example.com',
  };

  let tokenPair: { accessToken: string; refreshToken: string };

  describe('generateTokenPair', () => {
    it('should generate valid access and refresh tokens', () => {
      tokenPair = generateTokenPair(testPayload);

      expect(tokenPair).toHaveProperty('accessToken');
      expect(tokenPair).toHaveProperty('refreshToken');
      expect(typeof tokenPair.accessToken).toBe('string');
      expect(typeof tokenPair.refreshToken).toBe('string');
      expect(tokenPair.accessToken).not.toBe(tokenPair.refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    beforeEach(() => {
      tokenPair = generateTokenPair(testPayload);
    });

    it('should verify valid access token', () => {
      const decoded = verifyAccessToken(tokenPair.accessToken);
      expect(decoded).toMatchObject(testPayload);
    });

    it('should throw error for invalid access token', () => {
      expect(() => verifyAccessToken('invalid-token')).toThrow('Invalid or expired access token');
    });

    it('should throw error when using refresh token as access token', () => {
      expect(() => verifyAccessToken(tokenPair.refreshToken)).toThrow(
        'Invalid or expired access token',
      );
    });
  });

  describe('verifyRefreshToken', () => {
    beforeEach(() => {
      tokenPair = generateTokenPair(testPayload);
    });

    it('should verify valid refresh token', () => {
      const decoded = verifyRefreshToken(tokenPair.refreshToken);
      expect(decoded).toMatchObject(testPayload);
    });

    it('should throw error for invalid refresh token', () => {
      expect(() => verifyRefreshToken('invalid-token')).toThrow('Invalid or expired refresh token');
    });

    it('should throw error when using access token as refresh token', () => {
      expect(() => verifyRefreshToken(tokenPair.accessToken)).toThrow(
        'Invalid or expired refresh token',
      );
    });
  });

  describe('decodeToken', () => {
    beforeEach(() => {
      tokenPair = generateTokenPair(testPayload);
    });

    it('should decode valid token without verification', () => {
      const decoded = decodeToken(tokenPair.accessToken);
      expect(decoded).toMatchObject(testPayload);
    });

    it('should return null for invalid token', () => {
      const decoded = decodeToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });
});
