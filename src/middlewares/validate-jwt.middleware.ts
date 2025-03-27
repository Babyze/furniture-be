import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@src/errors/http.error';
import { JwtService } from '@src/services/jwt/jwt.service';

export const validateJwtMiddleware = (jwtService: JwtService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedError('No token provided');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedError('Invalid token format');
      }

      const decoded = jwtService.verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
