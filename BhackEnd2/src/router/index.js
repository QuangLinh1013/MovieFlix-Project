
const {Router} = require('express');

const router = Router();
//login
router.use('/users', require('./user'));
//trang chủ
router.use('/movies', require('./movies'));
//trang tv
router.use('/tv', require('./tv'));
//Trang phim chiếu rạp
router.use('/movies1', require('./movies1'));
//history
router.use('/history', require('./history'));
//watch-later
router.use('/watch-later', require('./watchLater'));
//trailer banner
router.use('/trailer', require('./trailer'));
//notification
router.use('/notifications1', require('./notifications1'));
module.exports = router;