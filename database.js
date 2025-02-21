import mysql from 'mysql2';
import dotenv from "dotenv";

dotenv.config();

export const pool1 = mysql.createPool({
  host: process.env.DB_HOST_3,
  user: process.env.DB_USER_3,
  password: process.env.DB_PASSWORD_3,
  database: process.env.DB_NAME_3,
  port: process.env.DB_PORT_3,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});


