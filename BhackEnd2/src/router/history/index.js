const { Router } = require('express');
const historyController = require('../../controller/watchHistory.controlle');

const router = Router();



router.post('/history', historyController.addToHistory);
router.get('/history/:userId', historyController.getHistory);
router.delete('/delete', historyController.deleteHistoryItem);
module.exports = router;