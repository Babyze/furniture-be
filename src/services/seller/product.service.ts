import { TABLE_NAME } from '@src/constant/table-name.constant';
import {
  CreateProductDto,
  CreateProductResponseDto,
} from '@src/dto/seller/product/create-product.dto';
import { GetProductsDto } from '@src/dto/seller/product/get-products.dto';
import { BadRequestError } from '@src/errors/http.error';
import { CategoryAreaRepository } from '@src/repositories/category-area.repository';
import { ProductRepository } from '@src/repositories/product.repository';
import { SKURepository } from '@src/repositories/sku.repository';
import { SPUAttributeRepository } from '@src/repositories/spu-attribute.repository';
import { SPURepository } from '@src/repositories/spu.repository';
import { Product } from '@src/models/product.model';
import mysqlPool from '../database/pool/mysql.pool';
import { PaginationResult } from '@src/dto/common/pagination.dto';

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
        (name, description, measurements, category_id, seller_id) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          createProductDto.name,
          createProductDto.description,
          createProductDto.measurements,
          createProductDto.categoryId,
          sellerId,
        ],
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productId = (productResult as any).insertId;

      // 2. Create product category areas
      const productCategoryAreaValues = createProductDto.categoryAreaIds.map((categoryAreaId) => ({
        productId: productId,
        categoryAreaId: categoryAreaId,
      }));
      await connection.query(
        `INSERT INTO ${TABLE_NAME.PRODUCT_CATEGORY_AREA_TABLE} 
        (product_id, category_area_id) 
        VALUES ?`,
        [productCategoryAreaValues.map((v) => [v.productId, v.categoryAreaId])],
      );

      // 3. Create SPUs, SKUs and SPU Attributes
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

        // Create SPU Attributes
        const spuAttributeValues = spuDto.attributes.map((attr) => ({
          spuId: spuId,
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue,
        }));
        await connection.query(
          `INSERT INTO ${TABLE_NAME.SPU_ATTRIBUTE_TABLE} 
          (spu_id, attribute_name, attribute_value) 
          VALUES ?`,
          [spuAttributeValues.map((v) => [v.spuId, v.attributeName, v.attributeValue])],
        );

        // Create SKUs
        const skuValues = spuDto.skus.map((sku) => ({
          spuId: spuId,
          price: sku.price,
          quantity: sku.quantity,
        }));
        await connection.query(
          `INSERT INTO ${TABLE_NAME.SKU_TABLE} 
          (spu_id, price, quantity) 
          VALUES ?`,
          [skuValues.map((v) => [v.spuId, v.price, v.quantity])],
        );
      }

      await connection.commit();
      return {
        productId,
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
    getProductsDto: GetProductsDto,
  ): Promise<PaginationResult<Product>> {
    return this.productRepository.getProducts(sellerId, getProductsDto);
  }
}
