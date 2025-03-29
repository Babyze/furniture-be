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
import { BadRequestError } from '@src/errors/http.error';
import { CategoryAreaRepository } from '@src/repositories/category-area.repository';
import { ProductRepository } from '@src/repositories/product.repository';
import { SKURepository } from '@src/repositories/sku.repository';
import { SPUAttributeRepository } from '@src/repositories/spu-attribute.repository';
import { SPURepository } from '@src/repositories/spu.repository';
import mysqlPool from '../database/pool/mysql.pool';

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
    return this.productRepository.getProducts(sellerId, getProductsDto);
  }

  async getProduct(
    sellerId: number,
    getProductDto: GetProductPathParamsDto,
  ): Promise<GetProductResponseDto> {
    return this.productRepository.getProduct(sellerId, getProductDto);
  }
}
