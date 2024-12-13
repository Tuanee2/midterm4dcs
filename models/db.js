const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Đường dẫn tới file database.db
const dbPath = path.resolve(__dirname, '../database.db');

// Tạo kết nối SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Không thể kết nối đến SQLite:', err.message);
    } else {
        console.log('Kết nối SQLite thành công!');
    }
});

module.exports = db;