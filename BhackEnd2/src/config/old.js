const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'tlan',
  port: process.env.DB_PORT || '3307',
});
module.exports = connection;