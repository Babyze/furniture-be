import { CUSTOMER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { ProductController } from '@src/controllers/customer/product.controller';
import { SPUController } from '@src/controllers/customer/spu.controller';
import { GetProductsQueryDto } from '@src/dto/customer/product/get-products.dto';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import { ProductRepository } from '@src/repositories/product.repository';
import { SPURepository } from '@src/repositories/spu.repository';
import { SKURepository } from '@src/repositories/sku.repository';
import { ProductService } from '@src/services/customer/product/product.service';
import { SPUService } from '@src/services/customer/spu/spu.service';
import express from 'express';

const router = express.Router();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const spuRepository = new SPURepository();
const skuRepository = new SKURepository();
const spuService = new SPUService(spuRepository, skuRepository);
const spuController = new SPUController(spuService);

router.get(
  CUSTOMER_ROUTE_NAME.PRODUCT.GET,
  validateRequest({ query: GetProductsQueryDto }),
  productController.getProducts.bind(productController),
);

router.get(
  CUSTOMER_ROUTE_NAME.PRODUCT.GET_DETAIL,
  productController.getProduct.bind(productController),
);

router.get(CUSTOMER_ROUTE_NAME.PRODUCT.GET_DETAIL_SPUS, spuController.getSPUs.bind(spuController));

export default router;
