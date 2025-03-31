import { NextFunction, Request, Response } from 'express';
import { OrderService } from '@src/services/customer/order/order.service';
import { PlaceOrderRequestDto } from '@src/dto/customer/order/place-order.dto';
import { HTTP_STATUS } from '@src/constant/http-status.constant';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  placeOrder = async (
    req: Request<object, object, object, object>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const customerId = req.user?.id;
      const placeOrderDto = req.body as PlaceOrderRequestDto;
      await this.orderService.placeOrder(customerId, placeOrderDto);

      res.status(HTTP_STATUS.CREATED).json({
        message: 'Order placed successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
