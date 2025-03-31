import { env } from '@src/config/env.config';
import mysql from 'mysql2/promise';

const mysqlPool = mysql.createPool({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});
export default mysqlPool;
