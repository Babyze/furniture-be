import { ORDER_STATUS } from '@src/constant/order-status.constant';
import { IBaseModel } from './base.model';

export interface Order extends IBaseModel {
  customerId: number;
  totalPrice: number;
  status: ORDER_STATUS;
  address: string;
  phoneNumber: string;
  fullName: string;
}
