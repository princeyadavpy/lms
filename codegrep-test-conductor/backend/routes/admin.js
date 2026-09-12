const express = require('express');
const {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    updateUserRole,
    toggleUserStatus,
    createUser,
    bulkCreateUsers,
    quickBulkCreateUsers,
    getAllTests,
    deleteTest,
    getAllSubmissions,
    deleteSubmission,
    exportSubmissionsToExcel,
    gradeSubmissionAnswer
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();
const adminOnly = [protect, authorize('Admin')];

// Dashboard
router.get('/dashboard', ...adminOnly, getDashboardStats);

// User Management
router.get('/users', ...adminOnly, getAllUsers);
router.post('/users', ...adminOnly, createUser);
router.post('/users/bulk', ...adminOnly, bulkCreateUsers);
router.post('/users/bulk-quick', ...adminOnly, quickBulkCreateUsers);
router.delete('/users/:id', ...adminOnly, deleteUser);
router.put('/users/:id/role', ...adminOnly, updateUserRole);
router.patch('/users/:id/toggle-status', ...adminOnly, toggleUserStatus);

// Test Management
router.get('/tests', ...adminOnly, getAllTests);
router.delete('/tests/:id', ...adminOnly, deleteTest);

const adminOrTeacher = [protect, authorize('Admin', 'Teacher')];

// Submission Management
router.get('/submissions', ...adminOrTeacher, getAllSubmissions);
router.get('/submissions/export/:testId', ...adminOrTeacher, exportSubmissionsToExcel);
router.delete('/submissions/:id', ...adminOrTeacher, deleteSubmission);
router.put('/submissions/:id/grade/:questionId', ...adminOrTeacher, gradeSubmissionAnswer);

module.exports = router;
