import { TABLE_NAME } from '@src/constant/table-name.constant';
import { GetProductsRequestQueryDto } from '@src/dto/seller/product/get-products.dto';
import { Product, ProductWithStock } from '@src/models/product.model';
import { BaseRepository } from './base/base.repository';
import { PaginationResult } from '@src/dto/common/pagination.dto';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(TABLE_NAME.PRODUCT_TABLE);
  }

  async getProducts(
    sellerId: number,
    getProductsDto: GetProductsRequestQueryDto,
  ): Promise<PaginationResult<ProductWithStock>> {
    const sql = [
      `SELECT p.*, stock_table.stock, c.name as category_name, ca.name as category_area_name`,
      `FROM ${this.tableName} p LEFT JOIN`,
      `(
            SELECT sp.product_id, SUM(sk.quantity) AS stock
            FROM spu sp
            INNER JOIN sku sk ON sp.id = sk.spu_id
            GROUP BY sp.product_id
        )`,
      'AS stock_table ON p.id = stock_table.product_id',
      `INNER JOIN ${TABLE_NAME.CATEGORY_TABLE} c ON p.category_id = c.id`,
      `INNER JOIN ${TABLE_NAME.CATEGORY_AREA_TABLE} ca ON p.category_area_id = ca.id`,
      'WHERE seller_id = ?',
    ];
    const params = [sellerId];

    if (getProductsDto.categoryId) {
      sql.push('AND p.category_id = ?');
      params.push(getProductsDto.categoryId);
    }

    if (getProductsDto.categoryAreaId) {
      sql.push('AND p.category_area_id = ?');
      params.push(getProductsDto.categoryAreaId);
    }

    const items = (await this.getPaginatedItems(getProductsDto, sql, params)) as ProductWithStock[];

    const totalItems = await this.getTotalItems(sql, params);

    return this.paginate(items, totalItems, getProductsDto);
  }
}
