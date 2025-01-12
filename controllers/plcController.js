const plcModel = require('../models/plcModel');

// Xử lý yêu cầu mở Cement Screw
exports.openCementScrew = async (req, res) => {
    const { tag, value } = req.body;

    if (!tag || value === undefined) {
        res.status(400).json({ error: 'Thiếu tag hoặc value!' });
        return;
    }

    try {
        // Gửi tín hiệu mở screw xuống PLC
        await plcModel.writePLCData(tag, value);
        res.json({ message: `Đã ghi giá trị ${value} vào tag ${tag}` });
    } catch (error) {
        console.error('Lỗi khi ghi dữ liệu xuống PLC:', error);
        res.status(500).json({ error: 'Không thể ghi dữ liệu xuống PLC!' });
    }
};