const Batch = require('../models/Batch');
const Organization = require('../models/Organization');
const User = require('../models/User');
const Course = require('../models/Course');
const Test = require('../models/Test');
const StudentProgress = require('../models/StudentProgress');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');

// POST /api/batches — Create batch
exports.createBatch = async (req, res) => {
    try {
        const { name, code, institutionId, description, startDate, endDate, assignedCourses, assignedExams, maxStudents } = req.body;

        if (!name || !code || !institutionId) {
            return res.status(400).json({ success: false, msg: 'Name, code, and institutionId are required' });
        }

        const institution = await Organization.findById(institutionId);
        if (!institution) {
            return res.status(404).json({ success: false, msg: 'Institution not found' });
        }

        const upperCode = code.trim().toUpperCase();
        const existing = await Batch.findOne({ institutionId, code: upperCode });
        if (existing) {
            return res.status(409).json({ success: false, msg: `Batch with code "${upperCode}" already exists for this institution` });
        }

        const batch = await Batch.create({
            name,
            code: upperCode,
            institutionId,
            description,
            startDate: startDate || new Date(),
            endDate,
            assignedCourses: assignedCourses || [],
            assignedExams: assignedExams || [],
            maxStudents: maxStudents || 200,
            instructors: req.user.role === 'Teacher' || req.user.role === 'Instructor' ? [req.user._id] : []
        });

        res.status(201).json({ success: true, data: batch });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/batches — List batches
exports.getBatches = async (req, res) => {
    try {
        const { institutionId, status } = req.query;
        let query = {};

        if (institutionId) query.institutionId = institutionId;
        if (status) query.status = status;

        // Role-based restrictions
        if (req.user.role === 'Student') {
            query.students = req.user._id;
        } else if (req.user.role === 'Teacher' || req.user.role === 'Instructor') {
            if (req.user.institutionId) query.institutionId = req.user.institutionId;
        } else if (req.user.role === 'InstitutionAdmin') {
            if (req.user.institutionId) query.institutionId = req.user.institutionId;
        }

        const batches = await Batch.find(query)
            .populate('institutionId', 'name code logoUrl')
            .populate('assignedCourses', 'title code level category estimatedTotalHours')
            .populate('assignedExams', 'title duration type')
            .populate('instructors', 'name email')
            .sort('-createdAt')
            .lean();

        // Attach student count
        const enriched = batches.map(b => ({
            ...b,
            studentCount: b.students ? b.students.length : 0,
            courseCount: b.assignedCourses ? b.assignedCourses.length : 0,
            examCount: b.assignedExams ? b.assignedExams.length : 0
        }));

        res.status(200).json({ success: true, count: enriched.length, data: enriched });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/batches/:id — Get batch details
exports.getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id)
            .populate('institutionId', 'name code logoUrl domain')
            .populate('assignedCourses', 'title code category level estimatedTotalHours thumbnailUrl modules')
            .populate('assignedExams', 'title duration type totalMarks published')
            .populate('instructors', 'name email')
            .populate('mentors', 'name email')
            .populate('students', 'name email lastLoginAt isActive')
            .lean();

        if (!batch) {
            return res.status(404).json({ success: false, msg: 'Batch not found' });
        }

        res.status(200).json({ success: true, data: batch });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// PATCH /api/batches/:id — Update batch
exports.updateBatch = async (req, res) => {
    try {
        const batch = await Batch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!batch) return res.status(404).json({ success: false, msg: 'Batch not found' });
        res.status(200).json({ success: true, data: batch });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/batches/:id/assign-courses — Assign courses to batch
exports.assignCoursesToBatch = async (req, res) => {
    try {
        const { courseIds } = req.body;
        if (!Array.isArray(courseIds)) {
            return res.status(400).json({ success: false, msg: 'courseIds must be an array' });
        }

        const batch = await Batch.findById(req.params.id);
        if (!batch) return res.status(404).json({ success: false, msg: 'Batch not found' });

        // Add unique course IDs
        const existingSet = new Set(batch.assignedCourses.map(id => id.toString()));
        courseIds.forEach(id => existingSet.add(id.toString()));
        batch.assignedCourses = Array.from(existingSet);
        await batch.save();

        // Initialize progress for all enrolled students for newly assigned courses
        const courses = await Course.find({ _id: { $in: courseIds } });
        if (batch.students.length > 0 && courses.length > 0) {
            const notifs = [];
            for (const studentId of batch.students) {
                for (const course of courses) {
                    notifs.push({
                        userId: studentId,
                        title: 'New Course Allocated',
                        body: `"${course.title}" (${course.code}) was allocated to your batch "${batch.name}".`,
                        type: 'course_allocated',
                        link: `/student/courses/${course._id}/learn`
                    });
                }
            }
            await Notification.insertMany(notifs).catch(() => {});
        }
        for (const studentId of batch.students) {
            for (const course of courses) {
                const firstModuleId = course.modules?.[0]?._id;
                const firstLessonId = course.modules?.[0]?.lessons?.[0]?._id;

                await StudentProgress.findOneAndUpdate(
                    { studentId, courseId: course._id },
                    {
                        $setOnInsert: {
                            studentId,
                            courseId: course._id,
                            batchId: batch._id,
                            institutionId: batch.institutionId,
                            overallPercentage: 0,
                            unlockedModules: firstModuleId ? [firstModuleId] : [],
                            currentActiveModuleId: firstModuleId,
                            currentActiveLessonId: firstLessonId
                        }
                    },
                    { upsert: true, new: true }
                );
            }
        }

        res.status(200).json({ success: true, data: batch });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/batches/:id/assign-exams — Assign tests/exams to batch
exports.assignExamsToBatch = async (req, res) => {
    try {
        const { testIds } = req.body;
        if (!Array.isArray(testIds)) {
            return res.status(400).json({ success: false, msg: 'testIds must be an array' });
        }

        const batch = await Batch.findById(req.params.id);
        if (!batch) return res.status(404).json({ success: false, msg: 'Batch not found' });

        const existingSet = new Set(batch.assignedExams.map(id => id.toString()));
        testIds.forEach(id => existingSet.add(id.toString()));
        batch.assignedExams = Array.from(existingSet);
        await batch.save();

        if (batch.students.length > 0 && testIds.length > 0) {
            await Notification.insertMany(batch.students.map(sid => ({
                userId: sid,
                title: 'New Exam Assigned',
                body: `A new exam has been assigned to your batch "${batch.name}".`,
                type: 'exam_allocated',
                link: '/student/exams'
            }))).catch(() => {});
        }

        res.status(200).json({ success: true, data: batch });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/batches/:id/bulk-enroll — Bulk enroll students via CSV/Array
exports.bulkEnrollStudents = async (req, res) => {
    try {
        const { students } = req.body; // Array of { name, email, password }
        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ success: false, msg: 'Provide an array of student objects with name and email' });
        }

        const batch = await Batch.findById(req.params.id);
        if (!batch) return res.status(404).json({ success: false, msg: 'Batch not found' });

        const results = { created: 0, alreadyExisted: 0, enrolled: 0, errors: [] };
        const studentIdsToEnroll = [];

        for (const s of students) {
            try {
                if (!s.name || !s.email) continue;
                const emailClean = s.email.toLowerCase().trim();
                let user = await User.findOne({ email: emailClean });

                if (!user) {
                    const defaultPwd = s.password || `HiGen@${Math.random().toString(36).slice(-6)}`;
                    user = await User.create({
                        name: s.name.trim(),
                        email: emailClean,
                        password: defaultPwd,
                        role: 'Student',
                        institutionId: batch.institutionId,
                        orgId: batch.institutionId,
                        batchIds: [batch._id]
                    });
                    results.created++;
                } else {
                    results.alreadyExisted++;
                    // Link institution and batch to existing user
                    let modified = false;
                    if (!user.institutionId) {
                        user.institutionId = batch.institutionId;
                        user.orgId = batch.institutionId;
                        modified = true;
                    }
                    if (!user.batchIds.includes(batch._id)) {
                        user.batchIds.push(batch._id);
                        modified = true;
                    }
                    if (modified) await user.save();
                }

                studentIdsToEnroll.push(user._id);
                results.enrolled++;
            } catch (rowErr) {
                results.errors.push({ email: s.email, error: rowErr.message });
            }
        }

        // Add students to batch
        const batchStudentSet = new Set(batch.students.map(id => id.toString()));
        studentIdsToEnroll.forEach(id => batchStudentSet.add(id.toString()));
        batch.students = Array.from(batchStudentSet);
        await batch.save();

        if (studentIdsToEnroll.length > 0) {
            await Notification.insertMany(studentIdsToEnroll.map(sid => ({
                userId: sid,
                title: 'Enrolled in Batch',
                body: `You have been allocated to batch "${batch.name}" (${batch.code}).`,
                type: 'batch_allocated',
                link: '/student/courses'
            }))).catch(() => {});
        }

        // Initialize progress for all newly enrolled students across assigned courses
        if (batch.assignedCourses && batch.assignedCourses.length > 0) {
            const courses = await Course.find({ _id: { $in: batch.assignedCourses } });
            for (const studentId of studentIdsToEnroll) {
                for (const course of courses) {
                    const firstModuleId = course.modules?.[0]?._id;
                    const firstLessonId = course.modules?.[0]?.lessons?.[0]?._id;

                    await StudentProgress.findOneAndUpdate(
                        { studentId, courseId: course._id },
                        {
                            $setOnInsert: {
                                studentId,
                                courseId: course._id,
                                batchId: batch._id,
                                institutionId: batch.institutionId,
                                overallPercentage: 0,
                                unlockedModules: firstModuleId ? [firstModuleId] : [],
                                currentActiveModuleId: firstModuleId,
                                currentActiveLessonId: firstLessonId
                            }
                        },
                        { upsert: true, new: true }
                    );
                }
            }
        }

        res.status(200).json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// DELETE /api/batches/:id — Delete batch
exports.deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) return res.status(404).json({ success: false, msg: 'Batch not found' });
        await batch.deleteOne();
        res.status(200).json({ success: true, msg: 'Batch deleted' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

