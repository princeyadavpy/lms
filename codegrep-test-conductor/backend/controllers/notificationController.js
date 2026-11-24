const Notification = require('../models/Notification');

// GET /api/notifications/my — Get logged-in user's notifications
exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort('-createdAt')
            .limit(20)
            .lean();

        const unreadCount = await Notification.countDocuments({
            userId: req.user._id,
            isRead: false
        });

        res.status(200).json({
            success: true,
            data: notifications,
            unreadCount
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// PATCH /api/notifications/:id/read — Mark single notification as read
exports.markNotificationRead = async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { isRead: true },
            { new: true }
        );
        if (!notif) {
            return res.status(404).json({ success: false, msg: 'Notification not found' });
        }
        res.status(200).json({ success: true, data: notif });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// PATCH /api/notifications/read-all — Mark all notifications as read
exports.markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, msg: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

