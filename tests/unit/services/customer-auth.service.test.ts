import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CustomerSignInRequestDto } from '@src/dto/customer/auth/signin.dto';
import { CustomerSignUpRequestDto } from '@src/dto/customer/auth/signup.dto';
import { ConflictError, UnauthorizedError } from '@src/errors/http.error';
import { UserRepository } from '@src/repositories/user.repository';
import { CustomerAuthService } from '@src/services/customer/auth/auth.service';
import { generateTokenPair, verifyRefreshToken } from '@src/utils/jwt.util';
import { comparePassword, hashPassword } from '@src/utils/password.util';
import { generateUUID } from '@src/utils/uuid.util';
import * as jwt from 'jsonwebtoken';

jest.mock('@src/repositories/user.repository');
jest.mock('@src/utils/uuid.util');
jest.mock('@src/utils/password.util');
jest.mock('@src/utils/jwt.util');

describe('CustomerAuthService', () => {
  let customerAuthService: CustomerAuthService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userRepository.query = jest.fn();
    userRepository.insert = jest.fn();

    customerAuthService = new CustomerAuthService();
    customerAuthService['userRepository'] = userRepository;
  });

  describe('signUp', () => {
    const mockSignUpData: CustomerSignUpRequestDto = {
      email: 'test@example.com',
      fullName: 'Test User',
      username: 'testuser',
      password: 'password123',
    };

    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
    const mockHashedPassword = 'hashedPassword123';
    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };

    beforeEach(() => {
      (generateUUID as jest.Mock).mockReturnValue(mockUserId);
      (hashPassword as jest.Mock).mockImplementation(async () => mockHashedPassword);
      (generateTokenPair as jest.Mock).mockReturnValue(mockTokens);
    });

    it('should create new user and return tokens', async () => {
      userRepository.query.mockResolvedValue([]);
      userRepository.insert.mockResolvedValue({
        id: mockUserId,
        email: mockSignUpData.email,
        password: mockHashedPassword,
        fullName: mockSignUpData.fullName,
        isAgreeAllPolicy: true,
        createdDate: new Date(),
        updatedDate: new Date(),
      });

      const result = await customerAuthService.signUp(mockSignUpData);

      expect(result).toEqual({
        id: mockUserId,
        fullName: mockSignUpData.fullName,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
      });
    });

    it('should throw error if user exists', async () => {
      userRepository.query.mockResolvedValue([
        {
          id: mockUserId,
          email: mockSignUpData.email,
          password: mockHashedPassword,
          fullName: mockSignUpData.fullName,
          isAgreeAllPolicy: true,
          createdDate: new Date(),
          updatedDate: new Date(),
        },
      ]);

      await expect(customerAuthService.signUp(mockSignUpData)).rejects.toThrow(ConflictError);
    });
  });

  describe('signIn', () => {
    const mockSignInData: CustomerSignInRequestDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
    const mockHashedPassword = 'hashedPassword123';
    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };

    beforeEach(() => {
      (generateTokenPair as jest.Mock).mockReturnValue(mockTokens);
    });

    it('should return tokens when credentials are valid', async () => {
      userRepository.query.mockResolvedValue([
        {
          id: mockUserId,
          email: mockSignInData.email,
          password: mockHashedPassword,
          fullName: 'Test User',
          isAgreeAllPolicy: true,
          createdDate: new Date(),
          updatedDate: new Date(),
        },
      ]);

      (comparePassword as jest.Mock).mockResolvedValue(true as unknown as never);

      const result = await customerAuthService.signIn(mockSignInData);

      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
      });
    });

    it('should throw error when user not found', async () => {
      userRepository.query.mockResolvedValue([]);

      await expect(customerAuthService.signIn(mockSignInData)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw error when password is invalid', async () => {
      userRepository.query.mockResolvedValue([
        {
          id: mockUserId,
          email: mockSignInData.email,
          password: mockHashedPassword,
          fullName: 'Test User',
          isAgreeAllPolicy: true,
          createdDate: new Date(),
          updatedDate: new Date(),
        },
      ]);

      (comparePassword as jest.Mock).mockResolvedValue(false as unknown as never);

      await expect(customerAuthService.signIn(mockSignInData)).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        fullName: 'Test User',
        isAgreeAllPolicy: true,
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      const mockDecodedToken = {
        id: '123',
        email: 'test@example.com',
      };

      const mockNewTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      (verifyRefreshToken as jest.Mock).mockReturnValue(mockDecodedToken);
      userRepository.getById.mockResolvedValue(mockUser);
      (generateTokenPair as jest.Mock).mockReturnValue(mockNewTokens);

      const result = await customerAuthService.refreshToken('valid-refresh-token');

      expect(result).toEqual({
        accessToken: mockNewTokens.accessToken,
        refreshToken: 'valid-refresh-token',
      });
      expect(verifyRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(userRepository.getById).toHaveBeenCalledWith(mockDecodedToken.id);
      expect(generateTokenPair).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedError when refresh token is invalid', async () => {
      (verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await expect(customerAuthService.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('should throw UnauthorizedError when user not found', async () => {
      const mockDecodedToken = {
        id: '123',
        email: 'test@example.com',
      };

      (verifyRefreshToken as jest.Mock).mockReturnValue(mockDecodedToken);
      userRepository.getById.mockResolvedValue(null);

      await expect(customerAuthService.refreshToken('valid-token')).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });
});
