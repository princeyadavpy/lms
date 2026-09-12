import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const StudentProfile = () => {
    const { user } = useContext(AuthContext);
    if (!user) return null;

    const initial = user.name?.charAt(0).toUpperCase() || 'S';

    const infoRows = [
        { label: 'Full Name', value: user.name, icon: '👤' },
        { label: 'Email Address', value: user.email, icon: '✉️' },
        { label: 'Account Role', value: user.role, icon: '🎓' },
        { label: 'User ID', value: user.id || user._id, mono: true, icon: '🔑' },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-5 animate-fadeInUp">
            {/* Profile Header Card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {/* Banner */}
                <div className="h-28 relative" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(79,142,247,0.15))' }}>
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,170,0.2) 0%, transparent 70%)' }} />
                </div>

                {/* Avatar + Info */}
                <div className="px-7 pb-7">
                    <div className="flex items-end gap-5 -mt-10 mb-5">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0"
                            style={{ background: 'var(--accent-green)', color: '#0a0e1a', border: '4px solid var(--bg-card)', boxShadow: '0 8px 24px rgba(0,212,170,0.3)' }}>
                            {initial}
                        </div>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</h2>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hl-badge hl-badge-green">{user.role}</span>
                        <span className="hl-badge hl-badge-blue">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Account Information</h3>
                </div>
                <div>
                    {infoRows.map(({ label, value, mono, icon }, idx) => (
                        <div key={label} className="flex items-center justify-between px-6 py-4 transition-colors"
                            style={{ borderBottom: idx < infoRows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-base">{icon}</span>
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                            </div>
                            <span
                                className={`text-sm font-${mono ? 'mono hl-mono' : 'medium'}`}
                                style={{ color: 'var(--text-primary)', fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', fontSize: mono ? '12px' : '14px' }}>
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Security</h3>
                </div>
                <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Password</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last changed: Not available</p>
                    </div>
                    <button className="hl-btn-secondary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                        Change Password
                    </button>
                </div>
            </div>

            <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} HiGen Labs. All rights reserved.</p>
        </div>
    );
};

export default StudentProfile;
