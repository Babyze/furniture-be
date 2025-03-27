import { CartItem } from '@src/models/cart-item.model';
import { BaseRepository } from './base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class CartItemRepository extends BaseRepository<CartItem> {
  constructor() {
    super(TABLE_NAME.CART_ITEM_TABLE);
  }
}
