import { ProductImage } from '@src/models/product-image.model';
import { BaseRepository } from './base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class ProductImageRepository extends BaseRepository<ProductImage> {
  constructor() {
    super(TABLE_NAME.PRODUCT_IMAGE_TABLE);
  }
}
