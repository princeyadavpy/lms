const Course = require('../models/Course');
const StudentProgress = require('../models/StudentProgress');

/**
 * Middleware: Enforces strict sequential module and lesson progression
 */
module.exports = async function checkContentLock(req, res, next) {
    try {
        const { courseId, moduleId } = req.params;
        const user = req.user;

        // 1. Admins and Teachers can preview all content freely
        if (['Admin', 'SuperAdmin', 'Teacher', 'Instructor'].includes(user.role)) {
            return next();
        }

        if (!courseId) return next();

        const course = await Course.findById(courseId).select('modules sequentialOrder title');
        if (!course) {
            return res.status(404).json({ success: false, msg: 'Course not found' });
        }

        // If sequential progression is disabled for this course, allow access
        if (!course.sequentialOrder) {
            return next();
        }

        // 2. Fetch or initialize student progress
        let progress = await StudentProgress.findOne({ studentId: user._id, courseId });
        const firstModuleId = course.modules?.[0]?._id?.toString();

        if (!progress) {
            progress = await StudentProgress.create({
                studentId: user._id,
                courseId: course._id,
                institutionId: user.institutionId,
                batchId: user.batchIds?.[0] || null,
                unlockedModules: firstModuleId ? [firstModuleId] : [],
                currentActiveModuleId: firstModuleId,
                currentActiveLessonId: course.modules?.[0]?.lessons?.[0]?._id
            });
        }

        // Modules & lessons are freely accessible in any order; only module quizzes require completing that module's lessons
        const isQuizRequest = req.originalUrl && req.originalUrl.includes('/quiz');
        if (!isQuizRequest || !moduleId) {
            return next();
        }

        const targetModuleIdStr = moduleId.toString();
        const hasOverride = progress.adminOverrides?.some(ao => ao.moduleId.toString() === targetModuleIdStr);
        if (hasOverride) {
            return next();
        }

        const targetModule = course.modules.find(m => m._id.toString() === targetModuleIdStr);
        const modLessons = targetModule?.lessons || [];
        const completedLessonIds = new Set((progress.completedLessons || []).map(cl => cl.lessonId.toString()));
        const allModLessonsCompleted = modLessons.length === 0 || modLessons.every(l => completedLessonIds.has(l._id.toString()));

        if (allModLessonsCompleted) {
            return next();
        }

        return res.status(403).json({
            success: false,
            code: 'CONTENT_LOCKED',
            msg: `Complete all lessons in "${targetModule?.title || 'this module'}" before taking the quiz.`
        });
    } catch (err) {
        console.error('Content lock middleware error:', err);
        return res.status(500).json({ success: false, msg: 'Error evaluating content access' });
    }
};

