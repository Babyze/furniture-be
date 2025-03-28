import { Product } from '@src/models/product.model';
import { BaseRepository } from './base/base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(TABLE_NAME.PRODUCT_TABLE);
  }
}
