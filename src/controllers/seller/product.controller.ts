import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { CreateProductDto } from '@src/dto/seller/product/create-product.dto';
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
}
