const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
        { id: user._id, role: user.role, orgId: user.orgId },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            orgId: user.orgId,
            avatar: user.avatar
        }
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role: role || 'Student' });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, msg: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, msg: 'Invalid credentials' });
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, msg: 'Account deactivated. Contact your administrator.' });
        }

        const isMatch = user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: 'Invalid credentials' });
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('orgId', 'name plan limits logoUrl');
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// ── Google OAuth ──────────────────────────────────────────────────
exports.googleCallback = (req, res) => {
    const clientUrl = process.env.CLIENT_URL || process.env.APP_URL || 'https://higenlabs.in/lms';
    try {
        // req.user is set by passport after successful auth
        const user = req.user;
        const token = jwt.sign(
            { id: user._id, role: user.role, orgId: user.orgId },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        // Redirect to frontend with token in URL — frontend stores it
        res.redirect(`${clientUrl}/auth/oauth-callback?token=${token}&name=${encodeURIComponent(user.name)}&role=${user.role}`);
    } catch (err) {
        res.redirect(`${clientUrl}/login?error=oauth_failed`);
    }
};

