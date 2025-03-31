import { CategoryArea } from '@src/models/category-area.model';
import { TABLE_NAME } from '@src/constant/table-name.constant';
import { MysqlDatabase } from '@src/services/database/mysql.database';

export class CategoryAreaRepository extends MysqlDatabase<CategoryArea> {
  constructor() {
    super(TABLE_NAME.CATEGORY_AREA_TABLE);
  }
}
