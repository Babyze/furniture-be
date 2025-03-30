import { CustomerRefreshTokenResponseDto } from '@src/dto/customer/auth/refresh-token.dto';
import {
  CustomerSignInRequestDto,
  CustomerSignInResponseDto,
} from '@src/dto/customer/auth/signin.dto';
import {
  CustomerSignUpRequestDto,
  CustomerSignUpResponseDto,
} from '@src/dto/customer/auth/signup.dto';
import { ConflictError, UnauthorizedError } from '@src/errors/http.error';
import { Customer } from '@src/models/customer.model';
import { CustomerRepository } from '@src/repositories/customer.repository';
import { comparePassword, hashPassword } from '@src/utils/password.util';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { CustomerJwtService } from './jwt.service';

export class CustomerAuthService {
  private customerRepository: CustomerRepository;
  private customerJwtService: CustomerJwtService;

  constructor(customerRepository: CustomerRepository, customerJwtService: CustomerJwtService) {
    this.customerRepository = customerRepository;
    this.customerJwtService = customerJwtService;
  }

  async signUp(signUpDto: CustomerSignUpRequestDto): Promise<CustomerSignUpResponseDto> {
    const users = await this.customerRepository.query(
      'SELECT * FROM user WHERE email = ? OR username = ?',
      [signUpDto.email, signUpDto.username],
    );

    if (users.length > 0) {
      throw new ConflictError('Email or username already exists');
    }

    const hashedPassword = await hashPassword(signUpDto.password);

    const newUser: Omit<Customer, 'id'> = {
      email: signUpDto.email,
      password: hashedPassword,
      fullName: signUpDto.fullName,
      isAgreeAllPolicy: true,
      createdDate: dayjs(),
      updatedDate: dayjs(),
    };

    const createdUser = await this.customerRepository.insert(newUser);

    const { accessToken, refreshToken } = this.customerJwtService.generateTokenPair({
      id: createdUser.id,
      email: createdUser.email,
    });

    return new CustomerSignUpResponseDto(
      createdUser.id,
      createdUser.fullName,
      accessToken,
      refreshToken,
    );
  }

  async signIn(signInDto: CustomerSignInRequestDto): Promise<CustomerSignInResponseDto> {
    const users = await this.customerRepository.query('SELECT * FROM user WHERE email = ?', [
      signInDto.email,
    ]);

    if (users.length === 0) {
      throw new UnauthorizedError('Invalid login information');
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(signInDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid login information');
    }

    const { accessToken, refreshToken } = this.customerJwtService.generateTokenPair({
      id: user.id,
      email: user.email,
    });

    return new CustomerSignInResponseDto(accessToken, refreshToken);
  }

  async refreshToken(refreshToken: string): Promise<CustomerRefreshTokenResponseDto> {
    try {
      const decoded = this.customerJwtService.verifyRefreshToken(refreshToken);

      const user = await this.customerRepository.getById(decoded.id);

      if (!user) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const newAccessToken = this.customerJwtService.generateTokenPair({
        id: user.id,
        email: user.email,
      });

      return {
        accessToken: newAccessToken.accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      throw error;
    }
  }
}
