const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Villa100!',
    database: 'election'
});

module.exports = db;