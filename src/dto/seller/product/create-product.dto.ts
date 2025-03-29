import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateSPUDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsObject()
  @Type(() => CreateSKUDto)
  sku!: CreateSKUDto;
}

export class CreateSKUDto {
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;
}

export class CreateProductDto {
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
  @Type(() => CreateSPUDto)
  @IsNotEmpty()
  spus!: CreateSPUDto[];
}

export class CreateProductResponseDto {
  constructor(public readonly id: number) {}
}
