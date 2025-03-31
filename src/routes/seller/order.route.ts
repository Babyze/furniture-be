import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { OrderController } from '@src/controllers/seller/order.controller';
import { GetOrdersQueryDto } from '@src/dto/seller/order/get-orders.dto';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import { OrderRepository } from '@src/repositories/order.repository';
import { OrderService } from '@src/services/seller/order/order.service';
import { Router } from 'express';

const router = Router();
const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

router.get(
  SELLER_ROUTE_NAME.ORDER.GET,
  validateRequest({ query: GetOrdersQueryDto }),
  orderController.getOrders.bind(orderController),
);

export default router;
