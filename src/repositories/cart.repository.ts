import { Cart } from '@src/models/cart.model';
import { BaseRepository } from './base/base.repository';

export class CartRepository extends BaseRepository<Cart> {
  constructor() {
    super('cart');
  }
}
