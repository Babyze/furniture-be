import { CUSTOMER_ROUTE_NAME } from '@src/constant/route-name.constant';
import express from 'express';
import authRoute from './auth.route';

const router = express.Router();

router.use(CUSTOMER_ROUTE_NAME.AUTH.ROOT, authRoute);

export default router;
