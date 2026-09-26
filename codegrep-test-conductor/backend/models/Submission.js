const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    type: { type: String, enum: ['MCQ', 'Coding'], required: true },
    answerData: { type: mongoose.Schema.Types.Mixed }, // String for MCQ, {language, code} for coding
    marksAwarded: { type: Number, default: 0 },
    teacherFeedback: { type: String, default: '' },   // Manual review comments/feedback
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    aiScore: { type: Number, default: null },      // AI-based code quality / answer score
    timeTaken: { type: Number, default: 0 },         // seconds spent on this question
    status: { type: String, enum: ['Pending', 'Evaluated', 'Error'], default: 'Pending' }
});

// Proctor event log entry
const flaggedEventSchema = new mongoose.Schema({
    event: { type: String }, // 'TAB_SWITCH', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT', 'DEVTOOLS', 'PASTE_ATTEMPT'
    timestamp: { type: Date, default: Date.now },
    detail: { type: String }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
    answers: [answerSchema],
    totalMarks: { type: Number, default: 0 },
    status: { type: String, enum: ['InProgress', 'Submitted'], default: 'InProgress' },

    // Proctoring
    proctorLog: {
        tabSwitches: { type: Number, default: 0 },
        fullscreenExits: { type: Number, default: 0 },
        copyAttempts: { type: Number, default: 0 },
        pasteAttempts: { type: Number, default: 0 },
        devToolsDetected: { type: Number, default: 0 },
        flaggedEvents: [flaggedEventSchema],
        riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' }
    },

    // Tracking
    ipAddress: { type: String, default: null },
    browserFingerprint: { type: String, default: null },

    // Analytics
    percentile: { type: Number, default: null },
    rank: { type: Number, default: null },

    startTime: { type: Date, default: Date.now },
    submitTime: { type: Date },
    isAutoSubmitted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
