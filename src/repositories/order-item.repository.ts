import { OrderItem } from '@src/models/order-item.model';
import { BaseRepository } from './base/base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor() {
    super(TABLE_NAME.ORDER_ITEM_TABLE);
  }
}
