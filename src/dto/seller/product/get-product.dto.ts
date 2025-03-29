import { Product } from '@src/models/product.model';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { IsNumber } from 'class-validator';

export class GetProductPathParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  productId!: number;
}

export type GetProductResponseDto = Product & {
  imageUrl: string;
};

export interface GetProductSPU {
  name: string;
  sku: GetProductSKU;
}

export interface GetProductSKU {
  price: number;
  quantity: number;
}
