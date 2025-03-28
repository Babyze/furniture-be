import { PaginationDto, PaginationResult } from '@src/dto/common/pagination.dto';
import { ProductWithStock } from '@src/models/product.model';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetProductsRequestQueryDto extends PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  categoryAreaId?: number;
}

export type GetProductsResponseDto = PaginationResult<ProductWithStock>;
