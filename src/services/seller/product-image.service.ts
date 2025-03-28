import { BadRequestError } from '@src/errors/http.error';
import { ProductImageRepository } from '@src/repositories/product-image.repository';
import { ProductRepository } from '@src/repositories/product.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';
import mysqlPool from '../database/pool/mysql.pool';

export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async uploadProductImage(sellerId: number, productId: number, imageUrl: string): Promise<void> {
    const connection = await mysqlPool.getConnection();
    try {
      await connection.beginTransaction();
      const [products] = await connection.query(
        `SELECT * FROM ${TABLE_NAME.PRODUCT_TABLE} WHERE id = ? AND seller_id = ?`,
        [productId, sellerId],
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(products as any[]).length) {
        throw new BadRequestError('Product not found');
      }

      await connection.query(
        `INSERT INTO ${TABLE_NAME.PRODUCT_IMAGE_TABLE} (product_id, image_url) VALUES (?, ?)`,
        [productId, imageUrl],
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
