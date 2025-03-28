/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaginationResult } from '@src/dto/common/pagination.dto';
import { PaginationDto } from '@src/dto/common/pagination.dto';
import { IBaseModel } from '@src/models/base.model';

export interface IDatabase<T> {
  query(sql: string, params: any[]): Promise<T[]>;
  getAll(): Promise<T[]>;
  getById(id: IBaseModel['id']): Promise<T | null>;
  insert(data: Partial<T> & Pick<IBaseModel, 'id'>): Promise<T>;
  update(id: IBaseModel['id'], data: Partial<T>): Promise<T>;
  delete(id: IBaseModel['id']): Promise<T>;
  transaction(queries: { sql: string; params: any[] }[]): Promise<boolean>;
  getTotalItems(sql: string[], params: unknown[]): Promise<number>;
  getPaginatedItems(paginationDto: PaginationDto, sql: string[], params: unknown[]): Promise<T[]>;
  paginate(
    items: T[],
    totalItems: number,
    paginationDto: PaginationDto,
  ): Promise<PaginationResult<T>>;
}
