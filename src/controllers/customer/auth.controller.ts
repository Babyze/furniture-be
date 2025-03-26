import { Request, Response, NextFunction } from 'express';
import { CustomerSignUpRequestDto } from '@src/dto/customer/signup.dto';
import { CustomerSignInRequestDto } from '@src/dto/customer/signin.dto';
import { CustomerAuthService } from '@src/services/customer/auth/auth.service';
import { HTTP_STATUS } from '@src/constant/http-status.constant';

export class CustomerAuthController {
  private authService: CustomerAuthService;

  constructor() {
    this.authService = new CustomerAuthService();
  }

  signUp = async (
    req: Request<object, object, CustomerSignUpRequestDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.authService.signUp(req.body);
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
      const result = await this.authService.signIn(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
