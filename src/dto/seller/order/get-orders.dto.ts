import { PaginationDto, PaginationResult } from '@src/dto/common/pagination.dto';
import { Order } from '@src/models/order.model';

export class GetOrdersQueryDto extends PaginationDto {}

export type GetOrderItemResponseDto = Order;

export type GetOrdersResponseDto = PaginationResult<GetOrderItemResponseDto>;
