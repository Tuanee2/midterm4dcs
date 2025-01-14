const NodeS7 = require('nodes7');
//const { NodeS7Client } = require('nodes7'); // Import NodeS7Client

const conn = new NodeS7; // Khởi tạo client

// Biến ánh xạ để đọc và ghi
const variables_read = {
    Cement_Value: 'DB2,REAL56', // Đọc mức xi măng
    Sand_Value: 'DB2,REAL68',   // Đọc mức cát
    Flyash_Value: 'DB2,REAL60', // Đọc mức tro bay
    Mineral_Value: 'DB2,REAL64', // Đọc mức khoáng
    PG01_Value: 'DB2,REAL72',   // Đọc mức PG1
    PG02_Value: 'DB2,REAL76',   // Đọc mức PG2
    PG03_Value: 'DB2,REAL80',   // Đọc mức PG3
};

const variables_write = {
    Cement_Screw: 'DB1,X0.3', // Điều khiển vít xi măng
    Sand_Screw: 'DB1,X0.4',   // Điều khiển vít cát
    Flyash_Screw: 'DB1,X0.5', // Điều khiển vít tro bay
    Mineral_Screw: 'DB1,X0.6', // Điều khiển vít khoáng
    Mixer: 'DB1,X0.7',         // Điều khiển máy trộn
    Hopper_PG1: 'DB1,X0.0',    // Điều khiển van PG1
    Hopper_PG2: 'DB1,X0.1',    // Điều khiển van PG2
    Hopper_PG3: 'DB1,X0.2',    // Điều khiển van PG3
    PG_Scale_Valve: 'DB1,X1.3',   // Điều khiển van cân
    Sand_Scale_Valve: 'DB1,X1.4', // Điều khiển van cân cát
    Mineral_Ash_Valve: 'DB1,X1.5', // Điều khiển van cân tro bay
    Mixer_Valve_Open: 'DB1,X1.1', // Điều khiển van máy trộn mở
    Mixer_Valve_Close: 'DB1,X1.0', // Điều khiển van máy trộn đóng
    Conveyor_Chute: 'DB1,X1.2', // Điều khiển băng tải
    // giá trị các thành phần
    Cement_ref: 'DB2,REAL28', // Ghi giá trị xi măng đặt
    Sand_ref: 'DB2,REAL16',   // Ghi giá trị cát đặt
    Mineral_ref: 'DB2,REAL20', // Ghi giá trị tro bay đặt
    Flyash_ref: 'DB2,REAL24', // Ghi giá trị khoáng đặt
    PG01_ref: 'DB2,REAL92',   // Ghi giá trị PG1 đặt
    PG02_ref: 'DB2,REAL96',   // Ghi giá trị PG2 đặt
    PG03_ref: 'DB2,REAL100',   // Ghi giá trị PG3 đặt
    //
    Start: 'M0.1',
    Manul: 'M0.0',
    Auto: 'M0.5',
    Stop: 'M0.3',
    Reset: 'M51.4'
};

// Kết nối đến PLC
async function connectPLC() {
    try {
        conn.initiateConnection({ port: 102, host: '192.168.0.1', rack: 0, slot: 1, debug: false }, connected); 
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

function readSinglePLCData(tag, callback) {
    // Kiểm tra xem tag có trong biến `variables_read` không
    if (!variables_read[tag]) {
        console.error(`Tag "${tag}" không tồn tại trong variables_read.`);
        callback(new Error(`Tag "${tag}" không hợp lệ.`), null);
        return;
    }

    // Cấu hình ánh xạ tag
    conn.setTranslationCB((t) => variables_read[t]);

    // Đọc giá trị từ tag
    conn.addItems([tag]);
    conn.readAllItems((error, values) => {
        if (error) {
            console.error("Lỗi khi đọc giá trị từ PLC:", error);
            callback(error, null);
        } else {
            callback(null, values[tag]); // Trả về giá trị của tag
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
    readSinglePLCData,
    writePLCData,
};

(async () => {
   try {
       await connectPLC();
   } catch (error) {
       console.error("Lỗi khi khởi động ứng dụng:", error);
   }
})();