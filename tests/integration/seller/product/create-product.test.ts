import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { BadRequestError } from '@src/errors/http.error';
import request from 'supertest';
import app from '@src/server';
import { ProductService } from '@src/services/seller/product.service';
import { SellerJwtService } from '@src/services/seller/auth/jwt.service';

jest.mock('@src/services/seller/product.service');
jest.mock('@src/services/seller/auth/jwt.service');

describe('Seller Product API', () => {
  beforeAll(() => {
    (ProductService.prototype.createProduct as jest.Mock).mockImplementation(async () => ({
      productId: 1,
    }));
    (SellerJwtService.prototype.verifyAccessToken as jest.Mock).mockImplementation(async () => ({
      id: '123',
      email: 'test@example.com',
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/seller/products', () => {
    const validProductData = {
      name: 'Test Product',
      description: 'Test Description',
      measurements: '10x20x30',
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

    it('should create product successfully with valid data', async () => {
      const response = await request(app)
        .post('/api/seller/products')
        .set('Authorization', 'Bearer mock-token')
        .send(validProductData)
        .expect(HTTP_STATUS.CREATED);

      expect(response.body.data).toEqual({
        productId: 1,
      });
    });

    it('should return bad request when required fields are missing', async () => {
      const invalidProductData = {
        name: 'Test Product',
        categoryId: 1,
      };

      await request(app)
        .post('/api/seller/products')
        .set('Authorization', 'Bearer mock-token')
        .send(invalidProductData)
        .expect(HTTP_STATUS.BAD_REQUEST);
    });

    it('should return bad request when service fails', async () => {
      (ProductService.prototype.createProduct as jest.Mock).mockRejectedValueOnce(
        new BadRequestError('Failed to create product') as unknown as never,
      );

      await request(app)
        .post('/api/seller/products')
        .set('Authorization', 'Bearer mock-token')
        .send(validProductData)
        .expect(HTTP_STATUS.BAD_REQUEST);
    });
  });
});
