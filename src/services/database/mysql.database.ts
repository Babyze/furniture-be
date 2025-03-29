/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBaseModel } from '@src/models/base.model';
import { IDatabase } from './base.database';
import mysqlPool from './pool/mysql.pool';
import { toCamelCase, convertDateStringToDate, toSnakeCase } from '@src/utils/database.util';
import { PaginationResult } from '@src/dto/common/pagination.dto';
import { PaginationDto } from '@src/dto/common/pagination.dto';
import { getOffset, paginate } from '@src/utils/pagination.util';

export class MysqlDatabase<T> implements IDatabase<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async query(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await mysqlPool.query(sql, params);
    return (rows as T[]).map((record) => {
      record = toCamelCase(record);
      record = convertDateStringToDate(record);
      return record;
    });
  }

  async getAll(): Promise<T[]> {
    return this.query(`SELECT * FROM ${this.tableName}`);
  }

  async getById(id: IBaseModel['id']): Promise<T | null> {
    const results = await this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    return results.length > 0 ? convertDateStringToDate(toCamelCase(results[0])) : null;
  }

  async insert(data: Partial<T> & Pick<IBaseModel, 'id'>): Promise<T> {
    const keys = toSnakeCase(Object.keys(data)).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');

    const [result] = await mysqlPool.query(
      `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders})`,
      values,
    );

    const insertedData = await this.getById((result as any).insertId);

    return convertDateStringToDate(toCamelCase(insertedData)) as T;
  }

  async update(id: IBaseModel['id'], data: Partial<T>): Promise<T> {
    const updates = toSnakeCase(Object.keys(data))
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = [...Object.values(data), id];

    await mysqlPool.query(`UPDATE ${this.tableName} SET ${updates} WHERE id = ?`, values);

    const result = await this.getById(id);

    return convertDateStringToDate(toCamelCase(result)) as T;
  }

  async delete(id: IBaseModel['id']): Promise<T> {
    await mysqlPool.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    const result = await this.getById(id);
    return convertDateStringToDate(toCamelCase(result)) as T;
  }

  async transaction(queries: { sql: string; params: any[] }[]): Promise<boolean> {
    const connection = await mysqlPool.getConnection();
    try {
      await connection.beginTransaction();

      for (const query of queries) {
        await connection.query(query.sql, query.params);
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Transaction failed:', error);
      return false;
    } finally {
      connection.release();
    }
  }

  async getTotalItems(sql: string[], params: unknown[] = []): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM (${sql.join(' ')}) as temp `;
    const [result] = await this.query(query, params);
    return (result as { total: number }).total;
  }

  async getPaginatedItems(
    paginationDto: PaginationDto,
    sql: string[],
    params: unknown[] = [],
  ): Promise<T[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = getOffset(page, limit);

    const query = `
          ${sql.join(' ')}
          LIMIT ? OFFSET ?
        `;

    const items = await this.query(query, [...params, limit, offset]);
    return items;
  }

  async paginate<T>(
    items: T[],
    totalItems: number,
    paginationDto: PaginationDto,
  ): Promise<PaginationResult<T>> {
    return paginate(items, totalItems, paginationDto);
  }
}
