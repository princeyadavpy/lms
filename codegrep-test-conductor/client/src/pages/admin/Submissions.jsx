import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const statusBadge = (status) => {
    const colors = { Submitted: 'bg-[#10b981] text-[#000B1A]', InProgress: 'bg-[#facc15] text-[#000B1A]' };
    return `px-2.5 py-1 rounded-none border-2 border-[#000B1A] text-xs font-black shadow-[2px_2px_0_0_#000B1A] ${colors[status] || 'bg-white text-[#000B1A]'}`;
};

const riskColor = (level) => {
    if (!level) return 'text-[#000B1A]/70';
    if (level === 'High') return 'text-red-600 font-bold';
    if (level === 'Medium') return 'text-orange-500 font-semibold';
    return 'text-green-600';
};

// ── Answer Viewer Modal ──────────────────────────────────────────────────────
function AnswerViewer({ answer, onClose, onGrade }) {
    const [marks, setMarks] = useState(answer?.marks != null ? answer.marks : '');
    const [isGrading, setIsGrading] = useState(false);

    useEffect(() => {
        setMarks(answer?.marks != null ? answer.marks : '');
    }, [answer]);

    if (!answer) return null;

    const isCoding = answer.type === 'Coding';
    // answerData for coding is { language, code } in newer submissions, or a raw string in older ones
    const code = isCoding 
        ? (typeof answer.answerData === 'string' ? answer.answerData : (answer.answerData?.code || ''))
        : String(answer.answerData || '');
    const language = isCoding 
        ? (typeof answer.answerData === 'string' ? 'unknown' : (answer.answerData?.language || 'text')) 
        : 'text';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80">
            <div className="neo-panel border-[#000B1A] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b-2 border-[#000B1A] bg-white flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-[#000B1A] flex items-center gap-2 tracking-widest uppercase">
                            {isCoding ? '💻 Student Code' : '📝 Student Answer'}
                            <span className="text-xs font-bold text-[#000B1A] bg-white border-2 border-[#000B1A] px-2 py-0.5 rounded-none uppercase tracking-wider shadow-[2px_2px_0_0_#000B1A]">
                                {isCoding ? language : 'MCQ'}
                            </span>
                        </h3>
                        <p className="text-xs text-[#000B1A]/70 mt-0.5 font-bold">Question ID: {answer.questionId}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#000B1A]/5 rounded-none text-[#000B1A] transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 bg-white">
                    {isCoding ? (
                        <div className="relative rounded-none border-2 border-[#000B1A] bg-[#1e1e1e] overflow-hidden shadow-[4px_4px_0_0_#000B1A]">
                            <div className="absolute top-3 right-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none select-none">
                                {language}
                            </div>
                            <pre className="p-5 font-mono text-sm leading-relaxed text-slate-300 overflow-x-auto">
                                <code>{code}</code>
                            </pre>
                        </div>
                    ) : (
                        <div className="bg-white rounded-none border-2 border-[#000B1A] p-8 text-center shadow-[4px_4px_0_0_#000B1A]">
                            <div className="text-sm uppercase tracking-widest text-[#000B1A] font-bold mb-4">Selected Option</div>
                            <div className="text-4xl font-black text-[#000B1A] bg-white w-20 h-20 flex items-center justify-center rounded-none mx-auto border-2 border-[#000B1A] shadow-[4px_4px_0_0_#000B1A] mb-4">
                                {code}
                            </div>
                            <p className="text-[#000B1A]/70 text-sm font-bold">This is the answer selected by the student for this multiple choice question.</p>
                        </div>
                    )}
                </div>

                {/* Footer / Grading */}
                <div className="px-6 py-4 border-t-2 border-[#000B1A] flex items-center justify-between bg-white">
                    {isCoding ? (
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-black uppercase tracking-wider text-[#000B1A]">Grade:</label>
                            <input
                                type="number"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                                className="w-20 px-3 py-1.5 border-2 border-[#000B1A] text-sm font-bold bg-white text-[#000B1A] shadow-[2px_2px_0_0_#000B1A] focus:outline-none"
                                placeholder="Marks"
                            />
                            <button
                                onClick={async () => {
                                    if (marks === '') return;
                                    setIsGrading(true);
                                    await onGrade(answer.questionId?._id || answer.questionId, Number(marks));
                                    setIsGrading(false);
                                }}
                                disabled={isGrading}
                                className="neo-button !bg-[#10b981] px-4 py-1.5 text-xs disabled:opacity-50"
                            >
                                {isGrading ? 'Saving...' : 'Submit Grade'}
                            </button>
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <button
                        onClick={onClose}
                        className="neo-button px-6 py-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Expandable Proctor Detail Panel ──────────────────────────────────────────
function ProctorDetail({ sub, onViewAnswer }) {
    const log = sub.proctorLog || {};
    const events = log.flaggedEvents || [];
    const violations = [
        { label: 'Tab Switches', value: log.tabSwitches ?? 0, icon: '🔀' },
        { label: 'Fullscreen Exits', value: log.fullscreenExits ?? 0, icon: '🖥️' },
        { label: 'Copy Attempts', value: log.copyAttempts ?? 0, icon: '📋' },
        { label: 'Paste Attempts', value: log.pasteAttempts ?? 0, icon: '📌' },
        { label: 'DevTools Opens', value: log.devToolsDetected ?? 0, icon: '🔧' },
    ];
    const total = violations.reduce((s, v) => s + v.value, 0);

    return (
        <tr>
            <td colSpan="9" className="px-0 py-0 bg-white border-b-2 border-[#000B1A]">
                <div className="px-6 py-5">
                    {/* Summary row */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-black text-[#000B1A] uppercase tracking-widest">🛡️ Proctoring Report</span>
                        <span className={`text-xs px-2.5 py-1 rounded-none border-2 shadow-[2px_2px_0_0_#000B1A] font-black uppercase ${log.riskLevel === 'High' ? 'bg-[#ef4444] text-[#000B1A] border-[#000B1A]' :
                            log.riskLevel === 'Medium' ? 'bg-[#f97316] text-[#000B1A] border-[#000B1A]' :
                                'bg-[#10b981] text-[#000B1A] border-[#000B1A]'}`}>
                            Risk: {log.riskLevel || 'Low'}
                        </span>
                        <span className="text-xs text-[#000B1A]/70 font-bold">Total violations: <b>{total}</b></span>
                        {sub.ipAddress && <span className="text-xs text-[#000B1A]/60 ml-auto font-bold">IP: {sub.ipAddress}</span>}
                    </div>

                    {/* Violation counters */}
                    <div className="grid grid-cols-5 gap-3 mb-4">
                        {violations.map(v => (
                            <div key={v.label} className={`rounded-none border-2 p-3 text-center shadow-[4px_4px_0_0_#000B1A] ${v.value > 0 ? 'border-[#ef4444] bg-[#ef4444]' : 'border-[#000B1A] bg-white'}`}>
                                <div className="text-xl mb-1">{v.icon}</div>
                                <div className={`text-2xl font-black ${v.value > 0 ? 'text-[#000B1A]' : 'text-[#000B1A]/70'}`}>{v.value}</div>
                                <div className={`text-xs font-bold mt-0.5 ${v.value > 0 ? 'text-[#000B1A]' : 'text-[#000B1A]/60'}`}>{v.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Flagged event timeline */}
                    {events.length > 0 ? (
                        <div>
                            <p className="text-xs font-black text-[#000B1A] uppercase tracking-wider mb-2">Event Timeline</p>
                            <div className="max-h-40 overflow-y-auto bg-white border-2 border-[#000B1A] rounded-none divide-y-2 divide-white/80 shadow-[4px_4px_0_0_#000B1A]">
                                {events.map((ev, i) => (
                                    <div key={i} className="px-4 py-2 flex items-center gap-3 text-sm">
                                        <span className="font-mono text-[#000B1A]/70 font-bold text-xs w-22 flex-shrink-0">
                                            {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString('en-IN') : `Event ${i + 1}`}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-none border-2 border-[#000B1A] text-xs font-black shadow-[2px_2px_0_0_#000B1A] ${ev.type?.includes('TAB') ? 'bg-[#f97316] text-[#000B1A]' :
                                            ev.type?.includes('FULL') ? 'bg-[#a855f7] text-[#000B1A]' :
                                                ev.type?.includes('COPY') ? 'bg-[#3b82f6] text-[#000B1A]' :
                                                    ev.type?.includes('PASTE') ? 'bg-[#22d3ee] text-[#000B1A]' :
                                                        ev.type?.includes('DEV') ? 'bg-[#ef4444] text-[#000B1A]' :
                                                            'bg-white text-[#000B1A]'}`}>
                                            {ev.type}
                                        </span>
                                        <span className="text-[#000B1A] font-bold">{ev.message || '—'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-[#000B1A]/70 font-bold">No flagged events recorded.</p>
                    )}

                    {/* Answers summary */}
                    {sub.answers?.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs font-black text-[#000B1A] uppercase tracking-wider mb-2">Answers ({sub.answers.length} questions)</p>
                            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {sub.answers.map((ans, i) => {
                                    const qList = sub.testId?.questions || [];
                                    const qId = ans.questionId?._id || ans.questionId;
                                    const exactNum = qList.findIndex(id => id.toString() === (qId ? qId.toString() : '')) + 1;
                                    const qTitle = ans.questionId?.title || 'Unknown Question';

                                    return (
                                        <div key={i} className="flex items-center gap-3 text-xs bg-white border-2 border-[#0d0a1c] rounded-none px-4 py-2.5 shadow-[4px_4px_0_0_#0d0a1c] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-transform group text-[#000B1A]">
                                            <div className="w-8 h-8 rounded-none bg-white flex items-center justify-center font-black text-[#000B1A] border-2 border-[#0d0a1c] flex-shrink-0">
                                                {exactNum || i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${ans.type === 'Coding' ? 'text-blue-500' : 'text-purple-500'}`}>
                                                        {ans.type}
                                                    </span>
                                                    {ans.status === 'Pending' && <span className="bg-[#facc15] text-[#000B1A] px-1.5 py-0.5 rounded-none border-2 border-[#0d0a1c] text-[9px] font-black shadow-[2px_2px_0_0_#0d0a1c]">PENDING EVAL</span>}
                                                    <span className="text-[#000B1A]/60 text-[9px] font-bold truncate">• {qTitle}</span>
                                                </div>
                                                <div className="text-[#000B1A] truncate font-black">
                                                    {ans.type === 'Coding'
                                                        ? `Language: ${typeof ans.answerData === 'string' ? 'unknown' : (ans.answerData?.language || 'unknown')}`
                                                        : `Selected: ${ans.answerData || '—'}`}
                                                </div>
                                            </div>
                                            {ans.marks != null && (
                                                <div className="text-right flex-shrink-0">
                                                    <div className={`font-black text-sm ${ans.marks > 0 ? 'text-green-600' : ans.marks < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                                        {ans.marks > 0 ? `+${ans.marks}` : ans.marks} pts
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => onViewAnswer({ ...ans, submissionId: sub._id })}
                                                className="neo-button px-3 py-1.5 text-[10px] font-black flex-shrink-0"
                                            >
                                                View Solution
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ── Export Modal ────────────────────────────────────────────────────────
function ExportModal({ onClose, submissions }) {
    const tests = [...new Map(submissions.filter(s => s.testId).map(s => [s.testId._id, s.testId])).values()];
    const [selectedTest, setSelectedTest] = useState(tests.length > 0 ? tests[0]._id : '');
    const [reportType, setReportType] = useState('summary');
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        if (!selectedTest) return alert('Please select a test');
        setLoading(true);
        try {
            const res = await api.get(`/admin/submissions/export/${selectedTest}?type=${reportType}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            const testTitle = tests.find(t => t._id === selectedTest)?.title || 'Test';
            a.download = `Test_Results_${testTitle.replace(/\\s+/g, '_')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Export failed. Make sure you have the correct permissions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110]">
            <div className="neo-panel bg-white border-[#000B1A] w-[90%] max-w-[400px] p-8">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-[#000B1A] text-lg font-black uppercase tracking-widest m-0">📊 Export Report</h3>
                    <button onClick={onClose} className="text-[#000B1A] hover:bg-[#000B1A]/5 border-2 border-transparent hover:border-[#000B1A] rounded-none w-8 h-8 flex items-center justify-center transition-colors">✕</button>
                </div>

                {tests.length === 0 ? (
                    <p className="text-sm font-bold text-[#000B1A]/70">No test data available to export.</p>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-2">Select Test</label>
                            <select value={selectedTest} onChange={e => setSelectedTest(e.target.value)}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                {tests.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-2">Report Type</label>
                            <div className="flex gap-3">
                                <button onClick={() => setReportType('summary')}
                                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#000B1A] transition-transform shadow-[2px_2px_0_0_#000B1A] hover:-translate-y-0.5 ${reportType === 'summary' ? 'bg-[#3b82f6] text-[#000B1A]' : 'bg-white text-[#000B1A]'}`}>
                                    Summary
                                </button>
                                <button onClick={() => setReportType('complete')}
                                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#000B1A] transition-transform shadow-[2px_2px_0_0_#000B1A] hover:-translate-y-0.5 ${reportType === 'complete' ? 'bg-[#10b981] text-[#000B1A]' : 'bg-white text-[#000B1A]'}`}>
                                    Complete Details
                                </button>
                            </div>
                            <p className="text-[10px] text-[#000B1A]/70 font-bold uppercase tracking-wider mt-2">
                                {reportType === 'summary' ? 'Includes basic details, scores, and proctoring stats.' : 'Includes everything in summary, plus columns for each question\'s answer and marks.'}
                            </p>
                        </div>
                        <button onClick={handleExport} disabled={loading || !selectedTest}
                            className="neo-button w-full mt-2 py-3 text-sm disabled:opacity-60">
                            {loading ? 'Generating...' : 'Download Excel'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main Submissions Page ─────────────────────────────────────────────────────
const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null); // _id of expanded row
    const [search, setSearch] = useState('');
    const [filterRisk, setFilterRisk] = useState('All');
    const [viewingAnswer, setViewingAnswer] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);

    const handleGrade = async (submissionId, questionId, marks) => {
        try {
            const res = await api.put(`/admin/submissions/${submissionId}/grade/${questionId}`, { marks });
            if (res.data.success) {
                setSubmissions(prev => prev.map(s => s._id === submissionId ? res.data.data : s));
                setViewingAnswer(null);
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to grade submission');
        }
    };

    const loadSubmissions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/submissions');
            if (res.data.success) setSubmissions(res.data.data);
        } catch { setError('Failed to load submissions.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadSubmissions(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this submission? This will reset the student\'s attempt count for this test.')) return;
        try {
            const res = await api.delete(`/admin/submissions/${id}`);
            if (res.data.success) {
                setSubmissions(prev => prev.filter(s => s._id !== id));
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to delete submission');
        }
    };

    const totalViolations = (sub) => {
        const l = sub.proctorLog || {};
        return (l.tabSwitches ?? 0) + (l.fullscreenExits ?? 0) + (l.copyAttempts ?? 0) + (l.pasteAttempts ?? 0) + (l.devToolsDetected ?? 0);
    };

    const filtered = submissions.filter(sub => {
        const searchLower = search ? search.toLowerCase() : '';
        const matchSearch = !search ||
            (sub.studentId?.name?.toLowerCase() || '').includes(searchLower) ||
            (sub.studentId?.email?.toLowerCase() || '').includes(searchLower) ||
            (sub.testId?.title?.toLowerCase() || '').includes(searchLower);
        const risk = sub.proctorLog?.riskLevel || 'Low';
        const matchRisk = filterRisk === 'All' || risk === filterRisk;
        return matchSearch && matchRisk;
    });

    const handleDownloadJSON = (sub) => {
        const report = {
            student: {
                name: sub.studentId?.name,
                email: sub.studentId?.email,
                ip: sub.ipAddress
            },
            test: {
                title: sub.testId?.title,
                submittedAt: sub.submitTime,
                score: sub.totalMarks,
                percentile: sub.percentile,
                rank: sub.rank
            },
            proctoring: {
                riskLevel: sub.proctorLog?.riskLevel || 'Low',
                tabSwitches: sub.proctorLog?.tabSwitches || 0,
                fullscreenExits: sub.proctorLog?.fullscreenExits || 0,
                copyAttempts: sub.proctorLog?.copyAttempts || 0,
                pasteAttempts: sub.proctorLog?.pasteAttempts || 0,
                devToolsDetected: sub.proctorLog?.devToolsDetected || 0,
                flaggedEvents: sub.proctorLog?.flaggedEvents || []
            },
            answers: sub.answers?.map(ans => ({
                questionId: ans.questionId?._id || ans.questionId,
                type: ans.type,
                marks: ans.marks,
                answer: ans.type === 'Coding' ? ans.answerData?.code : ans.answerData,
                language: ans.answerData?.language || 'N/A'
            }))
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Submission_${sub.studentId?.name?.replace(/\s+/g, '_')}_${sub.testId?.title?.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="neo-panel border-[#000B1A] overflow-hidden min-h-[600px]">
            {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} submissions={submissions} />}

            {/* Header */}
            <div className="p-6 border-b-2 border-[#000B1A] flex flex-wrap justify-between items-center gap-3 bg-white">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-[#000B1A]">All Submissions</h2>
                    <p className="text-sm text-[#000B1A]/70 font-bold mt-0.5">Review every exam submission — click a row to see proctor report and student answers</p>
                </div>
                <span className="text-sm font-black text-[#000B1A] bg-white border-2 border-[#000B1A] px-3 py-1 rounded-none shadow-[2px_2px_0_0_#000B1A]">{submissions.length} submissions</span>
            </div>

            {/* Filters */}
            <div className="px-6 py-3 border-b-2 border-[#000B1A] flex flex-wrap items-center gap-3 bg-white">
                <input
                    placeholder="Search by student, email, or test..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="flex-1 min-w-[200px] border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-3 py-2 text-sm focus:outline-none shadow-[4px_4px_0_0_#000B1A] focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold"
                />
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#000B1A] font-black uppercase">Risk:</span>
                    {['All', 'Low', 'Medium', 'High'].map(r => (
                        <button key={r} onClick={() => setFilterRisk(r)}
                            className={`px-3 py-1.5 rounded-none border-2 border-[#000B1A] text-xs font-black transition-all shadow-[2px_2px_0_0_#000B1A] ${filterRisk === r
                                ? r === 'High' ? 'bg-[#ef4444] text-[#000B1A]' : r === 'Medium' ? 'bg-[#f97316] text-[#000B1A]' : 'bg-[#3b82f6] text-[#000B1A]'
                                : 'bg-white text-[#000B1A] hover:bg-[#000B1A]/5'}`}>
                            {r}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowExportModal(true)}
                    disabled={submissions.length === 0}
                    className="neo-button ml-auto !bg-[#10b981] disabled:opacity-50 py-2 px-4 text-xs font-black flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Excel Report
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b-2 border-[#000B1A] text-[#000B1A]">
                                {['', 'Student', 'Test', 'Score', 'Status', 'Violations ⚠️', 'Risk', 'Auto Submit', 'Submitted At', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.1em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-white/80">
                            {filtered.length === 0 ? (
                                <tr><td colSpan="9" className="text-center p-12 text-[#000B1A]/70 font-bold">
                                    <div className="flex flex-col items-center space-y-2">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        <span className="font-black text-[#000B1A]">No submissions found</span>
                                        <span className="text-xs">Try adjusting your filters or search terms.</span>
                                    </div>
                                </td></tr>
                            ) : filtered.map(sub => {
                                const viols = totalViolations(sub);
                                const risk = sub.proctorLog?.riskLevel || 'Low';
                                const isOpen = expanded === sub._id;
                                return (
                                    <React.Fragment key={sub._id}>
                                        <tr
                                            onClick={() => setExpanded(isOpen ? null : sub._id)}
                                            className={`cursor-pointer transition-colors ${isOpen ? 'bg-blue-500/20' : 'hover:bg-[#000B1A]/5'}`}
                                        >
                                            {/* Expand arrow */}
                                            <td className="px-4 py-4 w-8">
                                                <div className={`w-6 h-6 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] flex items-center justify-center transition-all ${isOpen ? 'bg-[#3b82f6] text-[#000B1A]' : 'bg-white text-[#000B1A]'}`}>
                                                    <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-black text-[#000B1A] text-sm tracking-tight">{sub.studentId?.name || '—'}</div>
                                                <div className="text-[10px] text-[#000B1A]/70 font-medium uppercase tracking-wider">{sub.studentId?.email || ''}</div>
                                            </td>
                                            <td className="px-4 py-4 text-[#000B1A] text-sm max-w-[140px] truncate font-bold" title={sub.testId?.title}>
                                                {sub.testId?.title || '—'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`font-black text-sm ${(sub.totalMarks ?? 0) > 0 ? 'text-[#10b981]' : 'text-[#000B1A]'}`}>
                                                    {sub.totalMarks ?? 0} pts
                                                </span>
                                                {sub.percentile != null && (
                                                    <div className="text-[10px] text-[#000B1A]/70 font-bold uppercase">Top {100 - sub.percentile}%</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4"><span className={statusBadge(sub.status)}>{sub.status}</span></td>
                                            <td className="px-4 py-4">
                                                <span className={`text-sm font-black ${viols > 5 ? 'text-[#ef4444]' : viols > 0 ? 'text-[#f97316]' : 'text-[#000B1A]/70'}`}>
                                                    {viols > 0 ? `⚠️ ${viols}` : '✓ 0'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2.5 py-1 rounded-none border-2 text-[10px] shadow-[2px_2px_0_0_#000B1A] font-black uppercase tracking-wider ${risk === 'High' ? 'bg-[#ef4444] text-[#000B1A] border-[#000B1A]' :
                                                    risk === 'Medium' ? 'bg-[#f97316] text-[#000B1A] border-[#000B1A]' :
                                                        'bg-[#10b981] text-[#000B1A] border-[#000B1A]'}`}>
                                                    {risk}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2.5 py-1 rounded-none border-2 shadow-[2px_2px_0_0_#000B1A] text-[10px] font-black uppercase tracking-wider ${sub.isAutoSubmitted ? 'bg-[#f97316] text-[#000B1A] border-[#000B1A]' : 'bg-white text-[#000B1A] border-[#000B1A]'}`}>
                                                    {sub.isAutoSubmitted ? '⏰ Auto' : '✓ Manual'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-[#000B1A]/70 text-xs whitespace-nowrap font-bold">
                                                {sub.submitTime ? new Date(sub.submitTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                                            </td>
                                            <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDownloadJSON(sub)}
                                                        className="p-2 text-[#000B1A] hover:text-[#3b82f6] hover:bg-[#000B1A]/5 transition-colors"
                                                        title="Download Detailed Report (JSON)"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(sub._id)}
                                                        className="p-2 text-[#000B1A] hover:text-[#ef4444] hover:bg-[#000B1A]/5 transition-colors"
                                                        title="Delete Submission (Reset Attempt)"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isOpen && <ProctorDetail sub={sub} onViewAnswer={setViewingAnswer} />}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Answer Viewer Modal */}
            <AnswerViewer
                answer={viewingAnswer}
                onClose={() => setViewingAnswer(null)}
                onGrade={(questionId, marks) => handleGrade(viewingAnswer.submissionId, questionId, marks)}
            />
        </div>
    );
};

export default Submissions;
