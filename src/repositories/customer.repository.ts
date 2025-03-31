import { TABLE_NAME } from '@src/constant/table-name.constant';
import { Customer } from '@src/models/customer.model';
import { MysqlDatabase } from '@src/services/database/mysql.database';

export class CustomerRepository extends MysqlDatabase<Customer> {
  constructor() {
    super(TABLE_NAME.CUSTOMER_TABLE);
  }
}
