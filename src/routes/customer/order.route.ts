import { CUSTOMER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { OrderController } from '@src/controllers/customer/order.controller';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import { PlaceOrderRequestDto } from '@src/dto/customer/order/place-order.dto';
import { Router } from 'express';
import { OrderService } from '@src/services/customer/order/order.service';
import { OrderRepository } from '@src/repositories/order.repository';
import { OrderItemRepository } from '@src/repositories/order-item.repository';
import { SKURepository } from '@src/repositories/sku.repository';
import { GetOrdersQueryDto } from '@src/dto/customer/order/get-orders.dto';

const router = Router();
const orderRepository = new OrderRepository();
const orderItemRepository = new OrderItemRepository();
const skuRepository = new SKURepository();
const orderService = new OrderService(orderRepository, orderItemRepository, skuRepository);
const orderController = new OrderController(orderService);

router.post(
  CUSTOMER_ROUTE_NAME.ORDER.PLACE_ORDER,
  validateRequest({ body: PlaceOrderRequestDto }),
  orderController.placeOrder.bind(orderController),
);

router.get(
  CUSTOMER_ROUTE_NAME.ORDER.GET_ORDERS,
  validateRequest({ query: GetOrdersQueryDto }),
  orderController.getOrders.bind(orderController),
);

export default router;
