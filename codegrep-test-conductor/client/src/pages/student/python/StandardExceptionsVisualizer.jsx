import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Network, AlertCircle, Sparkles, CheckCircle2,
    Layers, Search, ShieldAlert, Cpu, ArrowRight, Hash, Database
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 3: Standard Built-in Exceptions
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'lookup-errors',
        label: 'IndexError & KeyError (LookupError)',
        code: `colors = ["red", "green", "blue"]  # indices 0, 1, 2
user = {"name": "Aman", "role": "Dev"}

# Trap 1: Accessing out-of-bounds index 5
try:
    print(colors[5])
except IndexError as e:
    print("Caught IndexError:", e)

# Trap 2: Accessing non-existent key "age"
try:
    print(user["age"])
except KeyError as e:
    print("Caught KeyError:", e)`,
        steps: [
            {
                lineNum: 1,
                action: 'init_data',
                detail: 'colors list [len=3] and user dict [2 keys] loaded',
                activeError: null,
                treeFocus: 'LookupError',
                explanation: 'Allocates list with indices [0, 1, 2] and dictionary with keys {"name", "role"}.',
                variables: { colors: '["red", "green", "blue"]', user: '{"name": "Aman", "role": "Dev"}' },
                outputs: []
            },
            {
                lineNum: 6,
                action: 'trigger_index_error',
                detail: 'colors[5] attempted: Index 5 > max index 2!',
                activeError: 'IndexError',
                treeFocus: 'IndexError',
                explanation: 'List indices stop at 2. Requesting index 5 triggers IndexError: list index out of range.',
                variables: { colors: '["red", "green", "blue"]' },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'catch_index_error',
                detail: 'except IndexError caught and handled gracefully',
                activeError: 'IndexError',
                treeFocus: 'IndexError',
                explanation: 'IndexError subclass of LookupError is caught.',
                variables: { e: 'list index out of range' },
                outputs: ['Caught IndexError: list index out of range']
            },
            {
                lineNum: 12,
                action: 'trigger_key_error',
                detail: 'user["age"] attempted: Key "age" not in hash table!',
                activeError: 'KeyError',
                treeFocus: 'KeyError',
                explanation: 'Dictionary hash table does not contain key "age". Raises KeyError: \'age\'.',
                variables: { user: '{"name": "Aman", "role": "Dev"}' },
                outputs: ['Caught IndexError: list index out of range']
            },
            {
                lineNum: 14,
                action: 'catch_key_error',
                detail: 'except KeyError caught and handled gracefully',
                activeError: 'KeyError',
                treeFocus: 'KeyError',
                explanation: 'KeyError subclass of LookupError is caught.',
                variables: { e: "'age'" },
                outputs: ['Caught IndexError: list index out of range', "Caught KeyError: 'age'"]
            }
        ]
    },
    {
        id: 'type-vs-value',
        label: 'TypeError vs ValueError',
        code: `# Trap 1: TypeError (Illegal operation between incompatible types)
try:
    calc = "5" + 10  # String + Integer is illegal!
except TypeError as e:
    print("Caught TypeError:", e)

# Trap 2: ValueError (Right type, but invalid literal value)
try:
    val = int("hello")  # str is fine for int(), but "hello" is not base-10 digits!
except ValueError as e:
    print("Caught ValueError:", e)`,
        steps: [
            {
                lineNum: 3,
                action: 'trigger_type_error',
                detail: '"5" + 10 attempted: Cannot concatenate str and int',
                activeError: 'TypeError',
                treeFocus: 'TypeError',
                explanation: 'Python is strongly typed. You cannot use binary operator + between str and int without explicit conversion.',
                variables: {},
                outputs: []
            },
            {
                lineNum: 5,
                action: 'catch_type_error',
                detail: 'except TypeError caught cleanly',
                activeError: 'TypeError',
                treeFocus: 'TypeError',
                explanation: 'TypeError caught.',
                variables: { e: 'can only concatenate str (not "int") to str' },
                outputs: ['Caught TypeError: can only concatenate str (not "int") to str']
            },
            {
                lineNum: 9,
                action: 'trigger_value_error',
                detail: 'int("hello") attempted: "hello" is not a valid number literal!',
                activeError: 'ValueError',
                treeFocus: 'ValueError',
                explanation: 'Type is valid (int() accepts str), but the value content cannot be parsed as a base-10 integer.',
                variables: {},
                outputs: ['Caught TypeError: can only concatenate str (not "int") to str']
            },
            {
                lineNum: 11,
                action: 'catch_value_error',
                detail: 'except ValueError caught cleanly',
                activeError: 'ValueError',
                treeFocus: 'ValueError',
                explanation: 'ValueError caught.',
                variables: { e: "invalid literal for int() with base 10: 'hello'" },
                outputs: [
                    'Caught TypeError: can only concatenate str (not "int") to str',
                    "Caught ValueError: invalid literal for int() with base 10: 'hello'"
                ]
            }
        ]
    }
];

export default function StandardExceptionsVisualizer() {
    const [selectedExample, setSelectedExample] = useState(0);
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [steps, setSteps] = useState(EXAMPLES[0].steps);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const intervalRef = useRef(null);

    const speedMs = { slow: 1800, normal: 1000, fast: 400 };

    const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;
    const currentLineNum = currentStepData?.lineNum ?? null;
    const transitionInfo = getStepTransitionInfo(steps, currentStep);
    const terminalLines = currentStepData?.outputs ?? [];

    const loadExample = useCallback((idx) => {
        clearInterval(intervalRef.current);
        setSelectedExample(idx);
        setCode(EXAMPLES[idx].code);
        setSteps(EXAMPLES[idx].steps);
        setCurrentStep(-1);
        setIsRunning(false);
    }, []);

    useEffect(() => {
        clearInterval(intervalRef.current);
        if (!isRunning) return;
        intervalRef.current = setInterval(() => {
            setCurrentStep(prev => {
                if (prev + 1 >= steps.length) {
                    setIsRunning(false);
                    clearInterval(intervalRef.current);
                    return prev;
                }
                return prev + 1;
            });
        }, speedMs[speed]);
        return () => clearInterval(intervalRef.current);
    }, [isRunning, speed, steps.length]);

    const runCode = () => {
        setCurrentStep(0);
        setIsRunning(true);
    };

    const stepForward = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const resetExecution = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setCurrentStep(-1);
    };

    const statusText = currentStepData
        ? `${currentStepData.action.toUpperCase()}: ${currentStepData.detail}`
        : 'Ready — press Run Code or Step Forward';
    const stepCounterText = currentStep >= 0
        ? `Step ${currentStep + 1} / ${steps.length}`
        : `Ready (0 / ${steps.length})`;

    return (
        <div className="space-y-5 animate-fadeIn">
            {/* Top Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                            <Layers className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Standard Built-in Exceptions
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {EXAMPLES.map((ex, idx) => (
                            <button
                                key={ex.id}
                                onClick={() => loadExample(idx)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedExample === idx
                                        ? 'bg-sky-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                }`}
                            >
                                <span>{ex.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column: Code Editor */}
                <div className="lg:col-span-5 space-y-4">
                    <InteractiveEditorWithArrow
                        code={code}
                        setCode={c => { setCode(c); resetExecution(); }}
                        currentLineNum={currentLineNum}
                        transitionInfo={transitionInfo}
                        isRunning={isRunning}
                        runCode={runCode}
                        stepForward={stepForward}
                        resetExecution={resetExecution}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={statusText}
                        stepCounterText={stepCounterText}
                        terminalLines={terminalLines}
                        badgeText="Exception Matrix"
                        fileName="builtin_exceptions.py"
                        accentColor="#0284c7"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-bold text-slate-800 mb-0.5">
                                        Line {currentStepData.lineNum} — <span className="uppercase text-slate-500 font-mono">{currentStepData.action}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">{currentStepData.explanation}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Exception Hierarchy Tree & Diagnostic Bay */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {/* HIERARCHY TREE BOX */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Network className="w-4 h-4 text-sky-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Python Exception Inheritance Tree
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded">
                                Root: BaseException
                            </span>
                        </div>

                        {/* Visual Tree Schema */}
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-2">
                            <div className="text-slate-400">BaseException</div>
                            <div className="pl-4 border-l-2 border-slate-700 space-y-2">
                                <div className="text-sky-300 font-bold">└── Exception (Universal Application Base)</div>
                                <div className="pl-6 border-l-2 border-slate-700 space-y-2">
                                    {/* Branch 1: LookupError */}
                                    <div className={`p-2 rounded-lg border transition-all ${
                                        currentStepData?.treeFocus === 'LookupError' || currentStepData?.treeFocus === 'IndexError' || currentStepData?.treeFocus === 'KeyError'
                                            ? 'bg-sky-950/80 border-sky-400 text-white'
                                            : 'border-slate-800 text-slate-400'
                                    }`}>
                                        <div className="font-bold text-sky-400">├── LookupError</div>
                                        <div className="pl-4 text-[11px] space-y-1 mt-1">
                                            <div className={currentStepData?.activeError === 'IndexError' ? 'text-amber-300 font-bold' : ''}>
                                                ├── IndexError (sequence index out of range)
                                            </div>
                                            <div className={currentStepData?.activeError === 'KeyError' ? 'text-amber-300 font-bold' : ''}>
                                                └── KeyError (dictionary key missing)
                                            </div>
                                        </div>
                                    </div>

                                    {/* Branch 2: TypeError & ValueError */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className={`p-2 rounded-lg border transition-all ${
                                            currentStepData?.activeError === 'TypeError'
                                                ? 'bg-rose-950/80 border-rose-400 text-rose-200 font-bold'
                                                : 'border-slate-800 text-slate-400'
                                        }`}>
                                            ├── TypeError
                                            <div className="text-[10px] font-normal text-slate-400 mt-0.5">Wrong data type for operation</div>
                                        </div>
                                        <div className={`p-2 rounded-lg border transition-all ${
                                            currentStepData?.activeError === 'ValueError'
                                                ? 'bg-amber-950/80 border-amber-400 text-amber-200 font-bold'
                                                : 'border-slate-800 text-slate-400'
                                        }`}>
                                            └── ValueError
                                            <div className="text-[10px] font-normal text-slate-400 mt-0.5">Valid type, invalid literal content</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Diagnostic Status Box */}
                        {currentStepData?.activeError ? (
                            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-sky-900 text-xs">
                                        <ShieldAlert className="w-4 h-4 text-sky-600" />
                                        <span>DIAGNOSTIC RADAR: {currentStepData.activeError} Intercepted</span>
                                    </div>
                                    <span className="text-[10px] font-mono bg-sky-200 text-sky-900 px-2 py-0.5 rounded font-bold">
                                        Subclass of Exception
                                    </span>
                                </div>
                                <p className="text-xs text-sky-800 leading-relaxed">
                                    Because <code className="font-mono bg-white px-1 rounded font-bold">{currentStepData.activeError}</code> inherits from <code className="font-mono bg-white px-1 rounded font-bold">Exception</code>, you can catch it directly with <code className="font-mono">except {currentStepData.activeError}:</code> or catch all application errors generally with <code className="font-mono">except Exception:</code>!
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                                Step forward or run code to simulate built-in exception triggers.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

