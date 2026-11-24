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

        // If no specific moduleId in request (e.g. general course metadata), proceed
        if (!moduleId) return next();

        const targetModuleIdStr = moduleId.toString();

        // 3. First module is always unlocked
        if (firstModuleId && firstModuleId === targetModuleIdStr) {
            return next();
        }

        // 4. Check if module is already explicitly unlocked or overridden
        const isUnlocked = progress.unlockedModules?.some(id => id.toString() === targetModuleIdStr);
        const hasOverride = progress.adminOverrides?.some(ao => ao.moduleId.toString() === targetModuleIdStr);

        if (isUnlocked || hasOverride) {
            return next();
        }

        // 5. Evaluate sequential prerequisite
        const moduleIndex = course.modules.findIndex(m => m._id.toString() === targetModuleIdStr);
        if (moduleIndex <= 0) {
            return next();
        }

        const prevModule = course.modules[moduleIndex - 1];
        const prevModuleIdStr = prevModule._id.toString();

        // Check if previous module was completed
        const prevCompleted = progress.completedModules?.some(cm => cm.moduleId.toString() === prevModuleIdStr);

        // Also check if all lessons in previous module are completed
        const prevLessons = prevModule.lessons || [];
        const completedLessonIds = new Set(progress.completedLessons.map(cl => cl.lessonId.toString()));
        const allPrevLessonsCompleted = prevLessons.every(l => completedLessonIds.has(l._id.toString()));

        // Check if previous module quiz was passed (if quiz exists)
        let quizPassed = true;
        if (prevModule.quiz && prevModule.quiz.questions && prevModule.quiz.questions.length > 0) {
            const quizAttempt = progress.quizAttempts?.find(qa => qa.moduleId.toString() === prevModuleIdStr && qa.passed);
            quizPassed = Boolean(quizAttempt);
        }

        if (prevCompleted || (allPrevLessonsCompleted && quizPassed)) {
            // Unlock target module
            if (!progress.unlockedModules.includes(targetModuleIdStr)) {
                progress.unlockedModules.push(targetModuleIdStr);
                await progress.save();
            }
            return next();
        }

        // Content is locked! Return clear, actionable message
        return res.status(403).json({
            success: false,
            code: 'CONTENT_LOCKED',
            msg: `Complete "${prevModule.title}" before accessing "${course.modules[moduleIndex].title}".`,
            requiredModule: {
                id: prevModule._id,
                title: prevModule.title,
                allLessonsDone: allPrevLessonsCompleted,
                quizPassed
            }
        });

    } catch (err) {
        console.error('Content lock middleware error:', err);
        return res.status(500).json({ success: false, msg: 'Error evaluating content access' });
    }
};

