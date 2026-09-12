const User = require('../models/User');
const Test = require('../models/Test');
const Submission = require('../models/Submission');
const bcrypt = require('bcryptjs');
const exceljs = require('exceljs');

// ─── Dashboard Stats ────────────────────────────────────────────────────────

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeTests = await Test.countDocuments({ status: 'Active' });
        const totalSubmissions = await Submission.countDocuments({ status: 'Submitted' });

        let passRate = 0;
        if (totalSubmissions > 0) {
            const passedSubmissions = await Submission.countDocuments({ status: 'Submitted', totalMarks: { $gt: 0 } });
            passRate = Math.round((passedSubmissions / totalSubmissions) * 100);
        }

        const recentSubmissions = await Submission.find({ status: 'Submitted' })
            .sort({ submitTime: -1, createdAt: -1 })
            .limit(5)
            .populate('studentId', 'name')
            .populate('testId', 'title');

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name createdAt role');

        let activity = [];

        recentSubmissions.forEach(sub => {
            if (sub.studentId && sub.testId) {
                activity.push({
                    id: `sub_${sub._id}`,
                    userInitial: sub.studentId.name ? sub.studentId.name.substring(0, 2).toUpperCase() : 'U',
                    userName: sub.studentId.name,
                    action: `Completed ${sub.testId.title}`,
                    date: sub.submitTime || sub.createdAt,
                    status: sub.totalMarks > 0 ? 'Passed' : 'Review',
                    statusColor: sub.totalMarks > 0 ? 'green' : 'orange'
                });
            }
        });

        recentUsers.forEach(user => {
            activity.push({
                id: `user_${user._id}`,
                userInitial: user.name ? user.name.substring(0, 2).toUpperCase() : 'U',
                userName: user.name,
                action: user.role === 'Admin' ? 'Admin Registered' : 'Registered new account',
                date: user.createdAt,
                status: 'Info',
                statusColor: 'blue'
            });
        });

        activity.sort((a, b) => new Date(b.date) - new Date(a.date));
        activity = activity.slice(0, 5);

        const timeAgo = (date) => {
            const seconds = Math.floor((new Date() - new Date(date)) / 1000);
            let interval = seconds / 31536000;
            if (interval > 1) return Math.floor(interval) + ' years ago';
            interval = seconds / 2592000;
            if (interval > 1) return Math.floor(interval) + ' months ago';
            interval = seconds / 86400;
            if (interval > 1) return Math.floor(interval) + ' days ago';
            interval = seconds / 3600;
            if (interval > 1) return Math.floor(interval) + ' hours ago';
            interval = seconds / 60;
            if (interval > 1) return Math.floor(interval) + ' mins ago';
            return Math.floor(seconds) + ' seconds ago';
        };

        activity = activity.map(a => ({ ...a, timeAgo: timeAgo(a.date) }));

        res.status(200).json({ success: true, data: { totalUsers, activeTests, passRate, activity } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// ─── User Management ───────────────────────────────────────────────────────

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, msg: 'Cannot delete your own account' });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, msg: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['Admin', 'Teacher', 'Student', 'Recruiter'].includes(role)) {
            return res.status(400).json({ success: false, msg: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, msg: 'Cannot deactivate your own account' });
        }
        user.isActive = !user.isActive;
        await user.save();
        res.status(200).json({ success: true, data: { isActive: user.isActive } });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// Create a single user (Admin)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role = 'Student' } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, msg: 'name, email, and password are required' });
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ success: false, msg: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role });
        res.status(201).json({ success: true, data: { _id: user._id, name, email, role } });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// Bulk create users from CSV rows: [{ name, email, password, role }]
exports.bulkCreateUsers = async (req, res) => {
    try {
        const { users } = req.body; // array of { name, email, password, role }
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ success: false, msg: 'Provide a non-empty users array' });
        }
        if (users.length > 500) {
            return res.status(400).json({ success: false, msg: 'Limit: 500 users per bulk import' });
        }

        const results = { created: 0, skipped: 0, errors: [] };
        for (const u of users) {
            try {
                if (!u.name || !u.email) { results.skipped++; continue; }
                const exists = await User.findOne({ email: u.email.toLowerCase() });
                if (exists) { results.skipped++; continue; }

                const defaultPwd = u.password || `Higen@${Math.random().toString(36).slice(-6)}`;
                const hashed = await bcrypt.hash(defaultPwd, 10);
                await User.create({
                    name: u.name.trim(),
                    email: u.email.toLowerCase().trim(),
                    password: hashed,
                    role: ['Admin', 'Teacher', 'Student', 'Recruiter'].includes(u.role) ? u.role : 'Student'
                });
                results.created++;
            } catch (rowErr) {
                results.errors.push({ email: u.email, error: rowErr.message });
            }
        }

        res.status(200).json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// Quick bulk create users from list of emails
exports.quickBulkCreateUsers = async (req, res) => {
    try {
        const { emails } = req.body;
        if (!Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ success: false, msg: 'Provide a non-empty emails array' });
        }
        
        const results = { created: 0, skipped: 0, errors: [] };
        
        for (const emailRaw of emails) {
            try {
                const email = emailRaw.toLowerCase().trim();
                if (!email) continue;
                
                const exists = await User.findOne({ email });
                if (exists) { results.skipped++; continue; }
                
                const defaultPwd = `Higen@${Math.random().toString(36).slice(-6)}`;
                const hashed = await bcrypt.hash(defaultPwd, 10);
                
                const name = email.split('@')[0];
                
                await User.create({
                    name,
                    email,
                    password: hashed,
                    role: 'Student'
                });
                results.created++;
            } catch (err) {
                results.errors.push({ email: emailRaw, error: err.message });
            }
        }
        
        res.status(200).json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// ─── Test Management ───────────────────────────────────────────────────────

exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tests });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.deleteTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ success: false, msg: 'Test not found' });
        await test.deleteOne();
        res.status(200).json({ success: true, msg: 'Test deleted' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// ─── Submission Management ─────────────────────────────────────────────────

exports.getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('studentId', 'name email')
            .populate('testId', 'title questions')
            .populate('answers.questionId', 'title')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: submissions });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
exports.deleteSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) return res.status(404).json({ success: false, msg: 'Submission not found' });
        await submission.deleteOne();
        res.status(200).json({ success: true, msg: 'Submission deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.exportSubmissionsToExcel = async (req, res) => {
    try {
        const { testId } = req.params;
        const { type } = req.query; // 'summary' or 'complete'
        
        const test = await Test.findById(testId).populate('questions');
        if (!test) return res.status(404).json({ success: false, msg: 'Test not found' });
        
        const submissions = await Submission.find({ testId })
            .populate('studentId', 'name email')
            .sort({ submitTime: -1, createdAt: -1 });
            
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Test Results');
        
        let columns = [
            { header: 'Student Name', key: 'name', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Total Score', key: 'score', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Risk Level', key: 'risk', width: 15 },
            { header: 'Total Violations', key: 'violations', width: 20 },
            { header: 'Auto Submitted', key: 'auto', width: 15 },
            { header: 'Submitted At', key: 'time', width: 25 }
        ];
        
        if (type === 'complete' && test.questions) {
            test.questions.forEach((q, index) => {
                columns.push({ header: `Q${index + 1} (${q.type}) Marks`, key: `q${index}_marks`, width: 15 });
                columns.push({ header: `Q${index + 1} Answer`, key: `q${index}_answer`, width: 40 });
            });
        }
        
        worksheet.columns = columns;
        worksheet.getRow(1).font = { bold: true };
        
        submissions.forEach(sub => {
            const viols = (sub.proctorLog?.tabSwitches || 0) + 
                          (sub.proctorLog?.fullscreenExits || 0) + 
                          (sub.proctorLog?.copyAttempts || 0) + 
                          (sub.proctorLog?.pasteAttempts || 0) + 
                          (sub.proctorLog?.devToolsDetected || 0);
                          
            let rowData = {
                name: sub.studentId?.name || 'Unknown',
                email: sub.studentId?.email || 'Unknown',
                score: sub.totalMarks || 0,
                status: sub.status,
                risk: sub.proctorLog?.riskLevel || 'Low',
                violations: viols,
                auto: sub.isAutoSubmitted ? 'Yes' : 'No',
                time: sub.submitTime ? new Date(sub.submitTime).toLocaleString() : 'N/A'
            };
            
            if (type === 'complete' && test.questions) {
                test.questions.forEach((q, index) => {
                    const ans = sub.answers.find(a => {
                        const qIdStr = a.questionId?._id ? a.questionId._id.toString() : a.questionId?.toString();
                        return qIdStr === q._id.toString();
                    });
                    rowData[`q${index}_marks`] = ans ? (ans.marksAwarded != null ? ans.marksAwarded : (ans.marks || 0)) : 0;
                    if (ans) {
                        rowData[`q${index}_answer`] = ans.type === 'Coding' ? (ans.answerData?.code || '') : (ans.answerData || '');
                    } else {
                        rowData[`q${index}_answer`] = 'N/A';
                    }
                });
            }
            
            worksheet.addRow(rowData);
        });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Test_Results_${test.title.replace(/\\s+/g, '_')}.xlsx`);
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.gradeSubmissionAnswer = async (req, res) => {
    try {
        const { id, questionId } = req.params;
        const { marks } = req.body;

        if (marks == null || isNaN(marks)) {
            return res.status(400).json({ success: false, msg: 'Invalid marks provided' });
        }

        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({ success: false, msg: 'Submission not found' });
        }

        const answerIndex = submission.answers.findIndex(a => 
            (a.questionId?._id ? a.questionId._id.toString() : a.questionId?.toString()) === questionId
        );

        if (answerIndex === -1) {
            return res.status(404).json({ success: false, msg: 'Answer not found in submission' });
        }

        // Apply new marks and status
        const oldMarks = submission.answers[answerIndex].marksAwarded || 0;
        submission.answers[answerIndex].marksAwarded = Number(marks);
        submission.answers[answerIndex].status = 'Evaluated';

        // Recalculate total marks
        submission.totalMarks = submission.answers.reduce((total, ans) => {
            return total + (ans.marksAwarded || 0);
        }, 0);

        await submission.save();

        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        console.error('gradeSubmissionAnswer error:', err.message);
        res.status(500).json({ success: false, msg: err.message });
    }
};
