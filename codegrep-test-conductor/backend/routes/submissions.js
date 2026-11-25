const express = require('express');
const {
    startExam,
    submitExam,
    logProctorEvent,
    getMySubmissions,
    getSubmissionsByTest
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// ── Student routes ────────────────────────────────────────────────
router.get('/mine', protect, getMySubmissions);          // student: view own results
router.post('/', protect, async (req, res, next) => {
    try {
        const { testId } = req.body;
        if (!testId) return res.status(400).json({ success: false, msg: 'testId is required' });
        const Submission = require('../models/Submission');
        let submission = await Submission.findOne({ testId, studentId: req.user.id, status: 'InProgress' });
        if (!submission) {
            submission = await Submission.create({ testId, studentId: req.user.id, answers: [] });
        }
        req.params.testId = testId;
        req.params.submissionId = submission._id.toString();
        return submitExam(req, res, next);
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
});
router.post('/:testId/start', protect, startExam);                  // create/resume submission
router.post('/:testId/submit/:submissionId', protect, submitExam);          // finalize submission
router.patch('/:id/proctor-event', protect, logProctorEvent);            // real-time cheat log

// ── Teacher/Admin routes ──────────────────────────────────────────
router.get('/test/:testId', protect, authorize('Admin', 'Teacher'), getSubmissionsByTest);

module.exports = router;
