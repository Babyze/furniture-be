import express from 'express';
import { SellerAuthController } from '@src/controllers/seller/auth.controller';
import { SellerAuthService } from '@src/services/seller/auth/auth.service';
import { SellerRepository } from '@src/repositories/seller.repository';
import { SellerJwtService } from '@src/services/seller/auth/jwt.service';
import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { SellerSignInRequestDto } from '@src/dto/seller/auth/signin.dto';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import { SellerRefreshTokenRequestDto } from '@src/dto/seller/auth/refresh-token.dto';

const router = express.Router();
const sellerRepository = new SellerRepository();
const sellerJwtService = new SellerJwtService();
const sellerAuthService = new SellerAuthService(sellerRepository, sellerJwtService);
const sellerAuthController = new SellerAuthController(sellerAuthService);

router.post(
  SELLER_ROUTE_NAME.AUTH.SIGN_IN,
  validateRequest({ body: SellerSignInRequestDto }),
  sellerAuthController.signIn.bind(sellerAuthController),
);

router.post(
  SELLER_ROUTE_NAME.AUTH.REFRESH_TOKEN,
  validateRequest({ body: SellerRefreshTokenRequestDto }),
  sellerAuthController.refreshToken.bind(sellerAuthController),
);

export default router;
