import { Category } from '@src/models/category.model';
import { BaseRepository } from './base/base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(TABLE_NAME.CATEGORY_TABLE);
  }
}
