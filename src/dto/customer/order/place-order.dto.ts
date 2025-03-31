import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class OrderInformationDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;
}

export class OrderItemDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  productId!: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  spuId!: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  skuId!: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  quantity!: number;
}

export class PlaceOrderRequestDto {
  @ValidateNested()
  @Type(() => OrderInformationDto)
  @IsNotEmpty()
  information!: OrderInformationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items!: OrderItemDto[];
}
