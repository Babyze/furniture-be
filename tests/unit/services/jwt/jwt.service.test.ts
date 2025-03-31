import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UnauthorizedError } from '@src/errors/http.error';
import { JwtService } from '@src/services/jwt/jwt.service';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('CustomerJwtService', () => {
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService('secret', 'refreshSecret', '1h', '24h');
    jest.clearAllMocks();
  });

  describe('generateTokenPair', () => {
    it('should generate access token and refresh token', () => {
      const mockPayload = {
        id: 1,
        email: 'test@example.com',
      };

      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';

      (jwt.sign as jest.Mock)
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const result = jwtService.generateTokenPair(mockPayload);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token successfully', () => {
      const mockToken = 'mock-refresh-token';
      const mockDecoded = {
        id: '123',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567890 + 3600,
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const result = jwtService.verifyRefreshToken(mockToken);

      expect(result).toEqual(mockDecoded);
    });

    it('should throw UnauthorizedError when token is invalid', () => {
      const mockToken = 'invalid-token';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError();
      });

      expect(() => jwtService.verifyRefreshToken(mockToken)).toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError when token is expired', () => {
      const mockToken = 'expired-token';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError();
      });

      expect(() => jwtService.verifyRefreshToken(mockToken)).toThrow(UnauthorizedError);
    });
  });
});
