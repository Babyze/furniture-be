import { GetOrdersQueryDto, GetOrdersResponseDto } from '@src/dto/seller/order/get-orders.dto';
import { OrderRepository } from '@src/repositories/order.repository';

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getOrders(query: GetOrdersQueryDto): Promise<GetOrdersResponseDto> {
    return this.orderRepository.getOrders(query);
  }
}
