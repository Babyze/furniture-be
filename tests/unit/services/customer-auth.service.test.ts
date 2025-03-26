import { UserRepository } from '@src/repositories/user.repository';
import { generateUUID } from '@src/utils/uuid.util';
import { hashPassword } from '@src/utils/password.util';
import { generateTokenPair } from '@src/utils/jwt.util';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CustomerAuthService } from '@src/services/customer/auth/auth.service';
import { CustomerSignUpRequestDto } from '@src/dto/customer/signup.dto';
import { ConflictError } from '@src/errors/http.error';

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
        username: mockSignUpData.username,
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
          username: mockSignUpData.username,
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
});
