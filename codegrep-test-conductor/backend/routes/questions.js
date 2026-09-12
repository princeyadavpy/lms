const express = require('express');
const {
    getQuestionsByTest,
    addQuestionToTest,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// GET /api/questions/:testId/questions  — list all questions for a test
router.get('/:testId/questions', protect, getQuestionsByTest);

// POST /api/questions/:testId/add  — add question to test
router.post('/:testId/add', protect, authorize('Admin', 'Teacher'), addQuestionToTest);

// PUT / DELETE a specific question
router.route('/:id')
    .put(protect, authorize('Admin', 'Teacher'), updateQuestion)
    .delete(protect, authorize('Admin', 'Teacher'), deleteQuestion);

module.exports = router;
