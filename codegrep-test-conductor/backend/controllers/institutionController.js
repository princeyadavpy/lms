const Organization = require('../models/Organization');
const Batch = require('../models/Batch');
const User = require('../models/User');
const Course = require('../models/Course');

// POST /api/institutions — Create institution
exports.createInstitution = async (req, res) => {
    try {
        const { name, code, domain, type, plan, seatCount, billingEmail, contactPerson, contactPhone, address, settings } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, msg: 'Institution name is required' });
        }

        const formattedCode = (code || name.replace(/[^A-Za-z0-9]/g, '').substring(0, 10)).toUpperCase();
        const existing = await Organization.findOne({ $or: [{ code: formattedCode }, { name }] });
        if (existing) {
            return res.status(409).json({ success: false, msg: 'An institution with this name or code already exists' });
        }

        const institution = await Organization.create({
            name,
            code: formattedCode,
            domain: domain ? domain.toLowerCase().trim() : undefined,
            type: type || 'University',
            plan: plan || 'enterprise',
            seatCount: seatCount || 500,
            billingEmail,
            contactPerson,
            contactPhone,
            address,
            settings: settings || { enforceStrictSequence: true, allowSelfRegistration: false }
        });

        res.status(201).json({ success: true, data: institution });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/institutions — List institutions with summary statistics
exports.getInstitutions = async (req, res) => {
    try {
        let query = {};
        // If institution admin, restrict to their assigned institution
        if (req.user.role === 'InstitutionAdmin' && req.user.institutionId) {
            query._id = req.user.institutionId;
        }

        const institutions = await Organization.find(query).sort('-createdAt').lean();

        // Attach counts
        const enriched = await Promise.all(institutions.map(async (inst) => {
            const [batchCount, studentCount, instructorCount] = await Promise.all([
                Batch.countDocuments({ institutionId: inst._id }),
                User.countDocuments({ institutionId: inst._id, role: 'Student' }),
                User.countDocuments({ institutionId: inst._id, role: { $in: ['Teacher', 'Instructor', 'Mentor'] } })
            ]);
            return {
                ...inst,
                stats: {
                    batchCount,
                    studentCount,
                    instructorCount
                }
            };
        }));

        res.status(200).json({ success: true, count: enriched.length, data: enriched });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/institutions/:id — Get institution details
exports.getInstitutionById = async (req, res) => {
    try {
        const institution = await Organization.findById(req.params.id).lean();
        if (!institution) {
            return res.status(404).json({ success: false, msg: 'Institution not found' });
        }

        const [batches, students, instructors] = await Promise.all([
            Batch.find({ institutionId: institution._id }).populate('assignedCourses', 'title code level category').lean(),
            User.find({ institutionId: institution._id, role: 'Student' }).select('name email lastLoginAt createdAt isActive').limit(100).lean(),
            User.find({ institutionId: institution._id, role: { $in: ['Teacher', 'Instructor', 'Mentor'] } }).select('name email role').lean()
        ]);

        res.status(200).json({
            success: true,
            data: {
                ...institution,
                batches,
                students,
                instructors
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// PATCH /api/institutions/:id — Update institution
exports.updateInstitution = async (req, res) => {
    try {
        const institution = await Organization.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!institution) {
            return res.status(404).json({ success: false, msg: 'Institution not found' });
        }
        res.status(200).json({ success: true, data: institution });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// DELETE /api/institutions/:id — Delete institution
exports.deleteInstitution = async (req, res) => {
    try {
        const inst = await Organization.findById(req.params.id);
        if (!inst) return res.status(404).json({ success: false, msg: 'Institution not found' });
        await inst.deleteOne();
        res.status(200).json({ success: true, msg: 'Institution deleted' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

