import { Dayjs } from 'dayjs';

export interface IBaseModel {
  id: string;
  createdDate: Dayjs;
  updatedDate: Dayjs;
}
