import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Clock, HelpCircle, Key, ArrowRight, Laptop } from 'lucide-react';

const isMobileOrTabletDevice = () => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return isMobileUA || window.innerWidth < 1024;
};

const StudentExams = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joinCode, setJoinCode] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinError, setJoinError] = useState('');
    const [isRestrictedDevice, setIsRestrictedDevice] = useState(isMobileOrTabletDevice);

    useEffect(() => {
        const onResize = () => setIsRestrictedDevice(isMobileOrTabletDevice());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

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

    if (isRestrictedDevice) {
        return (
            <div className="min-h-[65vh] flex items-center justify-center p-4 animate-fadeInUp">
                <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 text-center space-y-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
                        <Laptop className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold uppercase tracking-wider">
                            Laptop / Desktop Required
                        </span>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            Exams Only Open on Laptop
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Proctored exams are not allowed on mobile phones or tablets. Please open this page on a laptop or desktop computer to take an exam.
                        </p>
                        <p className="text-xs text-slate-500">
                            You can still access your <strong className="text-slate-700">Courses</strong> and <strong className="text-slate-700">Course Quizzes</strong> on mobile.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                        <Link
                            to="/student"
                            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold no-underline text-center transition-all"
                        >
                            Back to Dashboard
                        </Link>
                        <Link
                            to="/student/quizzes"
                            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold no-underline text-center transition-all border border-slate-200"
                        >
                            Go to Course Quizzes
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp pb-12">
            {/* Join by Code */}
            <div className="rounded-2xl p-7 relative overflow-hidden"
                style={{ background: '#ffffff', border: '1px solid #bfdbfe', boxShadow: '0 4px 16px rgba(37,99,235,0.06)' }}>
                <div className="absolute right-0 top-0 w-72 h-72 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.05) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                            <Key className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg" style={{ color: '#0f172a' }}>Join with Access Code</h3>
                            <p className="text-sm" style={{ color: '#64748b' }}>Enter the 6-character code from your teacher</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
                            <input
                                value={joinCode}
                                onChange={e => { setJoinCode(e.target.value.toUpperCase()); setJoinError(''); }}
                                maxLength={6}
                                placeholder="A B 1 2 C D"
                                className="text-center text-lg font-bold tracking-[0.3em] uppercase"
                                style={{
                                    width: '180px', padding: '11px 16px',
                                    background: '#f8fafc', border: '1px solid #cbd5e1',
                                    borderRadius: '10px', color: '#0f172a', outline: 'none',
                                    fontFamily: 'JetBrains Mono, monospace',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                            />
                            <button
                                type="submit"
                                disabled={joinLoading || joinCode.length < 6}
                                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all flex items-center justify-center gap-2"
                                style={{
                                    background: '#2563eb',
                                    opacity: (joinLoading || joinCode.length < 6) ? 0.6 : 1,
                                    cursor: (joinLoading || joinCode.length < 6) ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
                                }}>
                                {joinLoading ? (
                                    <><span className="hl-spinner" style={{ width: '14px', height: '14px' }} /> Joining...</>
                                ) : 'Join Exam →'}
                            </button>
                        </form>
                        {joinError && (
                            <p className="flex items-center gap-2 mt-3 text-sm text-red-600 font-semibold">
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
                    <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>Available Exams</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>All published exams you can attempt</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                    {tests.length} EXAMS
                </span>
            </div>

            {/* Exam Cards */}
            {loading ? (
                <div className="flex items-center justify-center h-48 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <div className="hl-spinner" style={{ width: '28px', height: '28px' }} />
                </div>
            ) : tests.length === 0 ? (
                <div className="rounded-2xl flex flex-col items-center justify-center py-20 text-center"
                    style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#f1f5f9' }}>
                        <Award className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="font-bold text-base mb-1" style={{ color: '#0f172a' }}>No exams published yet</p>
                    <p className="text-sm" style={{ color: '#64748b' }}>Ask your teacher for an access code, or wait for exams to appear here.</p>
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
                                style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl"
                                            style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                                            {test.title?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${test.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                            {test.published ? 'Open' : 'Draft'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-base mb-2 group-hover:text-blue-600 transition-colors" style={{ color: '#0f172a' }}>
                                        {test.title}
                                    </h3>
                                    {test.description && (
                                        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: '#64748b' }}>{test.description}</p>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg" style={{ background: '#f1f5f9', color: '#475569' }}>
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {test.duration} min
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg" style={{ background: '#f1f5f9', color: '#475569' }}>
                                            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                            {test.questions?.length ?? 0} Q's
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 pt-5" style={{ borderTop: '1px solid #f1f5f9' }}>
                                    {!test.published ? (
                                        <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed">Not Published</button>
                                    ) : hasEnded ? (
                                        <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-500 cursor-not-allowed">Exam Ended</button>
                                    ) : !hasStarted ? (
                                        <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 cursor-not-allowed">
                                            Starts {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </button>
                                    ) : (
                                        <Link to={`/exam/${test._id}`} className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 no-underline transition-all shadow-sm">
                                            <span>Start Exam</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
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
