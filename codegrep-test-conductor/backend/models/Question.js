const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    type: { type: String, enum: ['MCQ', 'Coding'], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },

    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    tags: [{ type: String }],
    explanation: { type: String, default: null }, // shown after test (if showResultAfter)
    timeLimitSeconds: { type: Number, default: null }, // null = no per-question timer

    // MCQ specific
    options: [{ type: String }],
    correctAnswer: { type: String },

    // Coding specific
    testCases: [testCaseSchema],
    languageRestrictions: [{ type: String, enum: ['python', 'cpp', 'java', 'javascript', 'c', 'typescript', 'go'] }],
    // Starter code stubs per language (teacher provides, student completes)
    starterCode: {
        type: Map,
        of: String,
        default: {}
        // e.g. { javascript: "function solution(nums, target) {\n  // write your code here\n}", python: "def solution(nums, target):\n    pass" }
    },

    marks: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
