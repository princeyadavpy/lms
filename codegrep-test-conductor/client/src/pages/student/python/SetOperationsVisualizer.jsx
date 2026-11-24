import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Filter,
    Search,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Zap,
    AlertOctagon,
    Layers
} from 'lucide-react';

// ── Preset Examples for Topic 4.3 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'set-deduplication',
        label: 'Deduplication',
        code: `raw_ids = [101, 102, 101, 105, 102, 107]

# Sets automatically collapse duplicates into unique elements
unique_ids = set(raw_ids)
print("Original items count:", len(raw_ids))
print("Deduplicated Set:", unique_ids)`
    },
    {
        id: 'fast-membership',
        label: 'Membership (in)',
        code: `skills = {"Python", "SQL", "Docker", "Git"}

# Instant O(1) membership check using hash lookup
has_sql = "SQL" in skills
has_rust = "Rust" in skills

print("Has SQL?", has_sql)
print("Has Rust?", has_rust)`
    },
    {
        id: 'discard-vs-remove',
        label: 'discard vs remove',
        code: `tools = {"Vim", "VSCode", "Git"}

# Safe removal: does not crash if item is absent
tools.discard("Sublime")
print("After safe discard:", tools)

# Dangerous removal: raises KeyError if item is absent
try:
    tools.remove("Sublime")
except KeyError as err:
    print("Caught KeyError with .remove():", err)`
    },
    {
        id: 'empty-set-trap',
        label: 'Empty Set Trap',
        code: `not_a_set = {}      # Empty braces create a dict!
is_a_set = set()    # Correct way to instantiate an empty set

print("type({}):", type(not_a_set))
print("type(set()):", type(is_a_set))`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `s = {1, 2, 3}\ns.discard(99)\nprint(len(s))`,
        question: 'Does s.discard(99) raise a KeyError?',
        options: [
            'No, discard() safely ignores missing elements, len is 3',
            'Yes, KeyError: 99',
            'len becomes 4',
            'SyntaxError'
        ],
        correct: 'No, discard() safely ignores missing elements, len is 3',
        explanation: '.discard() is the safe mutator in Python sets: it removes the element if present, but does nothing and never raises an exception if absent.'
    },
    {
        code: `x = set([1, 1, 2, 2, 3, 3, 3])\nprint(len(x))`,
        question: 'What is len(x)?',
        options: ['7', '3', '1', 'Error'],
        correct: '3',
        explanation: 'Sets enforce mathematical uniqueness. Duplicates are collapsed into distinct elements {1, 2, 3}, resulting in length 3.'
    }
];

function executeSetCode(codeStr) {
    const rawLines = codeStr.split('\n');
    const steps = [];
    const outputs = [];

    let rawList = [];
    let setItems = [];
    let lookupTarget = null;
    let lookupFound = null;
    let keyErrorOccurred = false;

    const addStep = (lineNum, action, detail, extra = {}) => {
        steps.push({
            lineNum,
            action,
            detail,
            rawList: [...rawList],
            setItems: [...setItems],
            lookupTarget,
            lookupFound,
            keyErrorOccurred,
            outputs: [...outputs],
            ...extra
        });
    };

    if (codeStr.includes('raw_ids = [')) {
        rawList = [101, 102, 101, 105, 102, 107];
        addStep(1, 'init', 'raw_ids contains 6 items with duplicates: [101, 102, 101, 105, 102, 107]');
        setItems = [101, 102, 105, 107];
        addStep(4, 'dedup', 'set(raw_ids) collapsed duplicate 101 and 102 into 4 unique elements');
        outputs.push('Original items count: 6');
        outputs.push('Deduplicated Set: {101, 102, 105, 107}');
        addStep(6, 'print', 'Deduplication metrics printed');
    } else if (codeStr.includes('skills = {"Python"')) {
        setItems = ['Python', 'SQL', 'Docker', 'Git'];
        addStep(1, 'init', 'Initialized skills set with 4 hashable elements');
        lookupTarget = 'SQL';
        lookupFound = true;
        addStep(4, 'search_found', "Computed hash('SQL') -> direct bucket hit in O(1) time: True");
        outputs.push('Has SQL? True');
        lookupTarget = 'Rust';
        lookupFound = false;
        addStep(5, 'search_not_found', "Computed hash('Rust') -> bucket empty -> O(1) time: False");
        outputs.push('Has Rust? False');
    } else if (codeStr.includes('tools = {"Vim"')) {
        setItems = ['Vim', 'VSCode', 'Git'];
        addStep(1, 'init', "tools set initialized: {'Vim', 'VSCode', 'Git'}");
        addStep(4, 'discard', "tools.discard('Sublime') found no element -> safely skipped without raising error");
        outputs.push("After safe discard: {'Vim', 'VSCode', 'Git'}");
        keyErrorOccurred = true;
        outputs.push("Caught KeyError with .remove(): 'Sublime'");
        addStep(11, 'remove_error', "tools.remove('Sublime') raised fatal KeyError because 'Sublime' is absent");
    } else {
        addStep(1, 'init', 'not_a_set = {} instantiates a dict');
        addStep(2, 'init', 'is_a_set = set() instantiates an empty set');
        outputs.push("type({}): <class 'dict'>");
        outputs.push("type(set()): <class 'set'>");
        addStep(5, 'print', 'Type verification printed');
    }

    if (steps.length === 0) {
        steps.push({ lineNum: 1, action: 'idle', detail: 'Ready to execute', outputs: [] });
    }

    return { steps, finalOutputs: outputs };
}

export default function SetOperationsVisualizer() {
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
        const state = executeSetCode(code);
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
            const state = executeSetCode(code);
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
    const rawList = currentStep?.rawList || [];
    const setItems = currentStep?.setItems || [];
    const lookupTarget = currentStep?.lookupTarget || null;
    const lookupFound = currentStep?.lookupFound;
    const keyErrorOccurred = currentStep?.keyErrorOccurred || false;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    return (
        <div className="space-y-4 text-slate-800">
            {/* ── 1. Clean Structured Header with Full-Width Segmented Presets ────── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Sets in Python & Core Operations Visualizer
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-200/60 shrink-0 hidden sm:inline-block">
                            Deduplication & O(1) Membership
                        </span>
                    </div>
                </div>

                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    Watch Python sets filter out duplicate items automatically. Compare $O(1)$ constant-time membership lookups against $O(N)$ sequential list searches, and see why <code>.discard()</code> is safer than <code>.remove()</code>.
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
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-teal-600' : 'text-slate-400'}`}>
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
                        badgeText="Set Engine"
                        fileName="sets.py"
                        accentColor="#0d9488"
                    />
                </div>

                {/* ── Right Column: Deduplication Funnel & Set Elements (7 cols) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Error Banner */}
                    {keyErrorOccurred && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-2.5 animate-fadeIn">
                            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <span className="font-bold text-rose-900 block mb-0.5">KeyError: Missing Item</span>
                                <span className="text-rose-800 leading-relaxed font-mono">
                                    tools.remove('Sublime') crashed because 'Sublime' is not present in the set. Use tools.discard('Sublime') to fail silently!
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Visual 1: Deduplication Funnel */}
                    {rawList.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-teal-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Automatic Deduplication Pipeline
                                    </h3>
                                </div>
                                <span className="text-[11px] font-mono text-teal-700 font-bold">
                                    {rawList.length} items → {setItems.length} unique
                                </span>
                            </div>

                            {/* Raw List of elements before dedup */}
                            <div className="space-y-1 text-xs">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Input Array (with duplicate items):
                                </span>
                                <div className="flex flex-wrap gap-1.5 font-mono">
                                    {rawList.map((item, idx) => {
                                        const isDup = rawList.indexOf(item) !== idx;
                                        return (
                                            <span
                                                key={idx}
                                                className={`px-2.5 py-1 rounded text-xs border ${
                                                    isDup
                                                        ? 'bg-rose-50 border-rose-300 text-rose-700 line-through opacity-70'
                                                        : 'bg-slate-100 border-slate-200 text-slate-800 font-bold'
                                                }`}
                                            >
                                                {item}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visual 2: The Set Elements (Unordered Unique Hash Buckets) */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-teal-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Set Elements (Unordered Unique Hash Table)
                                </h3>
                            </div>
                            <span className="text-xs font-mono text-slate-400">
                                len = {setItems.length}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {setItems.map((val, idx) => {
                                const isFoundTarget = lookupTarget === String(val);
                                return (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-xl border text-center transition-all ${
                                            isFoundTarget
                                                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30 scale-105 shadow-xs'
                                                : 'bg-[#0b101b] border-slate-800 text-emerald-300'
                                        }`}
                                    >
                                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                                            Unique Item
                                        </div>
                                        <div className={`text-sm font-mono font-bold truncate mt-1 ${isFoundTarget ? 'text-emerald-800' : 'text-emerald-300'}`}>
                                            {String(val)}
                                        </div>
                                        <div className={`text-[9px] font-mono mt-1 pt-1 border-t ${isFoundTarget ? 'border-emerald-200 text-emerald-600' : 'border-slate-800 text-slate-500'}`}>
                                            O(1) Hash
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Visual 3: O(1) Set Lookup vs O(N) List Scan Comparison */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
                            <Search className="w-4 h-4 text-teal-600" />
                            <span>Membership Testing Performance Benchmark</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-950 space-y-1">
                                <span className="font-bold text-teal-800 block text-[11px]">
                                    item in my_set → O(1)
                                </span>
                                <div className="text-sm font-bold text-teal-900">Instant Direct Hash</div>
                                <p className="text-[10px] text-teal-700 font-sans">
                                    Hashes the element directly to bucket memory. Requires exactly 1 step regardless of whether the set has 10 or 1,000,000 items!
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
                                <span className="font-bold text-slate-800 block text-[11px]">
                                    item in my_list → O(N)
                                </span>
                                <div className="text-sm font-bold text-slate-800">Linear Scan (Slow)</div>
                                <p className="text-[10px] text-slate-500 font-sans">
                                    Compares elements one-by-one from index 0 to N-1 until a match is found.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── 4. Interactive Challenge ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <HelpCircle className="w-4 h-4 text-purple-600" />
                                <span>Try It Yourself: Set Operations Prediction</span>
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

                        <div className="grid grid-cols-2 gap-2">
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
                                        className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-left border cursor-pointer ${
                                            showExplanation
                                                ? isCorrect
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                                                    : isPicked
                                                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                                                    : 'bg-slate-50 border-slate-200 text-slate-500'
                                                : 'bg-white border-slate-200 hover:border-teal-400 text-slate-800'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                    {selectedAnswer === CHALLENGES[challengeIdx].correct ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                    )}
                                    <span>
                                        {selectedAnswer === CHALLENGES[challengeIdx].correct ? 'Correct!' : 'Incorrect'}
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
                                    className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
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

