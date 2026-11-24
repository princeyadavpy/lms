import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    FileEdit,
    HardDrive,
    Flame,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Zap,
    Cpu,
    Trash2,
    PlusCircle,
    Layers,
    ShieldAlert,
    RefreshCw,
    DownloadCloud,
    MousePointer
} from 'lucide-react';

// ── Preset Examples for Topic 5.2 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'write-truncate-mode',
        label: 'Overwrite ("w")',
        code: `# Mode "w" immediately truncates (erases) existing file!
with open("hello.txt", "w") as f:
    f.write("Line 1: Hello Python!\n")
    f.write("Line 2: Overwritten cleanly.\n")

print("File written successfully.")`
    },
    {
        id: 'append-logging-mode',
        label: 'Append ("a")',
        code: `# Mode "a" keeps existing content and writes at EOF
with open("app.log", "a") as f:
    f.write("2026-11-20 10:00:01 - System booted\n")
    f.write("2026-11-20 10:00:05 - Worker started\n")

print("Log records appended.")`
    },
    {
        id: 'writelines-batch',
        label: 'writelines()',
        code: `messages = [
    "Alpha batch payload\\n",
    "Beta batch payload\\n",
    "Gamma batch payload\\n"
]

with open("queue.txt", "w") as f:
    f.writelines(messages)

print("Batch write complete.")`
    },
    {
        id: 'buffer-flush',
        label: 'f.flush() RAM',
        code: `# Python buffers writes in RAM until flushed to disk
with open("stream.txt", "w") as f:
    f.write("Urgent telemetry data")
    f.flush()  # Forces RAM buffer to commit to disk
    print("Buffer flushed to persistent storage.")`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `# notes.txt has 500 lines of critical text
with open("notes.txt", "w") as f:
    pass`,
        question: 'What happens to the contents of notes.txt after running this snippet?',
        options: [
            'Nothing, the file remains unchanged',
            'The file is truncated and becomes completely empty (0 bytes)',
            'Python raises FileExistsError',
            'Python reads the first line and closes'
        ],
        correct: 'The file is truncated and becomes completely empty (0 bytes)',
        explanation: 'Opening a file in mode "w" immediately truncates it to 0 bytes upon opening, even if nothing is written inside the with block. Use mode "a" to preserve existing content.'
    },
    {
        code: `with open("data.txt", "w") as f:\n    f.write(100)`,
        question: 'What error does f.write(100) raise in Python?',
        options: [
            'ValueError',
            'TypeError: write() argument must be str, not int',
            'SyntaxError',
            'AttributeError'
        ],
        correct: 'TypeError: write() argument must be str, not int',
        explanation: 'In text mode, f.write() only accepts string arguments. Numbers must be explicitly converted with str(100) or f"{100}".'
    }
];

// ── Virtual Disk Initial States ──────────────────────────────────────────────
const INITIAL_DISK_FILES = {
    'hello.txt': [
        'Old Draft Content #1',
        'Old Draft Content #2'
    ],
    'app.log': [
        '2026-11-20 09:15:00 - Initial system bootstrap',
        '2026-11-20 09:30:12 - Database connection verified'
    ],
    'queue.txt': [],
    'stream.txt': []
};

// ── Step Execution Engine ────────────────────────────────────────────────────
function executeWriteCode(codeStr) {
    const steps = [];
    const outputs = [];

    const addStep = (lineNum, action, detail, fileState, ramBuffer, isFlushed, outputsSnapshot) => {
        steps.push({
            lineNum,
            action,
            detail,
            fileState: { ...fileState, lines: [...fileState.lines] },
            ramBuffer: [...ramBuffer],
            isFlushed,
            outputs: [...outputsSnapshot]
        });
    };

    if (codeStr.includes('hello.txt') && codeStr.includes('"w"')) {
        const fState = { name: 'hello.txt', mode: 'w', lines: [...INITIAL_DISK_FILES['hello.txt']], truncated: false };
        addStep(2, 'open_w', 'Mode "w" detected: TRUNCATING existing file! All existing lines erased.', { ...fState, lines: [], truncated: true }, [], false, outputs);

        fState.lines = [];
        fState.truncated = true;
        const line1 = 'Line 1: Hello Python!';
        addStep(3, 'write_ram', `f.write("${line1}"): queued into Python RAM buffer`, fState, [line1], false, outputs);

        const line2 = 'Line 2: Overwritten cleanly.';
        addStep(4, 'write_ram', `f.write("${line2}"): queued into Python RAM buffer`, fState, [line1, line2], false, outputs);

        fState.lines = [line1, line2];
        addStep(4, 'flush', 'Context exit: Python flushes RAM page buffer to disk', fState, [], true, outputs);

        outputs.push('File written successfully.');
        addStep(6, 'print', 'Program finished. hello.txt persisted on disk.', fState, [], true, outputs);
    } else if (codeStr.includes('app.log') && codeStr.includes('"a"')) {
        const fState = { name: 'app.log', mode: 'a', lines: [...INITIAL_DISK_FILES['app.log']], truncated: false };
        addStep(2, 'open_a', 'Mode "a" opened: existing 2 log records preserved. Cursor placed at EOF.', fState, [], false, outputs);

        const log1 = '2026-11-20 10:00:01 - System booted';
        addStep(3, 'write', `f.write(): queued new log entry in RAM buffer`, fState, [log1], false, outputs);

        const log2 = '2026-11-20 10:00:05 - Worker started';
        addStep(4, 'write', `f.write(): queued second log entry in RAM buffer`, fState, [log1, log2], false, outputs);

        fState.lines.push(log1, log2);
        addStep(4, 'flush', 'Context exit: Appended 2 records to app.log on disk', fState, [], true, outputs);

        outputs.push('Log records appended.');
        addStep(6, 'print', 'app.log now has 4 total records.', fState, [], true, outputs);
    } else if (codeStr.includes('writelines')) {
        const fState = { name: 'queue.txt', mode: 'w', lines: [], truncated: true };
        addStep(1, 'def', 'Defined batch messages array in Python memory', fState, [], false, outputs);
        addStep(7, 'open', 'Opened queue.txt in mode "w"', fState, [], false, outputs);

        const batch = ["Alpha batch payload", "Beta batch payload", "Gamma batch payload"];
        addStep(8, 'writelines', 'f.writelines() flushes multiple items simultaneously', fState, batch, false, outputs);

        fState.lines = batch;
        addStep(8, 'commit', 'Committed 3 lines to queue.txt on disk', fState, [], true, outputs);

        outputs.push('Batch write complete.');
        addStep(10, 'print', 'queue.txt write finished.', fState, [], true, outputs);
    } else if (codeStr.includes('flush()')) {
        const fState = { name: 'stream.txt', mode: 'w', lines: [], truncated: true };
        addStep(2, 'open', 'Opened stream.txt in write mode', fState, [], false, outputs);

        const telemetry = 'Urgent telemetry data';
        addStep(3, 'write', 'Written to RAM buffer (not yet physically committed to disk)', fState, [telemetry], false, outputs);

        fState.lines = [telemetry];
        addStep(4, 'flush', 'f.flush() invoked! OS commits RAM buffer to disk immediately', fState, [], true, outputs);

        outputs.push('Buffer flushed to persistent storage.');
        addStep(5, 'print', 'Program completed without data loss.', fState, [], true, outputs);
    } else {
        const fState = { name: 'output.txt', mode: 'w', lines: ['Sample written content'], truncated: false };
        addStep(1, 'run', 'Executing write operations', fState, [], true, outputs);
        outputs.push('Write execution finished.');
        addStep(3, 'done', 'Done', fState, [], true, outputs);
    }

    return { steps, finalOutputs: outputs };
}

export default function FileWriteVisualizer() {
    const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
    const [code, setCode] = useState(EXAMPLES[0].code);

    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const speedMs = speed === 'slow' ? 1600 : speed === 'normal' ? 900 : 400;

    const timerRef = useRef(null);

    // ── Real-Time Interactive State ──
    const [activeTargetFile, setActiveTargetFile] = useState('hello.txt');
    const [activeMode, setActiveMode] = useState('w');
    const [diskLines, setDiskLines] = useState([...INITIAL_DISK_FILES['hello.txt']]);
    const [interactiveRamQueue, setInteractiveRamQueue] = useState([]);
    const [newLogInput, setNewLogInput] = useState('');
    const [modeAlert, setModeAlert] = useState(null);

    // Challenge state
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleSelectExample = (id) => {
        const found = EXAMPLES.find(e => e.id === id);
        if (!found) return;
        setSelectedExampleId(id);
        setCode(found.code);
        resetExecution();
        if (id === 'append-logging-mode') {
            setActiveTargetFile('app.log');
            setActiveMode('a');
            setDiskLines([...INITIAL_DISK_FILES['app.log']]);
        } else if (id === 'writelines-batch') {
            setActiveTargetFile('queue.txt');
            setActiveMode('w');
            setDiskLines([]);
        } else if (id === 'buffer-flush') {
            setActiveTargetFile('stream.txt');
            setActiveMode('w');
            setDiskLines([]);
        } else {
            setActiveTargetFile('hello.txt');
            setActiveMode('w');
            setDiskLines([...INITIAL_DISK_FILES['hello.txt']]);
        }
    };

    const resetExecution = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setExecutionState(null);
        setCurrentStepIdx(-1);
        setModeAlert(null);
    };

    const runCode = () => {
        resetExecution();
        const state = executeWriteCode(code);
        setExecutionState(state);
        if (state.steps.length === 0) return;
        setCurrentStepIdx(0);
        setIsRunning(true);
    };

    useEffect(() => {
        if (!isRunning || !executionState) return;
        if (currentStepIdx >= executionState.steps.length - 1) {
            setIsRunning(false);
            return;
        }
        timerRef.current = setTimeout(() => {
            setCurrentStepIdx(prev => prev + 1);
        }, speedMs);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isRunning, currentStepIdx, executionState, speedMs]);

    const stepForward = () => {
        if (!executionState) {
            const state = executeWriteCode(code);
            setExecutionState(state);
            setCurrentStepIdx(0);
            return;
        }
        if (currentStepIdx < executionState.steps.length - 1) {
            setCurrentStepIdx(prev => prev + 1);
        }
    };

    const currentStep = executionState?.steps[currentStepIdx] || null;
    const currentLineNum = currentStep?.lineNum || null;
    const isPlayback = executionState !== null;

    const displayLines = isPlayback ? (currentStep?.fileState?.lines || []) : diskLines;
    const displayRam = isPlayback ? (currentStep?.ramBuffer || []) : interactiveRamQueue;
    const displayMode = isPlayback ? (currentStep?.fileState?.mode || 'w') : activeMode;
    const isFlushed = isPlayback ? currentStep?.isFlushed : displayRam.length === 0;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    // ── Interactive User Mode Switches ──
    const handleSwitchMode = (m) => {
        resetExecution();
        setActiveMode(m);
        if (m === 'w') {
            setDiskLines([]);
            setModeAlert('Mode "w" applied: Simulated TRUNCATE executed! Disk sectors wiped to 0 lines.');
        } else if (m === 'a') {
            setModeAlert('Mode "a" applied: Existing disk sectors preserved. New writes will append at EOF.');
        } else if (m === 'x') {
            if (diskLines.length > 0) {
                setModeAlert('FileExistsError: Mode "x" raises error if target file already exists on disk!');
            } else {
                setModeAlert('Mode "x" applied: Exclusive creation approved (file was empty).');
            }
        }
    };

    const handleQueueToRam = () => {
        if (!newLogInput.trim()) return;
        resetExecution();
        setInteractiveRamQueue(prev => [...prev, newLogInput.trim()]);
        setNewLogInput('');
    };

    const handleFlushRamToDisk = () => {
        resetExecution();
        if (interactiveRamQueue.length === 0) return;
        if (activeMode === 'w') {
            setDiskLines([...interactiveRamQueue]);
        } else {
            setDiskLines(prev => [...prev, ...interactiveRamQueue]);
        }
        setInteractiveRamQueue([]);
    };

    const handleDeleteDiskLine = (idx) => {
        resetExecution();
        setDiskLines(prev => prev.filter((_, i) => i !== idx));
    };

    const totalCharacters = displayLines.reduce((acc, ln) => acc + ln.length + 1, 0);

    return (
        <div className="space-y-4">
            
            {/* ── 1. Top Header Card with Presets ── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                                Topic 5.2
                            </span>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                File Writing, Appending & RAM Buffer Flushing
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Click mode pills to simulate truncation, queue writes into the RAM page buffer, and flush directly to persistent disk.
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {['w', 'a', 'x'].map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => handleSwitchMode(m)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                    displayMode === m
                                        ? m === 'w'
                                            ? 'bg-rose-600 text-white shadow-2xs'
                                            : m === 'a'
                                            ? 'bg-emerald-600 text-white shadow-2xs'
                                            : 'bg-amber-600 text-white shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                                title={`Switch to mode "${m}"`}
                            >
                                Mode "{m}"
                            </button>
                        ))}
                    </div>
                </div>

                {/* Presets Segmented Tabs */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-start gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
                        Presets:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 shrink-0">
                        {EXAMPLES.map((ex, i) => {
                            const isSelected = selectedExampleId === ex.id;
                            return (
                                <button
                                    key={ex.id}
                                    type="button"
                                    onClick={() => handleSelectExample(ex.id)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                        isSelected
                                            ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                    }`}
                                >
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-amber-600' : 'text-slate-400'}`}>
                                        {i + 1}.
                                    </span>
                                    <span>{ex.label.replace(/^\d+\.\s*/, '')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── 2. Main Two-Column View ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                
                {/* ── Left Column: Interactive Code Editor ── */}
                <div className="lg:col-span-5">
                    <InteractiveEditorWithArrow
                        code={code}
                        setCode={setCode}
                        currentLineNum={currentLineNum}
                        transitionInfo={transitionInfo}
                        isRunning={isRunning}
                        runCode={runCode}
                        stepForward={stepForward}
                        resetExecution={resetExecution}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={currentStep ? currentStep.detail : 'Ready to execute'}
                        stepCounterText={executionState ? `Step ${currentStepIdx + 1}/${executionState.steps.length}` : 'Idle'}
                        terminalLines={terminalLines}
                        badgeText="Write Engine"
                        fileName="write_files.py"
                        accentColor="#ea580c"
                    />
                </div>

                {/* ── Right Column: Write Buffer & Disk Sector Inspector ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Live Mode Reaction / Truncation Banner */}
                    {modeAlert && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5 animate-fadeIn">
                            <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <span className="font-bold text-amber-900 block mb-0.5">Mode Reaction Triggered</span>
                                <span className="text-amber-800 leading-relaxed">{modeAlert}</span>
                            </div>
                        </div>
                    )}

                    {/* 2-Stage Write Pipeline: Python RAM Buffer ──► Disk File */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-amber-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    2-Stage Write Pipeline (RAM Buffer ──► Persistent Disk)
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                File: {activeTargetFile}
                            </span>
                        </div>

                        {/* Stage 1: Python Process RAM Page Buffer (Interactive) */}
                        <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 space-y-2 border border-slate-800">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-bold text-amber-400">
                                    <Cpu className="w-3.5 h-3.5" />
                                    <span>Stage 1: Python RAM Buffer (Page Size: 4096B)</span>
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                    {displayRam.length} Unflushed Item(s)
                                </span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-amber-200/90 min-h-[48px] flex flex-col justify-center border border-slate-800/80">
                                {displayRam.length > 0 ? (
                                    displayRam.map((b, idx) => (
                                        <div key={idx} className="flex items-center gap-2 animate-fadeIn py-0.5">
                                            <span className="text-slate-600 text-[10px] select-none">[buf {idx + 1}]</span>
                                            <span className="truncate">{b}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-slate-500 italic text-[11px]">
                                        Buffer empty. Type below and click "+ Queue to RAM" to test buffering.
                                    </span>
                                )}
                            </div>

                            {/* Flush Button */}
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-slate-400">Writes in RAM are lost if process crashes before flush!</span>
                                <button
                                    type="button"
                                    onClick={handleFlushRamToDisk}
                                    disabled={displayRam.length === 0}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                        displayRam.length > 0
                                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                    <span>Flush to Disk (f.flush())</span>
                                </button>
                            </div>
                        </div>

                        {/* Interactive Input to Queue to RAM */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Interactive Buffer Injector:</span>
                            </span>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newLogInput}
                                    onChange={(e) => setNewLogInput(e.target.value)}
                                    placeholder="Enter line content (e.g. Server response 200 OK)..."
                                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-amber-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleQueueToRam()}
                                />
                                <button
                                    type="button"
                                    onClick={handleQueueToRam}
                                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                                >
                                    + Queue to RAM
                                </button>
                            </div>
                        </div>

                        {/* Stage 2: Persistent Virtual Disk Sector Content */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Stage 2: Persistent Disk File ({activeTargetFile})</span>
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                                    {displayLines.length} Lines · {totalCharacters} Bytes
                                </span>
                            </div>

                            <div className="p-3 rounded-lg bg-white border border-slate-200/80 font-mono text-xs text-slate-800 space-y-1 min-h-[72px] max-h-[160px] overflow-y-auto">
                                {displayLines.length > 0 ? (
                                    displayLines.map((ln, idx) => (
                                        <div key={idx} className="flex items-center justify-between group hover:bg-slate-50 px-1 py-0.5 rounded">
                                            <div className="flex items-start gap-2.5 min-w-0">
                                                <span className="text-slate-400 w-5 text-right shrink-0 select-none text-[11px]">{idx + 1}</span>
                                                <span className="text-slate-900 break-all">{ln}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteDiskLine(idx)}
                                                className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                                                title="Delete line from disk"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-rose-500 italic text-[11px]">
                                        File is empty (0 bytes on disk due to "w" truncate).
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Interactive Quiz / Challenge Section ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-amber-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Concept Check #{challengeIdx + 1}
                                </h3>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">Write vs Append Mechanics</span>
                        </div>

                        <div className="p-3 bg-slate-900 rounded-lg text-slate-100 font-mono text-xs whitespace-pre">
                            {CHALLENGES[challengeIdx].code}
                        </div>

                        <p className="text-xs font-semibold text-slate-800">
                            {CHALLENGES[challengeIdx].question}
                        </p>

                        <div className="space-y-1.5">
                            {CHALLENGES[challengeIdx].options.map((opt, idx) => {
                                const isChosen = selectedAnswer === opt;
                                const isCorrect = opt === CHALLENGES[challengeIdx].correct;
                                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                                if (showExplanation) {
                                    if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                                    else if (isChosen) btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAnswer(opt);
                                            setShowExplanation(true);
                                        }}
                                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                                    >
                                        <span>{opt}</span>
                                        {showExplanation && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                        {showExplanation && isChosen && !isCorrect && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed animate-fadeIn">
                                <span className="font-bold block mb-0.5">Explanation:</span>
                                {CHALLENGES[challengeIdx].explanation}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
