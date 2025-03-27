import { CategoryAreaService } from '@src/services/category-area.service';
import { NextFunction, Request, Response } from 'express';

export class CategoryAreaController {
  constructor(private categoryAreaService: CategoryAreaService) {}

  async getCategoryAreas(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryAreas = await this.categoryAreaService.getCategoryAreas();
      res.status(200).json(categoryAreas);
    } catch (error) {
      next(error);
    }
  }
}
