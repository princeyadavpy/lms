import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Merge,
    Sparkles,
    Eye,
    ArrowRightLeft,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Layers,
    Database
} from 'lucide-react';

// ── Preset Examples for Topic 4.2 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'dict-union',
        label: 'Union (|)',
        code: `defaults = {"theme": "dark", "fontSize": 14, "autoSave": True}
overrides = {"fontSize": 18, "lineNumbers": True}

# Right-hand operand takes precedence on key collision
config = defaults | overrides
print("Merged Config:", config)`
    },
    {
        id: 'dict-views',
        label: 'View Objects',
        code: `scores = {"Alice": 95, "Bob": 88}
items_view = scores.items()

# Mutate the dictionary
scores["Charlie"] = 92

# View automatically reflects the new key without extra copies!
print("Dynamic Items View:", list(items_view))`
    },
    {
        id: 'dict-comprehension',
        label: 'Comprehension',
        code: `names = ["Alice", "Bob", "Charlie", "David"]
# Only include names longer than 3 characters
name_lengths = {name: len(name) for name in names if len(name) > 3}
print("Length Map:", name_lengths)`
    },
    {
        id: 'key-value-inversion',
        label: 'Invert Keys',
        code: `codes = {"US": 1, "IN": 91, "UK": 44}
# Invert dictionary using comprehension
inverted = {v: k for k, v in codes.items()}
print("Inverted:", inverted)`
    },
    {
        id: 'pop-method',
        label: 'pop() Method',
        code: `session = {"user": "alice", "auth": True}
auth_status = session.pop("auth")
missing_role = session.pop("role", "standard_user")

print("Popped auth:", auth_status)
print("Fallback role:", missing_role)
print("Remaining session:", session)`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `a = {"x": 10, "y": 20}\nb = {"y": 99, "z": 30}\nc = a | b`,
        question: 'What is the value of c["y"]?',
        options: ['20', '99', '[20, 99]', 'Error'],
        correct: '99',
        explanation: 'In the dictionary union operator (a | b), keys from the right-hand dictionary (b) take precedence on collisions. Thus c["y"] is 99.'
    },
    {
        code: `nums = {1: "a", 2: "b"}\ninv = {v: k for k, v in nums.items()}`,
        question: 'What is inv["b"]?',
        options: ['1', '2', '"b"', 'KeyError'],
        correct: '2',
        explanation: 'The comprehension inverts keys and values: the key becomes the value ("b") and the value becomes the key (2). Thus inv["b"] is 2.'
    }
];

function executeMethodsCode(codeStr) {
    const rawLines = codeStr.split('\n');
    const steps = [];
    const outputs = [];

    let leftDict = {};
    let rightDict = {};
    let mergedDict = null;
    let collisionKey = null;

    const addStep = (lineNum, action, detail, extra = {}) => {
        steps.push({
            lineNum,
            action,
            detail,
            leftDict: { ...leftDict },
            rightDict: { ...rightDict },
            mergedDict: mergedDict ? { ...mergedDict } : null,
            collisionKey,
            outputs: [...outputs],
            ...extra
        });
    };

    if (codeStr.includes('defaults | overrides')) {
        leftDict = { theme: '"dark"', fontSize: 14, autoSave: 'True' };
        rightDict = { fontSize: 18, lineNumbers: 'True' };
        addStep(1, 'init', "Defined defaults: {'theme': 'dark', 'fontSize': 14, 'autoSave': True}");
        addStep(2, 'init', "Defined overrides: {'fontSize': 18, 'lineNumbers': True}");
        collisionKey = 'fontSize';
        mergedDict = { theme: '"dark"', fontSize: 18, autoSave: 'True', lineNumbers: 'True' };
        addStep(
            5,
            'union',
            "Executed defaults | overrides -> Key collision on 'fontSize': overridden by right-hand operand (18)!"
        );
        outputs.push("Merged Config: {'theme': 'dark', 'fontSize': 18, 'autoSave': True, 'lineNumbers': True}");
        addStep(6, 'print', 'Merged config printed to console');
    } else if (codeStr.includes('scores.items()')) {
        leftDict = { Alice: 95, Bob: 88 };
        addStep(1, 'init', "Initialized scores = {'Alice': 95, 'Bob': 88}");
        addStep(2, 'view', 'Created dynamic view items_view connected directly to scores');
        leftDict['Charlie'] = 92;
        addStep(5, 'mutate', "Mutated scores with 'Charlie': 92 -> items_view instantly reflects new entry without memory copy!");
        outputs.push("Dynamic Items View: [('Alice', 95), ('Bob', 88), ('Charlie', 92)]");
        addStep(8, 'print', 'Printed dynamic items view');
    } else if (codeStr.includes('name_lengths = {')) {
        leftDict = { Alice: 5, Charlie: 7, David: 5 };
        addStep(1, 'init', "names = ['Alice', 'Bob', 'Charlie', 'David']");
        addStep(3, 'comp', "Dict comprehension: filtered out 'Bob' (len <= 3), mapped remaining names to length");
        outputs.push("Length Map: {'Alice': 5, 'Charlie': 7, 'David': 5}");
        addStep(4, 'print', 'Length map printed');
    } else if (codeStr.includes('inverted = {')) {
        leftDict = { US: 1, IN: 91, UK: 44 };
        mergedDict = { '1': "'US'", '91': "'IN'", '44': "'UK'" };
        addStep(1, 'init', "codes = {'US': 1, 'IN': 91, 'UK': 44}");
        addStep(3, 'swap', 'Inverted keys and values using {v: k for k, v in codes.items()}');
        outputs.push("Inverted: {1: 'US', 91: 'IN', 44: 'UK'}");
        addStep(4, 'print', 'Inverted dictionary printed');
    } else {
        leftDict = { user: '"alice"' };
        addStep(1, 'init', "session = {'user': 'alice', 'auth': True}");
        addStep(2, 'pop', "session.pop('auth') removed 'auth' and returned True");
        addStep(3, 'pop_default', "session.pop('role', 'standard_user') missing 'role' -> returned fallback 'standard_user'");
        outputs.push('Popped auth: True');
        outputs.push('Fallback role: standard_user');
        outputs.push("Remaining session: {'user': 'alice'}");
        addStep(7, 'print', 'Outputs printed');
    }

    if (steps.length === 0) {
        steps.push({ lineNum: 1, action: 'idle', detail: 'Ready to execute', outputs: [] });
    }

    return { steps, finalOutputs: outputs };
}

export default function DictMethodsVisualizer() {
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
        const state = executeMethodsCode(code);
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
            const state = executeMethodsCode(code);
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
    const leftDict = currentStep?.leftDict || {};
    const rightDict = currentStep?.rightDict || {};
    const mergedDict = currentStep?.mergedDict || null;
    const collisionKey = currentStep?.collisionKey || null;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    return (
        <div className="space-y-4 text-slate-800">
            {/* ── 1. Clean Structured Header with Full-Width Segmented Presets ────── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Dictionary Methods, Views & Comprehensions Visualizer
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md border border-orange-200/60 shrink-0 hidden sm:inline-block">
                            Union (|) & Dynamic Views
                        </span>
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
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-orange-600' : 'text-slate-400'}`}>
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
                        badgeText="Dict Engine"
                        fileName="dict_methods.py"
                        accentColor="#ea580c"
                    />
                </div>

                {/* ── Right Column: Interactive Union & View Operations (7 cols) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Visual 1: Union Operator (|) Merge Tree */}
                    {mergedDict ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Merge className="w-4 h-4 text-orange-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Dictionary Union (defaults | overrides)
                                    </h3>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-mono text-[10px] font-bold border border-orange-200">
                                    Python 3.9+ Feature
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                                {/* Left operand */}
                                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                                        Left: defaults
                                    </span>
                                    {Object.entries(leftDict).map(([k, v]) => (
                                        <div key={k} className="flex justify-between">
                                            <span className="text-slate-700">"{k}":</span>
                                            <span className={k === collisionKey ? 'line-through text-slate-400' : 'text-slate-900 font-bold'}>
                                                {String(v)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Right operand */}
                                {Object.keys(rightDict).length > 0 && (
                                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 space-y-1.5">
                                        <span className="text-[10px] font-bold text-orange-700 block uppercase tracking-wider">
                                            Right: overrides (Precedence)
                                        </span>
                                        {Object.entries(rightDict).map(([k, v]) => (
                                            <div key={k} className="flex justify-between">
                                                <span className="text-orange-950 font-semibold">"{k}":</span>
                                                <span className="text-orange-700 font-bold">{String(v)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Merged Output Result */}
                            <div className="p-3 rounded-lg bg-[#0b101b] border border-slate-800 text-slate-200 font-mono text-xs space-y-2">
                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                                    Resulting Merged Dictionary
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(mergedDict).map(([k, v]) => (
                                        <span
                                            key={k}
                                            className={`px-2 py-1 rounded text-xs border ${
                                                k === collisionKey
                                                    ? 'bg-amber-950/80 border-amber-400 text-amber-300 font-bold'
                                                    : 'bg-slate-900 border-slate-700 text-emerald-300'
                                            }`}
                                        >
                                            "{k}": {String(v)}
                                        </span>
                                    ))}
                                </div>
                                {collisionKey && (
                                    <p className="text-[11px] text-amber-300/80 font-sans pt-1">
                                        Key collision on <code>"{collisionKey}"</code> was resolved in favor of the right-hand operand.
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Single dictionary representation */
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-orange-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Active Dictionary State
                                    </h3>
                                </div>
                                <span className="text-xs font-mono text-slate-400">
                                    {Object.keys(leftDict).length} keys
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {Object.entries(leftDict).map(([k, v]) => (
                                    <div
                                        key={k}
                                        className="p-2.5 rounded-lg bg-[#0b101b] border border-slate-800 text-xs font-mono"
                                    >
                                        <div className="text-orange-400 font-bold truncate">"{k}"</div>
                                        <div className="text-emerald-400 text-sm font-bold truncate mt-0.5">
                                            {String(v)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── 3. Interactive Challenge ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <HelpCircle className="w-4 h-4 text-purple-600" />
                                <span>Try It Yourself: Dict Methods Prediction</span>
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
                                                : 'bg-white border-slate-200 hover:border-orange-400 text-slate-800'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-2">
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
                                    className="text-xs font-bold text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
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

