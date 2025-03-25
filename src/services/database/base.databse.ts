/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBaseModel } from '@src/models/base.model';

export interface IDatabase<T> {
  query(sql: string, params: any[]): Promise<T[]>;
  getAll(): Promise<T[]>;
  getById(id: IBaseModel['id']): Promise<T | null>;
  insert(data: Partial<T>): Promise<T>;
  update(id: IBaseModel['id'], data: Partial<T>): Promise<T>;
  delete(id: IBaseModel['id']): Promise<T>;
  transaction(queries: { sql: string; params: any[] }[]): Promise<boolean>;
}
