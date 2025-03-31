import { SKU } from '@src/models/sku.model';
import { BaseRepository } from './base/base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class SKURepository extends BaseRepository<SKU> {
  constructor() {
    super(TABLE_NAME.SKU_TABLE);
  }

  async getSKUBySPUId(spuId: number): Promise<SKU | null> {
    const sql = [`SELECT *`, `FROM ${TABLE_NAME.SKU_TABLE}`, `WHERE spu_id = ?`];
    const params = [spuId];

    const sku = await this.query(sql.join(' '), params);

    return sku[0] ? sku[0] : null;
  }
}
