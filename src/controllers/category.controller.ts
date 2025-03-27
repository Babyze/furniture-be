import { CategoryService } from '@src/services/category.service';
import { NextFunction, Request, Response } from 'express';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await this.categoryService.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}
