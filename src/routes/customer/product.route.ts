import { CUSTOMER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { ProductController } from '@src/controllers/customer/product.controller';
import { GetProductsQueryDto } from '@src/dto/customer/product/get-products.dto';
import { validateRequest } from '@src/middlewares/validate-request.middleware';
import { ProductRepository } from '@src/repositories/product.repository';
import { ProductService } from '@src/services/customer/product/product.service';
import express from 'express';

const router = express.Router();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.get(
  CUSTOMER_ROUTE_NAME.PRODUCT.GET,
  validateRequest({ query: GetProductsQueryDto }),
  productController.getProducts.bind(productController),
);

export default router;
