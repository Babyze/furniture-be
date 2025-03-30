import { PaginationDto, PaginationResult } from '@src/dto/common/pagination.dto';
import { Product } from '@src/models/product.model';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { IsOptional } from 'class-validator';

export class GetProductsQueryDto extends PaginationDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

export type GetProductItemResponseDto = Pick<
  Product,
  'id' | 'name' | 'price' | 'categoryId' | 'categoryAreaId'
> & {
  imageUrl: string;
  minPrice: number;
  maxPrice: number;
  stock: number;
};

export type GetProductsResponseDto = PaginationResult<GetProductItemResponseDto>;
