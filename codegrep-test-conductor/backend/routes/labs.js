const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
    getPracticeLabs,
    getLabById,
    runLabCode,
    submitLabCode,
    createPracticeLab
} = require('../controllers/labController');

router.use(protect);

router.route('/')
    .get(getPracticeLabs)
    .post(authorize('Admin', 'SuperAdmin', 'Teacher', 'Instructor'), createPracticeLab);

router.get('/:id', getLabById);
router.post('/:id/run', runLabCode);
router.post('/:id/submit', submitLabCode);

module.exports = router;

