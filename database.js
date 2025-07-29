import mysql from 'mysql2';
import dotenv from "dotenv";

dotenv.config();

export const pool1 = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_NAME,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});

/* export const pool2 = mysql.createPool({
  host: process.env.DB_HOST_2,
  user: process.env.DB_USER_2,
  password: process.env.DB_PASSWORD_2,
  database: process.env.DB_NAME_2,
  port: process.env.DB_PORT_2,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});
*/

