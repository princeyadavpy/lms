import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const statusBadge = (status) => {
    const colors = { Submitted: 'bg-[#10b981] text-[#000B1A]', InProgress: 'bg-[#facc15] text-[#000B1A]' };
    return `px-2.5 py-1 rounded-none border-2 border-[#000B1A] text-xs font-black shadow-[2px_2px_0_0_#000B1A] ${colors[status] || 'bg-white text-[#000B1A]'}`;
};

const LANG_MAP = {
    python: { id: 100, name: 'Python (3.12.5)' },
    cpp: { id: 105, name: 'C++ (GCC 14.1.0)' },
    java: { id: 91, name: 'Java (JDK 17.0.6)' },
    javascript: { id: 97, name: 'JavaScript (Node 20)' },
    c: { id: 103, name: 'C (GCC 14.1.0)' },
    typescript: { id: 101, name: 'TypeScript (5.6.2)' },
    go: { id: 106, name: 'Go (1.22.0)' },
};

// ── Manual Code Inspection, Grading & Judge0 Live Sandbox Modal ───────────────
function AnswerViewer({ answer, onClose, onGrade }) {
    const [marks, setMarks] = useState(answer?.marks != null ? answer.marks : (answer?.marksAwarded != null ? answer.marksAwarded : ''));
    const [feedback, setFeedback] = useState(answer?.teacherFeedback || '');
    const [isGrading, setIsGrading] = useState(false);
    const [gradeSuccess, setGradeSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('solution'); // 'solution' | 'runner'

    // Runner state
    const isCoding = answer?.type === 'Coding';
    const initialCode = isCoding
        ? (typeof answer?.answerData === 'string' ? answer.answerData : (answer?.answerData?.code || ''))
        : String(answer?.answerData || '');
    const initialLang = isCoding
        ? (typeof answer?.answerData === 'string' ? 'javascript' : (answer?.answerData?.language || 'javascript'))
        : 'javascript';

    const [runCodeVal, setRunCodeVal] = useState(initialCode);
    const [runLang, setRunLang] = useState(initialLang);
    const [stdinVal, setStdinVal] = useState('');
    const [expectedOutputVal, setExpectedOutputVal] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isTestingAll, setIsTestingAll] = useState(false);
    const [runOutput, setRunOutput] = useState(null); // single run result
    const [allCasesOutput, setAllCasesOutput] = useState(null); // full submit test cases result
    const [consoleSubTab, setConsoleSubTab] = useState('stdout'); // 'stdout' | 'stderr' | 'compile' | 'cases'

    useEffect(() => {
        setMarks(answer?.marks != null ? answer.marks : (answer?.marksAwarded != null ? answer.marksAwarded : ''));
        setFeedback(answer?.teacherFeedback || '');
        setGradeSuccess(false);

        const c = isCoding
            ? (typeof answer?.answerData === 'string' ? answer.answerData : (answer?.answerData?.code || ''))
            : String(answer?.answerData || '');
        const l = isCoding
            ? (typeof answer?.answerData === 'string' ? 'javascript' : (answer?.answerData?.language || 'javascript'))
            : 'javascript';
        setRunCodeVal(c);
        setRunLang(l);
        setRunOutput(null);
        setAllCasesOutput(null);

        // Pre-fill stdin with first test case if available
        const qObj = answer?.questionId;
        if (qObj && typeof qObj === 'object' && Array.isArray(qObj.testCases) && qObj.testCases.length > 0) {
            setStdinVal(qObj.testCases[0].input || '');
            setExpectedOutputVal(qObj.testCases[0].output || '');
        } else {
            setStdinVal('');
            setExpectedOutputVal('');
        }
    }, [answer]);

    if (!answer) return null;

    const questionObj = typeof answer.questionId === 'object' ? answer.questionId : null;
    const qTitle = questionObj?.title || `Question ID: ${answer.questionId}`;
    const maxMarks = questionObj?.marks || 10;
    const testCases = questionObj?.testCases || [];

    // ▶ Run Single Test Input against Judge0
    const handleRunSingle = async () => {
        setIsRunning(true);
        setRunOutput(null);
        setAllCasesOutput(null);
        try {
            const langId = LANG_MAP[runLang]?.id || 97;
            const res = await api.post('/execute/run', {
                source_code: runCodeVal,
                language_id: langId,
                stdin: stdinVal
            });
            if (res.data.success) {
                setRunOutput(res.data.data);
                if (res.data.data.compile_output) setConsoleSubTab('compile');
                else if (res.data.data.stderr) setConsoleSubTab('stderr');
                else setConsoleSubTab('stdout');
            }
        } catch (err) {
            setRunOutput({
                status: { id: 13, description: 'Internal Error' },
                stderr: err.response?.data?.msg || err.message
            });
            setConsoleSubTab('stderr');
        } finally {
            setIsRunning(false);
        }
    };

    // 🧪 Run Against ALL Question Test Cases via Judge0
    const handleRunAllCases = async () => {
        if (!questionObj?._id) return alert('Question details not fully loaded for test case execution.');
        setIsTestingAll(true);
        setRunOutput(null);
        setAllCasesOutput(null);
        try {
            const langId = LANG_MAP[runLang]?.id || 97;
            const res = await api.post('/execute/submit', {
                source_code: runCodeVal,
                language_id: langId,
                questionId: questionObj._id
            });
            if (res.data.success) {
                setAllCasesOutput(res.data.data);
                setConsoleSubTab('cases');
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to execute test cases');
        } finally {
            setIsTestingAll(false);
        }
    };

    // Submit manual grading & feedback
    const handleSaveManualEvaluation = async () => {
        if (marks === '') return alert('Please enter marks before saving evaluation');
        setIsGrading(true);
        setGradeSuccess(false);
        try {
            await onGrade(answer.questionId?._id || answer.questionId, Number(marks), feedback);
            setGradeSuccess(true);
            setTimeout(() => setGradeSuccess(false), 3000);
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to save manual evaluation');
        } finally {
            setIsGrading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="neo-panel border-[#000B1A] bg-white w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b-2 border-[#000B1A] bg-white flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-black text-[#000B1A] flex items-center gap-2 tracking-widest uppercase">
                            🔍 Manual Code Inspection & Review
                            <span className="text-xs font-bold text-[#000B1A] bg-white border-2 border-[#000B1A] px-2 py-0.5 rounded-none uppercase tracking-wider shadow-[2px_2px_0_0_#000B1A]">
                                {isCoding ? runLang : 'MCQ'}
                            </span>
                        </h3>
                        <p className="text-xs text-[#000B1A]/80 mt-0.5 font-bold truncate max-w-xl">{qTitle}</p>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex items-center gap-2">
                        {isCoding && (
                            <div className="flex border-2 border-[#000B1A] rounded-none overflow-hidden shadow-[2px_2px_0_0_#000B1A]">
                                <button
                                    onClick={() => setActiveTab('solution')}
                                    className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-colors ${activeTab === 'solution' ? 'bg-[#3b82f6] text-[#000B1A]' : 'bg-white text-[#000B1A] hover:bg-[#000B1A]/5'}`}
                                >
                                    📜 Manual Code Inspection
                                </button>
                                <button
                                    onClick={() => setActiveTab('runner')}
                                    className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-colors ${activeTab === 'runner' ? 'bg-[#10b981] text-[#000B1A]' : 'bg-white text-[#000B1A] hover:bg-[#000B1A]/5'}`}
                                >
                                    ⚡ Test Sandbox (Judge0)
                                </button>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[#000B1A]/5 rounded-none text-[#000B1A] transition-all font-black border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A]"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-auto p-6 bg-white space-y-4">
                    {/* Tab 1: Manual Inspection & Grading */}
                    {activeTab === 'solution' && (
                        <div className="space-y-4">
                            {isCoding ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Left 2 Cols: Student Code View with Line Numbers */}
                                    <div className="md:col-span-2 space-y-3">
                                        <div className="flex justify-between items-center bg-[#000B1A] text-white px-4 py-2 border-2 border-[#000B1A]">
                                            <span className="text-xs font-black uppercase tracking-wider">Student Code Submission</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{runLang}</span>
                                        </div>

                                        <div className="relative rounded-none border-2 border-[#000B1A] bg-[#1e1e1e] overflow-hidden shadow-[4px_4px_0_0_#000B1A]">
                                            <pre className="p-5 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto max-h-[380px]">
                                                <code>{initialCode}</code>
                                            </pre>
                                        </div>

                                        {questionObj?.description && (
                                            <div className="border-2 border-[#000B1A] p-4 bg-white shadow-[4px_4px_0_0_#000B1A]">
                                                <h4 className="text-xs font-black text-[#000B1A] uppercase tracking-wider mb-1">Problem Description</h4>
                                                <p className="text-xs font-bold text-[#000B1A]/80 whitespace-pre-wrap">{questionObj.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right 1 Col: Manual Evaluation & Feedback Form */}
                                    <div className="border-2 border-[#000B1A] bg-slate-50 p-5 shadow-[4px_4px_0_0_#000B1A] space-y-4 flex flex-col">
                                        <h4 className="text-xs font-black text-[#000B1A] uppercase tracking-widest border-b-2 border-[#000B1A] pb-2">
                                            ✏️ Manual Evaluation
                                        </h4>

                                        <div>
                                            <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">
                                                Awarded Score (Max {maxMarks} pts)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={maxMarks}
                                                    value={marks}
                                                    onChange={(e) => setMarks(e.target.value)}
                                                    className="w-full px-3 py-2 border-2 border-[#000B1A] text-base font-black bg-white text-[#000B1A] shadow-[2px_2px_0_0_#000B1A] focus:outline-none"
                                                    placeholder="Score"
                                                />
                                                <span className="text-xs font-black text-[#000B1A] whitespace-nowrap">/ {maxMarks} pts</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">
                                                Teacher Feedback &amp; Review Notes
                                            </label>
                                            <textarea
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                rows={6}
                                                placeholder="Enter review comments for the student (e.g. Clean solution, good time complexity O(N). Missing null check)..."
                                                className="w-full p-3 text-xs font-bold border-2 border-[#000B1A] bg-white text-[#000B1A] shadow-[2px_2px_0_0_#000B1A] focus:outline-none resize-none flex-1"
                                            />
                                        </div>

                                        {gradeSuccess && (
                                            <div className="bg-[#10b981] border-2 border-[#000B1A] text-[#000B1A] p-2 text-xs font-black text-center shadow-[2px_2px_0_0_#000B1A]">
                                                ✓ Evaluation Saved Successfully!
                                            </div>
                                        )}

                                        <button
                                            onClick={handleSaveManualEvaluation}
                                            disabled={isGrading}
                                            className="neo-button !bg-[#10b981] w-full py-2.5 text-xs font-black uppercase tracking-wider disabled:opacity-50"
                                        >
                                            {isGrading ? 'Saving Evaluation...' : '✓ Save Manual Evaluation'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-none border-2 border-[#000B1A] p-8 text-center shadow-[4px_4px_0_0_#000B1A]">
                                        <div className="text-xs uppercase tracking-widest text-[#000B1A] font-bold mb-4">Student Selected Option</div>
                                        <div className="text-4xl font-black text-[#000B1A] bg-white w-20 h-20 flex items-center justify-center rounded-none mx-auto border-2 border-[#000B1A] shadow-[4px_4px_0_0_#000B1A] mb-4">
                                            {initialCode}
                                        </div>
                                        {questionObj?.correctAnswer && (
                                            <div className="mt-4 p-3 border-2 border-[#000B1A] inline-block bg-[#10b981] text-[#000B1A] font-black text-sm shadow-[2px_2px_0_0_#000B1A]">
                                                Correct Answer: {questionObj.correctAnswer}
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-2 border-[#000B1A] bg-slate-50 p-6 shadow-[4px_4px_0_0_#000B1A] space-y-4">
                                        <h4 className="text-xs font-black text-[#000B1A] uppercase tracking-widest border-b-2 border-[#000B1A] pb-2">
                                            ✏️ Manual MCQ Evaluation
                                        </h4>
                                        <div>
                                            <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">
                                                Marks Awarded (Max {maxMarks} pts)
                                            </label>
                                            <input
                                                type="number"
                                                value={marks}
                                                onChange={(e) => setMarks(e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-[#000B1A] text-sm font-bold bg-white text-[#000B1A] shadow-[2px_2px_0_0_#000B1A] focus:outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSaveManualEvaluation}
                                            disabled={isGrading}
                                            className="neo-button !bg-[#10b981] w-full py-2.5 text-xs font-black uppercase tracking-wider"
                                        >
                                            {isGrading ? 'Saving...' : '✓ Save Evaluation'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Interactive Judge0 Code Runner */}
                    {activeTab === 'runner' && isCoding && (
                        <div className="space-y-4">
                            {/* Controls Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-2 border-[#000B1A] bg-white shadow-[4px_4px_0_0_#000B1A]">
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-black text-[#000B1A] uppercase tracking-wider">Language:</label>
                                    <select
                                        value={runLang}
                                        onChange={(e) => setRunLang(e.target.value)}
                                        className="border-2 border-[#000B1A] bg-white text-[#000B1A] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_0_#000B1A] focus:outline-none"
                                    >
                                        {Object.entries(LANG_MAP).map(([key, val]) => (
                                            <option key={key} value={key}>{val.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleRunSingle}
                                        disabled={isRunning || isTestingAll}
                                        className="neo-button !bg-[#3b82f6] px-4 py-2 text-xs font-black flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isRunning ? 'Running...' : '▶ Run Code (Judge0 API)'}
                                    </button>
                                    {questionObj && (
                                        <button
                                            onClick={handleRunAllCases}
                                            disabled={isRunning || isTestingAll}
                                            className="neo-button !bg-[#10b981] px-4 py-2 text-xs font-black flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isTestingAll ? 'Testing All Cases...' : '🧪 Test All Test Cases'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Preset Test Case Selector */}
                            {testCases.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-black text-[#000B1A] uppercase tracking-wider">Load Input:</span>
                                    {testCases.map((tc, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setStdinVal(tc.input || '');
                                                setExpectedOutputVal(tc.output || '');
                                            }}
                                            className="px-2.5 py-1 border-2 border-[#000B1A] bg-white text-[#000B1A] text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000B1A] hover:bg-[#000B1A]/5 transition-colors"
                                        >
                                            Case #{idx + 1} {tc.isHidden ? '🔒 (hidden)' : '👁️'}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Code + Input Editor Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Code Editor Area */}
                                <div className="md:col-span-2 border-2 border-[#000B1A] rounded-none overflow-hidden shadow-[4px_4px_0_0_#000B1A]">
                                    <div className="bg-[#000B1A] text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex justify-between items-center">
                                        <span>Editable Source Code (Sandbox)</span>
                                        <span className="text-[10px] text-slate-400 font-normal">Judge0 Engine Ready</span>
                                    </div>
                                    <textarea
                                        value={runCodeVal}
                                        onChange={(e) => setRunCodeVal(e.target.value)}
                                        rows={12}
                                        className="w-full p-4 font-mono text-xs bg-[#1e1e1e] text-slate-200 outline-none resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Stdin Input Area */}
                                <div className="border-2 border-[#000B1A] rounded-none overflow-hidden shadow-[4px_4px_0_0_#000B1A] flex flex-col bg-white">
                                    <div className="bg-[#000B1A] text-white px-4 py-2 text-xs font-black uppercase tracking-wider">
                                        Input (stdin)
                                    </div>
                                    <textarea
                                        value={stdinVal}
                                        onChange={(e) => setStdinVal(e.target.value)}
                                        placeholder="Enter input parameters..."
                                        rows={5}
                                        className="w-full p-3 font-mono text-xs bg-white text-[#000B1A] outline-none border-b-2 border-[#000B1A] flex-1 resize-none"
                                    />
                                    {expectedOutputVal && (
                                        <div className="p-3 bg-slate-50 border-t border-slate-200">
                                            <span className="text-[10px] font-black text-[#000B1A] uppercase tracking-wider block mb-1">Expected Output:</span>
                                            <pre className="font-mono text-[11px] text-slate-700 bg-white p-2 border border-slate-300 font-bold whitespace-pre-wrap">{expectedOutputVal}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Execution Results Console */}
                            {(runOutput || allCasesOutput) && (
                                <div className="border-2 border-[#000B1A] bg-white shadow-[4px_4px_0_0_#000B1A] p-4 space-y-3">
                                    {/* Stats Summary Bar */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#000B1A] pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-[#000B1A] uppercase tracking-widest">Execution Result:</span>
                                            {runOutput && (
                                                <span className={`px-2.5 py-1 text-xs font-black border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] uppercase ${runOutput.status?.id === 3 ? 'bg-[#10b981] text-[#000B1A]' : 'bg-[#ef4444] text-[#000B1A]'}`}>
                                                    {runOutput.status?.description || 'Executed'} (ID {runOutput.status?.id})
                                                </span>
                                            )}
                                            {allCasesOutput && (
                                                <span className={`px-2.5 py-1 text-xs font-black border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] uppercase ${allCasesOutput.passedCount === allCasesOutput.totalCases ? 'bg-[#10b981] text-[#000B1A]' : 'bg-[#f97316] text-[#000B1A]'}`}>
                                                    {allCasesOutput.passedCount} / {allCasesOutput.totalCases} Test Cases Passed ({allCasesOutput.scoreAwarded} / {allCasesOutput.maxMarks} pts)
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs font-black text-[#000B1A]">
                                            {runOutput?.time && <span>⏱️ Time: <b>{runOutput.time}s</b></span>}
                                            {runOutput?.memory && <span>🧠 Memory: <b>{runOutput.memory} KB</b></span>}
                                        </div>
                                    </div>

                                    {/* Sub-Tabs: stdout | stderr | compile | cases */}
                                    <div className="flex gap-2 border-b-2 border-[#000B1A] pb-2">
                                        <button
                                            onClick={() => setConsoleSubTab('stdout')}
                                            className={`px-3 py-1 text-xs font-black uppercase border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] ${consoleSubTab === 'stdout' ? 'bg-[#3b82f6] text-[#000B1A]' : 'bg-white text-[#000B1A]'}`}
                                        >
                                            Standard Output (stdout)
                                        </button>
                                        {runOutput?.stderr && (
                                            <button
                                                onClick={() => setConsoleSubTab('stderr')}
                                                className={`px-3 py-1 text-xs font-black uppercase border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] ${consoleSubTab === 'stderr' ? 'bg-[#ef4444] text-[#000B1A]' : 'bg-white text-[#000B1A]'}`}
                                            >
                                                Standard Error (stderr)
                                            </button>
                                        )}
                                        {runOutput?.compile_output && (
                                            <button
                                                onClick={() => setConsoleSubTab('compile')}
                                                className={`px-3 py-1 text-xs font-black uppercase border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] ${consoleSubTab === 'compile' ? 'bg-[#ef4444] text-[#000B1A]' : 'bg-white text-[#000B1A]'}`}
                                            >
                                                Compiler Output
                                            </button>
                                        )}
                                        {allCasesOutput && (
                                            <button
                                                onClick={() => setConsoleSubTab('cases')}
                                                className={`px-3 py-1 text-xs font-black uppercase border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] ${consoleSubTab === 'cases' ? 'bg-[#10b981] text-[#000B1A]' : 'bg-white text-[#000B1A]'}`}
                                            >
                                                Test Cases Matrix
                                            </button>
                                        )}
                                    </div>

                                    {/* Console Content */}
                                    <div className="bg-[#1e1e1e] p-4 font-mono text-xs text-slate-200 rounded-none max-h-60 overflow-y-auto">
                                        {consoleSubTab === 'stdout' && (
                                            <pre className="whitespace-pre-wrap">{runOutput?.stdout || '(No stdout output returned)'}</pre>
                                        )}
                                        {consoleSubTab === 'stderr' && (
                                            <pre className="text-red-400 whitespace-pre-wrap">{runOutput?.stderr || 'No stderr'}</pre>
                                        )}
                                        {consoleSubTab === 'compile' && (
                                            <pre className="text-orange-400 whitespace-pre-wrap">{runOutput?.compile_output || 'No compilation errors'}</pre>
                                        )}
                                        {consoleSubTab === 'cases' && allCasesOutput && (
                                            <div className="space-y-3 font-sans">
                                                {allCasesOutput.results?.map((res, i) => (
                                                    <div key={i} className={`p-3 border-2 border-[#000B1A] rounded-none text-xs font-bold ${res.passed ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500' : 'bg-rose-950/80 text-rose-300 border-rose-500'}`}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span>Test Case #{i + 1} {res.isHidden ? '🔒 (hidden)' : ''}</span>
                                                            <span className="font-black uppercase">{res.passed ? '✓ PASSED' : '✕ FAILED'} ({res.statusDescription})</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-2">
                                                            <div>
                                                                <span className="text-slate-400 block">Expected:</span>
                                                                <pre className="bg-black/50 p-1">{res.expectedOutput}</pre>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-400 block">Actual Output:</span>
                                                                <pre className="bg-black/50 p-1">{res.actualOutput || '(none)'}</pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t-2 border-[#000B1A] flex items-center justify-between bg-white">
                    <span className="text-xs font-bold text-[#000B1A]/70">
                        {answer?.teacherFeedback ? `Feedback attached: "${answer.teacherFeedback.slice(0, 40)}..."` : 'No teacher feedback added yet'}
                    </span>
                    <button
                        onClick={onClose}
                        className="neo-button px-6 py-2 text-xs font-black"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Expandable Proctor & Student Submissions Detail Panel ───────────────────
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
            <td colSpan="10" className="px-0 py-0 bg-white border-b-2 border-[#000B1A]">
                <div className="px-6 py-5">
                    {/* Summary row */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="text-sm font-black text-[#000B1A] uppercase tracking-widest">🛡️ Proctoring & Solution Report</span>
                        <span className={`text-xs px-2.5 py-1 rounded-none border-2 shadow-[2px_2px_0_0_#000B1A] font-black uppercase ${log.riskLevel === 'High' ? 'bg-[#ef4444] text-[#000B1A] border-[#000B1A]' :
                            log.riskLevel === 'Medium' ? 'bg-[#f97316] text-[#000B1A] border-[#000B1A]' :
                                'bg-[#10b981] text-[#000B1A] border-[#000B1A]'}`}>
                            Risk: {log.riskLevel || 'Low'}
                        </span>
                        <span className="text-xs text-[#000B1A]/80 font-bold">Total violations: <b>{total}</b></span>
                        {sub.ipAddress && <span className="text-xs text-[#000B1A]/70 ml-auto font-bold">IP: {sub.ipAddress}</span>}
                    </div>

                    {/* Violation counters */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                        {violations.map(v => (
                            <div key={v.label} className={`rounded-none border-2 p-3 text-center shadow-[4px_4px_0_0_#000B1A] ${v.value > 0 ? 'border-[#ef4444] bg-[#ef4444]' : 'border-[#000B1A] bg-white'}`}>
                                <div className="text-xl mb-1">{v.icon}</div>
                                <div className={`text-2xl font-black ${v.value > 0 ? 'text-[#000B1A]' : 'text-[#000B1A]/70'}`}>{v.value}</div>
                                <div className={`text-xs font-bold mt-0.5 ${v.value > 0 ? 'text-[#000B1A]' : 'text-[#000B1A]/60'}`}>{v.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline */}
                    {events.length > 0 ? (
                        <div className="mb-4">
                            <p className="text-xs font-black text-[#000B1A] uppercase tracking-wider mb-2">Flagged Violation Timeline</p>
                            <div className="max-h-36 overflow-y-auto bg-white border-2 border-[#000B1A] rounded-none divide-y-2 divide-white/80 shadow-[4px_4px_0_0_#000B1A]">
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
                    ) : null}

                    {/* Answers List */}
                    {sub.answers?.length > 0 && (
                        <div>
                            <p className="text-xs font-black text-[#000B1A] uppercase tracking-wider mb-2">Student Solutions ({sub.answers.length} questions)</p>
                            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
                                {sub.answers.map((ans, i) => {
                                    const qObj = typeof ans.questionId === 'object' ? ans.questionId : null;
                                    const qTitle = qObj?.title || 'Question';
                                    const isCoding = ans.type === 'Coding';
                                    const langName = isCoding ? (typeof ans.answerData === 'string' ? 'code' : (ans.answerData?.language || 'code')) : 'MCQ';

                                    return (
                                        <div key={i} className="flex items-center gap-3 text-xs bg-white border-2 border-[#0d0a1c] rounded-none px-4 py-2.5 shadow-[4px_4px_0_0_#0d0a1c] text-[#000B1A]">
                                            <div className="w-8 h-8 rounded-none bg-white flex items-center justify-center font-black text-[#000B1A] border-2 border-[#0d0a1c] flex-shrink-0">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isCoding ? 'text-blue-600' : 'text-purple-600'}`}>
                                                        {ans.type} ({langName})
                                                    </span>
                                                    {ans.status === 'Pending' && <span className="bg-[#facc15] text-[#000B1A] px-1.5 py-0.5 rounded-none border-2 border-[#0d0a1c] text-[9px] font-black">PENDING EVAL</span>}
                                                    {ans.teacherFeedback && <span className="bg-[#10b981] text-[#000B1A] px-1.5 py-0.5 rounded-none border-2 border-[#0d0a1c] text-[9px] font-black">REVIEWED</span>}
                                                </div>
                                                <div className="text-[#000B1A] truncate font-black">{qTitle}</div>
                                            </div>
                                            {ans.marksAwarded != null && (
                                                <div className="text-right flex-shrink-0">
                                                    <div className={`font-black text-sm ${ans.marksAwarded > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                                        +{ans.marksAwarded} pts
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => onViewAnswer({ ...ans, submissionId: sub._id })}
                                                className="neo-button !bg-[#3b82f6] px-3 py-1.5 text-[10px] font-black flex-shrink-0"
                                            >
                                                {isCoding ? '🔍 Inspect & Grade Code' : 'View Answer'}
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

// ── Main Submissions Management Component ──────────────────────────────────
const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('All');
    const [filterRisk, setFilterRisk] = useState('All');
    const [viewingAnswer, setViewingAnswer] = useState(null);

    const loadSubmissions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/submissions');
            if (res.data.success) setSubmissions(res.data.data);
        } catch { setError('Failed to load submissions.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadSubmissions(); }, []);

    const handleGrade = async (submissionId, questionId, marks, feedback) => {
        try {
            const res = await api.put(`/admin/submissions/${submissionId}/grade/${questionId}`, { marks, feedback });
            if (res.data.success) {
                setSubmissions(prev => prev.map(s => s._id === submissionId ? res.data.data : s));
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to grade submission');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this submission? This will reset the student\'s attempt count.')) return;
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

    // Extract unique students list for the Student Filter Dropdown
    const studentsList = [...new Map(
        submissions
            .filter(s => s.studentId && s.studentId._id)
            .map(s => [s.studentId._id, s.studentId])
    ).values()];

    const selectedStudentObj = selectedStudentId !== 'All'
        ? studentsList.find(s => s._id === selectedStudentId)
        : null;

    // Filter logic
    const filtered = submissions.filter(sub => {
        const searchLower = search.toLowerCase();
        const matchSearch = !search ||
            (sub.studentId?.name?.toLowerCase() || '').includes(searchLower) ||
            (sub.studentId?.email?.toLowerCase() || '').includes(searchLower) ||
            (sub.testId?.title?.toLowerCase() || '').includes(searchLower);

        const matchStudent = selectedStudentId === 'All' || sub.studentId?._id === selectedStudentId;
        const risk = sub.proctorLog?.riskLevel || 'Low';
        const matchRisk = filterRisk === 'All' || risk === filterRisk;

        return matchSearch && matchStudent && matchRisk;
    });

    // Calculate student statistics if a particular user is selected
    const selectedStudentStats = selectedStudentObj ? {
        totalExams: filtered.length,
        avgScore: filtered.length > 0 ? Math.round(filtered.reduce((acc, curr) => acc + (curr.totalMarks || 0), 0) / filtered.length) : 0,
        totalViolations: filtered.reduce((acc, curr) => acc + totalViolations(curr), 0),
        highRiskCount: filtered.filter(s => s.proctorLog?.riskLevel === 'High').length
    } : null;

    return (
        <div className="neo-panel bg-white border-[#000B1A] overflow-hidden min-h-[600px] space-y-0">
            {/* Header */}
            <div className="p-6 border-b-2 border-[#000B1A] flex flex-wrap justify-between items-center gap-3 bg-white">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-[#000B1A]">Manual Code Review &amp; Grading Console</h2>
                    <p className="text-xs text-[#000B1A]/80 font-bold mt-0.5">Inspect student code manually, add custom teacher feedback, override grades, and test solutions in Judge0 sandbox</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#000B1A] bg-white border-2 border-[#000B1A] px-3 py-1 shadow-[2px_2px_0_0_#000B1A]">{filtered.length} submissions shown</span>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="p-4 border-b-2 border-[#000B1A] bg-slate-50 flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <input
                    placeholder="Search by student name, email, or test title..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="flex-1 min-w-[220px] border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-3 py-2 text-xs focus:outline-none shadow-[2px_2px_0_0_#000B1A] font-bold"
                />

                {/* Filter by Particular Student */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#000B1A] font-black uppercase">Filter Student:</span>
                    <select
                        value={selectedStudentId}
                        onChange={e => setSelectedStudentId(e.target.value)}
                        className="border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-xs font-bold shadow-[2px_2px_0_0_#000B1A] focus:outline-none"
                    >
                        <option value="All">All Students ({studentsList.length})</option>
                        {studentsList.map(st => (
                            <option key={st._id} value={st._id}>{st.name} ({st.email})</option>
                        ))}
                    </select>
                </div>

                {/* Filter by Risk Level */}
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#000B1A] font-black uppercase">Risk:</span>
                    {['All', 'Low', 'Medium', 'High'].map(r => (
                        <button key={r} onClick={() => setFilterRisk(r)}
                            className={`px-2.5 py-1.5 text-xs font-black border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] ${filterRisk === r
                                ? r === 'High' ? 'bg-[#ef4444] text-[#000B1A]' : r === 'Medium' ? 'bg-[#f97316] text-[#000B1A]' : 'bg-[#3b82f6] text-[#000B1A]'
                                : 'bg-white text-[#000B1A]'}`}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Individual Student Selected Header Overview */}
            {selectedStudentObj && selectedStudentStats && (
                <div className="p-5 border-b-2 border-[#000B1A] bg-[#3b82f6]/10 text-[#000B1A] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-none bg-[#3b82f6] text-[#000B1A] border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] flex items-center justify-center text-xl font-black">
                            {selectedStudentObj.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h3 className="text-base font-black uppercase tracking-wider">{selectedStudentObj.name}</h3>
                            <p className="text-xs font-bold text-[#000B1A]/80">{selectedStudentObj.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-black">
                        <div className="bg-white border-2 border-[#000B1A] px-3 py-1.5 shadow-[2px_2px_0_0_#000B1A]">
                            Total Exams: <b>{selectedStudentStats.totalExams}</b>
                        </div>
                        <div className="bg-white border-2 border-[#000B1A] px-3 py-1.5 shadow-[2px_2px_0_0_#000B1A]">
                            Avg Score: <b>{selectedStudentStats.avgScore} pts</b>
                        </div>
                        <div className="bg-white border-2 border-[#000B1A] px-3 py-1.5 shadow-[2px_2px_0_0_#000B1A]">
                            Violations: <b className="text-red-600">{selectedStudentStats.totalViolations}</b>
                        </div>
                        <button
                            onClick={() => setSelectedStudentId('All')}
                            className="neo-button px-3 py-1 text-xs"
                        >
                            Reset Student Filter ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-none h-8 w-8 border-b-4 border-[#000B1A]" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-64 text-red-600 font-black">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b-2 border-[#000B1A] text-[#000B1A]">
                                {['', 'Student', 'Test Title', 'Score', 'Status', 'Violations', 'Risk Level', 'Submitted At', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-white/80">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center p-12 text-[#000B1A]/70 font-bold">
                                        No submissions found matching criteria.
                                    </td>
                                </tr>
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
                                            <td className="px-4 py-4 w-8">
                                                <div className={`w-6 h-6 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] flex items-center justify-center transition-all ${isOpen ? 'bg-[#3b82f6] text-[#000B1A]' : 'bg-white text-[#000B1A]'}`}>
                                                    <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-black text-[#000B1A] text-sm">{sub.studentId?.name || '—'}</div>
                                                <div className="text-[10px] text-[#000B1A]/70 font-bold uppercase">{sub.studentId?.email || ''}</div>
                                            </td>
                                            <td className="px-4 py-4 text-[#000B1A] text-sm font-bold truncate max-w-[180px]">
                                                {sub.testId?.title || '—'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`font-black text-sm ${(sub.totalMarks ?? 0) > 0 ? 'text-[#10b981]' : 'text-[#000B1A]'}`}>
                                                    {sub.totalMarks ?? 0} pts
                                                </span>
                                            </td>
                                            <td className="px-4 py-4"><span className={statusBadge(sub.status)}>{sub.status}</span></td>
                                            <td className="px-4 py-4">
                                                <span className={`text-sm font-black ${viols > 5 ? 'text-[#ef4444]' : viols > 0 ? 'text-[#f97316]' : 'text-[#000B1A]/70'}`}>
                                                    {viols > 0 ? `⚠️ ${viols}` : '✓ 0'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-0.5 rounded-none border-2 text-[10px] shadow-[2px_2px_0_0_#000B1A] font-black uppercase ${risk === 'High' ? 'bg-[#ef4444] text-[#000B1A] border-[#000B1A]' :
                                                    risk === 'Medium' ? 'bg-[#f97316] text-[#000B1A] border-[#000B1A]' :
                                                        'bg-[#10b981] text-[#000B1A] border-[#000B1A]'}`}>
                                                    {risk}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-[#000B1A]/80 text-xs whitespace-nowrap font-bold">
                                                {sub.submitTime ? new Date(sub.submitTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                                            </td>
                                            <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleDelete(sub._id)}
                                                    className="p-1.5 border-2 border-[#000B1A] bg-white text-red-600 font-black shadow-[2px_2px_0_0_#000B1A] hover:bg-red-50 text-xs"
                                                    title="Delete Submission"
                                                >
                                                    Delete
                                                </button>
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

            {/* Answer Viewer + Judge0 Live Code Runner Modal */}
            <AnswerViewer
                answer={viewingAnswer}
                onClose={() => setViewingAnswer(null)}
                onGrade={(questionId, marks, feedback) => handleGrade(viewingAnswer.submissionId, questionId, marks, feedback)}
            />
        </div>
    );
};

export default Submissions;
