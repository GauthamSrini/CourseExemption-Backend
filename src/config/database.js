const mysql = require("mysql2/promise");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('connection', connection => {
  console.log('MySQL connection established');
});

pool.on('acquire', connection => {
  console.log('MySQL connection acquired');
});

pool.on('release', connection => {
  console.log('MySQL connection released');
});

module.exports = pool;
