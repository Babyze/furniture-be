import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { SellerSignInRequestDto } from '@src/dto/seller/auth/signin.dto';
import { SellerAuthService } from '@src/services/seller/auth/auth.service';
import { NextFunction, Request, Response } from 'express';

export class SellerAuthController {
  constructor(private sellerAuthService: SellerAuthService) {}

  signIn = async (
    req: Request<object, object, SellerSignInRequestDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.sellerAuthService.signIn(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
