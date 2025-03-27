import { IBaseModel } from './base.model';

export interface ProductImage extends IBaseModel {
  productId: number;
  imageUrl: string;
}
