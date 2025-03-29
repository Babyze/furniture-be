import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteProductImageRequestParamsDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  productId!: number;
}
