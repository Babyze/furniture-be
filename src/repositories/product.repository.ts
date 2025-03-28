import { TABLE_NAME } from '@src/constant/table-name.constant';
import { GetProductsDto } from '@src/dto/seller/product/get-products.dto';
import { Product } from '@src/models/product.model';
import { BaseRepository } from './base/base.repository';
import { PaginationResult } from '@src/dto/common/pagination.dto';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(TABLE_NAME.PRODUCT_TABLE);
  }

  async getProducts(
    sellerId: number,
    getProductsDto: GetProductsDto,
  ): Promise<PaginationResult<Product>> {
    const sql = [`SELECT * FROM ${this.tableName}`, 'WHERE seller_id = ?', 'ORDER BY id DESC'];
    const params = [sellerId];

    const items = await this.getPaginatedItems(getProductsDto, sql, params);

    const totalItems = await this.getTotalItems(sql, params);

    return this.paginate(items, totalItems, getProductsDto);
  }
}
