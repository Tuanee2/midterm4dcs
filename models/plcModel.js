const NodeS7 = require('nodes7');
const { NodeS7Client } = require('nodes7'); // Import NodeS7Client

const s7client = new NodeS7; // Khởi tạo client

// Cấu hình kết nối PLC
const PLC_CONFIG = {
    host: '192.168.1.10', // Địa chỉ IP của PLC hoặc PLC Simulator
    port: 102,            // Cổng giao tiếp Siemens S7 (mặc định là 102)
    rack: 0,              // Rack của PLC (thường là 0)
    slot: 1               // Slot của CPU (thường là 1 hoặc 2)
};

// Kết nối đến PLC
async function connectPLC() {
    try {
        await s7client.connect(PLC_CONFIG); // Kết nối tới PLC
        console.log('Kết nối PLC thành công!');
    } catch (error) {
        console.error('Lỗi khi kết nối PLC:', error);
        throw error;
    }
}

// Đọc dữ liệu từ PLC
async function readPLCData(tag) {
    try {
        const data = await s7client.read(tag); // Đọc dữ liệu từ tag
        console.log(`Dữ liệu từ tag ${tag}:`, data);
        return data;
    } catch (error) {
        console.error('Lỗi khi đọc dữ liệu từ PLC:', error);
        throw error;
    }
}

// Ghi dữ liệu xuống PLC
async function writePLCData(tag, value) {
    try {
        await s7client.write(tag, value); // Ghi dữ liệu vào tag
        console.log(`Ghi thành công giá trị ${value} vào tag ${tag}`);
    } catch (error) {
        console.error('Lỗi khi ghi dữ liệu xuống PLC:', error);
        throw error;
    }
}

// Xuất các phương thức để sử dụng trong Controller
module.exports = {
    connectPLC,
    readPLCData,
    writePLCData
};