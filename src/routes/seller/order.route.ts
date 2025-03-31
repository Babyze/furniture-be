import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { OrderController } from '@src/controllers/seller/order.controller';
import { GetOrdersQueryDto } from '@src/dto/seller/order/get-orders.dto';
import { UpdateOrderBodyDto } from '@src/dto/seller/order/update-order.dto';
import { UpdateOrderParamsDto } from '@src/dto/seller/order/update-order.dto';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import { OrderRepository } from '@src/repositories/order.repository';
import { CustomerRepository } from '@src/repositories/customer.repository';
import { OrderService } from '@src/services/seller/order/order.service';
import { MailService } from '@src/services/mail.service';
import { Router } from 'express';

const router = Router();
const orderRepository = new OrderRepository();
const customerRepository = new CustomerRepository();
const mailService = new MailService();
const orderService = new OrderService(orderRepository, customerRepository, mailService);
const orderController = new OrderController(orderService);

router.get(
  SELLER_ROUTE_NAME.ORDER.GET,
  validateRequest({ query: GetOrdersQueryDto }),
  orderController.getOrders.bind(orderController),
);

router.put(
  SELLER_ROUTE_NAME.ORDER.UPDATE,
  validateRequest({ params: UpdateOrderParamsDto, body: UpdateOrderBodyDto }),
  orderController.updateOrder.bind(orderController),
);

export default router;
