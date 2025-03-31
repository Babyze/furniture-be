import { CategoryArea } from '@src/models/category-area.model';

export class CategoryAreaResponseDto implements Pick<CategoryArea, 'id' | 'name'> {
  constructor(
    public id: number,
    public name: string,
  ) {}
}
