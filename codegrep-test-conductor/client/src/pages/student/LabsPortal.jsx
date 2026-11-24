import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import CodeEditor from '../../components/CodeEditor';
import {
    Code2,
    Play,
    CheckCircle2,
    XCircle,
    Clock,
    Terminal,
    BarChart3,
    ArrowLeft,
    RefreshCw,
    Sparkles
} from 'lucide-react';

const LabsPortal = () => {
    const { labId } = useParams();
    const [labs, setLabs] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [loading, setLoading] = useState(true);

    // Code execution state
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [customInput, setCustomInput] = useState('');
    const [runningCode, setRunningCode] = useState(false);
    const [runOutput, setRunOutput] = useState('');
    const [submissionResult, setSubmissionResult] = useState(null);
    const [submittingCode, setSubmittingCode] = useState(false);

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const res = await api.get('/labs');
                if (res.data.success) {
                    setLabs(res.data.data);
                    if (labId) {
                        const target = res.data.data.find(l => l._id === labId);
                        if (target) loadLabDetails(target);
                    } else if (res.data.data.length > 0) {
                        loadLabDetails(res.data.data[0]);
                    }
                }
            } catch (err) {
                console.error('Failed to load labs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLabs();
    }, [labId]);

    const loadLabDetails = async (lab) => {
        setSelectedLab(lab);
        setSubmissionResult(null);
        setRunOutput('');
        const lang = lab.language || 'cpp';
        setLanguage(lang);

        const initialStub = lab.starterCode?.[lang] ||
            (lang === 'cpp'
                ? '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << "Hello World" << endl;\n    return 0;\n}'
                : 'def solve():\n    # Write your solution here\n    print("Hello World")\n\nsolve()');
        setCode(initialStub);
    };

    // Run Code against custom input
    const handleRunCode = async () => {
        if (!selectedLab) return;
        setRunningCode(true);
        setRunOutput('');
        try {
            const res = await api.post(`/labs/${selectedLab._id}/run`, {
                source_code: code,
                language: language,
                custom_input: customInput
            });
            if (res.data.success) {
                const stdout = res.data.data.stdout || res.data.data.stderr || 'No output.';
                setRunOutput(stdout);
            }
        } catch (err) {
            setRunOutput('Error running code: ' + (err.response?.data?.msg || err.message));
        } finally {
            setRunningCode(false);
        }
    };

    // Submit Code against all hidden test cases
    const handleSubmitCode = async () => {
        if (!selectedLab) return;
        setSubmittingCode(true);
        setSubmissionResult(null);
        try {
            const res = await api.post(`/labs/${selectedLab._id}/submit`, {
                source_code: code,
                language: language
            });
            if (res.data.success) {
                setSubmissionResult(res.data.data);
            }
        } catch (err) {
            console.error('Submit error:', err);
        } finally {
            setSubmittingCode(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="hl-spinner" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp pb-12">
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: '#e2e8f0' }}>
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: '#0f172a' }}>
                        <Code2 className="w-6 h-6" style={{ color: '#2563eb' }} />
                        <span>Practice Labs & Coding Sandbox</span>
                    </h1>
                    <p className="text-xs mt-1" style={{ color: '#64748b' }}>Multi-language practical programming exercises with automated Judge0 compilation</p>
                </div>
            </div>

            {/* Split layout: Labs List (Left) & Active Lab Code Studio (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Drawer: Labs Selector */}
                <div className="lg:col-span-4 space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider px-1" style={{ color: '#64748b' }}>Available Lab Exercises</h2>
                    <div className="space-y-2.5">
                        {labs.map((lab) => {
                            const isSelected = selectedLab?._id === lab._id;
                            return (
                                <button
                                    key={lab._id}
                                    onClick={() => loadLabDetails(lab)}
                                    className="w-full text-left p-4 rounded-2xl transition-all duration-200"
                                    style={{
                                        background: isSelected ? '#eff6ff' : '#ffffff',
                                        border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                                        boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : '0 1px 3px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded" style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                                            {lab.language || 'cpp'}
                                        </span>
                                        <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#d97706' }}>
                                            <BarChart3 className="w-3.5 h-3.5" />
                                            <span>{lab.userScore || 45}/{lab.maxScore || 50}</span>
                                        </span>
                                    </div>
                                    <h3 className="text-xs font-bold line-clamp-1" style={{ color: '#0f172a' }}>{lab.title}</h3>
                                    <p className="text-[11px] line-clamp-2 mt-1" style={{ color: '#64748b' }}>{lab.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Area: Interactive Editor & Execution Hub */}
                <div className="lg:col-span-8 space-y-4">
                    {selectedLab ? (
                        <div className="p-6 rounded-3xl space-y-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: '#f1f5f9' }}>
                                <div>
                                    <h2 className="text-lg font-black" style={{ color: '#0f172a' }}>{selectedLab.title}</h2>
                                    <span className="text-xs" style={{ color: '#64748b' }}>{selectedLab.category} • Max Score: {selectedLab.maxScore}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-mono focus:outline-none"
                                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
                                    >
                                        <option value="cpp">C++ (GCC 14)</option>
                                        <option value="python">Python (3.12)</option>
                                        <option value="java">Java (JDK 17)</option>
                                        <option value="javascript">JavaScript (Node 20)</option>
                                        <option value="c">C (GCC 14)</option>
                                    </select>
                                    <button
                                        onClick={handleRunCode}
                                        disabled={runningCode}
                                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
                                        style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                                    >
                                        <Play className="w-3.5 h-3.5" />
                                        <span>{runningCode ? 'Compiling...' : 'Run Code'}</span>
                                    </button>
                                    <button
                                        onClick={handleSubmitCode}
                                        disabled={submittingCode}
                                        className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl text-xs font-bold text-white transition-all"
                                        style={{
                                            background: '#2563eb',
                                            boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
                                        }}
                                    >
                                        <span>{submittingCode ? 'Grading...' : 'Submit Lab'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Problem Statement */}
                            <div className="p-4 rounded-2xl text-xs leading-relaxed" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}>
                                <h4 className="font-bold mb-1" style={{ color: '#0f172a' }}>Problem Statement</h4>
                                <p>{selectedLab.description}</p>
                            </div>

                            {/* Code Editor */}
                            <div className="h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <CodeEditor
                                    code={code}
                                    setCode={setCode}
                                    language={language}
                                    theme="vs-dark"
                                />
                            </div>

                            {/* Custom Input / Run Output */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Custom Stdin Input</label>
                                    <textarea
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        placeholder="Enter custom input arguments here..."
                                        rows={3}
                                        className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Execution Output (Stdout)</label>
                                    <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-white/5 min-h-[75px] max-h-[120px] overflow-y-auto whitespace-pre-wrap">
                                        {runOutput || 'No output yet.'}
                                    </div>
                                </div>
                            </div>

                            {/* Submission Results / Test Cases evaluation */}
                            {submissionResult && (
                                <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Automated Test Case Evaluation</h4>
                                        <span className="text-sm font-black" style={{ color: submissionResult.failedCount === 0 ? 'var(--accent-green)' : '#f59e0b' }}>
                                            Score: {submissionResult.score} / {submissionResult.maxScore} ({submissionResult.passedCount}/{submissionResult.totalCases} Passed)
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {submissionResult.results.map((res, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                                                <div className="flex items-center gap-2">
                                                    {res.passed ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-400" />
                                                    )}
                                                    <span className="text-slate-200">Test Case #{idx + 1} {res.isHidden ? '(Hidden)' : ''}</span>
                                                </div>
                                                <span className="text-slate-400 font-mono">{res.time}s • {res.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center py-24 text-slate-400">
                            Select a practice lab to begin coding.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default LabsPortal;

