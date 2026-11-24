const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null }, // null for OAuth-only users
    role: {
        type: String,
        enum: ['SuperAdmin', 'InstitutionAdmin', 'Admin', 'Teacher', 'Instructor', 'Mentor', 'Student', 'Recruiter'],
        default: 'Student'
    },

    // Multi-tenancy & Institution mapping
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
    institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
    batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

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

// Keep orgId and institutionId in sync
userSchema.pre('save', function () {
    if (this.institutionId && !this.orgId) {
        this.orgId = this.institutionId;
    } else if (this.orgId && !this.institutionId) {
        this.institutionId = this.orgId;
    }
    if (!this.password || !this.isModified('password')) return;
    this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.matchPassword = function (enteredPassword) {
    if (!this.password) return false;
    return bcrypt.compareSync(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
