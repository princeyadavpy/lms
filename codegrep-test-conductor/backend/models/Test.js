const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },

    // Test type
    type: { type: String, enum: ['MCQ', 'Coding', 'Mixed'], default: 'Mixed' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    tags: [{ type: String }],

    // Scheduling
    duration: { type: Number, required: true }, // in minutes
    startTime: { type: Date },
    endTime: { type: Date },

    // Questions
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    totalMarks: { type: Number, default: 0 },

    // Proctoring & exam config
    config: {
        shuffleQuestions: { type: Boolean, default: false },
        shuffleOptions: { type: Boolean, default: false },
        proctorLevel: { type: Number, enum: [0, 1, 2, 3], default: 0 },
        browserLockdown: { type: Boolean, default: false },
        negativeMarking: { type: Boolean, default: false },
        negativeMarkFrac: { type: Number, default: 0.25 }, // fraction of marks deducted
        cutoffScore: { type: Number, default: 0 },
        maxTabSwitches: { type: Number, default: 3 },
        maxAttempts: { type: Number, default: 1 },
        studentOverrides: [{
            email: { type: String, required: true },
            maxAttempts: { type: Number, required: true }
        }],
        allowedLanguages: [{ type: String }],
        showResultAfter: { type: Boolean, default: true },
        allowedEmails: [{ type: String }],
    },

    status: { type: String, enum: ['Draft', 'Active', 'Completed'], default: 'Draft' },
    published: { type: Boolean, default: false },
    accessCode: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
