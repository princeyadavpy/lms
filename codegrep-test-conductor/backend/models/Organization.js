const mongoose = require('mongoose');
const crypto = require('crypto');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    domain: { type: String, trim: true, lowercase: true },
    plan: {
        type: String,
        enum: ['free', 'starter', 'pro', 'enterprise'],
        default: 'free'
    },
    seatCount: { type: Number, default: 5 },
    logoUrl: { type: String },
    apiKey: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
    billingEmail: { type: String },
    // Plan limits
    limits: {
        maxTests: { type: Number, default: 3 },
        maxCandidatesPerMonth: { type: Number, default: 50 },
        maxProctorLevel: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Auto-generate a unique API key on creation
organizationSchema.pre('save', function () {
    if (!this.apiKey) {
        this.apiKey = 'hgl_' + crypto.randomBytes(24).toString('hex');
    }
    // Set limits based on plan
    const planLimits = {
        free: { maxTests: 3, maxCandidatesPerMonth: 50, maxProctorLevel: 0 },
        starter: { maxTests: 20, maxCandidatesPerMonth: 500, maxProctorLevel: 1 },
        pro: { maxTests: 999, maxCandidatesPerMonth: 5000, maxProctorLevel: 2 },
        enterprise: { maxTests: 999, maxCandidatesPerMonth: 99999, maxProctorLevel: 3 }
    };
    this.limits = planLimits[this.plan] || planLimits.free;
});

module.exports = mongoose.model('Organization', organizationSchema);
