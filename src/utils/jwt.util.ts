import jwtConfig from '@src/config/jwt.config';
import jwt, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  [key: string]: unknown;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const generateTokenPair = (payload: TokenPayload): TokenPair => {
  const accessTokenOptions = {
    expiresIn: jwtConfig.JWT_EXPIRES_IN,
  } as SignOptions;

  const refreshTokenOptions = {
    expiresIn: jwtConfig.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions;

  const accessToken = jwt.sign(payload, jwtConfig.JWT_SECRET, accessTokenOptions);
  const refreshToken = jwt.sign(payload, jwtConfig.JWT_REFRESH_SECRET, refreshTokenOptions);

  return {
    accessToken,
    refreshToken,
  };
};

const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, jwtConfig.JWT_SECRET) as TokenPayload;
  } catch {
    throw new Error('Invalid or expired access token');
  }
};

const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, jwtConfig.JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
};

const decodeToken = <T>(token: string): T | null => {
  return jwt.decode(token) as T;
};

export { decodeToken, generateTokenPair, verifyAccessToken, verifyRefreshToken };
