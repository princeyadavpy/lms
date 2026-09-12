const express = require('express');
const { runCode, submitCode, healthCheck } = require('../controllers/executeController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/health', healthCheck);          // public — for ping check
router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);

module.exports = router;
