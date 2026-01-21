const express = require('express');
const router = express.Router();
const notificationController = require('../../controller/notification.controller');
const { requireAdmin, requireAuth } = require('../../middleware/auth.middleware');
// API để Admin bấm nút gửi
// POST: http://localhost:8080/api/notifications/send
router.post('/send', notificationController.sendNotification);
router.get('/', requireAuth, notificationController.getUserNotifications);

module.exports = router;