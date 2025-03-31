import { Product } from '@src/models/product.model';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetProductParamsDto {
  @Type(() => Number)
  @IsNumber()
  id!: number;
}

export type GetProductResponseDto = Pick<
  Product,
  'id' | 'name' | 'price' | 'description' | 'measurements'
> & {
  imageUrl: string;
  categoryName: string;
  categoryAreaName: string;
};
