const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null }, // null for OAuth-only users
    role: { type: String, enum: ['Admin', 'Teacher', 'Student', 'Recruiter'], default: 'Student' },

    // Multi-tenancy
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },

    // Google OAuth
    googleId: { type: String, default: null },
    avatar: { type: String, default: null },

    // Account management
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },

    // Profile extras
    phone: { type: String, default: null },
    bio: { type: String, default: null },
}, { timestamps: true });

// Hash password only when it's set and modified
userSchema.pre('save', function () {
    if (!this.password || !this.isModified('password')) return;
    this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.matchPassword = function (enteredPassword) {
    if (!this.password) return false;
    return bcrypt.compareSync(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
