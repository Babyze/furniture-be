import { IBaseModel } from './base.model';

export interface Product extends IBaseModel {
  name: string;
  description: string;
  price: number;
  measurements: string;
  sellerId: number;
  categoryId: number;
  categoryAreaId: number;
}

export interface ProductWithStock extends Product {
  stock: number;
  imageUrl: string;
  minPrice: number;
  maxPrice: number;
}
