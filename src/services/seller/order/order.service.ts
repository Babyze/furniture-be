import { ORDER_STATUS } from '@src/constant/order-status.constant';
import { GetOrdersQueryDto, GetOrdersResponseDto } from '@src/dto/seller/order/get-orders.dto';
import { UpdateOrderBodyDto, UpdateOrderParamsDto } from '@src/dto/seller/order/update-order.dto';
import { ConflictError } from '@src/errors/http.error';
import { OrderRepository } from '@src/repositories/order.repository';

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getOrders(query: GetOrdersQueryDto): Promise<GetOrdersResponseDto> {
    return this.orderRepository.getOrders(query);
  }

  async updateOrder(params: UpdateOrderParamsDto, body: UpdateOrderBodyDto): Promise<void> {
    const order = await this.orderRepository.getById(params.id);
    if (!order) {
      throw new ConflictError('Order not found');
    }

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new ConflictError('Order status cannot be updated');
    }

    await this.orderRepository.update(params.id, { status: body.status });
  }
}
