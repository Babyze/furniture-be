import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { CategoryController } from '@src/controllers/category.controller';
import { CategoryService } from '@src/services/category.service';
import express from 'express';
import { CategoryRepository } from '@src/repositories/category.repository';
const router = express.Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.get(
  SELLER_ROUTE_NAME.CATEGORY.GET,
  categoryController.getCategories.bind(categoryController),
);

export default router;
