import { SPU } from '@src/models/spu.model';
import { BaseRepository } from './base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class SPURepository extends BaseRepository<SPU> {
  constructor() {
    super(TABLE_NAME.SPU_TABLE);
  }
}
