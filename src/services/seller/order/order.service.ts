import { ORDER_STATUS } from '@src/constant/order-status.constant';
import { GetOrdersQueryDto, GetOrdersResponseDto } from '@src/dto/seller/order/get-orders.dto';
import { UpdateOrderBodyDto, UpdateOrderParamsDto } from '@src/dto/seller/order/update-order.dto';
import { ConflictError } from '@src/errors/http.error';
import { CustomerRepository } from '@src/repositories/customer.repository';
import { OrderRepository } from '@src/repositories/order.repository';
import { MailService } from '@src/services/mail.service';

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly mailService: MailService,
  ) {}

  async getOrders(query: GetOrdersQueryDto): Promise<GetOrdersResponseDto> {
    return this.orderRepository.getOrders(query);
  }

  async updateOrder(params: UpdateOrderParamsDto, body: UpdateOrderBodyDto): Promise<void> {
    const order = await this.orderRepository.getById(params.id);
    if (!order) {
      throw new ConflictError('Order not found');
    }
    const customer = await this.customerRepository.getById(order.customerId);

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new ConflictError('Order status cannot be updated');
    }

    if (customer) {
      const statusSubject = body.status === ORDER_STATUS.CONFIRMED ? 'Completed' : 'Cancelled';
      this.mailService.sendmail({
        to: customer.email,
        subject: `[Furniture Store] Your Order Has Been ${statusSubject}`,
        text: `Your order #${order.id} has been ${statusSubject}`,
      });
    }

    await this.orderRepository.update(params.id, { status: body.status });
  }
}
