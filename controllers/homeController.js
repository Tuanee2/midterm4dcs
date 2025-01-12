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
    },

    addRecipe: (req, res) => {
        const {
            name, cement, sand, mineral, flyash,
            additive1, additive2, additive3, total_weight, batch_number
        } = req.body;
    
        // Kiểm tra dữ liệu đầu vào
        if (!name) {
            res.status(400).json({ error: 'Tên công thức không được để trống!' });
            return;
        }
    
        const sql = `
            INSERT INTO recipe (
                name, cement, sand, mineral, flyash,
                additive1, additive2, additive3, total_weight, batch_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    
        db.run(
            sql,
            [name, cement || 0, sand || 0, mineral || 0, flyash || 0, additive1 || 0, additive2 || 0, additive3 || 0, total_weight || 0, batch_number || 0],
            function (err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Không thể thêm công thức!' });
                } else {
                    res.status(201).json({ message: 'Thêm công thức thành công!', id: this.lastID });
                }
            }
        );
    },

    saveRecipe: (req, res) => {
        const {
            name, cement, sand, mineral, flyash,
            additive1, additive2, additive3, total_weight, batch_number
        } = req.body;
    
        // Kiểm tra dữ liệu đầu vào
        if (!name) {
            res.status(400).json({ error: 'Tên công thức không được để trống!' });
            return;
        }
    
        const sql = `
            INSERT INTO recipe (
                name, cement, sand, mineral, flyash,
                additive1, additive2, additive3, total_weight, batch_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    
        db.run(
            sql,
            [name, cement || 0, sand || 0, mineral || 0, flyash || 0, additive1 || 0, additive2 || 0, additive3 || 0, total_weight || 0, batch_number || 0],
            function (err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Không thể lưu công thức!' });
                } else {
                    res.status(201).json({ message: 'Công thức đã được lưu thành công!', id: this.lastID });
                }
            }
        );
    },

    readRecipeList: (req, res) => {
        const sql = 'SELECT * FROM recipe ORDER BY id ASC';
    
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Không thể lấy danh sách công thức!' });
            } else {
                res.status(200).json(rows); // Trả về danh sách công thức
            }
        });
    },

    deleteRecipe: (req, res) => {
        const { name } = req.body;
    
        // Kiểm tra dữ liệu đầu vào
        if (!name || name.trim() === "") {
            res.status(400).json({ error: 'Tên công thức không hợp lệ!' });
            return;
        }
    
        const sql = 'DELETE FROM recipe WHERE name = ?';
    
        db.run(sql, [name.trim()], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Không thể xóa công thức!' });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Công thức không tồn tại!' });
            } else {
                res.status(200).json({ message: 'Xóa công thức thành công!' });
            }
        });
    },

    updateRecipe: (req, res) => {
        const {
            id, name, cement, sand, mineral, flyash,
            additive1, additive2, additive3, total_weight, batch_number
        } = req.body;
    
        // Kiểm tra dữ liệu đầu vào
        if (!id || isNaN(id)) {
            res.status(400).json({ error: 'ID không hợp lệ!' });
            return;
        }
        if (!name || name.trim() === "") {
            res.status(400).json({ error: 'Tên công thức không được để trống!' });
            return;
        }
        const numericFields = [cement, sand, mineral, flyash, additive1, additive2, additive3];
        if (numericFields.some(field => field < 0 || isNaN(field))) {
            res.status(400).json({ error: 'Các giá trị phải là số không âm!' });
            return;
        }
    
        const sql = `
            UPDATE recipe
            SET name = ?, cement = ?, sand = ?, mineral = ?, flyash = ?,
                additive1 = ?, additive2 = ?, additive3 = ?, total_weight = ?, batch_number = ?
            WHERE id = ?
        `;
    
        db.run(
            sql,
            [name, cement || 0, sand || 0, mineral || 0, flyash || 0, additive1 || 0, additive2 || 0, additive3 || 0, total_weight || 0, batch_number || 0, id],
            function (err) {
                if (err) {
                    console.error('Lỗi SQL:', err.message);
                    res.status(500).json({ error: 'Không thể cập nhật công thức!' });
                } else if (this.changes === 0) {
                    res.status(404).json({ error: 'Công thức không tồn tại hoặc không có thay đổi!' });
                } else {
                    res.status(200).json({ message: 'Cập nhật công thức thành công!' });
                }
            }
        );
    }
};

