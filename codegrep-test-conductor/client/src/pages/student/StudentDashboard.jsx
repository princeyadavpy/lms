import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, color, accent, link, loading }) => (
    <Link to={link} className="block rounded-2xl p-6 transition-all group"
        style={{
            background: 'var(--bg-card)',
            border: `1px solid ${accent}22`,
            textDecoration: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.4), 0 0 20px ${accent}15`; e.currentTarget.style.borderColor = `${accent}44`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${accent}22`; }}
    >
        <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, color: accent }}>
                {icon}
            </div>
            <svg className="w-4 h-4 opacity-30 group-hover:opacity-70 transition-opacity" style={{ color: accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
        </div>
        <p className="text-3xl font-black mb-1" style={{ color: accent }}>{loading ? '—' : value}</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    </Link>
);

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [availableTests, setAvailableTests] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const testsRes = await api.get('/tests');
                const allTests = testsRes.data.success ? testsRes.data.data : [];
                setAvailableTests(allTests.filter(t => t.published && t.status === 'Active').slice(0, 3));

                const subRes = await api.get('/submissions/mine');
                if (subRes.data.success) setSubmissions(subRes.data.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const stats = [
        {
            label: 'Available Exams', value: availableTests.length, link: '/student/exams',
            accent: '#00d4aa',
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
        },
        {
            label: 'Exams Attempted', value: submissions.length, link: '/student/submissions',
            accent: '#4f8ef7',
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
        },
        {
            label: 'Account Status', value: 'Active', link: '/student/profile',
            accent: '#22c55e',
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
        },
    ];

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* Welcome Banner */}
            <div className="relative rounded-2xl p-8 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(79,142,247,0.08))', border: '1px solid rgba(0,212,170,0.18)' }}>
                <div className="absolute right-0 top-0 w-80 h-80 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,212,170,0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent-green)', border: '1px solid rgba(0,212,170,0.2)' }}>
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
                            Welcome back!
                        </div>
                        <h2 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            {user?.name || 'Student'}
                        </h2>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                    </div>
                    <Link to="/student/exams" className="hl-btn-primary">
                        Browse Exams
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
            </div>

            {/* Available Tests */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Available Exams</h3>
                    <Link to="/student/exams" className="flex items-center gap-1 text-sm font-medium transition-colors"
                        style={{ color: 'var(--accent-green)', textDecoration: 'none' }}>
                        View All
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="hl-spinner" />
                    </div>
                ) : availableTests.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>No active exams right now</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Check back later or contact your instructor.</p>
                    </div>
                ) : (
                    <div>
                        {availableTests.map((test, idx) => {
                            const now = new Date();
                            const startTime = test.startTime ? new Date(test.startTime) : null;
                            const endTime = test.endTime ? new Date(test.endTime) : null;

                            return (
                                <div key={test._id} className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 gap-4 transition-colors"
                                    style={{ borderBottom: idx < availableTests.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0"
                                            style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent-green)' }}>
                                            {test.title?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{test.title}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {test.duration} min
                                                </span>
                                                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {test.questions?.length ?? 0} questions
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {startTime && now < startTime ? (
                                        <span className="hl-badge hl-badge-orange">Starts {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    ) : endTime && now > endTime ? (
                                        <span className="hl-badge hl-badge-red">Ended</span>
                                    ) : (
                                        <Link to={`/exam/${test._id}`} className="hl-btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                                            Start Exam →
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
