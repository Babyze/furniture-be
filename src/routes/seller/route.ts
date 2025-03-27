import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import express from 'express';
import authRoute from './auth.route';
import { validateJwtMiddleware } from '@src/middlewares/validate-jwt.middleware';
import { SellerJwtService } from '@src/services/seller/auth/jwt.service';

const router = express.Router();
const sellerJwtService = new SellerJwtService();

// Public routes
router.use(SELLER_ROUTE_NAME.AUTH.NAME, authRoute);

// Protected routes
router.use(validateJwtMiddleware(sellerJwtService));

// Add protected routes here

export default router;
