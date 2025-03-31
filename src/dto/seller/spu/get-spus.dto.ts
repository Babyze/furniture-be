import { SKU } from '@src/models/sku.model';
import { SPU } from '@src/models/spu.model';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetSPUsRequestParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  productId!: number;
}

export type GetSPUsResponseDto = Pick<SPU, 'name'> &
  Pick<SKU, 'price' | 'quantity'> & {
    id: number;
    skuId: number;
  };
