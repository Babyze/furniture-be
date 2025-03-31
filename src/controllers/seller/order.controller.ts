import { NextFunction, Request, Response } from 'express';
import { OrderService } from '@src/services/seller/order/order.service';
import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { GetOrdersQueryDto } from '@src/dto/seller/order/get-orders.dto';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  getOrders = async (
    req: Request<object, object, object, GetOrdersQueryDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const results = await this.orderService.getOrders(req.query);

      res.status(HTTP_STATUS.OK).json(results);
    } catch (error) {
      next(error);
    }
  };
}
