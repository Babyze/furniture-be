import { CUSTOMER_ROUTE_NAME } from '@src/constant/route-name.constant';
import express from 'express';
import authRoute from './auth.route';
import productRoute from './product.route';
import categoryRoute from './category.route';
import orderRoute from './order.route';
import { validateJwtMiddleware } from '@src/middlewares/validate-jwt.middleware';
import { CustomerJwtService } from '@src/services/customer/auth/jwt.service';

const router = express.Router();
const customerJwtService = new CustomerJwtService();

router.use(CUSTOMER_ROUTE_NAME.AUTH.ROOT, authRoute);
router.use(CUSTOMER_ROUTE_NAME.PRODUCT.ROOT, productRoute);
router.use(CUSTOMER_ROUTE_NAME.CATEGORY.ROOT, categoryRoute);

// Protected routes
router.use(validateJwtMiddleware(customerJwtService));
router.use(CUSTOMER_ROUTE_NAME.ORDER.ROOT, orderRoute);

export default router;
