const plcModel = require('../models/plcModel');

// API: Kết nối tới PLC
exports.connectPLC = async (req, res) => {
    try {
        await plcModel.connectPLC();
        res.json({ message: 'Kết nối PLC thành công!' });
    } catch (error) {
        console.error('Lỗi khi kết nối PLC:', error);
        res.status(500).json({ error: 'Không thể kết nối PLC!' });
    }
};

// API: Đọc dữ liệu từ PLC
exports.readPLCData = async (req, res) => {
    try {
        const data = await new Promise((resolve, reject) => {
            plcModel.readPLCData(); // Đọc dữ liệu từ PLC
            setTimeout(() => resolve(), 500); // Đợi PLC phản hồi
        });
        res.json({ message: 'Dữ liệu đọc được từ PLC:', data });
    } catch (error) {
        console.error('Lỗi khi đọc dữ liệu từ PLC:', error);
        res.status(500).json({ error: 'Không thể đọc dữ liệu từ PLC!' });
    }
};

// API: Ghi dữ liệu xuống PLC
exports.writePLCData = async (req, res) => {
    const { tag, value } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!tag || value === undefined) {
        res.status(400).json({ error: 'Thiếu tag hoặc value!' });
        return;
    }

    try {
        await plcModel.writePLCData(tag, value);
        //res.json({ message: `Đã ghi thành công giá trị ${value} vào tag ${tag}` });
        res.end();
    } catch (error) {
        console.error('Lỗi khi ghi dữ liệu xuống PLC:', error);
        res.status(500).json({ error: 'Không thể ghi dữ liệu xuống PLC!' });
    }
};

exports.readPLCValueByTag = (req, res) => {
    const { tag } = req.body;

    // Kiểm tra nếu tag không được truyền hoặc không hợp lệ
    if (!tag) {
        res.status(400).json({ error: 'Tag không được để trống!' });
        return;
    }

    plcModel.readSinglePLCData(tag, (error, value) => {
        if (error) {
            res.status(500).json({ error: `Không thể đọc giá trị từ tag "${tag}". Lỗi: ${error.message}` });
        } else {
            res.json({ tag: tag, value: value });
        }
    });
};

exports.writeMultiplePLCData = async (req, res) => {
    const { data } = req.body; // `data` là một mảng [{ tag, value }, ...]

    // Kiểm tra dữ liệu đầu vào
    if (!Array.isArray(data) || data.length === 0) {
        res.status(400).json({ error: 'Dữ liệu đầu vào không hợp lệ! Phải là một mảng các đối tượng { tag, value }.' });
        return;
    }

    const errors = [];
    const successes = [];

    try {
        // Ghi tuần tự từng tag-value
        for (const { tag, value } of data) {
            if (!tag || value === undefined) {
                errors.push({ tag, error: 'Thiếu tag hoặc value!' });
                continue;
            }

            try {
                await plcModel.writePLCData(tag, value);
                successes.push(tag);
            } catch (error) {
                console.error(`Lỗi khi ghi dữ liệu xuống PLC cho tag ${tag}:`, error);
                errors.push({ tag, error: error.message });
            }
        }

        // Gửi phản hồi cuối cùng sau khi tất cả xử lý xong
        res.json({
            message: 'Hoàn thành ghi dữ liệu xuống PLC.',
            successes,
            errors,
        });
    } catch (error) {
        console.error('Lỗi không mong muốn:', error);
        res.status(500).json({ error: 'Không thể hoàn thành yêu cầu ghi dữ liệu xuống PLC!' });
    }
};
