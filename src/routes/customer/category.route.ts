import { CUSTOMER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { CategoryController } from '@src/controllers/customer/category.controller';
import { CategoryRepository } from '@src/repositories/category.repository';
import { CategoryService } from '@src/services/category.service';
import express from 'express';

const router = express.Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.get(
  CUSTOMER_ROUTE_NAME.CATEGORY.GET,
  categoryController.getCategories.bind(categoryController),
);

export default router;
