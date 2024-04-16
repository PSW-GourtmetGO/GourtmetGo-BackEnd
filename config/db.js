const mysql = require('mysql');
require('dotenv').config({path:'variables.env'});

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

module.exports = connection;
