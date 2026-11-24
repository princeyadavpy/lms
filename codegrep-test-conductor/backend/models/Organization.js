const mongoose = require('mongoose');
const crypto = require('crypto');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true }, // e.g. "SHOOLINI", "GLA"
    domain: { type: String, trim: true, lowercase: true },
    type: {
        type: String,
        enum: ['University', 'College', 'Institute', 'Corporate', 'TrainingPartner'],
        default: 'University'
    },
    plan: {
        type: String,
        enum: ['free', 'starter', 'pro', 'enterprise'],
        default: 'enterprise'
    },
    seatCount: { type: Number, default: 500 },
    logoUrl: { type: String },
    apiKey: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
    billingEmail: { type: String },
    contactPerson: { type: String },
    contactPhone: { type: String },
    address: { type: String },

    // Institutional access settings
    settings: {
        enforceStrictSequence: { type: Boolean, default: true },
        allowSelfRegistration: { type: Boolean, default: false },
        defaultPassScorePercent: { type: Number, default: 60 }
    },

    // Plan limits (preserved)
    limits: {
        maxTests: { type: Number, default: 999 },
        maxCandidatesPerMonth: { type: Number, default: 50000 },
        maxProctorLevel: { type: Number, default: 3 }
    }
}, { timestamps: true });

// Auto-generate a unique API key and code on creation
organizationSchema.pre('save', function () {
    if (!this.apiKey) {
        this.apiKey = 'hgl_' + crypto.randomBytes(24).toString('hex');
    }
    if (!this.code && this.name) {
        this.code = this.name.replace(/[^A-Za-z0-9]/g, '').substring(0, 10).toUpperCase();
    }
    const planLimits = {
        free: { maxTests: 3, maxCandidatesPerMonth: 50, maxProctorLevel: 0 },
        starter: { maxTests: 20, maxCandidatesPerMonth: 500, maxProctorLevel: 1 },
        pro: { maxTests: 999, maxCandidatesPerMonth: 5000, maxProctorLevel: 2 },
        enterprise: { maxTests: 999, maxCandidatesPerMonth: 99999, maxProctorLevel: 3 }
    };
    this.limits = planLimits[this.plan] || planLimits.enterprise;
});

module.exports = mongoose.model('Organization', organizationSchema);
