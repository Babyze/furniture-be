import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UploadProductImageRequestParamsDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  productId!: number;
}
