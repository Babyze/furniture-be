import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { CategoryService } from '@src/services/category.service';
import { NextFunction, Request, Response } from 'express';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  getCategories = async (
    req: Request<object, object, object, object>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const categories = await this.categoryService.getCategories();
      res.status(HTTP_STATUS.OK).json(categories);
    } catch (error) {
      next(error);
    }
  };
}
