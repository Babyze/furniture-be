import { SPU } from '@src/models/spu.model';
import { BaseRepository } from './base/base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class SPURepository extends BaseRepository<SPU> {
  constructor() {
    super(TABLE_NAME.SPU_TABLE);
  }

  async getSPUsByProductId(productId: number): Promise<SPU[]> {
    const sql = [`SELECT *`, `FROM ${this.tableName}`, `WHERE product_id = ?`];
    const params = [productId];
    return this.query(sql.join(' '), params);
  }
}
