import { TABLE_NAME } from '@src/constant/table-name.constant';
import { PaginationDto, PaginationResult } from '@src/dto/common/pagination.dto';
import {
  GetProductPathParamsDto,
  GetProductResponseDto,
} from '@src/dto/seller/product/get-product.dto';
import { NotFoundError } from '@src/errors/http.error';
import { Product, ProductWithStock } from '@src/models/product.model';
import { BaseRepository } from './base/base.repository';

export interface GetProductsFilter extends PaginationDto {
  categoryId?: number;
  categoryAreaId?: number;
}

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(TABLE_NAME.PRODUCT_TABLE);
  }

  async getProducts(
    getProductsFiltersDto: GetProductsFilter,
    sellerId?: number,
  ): Promise<PaginationResult<ProductWithStock>> {
    const sql = [
      `SELECT p.*, CAST(stock_table.stock AS UNSIGNED) AS stock, CAST(stock_table.min_price AS UNSIGNED) AS min_price, CAST(stock_table.max_price AS UNSIGNED) AS max_price, c.name as category_name, ca.name as category_area_name, pi.image_url`,
      `FROM ${this.tableName} p LEFT JOIN`,
      `(
            SELECT sp.product_id, SUM(sk.quantity) AS stock, MIN(sk.price) AS min_price, MAX(sk.price) AS max_price
            FROM spu sp
            INNER JOIN sku sk ON sp.id = sk.spu_id
            GROUP BY sp.product_id
        )`,
      'AS stock_table ON p.id = stock_table.product_id ',
      `LEFT JOIN ${TABLE_NAME.CATEGORY_TABLE} c ON p.category_id = c.id`,
      `LEFT JOIN ${TABLE_NAME.CATEGORY_AREA_TABLE} ca ON p.category_area_id = ca.id`,
    ];
    sql.push(`LEFT JOIN ${TABLE_NAME.PRODUCT_IMAGE_TABLE} pi ON p.id = pi.product_id`);
    const whereSql = ['WHERE'];
    const params = [];
    if (sellerId) {
      whereSql.push('p.seller_id = ?');
      params.push(sellerId);
    }

    if (getProductsFiltersDto.categoryId) {
      if (whereSql.length > 1) {
        whereSql.push('AND');
      }
      whereSql.push('p.category_id = ?');
      params.push(getProductsFiltersDto.categoryId);
    }

    if (getProductsFiltersDto.categoryAreaId) {
      if (whereSql.length > 1) {
        whereSql.push('AND');
      }
      whereSql.push('p.category_area_id = ?');
      params.push(getProductsFiltersDto.categoryAreaId);
    }

    if (whereSql.length > 1) {
      sql.push(whereSql.join(' '));
    }

    sql.push(`ORDER BY p.id DESC`);

    const items = (await this.getPaginatedItems(
      getProductsFiltersDto,
      sql,
      params,
    )) as ProductWithStock[];

    const totalItems = await this.getTotalItems(sql, params);

    return this.paginate(items, totalItems, getProductsFiltersDto);
  }

  async getProduct(
    sellerId: number,
    getProductDto: GetProductPathParamsDto,
  ): Promise<GetProductResponseDto> {
    const sql = [
      `SELECT p.*, pi.image_url`,
      `FROM ${this.tableName} p`,
      `LEFT JOIN ${TABLE_NAME.PRODUCT_IMAGE_TABLE} pi ON p.id = pi.product_id`,
      `WHERE p.seller_id = ?`,
      `AND p.id = ?`,
    ];
    const params = [sellerId, getProductDto.productId];

    const product = (await this.query(sql.join(' '), params))[0];

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product as GetProductResponseDto;
  }
}
