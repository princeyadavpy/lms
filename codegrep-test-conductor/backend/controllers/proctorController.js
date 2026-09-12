const Submission = require('../models/Submission');

/**
 * POST /api/proctoring/vm-detection
 * Body: { submissionId, isVirtualMachine, renderer, vendor, matchedIndicator, detectedAt }
 *
 * Logs VM detection result into the submission's proctorLog.
 * Does NOT fail/reject the exam — flags for admin review only.
 */
exports.logVMDetection = async (req, res) => {
    try {
        const {
            submissionId,
            isVirtualMachine,
            renderer = '',
            vendor = '',
            matchedIndicator = null,
            detectedAt
        } = req.body;

        // If no submissionId, this is a pre-exam detection — just log and return
        if (!submissionId) {
            console.log(
                `[proctoring] Pre-exam VM detection by user ${req.user.id} — ` +
                `isVM: ${isVirtualMachine}, matched: ${matchedIndicator}, renderer: ${renderer}`
            );
            return res.status(200).json({ success: true, flagged: !!isVirtualMachine, note: 'logged_without_submission' });
        }

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ success: false, msg: 'Submission not found' });
        }

        // Ownership check: only the submitting student can post this
        if (submission.studentId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, msg: 'Not authorized' });
        }

        if (!submission.proctorLog) submission.proctorLog = {};
        if (!Array.isArray(submission.proctorLog.flaggedEvents)) {
            submission.proctorLog.flaggedEvents = [];
        }

        // Store the VM detection result
        submission.proctorLog.vmDetection = {
            isVirtualMachine: !!isVirtualMachine,
            renderer,
            vendor,
            matchedIndicator,
            detectedAt: detectedAt ? new Date(detectedAt) : new Date()
        };

        if (isVirtualMachine) {
            // Push a flagged event for the teacher's review panel
            submission.proctorLog.flaggedEvents.push({
                type: 'VM_DETECTED',
                message: `Virtual machine detected — renderer: "${renderer}", matched: "${matchedIndicator}"`,
                timestamp: detectedAt ? new Date(detectedAt) : new Date()
            });

            // Escalate risk level (only upgrade, never downgrade)
            const current = submission.proctorLog.riskLevel;
            if (current !== 'High') {
                submission.proctorLog.riskLevel = 'High';
            }
        }

        submission.markModified('proctorLog');
        await submission.save();

        console.log(
            `[proctoring] VM detection logged for submission ${submissionId} — ` +
            `isVM: ${isVirtualMachine}, matched: ${matchedIndicator}`
        );

        res.status(200).json({ success: true, flagged: !!isVirtualMachine });
    } catch (err) {
        console.error('logVMDetection error:', err.message);
        // Still 200 — never disrupt exam flow with a 500
        res.status(200).json({ success: false, msg: err.message });
    }
};
