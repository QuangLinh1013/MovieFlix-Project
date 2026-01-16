const express = require('express');
const router = express.Router();

// Nhớ trỏ đúng đường dẫn đến file Controller bạn vừa tạo
const watchLaterController = require('../../controller/watchLater.controller'); 

// 1. API Thêm hoặc Xóa (Toggle)
router.post('/toggle', watchLaterController.toggle);

// 2. API Lấy danh sách phim đã lưu của User
router.get('/list/:userId', watchLaterController.getMyList);

// 3. API Kiểm tra xem phim này đã lưu chưa (để hiện nút sáng/tối)
router.get('/check', watchLaterController.checkStatus);

module.exports = router;