import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { GetOrdersQueryDto } from '@src/dto/seller/order/get-orders.dto';
import { UpdateOrderBodyDto, UpdateOrderParamsDto } from '@src/dto/seller/order/update-order.dto';
import { OrderService } from '@src/services/seller/order/order.service';
import { NextFunction, Request, Response } from 'express';

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

  updateOrder = async (
    req: Request<UpdateOrderParamsDto, object, UpdateOrderBodyDto, object>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const results = await this.orderService.updateOrder(req.params, req.body);

      res.status(HTTP_STATUS.OK).json(results);
    } catch (error) {
      next(error);
    }
  };
}
