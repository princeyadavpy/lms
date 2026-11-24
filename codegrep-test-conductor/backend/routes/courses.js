const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const checkContentLock = require('../middlewares/checkContentLock');
const {
    createCourse,
    getCourses,
    getCourseCurriculum,
    getLessonContent,
    markLessonComplete,
    getModuleQuiz,
    submitModuleQuiz,
    adminUnlockOverride,
    allocateInstitutions,
    allocateStudents,
    getCourseAllocations,
    updateCourse,
    deleteCourse,
    getMyProgress
} = require('../controllers/courseController');

router.use(protect);

router.route('/')
    .get(getCourses)
    .post(authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher', 'Instructor'), createCourse);

// Student progress — MUST be before /:id to avoid "progress" being captured as id
router.get('/progress/my', getMyProgress);

router.route('/:id')
    .put(authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher'), updateCourse)
    .delete(authorize('Admin', 'SuperAdmin'), deleteCourse);

router.get('/:id/curriculum', getCourseCurriculum);

// Admin / Teacher Allocations
router.put('/:id/institutions', authorize('Admin', 'SuperAdmin', 'InstitutionAdmin'), allocateInstitutions);
router.post('/:id/students', authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher'), allocateStudents);
router.get('/:id/allocations', authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher'), getCourseAllocations);

// Lesson view with strict content lock checking
router.get('/:courseId/modules/:moduleId/lessons/:lessonId', checkContentLock, getLessonContent);
router.post('/:courseId/modules/:moduleId/lessons/:lessonId/complete', markLessonComplete);

// Module Quiz
router.get('/:courseId/modules/:moduleId/quiz', checkContentLock, getModuleQuiz);
router.post('/:courseId/modules/:moduleId/quiz/submit', submitModuleQuiz);

// Instructor Override
router.post('/:courseId/modules/:moduleId/override-unlock', authorize('Admin', 'SuperAdmin', 'InstitutionAdmin', 'Teacher', 'Instructor'), adminUnlockOverride);

module.exports = router;
