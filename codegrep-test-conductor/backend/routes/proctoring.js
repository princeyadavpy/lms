const express = require('express');
const { logVMDetection } = require('../controllers/proctorController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// POST /api/proctoring/vm-detection
// Records a VM detection result for a given submission
router.post('/vm-detection', protect, logVMDetection);

module.exports = router;
