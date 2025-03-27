import { Category } from '@src/models/category.model';

export class CategoryResponseDto implements Pick<Category, 'id' | 'name'> {
  constructor(
    public id: string,
    public name: string,
  ) {}
}
