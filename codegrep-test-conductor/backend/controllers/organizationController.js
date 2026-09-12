const Organization = require('../models/Organization');
const User = require('../models/User');

// POST /api/organizations — Create org (Admin only)
exports.createOrg = async (req, res) => {
    try {
        const { name, domain, plan, billingEmail } = req.body;
        const org = await Organization.create({ name, domain, plan, billingEmail });
        res.status(201).json({ success: true, data: org });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/organizations — List all orgs (Admin only)
exports.getOrgs = async (req, res) => {
    try {
        const orgs = await Organization.find().sort('-createdAt');
        res.status(200).json({ success: true, count: orgs.length, data: orgs });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/organizations/me — Get caller's org
exports.getMyOrg = async (req, res) => {
    try {
        if (!req.user.orgId) {
            return res.status(200).json({ success: true, data: null, msg: 'No organization assigned' });
        }
        const org = await Organization.findById(req.user.orgId);
        if (!org) return res.status(404).json({ success: false, msg: 'Organization not found' });
        res.status(200).json({ success: true, data: org });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// PATCH /api/organizations/:id — Update org (Admin only)
exports.updateOrg = async (req, res) => {
    try {
        const org = await Organization.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!org) return res.status(404).json({ success: false, msg: 'Organization not found' });
        res.status(200).json({ success: true, data: org });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// PATCH /api/organizations/:id/assign-user — Assign user to org
exports.assignUserToOrg = async (req, res) => {
    try {
        const { userId } = req.body;
        const org = await Organization.findById(req.params.id);
        if (!org) return res.status(404).json({ success: false, msg: 'Organization not found' });

        const user = await User.findByIdAndUpdate(userId, { orgId: org._id }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/organizations/:id/stats — Org-level stats
exports.getOrgStats = async (req, res) => {
    try {
        const orgId = req.params.id;
        const [userCount, testCount] = await Promise.all([
            User.countDocuments({ orgId }),
            require('../models/Test').countDocuments({ orgId })
        ]);
        res.status(200).json({ success: true, data: { userCount, testCount } });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
