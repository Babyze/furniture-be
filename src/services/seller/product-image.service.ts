import { TABLE_NAME } from '@src/constant/table-name.constant';
import { BadRequestError } from '@src/errors/http.error';
import { ProductImageRepository } from '@src/repositories/product-image.repository';
import { ProductRepository } from '@src/repositories/product.repository';
import { RowDataPacket } from 'mysql2';
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

      // 1. Check if product exists and belongs to seller
      const [products] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM ${TABLE_NAME.PRODUCT_TABLE} WHERE id = ? AND seller_id = ?`,
        [productId, sellerId],
      );

      if (!products.length) {
        throw new BadRequestError('Product not found');
      }

      // 2. Check if product image exists
      const [productImages] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM ${TABLE_NAME.PRODUCT_IMAGE_TABLE} WHERE product_id = ?`,
        [productId],
      );

      if (productImages.length > 0) {
        // 3. Update existing product image
        for (const productImage of productImages) {
          await connection.query(
            `UPDATE ${TABLE_NAME.PRODUCT_IMAGE_TABLE} 
            SET image_url = ? 
            WHERE product_id = ? AND id = ?`,
            [imageUrl, productId, productImage.id],
          );
        }
      } else {
        // 4. Create new product image
        await connection.query(
          `INSERT INTO ${TABLE_NAME.PRODUCT_IMAGE_TABLE} 
          (product_id, image_url) 
          VALUES (?, ?)`,
          [productId, imageUrl],
        );
      }

      await connection.commit();
    } catch (error) {
      console.log(error);
      await connection.rollback();
      throw new BadRequestError(`Failed to upload product image ${error}`);
    } finally {
      connection.release();
    }
  }

  async deleteProductImage(sellerId: number, productId: number): Promise<void> {
    const connection = await mysqlPool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Check if product exists and belongs to seller
      const [products] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM ${TABLE_NAME.PRODUCT_TABLE} WHERE id = ? AND seller_id = ?`,
        [productId, sellerId],
      );

      if (!products.length) {
        throw new BadRequestError('Product not found');
      }

      // 2. Check if product image exists
      const [productImages] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM ${TABLE_NAME.PRODUCT_IMAGE_TABLE} WHERE product_id = ?`,
        [productId],
      );

      if (!productImages.length) {
        throw new BadRequestError('Product image not found');
      }

      // 3. Delete product image
      await connection.query(`DELETE FROM ${TABLE_NAME.PRODUCT_IMAGE_TABLE} WHERE product_id = ?`, [
        productId,
      ]);

      await connection.commit();
    } catch (error) {
      console.log(error);
      await connection.rollback();
      throw new BadRequestError(`Failed to delete product image ${error}`);
    } finally {
      connection.release();
    }
  }
}
