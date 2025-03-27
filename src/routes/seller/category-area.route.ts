import { SELLER_ROUTE_NAME } from '@src/constant/route-name.constant';
import { CategoryAreaController } from '@src/controllers/category-area.controller';
import { CategoryAreaService } from '@src/services/category-area.service';
import express from 'express';
import { CategoryAreaRepository } from '@src/repositories/category-area.repository';
const router = express.Router();

const categoryAreaRepository = new CategoryAreaRepository();
const categoryAreaService = new CategoryAreaService(categoryAreaRepository);
const categoryAreaController = new CategoryAreaController(categoryAreaService);

router.get(
  SELLER_ROUTE_NAME.CATEGORY_AREA.GET,
  categoryAreaController.getCategoryAreas.bind(categoryAreaController),
);

export default router;
