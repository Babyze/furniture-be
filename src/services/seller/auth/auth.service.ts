import { TABLE_NAME } from '@src/constant/table-name.constant';
import { SellerSignInRequestDto, SellerSignInResponseDto } from '@src/dto/seller/auth/signin.dto';
import { UnauthorizedError } from '@src/errors/http.error';
import { SellerRepository } from '@src/repositories/seller.repository';
import { comparePassword } from '@src/utils/password.util';
import { SellerJwtService } from './jwt.service';
import { SellerRefreshTokenResponseDto } from '@src/dto/seller/auth/refresh-token.dto';
import { SellerRefreshTokenRequestDto } from '@src/dto/seller/auth/refresh-token.dto';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';

export class SellerAuthService {
  private sellerRepository: SellerRepository;
  private sellerJwtService: SellerJwtService;

  constructor(sellerRepository: SellerRepository, sellerJwtService: SellerJwtService) {
    this.sellerRepository = sellerRepository;
    this.sellerJwtService = sellerJwtService;
  }

  async signIn(signInDto: SellerSignInRequestDto): Promise<SellerSignInResponseDto> {
    const users = await this.sellerRepository.query(
      `SELECT * FROM ${TABLE_NAME.SELLER_TABLE} WHERE email = ?`,
      [signInDto.email],
    );

    if (users.length === 0) {
      throw new UnauthorizedError('Invalid login information');
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(signInDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid login information');
    }

    const { accessToken, refreshToken } = this.sellerJwtService.generateTokenPair({
      id: user.id,
      email: user.email,
    });

    return new SellerSignInResponseDto(
      accessToken,
      refreshToken,
      lodash.pick(user, ['id', 'email', 'fullName']),
    );
  }

  async refreshToken(
    payload: SellerRefreshTokenRequestDto,
  ): Promise<SellerRefreshTokenResponseDto> {
    try {
      const decoded = this.sellerJwtService.verifyRefreshToken(payload.refreshToken);

      const user = await this.sellerRepository.getById(decoded.id);

      if (!user) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const newAccessToken = this.sellerJwtService.generateTokenPair({
        id: user.id,
        email: user.email,
      });

      return {
        accessToken: newAccessToken.accessToken,
        refreshToken: payload.refreshToken,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      throw error;
    }
  }
}
