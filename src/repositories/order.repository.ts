import { Order } from '@src/models/order.model';
import { BaseRepository } from './base/base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';
import { PaginationDto, PaginationResult } from '@src/dto/common/pagination.dto';

export interface GetOrdersFilter extends PaginationDto {
  customerId?: number;
}
export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(TABLE_NAME.ORDERS_TABLE);
  }

  async getOrders(getOrdersFilter: GetOrdersFilter): Promise<PaginationResult<Order>> {
    const sql = [`SELECT * FROM ${this.tableName}`];
    if (getOrdersFilter.customerId) {
      sql.push('WHERE customer_id = ?');
    }
    const params = [];
    if (getOrdersFilter.customerId) {
      params.push(getOrdersFilter.customerId);
    }

    sql.push('ORDER BY created_date DESC');

    const items = await this.getPaginatedItems(getOrdersFilter, sql, params);
    const totalItems = await this.getTotalItems(sql, params);

    return this.paginate(items, totalItems, getOrdersFilter);
  }
}
