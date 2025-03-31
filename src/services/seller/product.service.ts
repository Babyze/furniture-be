import { TABLE_NAME } from '@src/constant/table-name.constant';
import {
  CreateProductDto,
  CreateProductResponseDto,
} from '@src/dto/seller/product/create-product.dto';
import {
  GetProductPathParamsDto,
  GetProductResponseDto,
} from '@src/dto/seller/product/get-product.dto';
import {
  GetProductsRequestQueryDto,
  GetProductsResponseDto,
} from '@src/dto/seller/product/get-products.dto';
import {
  UpdateProductDto,
  UpdateProductResponseDto,
} from '@src/dto/seller/product/update-product.dto';
import { BadRequestError } from '@src/errors/http.error';
import { CategoryAreaRepository } from '@src/repositories/category-area.repository';
import { ProductRepository } from '@src/repositories/product.repository';
import { SKURepository } from '@src/repositories/sku.repository';
import { SPUAttributeRepository } from '@src/repositories/spu-attribute.repository';
import { SPURepository } from '@src/repositories/spu.repository';
import mysqlPool from '../database/pool/mysql.pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly spuRepository: SPURepository,
    private readonly skuRepository: SKURepository,
    private readonly spuAttributeRepository: SPUAttributeRepository,
    private readonly categoryAreaRepository: CategoryAreaRepository,
  ) {}

  async createProduct(
    sellerId: number,
    createProductDto: CreateProductDto,
  ): Promise<CreateProductResponseDto> {
    const connection = await mysqlPool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Create product
      const [productResult] = await connection.query(
        `INSERT INTO ${TABLE_NAME.PRODUCT_TABLE} 
        (name, description, measurements, category_id, category_area_id, seller_id) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          createProductDto.name,
          createProductDto.description,
          createProductDto.measurements,
          createProductDto.categoryId,
          createProductDto.categoryAreaId,
          sellerId,
        ],
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productId = (productResult as any).insertId;

      // 2. Create SPUs, SKUs
      for (const spuDto of createProductDto.spus) {
        // Create SPU
        const [spuResult] = await connection.query(
          `INSERT INTO ${TABLE_NAME.SPU_TABLE} 
          (name, product_id) 
          VALUES (?, ?)`,
          [spuDto.name, productId],
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spuId = (spuResult as any).insertId;

        await connection.query(
          `INSERT INTO ${TABLE_NAME.SKU_TABLE} 
          (spu_id, price, quantity) 
          VALUES (?, ?, ?)`,
          [spuId, spuDto.price, spuDto.quantity],
        );
      }

      await connection.commit();
      return {
        id: productId,
      };
    } catch (error) {
      console.log(error);
      await connection.rollback();
      throw new BadRequestError(`Failed to create product ${error}`);
    } finally {
      connection.release();
    }
  }

  async getProducts(
    sellerId: number,
    getProductsDto: GetProductsRequestQueryDto,
  ): Promise<GetProductsResponseDto> {
    return this.productRepository.getProducts(getProductsDto, sellerId);
  }

  async getProduct(
    sellerId: number,
    getProductDto: GetProductPathParamsDto,
  ): Promise<GetProductResponseDto> {
    return this.productRepository.getProduct({
      sellerId,
      productId: getProductDto.productId,
    });
  }

  async updateProduct(
    sellerId: number,
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateProductResponseDto> {
    const connection = await mysqlPool.getConnection();
    try {
      await connection.beginTransaction();

      // 0. Check if product exists
      const [products] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM ${TABLE_NAME.PRODUCT_TABLE} WHERE id = ? AND seller_id = ?`,
        [productId, sellerId],
      );

      if (!products.length) {
        throw new BadRequestError('Product not found');
      }

      // 1. Update product
      await connection.query(
        `UPDATE ${TABLE_NAME.PRODUCT_TABLE} 
        SET name = ?, description = ?, measurements = ?, category_id = ?, category_area_id = ?
        WHERE id = ? AND seller_id = ?`,
        [
          updateProductDto.name,
          updateProductDto.description,
          updateProductDto.measurements,
          updateProductDto.categoryId,
          updateProductDto.categoryAreaId,
          productId,
          sellerId,
        ],
      );

      // 2. Get existing SPUs
      const [existingSPUs] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM ${TABLE_NAME.SPU_TABLE} WHERE product_id = ?`,
        [productId],
      );

      // 3. Update or create SPUs and SKUs
      for (let i = 0; i < updateProductDto.spus.length; i++) {
        const spuDto = updateProductDto.spus[i];
        let spuId: number;

        if (i < existingSPUs.length) {
          // Update existing SPU
          spuId = existingSPUs[i].id;
          await connection.query(`UPDATE ${TABLE_NAME.SPU_TABLE} SET name = ? WHERE id = ?`, [
            spuDto.name,
            spuId,
          ]);
        } else {
          // Create new SPU
          const [spuResult] = await connection.query<ResultSetHeader>(
            `INSERT INTO ${TABLE_NAME.SPU_TABLE} (name, product_id) VALUES (?, ?)`,
            [spuDto.name, productId],
          );
          spuId = spuResult.insertId;
        }

        // Update or create SKU
        const [existingSKUs] = await connection.query<RowDataPacket[]>(
          `SELECT id FROM ${TABLE_NAME.SKU_TABLE} WHERE spu_id = ?`,
          [spuId],
        );

        if (existingSKUs.length > 0) {
          // Update existing SKU
          await connection.query(
            `UPDATE ${TABLE_NAME.SKU_TABLE} 
            SET price = ?, quantity = ? 
            WHERE spu_id = ?`,
            [spuDto.price, spuDto.quantity, spuId],
          );
        } else {
          // Create new SKU
          await connection.query(
            `INSERT INTO ${TABLE_NAME.SKU_TABLE} 
            (spu_id, price, quantity) 
            VALUES (?, ?, ?)`,
            [spuId, spuDto.price, spuDto.quantity],
          );
        }
      }

      // 4. Delete extra SPUs if any
      if (existingSPUs.length > updateProductDto.spus.length) {
        await connection.query(
          `DELETE FROM ${TABLE_NAME.SPU_TABLE} 
          WHERE product_id = ? AND id NOT IN (?)`,
          [productId, existingSPUs.slice(0, updateProductDto.spus.length).map((spu) => spu.id)],
        );
      }

      await connection.commit();
      return {
        id: Number(productId),
      };
    } catch (error) {
      console.log(error);
      await connection.rollback();
      throw new BadRequestError(`Failed to update product ${error}`);
    } finally {
      connection.release();
    }
  }
}
