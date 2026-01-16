const express = require('express');
const router = express.Router();
const controller = require('../../controller/trailer.controller');
const upload = require('../../config/uploadConfig'); 

// 1. Route chỉ up Video
// Key trong Postman là: "video"
router.post('/video-add', upload.single('video'), controller.addVideo);
router.get('/video-list', controller.getVideos);
router.delete('/video-delete/:id', controller.deleteVideo);
// 2. Route chỉ up Ảnh
// Key trong Postman là: "image"
router.post('/image-add', upload.single('image'), controller.addImage);
router.get('/image-list', controller.getImages);
router.delete('/image-delete/:id', controller.deleteImage);
module.exports = router;