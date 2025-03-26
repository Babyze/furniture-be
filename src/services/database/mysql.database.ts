/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBaseModel } from '@src/models/base.model';
import { IDatabase } from './base.databse';
import mysqlPool from './pool/mysql.pool';
import { toCamelCase, toDateStringToDate, toSnakeCase } from '@src/utils/database.util';

export class MysqlDatabase<T> implements IDatabase<T> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async query(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await mysqlPool.query(sql, params);
    return (rows as T[]).map((record) => {
      record = toCamelCase(record);
      record = toDateStringToDate(record);
      return record;
    });
  }

  async getAll(): Promise<T[]> {
    return this.query(`SELECT * FROM ${this.tableName}`);
  }

  async getById(id: IBaseModel['id']): Promise<T | null> {
    const results = await this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    return results.length > 0 ? toDateStringToDate(toCamelCase(results[0])) : null;
  }

  async insert(data: Partial<T> & Pick<IBaseModel, 'id'>): Promise<T> {
    const keys = toSnakeCase(Object.keys(data)).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');

    await mysqlPool.query(
      `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders})`,
      values,
    );

    const result = await this.getById(data.id);

    return toDateStringToDate(toCamelCase(result)) as T;
  }

  async update(id: IBaseModel['id'], data: Partial<T>): Promise<T> {
    const updates = toSnakeCase(Object.keys(data))
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = [...Object.values(data), id];

    await mysqlPool.query(`UPDATE ${this.tableName} SET ${updates} WHERE id = ?`, values);

    const result = await this.getById(id);

    return toDateStringToDate(toCamelCase(result)) as T;
  }

  async delete(id: IBaseModel['id']): Promise<T> {
    await mysqlPool.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    const result = await this.getById(id);
    return toDateStringToDate(toCamelCase(result)) as T;
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
}
