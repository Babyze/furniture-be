import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { UploadProductImageRequestParamsDto } from '@src/dto/seller/product/upload-product-image.dto';
import { InternalServerError } from '@src/errors/http.error';
import { ProductImageService } from '@src/services/seller/product-image.service';
import { NextFunction, Request, Response } from 'express';

export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  uploadProductImage = async (
    req: Request<UploadProductImageRequestParamsDto, object, object>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const productId = req.params.productId;
      const sellerId = req.user?.id;
      const imageUrl = req.file?.path;

      if (!imageUrl) {
        throw new InternalServerError('Image not found');
      }

      await this.productImageService.uploadProductImage(sellerId, productId, imageUrl);
      res.status(HTTP_STATUS.CREATED).json(null);
    } catch (error) {
      next(error);
    }
  };
}
