import { Order } from '@src/models/order.model';
import { BaseRepository } from './base/base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(TABLE_NAME.ORDERS_TABLE);
  }
}
