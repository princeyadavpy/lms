const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
    language: { type: String, required: true },
    title: { type: String },
    code: { type: String, required: true },
    explanation: { type: String }
}, { _id: false });

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'doc', 'link', 'zip'], default: 'link' },
    size: { type: String }
}, { _id: false });

const lessonSchema = new mongoose.Schema({
    orderIndex: { type: Number, required: true },
    title: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    contentType: {
        type: String,
        enum: ['article', 'video', 'pdf', 'interactive'],
        default: 'article'
    },
    content: { type: String, default: '' }, // Markdown / formatted HTML
    videoUrl: { type: String },
    estimatedMinutes: { type: Number, default: 15 },

    // Code examples
    codeSnippets: [codeSnippetSchema],

    // Tab 2: AI Summarize & Visualize
    aiSummary: {
        summary: { type: String },
        keyConcepts: [{ type: String }],
        visualDiagram: { type: String }, // Mermaid diagram syntax or SVG/markdown
        revisionNotes: { type: String },
        formulas: [{ type: String }]
    },

    // Resources & attachments
    resources: [resourceSchema]
});

const quizQuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'MSQ', 'TrueFalse'], default: 'MCQ' },
    options: [{ type: String, required: true }],
    correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true }, // string index or array of indexes
    explanation: { type: String },
    marks: { type: Number, default: 5 }
});

const moduleQuizSchema = new mongoose.Schema({
    title: { type: String, default: 'Module Knowledge Check' },
    passingScorePercent: { type: Number, default: 60 },
    timeLimitMinutes: { type: Number, default: 20 },
    maxAttempts: { type: Number, default: 3 },
    questions: [quizQuestionSchema]
}, { _id: false });

const codingProblemSchema = new mongoose.Schema({
    title: { type: String },
    problemStatement: { type: String },
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    marks: { type: Number, default: 100 },
    sampleTestCases: [{
        input: { type: String },
        output: { type: String },
        explanation: { type: String }
    }],
    hiddenTestCases: [{
        input: { type: String },
        output: { type: String }
    }],
    starterCode: {
        type: Map,
        of: String,
        default: {}
    }
}, { _id: false });

const moduleAssessmentSchema = new mongoose.Schema({
    title: { type: String, default: 'Module Assessment' },
    type: { type: String, enum: ['Coding', 'Project', 'Practical'], default: 'Coding' },
    description: { type: String },
    maxMarks: { type: Number, default: 100 },
    codingProblem: codingProblemSchema
}, { _id: false });

const moduleLabSchema = new mongoose.Schema({
    title: { type: String, default: 'Hands-on Lab' },
    description: { type: String },
    starterCode: { type: Map, of: String },
    testCases: [{
        input: { type: String },
        output: { type: String },
        isHidden: { type: Boolean, default: false }
    }]
}, { _id: false });

const moduleSchema = new mongoose.Schema({
    orderIndex: { type: Number, required: true },
    title: { type: String, required: true }, // e.g. "Module 01: Introduction to DSA"
    description: { type: String },
    estimatedHours: { type: Number, default: 4 },
    lessons: [lessonSchema],
    quiz: moduleQuizSchema,
    assessment: moduleAssessmentSchema,
    lab: moduleLabSchema,

    // Sequential locking rules
    unlockRequirements: {
        previousModuleRequired: { type: Boolean, default: true },
        minQuizScorePercent: { type: Number, default: 60 },
        mustCompleteAllLessons: { type: Boolean, default: true }
    }
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true }, // e.g. "DSA-201"
    description: { type: String },
    category: {
        type: String,
        enum: ['DSA', 'ML', 'DL', 'GEN AI', 'AGENTIC AI', 'PYTHON', 'C', 'C++', 'JAVA', 'Web Development', 'Other'],
        default: 'DSA'
    },
    thumbnailUrl: { type: String },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Intermediate'
    },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    instructorName: { type: String },

    // Institutional scope & allocations
    allocatedInstitutions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }],
    institutionRestrictions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }],

    // Sequential progression flag
    sequentialOrder: { type: Boolean, default: true },

    modules: [moduleSchema],

    totalLessonsCount: { type: Number, default: 0 },
    totalModulesCount: { type: Number, default: 0 },
    estimatedTotalHours: { type: Number, default: 40 },
    published: { type: Boolean, default: true }
}, { timestamps: true });

courseSchema.pre('save', function () {
    if (this.modules && Array.isArray(this.modules)) {
        this.totalModulesCount = this.modules.length;
        let count = 0;
        this.modules.forEach(m => {
            if (m.lessons) count += m.lessons.length;
        });
        this.totalLessonsCount = count;
    }
});

module.exports = mongoose.model('Course', courseSchema);

