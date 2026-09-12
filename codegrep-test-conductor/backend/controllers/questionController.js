const Question = require('../models/Question');
const Test = require('../models/Test');

// GET /api/questions/:testId/questions — list all questions for a test
exports.getQuestionsByTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId).populate('questions');
        if (!test) return res.status(404).json({ success: false, msg: 'Test not found' });
        res.status(200).json({ success: true, data: test.questions });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/questions/:testId/add — add question to test
exports.addQuestionToTest = async (req, res) => {
    try {
        const testId = req.params.testId;
        const test = await Test.findById(testId);

        if (!test) return res.status(404).json({ success: false, msg: 'Test not found' });

        if (test.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        const question = await Question.create(req.body);
        test.questions.push(question._id);
        await test.save();

        res.status(201).json({ success: true, data: question });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// PUT /api/questions/:id
exports.updateQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!question) return res.status(404).json({ success: false, msg: 'Question not found' });
        res.status(200).json({ success: true, data: question });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// DELETE /api/questions/:id
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ success: false, msg: 'Question not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
