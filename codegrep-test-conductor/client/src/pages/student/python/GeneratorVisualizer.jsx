import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Sparkles,
    Cpu,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Zap,
    Layers,
    Database,
    Pause,
    ArrowDown
} from 'lucide-react';

// ── Preset Examples for Topic 3.3 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'comprehension-pipeline',
        label: 'Comprehension',
        code: `# Filter even numbers and square them
nums = [1, 2, 3, 4, 5, 6]
evens_squared = [x**2 for x in nums if x % 2 == 0]
print("Result:", evens_squared)`
    },
    {
        id: 'yield-generator',
        label: 'yield Generator',
        code: `def count_up(limit):
    n = 1
    while n <= limit:
        yield n
        n += 1

gen = count_up(3)
print(next(gen))
print(next(gen))
print(next(gen))`
    },
    {
        id: 'eager-vs-lazy',
        label: 'Eager vs Lazy',
        code: `# Eager: Allocates 1,000,000 items in RAM (~8.4 MB)
eager_list = [x * 2 for x in range(10)]

# Lazy: Allocates 112 bytes state machine
lazy_gen = (x * 2 for x in range(10))

print("First item from gen:", next(lazy_gen))
print("Second item from gen:", next(lazy_gen))`
    },
    {
        id: 'fibonacci-stream',
        label: 'Fibonacci Stream',
        code: `def fib_stream(count):
    a, b = 0, 1
    for _ in range(count):
        yield a
        a, b = b, a + b

fib = fib_stream(5)
for val in fib:
    print(val)`
    },
    {
        id: 'dict-comp',
        label: 'Dict Syntax',
        code: `keys = ["a", "b", "c"]
val_map = {k: ord(k) for k in keys}
print("ASCII mapping:", val_map)`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `res = [x * 10 for x in [1, 2, 3, 4] if x > 2]`,
        question: 'What is the final value of res?',
        options: ['[10, 20, 30, 40]', '[30, 40]', '[3, 4]', '[20, 30, 40]'],
        correct: '[30, 40]',
        explanation: 'Only numbers > 2 (3 and 4) pass the filter condition. Each passing x is multiplied by 10, producing [30, 40].'
    },
    {
        code: `def my_gen():\n    yield 10\n    yield 20\ng = my_gen()\nnext(g)\nprint(next(g))`,
        question: 'What gets printed?',
        options: ['10', '20', '[10, 20]', 'StopIteration'],
        correct: '20',
        explanation: 'The first next(g) pauses after yielding 10. The second next(g) resumes from that point and yields 20.'
    }
];

// ── Execution Engine for Generator & Comprehension ─────────────────────────
function executeGeneratorCode(codeStr) {
    const rawLines = codeStr.split('\n');
    const steps = [];
    const outputs = [];

    // Comprehension trace: items processed through pipeline
    // Pipeline stages: input -> condition (pass/fail) -> transform -> output list
    const pipelineItems = [];
    let generatorState = null; // { functionName, localVars, yieldValue, pausedAtLine, isFinished }
    let memoryMetrics = { eagerBytes: '8.4 MB (Allocated in RAM)', lazyBytes: '112 Bytes (Constant O(1))' };

    const addStep = (lineNum, action, detail, extra = {}) => {
        steps.push({
            lineNum,
            action,
            detail,
            pipelineItems: JSON.parse(JSON.stringify(pipelineItems)),
            generatorState: generatorState ? { ...generatorState } : null,
            memoryMetrics: { ...memoryMetrics },
            outputs: [...outputs],
            ...extra
        });
    };

    // Check which preset mode is running
    const isComp = codeStr.includes('[x**2') || codeStr.includes('evens_squared');
    const isYield = codeStr.includes('def count_up') || codeStr.includes('count_up(3)');
    const isEagerLazy = codeStr.includes('eager_list') || codeStr.includes('lazy_gen');
    const isFib = codeStr.includes('fib_stream');
    const isDict = codeStr.includes('val_map');

    if (isComp) {
        addStep(2, 'init', 'Declared input sequence nums = [1, 2, 3, 4, 5, 6]');
        const items = [1, 2, 3, 4, 5, 6];
        for (let idx = 0; idx < items.length; idx++) {
            const val = items[idx];
            const isEven = val % 2 === 0;
            const squared = isEven ? val ** 2 : null;
            pipelineItems.push({
                val,
                conditionPassed: isEven,
                transformedVal: squared,
                status: isEven ? 'passed' : 'filtered_out'
            });
            addStep(
                3,
                'comp_step',
                `Item ${val}: condition (${val} % 2 == 0) -> ${isEven ? 'True (keep)' : 'False (drop)'}${isEven ? ` -> transform: ${val}^2 = ${squared}` : ''}`
            );
        }
        outputs.push('Result: [4, 16, 36]');
        addStep(4, 'print', 'List comprehension completed: [4, 16, 36]');
    } else if (isYield) {
        addStep(1, 'def_gen', "Defined generator function 'count_up' with 'yield' state machine");
        addStep(7, 'instantiate', "Instantiated generator object 'gen = count_up(3)' (no code executed yet)");
        
        // Step 1: next(gen)
        generatorState = { fn: 'count_up', localVars: { n: 1, limit: 3 }, yieldVal: 1, state: 'PAUSED at yield 1' };
        outputs.push('1');
        addStep(8, 'yield_step', "Called next(gen) -> execution enters, runs to 'yield n' (yields 1), function state PAUSED.");

        // Step 2: next(gen)
        generatorState = { fn: 'count_up', localVars: { n: 2, limit: 3 }, yieldVal: 2, state: 'PAUSED at yield 2' };
        outputs.push('2');
        addStep(9, 'yield_step', "Called next(gen) -> execution resumes from yield line, n increments to 2, PAUSED at 'yield 2'.");

        // Step 3: next(gen)
        generatorState = { fn: 'count_up', localVars: { n: 3, limit: 3 }, yieldVal: 3, state: 'PAUSED at yield 3' };
        outputs.push('3');
        addStep(10, 'yield_step', "Called next(gen) -> resumes, n increments to 3, PAUSED at 'yield 3'. Next call will raise StopIteration.");
    } else if (isEagerLazy) {
        addStep(2, 'eager_alloc', 'Eager list comprehension builds full array in memory: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]');
        addStep(5, 'lazy_alloc', 'Generator expression creates lightweight 112-byte iterator object without populating elements upfront');
        outputs.push('First item from gen: 0');
        addStep(7, 'lazy_next', 'Pulled 1st item via next(): computed dynamically on-the-fly -> 0');
        outputs.push('Second item from gen: 2');
        addStep(8, 'lazy_next', 'Pulled 2nd item via next(): computed dynamically on-the-fly -> 2');
    } else if (isFib) {
        addStep(1, 'fib_def', 'Defined fib_stream generator with a, b state variables');
        addStep(7, 'fib_init', 'Instantiated fib_stream(5)');
        const seq = [0, 1, 1, 2, 3];
        for (let i = 0; i < seq.length; i++) {
            generatorState = { fn: 'fib_stream', yieldVal: seq[i], state: `Emitted Fibonacci #${i + 1}` };
            outputs.push(String(seq[i]));
            addStep(9, 'fib_yield', `yield ${seq[i]} emitted to for loop consumer`);
        }
    } else {
        // Dict comprehension
        addStep(1, 'dict_init', "keys = ['a', 'b', 'c']");
        outputs.push("ASCII mapping: {'a': 97, 'b': 98, 'c': 99}");
        addStep(2, 'dict_build', "Dict comprehension mapped each key to its ASCII code via ord(k)");
    }

    if (steps.length === 0) {
        steps.push({ lineNum: 1, action: 'idle', detail: 'Ready to execute', outputs: [] });
    }

    return { steps, finalOutputs: outputs };
}

export default function GeneratorVisualizer() {
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
        const state = executeGeneratorCode(code);
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
            const state = executeGeneratorCode(code);
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
    const pipelineItems = currentStep?.pipelineItems || [];
    const generatorState = currentStep?.generatorState || null;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    return (
        <div className="space-y-4 text-slate-800">
            {/* ── 1. Clean Structured Header with Full-Width Segmented Presets ────── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Generators, yield & Comprehensions Visualizer
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0 hidden sm:inline-block">
                            Lazy Evaluation & Pipeline Engine
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
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`}>
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
                        badgeText="Lazy Pipeline Engine"
                        fileName="generator.py"
                    />
                </div>

                {/* ── Right Column: Interactive Pipeline & Generator State (7 cols) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Visual 1: Comprehension Filter & Transform Pipeline */}
                    {pipelineItems.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        List Comprehension Pipeline Flow
                                    </h3>
                                </div>
                                <span className="text-[11px] font-mono text-slate-500">
                                    [x**2 for x in nums if x%2==0]
                                </span>
                            </div>

                            <div className="space-y-2">
                                {pipelineItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all ${
                                            item.conditionPassed
                                                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                                                : 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-0.5 rounded bg-white border font-bold text-slate-700">
                                                x = {item.val}
                                            </span>
                                            <span className="text-[11px]">
                                                {item.val} % 2 == 0 →{' '}
                                                <strong className={item.conditionPassed ? 'text-emerald-700' : 'text-rose-600'}>
                                                    {item.conditionPassed ? 'True ✓' : 'False ✗'}
                                                </strong>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {item.conditionPassed ? (
                                                <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs shadow-2xs">
                                                    Emitted: {item.transformedVal}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic">
                                                    Dropped (Filter)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Visual 2: Generator yield State Machine */}
                    {generatorState && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5 animate-fadeIn">
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Generator Function Stack Frame (yield State Machine)
                                    </h3>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                                    {generatorState.state}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono space-y-1.5">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                                        Frozen Local Scope
                                    </span>
                                    {generatorState.localVars ? (
                                        Object.entries(generatorState.localVars).map(([k, v]) => (
                                            <div key={k} className="flex justify-between">
                                                <span className="text-slate-400">{k}:</span>
                                                <span className="text-emerald-400 font-bold">{v}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-slate-400">yield value: {generatorState.yieldVal}</div>
                                    )}
                                </div>

                                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col justify-between">
                                    <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-bold block">
                                        Active yield Value
                                    </span>
                                    <div className="text-2xl font-mono font-black text-emerald-700">
                                        {generatorState.yieldVal}
                                    </div>
                                    <span className="text-[10px] text-emerald-600">
                                        Execution paused; call next() to resume
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visual 3: Memory Footprint Benchmark Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
                            <Database className="w-4 h-4 text-blue-600" />
                            <span>Memory Architecture: Eager vs Lazy Evaluation</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
                                <span className="font-bold text-rose-700 block text-[11px]">
                                    List Comprehension (Eager)
                                </span>
                                <div className="text-base font-bold text-rose-800">~8.4 MB in RAM</div>
                                <p className="text-[10px] text-rose-600 font-sans">
                                    Pre-computes and holds all 1,000,000 integers simultaneously in heap memory.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                                <span className="font-bold text-emerald-700 block text-[11px]">
                                    Generator Expression (Lazy)
                                </span>
                                <div className="text-base font-bold text-emerald-800">112 Bytes (O(1))</div>
                                <p className="text-[10px] text-emerald-600 font-sans">
                                    Produces 1 item on demand when requested via next(). Consumes constant memory.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── 3. Interactive Challenge ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <HelpCircle className="w-4 h-4 text-purple-600" />
                                <span>Try It Yourself: Generator & Comprehension Prediction</span>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                                : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-800'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
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
                                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
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

