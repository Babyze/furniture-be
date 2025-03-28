import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { ProductController } from '@src/controllers/seller/product.controller';
import { CreateProductDto } from '@src/dto/seller/product/create-product.dto';
import { validateJwtMiddleware } from '@src/middlewares/validate-jwt.middleware';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import { CategoryAreaRepository } from '@src/repositories/category-area.repository';
import { ProductRepository } from '@src/repositories/product.repository';
import { SKURepository } from '@src/repositories/sku.repository';
import { SPUAttributeRepository } from '@src/repositories/spu-attribute.repository';
import { SPURepository } from '@src/repositories/spu.repository';
import { SellerJwtService } from '@src/services/seller/auth/jwt.service';
import { ProductService } from '@src/services/seller/product.service';
import { Router } from 'express';

const router = Router();

const sellerJwtService = new SellerJwtService();
const productRepository = new ProductRepository();
const spuRepository = new SPURepository();
const skuRepository = new SKURepository();
const spuAttributeRepository = new SPUAttributeRepository();
const categoryAreaRepository = new CategoryAreaRepository();

const productService = new ProductService(
  productRepository,
  spuRepository,
  skuRepository,
  spuAttributeRepository,
  categoryAreaRepository,
);

const productController = new ProductController(productService);

router.post(
  SELLER_ROUTE_NAME.PRODUCT.CREATE,
  validateJwtMiddleware(sellerJwtService),
  validateRequest(CreateProductDto),
  productController.createProduct.bind(productController),
);

export default router;
