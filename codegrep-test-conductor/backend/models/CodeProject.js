const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    language: { type: String, required: true },
    content: { type: String, default: '' }
});

const codeProjectSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    files: [fileSchema],
    isShared: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('CodeProject', codeProjectSchema);
