import { IBaseModel } from './base.model';

export interface OrderItem extends IBaseModel {
  orderId: number;
  skuId: number;
  quantity: number;
  price: number;
}
