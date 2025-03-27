import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { CustomerSignInRequestDto } from '@src/dto/customer/auth/signin.dto';
import { CustomerSignUpRequestDto } from '@src/dto/customer/auth/signup.dto';
import { CustomerAuthService } from '@src/services/customer/auth/auth.service';
import { NextFunction, Request, Response } from 'express';

export class CustomerAuthController {
  constructor(private customerAuthService: CustomerAuthService) {}

  signUp = async (
    req: Request<object, object, CustomerSignUpRequestDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.customerAuthService.signUp(req.body);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  signIn = async (
    req: Request<object, object, CustomerSignInRequestDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.customerAuthService.signIn(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await this.customerAuthService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
