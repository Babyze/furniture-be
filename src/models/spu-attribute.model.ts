import { IBaseModel } from './base.model';

export interface SPUAttribute extends IBaseModel {
  spuId: number;
  attributeName: string;
  attributeValue: string;
}
