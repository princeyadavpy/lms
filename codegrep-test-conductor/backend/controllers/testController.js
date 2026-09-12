const Test = require('../models/Test');

const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

exports.createTest = async (req, res) => {
    try {
        const { title, description, duration, config } = req.body;
        const test = await Test.create({
            title,
            description,
            duration,
            config,
            createdBy: req.user.id
        });
        res.status(201).json({ success: true, data: test });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getTests = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'Admin' || req.user.role === 'Teacher') {
            query = Test.find().populate('createdBy', 'name');
        } else {
            query = Test.find({ published: true }).populate('createdBy', 'name');
        }
        const tests = await query;
        res.status(200).json({ success: true, count: tests.length, data: tests });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id).populate('questions');
        if (!test) return res.status(404).json({ success: false, msg: 'Test not found' });

        if (req.user.role === 'Student' && !test.published) {
            return res.status(403).json({ success: false, msg: 'Not authorized' });
        }

        if (req.user.role === 'Student' && test.config?.allowedEmails && test.config.allowedEmails.length > 0) {
            if (!test.config.allowedEmails.includes(req.user.email)) {
                return res.status(403).json({ success: false, msg: 'You are not assigned to this test.' });
            }
        }
        res.status(200).json({ success: true, data: test });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.updateTest = async (req, res) => {
    try {
        let test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ success: false, msg: 'Test not found' });

        if (test.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        // Selectively update fields to avoid overwriting populated questions or metadata
        const allowedFields = ['title', 'description', 'duration', 'published', 'status', 'startTime', 'endTime'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) test[field] = req.body[field];
        });

        // Deep merge config if provided
        if (req.body.config) {
            test.config = { ...test.config.toObject(), ...req.body.config };
        }

        // Special handling for accessCode if published
        if (req.body.published === true && !test.accessCode) {
            const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
            let code;
            let exists = true;
            while (exists) {
                code = generateCode();
                exists = await Test.findOne({ accessCode: code });
            }
            test.accessCode = code;
        }

        await test.save();
        res.status(200).json({ success: true, data: test });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// Toggle publish / unpublish — generates an access code on first publish
exports.publishTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ success: false, msg: 'Test not found' });

        if (test.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        test.published = !test.published;

        // Generate a unique access code when first published
        if (test.published && !test.accessCode) {
            let code;
            let exists = true;
            while (exists) {
                code = generateCode();
                exists = await Test.findOne({ accessCode: code });
            }
            test.accessCode = code;
        }

        await test.save();
        res.status(200).json({ success: true, data: test });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// Get test by access code — for students to join
exports.getTestByCode = async (req, res) => {
    try {
        const test = await Test.findOne({
            accessCode: req.params.code.toUpperCase(),
            published: true
        }).populate('questions');

        if (!test) {
            return res.status(404).json({ success: false, msg: 'No published test found with that access code.' });
        }

        if (req.user.role === 'Student' && test.config?.allowedEmails && test.config.allowedEmails.length > 0) {
            if (!test.config.allowedEmails.includes(req.user.email)) {
                return res.status(403).json({ success: false, msg: 'You are not assigned to this test.' });
            }
        }

        res.status(200).json({ success: true, data: test });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
