import { CUSTOMER_ROUTE_NAME } from '@src/constant/route-name.constant';
import express from 'express';
import authRoute from './auth.route';
import productRoute from './product.route';
import categoryRoute from './category.route';
const router = express.Router();

router.use(CUSTOMER_ROUTE_NAME.AUTH.ROOT, authRoute);
router.use(CUSTOMER_ROUTE_NAME.PRODUCT.ROOT, productRoute);
router.use(CUSTOMER_ROUTE_NAME.CATEGORY.ROOT, categoryRoute);

export default router;
