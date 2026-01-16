const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser'); // 👈 [1] Thêm dòng này

console.log("check env variables", process.env);

const app = express();

const webRoutes = require('./router');
const cors = require('cors');

// 👇 [2] SỬA LẠI CẤU HÌNH CORS (Quan trọng nhất)
app.use(cors({
    origin: 'http://localhost:5173', // Điền đúng link Frontend React của bạn
    credentials: true // Cho phép nhận Cookie từ client
})); 

// Cấu hình view engine
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 👇 [3] KÍCH HOẠT COOKIE PARSER (Đặt trước Router)
app.use(cookieParser()); 

// Router 
app.use('/', webRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Start server
module.exports = app;