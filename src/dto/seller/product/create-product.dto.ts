import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSPUAttributeDto {
  @IsString()
  @IsNotEmpty()
  attributeName!: string;

  @IsString()
  @IsNotEmpty()
  attributeValue!: string;
}

export class CreateSPUDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSPUAttributeDto)
  attributes!: CreateSPUAttributeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSKUDto)
  skus!: CreateSKUDto[];
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
  @IsNotEmpty()
  categoryId!: number;

  @IsNumber()
  @IsNotEmpty()
  categoryAreaId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSPUDto)
  @IsNotEmpty()
  spus!: CreateSPUDto[];
}

export class CreateProductResponseDto {
  constructor(public readonly productId: number) {}
}
