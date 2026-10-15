require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
    ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {})
});

const sql = fs.readFileSync('db2451002_DearMe.sql', 'utf8');

connection.query(sql, (err, results) => {
    if (err) throw err;
    console.log('데이터 임포트 완료!');
    connection.end();
}); 