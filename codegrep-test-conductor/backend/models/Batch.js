const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // e.g. "DSA Training Batch 2026", "Generative AI Workshop"
    code: { type: String, required: true, trim: true, uppercase: true }, // e.g. "SHU-DSA-B1"
    institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    description: { type: String },

    // Stakeholders
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Content mapping
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    assignedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],

    // Schedule
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
        type: String,
        enum: ['Upcoming', 'Active', 'Completed', 'Archived'],
        default: 'Active'
    },

    // Capacity & Meta
    maxStudents: { type: Number, default: 200 },
    bannerUrl: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index to ensure batch code is unique per institution
batchSchema.index({ institutionId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Batch', batchSchema);

