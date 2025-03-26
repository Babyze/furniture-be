import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import express from 'express';
import authRoute from './auth.route';

const router = express.Router();

router.use(SELLER_ROUTE_NAME.AUTH.NAME, authRoute);

export default router;
