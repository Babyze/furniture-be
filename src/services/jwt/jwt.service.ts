import { UnauthorizedError } from '@src/errors/http.error';
import jwt, { SignOptions } from 'jsonwebtoken';

export class JwtService {
  private accessSecret: string;
  private refreshSecret: string;
  private accessExpiresIn: string;
  private refreshExpiresIn: string;

  constructor(
    accessSecret: string,
    refreshSecret: string,
    accessExpiresIn: string,
    refreshExpiresIn: string,
  ) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
    this.accessExpiresIn = accessExpiresIn;
    this.refreshExpiresIn = refreshExpiresIn;
  }

  generateTokenPair(payload: TokenPayload): TokenPair {
    const accessTokenOptions = {
      expiresIn: this.accessExpiresIn,
    } as SignOptions;

    const refreshTokenOptions = {
      expiresIn: this.refreshExpiresIn,
    } as SignOptions;

    const accessToken = jwt.sign(payload, this.accessSecret, accessTokenOptions);
    const refreshToken = jwt.sign(payload, this.refreshSecret, refreshTokenOptions);

    return {
      accessToken,
      refreshToken,
    };
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.accessSecret) as TokenPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as TokenPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  decodeToken<T>(token: string): T | null {
    return jwt.decode(token) as T;
  }
}

export interface TokenPayload {
  id: number;
  email: string;
  [key: string]: unknown;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
