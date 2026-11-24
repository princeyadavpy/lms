const Course = require('../models/Course');
const Batch = require('../models/Batch');
const StudentProgress = require('../models/StudentProgress');
const User = require('../models/User');

// POST /api/courses â€” Create course
exports.createCourse = async (req, res) => {
    try {
        const { title, code, description, category, level, thumbnailUrl, modules, sequentialOrder, institutionRestrictions } = req.body;

        if (!title || !code) {
            return res.status(400).json({ success: false, msg: 'Title and code are required' });
        }

        const upperCode = code.trim().toUpperCase();
        const existing = await Course.findOne({ code: upperCode });
        if (existing) {
            return res.status(409).json({ success: false, msg: `Course with code "${upperCode}" already exists` });
        }

        const course = await Course.create({
            title,
            code: upperCode,
            description,
            category: category || 'DSA',
            level: level || 'Intermediate',
            thumbnailUrl,
            instructorId: req.user._id,
            instructorName: req.user.name,
            modules: modules || [],
            sequentialOrder: sequentialOrder !== false,
            institutionRestrictions: institutionRestrictions || []
        });

        res.status(201).json({ success: true, data: course });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/courses â€” List courses (All visible in catalog, isEnrolled flag calculated for students)
exports.getCourses = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Student') {
            query.published = true;
        }

        const courses = await Course.find(query)
            .populate('allocatedInstitutions', 'name code domain')
            .select('title code description category level thumbnailUrl totalLessonsCount totalModulesCount estimatedTotalHours instructorName allocatedInstitutions published modules.title modules.quiz modules.orderIndex modules.lessons._id')
            .sort('-createdAt')
            .lean();

        // If student, compute isEnrolled & progress
        if (req.user.role === 'Student') {
            const batches = await Batch.find({ students: req.user._id }).select('assignedCourses');
            const batchCourseIds = batches.flatMap(b => (b.assignedCourses || []).map(id => id.toString()));
            const userEnrolledIds = (req.user.enrolledCourses || []).map(id => id.toString());
            const userInstIdStr = req.user.institutionId ? req.user.institutionId.toString() : null;

            const progressList = await StudentProgress.find({
                studentId: req.user._id,
                courseId: { $in: courses.map(c => c._id) }
            }).lean();

            const progressMap = new Map();
            progressList.forEach(p => progressMap.set(p.courseId.toString(), p));

            const enriched = courses.map(c => {
                const cIdStr = c._id.toString();
                const inBatch = batchCourseIds.includes(cIdStr);
                const inUserEnrolled = userEnrolledIds.includes(cIdStr);
                const inInstAllocated = userInstIdStr && (c.allocatedInstitutions || []).some(inst => (inst._id || inst).toString() === userInstIdStr);
                const isEnrolled = Boolean(inBatch || inUserEnrolled || inInstAllocated);

                const prog = progressMap.get(cIdStr);
                const completedLessonIds = new Set((prog?.completedLessons || []).map(cl => cl.lessonId.toString()));
                const quizAttempts = prog?.quizAttempts || [];
                const courseQuizzes = (c.modules || []).filter(m => m.quiz && m.quiz.questions && m.quiz.questions.length > 0).map(m => {
                    const modLessons = m.lessons || [];
                    const isModCompleted = modLessons.length > 0 && modLessons.every(l => completedLessonIds.has(l._id.toString()));
                    const attempt = quizAttempts.find(qa => qa.moduleId.toString() === m._id.toString());
                    return {
                        moduleId: m._id,
                        orderIndex: m.orderIndex,
                        title: m.quiz.title || `${m.title} Exam`,
                        moduleTitle: m.title,
                        timeLimit: m.quiz.timeLimitMinutes || 15,
                        passingScorePercent: m.quiz.passingScorePercent || 60,
                        questionsCount: m.quiz.questions.length,
                        maxMarks: m.quiz.questions.length * 5,
                        isLocked: !isModCompleted,
                        isCompleted: Boolean(attempt && attempt.passed),
                        score: attempt?.score || 0,
                        percentage: attempt?.percentage || 0,
                        attemptsCount: quizAttempts.filter(qa => qa.moduleId.toString() === m._id.toString()).length
                    };
                });

                return {
                    ...c,
                    isEnrolled,
                    overallPercentage: isEnrolled && prog ? prog.overallPercentage : 0,
                    timeSpentMinutes: isEnrolled && prog ? prog.totalTimeSpentMinutes : 0,
                    completedLessonsCount: isEnrolled && prog ? prog.completedLessons.length : 0,
                    currentGradePercent: isEnrolled && prog ? prog.currentGradePercent : 0,
                    quizzes: courseQuizzes,
                    status: !isEnrolled ? 'Locked' : (prog && prog.overallPercentage === 100 ? 'Completed' : (prog && prog.overallPercentage > 0 ? 'In Progress' : 'Not Started'))
                };
            });

            return res.status(200).json({ success: true, count: enriched.length, data: enriched });
        }

        // For Admin / Teachers, attach enrolled student counts and batch counts
        const enrichedForAdmin = await Promise.all(courses.map(async (c) => {
            const studentCount = await User.countDocuments({ enrolledCourses: c._id });
            const batchCount = await Batch.countDocuments({ assignedCourses: c._id });
            return {
                ...c,
                enrolledStudentsCount: studentCount,
                assignedBatchesCount: batchCount,
                allocatedInstitutionsCount: (c.allocatedInstitutions || []).length
            };
        }));

        res.status(200).json({ success: true, count: enrichedForAdmin.length, data: enrichedForAdmin });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/courses/:id/curriculum â€” Dedicated Course Learning Interface Sidebar & State
exports.getCourseCurriculum = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('allocatedInstitutions', 'name code')
            .lean();
        if (!course) {
            return res.status(404).json({ success: false, msg: 'Course not found' });
        }

        // Security check for student: must belong to a batch that has this course, or be enrolled, or college allocated
        if (req.user.role === 'Student') {
            const inBatch = await Batch.exists({ students: req.user._id, assignedCourses: course._id });
            const inUserEnrolled = req.user.enrolledCourses?.some(id => id.toString() === course._id.toString());
            const userInstIdStr = req.user.institutionId ? req.user.institutionId.toString() : null;
            const inInstAllocated = userInstIdStr && (course.allocatedInstitutions || []).some(inst => (inst._id || inst).toString() === userInstIdStr);

            if (!inBatch && !inUserEnrolled && !inInstAllocated) {
                return res.status(403).json({
                    success: false,
                    isLocked: true,
                    msg: 'Access restricted. This course has not been allocated to your account or institution by an administrator.'
                });
            }
        }

        let progress = null;
        if (req.user.role === 'Student') {
            progress = await StudentProgress.findOne({ studentId: req.user._id, courseId: course._id }).lean();
            if (!progress) {
                const firstModuleId = course.modules?.[0]?._id;
                const firstLessonId = course.modules?.[0]?.lessons?.[0]?._id;
                progress = await StudentProgress.create({
                    studentId: req.user._id,
                    courseId: course._id,
                    institutionId: req.user.institutionId,
                    batchId: req.user.batchIds?.[0] || null,
                    unlockedModules: firstModuleId ? [firstModuleId] : [],
                    currentActiveModuleId: firstModuleId,
                    currentActiveLessonId: firstLessonId
                });
                progress = progress.toObject();
            }
        }

        const unlockedSet = new Set((progress?.unlockedModules || []).map(id => id.toString()));
        const completedLessonSet = new Set((progress?.completedLessons || []).map(cl => cl.lessonId.toString()));
        const completedModuleSet = new Set((progress?.completedModules || []).map(cm => cm.moduleId.toString()));
        const overridesSet = new Set((progress?.adminOverrides || []).map(ao => ao.moduleId.toString()));

        // Build structured modules with locked/completed status
        const structuredModules = (course.modules || []).map((m, index) => {
            const moduleIdStr = m._id.toString();
            const isFirst = index === 0;
            const isUnlocked = isFirst || unlockedSet.has(moduleIdStr) || overridesSet.has(moduleIdStr) || req.user.role !== 'Student';
            const isCompleted = completedModuleSet.has(moduleIdStr);

            const lessons = (m.lessons || []).map(l => ({
                _id: l._id,
                orderIndex: l.orderIndex,
                title: l.title,
                estimatedMinutes: l.estimatedMinutes,
                contentType: l.contentType,
                isCompleted: completedLessonSet.has(l._id.toString()),
                isLocked: !isUnlocked
            }));

            const completedCount = lessons.filter(l => l.isCompleted).length;
            const moduleProgressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
            const quizPassed = (progress?.quizAttempts || []).some(qa => qa.moduleId.toString() === moduleIdStr && qa.passed);

            return {
                _id: m._id,
                orderIndex: m.orderIndex,
                title: m.title,
                description: m.description,
                isLocked: !isUnlocked,
                isCompleted: isCompleted || (lessons.length > 0 && completedCount === lessons.length),
                progressPercent: moduleProgressPercent,
                lessonsCount: lessons.length,
                lessons,
                quizPassed: Boolean(quizPassed),
                hasQuiz: Boolean(m.quiz && m.quiz.questions && m.quiz.questions.length > 0),
                quizTitle: m.quiz?.title || 'Module Quiz',
                quiz: m.quiz && m.quiz.questions && m.quiz.questions.length > 0 ? {
                    title: m.quiz.title,
                    passingScorePercent: m.quiz.passingScorePercent || 60,
                    timeLimitMinutes: m.quiz.timeLimitMinutes || 15,
                    questions: (m.quiz.questions || []).map((q, qIdx) => ({
                        _id: q._id || qIdx,
                        questionText: q.questionText,
                        type: q.type,
                        options: q.options,
                        marks: q.marks || 5
                    }))
                } : null,
                hasAssessment: Boolean(m.assessment && m.assessment.codingProblem?.problemStatement),
                assessmentTitle: m.assessment?.title || 'Module Assessment',
                assessment: m.assessment && m.assessment.codingProblem?.problemStatement ? {
                    title: m.assessment.title,
                    type: m.assessment.type,
                    codingProblem: m.assessment.codingProblem
                } : null
            };
        });

        res.status(200).json({
            success: true,
            data: {
                courseId: course._id,
                title: course.title,
                code: course.code,
                category: course.category,
                level: course.level,
                overallPercentage: progress?.overallPercentage || 0,
                timeSpentMinutes: progress?.totalTimeSpentMinutes || 0,
                currentActiveModuleId: progress?.currentActiveModuleId || structuredModules[0]?._id,
                currentActiveLessonId: progress?.currentActiveLessonId || structuredModules[0]?.lessons?.[0]?._id,
                quizAttempts: progress?.quizAttempts || [],
                modules: structuredModules
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/courses/:courseId/modules/:moduleId/lessons/:lessonId â€” Get Lesson Content (Protected by checkContentLock)
exports.getLessonContent = async (req, res) => {
    try {
        const { courseId, moduleId, lessonId } = req.params;
        const course = await Course.findById(courseId).lean();
        if (!course) return res.status(404).json({ success: false, msg: 'Course not found' });

        const moduleItem = course.modules?.find(m => m._id.toString() === moduleId);
        if (!moduleItem) return res.status(404).json({ success: false, msg: 'Module not found' });

        const lesson = moduleItem.lessons?.find(l => l._id.toString() === lessonId);
        if (!lesson) return res.status(404).json({ success: false, msg: 'Lesson not found' });

        // Calculate next and previous navigation
        let prevLesson = null;
        let nextLesson = null;

        const allLessons = [];
        course.modules.forEach(m => {
            (m.lessons || []).forEach(l => {
                allLessons.push({ moduleId: m._id, moduleTitle: m.title, lessonId: l._id, title: l.title });
            });
        });

        const currentIndex = allLessons.findIndex(al => al.lessonId.toString() === lessonId);
        if (currentIndex > 0) prevLesson = allLessons[currentIndex - 1];
        if (currentIndex >= 0 && currentIndex < allLessons.length - 1) nextLesson = allLessons[currentIndex + 1];

        // Update active lesson pointer in student progress
        if (req.user.role === 'Student') {
            await StudentProgress.findOneAndUpdate(
                { studentId: req.user._id, courseId },
                {
                    $set: {
                        currentActiveModuleId: moduleId,
                        currentActiveLessonId: lessonId,
                        lastAccessedAt: new Date()
                    }
                }
            );
        }

        res.status(200).json({
            success: true,
            data: {
                courseId,
                courseTitle: course.title,
                moduleId,
                moduleTitle: moduleItem.title,
                lesson: {
                    ...lesson,
                    quiz: moduleItem.quiz ? {
                        title: moduleItem.quiz.title,
                        totalQuestions: moduleItem.quiz.questions?.length || 0,
                        timeLimitMinutes: moduleItem.quiz.timeLimitMinutes,
                        passingScorePercent: moduleItem.quiz.passingScorePercent
                    } : null,
                    assessment: moduleItem.assessment ? {
                        title: moduleItem.assessment.title,
                        type: moduleItem.assessment.type,
                        maxMarks: moduleItem.assessment.maxMarks,
                        codingProblem: moduleItem.assessment.codingProblem ? {
                            title: moduleItem.assessment.codingProblem.title,
                            problemStatement: moduleItem.assessment.codingProblem.problemStatement,
                            sampleTestCases: moduleItem.assessment.codingProblem.sampleTestCases,
                            starterCode: moduleItem.assessment.codingProblem.starterCode,
                            difficulty: moduleItem.assessment.codingProblem.difficulty,
                            marks: moduleItem.assessment.codingProblem.marks
                        } : null
                    } : null
                },
                prevLesson,
                nextLesson
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/courses/:courseId/modules/:moduleId/lessons/:lessonId/complete â€” Mark Lesson Completed
exports.markLessonComplete = async (req, res) => {
    try {
        const { courseId, moduleId, lessonId } = req.params;
        const { timeSpentSeconds = 60 } = req.body;
        const studentId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, msg: 'Course not found' });

        let progress = await StudentProgress.findOne({ studentId, courseId });
        if (!progress) {
            progress = await StudentProgress.create({
                studentId,
                courseId,
                institutionId: req.user.institutionId,
                batchId: req.user.batchIds?.[0] || null,
                unlockedModules: [course.modules[0]._id]
            });
        }

        // Add lesson to completedLessons if not already present
        const alreadyDone = progress.completedLessons.some(cl => cl.lessonId.toString() === lessonId);
        if (!alreadyDone) {
            progress.completedLessons.push({
                lessonId,
                moduleId,
                completedAt: new Date(),
                timeSpentSeconds
            });
            progress.totalTimeSpentMinutes += Math.round(timeSpentSeconds / 60);
        }

        // Recompute overall percentage
        let totalCourseLessons = 0;
        course.modules.forEach(m => {
            totalCourseLessons += (m.lessons || []).length;
        });

        const completedCount = progress.completedLessons.length;
        progress.overallPercentage = totalCourseLessons > 0 ? Math.min(100, Math.round((completedCount / totalCourseLessons) * 100)) : 100;

        // Check if all lessons in current module are finished
        const currentModule = course.modules.find(m => m._id.toString() === moduleId);
        const moduleLessonIds = new Set((currentModule?.lessons || []).map(l => l._id.toString()));
        const completedModuleLessons = progress.completedLessons.filter(cl => moduleLessonIds.has(cl.lessonId.toString()));
        const isModuleFullyRead = completedModuleLessons.length === moduleLessonIds.size;

        let nextModuleUnlocked = false;
        let nextModule = null;

        // If module has no quiz or quiz already passed, automatically unlock next module!
        const hasQuiz = currentModule?.quiz && currentModule.quiz.questions && currentModule.quiz.questions.length > 0;
        const quizPassed = progress.quizAttempts?.some(qa => qa.moduleId.toString() === moduleId && qa.passed);

        if (isModuleFullyRead && (!hasQuiz || quizPassed)) {
            // Mark module completed in progress
            if (!progress.completedModules.some(cm => cm.moduleId.toString() === moduleId)) {
                progress.completedModules.push({
                    moduleId,
                    completedAt: new Date(),
                    quizPassed: Boolean(quizPassed)
                });
            }

            // Unlock next module
            const currentModuleIndex = course.modules.findIndex(m => m._id.toString() === moduleId);
            if (currentModuleIndex >= 0 && currentModuleIndex < course.modules.length - 1) {
                nextModule = course.modules[currentModuleIndex + 1];
                const nextModuleIdStr = nextModule._id.toString();
                if (!progress.unlockedModules.some(id => id.toString() === nextModuleIdStr)) {
                    progress.unlockedModules.push(nextModule._id);
                    nextModuleUnlocked = true;
                }
            }
        }

        await progress.save();

        res.status(200).json({
            success: true,
            data: {
                overallPercentage: progress.overallPercentage,
                completedLessonsCount: progress.completedLessons.length,
                isModuleFullyRead,
                nextModuleUnlocked,
                nextModule: nextModule ? { id: nextModule._id, title: nextModule.title } : null
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/courses/:courseId/modules/:moduleId/quiz â€” Get Module Quiz Questions
exports.getModuleQuiz = async (req, res) => {
    try {
        const { courseId, moduleId } = req.params;
        const course = await Course.findById(courseId).lean();
        if (!course) return res.status(404).json({ success: false, msg: 'Course not found' });

        const moduleItem = course.modules?.find(m => m._id.toString() === moduleId);
        if (!moduleItem || !moduleItem.quiz) {
            return res.status(404).json({ success: false, msg: 'Quiz not found for this module' });
        }

        // Student prerequisite enforcement: Must complete all lessons in this module before accessing quiz
        if (req.user && req.user.role === 'Student') {
            const progress = await StudentProgress.findOne({ studentId: req.user._id, courseId }).lean();
            const completedLessonSet = new Set((progress?.completedLessons || []).map(cl => cl.lessonId.toString()));
            const moduleLessonIds = (moduleItem.lessons || []).map(l => l._id.toString());
            const isCompleted = moduleLessonIds.length > 0 && moduleLessonIds.every(id => completedLessonSet.has(id));
            const hasModuleOverride = (progress?.adminOverrides || []).some(ao => ao.moduleId.toString() === moduleId);
            if (!isCompleted && !hasModuleOverride) {
                return res.status(403).json({
                    success: false,
                    isLocked: true,
                    msg: 'Module Examination is locked. You must complete all lesson topics in this module before accessing the examination.'
                });
            }
        }

        // Return questions without exposing correctAnswer to student
        const sanitizedQuestions = (moduleItem.quiz.questions || []).map((q, idx) => ({
            _id: q._id || idx,
            questionText: q.questionText,
            type: q.type,
            options: q.options,
            marks: q.marks
        }));

        res.status(200).json({
            success: true,
            data: {
                title: moduleItem.quiz.title,
                passingScorePercent: moduleItem.quiz.passingScorePercent,
                timeLimitMinutes: moduleItem.quiz.timeLimitMinutes,
                questions: sanitizedQuestions
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/courses/:courseId/modules/:moduleId/quiz/submit â€” Submit Module Quiz
exports.submitModuleQuiz = async (req, res) => {
    try {
        const { courseId, moduleId } = req.params;
        const { answers } = req.body; // { questionIndex: selectedAnswer }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, msg: 'Course not found' });

        const moduleIndex = course.modules.findIndex(m => m._id.toString() === moduleId);
        if (moduleIndex === -1) return res.status(404).json({ success: false, msg: 'Module not found' });

        const moduleItem = course.modules[moduleIndex];
        const quiz = moduleItem.quiz;
        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            return res.status(400).json({ success: false, msg: 'No quiz questions configured' });
        }

        // Student prerequisite enforcement: Must complete all lessons in this module before submitting quiz
        if (req.user && req.user.role === 'Student') {
            const progress = await StudentProgress.findOne({ studentId: req.user._id, courseId }).lean();
            const completedLessonSet = new Set((progress?.completedLessons || []).map(cl => cl.lessonId.toString()));
            const moduleLessonIds = (moduleItem.lessons || []).map(l => l._id.toString());
            const isCompleted = moduleLessonIds.length > 0 && moduleLessonIds.every(id => completedLessonSet.has(id));
            const hasModuleOverride = (progress?.adminOverrides || []).some(ao => ao.moduleId.toString() === moduleId);
            if (!isCompleted && !hasModuleOverride) {
                return res.status(403).json({
                    success: false,
                    isLocked: true,
                    msg: 'Module Examination is locked. You must complete all lesson topics in this module before submitting the examination.'
                });
            }
        }

        let totalMarks = 0;
        let earnedMarks = 0;
        const review = [];

        quiz.questions.forEach((q, idx) => {
            const studentAns = answers ? answers[idx] : undefined;
            const correctAns = q.correctAnswer;
            totalMarks += q.marks;

            const isCorrect = String(studentAns).trim().toLowerCase() === String(correctAns).trim().toLowerCase();
            if (isCorrect) earnedMarks += q.marks;

            review.push({
                questionText: q.questionText,
                studentAnswer: studentAns !== undefined ? studentAns : 'Not Attempted',
                correctAnswer: correctAns,
                explanation: q.explanation,
                isCorrect,
                marksAwarded: isCorrect ? q.marks : 0
            });
        });

        const percentage = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
        const passed = percentage >= (quiz.passingScorePercent || 60);

        // Record in student progress
        let progress = await StudentProgress.findOne({ studentId: req.user._id, courseId });
        if (!progress) {
            progress = await StudentProgress.create({
                studentId: req.user._id,
                courseId,
                institutionId: req.user.institutionId,
                unlockedModules: [course.modules[0]._id]
            });
        }

        progress.quizAttempts.push({
            moduleId,
            score: earnedMarks,
            maxScore: totalMarks,
            percentage,
            passed,
            answers,
            attemptedAt: new Date()
        });

        let nextModuleUnlocked = false;
        let nextModule = null;

        if (passed) {
            // Unlock next module
            if (moduleIndex < course.modules.length - 1) {
                nextModule = course.modules[moduleIndex + 1];
                const nextModuleIdStr = nextModule._id.toString();
                if (!progress.unlockedModules.some(id => id.toString() === nextModuleIdStr)) {
                    progress.unlockedModules.push(nextModule._id);
                    nextModuleUnlocked = true;
                }
            }

            // Mark module completed
            if (!progress.completedModules.some(cm => cm.moduleId.toString() === moduleId)) {
                progress.completedModules.push({
                    moduleId,
                    completedAt: new Date(),
                    quizPassed: true,
                    quizScorePercent: percentage
                });
            }
        }

        await progress.save();

        res.status(200).json({
            success: true,
            data: {
                score: earnedMarks,
                maxScore: totalMarks,
                percentage,
                passed,
                passingScorePercent: quiz.passingScorePercent,
                nextModuleUnlocked,
                nextModule: nextModule ? { id: nextModule._id, title: nextModule.title } : null,
                review
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/courses/:courseId/modules/:moduleId/override-unlock â€” Instructor/Admin Override to Unlock Module
exports.adminUnlockOverride = async (req, res) => {
    try {
        const { courseId, moduleId } = req.params;
        const { studentId, reason } = req.body;

        if (!studentId) {
            return res.status(400).json({ success: false, msg: 'studentId is required' });
        }

        let progress = await StudentProgress.findOne({ studentId, courseId });
        if (!progress) {
            progress = await StudentProgress.create({
                studentId,
                courseId,
                unlockedModules: []
            });
        }

        if (!progress.unlockedModules.some(id => id.toString() === moduleId)) {
            progress.unlockedModules.push(moduleId);
        }

        progress.adminOverrides.push({
            moduleId,
            unlockedBy: req.user._id,
            unlockedByName: req.user.name,
            reason: reason || 'Instructor emergency authorization',
            unlockedAt: new Date()
        });

        await progress.save();

        res.status(200).json({
            success: true,
            msg: 'Module unlocked successfully for student',
            data: { unlockedModules: progress.unlockedModules }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// PUT /api/courses/:id/institutions â€” Allocate course to institutions/colleges
exports.allocateInstitutions = async (req, res) => {
    try {
        const { institutionIds } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, msg: 'Course not found' });
        }

        course.allocatedInstitutions = Array.isArray(institutionIds) ? institutionIds : [];
        await course.save();

        const populated = await Course.findById(course._id)
            .populate('allocatedInstitutions', 'name code domain')
            .lean();

        res.status(200).json({ success: true, data: populated });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/courses/:id/students â€” Allocate/enroll or remove individual students
exports.allocateStudents = async (req, res) => {
    try {
        const { studentIds, action } = req.body; // action: 'enroll' | 'remove'
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, msg: 'Course not found' });
        }

        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ success: false, msg: 'studentIds array is required' });
        }

        if (action === 'remove') {
            await User.updateMany(
                { _id: { $in: studentIds } },
                { $pull: { enrolledCourses: course._id } }
            );
        } else {
            await User.updateMany(
                { _id: { $in: studentIds } },
                { $addToSet: { enrolledCourses: course._id } }
            );
        }

        res.status(200).json({
            success: true,
            msg: `Successfully ${action === 'remove' ? 'removed access for' : 'allocated course to'} ${studentIds.length} student(s)`
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/courses/:id/allocations â€” Get current allocations (institutions & enrolled students)
exports.getCourseAllocations = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('allocatedInstitutions', 'name code domain')
            .lean();
        if (!course) {
            return res.status(404).json({ success: false, msg: 'Course not found' });
        }

        const enrolledStudents = await User.find({ enrolledCourses: course._id })
            .select('name email role institutionId batchIds createdAt')
            .populate('institutionId', 'name code')
            .populate('batchIds', 'name code')
            .lean();

        res.status(200).json({
            success: true,
            data: {
                courseId: course._id,
                title: course.title,
                code: course.code,
                allocatedInstitutions: course.allocatedInstitutions || [],
                enrolledStudents: enrolledStudents || []
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// PUT /api/courses/:id â€” Update course details
exports.updateCourse = async (req, res) => {
    try {
        const { title, code, description, category, level, estimatedTotalHours, published } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, msg: 'Course not found' });
        }

        if (title) course.title = title;
        if (code) course.code = code.trim().toUpperCase();
        if (description !== undefined) course.description = description;
        if (category) course.category = category;
        if (level) course.level = level;
        if (estimatedTotalHours !== undefined) course.estimatedTotalHours = estimatedTotalHours;
        if (published !== undefined) course.published = published;

        await course.save();
        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// DELETE /api/courses/:id â€” Delete course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, msg: 'Course not found' });
        }

        await Course.findByIdAndDelete(req.params.id);
        await Batch.updateMany({ assignedCourses: req.params.id }, { $pull: { assignedCourses: req.params.id } });
        await User.updateMany({ enrolledCourses: req.params.id }, { $pull: { enrolledCourses: req.params.id } });

        res.status(200).json({ success: true, msg: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};


// GET /api/courses/progress/my - All StudentProgress records for logged-in student
exports.getMyProgress = async (req, res) => {
    try {
        const progressList = await StudentProgress.find({
            studentId: req.user._id
        }).lean();

        const progressMap = {};
        progressList.forEach(p => {
            progressMap[p.courseId.toString()] = {
                overallPercentage: p.overallPercentage || 0,
                totalTimeSpentMinutes: p.totalTimeSpentMinutes || 0,
                currentGradePercent: p.currentGradePercent || 0,
                completedLessonsCount: (p.completedLessons || []).length,
                lastAccessedAt: p.lastAccessedAt
            };
        });

        return res.status(200).json({ success: true, data: progressMap });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
