// src/routes/tvRoutes.js
const { Router } = require('express');
const router = Router();
const tvController = require('../../controller/tv.controller');

router.get('/nav', tvController.getNav);      
 // Lấy menu VTV, HTV...
router.get('/channels', tvController.getChannels); // Lấy list kênh để grid
router.post('/channels', tvController.create);       // Thêm
router.delete('/channels/:id', tvController.delete); // Xóa
module.exports = router;