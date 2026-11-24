const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
}, { _id: false });

const practiceLabSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, unique: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' }, // e.g. "Strings", "Classes & Objects", "Pointers", "Arrays"
    language: { type: String, default: 'cpp' }, // 'cpp', 'python', 'java', 'javascript', 'c'
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    totalQuestions: { type: Number, default: 10 },
    maxScore: { type: Number, default: 50 },

    // Starter code map per language
    starterCode: {
        type: Map,
        of: String,
        default: {}
    },

    testCases: [testCaseSchema],

    // Target mapping
    institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
    batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PracticeLab', practiceLabSchema);

