import { SKU } from '@src/models/sku.model';
import { BaseRepository } from './base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class SKURepository extends BaseRepository<SKU> {
  constructor() {
    super(TABLE_NAME.SKU_TABLE);
  }
}
