import { IBaseModel } from './base.model';

export interface SKU extends IBaseModel {
  price: number;
  quantity: number;
  spuId: number;
}
