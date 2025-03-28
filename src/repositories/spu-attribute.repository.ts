import { SPUAttribute } from '@src/models/spu-attribute.model';
import { BaseRepository } from './base/base.repository';
import { TABLE_NAME } from '@src/constant/table-name.constant';

export class SPUAttributeRepository extends BaseRepository<SPUAttribute> {
  constructor() {
    super(TABLE_NAME.SPU_ATTRIBUTE_TABLE);
  }
}
