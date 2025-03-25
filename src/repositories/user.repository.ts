import { TABLE_NAME } from '@src/constant/table-name.constant';
import { User } from '@src/models/user.model';
import { MysqlDatabase } from '@src/services/database/mysql.database';

export class UserRepository extends MysqlDatabase<User> {
  constructor() {
    super(TABLE_NAME.USER_TABLE);
  }
}
