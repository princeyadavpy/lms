const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
    createBatch,
    getBatches,
    getBatchById,
    updateBatch,
    deleteBatch,
    assignCoursesToBatch,
    assignExamsToBatch,
    bulkEnrollStudents
} = require('../controllers/batchController');

router.use(protect);

router.route('/')
    .get(getBatches)
    .post(authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher', 'Instructor'), createBatch);

router.route('/:id')
    .get(getBatchById)
    .patch(authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher', 'Instructor'), updateBatch)
    .delete(authorize('Admin', 'SuperAdmin', 'InstitutionAdmin'), deleteBatch);

router.post('/:id/assign-courses', authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher', 'Instructor'), assignCoursesToBatch);
router.post('/:id/assign-exams', authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher', 'Instructor'), assignExamsToBatch);
router.post('/:id/bulk-enroll', authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher', 'Instructor'), bulkEnrollStudents);

module.exports = router;

