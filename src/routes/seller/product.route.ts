import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { ProductImageController } from '@src/controllers/seller/product-image.controller';
import { ProductController } from '@src/controllers/seller/product.controller';
import { CreateProductDto } from '@src/dto/seller/product/create-product.dto';
import { UploadProductImageRequestParamsDto } from '@src/dto/seller/product/upload-product-image.dto';
import { GetProductsRequestQueryDto } from '@src/dto/seller/product/get-products.dto';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import { CategoryAreaRepository } from '@src/repositories/category-area.repository';
import { ProductImageRepository } from '@src/repositories/product-image.repository';
import { ProductRepository } from '@src/repositories/product.repository';
import { SKURepository } from '@src/repositories/sku.repository';
import { SPUAttributeRepository } from '@src/repositories/spu-attribute.repository';
import { SPURepository } from '@src/repositories/spu.repository';
import { ProductImageService } from '@src/services/seller/product-image.service';
import { ProductService } from '@src/services/seller/product.service';
import { Router } from 'express';
import { upload } from '@src/middlewares/upload.middleware';

const router = Router();

const productRepository = new ProductRepository();
const spuRepository = new SPURepository();
const skuRepository = new SKURepository();
const spuAttributeRepository = new SPUAttributeRepository();
const categoryAreaRepository = new CategoryAreaRepository();
const productImageRepository = new ProductImageRepository();

const productService = new ProductService(
  productRepository,
  spuRepository,
  skuRepository,
  spuAttributeRepository,
  categoryAreaRepository,
);

const productImageService = new ProductImageService(productImageRepository, productRepository);

const productController = new ProductController(productService);
const productImageController = new ProductImageController(productImageService);

router.post(
  SELLER_ROUTE_NAME.PRODUCT.CREATE,
  validateRequest({ body: CreateProductDto }),
  productController.createProduct.bind(productController),
);

router.put(
  `${SELLER_ROUTE_NAME.PRODUCT.IMAGES}`,
  validateRequest({ params: UploadProductImageRequestParamsDto }),
  upload.single('image'),
  productImageController.uploadProductImage.bind(productImageController),
);

router.get(
  SELLER_ROUTE_NAME.PRODUCT.GET,
  validateRequest({ query: GetProductsRequestQueryDto }),
  productController.getProducts.bind(productController),
);

export default router;
