import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { CreateProductDto } from '@src/dto/seller/product/create-product.dto';
import { GetProductsDto } from '@src/dto/seller/product/get-products.dto';
import { ProductService } from '@src/services/seller/product.service';
import { NextFunction, Request, Response } from 'express';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  createProduct = async (
    req: Request<object, object, CreateProductDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const sellerId = req.user?.id;

      const product = await this.productService.createProduct(
        sellerId,
        req.body as CreateProductDto,
      );
      res.status(HTTP_STATUS.CREATED).json(product);
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (
    req: Request<object, object, object, GetProductsDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const sellerId = req.user?.id;

      const products = await this.productService.getProducts(sellerId, req.query as GetProductsDto);
      res.status(HTTP_STATUS.OK).json(products);
    } catch (error) {
      next(error);
    }
  };
}
