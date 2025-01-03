const db = require('../models/db');

module.exports = {
    // Trang chính
    getHomePage: (req, res) => {
        const sql = 'SELECT * FROM users'; // Lấy tất cả người dùng
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.render('error', { message: 'Không thể lấy dữ liệu từ cơ sở dữ liệu!' });
            } else {
                res.render('index', { users: rows });
            }
        });
    },

    // Thêm người dùng mới
    addUser: (req, res) => {
        const { name, email } = req.body;
        const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
        db.run(sql, [name, email], (err) => {
            if (err) {
                console.error(err.message);
                res.render('error', { message: 'Không thể thêm người dùng!' });
            } else {
                res.redirect('/');
            }
        });
    },

    // ghi log xuống database
    addLog: (req, res) => {
        const { date, message_text } = req.body; // Lấy dữ liệu từ request body
        const sql = 'INSERT INTO Log (date, time, message_text) VALUES (?, TIME("now"), ?)';
        
        db.run(sql, [date, message_text], (err) => {
            if (err) {
                console.error(err.message);
                res.render('error', { message: 'Không thể thêm log!' }); // Hiển thị lỗi nếu có
            } else {
                res.redirect('/'); // Chuyển hướng sau khi thêm thành công
            }
        });
    }
};