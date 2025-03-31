import { ORDER_STATUS } from '@src/constant/order-status.constant';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOrderParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id!: number;
}

export class UpdateOrderBodyDto {
  @IsEnum(ORDER_STATUS)
  @IsNotEmpty()
  status!: ORDER_STATUS;
}
