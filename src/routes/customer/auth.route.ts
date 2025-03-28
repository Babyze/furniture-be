import { CUSTOMER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { CustomerAuthController } from '@src/controllers/customer/auth.controller';
import { CustomerSignUpRequestDto } from '@src/dto/customer/auth/signup.dto';
import { CustomerSignInRequestDto } from '@src/dto/customer/auth/signin.dto';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import express from 'express';
import { CustomerAuthService } from '@src/services/customer/auth/auth.service';
import { CustomerRepository } from '@src/repositories/customer.repository';
import { CustomerJwtService } from '@src/services/customer/auth/jwt.service';
import { CustomerRefreshTokenRequestDto } from '@src/dto/customer/auth/refresh-token.dto';

const router = express.Router();
const customerRepository = new CustomerRepository();
const customerJwtService = new CustomerJwtService();
const customerAuthService = new CustomerAuthService(customerRepository, customerJwtService);
const customerAuthController = new CustomerAuthController(customerAuthService);

router.post(
  CUSTOMER_ROUTE_NAME.AUTH.SIGN_UP,
  validateRequest({ body: CustomerSignUpRequestDto }),
  customerAuthController.signUp.bind(customerAuthController),
);

router.post(
  CUSTOMER_ROUTE_NAME.AUTH.SIGN_IN,
  validateRequest({ body: CustomerSignInRequestDto }),
  customerAuthController.signIn.bind(customerAuthController),
);

router.post(
  CUSTOMER_ROUTE_NAME.AUTH.REFRESH_TOKEN,
  validateRequest({ body: CustomerRefreshTokenRequestDto }),
  customerAuthController.refreshToken.bind(customerAuthController),
);

export default router;
