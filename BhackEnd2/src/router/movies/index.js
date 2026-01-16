const {Router} = require('express');
const MovieController = require('../../controller/movie.controller');
const uploadCloud = require('../../config/cloudinary');

const router = Router();

router.post('/', 
  uploadCloud.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'trailer', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]), 
  MovieController.create
);
router.get('/', MovieController.getAll);
router.get('/genre', MovieController.filterByGenre);
// Đặt route này lên trên các route có :id
router.get('/autocomplete', MovieController.autocomplete);
// Sử dụng DELETE method
router.delete('/:id', MovieController.delete);

router.get('/', MovieController.getAll);
module.exports = router;