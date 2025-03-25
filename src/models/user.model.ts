import { IBaseModel } from './base.model';

export interface User extends IBaseModel {
  email: string;
  password: string;
  fullName: string;
  isAgreeAllPolicy: boolean;
}
