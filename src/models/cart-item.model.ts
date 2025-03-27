import { IBaseModel } from './base.model';

export interface CartItem extends IBaseModel {
  cartId: number;
  skuId: number;
  quantity: number;
}
