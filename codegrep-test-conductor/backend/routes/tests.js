const express = require('express');
const { createTest, getTests, getTestById, updateTest, publishTest, getTestByCode } = require('../controllers/testController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Join by access code (must be before /:id routes)
router.get('/join/:code', protect, getTestByCode);

router.route('/')
    .get(protect, getTests)
    .post(protect, authorize('Admin', 'Teacher'), createTest);

router.route('/:id')
    .get(protect, getTestById)
    .put(protect, authorize('Admin', 'Teacher'), updateTest);

router.patch('/:id/publish', protect, authorize('Admin', 'Teacher'), publishTest);

module.exports = router;
