const mongoose = require('mongoose');

const completedLessonSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    completedAt: { type: Date, default: Date.now },
    timeSpentSeconds: { type: Number, default: 0 }
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    answers: { type: mongoose.Schema.Types.Mixed },
    attemptedAt: { type: Date, default: Date.now }
}, { _id: false });

const assessmentSubmissionSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['Coding', 'Project', 'Practical'], default: 'Coding' },
    code: { type: String },
    language: { type: String },
    scoreAwarded: { type: Number, default: 0 },
    maxScore: { type: Number, default: 100 },
    status: { type: String, enum: ['Submitted', 'Evaluating', 'Evaluated', 'PendingReview'], default: 'Submitted' },
    testCaseResults: { type: Array, default: [] },
    teacherFeedback: { type: String, default: '' },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date, default: Date.now }
}, { _id: false });

const completedModuleSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    completedAt: { type: Date, default: Date.now },
    quizPassed: { type: Boolean, default: false },
    quizScorePercent: { type: Number, default: 0 },
    assessmentPassed: { type: Boolean, default: false }
}, { _id: false });

const adminOverrideSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    unlockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    unlockedByName: { type: String },
    reason: { type: String, default: 'Instructor authorized override' },
    unlockedAt: { type: Date, default: Date.now }
}, { _id: false });

const studentProgressSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', index: true },
    institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },

    // Aggregate statistics
    overallPercentage: { type: Number, default: 0 },
    totalTimeSpentMinutes: { type: Number, default: 0 },
    currentGradePercent: { type: Number, default: 0 },

    // Active lesson tracking
    currentActiveModuleId: { type: mongoose.Schema.Types.ObjectId },
    currentActiveLessonId: { type: mongoose.Schema.Types.ObjectId },

    // Granular progress arrays
    completedLessons: [completedLessonSchema],
    completedModules: [completedModuleSchema],
    quizAttempts: [quizAttemptSchema],
    assessmentSubmissions: [assessmentSubmissionSchema],

    // Unlocked module cache
    unlockedModules: [{ type: mongoose.Schema.Types.ObjectId }],

    // Emergency audit log
    adminOverrides: [adminOverrideSchema],

    lastAccessedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure unique progress record per student per course
studentProgressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('StudentProgress', studentProgressSchema);

