import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { GetProductParamsDto } from '@src/dto/customer/product/get-product.dto';
import { GetProductsQueryDto } from '@src/dto/customer/product/get-products.dto';
import { ProductService } from '@src/services/customer/product/product.service';
import { NextFunction, Request, Response } from 'express';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  getProducts = async (
    req: Request<object, object, object, GetProductsQueryDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const hostname = `${req.protocol}://${req.headers.host ?? ''}`;
      const products = await this.productService.getProducts(req.query, hostname);
      res.status(HTTP_STATUS.OK).json(products);
    } catch (error) {
      next(error);
    }
  };

  getProduct = async (
    req: Request<GetProductParamsDto, object, object, object>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const hostname = `${req.protocol}://${req.headers.host ?? ''}`;
      const product = await this.productService.getProduct(req.params.id, hostname);
      res.status(HTTP_STATUS.OK).json(product);
    } catch (error) {
      next(error);
    }
  };
}
