const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead
} = require('../controllers/notificationController');

router.use(protect);

router.get('/my', getMyNotifications);
router.patch('/read-all', markAllNotificationsRead);
router.patch('/:id/read', markNotificationRead);

module.exports = router;

