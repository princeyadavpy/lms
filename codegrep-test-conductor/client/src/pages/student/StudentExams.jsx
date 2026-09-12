import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const StudentExams = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joinCode, setJoinCode] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinError, setJoinError] = useState('');

    useEffect(() => {
        api.get('/tests').then(res => {
            if (res.data.success) setTests(res.data.data.filter(t => t.published));
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleJoin = async (e) => {
        e.preventDefault();
        const code = joinCode.trim().toUpperCase();
        if (!code) return;
        setJoinLoading(true);
        setJoinError('');
        try {
            const res = await api.get(`/tests/join/${code}`);
            if (res.data.success) navigate(`/exam/${res.data.data._id}`);
        } catch (err) {
            setJoinError(err.response?.data?.msg || 'Invalid or expired access code.');
        } finally {
            setJoinLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* Join by Code */}
            <div className="rounded-2xl p-7 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(79,142,247,0.08))', border: '1px solid rgba(0,212,170,0.2)' }}>
                <div className="absolute right-0 top-0 w-72 h-72 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(0,212,170,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent-green)', border: '1px solid rgba(0,212,170,0.25)' }}>
                            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Join with Access Code</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Enter the 6-character code from your teacher</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
                            <input
                                value={joinCode}
                                onChange={e => { setJoinCode(e.target.value.toUpperCase()); setJoinError(''); }}
                                maxLength={6}
                                placeholder="A B 1 2 C D"
                                className="hl-mono text-center text-lg font-bold tracking-[0.3em] uppercase"
                                style={{
                                    width: '180px', padding: '11px 16px',
                                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '10px', color: 'var(--text-primary)', outline: 'none',
                                    fontFamily: 'JetBrains Mono, monospace',
                                }}
                                onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,170,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
                            />
                            <button
                                type="submit"
                                disabled={joinLoading || joinCode.length < 6}
                                className="hl-btn-primary"
                                style={{ opacity: (joinLoading || joinCode.length < 6) ? 0.6 : 1, cursor: (joinLoading || joinCode.length < 6) ? 'not-allowed' : 'pointer' }}>
                                {joinLoading ? (
                                    <><span className="hl-spinner" style={{ width: '14px', height: '14px' }} /> Joining...</>
                                ) : 'Join Exam →'}
                            </button>
                        </form>
                        {joinError && (
                            <p className="flex items-center gap-2 mt-3 text-sm" style={{ color: 'var(--accent-red)' }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                {joinError}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Exams Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Available Exams</h2>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>All published exams you can attempt</p>
                </div>
                <span className="hl-badge hl-badge-green">{tests.length} exams</span>
            </div>

            {/* Exam Cards */}
            {loading ? (
                <div className="flex items-center justify-center h-48 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="hl-spinner" style={{ width: '28px', height: '28px' }} />
                </div>
            ) : tests.length === 0 ? (
                <div className="rounded-2xl flex flex-col items-center justify-center py-20 text-center"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No exams published yet</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Ask your teacher for an access code, or wait for exams to appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tests.map(test => {
                        const now = new Date();
                        const startTime = test.startTime ? new Date(test.startTime) : null;
                        const endTime = test.endTime ? new Date(test.endTime) : null;
                        const hasStarted = !startTime || now >= startTime;
                        const hasEnded = endTime && now > endTime;

                        return (
                            <div key={test._id} className="rounded-2xl p-6 flex flex-col justify-between transition-all group"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(0,212,170,0.25)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl"
                                            style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent-green)' }}>
                                            {test.title?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`hl-badge ${test.published ? 'hl-badge-green' : 'hl-badge-orange'}`}>
                                            {test.published ? 'Open' : 'Draft'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-base mb-2 group-hover:text-[var(--accent-green)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                                        {test.title}
                                    </h3>
                                    {test.description && (
                                        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{test.description}</p>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {test.duration} min
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {test.questions?.length ?? 0} Q's
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                    {!test.published ? (
                                        <button disabled className="hl-btn-secondary w-full opacity-40 cursor-not-allowed">Not Published</button>
                                    ) : hasEnded ? (
                                        <button disabled className="hl-btn-danger w-full cursor-not-allowed" style={{ opacity: 0.7 }}>Exam Ended</button>
                                    ) : !hasStarted ? (
                                        <button disabled className="w-full py-2.5 rounded-xl text-sm font-medium cursor-not-allowed"
                                            style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-orange)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                            Starts {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </button>
                                    ) : (
                                        <Link to={`/exam/${test._id}`} className="hl-btn-primary w-full justify-center">
                                            Start Exam →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentExams;
