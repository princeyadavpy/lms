const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['approval', 'course_allocated', 'institution_allocated', 'batch_allocated', 'exam_allocated', 'general'],
        default: 'general'
    },
    link: {
        type: String,
        default: '/student'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

NotificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);

