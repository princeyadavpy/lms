import { useState } from 'react';

/**
 * HiGen Labs — L1 Proctoring Overlay
 * Shows pre-exam checklist and real-time violation warnings during exam
 */

// ── Pre-Exam Consent Modal ────────────────────────────────────────
export function ProctoringConsentModal({ proctorLevel = 1, onAccept }) {
    const [accepted, setAccepted] = useState(false);

    const rules = [
        '🖥️  Fullscreen mode will be enforced throughout the exam',
        '📋  Copy, cut, and paste are disabled in the exam window',
        '🔗  Switching tabs or windows will be recorded and may disqualify you',
        '🖱️  Right-click is disabled during the exam',
        '🔧  Opening DevTools or other browser extensions is not allowed',
        ...(proctorLevel >= 2 ? ['📷  Webcam monitoring will be active during the exam'] : [])
    ];

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Header */}
                <div style={styles.modalHeader}>
                    <div style={styles.shieldIcon}>🛡️</div>
                    <h2 style={styles.modalTitle}>Proctored Exam</h2>
                    <p style={styles.modalSubtitle}>Please read the exam rules carefully before proceeding</p>
                </div>

                {/* Rules */}
                <div style={styles.rulesList}>
                    {rules.map((rule, i) => (
                        <div key={i} style={styles.ruleItem}>
                            <span>{rule}</span>
                        </div>
                    ))}
                </div>

                {/* Proctor level badge */}
                <div style={styles.levelBadge}>
                    Proctoring Level {proctorLevel} Active
                </div>

                {/* Consent checkbox */}
                <label style={styles.consentLabel}>
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={e => setAccepted(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: '#8B71FF', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#c0c0d0', fontSize: 14 }}>
                        I understand the rules and agree to be monitored during this exam
                    </span>
                </label>

                {/* Start button */}
                <button
                    onClick={onAccept}
                    disabled={!accepted}
                    style={{
                        ...styles.startBtn,
                        opacity: accepted ? 1 : 0.4,
                        cursor: accepted ? 'pointer' : 'not-allowed'
                    }}
                >
                    Enter Fullscreen & Start Exam →
                </button>
            </div>
        </div>
    );
}

// ── Violation Warning Toast ───────────────────────────────────────
export function ViolationToast({ message, onDismiss }) {
    if (!message) return null;
    return (
        <div style={styles.toast}>
            <span style={styles.toastIcon}>⚠️</span>
            <div>
                <div style={styles.toastTitle}>Proctoring Alert</div>
                <div style={styles.toastMsg}>{message}</div>
            </div>
            <button onClick={onDismiss} style={styles.toastClose}>✕</button>
        </div>
    );
}

// ── Proctor Status Bar (shown during exam) ────────────────────────
export function ProctorStatusBar({ tabSwitches, fullscreenExits, maxSwitches = 3 }) {
    const remaining = Math.max(0, maxSwitches - tabSwitches);
    return (
        <div style={styles.statusBar}>
            <div style={styles.statusItem}>
                <span style={{ fontSize: 13, color: '#a0a0b0' }}>🛡️ Proctored</span>
            </div>
            <div style={styles.statusItem}>
                <span style={{
                    fontSize: 13,
                    color: tabSwitches > 0 ? (tabSwitches >= maxSwitches - 1 ? '#ff4444' : '#ffaa00') : '#4ade80'
                }}>
                    Tab Switches: {tabSwitches}/{maxSwitches}
                </span>
            </div>
            {remaining <= 1 && (
                <div style={{ ...styles.statusItem, color: '#ff4444', fontWeight: 600, fontSize: 12 }}>
                    ⚠️ {remaining === 0 ? 'AUTO-SUBMIT IMMINENT' : '1 switch remaining!'}
                </div>
            )}
        </div>
    );
}

// ── Exam Summary (post-submit proctor report) ─────────────────────
export function ProctoringReport({ proctorLog }) {
    if (!proctorLog) return null;
    const risk = proctorLog.riskLevel || 'Low';
    const riskColor = { Low: '#4ade80', Medium: '#ffaa00', High: '#ff4444' }[risk];

    return (
        <div style={styles.report}>
            <h3 style={{ color: '#fff', marginBottom: 12 }}>Proctoring Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                    ['Tab Switches', proctorLog.tabSwitches || 0],
                    ['Fullscreen Exits', proctorLog.fullscreenExits || 0],
                    ['Copy Attempts', proctorLog.copyAttempts || 0],
                    ['DevTools Detected', proctorLog.devToolsDetected || 0],
                ].map(([label, val]) => (
                    <div key={label} style={styles.reportStat}>
                        <div style={{ color: '#a0a0b0', fontSize: 12 }}>{label}</div>
                        <div style={{ color: val > 0 ? '#ffaa00' : '#4ade80', fontWeight: 700, fontSize: 18 }}>{val}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#a0a0b0', fontSize: 13 }}>Risk Level:</span>
                <span style={{ color: riskColor, fontWeight: 700 }}>{risk}</span>
            </div>
        </div>
    );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = {
    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 9999
    },
    modal: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid rgba(139,113,255,0.3)',
        borderRadius: 20, padding: 36, maxWidth: 480, width: '90%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,113,255,0.1)'
    },
    modalHeader: { textAlign: 'center', marginBottom: 28 },
    shieldIcon: { fontSize: 48, marginBottom: 12 },
    modalTitle: { color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 },
    modalSubtitle: { color: '#a0a0b0', fontSize: 14, marginTop: 6 },
    rulesList: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 },
    ruleItem: {
        padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
        borderRadius: 10, fontSize: 13, color: '#d0d0e0',
        borderLeft: '3px solid rgba(139,113,255,0.5)'
    },
    levelBadge: {
        display: 'inline-block', background: 'rgba(139,113,255,0.15)',
        border: '1px solid rgba(139,113,255,0.4)', borderRadius: 20,
        padding: '4px 14px', fontSize: 12, color: '#8B71FF',
        marginBottom: 20, fontWeight: 600
    },
    consentLabel: {
        display: 'flex', alignItems: 'flex-start', gap: 10,
        cursor: 'pointer', marginBottom: 24
    },
    startBtn: {
        width: '100%', padding: '14px 0',
        background: 'linear-gradient(135deg, #8B71FF, #6c4fe8)',
        color: '#fff', border: 'none', borderRadius: 12,
        fontSize: 15, fontWeight: 700, transition: 'all 0.2s',
        boxShadow: '0 4px 20px rgba(139,113,255,0.4)'
    },
    toast: {
        position: 'fixed', top: 20, right: 20, zIndex: 10000,
        background: 'rgba(255,60,60,0.95)', backdropFilter: 'blur(12px)',
        borderRadius: 12, padding: '14px 18px',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        maxWidth: 340, boxShadow: '0 8px 32px rgba(255,60,60,0.3)',
        animation: 'slideIn 0.3s ease', border: '1px solid rgba(255,100,100,0.4)'
    },
    toastIcon: { fontSize: 20 },
    toastTitle: { color: '#fff', fontWeight: 700, fontSize: 14 },
    toastMsg: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
    toastClose: {
        background: 'transparent', border: 'none', color: '#fff',
        fontSize: 16, cursor: 'pointer', marginLeft: 'auto', padding: 0
    },
    statusBar: {
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
        background: 'rgba(10,10,20,0.95)', borderBottom: '1px solid rgba(139,113,255,0.2)',
        padding: '6px 20px', display: 'flex', alignItems: 'center', gap: 20
    },
    statusItem: { display: 'flex', alignItems: 'center' },
    report: {
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12, padding: 20, marginTop: 20
    },
    reportStat: {
        background: 'rgba(255,255,255,0.04)', borderRadius: 8,
        padding: '10px 14px', textAlign: 'center'
    }
};
