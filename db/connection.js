const mysql = require('mysql2');

// Using my user and pass to connect to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Villa100!',
    database: 'election'
});

module.exports = db;