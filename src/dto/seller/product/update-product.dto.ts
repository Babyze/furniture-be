import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateProductParamsDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;
}

export class UpdateSPUDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price!: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  quantity!: number;
}

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  measurements?: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  categoryId!: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  categoryAreaId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSPUDto)
  @IsNotEmpty()
  spus!: UpdateSPUDto[];
}

export class UpdateProductResponseDto {
  constructor(public readonly id: number) {}
}
