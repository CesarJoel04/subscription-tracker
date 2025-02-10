import mysql from 'mysql2';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from './env.js';

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: 3306,
});

export default pool;