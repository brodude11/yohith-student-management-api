// This file is to create the connection to MySQL, by creating a single MySQL connection that is shared throughout the application
// Database credentials are loaded from environment variables to avoi hardcoding sensitive information in the source code

require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    port: process.env.MYSQL_PORT,
    multipleStatements: true
});

connection.connect((error) => {
    if (error) {
        console.log('Database connection failed:', error.message);
        return;
    }

    console.log('Connected to MySQL database');
});

module.exports = connection;