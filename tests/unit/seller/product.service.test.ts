/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ProductRepository } from '@src/repositories/product.repository';
import { SPURepository } from '@src/repositories/spu.repository';
import { SKURepository } from '@src/repositories/sku.repository';
import { SPUAttributeRepository } from '@src/repositories/spu-attribute.repository';
import { CategoryAreaRepository } from '@src/repositories/category-area.repository';
import { CreateProductDto } from '@src/dto/seller/product/create-product.dto';
import { BadRequestError } from '@src/errors/http.error';
import mysqlPool from '@src/services/database/pool/mysql.pool';
import { ProductService } from '@src/services/seller/product.service';

jest.mock('@src/services/database/pool/mysql.pool', () => ({
  getConnection: jest.fn(),
}));

describe('ProductService', () => {
  let productService: ProductService;
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
      query: jest.fn(),
    };
    (mysqlPool.getConnection as jest.Mock).mockResolvedValue(mockConnection as never);

    productService = new ProductService(
      new ProductRepository(),
      new SPURepository(),
      new SKURepository(),
      new SPUAttributeRepository(),
      new CategoryAreaRepository(),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    const mockSellerId = 1;
    const mockProductDto: CreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      measurements: '17 1/2x20 5/8',
      categoryId: 1,
      categoryAreaIds: [1, 2],
      spus: [
        {
          name: 'Test SPU',
          attributes: [
            {
              attributeName: 'Color',
              attributeValue: 'Red',
            },
          ],
          skus: [
            {
              price: 100,
              quantity: 10,
            },
          ],
        },
      ],
    };

    it('should create product successfully', async () => {
      // Mock query results
      mockConnection.query
        .mockResolvedValueOnce([{ insertId: 1 }]) // Product insert
        .mockResolvedValueOnce([{ affectedRows: 2 }]) // Category area insert
        .mockResolvedValueOnce([{ insertId: 2 }]) // SPU insert
        .mockResolvedValueOnce([{ affectedRows: 1 }]) // SPU attribute insert
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // SKU insert

      const result = await productService.createProduct(mockSellerId, mockProductDto);

      expect(result).toBe(1);
      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(mockConnection.commit).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenCalledTimes(5);
    });

    it('should rollback transaction when error occurs', async () => {
      mockConnection.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(productService.createProduct(mockSellerId, mockProductDto)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockConnection.rollback).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });
});
