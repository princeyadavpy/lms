const Submission = require('../models/Submission');
const Test = require('../models/Test');
const Question = require('../models/Question');

// ─── Start Exam ─────────────────────────────────────────────────────────────
exports.startExam = async (req, res) => {
    try {
        const testId = req.params.testId;
        const test = await Test.findById(testId);
        if (!test || !test.published) {
            return res.status(404).json({ success: false, msg: 'Test not available' });
        }

        // Check test timings
        const now = new Date();
        if (test.startTime && now < test.startTime) {
            return res.status(403).json({ success: false, msg: `Test has not started yet. Starts at ${new Date(test.startTime).toLocaleString()}` });
        }
        if (test.endTime && now > test.endTime) {
            return res.status(403).json({ success: false, msg: `Test has already ended. Ended at ${new Date(test.endTime).toLocaleString()}` });
        }

        // Return existing in-progress submission (resume support)
        let submission = await Submission.findOne({
            testId, studentId: req.user.id, status: 'InProgress'
        });

        if (!submission) {
            // Check attempt limit
            const completedCount = await Submission.countDocuments({
                testId, studentId: req.user.id, status: 'Submitted'
            });

            // Find if student has a specific override
            let maxAttempts = test.config?.maxAttempts || 1;
            const studentEmail = req.user.email; // We need email from the populated user or token

            if (studentEmail && test.config?.studentOverrides?.length > 0) {
                const override = test.config.studentOverrides.find(
                    o => o.email.toLowerCase() === studentEmail.toLowerCase()
                );
                if (override) {
                    maxAttempts = override.maxAttempts;
                }
            }

            if (completedCount >= maxAttempts) {
                return res.status(403).json({
                    success: false,
                    msg: `Maximum attempt limit reached (${maxAttempts}).`,
                    attemptsUsed: completedCount,
                    maxAttempts
                });
            }

            // Create new submission
            submission = await Submission.create({
                testId,
                studentId: req.user.id,
                orgId: test.orgId || null,
                ipAddress: req.ip || req.connection?.remoteAddress || null,
                answers: []
            });
        }

        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        console.error('startExam error:', err.message);
        res.status(500).json({ success: false, msg: err.message });
    }
};

// ─── Submit Exam ─────────────────────────────────────────────────────────────
exports.submitExam = async (req, res) => {
    try {
        const { testId, submissionId } = req.params;
        const { answers = [], isAutoSubmitted } = req.body;

        let submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ success: false, msg: 'Submission not found' });
        }
        if (submission.status === 'Submitted') {
            return res.status(200).json({ success: true, data: submission }); // idempotent
        }

        const test = await Test.findById(testId);
        const useNegativeMarking = test?.config?.negativeMarking || false;
        const negFrac = test?.config?.negativeMarkFrac || 0.25;

        let totalMarks = 0;
        const evaluatedAnswers = [];

        for (const ans of answers) {
            const question = await Question.findById(ans.questionId);
            if (!question) continue;

            let marksAwarded = 0;
            let status = 'Evaluated';

            // Normalize type comparison
            const qType = (question.type || '').toLowerCase();
            if (qType === 'mcq') {
                if (String(ans.answerData) === String(question.correctAnswer)) {
                    marksAwarded = question.marks || 1;
                } else if (ans.answerData && useNegativeMarking) {
                    marksAwarded = -((question.marks || 1) * negFrac);
                }
            } else if (qType === 'coding') {
                status = 'Pending'; // async evaluation
            }

            totalMarks += marksAwarded;
            evaluatedAnswers.push({
                questionId: question._id,
                type: question.type,
                answerData: ans.answerData,
                timeTaken: ans.timeTaken || 0,
                marks: marksAwarded,
                status
            });
        }

        submission.answers = evaluatedAnswers;
        submission.totalMarks = Math.max(0, totalMarks);
        submission.status = 'Submitted';
        submission.submitTime = new Date();
        submission.isAutoSubmitted = !!isAutoSubmitted;

        await submission.save();

        // ── Percentile & Rank (non-critical) ─────────────────────────────────
        try {
            const allSubs = await Submission.find({ testId, status: 'Submitted' }).select('totalMarks');
            const marks = allSubs.map(s => s.totalMarks).sort((a, b) => b - a);
            const myM = submission.totalMarks;
            const below = marks.filter(m => m < myM).length;
            const percentile = marks.length > 1 ? Math.round((below / (marks.length - 1)) * 100) : 100;
            const rank = marks.indexOf(myM) + 1;
            submission.percentile = percentile;
            submission.rank = rank;

            // Risk level
            const log = submission.proctorLog || {};
            const tabSw = log.tabSwitches || 0;
            const fsEx = log.fullscreenExits || 0;
            const cp = log.copyAttempts || 0;
            if (tabSw >= 5 || fsEx >= 5 || cp >= 3) {
                submission.proctorLog.riskLevel = 'High';
            } else if (tabSw >= 2 || fsEx >= 2 || cp >= 2) {
                submission.proctorLog.riskLevel = 'Medium';
            } else {
                submission.proctorLog.riskLevel = 'Low';
            }

            await submission.save();
        } catch (_) { /* non-critical */ }

        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        console.error('submitExam error:', err.message);
        res.status(500).json({ success: false, msg: err.message });
    }
};

// ─── Log Proctor Event (real-time) ──────────────────────────────────────────
// PATCH /api/submissions/:id/proctor-event
// Body: { type, message, timestamp }
exports.logProctorEvent = async (req, res) => {
    try {
        const { type, message, timestamp } = req.body;
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ success: false, msg: 'Submission not found' });
        }
        if (submission.studentId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, msg: 'Not authorized' });
        }
        // Allow logging even if submitted (edge case: log arrives after submit)
        if (!submission.proctorLog) submission.proctorLog = {};

        // Increment typed counters
        const countMap = {
            'TAB_SWITCH': 'tabSwitches',
            'FULLSCREEN_EXIT': 'fullscreenExits',
            'COPY_ATTEMPT': 'copyAttempts',
            'PASTE_ATTEMPT': 'pasteAttempts',
            'DEV_TOOLS': 'devToolsDetected',
            'DEVTOOLS': 'devToolsDetected'
        };
        const field = countMap[type];
        if (field) {
            submission.proctorLog[field] = (submission.proctorLog[field] || 0) + 1;
        }

        // Push to event log
        if (!Array.isArray(submission.proctorLog.flaggedEvents)) {
            submission.proctorLog.flaggedEvents = [];
        }
        submission.proctorLog.flaggedEvents.push({
            type,
            message: message || type,
            timestamp: timestamp ? new Date(timestamp) : new Date()
        });

        submission.markModified('proctorLog');
        await submission.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('logProctorEvent error:', err.message);
        res.status(500).json({ success: false, msg: err.message });
    }
};

// ─── Get My Submissions (student) ───────────────────────────────────────────
// GET /api/submissions/mine
exports.getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.user.id })
            .populate('testId', 'title duration description type difficulty')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: submissions });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// ─── Get Submissions by Test (teacher/admin) ─────────────────────────────────
// GET /api/submissions/test/:testId
exports.getSubmissionsByTest = async (req, res) => {
    try {
        const submissions = await Submission.find({ testId: req.params.testId })
            .populate('studentId', 'name email')
            .sort('-totalMarks');
        res.status(200).json({ success: true, count: submissions.length, data: submissions });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
