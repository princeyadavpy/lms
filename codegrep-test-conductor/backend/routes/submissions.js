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
router.post('/:testId/start', protect, startExam);                  // create/resume submission
router.post('/:testId/submit/:submissionId', protect, submitExam);          // finalize submission
router.patch('/:id/proctor-event', protect, logProctorEvent);            // real-time cheat log

// ── Teacher/Admin routes ──────────────────────────────────────────
router.get('/test/:testId', protect, authorize('Admin', 'Teacher'), getSubmissionsByTest);

module.exports = router;
