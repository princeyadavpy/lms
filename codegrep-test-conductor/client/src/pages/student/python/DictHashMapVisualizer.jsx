import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Hash,
    Key,
    Database,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Zap,
    Lock,
    Search
} from 'lucide-react';

// ── Preset Examples for Topic 4.1 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'hashmap-lookup',
        label: 'Hash Lookup',
        code: `student = {
    "id": 101,
    "name": "Asha Sharma",
    "gpa": 3.9,
    "enrolled": True
}

# Fast O(1) key retrieval
student_name = student["name"]
print("Name:", student_name)
print("GPA:", student["gpa"])`
    },
    {
        id: 'hashable-keys',
        label: 'Valid Keys',
        code: `# Immutable types are hashable (can be keys)
locations = {
    (28.61, 77.20): "New Delhi",
    (19.07, 72.87): "Mumbai"
}
print("Delhi:", locations[(28.61, 77.20)])

# Attempting to use a mutable list as key raises TypeError
try:
    bad_dict = {[1, 2]: "Invalid Point"}
except TypeError as err:
    print("Caught TypeError:", err)`
    },
    {
        id: 'safe-get-fallback',
        label: 'Safe .get()',
        code: `user = {"username": "neo99", "role": "developer"}

# Safe access with fallback default value
theme = user.get("theme", "dark_mode")
print("Theme:", theme)

# Missing key without .get() raises KeyError
try:
    secret = user["api_key"]
except KeyError as err:
    print("KeyError! Missing key:", err)`
    },
    {
        id: 'dict-mutation',
        label: 'Add & Update',
        code: `inventory = {"apples": 50, "bananas": 30}
inventory["oranges"] = 45   # Insert new key
inventory["apples"] = 65    # Update existing key
del inventory["bananas"]    # Delete key
print("Updated inventory:", inventory)`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `d = {"a": 1, "b": 2}\nval = d.get("c", 99)`,
        question: 'What is the value of val?',
        options: ['KeyError', 'None', '99', 'False'],
        correct: '99',
        explanation: 'Because "c" is not in d, .get("c", 99) safely returns the provided default value (99) instead of crashing with a KeyError.'
    },
    {
        code: `my_key = (1, [2, 3])\nd = {my_key: "value"}`,
        question: 'Does Python allow my_key as a dictionary key?',
        options: [
            'Yes, because tuples are always hashable',
            'No, TypeError because the tuple contains a mutable list',
            'Yes, but only if length is 2',
            'SyntaxError'
        ],
        correct: 'No, TypeError because the tuple contains a mutable list',
        explanation: 'For a tuple to be hashable, ALL elements inside it must also be hashable. Because [2, 3] is a mutable list, the entire tuple becomes unhashable.'
    }
];

// ── Hash Calculation Function ───────────────────────────────────────────────
function calculateBucket(keyStr, numBuckets = 8) {
    let hash = 0;
    const str = String(keyStr);
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    const absHash = Math.abs(hash);
    return {
        rawHash: `0x${absHash.toString(16).padStart(6, '0').slice(-6)}`,
        bucketIdx: absHash % numBuckets
    };
}

// ── Execution Engine ────────────────────────────────────────────────────────
function executeDictCode(codeStr) {
    const rawLines = codeStr.split('\n');
    const steps = [];
    const outputs = [];

    // Dictionary state: key -> { value, type, rawHash, bucketIdx }
    let dictEntries = {};
    let activeKey = null;
    let errorBanner = null;

    const addStep = (lineNum, action, detail, key = null, err = null) => {
        steps.push({
            lineNum,
            action,
            detail,
            activeKey: key,
            errorBanner: err,
            dictEntries: JSON.parse(JSON.stringify(dictEntries)),
            outputs: [...outputs]
        });
    };

    if (codeStr.includes('student = {')) {
        const initial = [
            { k: 'id', v: 101, t: 'int' },
            { k: 'name', v: 'Asha Sharma', t: 'str' },
            { k: 'gpa', v: 3.9, t: 'float' },
            { k: 'enrolled', v: true, t: 'bool' }
        ];
        initial.forEach(item => {
            const h = calculateBucket(item.k);
            dictEntries[item.k] = { value: item.v, type: item.t, rawHash: h.rawHash, bucketIdx: h.bucketIdx };
        });
        addStep(1, 'init', 'Allocated hash table with 4 key-value entries', 'name');
        outputs.push('Name: Asha Sharma');
        addStep(8, 'lookup', "Computed hash('name') -> instant O(1) retrieval of 'Asha Sharma'", 'name');
        outputs.push('GPA: 3.9');
        addStep(10, 'lookup', "Computed hash('gpa') -> instant O(1) retrieval of 3.9", 'gpa');
    } else if (codeStr.includes('locations = {')) {
        const h1 = calculateBucket('(28.61, 77.20)');
        dictEntries['(28.61, 77.20)'] = { value: 'New Delhi', type: 'str', rawHash: h1.rawHash, bucketIdx: h1.bucketIdx };
        const h2 = calculateBucket('(19.07, 72.87)');
        dictEntries['(19.07, 72.87)'] = { value: 'Mumbai', type: 'str', rawHash: h2.rawHash, bucketIdx: h2.bucketIdx };
        addStep(2, 'init', 'Tuple keys hashed successfully (Tuples are immutable & hashable)');
        outputs.push('Delhi: New Delhi');
        addStep(6, 'lookup', 'Retrieved value for tuple coordinate key');
        outputs.push("Caught TypeError: unhashable type: 'list'");
        addStep(
            11,
            'type_error',
            "TypeError: unhashable type: 'list' (Mutable lists cannot generate a stable hash value!)",
            null,
            "HASHABILITY VIOLATION: Dictionary keys must have a fixed, immutable hash value. Python strictly forbids lists and dicts as keys."
        );
    } else if (codeStr.includes('user = {"username"')) {
        const h1 = calculateBucket('username');
        dictEntries['username'] = { value: 'neo99', type: 'str', rawHash: h1.rawHash, bucketIdx: h1.bucketIdx };
        const h2 = calculateBucket('role');
        dictEntries['role'] = { value: 'developer', type: 'str', rawHash: h2.rawHash, bucketIdx: h2.bucketIdx };
        addStep(1, 'init', "Allocated user dictionary with 'username' and 'role'");
        outputs.push('Theme: dark_mode');
        addStep(4, 'get_safe', "user.get('theme', 'dark_mode') found no key 'theme' -> safely returned fallback 'dark_mode'");
        outputs.push("KeyError! Missing key: 'api_key'");
        addStep(
            10,
            'key_error',
            "user['api_key'] triggered KeyError because 'api_key' does not exist in hash table",
            null,
            "CRASH WARNING: Direct bracket lookup user['api_key'] raises KeyError if missing. Always prefer user.get('key', default)."
        );
    } else {
        // Dynamic mutation
        const h1 = calculateBucket('apples');
        dictEntries['apples'] = { value: 50, type: 'int', rawHash: h1.rawHash, bucketIdx: h1.bucketIdx };
        const h2 = calculateBucket('bananas');
        dictEntries['bananas'] = { value: 30, type: 'int', rawHash: h2.rawHash, bucketIdx: h2.bucketIdx };
        addStep(1, 'init', 'Initialized inventory with apples and bananas');
        const h3 = calculateBucket('oranges');
        dictEntries['oranges'] = { value: 45, type: 'int', rawHash: h3.rawHash, bucketIdx: h3.bucketIdx };
        addStep(2, 'insert', "Inserted new key 'oranges' at bucket #" + h3.bucketIdx, 'oranges');
        dictEntries['apples'].value = 65;
        addStep(3, 'update', "Updated existing key 'apples' from 50 to 65", 'apples');
        delete dictEntries['bananas'];
        addStep(4, 'delete', "Deleted key 'bananas' from hash table");
        outputs.push("Updated inventory: {'apples': 65, 'oranges': 45}");
        addStep(5, 'print', 'Inventory state printed');
    }

    if (steps.length === 0) {
        steps.push({ lineNum: 1, action: 'idle', detail: 'Ready to execute', outputs: [] });
    }

    return { steps, finalOutputs: outputs };
}

export default function DictHashMapVisualizer() {
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
        const state = executeDictCode(code);
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
            const state = executeDictCode(code);
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
    const dictEntries = currentStep?.dictEntries || {};
    const activeKey = currentStep?.activeKey || null;
    const errorBanner = currentStep?.errorBanner || null;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    // Buckets 0 through 7
    const NUM_BUCKETS = 8;
    const buckets = Array.from({ length: NUM_BUCKETS }, (_, i) => ({
        idx: i,
        items: []
    }));
    Object.entries(dictEntries).forEach(([k, item]) => {
        const bIdx = item.bucketIdx !== undefined ? item.bucketIdx : 0;
        buckets[bIdx].items.push({ key: k, ...item });
    });

    return (
        <div className="space-y-4 text-slate-800">
            {/* ── 1. Clean Structured Header with Full-Width Segmented Presets ────── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Python Dictionaries & Hash Map Architecture Visualizer
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200/60 shrink-0 hidden sm:inline-block">
                            Hash Table & O(1) Lookup
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
                        badgeText="Hash Table Engine"
                        fileName="hashmap.py"
                        accentColor="#d97706"
                    />
                </div>

                {/* ── Right Column: Interactive Hash Table & Bucket Map (7 cols) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Error / Alert Banner if Triggered */}
                    {errorBanner && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-2.5 animate-fadeIn">
                            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <span className="font-bold text-rose-900 block mb-0.5">Python Exception Caught</span>
                                <span className="text-rose-800 leading-relaxed">{errorBanner}</span>
                            </div>
                        </div>
                    )}

                    {/* Hash Table Buckets Visualizer */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-amber-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Hash Table Bucket Array (modulo {NUM_BUCKETS})
                                </h3>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono font-bold border border-amber-200">
                                {Object.keys(dictEntries).length} Key-Value Pairs
                            </span>
                        </div>

                        {/* Buckets Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {buckets.map((b) => {
                                const hasItems = b.items.length > 0;
                                const isHighlighted = b.items.some(it => it.key === activeKey);

                                return (
                                    <div
                                        key={b.idx}
                                        className={`rounded-xl border p-2.5 flex flex-col justify-between min-h-[90px] transition-all ${
                                            isHighlighted
                                                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30 scale-102'
                                                : hasItems
                                                ? 'bg-[#0b101b] border-slate-800 text-slate-200'
                                                : 'bg-slate-50/70 border-dashed border-slate-200 text-slate-400'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-[9px] font-mono">
                                            <span className={isHighlighted ? 'text-amber-800 font-bold' : hasItems ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                                                Bucket #{b.idx}
                                            </span>
                                            {hasItems && (
                                                <span className={isHighlighted ? 'text-amber-700' : 'text-slate-500'}>
                                                    {b.items[0].rawHash}
                                                </span>
                                            )}
                                        </div>

                                        {hasItems ? (
                                            b.items.map((it) => (
                                                <div key={it.key} className="py-1">
                                                    <div className={`font-mono font-bold text-xs truncate ${isHighlighted ? 'text-amber-950' : 'text-emerald-400'}`}>
                                                        "{it.key}"
                                                    </div>
                                                    <div className={`text-[10px] font-mono truncate ${isHighlighted ? 'text-amber-800' : 'text-slate-400'}`}>
                                                        → {String(it.value)}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-2 text-[10px] italic text-slate-400">
                                                Empty slot
                                            </div>
                                        )}

                                        <div className={`text-[9px] font-mono pt-1 border-t ${isHighlighted ? 'border-amber-200 text-amber-700' : hasItems ? 'border-slate-800 text-slate-500' : 'border-dashed border-slate-200 text-slate-300'}`}>
                                            {hasItems ? `${b.items.length} entry` : 'O(1) slot'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Key Hashability & Lookup Speed Rule Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>Python Dictionary Architecture Rules</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Valid (Hashable) Keys</span>
                                </div>
                                <p className="text-[11px] text-emerald-700 leading-relaxed">
                                    <code>str</code>, <code>int</code>, <code>float</code>, <code>tuple</code> (with hashable elements), <code>frozenset</code>.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Forbidden (Unhashable) Keys</span>
                                </div>
                                <p className="text-[11px] text-rose-700 leading-relaxed">
                                    <code>list</code>, <code>dict</code>, <code>set</code>. Attempting to use them raises <code>TypeError: unhashable type</code>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── 3. Interactive Challenge ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <HelpCircle className="w-4 h-4 text-purple-600" />
                                <span>Try It Yourself: Hash Map Prediction</span>
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
                                                : 'bg-white border-slate-200 hover:border-amber-400 text-slate-800'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
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
                                    className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
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

