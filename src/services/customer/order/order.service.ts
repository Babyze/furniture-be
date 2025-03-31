/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORDER_STATUS } from '@src/constant/order-status.constant';
import { TABLE_NAME } from '@src/constant/table-name.constant';
import { GetOrdersQueryDto, GetOrdersResponseDto } from '@src/dto/customer/order/get-orders.dto';
import { PlaceOrderRequestDto } from '@src/dto/customer/order/place-order.dto';
import { ConflictError } from '@src/errors/http.error';
import { Order } from '@src/models/order.model';
import { OrderItemRepository } from '@src/repositories/order-item.repository';
import { OrderRepository } from '@src/repositories/order.repository';
import { SKURepository } from '@src/repositories/sku.repository';
import mysqlPool from '@src/services/database/pool/mysql.pool';
import { RowDataPacket } from 'mysql2';

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly skuRepository: SKURepository,
  ) {}

  async placeOrder(customerId: number, placeOrderDto: PlaceOrderRequestDto): Promise<Order> {
    const connection = await mysqlPool.getConnection();
    try {
      await connection.beginTransaction();

      // Calculate total price and validate stock
      let totalPrice = 0;
      for (const item of placeOrderDto.items) {
        const [skus] = await connection.query<RowDataPacket[]>(
          `SELECT * FROM ${TABLE_NAME.SKU_TABLE} WHERE id = ?`,
          [item.skuId],
        );

        if (!skus.length) {
          throw new ConflictError(`SKU with id ${item.skuId} not found`);
        }

        const sku = skus[0];
        if (sku.quantity < item.quantity) {
          throw new ConflictError(`Insufficient stock for SKU ${item.skuId}`);
        }

        totalPrice += sku.price * item.quantity;
      }

      // Create order
      const [orderResult] = await connection.query(
        `INSERT INTO ${TABLE_NAME.ORDERS_TABLE} (customer_id, total_price, status, address, phone_number, full_name) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          customerId,
          totalPrice,
          ORDER_STATUS.PENDING,
          placeOrderDto.information.address,
          placeOrderDto.information.phoneNumber,
          placeOrderDto.information.fullName,
        ],
      );

      const orderId = (orderResult as any).insertId;

      // Create order items and update SKU quantities
      for (const item of placeOrderDto.items) {
        const [skus] = await connection.query<RowDataPacket[]>(
          `SELECT * FROM ${TABLE_NAME.SKU_TABLE} WHERE id = ?`,
          [item.skuId],
        );

        if (!skus.length) continue;

        const sku = skus[0];

        // Create order item
        await connection.query(
          `INSERT INTO ${TABLE_NAME.ORDER_ITEM_TABLE} (order_id, sku_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [orderId, item.skuId, item.quantity, sku.price],
        );

        // Update SKU quantity
        await connection.query(`UPDATE ${TABLE_NAME.SKU_TABLE} SET quantity = ? WHERE id = ?`, [
          sku.quantity - item.quantity,
          item.skuId,
        ]);
      }

      await connection.commit();

      // Get created order
      const [orders] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM ${TABLE_NAME.ORDERS_TABLE} WHERE id = ?`,
        [orderId],
      );

      return orders[0] as Order;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getOrders(customerId: number, query: GetOrdersQueryDto): Promise<GetOrdersResponseDto> {
    return this.orderRepository.getOrders({
      ...query,
      customerId,
    });
  }
}
