import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Lock,
    Unlock,
    AlertOctagon,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Database,
    Zap,
    Split
} from 'lucide-react';

// ── Preset Examples for Topic 3.4 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'tuple-immutability',
        label: 'Immutability',
        code: `point = (10, 20)
print("Initial tuple:", point)

# Attempting mutation raises TypeError
try:
    point[0] = 99
except TypeError as err:
    print("Caught TypeError:", err)`
    },
    {
        id: 'tuple-vs-list-memory',
        label: 'Tuple vs List',
        code: `# Tuple: Compact fixed allocation (no over-allocation buffer)
my_tuple = (1, 2, 3, 4)

# List: Over-allocated dynamic array buffer for append()
my_list = [1, 2, 3, 4]

print("Tuple size: 72 bytes (Immutable fixed)")
print("List size:  120 bytes (Dynamic buffer + capacity)")`
    },
    {
        id: 'star-unpacking',
        label: 'Star Unpack (*)',
        code: `scores = [10, 20, 30, 40, 50]
first, *middle, last = scores

print("first:", first)
print("middle (captured as list):", middle)
print("last:", last)`
    },
    {
        id: 'singleton-comma',
        label: 'Singleton (42,)',
        code: `not_a_tuple = (42)     # Type: int (parens treated as math)
is_a_tuple = (42,)     # Type: tuple (comma defines sequence)

print("type(not_a_tuple):", type(not_a_tuple))
print("type(is_a_tuple):", type(is_a_tuple))`
    },
    {
        id: 'range-progression',
        label: 'range() Steps',
        code: `r = range(2, 11, 2)
print("range object:", r)
print("Materialized as list:", list(r))
print("Step jump test: 6 in range?", 6 in r)`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `t = (1, [2, 3])\nt[1].append(4)`,
        question: 'Does t[1].append(4) succeed or raise TypeError?',
        options: [
            'Succeeds! t is now (1, [2, 3, 4])',
            'Raises TypeError because tuples are immutable',
            'Raises AttributeError',
            'Creates a copy'
        ],
        correct: 'Succeeds! t is now (1, [2, 3, 4])',
        explanation: 'The tuple container holds pointers. The pointer at t[1] cannot be changed to another object, but the mutable list it points to CAN be mutated in-place!'
    },
    {
        code: `a, *b, c = (1, 2, 3, 4, 5)\nprint(b)`,
        question: 'What is the value and type of b?',
        options: ['(2, 3, 4) as tuple', '[2, 3, 4] as list', '2', '[2, 3]'],
        correct: '[2, 3, 4] as list',
        explanation: 'In extended star unpacking, the starred variable always collects remaining items into a Python LIST, even when unpacking from a tuple.'
    }
];

function executeTupleCode(codeStr) {
    const rawLines = codeStr.split('\n');
    const steps = [];
    const outputs = [];

    let tupleItems = [];
    let isLocked = true;
    let typeErrorEncountered = false;
    let unpackingResult = null; // { first, middle, last }
    let rangeState = null;

    const addStep = (lineNum, action, detail, extra = {}) => {
        steps.push({
            lineNum,
            action,
            detail,
            tupleItems: [...tupleItems],
            isLocked,
            typeErrorEncountered,
            unpackingResult: unpackingResult ? { ...unpackingResult } : null,
            rangeState: rangeState ? { ...rangeState } : null,
            outputs: [...outputs],
            ...extra
        });
    };

    if (codeStr.includes('point = (10, 20)')) {
        tupleItems = [10, 20];
        addStep(1, 'alloc_tuple', 'Allocated immutable tuple point = (10, 20) with read-only memory lock');
        outputs.push('Initial tuple: (10, 20)');
        addStep(2, 'print', 'Printed tuple value');
        typeErrorEncountered = true;
        outputs.push("Caught TypeError: 'tuple' object does not support item assignment");
        addStep(
            7,
            'type_error',
            "TypeError: 'tuple' object does not support item assignment (Write-protection prevented modification!)"
        );
    } else if (codeStr.includes('my_tuple = (1, 2, 3, 4)')) {
        tupleItems = [1, 2, 3, 4];
        addStep(2, 'tuple_mem', 'Tuple allocates 72 bytes (4 pointer slots, zero empty over-allocation buffer)');
        addStep(5, 'list_mem', 'List allocates 120 bytes (Dynamic array struct + 4 slots + spare capacity slots)');
        outputs.push('Tuple size: 72 bytes (Immutable fixed)');
        outputs.push('List size:  120 bytes (Dynamic buffer + capacity)');
        addStep(8, 'print', 'Memory footprint comparison printed');
    } else if (codeStr.includes('first, *middle, last = scores')) {
        unpackingResult = { first: 10, middle: [20, 30, 40], last: 50 };
        addStep(1, 'init', 'Declared scores list = [10, 20, 30, 40, 50]');
        addStep(
            2,
            'star_unpack',
            'Star unpack: first captures 10, last captures 50, *middle captures [20, 30, 40] as list'
        );
        outputs.push('first: 10');
        outputs.push('middle (captured as list): [20, 30, 40]');
        outputs.push('last: 50');
        addStep(6, 'print', 'Unpacked values printed to stdout');
    } else if (codeStr.includes('not_a_tuple = (42)')) {
        addStep(1, 'singleton_int', 'not_a_tuple = (42) without trailing comma evaluates as integer 42');
        addStep(2, 'singleton_tuple', 'is_a_tuple = (42,) with trailing comma successfully creates singleton tuple');
        outputs.push("type(not_a_tuple): <class 'int'>");
        outputs.push("type(is_a_tuple): <class 'tuple'>");
        addStep(5, 'print', 'Type inspection printed');
    } else if (codeStr.includes('range(2, 11, 2)')) {
        rangeState = { start: 2, stop: 11, step: 2, sequence: [2, 4, 6, 8, 10] };
        addStep(1, 'range_def', 'range(start=2, stop=11, step=2) created arithmetic progression generator');
        outputs.push('range object: range(2, 11, 2)');
        outputs.push('Materialized as list: [2, 4, 6, 8, 10]');
        outputs.push('Step jump test: 6 in range? True');
        addStep(4, 'print', 'Range progression output printed');
    }

    if (steps.length === 0) {
        steps.push({ lineNum: 1, action: 'idle', detail: 'Ready to execute', outputs: [] });
    }

    return { steps, finalOutputs: outputs };
}

export default function TupleVisualizer() {
    const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
    const [code, setCode] = useState(EXAMPLES[0].code);

    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const speedMs = speed === 'slow' ? 1600 : speed === 'normal' ? 900 : 400;

    const timerRef = useRef(null);

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
    };

    const runCode = () => {
        resetExecution();
        const state = executeTupleCode(code);
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
            const state = executeTupleCode(code);
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
    const tupleItems = currentStep?.tupleItems || [];
    const typeErrorEncountered = currentStep?.typeErrorEncountered || false;
    const unpackingResult = currentStep?.unpackingResult || null;
    const rangeState = currentStep?.rangeState || null;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    return (
        <div className="space-y-4 text-slate-800">
            {/* ── 1. Clean Structured Header with Full-Width Segmented Presets ────── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Ranges & Ordered Tuples Visualizer
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-md border border-violet-200/60 shrink-0 hidden sm:inline-block">
                            Immutable Memory & Unpacking
                        </span>
                    </div>
                </div>

                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    Inspect Python's write-protected tuple memory architecture. Compare memory footprint against dynamic lists, examine pattern unpacking with the star (<code>*</code>) operator, and trace arithmetic progressions in <code>range()</code>.
                </p>

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
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-violet-600' : 'text-slate-400'}`}>
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
                
                {/* ── Left Column: Interactive Code Editor with Animated Arrow Lane ── */}
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
                        badgeText="Immutable Struct Engine"
                        fileName="tuples_ranges.py"
                    />
                </div>

                {/* ── Right Column: Interactive Tuple & Unpacking Views (7 cols) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Visual 1: Tuple Immutability & Memory Lock Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-violet-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Tuple Memory Lock (Read-Only Sequential Array)
                                </h3>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 font-mono text-[10px] font-bold border border-violet-200">
                                Immutable (Locked)
                            </span>
                        </div>

                        {typeErrorEncountered && (
                            <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 flex items-start gap-2.5 animate-fadeIn">
                                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <span className="font-bold text-rose-900 block mb-0.5">TypeError Triggered</span>
                                    <span className="text-rose-800 leading-relaxed font-mono text-[11px]">
                                        TypeError: 'tuple' object does not support item assignment
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Tuple Contiguous Locked Cells */}
                        <div className="overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex items-center gap-2 min-w-max">
                                <span className="w-20 shrink-0 text-[10px] font-mono text-slate-400 text-right pr-2 uppercase tracking-wider font-bold">
                                    Tuple Slots
                                </span>
                                {(tupleItems.length > 0 ? tupleItems : [10, 20]).map((val, idx) => (
                                    <div
                                        key={idx}
                                        className="w-24 h-24 rounded-xl border-2 border-violet-800 bg-[#0b101b] flex flex-col justify-between p-2 text-center relative shadow-sm"
                                    >
                                        <div className="flex items-center justify-between text-[9px] font-mono text-violet-400">
                                            <span>[{idx}]</span>
                                            <Lock className="w-2.5 h-2.5 text-violet-400" />
                                        </div>
                                        <div className="font-mono font-bold text-sm text-emerald-300">
                                            {String(val)}
                                        </div>
                                        <div className="text-[9px] font-mono text-slate-500 border-t border-slate-800 pt-1">
                                            Read-Only Slot
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Visual 2: Extended Star Unpacking Tree */}
                    {unpackingResult && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5 animate-fadeIn">
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Split className="w-4 h-4 text-violet-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Extended Pattern Unpacking (first, *middle, last)
                                    </h3>
                                </div>
                                <span className="text-[11px] font-mono text-slate-500">
                                    first, *middle, last = [10, 20, 30, 40, 50]
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
                                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 text-center">
                                    <span className="text-[10px] text-blue-700 font-bold block mb-1">first</span>
                                    <span className="text-lg font-bold text-blue-900">{unpackingResult.first}</span>
                                    <span className="text-[9px] text-blue-600 block mt-1">Single int</span>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-950 text-center">
                                    <span className="text-[10px] text-purple-700 font-bold block mb-1">*middle</span>
                                    <span className="text-base font-bold text-purple-900">
                                        [{unpackingResult.middle.join(', ')}]
                                    </span>
                                    <span className="text-[9px] text-purple-600 block mt-1">Packed as list</span>
                                </div>
                                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-center">
                                    <span className="text-[10px] text-emerald-700 font-bold block mb-1">last</span>
                                    <span className="text-lg font-bold text-emerald-900">{unpackingResult.last}</span>
                                    <span className="text-[9px] text-emerald-600 block mt-1">Single int</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visual 3: range() Progression Visualizer */}
                    {rangeState && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5 animate-fadeIn">
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-violet-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        range(start={rangeState.start}, stop={rangeState.stop}, step={rangeState.step}) Progression
                                    </h3>
                                </div>
                                <span className="text-[11px] font-mono text-slate-500">
                                    Step interval = +{rangeState.step}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                {rangeState.sequence.map((n, idx) => (
                                    <div key={idx} className="flex items-center gap-2 shrink-0">
                                        <div className="w-16 py-2 rounded-lg bg-violet-600 text-white font-mono font-bold text-center text-xs shadow-2xs">
                                            {n}
                                        </div>
                                        {idx < rangeState.sequence.length - 1 && (
                                            <span className="text-slate-400 text-xs font-mono font-bold">
                                                +{rangeState.step} →
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── 4. Interactive Challenge ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <HelpCircle className="w-4 h-4 text-purple-600" />
                                <span>Try It Yourself: Tuple Immutability & Star Unpacking</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                                Question {challengeIdx + 1} of {CHALLENGES.length}
                            </span>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs">
                            <pre className="whitespace-pre-wrap">{CHALLENGES[challengeIdx].code}</pre>
                        </div>

                        <p className="text-xs font-semibold text-slate-800">
                            {CHALLENGES[challengeIdx].question}
                        </p>

                        <div className="space-y-1.5">
                            {CHALLENGES[challengeIdx].options.map((opt) => {
                                const isPicked = selectedAnswer === opt;
                                const isCorrect = opt === CHALLENGES[challengeIdx].correct;
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAnswer(opt);
                                            setShowExplanation(true);
                                        }}
                                        className={`w-full px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-left border cursor-pointer ${
                                            showExplanation
                                                ? isCorrect
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                                                    : isPicked
                                                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                                                    : 'bg-slate-50 border-slate-200 text-slate-500'
                                                : 'bg-white border-slate-200 hover:border-violet-400 text-slate-800'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-violet-50 border border-violet-200 text-xs text-violet-950 space-y-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                    {selectedAnswer === CHALLENGES[challengeIdx].correct ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                    )}
                                    <span>
                                        {selectedAnswer === CHALLENGES[challengeIdx].correct ? 'Correct Insight!' : 'Incorrect'}
                                    </span>
                                </div>
                                <p className="leading-relaxed">{CHALLENGES[challengeIdx].explanation}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setChallengeIdx((prev) => (prev + 1) % CHALLENGES.length);
                                        setSelectedAnswer(null);
                                        setShowExplanation(false);
                                    }}
                                    className="text-xs font-bold text-violet-700 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <span>Next Challenge</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

