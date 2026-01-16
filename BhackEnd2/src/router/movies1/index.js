const express = require('express');
const router = express.Router();
const movieController = require('../../controller/movie1.controller');
const upload = require('../../config/uploadConfig'); // Import cấu hình multer ở Bước 0

// POST: /api/movies/add
// 'poster' là tên key mà Frontend phải gửi trong FormData
router.post('/add', upload.single('poster'), movieController.addMovie);
router.get('/all', movieController.getAllMovies);
router.delete('/delete/:id', movieController.deleteMovie);
module.exports = router;