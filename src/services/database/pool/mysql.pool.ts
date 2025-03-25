import mysqlDatabaseConfig from '@src/config/databse.config';
import mysql from 'mysql2/promise';

const mysqlPool = mysql.createPool(mysqlDatabaseConfig);
export default mysqlPool;
