import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    FileText,
    FolderOpen,
    Lock,
    Unlock,
    Search,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Zap,
    Cpu,
    Compass,
    Sliders,
    MousePointer,
    AlertTriangle,
    Edit3,
    CornerDownRight
} from 'lucide-react';

// ── Preset Examples for Topic 5.1 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'context-manager-read',
        label: 'Context Manager',
        code: `# Reading with context manager guarantees auto-closing
with open("notes.txt", "r") as f:
    content = f.read()
    print("Read content:", content)

# File is automatically closed here outside with block
print("Is closed?", f.closed)`
    },
    {
        id: 'line-by-line-iteration',
        label: 'Line by Line',
        code: `# Streaming lines is memory-efficient for huge files
with open("notes.txt", "r") as f:
    for line in f:
        cleaned = line.strip()
        print("Line:", cleaned)`
    },
    {
        id: 'seek-tell-cursor',
        label: 'seek() & tell()',
        code: `with open("notes.txt", "r") as f:
    chunk1 = f.read(6)      # Read first 6 chars
    pos = f.tell()           # Check cursor pos
    print("At pos:", pos)
    
    f.seek(0)                # Rewind cursor to start
    print("Rewound to:", f.tell())`
    },
    {
        id: 'closed-file-error',
        label: 'Closed File Trap',
        code: `with open("notes.txt", "r") as f:
    data = f.read(5)

# Attempting to read outside the with block fails
try:
    f.read()
except ValueError as err:
    print("Caught ValueError:", err)`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `with open("data.txt", "r") as f:\n    f.read(10)\n    f.seek(0)\n    val = f.read(4)`,
        question: 'What does val contain after f.seek(0) followed by f.read(4)?',
        options: [
            'Characters 11 through 14',
            'First 4 characters from the beginning of the file',
            'ValueError because seek() is only for binary files',
            'None'
        ],
        correct: 'First 4 characters from the beginning of the file',
        explanation: 'f.seek(0) resets the file pointer back to byte offset 0. The subsequent f.read(4) reads the first 4 characters from the very start.'
    },
    {
        code: `with open("log.txt", "r") as f:\n    pass\nprint(f.closed)`,
        question: 'What will print(f.closed) output after the with block exits?',
        options: ['False', 'True', 'NameError: f is undefined', 'None'],
        correct: 'True',
        explanation: 'The context manager __exit__ protocol guarantees that f.close() is called automatically upon leaving the with block, setting f.closed to True.'
    }
];

// ── File Content on Virtual Disk ─────────────────────────────────────────────
const DEFAULT_FILE_TEXT = "Python File I/O Engine\nContext managers auto-close.\nSafe, memory-efficient streams.";

// ── Step Execution Engine ────────────────────────────────────────────────────
function executeReadCode(codeStr, fileText) {
    const steps = [];
    const outputs = [];

    const addStep = (lineNum, action, detail, fdState, cursorOffset, readBuffer, outputsSnapshot) => {
        steps.push({
            lineNum,
            action,
            detail,
            fdState: { ...fdState },
            cursorOffset,
            readBuffer,
            outputs: [...outputsSnapshot]
        });
    };

    if (codeStr.includes('closed') && codeStr.includes('content = f.read()')) {
        const fd = { id: 3, open: false, mode: 'r', filename: 'notes.txt', closed: false };
        addStep(2, 'open', 'Context manager entering: allocating OS file descriptor fd=3 in "r" mode', { ...fd, open: true }, 0, '', outputs);
        
        fd.open = true;
        addStep(3, 'read', `f.read() reads all ${fileText.length} characters into Python memory buffer`, fd, fileText.length, fileText, outputs);
        
        outputs.push(`Read content: ${fileText.slice(0, 22)}...`);
        addStep(4, 'print', 'Printed content to standard output', fd, fileText.length, fileText, outputs);
        
        fd.open = false;
        fd.closed = true;
        addStep(7, 'exit', 'Context manager __exit__ invoked: automatically closed file descriptor fd=3', fd, fileText.length, fileText, outputs);
        
        outputs.push('Is closed? True');
        addStep(7, 'print', 'Verified f.closed is True outside context block', fd, fileText.length, fileText, outputs);
    } else if (codeStr.includes('for line in f:')) {
        const fd = { id: 3, open: true, mode: 'r', filename: 'notes.txt', closed: false };
        addStep(2, 'open', 'Opened notes.txt with line-buffered stream iterator', fd, 0, '', outputs);

        const lines = fileText.split('\n');
        let currentOffset = 0;
        lines.forEach((ln, idx) => {
            currentOffset += ln.length + 1;
            addStep(3, 'iter', `Streaming line ${idx + 1} from disk into memory`, fd, currentOffset, ln, outputs);
            addStep(4, 'strip', `line.strip() removes trailing newline`, fd, currentOffset, ln.trim(), outputs);
            outputs.push(`Line: ${ln.trim()}`);
            addStep(5, 'print', `Printed line ${idx + 1}`, fd, currentOffset, ln.trim(), outputs);
        });

        fd.open = false;
        fd.closed = true;
        addStep(5, 'exit', 'Iteration completed. File descriptor closed.', fd, currentOffset, '', outputs);
    } else if (codeStr.includes('seek')) {
        const fd = { id: 3, open: true, mode: 'r', filename: 'notes.txt', closed: false };
        addStep(1, 'open', 'Opened notes.txt at byte offset 0', fd, 0, '', outputs);

        const chunk = fileText.slice(0, 6);
        addStep(2, 'read_n', 'f.read(6) reads 6 characters ("Python")', fd, 6, chunk, outputs);
        addStep(3, 'tell', 'f.tell() queries OS kernel for seek cursor position: offset 6', fd, 6, chunk, outputs);

        outputs.push('At pos: 6');
        addStep(4, 'print', 'Output current cursor offset 6', fd, 6, chunk, outputs);

        addStep(6, 'seek', 'f.seek(0) rewinds cursor back to byte 0 (start of file)', fd, 0, '', outputs);
        outputs.push('Rewound to: 0');
        addStep(7, 'print', 'Printed cursor offset 0 after rewind', fd, 0, '', outputs);

        fd.open = false;
        fd.closed = true;
        addStep(7, 'exit', 'Context exited, file closed', fd, 0, '', outputs);
    } else if (codeStr.includes('ValueError')) {
        const fd = { id: 3, open: true, mode: 'r', filename: 'notes.txt', closed: false };
        addStep(1, 'open', 'Context opened notes.txt', fd, 0, '', outputs);
        addStep(2, 'read', 'Read 5 chars inside with block: "Pytho"', fd, 5, 'Pytho', outputs);

        fd.open = false;
        fd.closed = true;
        addStep(5, 'try', 'Exited with block: file is now CLOSED (fd released)', fd, 5, '', outputs);
        addStep(6, 'error', 'f.read() called on closed file -> Python raises ValueError!', fd, 5, '', outputs);

        outputs.push("Caught ValueError: I/O operation on closed file.");
        addStep(8, 'catch', 'Exception caught gracefully by except block', fd, 5, '', outputs);
    } else {
        const fd = { id: 3, open: true, mode: 'r', filename: 'notes.txt', closed: false };
        addStep(1, 'run', 'Executing file operation', fd, 0, '', outputs);
        outputs.push("File operations completed.");
        addStep(Math.min(3, codeStr.split('\n').length), 'done', 'Program finished', { ...fd, open: false, closed: true }, fileText.length, '', outputs);
    }

    return { steps, finalOutputs: outputs };
}

export default function FileReadVisualizer() {
    const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
    const [code, setCode] = useState(EXAMPLES[0].code);

    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const speedMs = speed === 'slow' ? 1600 : speed === 'normal' ? 900 : 400;

    const timerRef = useRef(null);

    // ── Real-Time Interactive Simulation State ──
    const [virtualFileText, setVirtualFileText] = useState(DEFAULT_FILE_TEXT);
    const [isEditingFile, setIsEditingFile] = useState(false);
    const [interactiveCursor, setInteractiveCursor] = useState(0);
    const [interactiveBuffer, setInteractiveBuffer] = useState('');
    const [interactiveFdOpen, setInteractiveFdOpen] = useState(true);
    const [interactiveError, setInteractiveError] = useState(null);
    const [hoveredChar, setHoveredChar] = useState(null);

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
    };

    const resetExecution = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setExecutionState(null);
        setCurrentStepIdx(-1);
        setInteractiveError(null);
    };

    const runCode = () => {
        resetExecution();
        const state = executeReadCode(code, virtualFileText);
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
            const state = executeReadCode(code, virtualFileText);
            setExecutionState(state);
            setCurrentStepIdx(0);
            return;
        }
        if (currentStepIdx < executionState.steps.length - 1) {
            setCurrentStepIdx(prev => prev + 1);
        }
    };

    // Live display values (either driven by playback or interactive manipulation)
    const currentStep = executionState?.steps[currentStepIdx] || null;
    const currentLineNum = currentStep?.lineNum || null;
    const isPlayback = executionState !== null;

    const fdOpen = isPlayback ? currentStep?.fdState?.open : interactiveFdOpen;
    const cursorOffset = isPlayback ? currentStep?.cursorOffset : interactiveCursor;
    const readBuffer = isPlayback ? currentStep?.readBuffer : interactiveBuffer;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    const totalBytes = virtualFileText.length;

    // ── Interactive User Actions ──
    const handleSeekTo = (pos) => {
        resetExecution();
        const bounded = Math.max(0, Math.min(totalBytes, pos));
        setInteractiveCursor(bounded);
        setInteractiveError(null);
    };

    const handleReadOneChar = () => {
        resetExecution();
        if (!interactiveFdOpen) {
            setInteractiveError("ValueError: I/O operation on closed file. Cannot read() when file descriptor is closed.");
            return;
        }
        if (interactiveCursor >= totalBytes) {
            setInteractiveError("EOF Reached: Cursor is at end of file (f.tell() == len(file)). Returns '' (empty string).");
            return;
        }
        const char = virtualFileText[interactiveCursor];
        setInteractiveCursor(prev => prev + 1);
        setInteractiveBuffer(prev => prev + char);
        setInteractiveError(null);
    };

    const handleReadLine = () => {
        resetExecution();
        if (!interactiveFdOpen) {
            setInteractiveError("ValueError: I/O operation on closed file.");
            return;
        }
        if (interactiveCursor >= totalBytes) {
            setInteractiveError("EOF Reached: No more lines to read.");
            return;
        }
        const remaining = virtualFileText.slice(interactiveCursor);
        const nextNewline = remaining.indexOf('\n');
        let chunk = '';
        if (nextNewline === -1) {
            chunk = remaining;
            setInteractiveCursor(totalBytes);
        } else {
            chunk = remaining.slice(0, nextNewline + 1);
            setInteractiveCursor(prev => prev + nextNewline + 1);
        }
        setInteractiveBuffer(chunk);
        setInteractiveError(null);
    };

    const handleReadAll = () => {
        resetExecution();
        if (!interactiveFdOpen) {
            setInteractiveError("ValueError: I/O operation on closed file.");
            return;
        }
        const remaining = virtualFileText.slice(interactiveCursor);
        setInteractiveCursor(totalBytes);
        setInteractiveBuffer(remaining);
        setInteractiveError(null);
    };

    const handleToggleContext = () => {
        resetExecution();
        setInteractiveFdOpen(prev => !prev);
        setInteractiveError(null);
    };

    const handleClearBuffer = () => {
        setInteractiveBuffer('');
    };

    return (
        <div className="space-y-4">
            
            {/* ── 1. Top Header Card with Presets ── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                                Topic 5.1
                            </span>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Context Managers & File Read Streams
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Click any character to seek directly, toggle context manager locks, step operations, or run the live Python code.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={handleToggleContext}
                            title="Click to toggle Context Manager Open/Closed"
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs ${
                                fdOpen
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                            }`}
                        >
                            {fdOpen ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-rose-600" />}
                            <span>FD #3: {fdOpen ? 'OPEN (Active)' : 'CLOSED (Locked)'}</span>
                            <span className="text-[10px] font-sans font-normal opacity-70 underline ml-1">click to toggle</span>
                        </button>
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
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
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
                        badgeText="File Stream Engine"
                        fileName="read_files.py"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── Right Column: Interactive Stream Tape & Memory Inspector ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Interactive Error Alert Banner if Triggered */}
                    {interactiveError && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-2.5 animate-fadeIn">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <span className="font-bold text-rose-900 block mb-0.5">Python Exception / Warning</span>
                                <span className="text-rose-800 leading-relaxed">{interactiveError}</span>
                            </div>
                        </div>
                    )}

                    {/* Virtual Disk & Interactive Character Tape */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <FolderOpen className="w-4 h-4 text-blue-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Virtual Disk Stream: <span className="text-blue-600 font-mono">notes.txt</span>
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingFile(!isEditingFile)}
                                    className="px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 rounded border border-slate-200 cursor-pointer flex items-center gap-1"
                                >
                                    <Edit3 className="w-3 h-3" />
                                    <span>{isEditingFile ? 'Done Editing' : 'Edit File'}</span>
                                </button>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                    Mode: "r"
                                </span>
                            </div>
                        </div>

                        {/* Editable Disk File Drawer */}
                        {isEditingFile && (
                            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 animate-fadeIn">
                                <span className="text-xs font-bold text-blue-900 block">Edit notes.txt on disk:</span>
                                <textarea
                                    value={virtualFileText}
                                    onChange={(e) => {
                                        setVirtualFileText(e.target.value);
                                        setInteractiveCursor(0);
                                    }}
                                    rows={3}
                                    className="w-full p-2 bg-white rounded border border-blue-200 font-mono text-xs text-slate-800 outline-none"
                                />
                            </div>
                        )}

                        {/* Interactive File Character / Byte Stream Tape */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Seek Head Cursor (f.tell()):</span>
                                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                        Offset {cursorOffset} of {totalBytes}
                                    </span>
                                </span>
                                <span className="text-[11px] text-slate-400 font-sans">
                                    Click any char to <code className="text-blue-600 font-mono">seek(i)</code>
                                </span>
                            </div>

                            {/* Stream Tape with Clickable Cells and Animated Cursor */}
                            <div className="relative p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed select-none">
                                <div className="space-y-2">
                                    {virtualFileText.split('\n').map((ln, lineIdx) => {
                                        let charsBefore = 0;
                                        for (let i = 0; i < lineIdx; i++) {
                                            charsBefore += virtualFileText.split('\n')[i].length + 1;
                                        }
                                        const lineStart = charsBefore;

                                        return (
                                            <div key={lineIdx} className="flex items-center gap-3 group">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSeekTo(lineStart)}
                                                    className="text-slate-600 group-hover:text-blue-400 group-hover:font-bold w-6 text-right select-none text-[10px] cursor-pointer"
                                                    title={`Click to seek to line ${lineIdx + 1} (offset ${lineStart})`}
                                                >
                                                    L{lineIdx + 1}
                                                </button>
                                                <div className="flex-1 font-mono tracking-wider flex items-center flex-wrap gap-0.5">
                                                    {ln.split('').map((ch, charIdx) => {
                                                        const globalPos = lineStart + charIdx;
                                                        const isRead = globalPos < cursorOffset;
                                                        const isCursor = globalPos === cursorOffset;

                                                        return (
                                                            <button
                                                                key={charIdx}
                                                                type="button"
                                                                onClick={() => handleSeekTo(globalPos)}
                                                                onMouseEnter={() => setHoveredChar({ ch, pos: globalPos, hex: `0x${ch.charCodeAt(0).toString(16).toUpperCase()}` })}
                                                                onMouseLeave={() => setHoveredChar(null)}
                                                                className={`px-1 py-0.5 rounded text-xs transition-all cursor-pointer ${
                                                                    isCursor
                                                                        ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300 shadow-md scale-110 z-10'
                                                                        : isRead
                                                                        ? 'text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/80 font-medium'
                                                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                                }`}
                                                                title={`Offset ${globalPos}: '${ch}' (Click to seek)`}
                                                            >
                                                                {ch === ' ' ? '␣' : ch}
                                                            </button>
                                                        );
                                                    })}
                                                    {/* Newline marker */}
                                                    <span
                                                        onClick={() => handleSeekTo(lineStart + ln.length)}
                                                        className={`text-[10px] px-1 py-0.5 rounded cursor-pointer ${
                                                            lineStart + ln.length === cursorOffset
                                                                ? 'bg-amber-400 text-slate-950 font-bold'
                                                                : 'text-slate-600 hover:text-slate-400'
                                                        }`}
                                                        title="Newline byte (\n)"
                                                    >
                                                        ↵
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Hover Inspector Tooltip */}
                            {hoveredChar && (
                                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-mono flex items-center justify-between animate-fadeIn">
                                    <span>Offset: <strong>{hoveredChar.pos}</strong> | Char: <strong>'{hoveredChar.ch}'</strong></span>
                                    <span>ASCII Hex: <strong>{hoveredChar.hex}</strong></span>
                                </div>
                            )}

                            {/* Interactive Manual Action Dock */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                    <span className="flex items-center gap-1.5">
                                        <MousePointer className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Interactive Stream Actions (Run Live):</span>
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-normal">Click buttons to execute</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <button
                                        type="button"
                                        onClick={handleReadOneChar}
                                        className="p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer flex flex-col items-center shadow-2xs"
                                    >
                                        <span className="text-blue-600 font-bold font-mono">f.read(1)</span>
                                        <span className="text-[10px] text-slate-500 font-normal mt-0.5">Read next byte</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReadLine}
                                        className="p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer flex flex-col items-center shadow-2xs"
                                    >
                                        <span className="text-emerald-600 font-bold font-mono">f.readline()</span>
                                        <span className="text-[10px] text-slate-500 font-normal mt-0.5">Read till \n</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReadAll}
                                        className="p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer flex flex-col items-center shadow-2xs"
                                    >
                                        <span className="text-indigo-600 font-bold font-mono">f.read()</span>
                                        <span className="text-[10px] text-slate-500 font-normal mt-0.5">Consume all to EOF</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSeekTo(0)}
                                        className="p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer flex flex-col items-center shadow-2xs"
                                    >
                                        <span className="text-amber-600 font-bold font-mono">f.seek(0)</span>
                                        <span className="text-[10px] text-slate-500 font-normal mt-0.5">Rewind to start</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Dual Lifecycle Cards: Kernel FD vs Python RAM Read Buffer */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            
                            {/* Card A: OS Kernel Context Manager */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                                        <span>OS File Descriptor</span>
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                                        fdOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                        {fdOpen ? 'FD #3 Allocated' : 'FD Released'}
                                    </span>
                                </div>
                                <div className="text-[11px] font-mono text-slate-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>f.closed status:</span>
                                        <span className={`font-bold ${!fdOpen ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {!fdOpen ? 'True (Closed)' : 'False (Open)'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Protocol Hooks:</span>
                                        <span className="text-indigo-600 font-bold">__enter__ / __exit__</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card B: Python In-Memory Read Buffer */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                                        <span>In-Memory Read Buffer</span>
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                                            {readBuffer ? `${readBuffer.length} chars` : 'Empty'}
                                        </span>
                                        {readBuffer && (
                                            <button
                                                type="button"
                                                onClick={handleClearBuffer}
                                                className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer underline"
                                            >
                                                clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-xs text-slate-800 min-h-[46px] flex items-center overflow-x-auto">
                                    {readBuffer ? (
                                        <span className="text-emerald-700 font-medium whitespace-pre break-all">"{readBuffer}"</span>
                                    ) : (
                                        <span className="text-slate-400 italic text-[11px]">Buffer empty (Perform read above)</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Interactive Quiz / Challenge Section ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-blue-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Concept Check #{challengeIdx + 1}
                                </h3>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">File I/O Mechanics</span>
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
                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed animate-fadeIn">
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
