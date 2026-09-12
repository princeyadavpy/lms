import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const riskStyle = (level) => {
    if (level === 'High') return 'hl-badge hl-badge-red';
    if (level === 'Medium') return 'hl-badge hl-badge-orange';
    return 'hl-badge hl-badge-green';
};

// ── Expandable detail panel ───────────────────────────────────────
function SubmissionDetail({ sub }) {
    const log = sub.proctorLog || {};
    const viols = [
        { label: 'Tab Switches', value: log.tabSwitches || 0, icon: '🔀' },
        { label: 'Fullscreen Exits', value: log.fullscreenExits || 0, icon: '🖥️' },
        { label: 'Copy Attempts', value: log.copyAttempts || 0, icon: '📋' },
        { label: 'Paste Attempts', value: log.pasteAttempts || 0, icon: '📌' },
        { label: 'DevTools', value: log.devToolsDetected || 0, icon: '🔧' },
    ];
    const totalViols = viols.reduce((s, v) => s + v.value, 0);

    return (
        <div className="border-t-2 border-[#000B1A] bg-white px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Score card */}
                <div>
                    <h4 className="text-xs font-bold text-[#000B1A]/70 uppercase tracking-widest mb-4">📊 Your Results</h4>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            ['Score', `${sub.totalMarks ?? 0} pts`, sub.totalMarks > 0 ? '#4ade80' : '#94a3b8'],
                            ['Percentile', sub.percentile != null ? `${sub.percentile}%` : '—', '#8B71FF'],
                            ['Rank', sub.rank != null ? `#${sub.rank}` : '—', '#ffaa00'],
                        ].map(([label, val, color]) => (
                            <div key={label} className="bg-white border-2 border-[#000B1A] rounded-none p-4 text-center shadow-[4px_4px_0_0_#000B1A]">
                                <div className="font-black text-xl drop-shadow-sm" style={{ color }}>{val}</div>
                                <div className="text-xs text-[#000B1A]/70 mt-1 font-medium">{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Answers */}
                    {(sub.answers?.length || 0) > 0 && (
                        <div className="mt-6">
                            <h4 className="text-xs font-bold text-[#000B1A]/70 uppercase tracking-widest mb-3">Your Answers</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
                                {sub.answers.map((ans, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-white border-2 border-[#000B1A] rounded-none px-4 py-3 text-sm shadow-[2px_2px_0_0_#000B1A]">
                                        <span className="text-blue-600 shrink-0 font-mono font-bold text-xs mt-0.5">Q{i + 1}</span>
                                        <span className="text-[#000B1A]/80 truncate flex-1 text-xs font-medium">
                                            {typeof ans.answerData === 'string'
                                                ? ans.answerData.substring(0, 100)
                                                : JSON.stringify(ans.answerData)?.substring(0, 100)}
                                        </span>
                                        {ans.marks != null && (
                                            <span className={`shrink-0 font-bold text-xs ${ans.marks > 0 ? 'text-emerald-400' : ans.marks < 0 ? 'text-red-400' : 'text-[#000B1A]/60'}`}>
                                                {ans.marks > 0 ? '+' : ''}{ans.marks} pt
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Proctoring */}
                <div>
                    <h4 className="text-xs font-bold text-[#000B1A]/70 uppercase tracking-widest mb-4">🛡️ Proctoring Summary</h4>
                    {totalViols === 0 ? (
                        <div className="bg-[#10b981] text-[#000B1A] border-2 border-[#000B1A] rounded-none p-5 text-center shadow-[4px_4px_0_0_#000B1A]">
                            <div className="text-3xl mb-2 drop-shadow-md">✅</div>
                            <p className="text-sm font-black">No violations recorded</p>
                            <p className="text-xs mt-1 font-bold">Clean exam session!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {viols.filter(v => v.value > 0).map(v => (
                                <div key={v.label} className="bg-[#ef4444] text-[#000B1A] border-2 border-[#000B1A] rounded-none p-3 text-center shadow-[2px_2px_0_0_#000B1A]">
                                    <div className="text-2xl mb-1">{v.icon}</div>
                                    <div className="font-black text-xl drop-shadow-sm">{v.value}</div>
                                    <div className="text-xs leading-tight font-bold mt-0.5">{v.label}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────
const MySubmissions = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        api.get('/submissions/mine')
            .then(res => { if (res.data.success) setSubmissions(res.data.data); })
            .catch(() => setError('Failed to load your submissions.'))
            .finally(() => setLoading(false));
    }, []);

    const statusBadge = (status) => status === 'Submitted'
        ? 'bg-[#10b981] text-[#000B1A] border-[#000B1A]'
        : 'bg-[#facc15] text-[#000B1A] border-[#000B1A]';

    if (loading) return (
        <div className="flex items-center justify-center h-64 neo-panel border-[#000B1A]">
            <div className="animate-spin rounded-none h-10 w-10 border-b-4 border-[#000B1A]" />
        </div>
    );

    if (error) return (
        <div className="bg-[#ef4444] text-[#000B1A] border-2 border-[#000B1A] rounded-none p-6 text-center font-black shadow-[4px_4px_0_0_#000B1A]">{error}</div>
    );

    if (submissions.length === 0) return (
        <div className="neo-panel border-[#000B1A] flex flex-col items-center justify-center py-20 text-[#000B1A]/70">
            <svg className="w-16 h-16 mb-4 opacity-50 text-[#000B1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="font-bold text-lg text-[#000B1A]">No submissions yet</p>
            <p className="text-sm mt-1">Complete an exam to see your results here</p>
            <button onClick={() => navigate('/student/exams')}
                className="mt-6 neo-cyan-button px-8 py-3 text-sm font-black">
                Browse Exams →
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-2">
                {[
                    ['Total Attempts', submissions.length, '📝'],
                    ['Completed', submissions.filter(s => s.status === 'Submitted').length, '✅'],
                    ['Best Score', Math.max(0, ...submissions.map(s => s.totalMarks || 0)) + ' pts', '🏆'],
                ].map(([label, value, icon]) => (
                    <div key={label} className="neo-panel border-[#000B1A] p-5 flex items-center gap-4 hover:-translate-x-[2px] hover:-translate-y-[2px] transition-transform hover:shadow-[8px_8px_0_0_#000B1A]">
                        <span className="text-3xl drop-shadow-md">{icon}</span>
                        <div>
                            <div className="font-black text-[#000B1A] text-2xl drop-shadow-sm">{value}</div>
                            <div className="text-xs font-semibold text-[#000B1A]/70 uppercase tracking-widest mt-0.5">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submission cards */}
            <div className="neo-panel overflow-hidden">
                <div className="px-8 py-5 border-b-2 border-[#000B1A] bg-white">
                    <h2 className="text-xl font-extrabold text-[#000B1A] tracking-tight drop-shadow-sm">My Exam Results</h2>
                    <p className="text-sm text-[#000B1A]/70 mt-0.5">Click any row to see full details</p>
                </div>

                <div className="divide-y-2 divide-white/80">
                    {submissions.map(sub => {
                        const test = sub.testId;
                        const risk = sub.proctorLog?.riskLevel || 'Low';
                        const isOpen = expanded === sub._id;
                        const totalViols = (sub.proctorLog?.tabSwitches || 0) +
                            (sub.proctorLog?.fullscreenExits || 0) + (sub.proctorLog?.copyAttempts || 0) +
                            (sub.proctorLog?.pasteAttempts || 0) + (sub.proctorLog?.devToolsDetected || 0);

                        return (
                            <div key={sub._id}>
                                <div
                                    onClick={() => setExpanded(isOpen ? null : sub._id)}
                                    className={`px-8 py-5 flex items-center gap-5 cursor-pointer transition-colors ${isOpen ? 'bg-cyan-400 text-[#000B1A]' : 'hover:bg-[#000B1A]/5'}`}
                                >
                                    {/* Test avatar */}
                                    <div className="w-12 h-12 rounded-none bg-white border-2 border-[#000B1A] flex items-center justify-center text-[#000B1A] font-black text-xl flex-shrink-0 shadow-[2px_2px_0_0_#000B1A]">
                                        {test?.title?.charAt(0).toUpperCase() || '?'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold text-lg truncate drop-shadow-sm ${isOpen ? 'text-[#000B1A]' : 'text-[#000B1A]'}`}>{test?.title || 'Unknown Test'}</p>
                                        <p className={`text-xs mt-0.5 font-bold ${isOpen ? 'text-[#000B1A]/80' : 'text-[#000B1A]/60'}`}>
                                            {sub.submitTime
                                                ? new Date(sub.submitTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                : 'In Progress'}
                                        </p>
                                    </div>

                                    {/* Score */}
                                    <div className="text-center hidden sm:block px-4">
                                        <div className={`font-black text-lg drop-shadow-sm ${isOpen ? 'text-[#000B1A]' : 'text-[#000B1A]'}`}>{sub.totalMarks ?? 0} pts</div>
                                        {sub.percentile != null && <div className={`text-xs font-black mt-0.5 tracking-wider uppercase ${isOpen ? 'text-[#000B1A]/80' : 'text-blue-600'}`}>Top {100 - sub.percentile}%</div>}
                                    </div>

                                    {/* Status */}
                                    <span className={`px-3 py-1.5 rounded-none text-xs font-bold border-2 shadow-[2px_2px_0_0_#000B1A] ${statusBadge(sub.status)}`}>
                                        {sub.status}
                                    </span>

                                    {/* Violations */}
                                    {totalViols > 0 && (
                                        <span className={`text-xs font-bold hidden md:inline px-3 py-1.5 rounded-none border-2 shadow-[2px_2px_0_0_#000B1A] ${totalViols > 5 ? 'bg-[#ef4444] text-[#000B1A] border-[#000B1A]' : 'bg-[#f97316] text-[#000B1A] border-[#000B1A]'}`}>
                                            ⚠️ {totalViols} Viol.
                                        </span>
                                    )}

                                    {/* Arrow */}
                                    <svg className={`w-5 h-5 text-[#000B1A]/60 transition-transform flex-shrink-0 ${isOpen ? 'rotate-90 text-blue-600' : 'group-hover:text-[#000B1A]'}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>

                                {isOpen && (
                                    <div className="animate-fadeInUp">
                                        <SubmissionDetail sub={sub} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MySubmissions;
