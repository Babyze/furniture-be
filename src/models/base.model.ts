import { Dayjs } from 'dayjs';

export interface IBaseModel {
  id: number;
  createdDate: Dayjs;
  updatedDate: Dayjs;
}
