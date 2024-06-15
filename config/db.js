const mysql = require('mysql2');
const { promisify } = require('util');
require('dotenv').config({ path: 'variables.env' });

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1);
    return;
  }
  console.log('Connected to MySQL database');
});

// Promisify the query function to use async/await
const query = promisify(connection.query).bind(connection);

module.exports = {
  connection,
  query
};