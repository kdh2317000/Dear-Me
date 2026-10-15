require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {})
});

connection.query('SHOW TABLES;', (err, results) => {
    if (err) {
        console.error('DB 조회 실패:', err);
    } else {
        console.log('현재 DB에 존재하는 테이블 목록:', results);
    }
    connection.end();
});
