const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const homeController = require('./controllers/homeController');

const app = express();
const PORT = 3000;

// Cấu hình EJS làm template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cấu hình body-parser để xử lý POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Để parse JSON trong request body

// Cấu hình file tĩnh
//app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public')));

// Route chính
app.get('/', homeController.getHomePage);

// Route thêm người dùng
app.post('/add-user', homeController.addUser);
app.post('/log', homeController.addLog);
app.post('/addrecipe', homeController.addRecipe);
app.post('/saverecipe', homeController.saveRecipe);
app.post('/readrecipelist', homeController.readRecipeList);
app.post('/deleterecipe', homeController.deleteRecipe);
app.post('/updaterecipe', homeController.updateRecipe);

app.get('/mainpage', (req, res) => {
    res.render('mainpage'); // Kết xuất file mainpage.ejs
});

// Route lỗi (404)
app.use((req, res) => {
    res.status(404).render('error', { message: 'Trang không tồn tại!' });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});