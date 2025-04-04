import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CustomerSignInRequestDto } from '@src/dto/customer/auth/signin.dto';
import { CustomerSignUpRequestDto } from '@src/dto/customer/auth/signup.dto';
import { ConflictError, UnauthorizedError } from '@src/errors/http.error';
import { CustomerRepository } from '@src/repositories/customer.repository';
import { CustomerAuthService } from '@src/services/customer/auth/auth.service';
import { CustomerJwtService } from '@src/services/customer/auth/jwt.service';
import { comparePassword, hashPassword } from '@src/utils/password.util';
import { generateUUID } from '@src/utils/uuid.util';
import dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';

jest.mock('@src/repositories/customer.repository');
jest.mock('@src/utils/uuid.util');
jest.mock('@src/utils/password.util');
jest.mock('@src/services/customer/auth/jwt.service');

describe('CustomerAuthService', () => {
  let customerAuthService: CustomerAuthService;
  let customerRepository: jest.Mocked<CustomerRepository>;
  let customerJwtService: jest.Mocked<CustomerJwtService>;

  beforeEach(() => {
    jest.clearAllMocks();
    customerJwtService = new CustomerJwtService() as jest.Mocked<CustomerJwtService>;
    customerJwtService.generateTokenPair = jest.fn();
    customerJwtService.verifyRefreshToken = jest.fn();
    customerJwtService.verifyAccessToken = jest.fn();

    customerRepository = new CustomerRepository() as jest.Mocked<CustomerRepository>;
    customerRepository.query = jest.fn();
    customerRepository.insert = jest.fn();

    customerAuthService = new CustomerAuthService(customerRepository, customerJwtService);
  });

  describe('signUp', () => {
    const mockSignUpData: CustomerSignUpRequestDto = {
      email: 'test@example.com',
      fullName: 'Test User',
      password: 'password123',
    };

    const mockUserId = 1;
    const mockHashedPassword = 'hashedPassword123';
    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };

    beforeEach(() => {
      (generateUUID as jest.Mock).mockReturnValue(mockUserId);
      (hashPassword as jest.Mock).mockImplementation(async () => mockHashedPassword);
      (customerJwtService.generateTokenPair as jest.Mock).mockReturnValue(mockTokens);
    });

    it('should create new user and return tokens', async () => {
      customerRepository.query.mockResolvedValue([]);
      customerRepository.insert.mockResolvedValue({
        id: mockUserId,
        email: mockSignUpData.email,
        password: mockHashedPassword,
        fullName: mockSignUpData.fullName,
        isAgreeAllPolicy: true,
        createdDate: dayjs(),
        updatedDate: dayjs(),
      });

      const result = await customerAuthService.signUp(mockSignUpData);

      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        user: {
          id: mockUserId,
          fullName: mockSignUpData.fullName,
          email: mockSignUpData.email,
        },
      });
    });

    it('should throw error if user exists', async () => {
      customerRepository.query.mockResolvedValue([
        {
          id: mockUserId,
          email: mockSignUpData.email,
          password: mockHashedPassword,
          fullName: mockSignUpData.fullName,
          isAgreeAllPolicy: true,
          createdDate: dayjs(),
          updatedDate: dayjs(),
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

    const mockUserId = 1;
    const mockHashedPassword = 'hashedPassword123';
    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };

    beforeEach(() => {
      (customerJwtService.generateTokenPair as jest.Mock).mockReturnValue(mockTokens);
    });

    it('should return tokens when credentials are valid', async () => {
      customerRepository.query.mockResolvedValue([
        {
          id: mockUserId,
          email: mockSignInData.email,
          password: mockHashedPassword,
          fullName: 'Test User',
          isAgreeAllPolicy: true,
          createdDate: dayjs(),
          updatedDate: dayjs(),
        },
      ]);

      (comparePassword as jest.Mock).mockResolvedValue(true as unknown as never);

      const result = await customerAuthService.signIn(mockSignInData);

      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        user: {
          id: mockUserId,
          fullName: 'Test User',
          email: mockSignInData.email,
        },
      });
    });

    it('should throw error when user not found', async () => {
      customerRepository.query.mockResolvedValue([]);

      await expect(customerAuthService.signIn(mockSignInData)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw error when password is invalid', async () => {
      customerRepository.query.mockResolvedValue([
        {
          id: mockUserId,
          email: mockSignInData.email,
          password: mockHashedPassword,
          fullName: 'Test User',
          isAgreeAllPolicy: true,
          createdDate: dayjs(),
          updatedDate: dayjs(),
        },
      ]);

      (comparePassword as jest.Mock).mockResolvedValue(false as unknown as never);

      await expect(customerAuthService.signIn(mockSignInData)).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        fullName: 'Test User',
        isAgreeAllPolicy: true,
        createdDate: dayjs(),
        updatedDate: dayjs(),
      };

      const mockDecodedToken = {
        id: 1,
        email: 'test@example.com',
      };

      const mockNewTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      (customerJwtService.verifyRefreshToken as jest.Mock).mockReturnValue(mockDecodedToken);
      customerRepository.getById.mockResolvedValue(mockUser);
      (customerJwtService.generateTokenPair as jest.Mock).mockReturnValue(mockNewTokens);

      const result = await customerAuthService.refreshToken('valid-refresh-token');

      expect(result).toEqual({
        accessToken: mockNewTokens.accessToken,
        refreshToken: 'valid-refresh-token',
      });
      expect(customerJwtService.verifyRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(customerRepository.getById).toHaveBeenCalledWith(mockDecodedToken.id);
      expect(customerJwtService.generateTokenPair).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedError when refresh token is invalid', async () => {
      (customerJwtService.verifyRefreshToken as jest.Mock).mockImplementation(() => {
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

      (customerJwtService.verifyRefreshToken as jest.Mock).mockReturnValue(mockDecodedToken);
      customerRepository.getById.mockResolvedValue(null);

      await expect(customerAuthService.refreshToken('valid-token')).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });
});
