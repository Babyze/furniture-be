import { CUSTOMER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { CustomerAuthController } from '@src/controllers/customer/auth.controller';
import { CustomerSignUpRequestDto } from '@src/dto/customer/signup.dto';
import { CustomerSignInRequestDto } from '@src/dto/customer/signin.dto';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import express from 'express';

const router = express.Router();
const customerAuthController = new CustomerAuthController();

router.post(
  CUSTOMER_ROUTE_NAME.AUTH.SIGN_UP,
  validateRequest(CustomerSignUpRequestDto),
  customerAuthController.signUp,
);

router.post(
  CUSTOMER_ROUTE_NAME.AUTH.SIGN_IN,
  validateRequest(CustomerSignInRequestDto),
  customerAuthController.signIn,
);

export default router;
