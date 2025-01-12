const NodeS7 = require('nodes7');
//const { NodeS7Client } = require('nodes7'); // Import NodeS7Client

const conn = new NodeS7; // Khởi tạo client

// Cấu hình kết nối PLC
const PLC_CONFIG = {
    host: "192.168.1.2", // Địa chỉ IP của PLC hoặc PLC Simulator
    port: 102,            // Cổng giao tiếp Siemens S7 (mặc định là 102)
    rack: 0,              // Rack của PLC (thường là 0)
    slot: 1               // Slot của CPU (thường là 1 hoặc 2)
};

// Biến ánh xạ để đọc và ghi
const variables_read = {
    Cement_Level: "DB1,REAL0", // Đọc mức xi măng
    Sand_Level: "DB1,REAL4",   // Đọc mức cát
    Flyash_Level: "DB1,REAL8", // Đọc mức tro bay
};

const variables_write = {
    Cement_Screw: "DB1,X0.0", // Điều khiển vít xi măng
    Sand_Screw: "DB1,X0.1",   // Điều khiển vít cát
    Flyash_Screw: "DB1,X0.2", // Điều khiển vít tro bay
};

// Kết nối đến PLC
async function connectPLC() {
    try {
        conn.initiateConnection({ port: 102, host: '192.168.0.2', rack: 0, slot: 1, debug: false }, connected); 
        console.log("Kết nối PLC thành công!");
    } catch (error) {
        console.error("Lỗi khi kết nối PLC:", error);
        throw error;
    }
}

// Đọc dữ liệu từ PLC
function readPLCData() {
    // Cấu hình ánh xạ biến
    conn.setTranslationCB(function(tag) {
        return variables_read[tag];
    });

    // Thêm các biến vào danh sách cần đọc
    conn.addItems(Object.keys(variables_read));

    // Đọc toàn bộ các giá trị
    conn.readAllItems(function(anythingBad, values) {
        if (anythingBad) {
            console.log("SOMETHING WENT WRONG READING VALUES!!!!");
        } else {
            console.log("Dữ liệu đọc được từ PLC:", values);
        }
    });
}

// Ghi dữ liệu xuống PLC
function writePLCData(tag, value) {
    // Cấu hình ánh xạ biến
    conn.setTranslationCB(function(tag) {
        return variables_write[tag];
    });

    // Ghi giá trị vào tag
    conn.writeItems(tag, value, function(anythingBad) {
        if (anythingBad) {
            console.log("SOMETHING WENT WRONG WRITING VALUES!!!!");
        } else {
            console.log(`Đã ghi thành công giá trị ${value} vào tag ${tag}`);
        }
    });
}

// Xuất các phương thức để sử dụng trong Controller
module.exports = {
    connectPLC,
    readPLCData,
    writePLCData,
};

(async () => {
    try {
        await connectPLC();
    } catch (error) {
        console.error("Lỗi khi khởi động ứng dụng:", error);
    }
})();