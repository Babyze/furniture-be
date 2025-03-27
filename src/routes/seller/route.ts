import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import express from 'express';
import authRoute from './auth.route';
import { validateJwtMiddleware } from '@src/middlewares/validate-jwt.middleware';
import { SellerJwtService } from '@src/services/seller/auth/jwt.service';
import categoryAreaRoute from './category-area.route';
import categoryRoute from './category.route';

const router = express.Router();
const sellerJwtService = new SellerJwtService();

// Public routes
router.use(SELLER_ROUTE_NAME.AUTH.ROOT, authRoute);

// Protected routes
router.use(validateJwtMiddleware(sellerJwtService));

router.use(SELLER_ROUTE_NAME.CATEGORY_AREA.ROOT, categoryAreaRoute);
router.use(SELLER_ROUTE_NAME.CATEGORY.ROOT, categoryRoute);

export default router;
