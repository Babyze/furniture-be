import { MysqlDatabase } from '@src/services/database/mysql.database';

export class BaseRepository<T> extends MysqlDatabase<T> {}
