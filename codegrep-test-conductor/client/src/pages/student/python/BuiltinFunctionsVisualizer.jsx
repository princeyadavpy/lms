import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Zap, Box, Layers, Terminal, Code2, Info, ArrowRight,
    Check, Sparkles, BookOpen, Hash, ArrowDown, ChevronRight
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES: 3 scenarios with rich step execution data
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'builtins-list',
        label: 'Built-ins: len, max, sum',
        code: `numbers = [3, 7, 1, 9, 4]

length = len(numbers)
print("Length:", length)

biggest = max(numbers)
print("Max:", biggest)

total = sum(numbers)
print("Sum:", total)`,
        steps: [
            {
                lineNum: 1,
                action: 'assign',
                fnName: null,
                detail: 'numbers = [3, 7, 1, 9, 4]',
                explanation: 'A list containing 5 integers is initialized in memory under the identifier "numbers".',
                activeInput: [3, 7, 1, 9, 4],
                activeFn: null,
                processing: 'Allocating list with 5 elements [3, 7, 1, 9, 4]',
                outputVal: null,
                targetVar: 'numbers',
                variables: { numbers: '[3, 7, 1, 9, 4]' },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'call',
                fnName: 'len',
                detail: 'length = len(numbers) → 5',
                explanation: 'Built-in len() inspects the internal __len__ attribute of the list and counts 5 items.',
                activeInput: [3, 7, 1, 9, 4],
                activeFn: 'len',
                processing: 'Counting elements: 5 items total',
                outputVal: 5,
                targetVar: 'length',
                variables: { numbers: '[3, 7, 1, 9, 4]', length: 5 },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'print',
                fnName: null,
                detail: 'print("Length:", length)',
                explanation: 'Built-in print() formats the string and variable value, streaming "Length: 5" to stdout.',
                activeInput: null,
                activeFn: null,
                processing: 'Writing to stdout stream...',
                outputVal: null,
                targetVar: null,
                variables: { numbers: '[3, 7, 1, 9, 4]', length: 5 },
                outputs: ['Length: 5']
            },
            {
                lineNum: 6,
                action: 'call',
                fnName: 'max',
                detail: 'biggest = max(numbers) → 9',
                explanation: 'Built-in max() iterates over the list elements, comparing each item to find the maximum: 9.',
                activeInput: [3, 7, 1, 9, 4],
                activeFn: 'max',
                processing: 'Scanning elements: 3 < 7 < 9 (9 is maximum)',
                outputVal: 9,
                targetVar: 'biggest',
                variables: { numbers: '[3, 7, 1, 9, 4]', length: 5, biggest: 9 },
                outputs: ['Length: 5']
            },
            {
                lineNum: 7,
                action: 'print',
                fnName: null,
                detail: 'print("Max:", biggest)',
                explanation: 'Built-in print() formats and outputs "Max: 9".',
                activeInput: null,
                activeFn: null,
                processing: 'Writing to stdout stream...',
                outputVal: null,
                targetVar: null,
                variables: { numbers: '[3, 7, 1, 9, 4]', length: 5, biggest: 9 },
                outputs: ['Length: 5', 'Max: 9']
            },
            {
                lineNum: 9,
                action: 'call',
                fnName: 'sum',
                detail: 'total = sum(numbers) → 24',
                explanation: 'Built-in sum() starts with 0 and accumulates: 0 + 3 + 7 + 1 + 9 + 4 = 24.',
                activeInput: [3, 7, 1, 9, 4],
                activeFn: 'sum',
                processing: 'Accumulating: 3 + 7 + 1 + 9 + 4 = 24',
                outputVal: 24,
                targetVar: 'total',
                variables: { numbers: '[3, 7, 1, 9, 4]', length: 5, biggest: 9, total: 24 },
                outputs: ['Length: 5', 'Max: 9']
            },
            {
                lineNum: 10,
                action: 'print',
                fnName: null,
                detail: 'print("Sum:", total)',
                explanation: 'Prints "Sum: 24" to complete the sequence.',
                activeInput: null,
                activeFn: null,
                processing: 'Writing to stdout stream...',
                outputVal: null,
                targetVar: null,
                variables: { numbers: '[3, 7, 1, 9, 4]', length: 5, biggest: 9, total: 24 },
                outputs: ['Length: 5', 'Max: 9', 'Sum: 24']
            },
        ]
    },
    {
        id: 'custom-func',
        label: 'Define Function with Defaults',
        code: `def greet(name, greeting="Hello"):
    message = greeting + ", " + name + "!"
    return message

result1 = greet("Alice")
print(result1)

result2 = greet("Bob", "Hi")
print(result2)`,
        steps: [
            {
                lineNum: 1,
                action: 'define',
                fnName: 'greet',
                detail: 'def greet(name, greeting="Hello")',
                explanation: 'Function "greet" is registered in namespace with parameter "name" and default "greeting=\'Hello\'".',
                frame: null,
                variables: { greet: '<function greet>' },
                outputs: []
            },
            {
                lineNum: 5,
                action: 'call',
                fnName: 'greet',
                detail: 'greet("Alice") — using default greeting',
                explanation: 'Call greet("Alice"). "name" takes "Alice", while "greeting" uses its fallback default "Hello".',
                frame: { name: 'Alice', greeting: 'Hello (default)', stage: 'binding' },
                variables: { greet: '<function greet>' },
                outputs: []
            },
            {
                lineNum: 2,
                action: 'assign',
                fnName: 'greet',
                detail: 'message = "Hello, Alice!"',
                explanation: 'Executing function body: "Hello" + ", " + "Alice" + "!" = "Hello, Alice!".',
                frame: { name: 'Alice', greeting: 'Hello', message: 'Hello, Alice!', stage: 'executing' },
                variables: { greet: '<function greet>', name: '"Alice"', greeting: '"Hello"', message: '"Hello, Alice!"' },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'return',
                fnName: 'greet',
                detail: 'return "Hello, Alice!"',
                explanation: 'Return statement transfers "Hello, Alice!" out of the frame back to caller variable result1.',
                frame: { name: 'Alice', greeting: 'Hello', message: 'Hello, Alice!', returnValue: 'Hello, Alice!', stage: 'returning' },
                variables: { greet: '<function greet>', result1: '"Hello, Alice!"' },
                outputs: []
            },
            {
                lineNum: 6,
                action: 'print',
                fnName: null,
                detail: 'print(result1)',
                explanation: 'Outputs result1 to terminal.',
                frame: null,
                variables: { greet: '<function greet>', result1: '"Hello, Alice!"' },
                outputs: ['Hello, Alice!']
            },
            {
                lineNum: 8,
                action: 'call',
                fnName: 'greet',
                detail: 'greet("Bob", "Hi") — overriding default',
                explanation: 'Call greet("Bob", "Hi"). Both arguments provided: greeting takes "Hi", overriding "Hello".',
                frame: { name: 'Bob', greeting: 'Hi (overridden)', stage: 'binding' },
                variables: { greet: '<function greet>', result1: '"Hello, Alice!"' },
                outputs: ['Hello, Alice!']
            },
            {
                lineNum: 2,
                action: 'assign',
                fnName: 'greet',
                detail: 'message = "Hi, Bob!"',
                explanation: 'Inside function frame: "Hi" + ", " + "Bob" + "!" = "Hi, Bob!".',
                frame: { name: 'Bob', greeting: 'Hi', message: 'Hi, Bob!', stage: 'executing' },
                variables: { greet: '<function greet>', result1: '"Hello, Alice!"', name: '"Bob"', greeting: '"Hi"', message: '"Hi, Bob!"' },
                outputs: ['Hello, Alice!']
            },
            {
                lineNum: 3,
                action: 'return',
                fnName: 'greet',
                detail: 'return "Hi, Bob!"',
                explanation: 'Returns "Hi, Bob!" into caller variable result2.',
                frame: { name: 'Bob', greeting: 'Hi', message: 'Hi, Bob!', returnValue: 'Hi, Bob!', stage: 'returning' },
                variables: { greet: '<function greet>', result1: '"Hello, Alice!"', result2: '"Hi, Bob!"' },
                outputs: ['Hello, Alice!']
            },
            {
                lineNum: 9,
                action: 'print',
                fnName: null,
                detail: 'print(result2)',
                explanation: 'Outputs result2 to terminal.',
                frame: null,
                variables: { greet: '<function greet>', result1: '"Hello, Alice!"', result2: '"Hi, Bob!"' },
                outputs: ['Hello, Alice!', 'Hi, Bob!']
            },
        ]
    },
    {
        id: 'docstring',
        label: 'Docstrings & __doc__',
        code: `def area(width, height):
    """Calculate the area of a rectangle."""
    return width * height

result = area(4, 6)
print("Area:", result)

doc = area.__doc__
print("Doc:", doc)`,
        steps: [
            {
                lineNum: 1,
                action: 'define',
                fnName: 'area',
                detail: 'def area(width, height)',
                explanation: 'Function defined. Python automatically stores the triple-quoted string into area.__doc__.',
                docInfo: { name: 'area', docstring: 'Calculate the area of a rectangle.', params: ['width', 'height'] },
                variables: { area: '<function area>' },
                outputs: []
            },
            {
                lineNum: 5,
                action: 'call',
                fnName: 'area',
                detail: 'area(4, 6)',
                explanation: 'Calling area(4, 6) passes width=4, height=6 into the call stack frame.',
                docInfo: { name: 'area', docstring: 'Calculate the area of a rectangle.', params: ['width', 'height'], calling: { width: 4, height: 6 } },
                variables: { area: '<function area>' },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'return',
                fnName: 'area',
                detail: 'return 4 * 6 → 24',
                explanation: 'Calculates width * height = 4 * 6 = 24 and returns.',
                docInfo: { name: 'area', docstring: 'Calculate the area of a rectangle.', params: ['width', 'height'], returned: 24 },
                variables: { area: '<function area>', result: 24 },
                outputs: []
            },
            {
                lineNum: 6,
                action: 'print',
                fnName: null,
                detail: 'print("Area:", result)',
                explanation: 'Prints the calculated area (24) to stdout.',
                docInfo: null,
                variables: { area: '<function area>', result: 24 },
                outputs: ['Area: 24']
            },
            {
                lineNum: 8,
                action: 'assign',
                fnName: null,
                detail: 'doc = area.__doc__',
                explanation: 'Extracts the __doc__ metadata attribute from the function object.',
                docInfo: { name: 'area', extractedDoc: 'Calculate the area of a rectangle.' },
                variables: { area: '<function area>', result: 24, doc: '"Calculate the area of a rectangle."' },
                outputs: ['Area: 24']
            },
            {
                lineNum: 9,
                action: 'print',
                fnName: null,
                detail: 'print("Doc:", doc)',
                explanation: 'Prints the extracted docstring to stdout.',
                docInfo: { name: 'area', extractedDoc: 'Calculate the area of a rectangle.' },
                variables: { area: '<function area>', result: 24, doc: '"Calculate the area of a rectangle."' },
                outputs: ['Area: 24', 'Doc: Calculate the area of a rectangle.']
            },
        ]
    }
];

// ─────────────────────────────────────────────────────────────
// BUILT-IN TOOLKIT REFERENCE DATA
// ─────────────────────────────────────────────────────────────
const BUILTINS = [
    { name: 'len', syntax: 'len(iter)', desc: 'Returns number of items', color: 'blue' },
    { name: 'max', syntax: 'max(iter)', desc: 'Returns largest item', color: 'rose' },
    { name: 'min', syntax: 'min(iter)', desc: 'Returns smallest item', color: 'amber' },
    { name: 'sum', syntax: 'sum(iter)', desc: 'Sums numeric items', color: 'emerald' },
    { name: 'abs', syntax: 'abs(n)', desc: 'Returns absolute value', color: 'purple' },
    { name: 'sorted', syntax: 'sorted(iter)', desc: 'Returns new sorted list', color: 'cyan' },
];

export default function BuiltinFunctionsVisualizer() {
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

    // Auto-run loop synchronized as a single unit
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
            {/* ── 1. Top Bar: Preset Selector ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Built-in Functions &amp; Defining Functions
                            </h2>
                        </div>
                    </div>

                    {/* Example selector pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {EXAMPLES.map((ex, idx) => (
                            <button
                                key={ex.id}
                                onClick={() => loadExample(idx)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedExample === idx
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                }`}
                            >
                                <span>{idx + 1}. {ex.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 2. Main Two-Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* ── Left Column: Interactive Code Editor ── */}
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
                        badgeText="Functions Engine"
                        fileName="functions.py"
                        accentColor="#3b82f6"
                    />

                    {/* Step Explanation Card */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                    currentStepData.action === 'return' ? 'bg-purple-100 text-purple-600' :
                                    currentStepData.action === 'define' ? 'bg-blue-100 text-blue-600' :
                                    currentStepData.action === 'call' ? 'bg-amber-100 text-amber-600' :
                                    currentStepData.action === 'print' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {currentStepData.action === 'return' && <ArrowRight className="w-3.5 h-3.5" />}
                                    {currentStepData.action === 'define' && <Code2 className="w-3.5 h-3.5" />}
                                    {currentStepData.action === 'call' && <Zap className="w-3.5 h-3.5" />}
                                    {currentStepData.action === 'print' && <Terminal className="w-3.5 h-3.5" />}
                                    {currentStepData.action === 'assign' && <Hash className="w-3.5 h-3.5" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-bold text-slate-800 mb-0.5">
                                        Line {currentStepData.lineNum} — <span className="uppercase text-slate-500 font-mono">{currentStepData.action}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">{currentStepData.explanation}</p>
                                </div>
                            </div>

                            {/* Live Variables In Scope */}
                            {currentStepData.variables && Object.keys(currentStepData.variables).length > 0 && (
                                <div className="pt-2 border-t border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Variables In Scope</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.entries(currentStepData.variables).map(([k, v]) => (
                                            <span key={k} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
                                                <span className="text-blue-600 font-bold">{k}</span>
                                                <span className="text-slate-400"> = </span>
                                                <span className="text-emerald-700 font-semibold">{String(v)}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Right Column: Live Synchronous Function Visualizer (Single Unit) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* SCENARIO 1: Live Function Machine for Built-ins */}
                    {selectedExample === 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                        <Zap className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Live Function Machine (Black-Box Processor)
                                    </h3>
                                </div>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                    currentStepData?.action === 'call'
                                        ? 'bg-amber-100 text-amber-700 border border-amber-300 animate-pulse'
                                        : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {currentStepData?.action === 'call' ? `Executing ${currentStepData.fnName}()` : 'Standing By'}
                                </span>
                            </div>

                            {/* Active Input Data Array in Memory */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                                    <span>Input Data in Memory: <code className="text-blue-600 font-bold">numbers</code></span>
                                    <span>Type: list (5 elements)</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    {[3, 7, 1, 9, 4].map((num, idx) => {
                                        const isMax = num === 9 && currentStepData?.fnName === 'max';
                                        return (
                                            <div
                                                key={idx}
                                                className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg border text-center transition-all duration-300 ${
                                                    isMax
                                                        ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-105'
                                                        : currentStepData?.action === 'call'
                                                        ? 'bg-white text-slate-800 border-blue-300 shadow-xs'
                                                        : 'bg-white text-slate-700 border-slate-200'
                                                }`}
                                            >
                                                <span className="text-[10px] font-mono opacity-60">[{idx}]</span>
                                                <span className="text-sm font-mono font-bold">{num}</span>
                                                {isMax && <span className="text-[9px] font-bold uppercase mt-0.5">MAX</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Live Flow Diagram: Input -> Black Box Function Machine -> Output */}
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-white space-y-4">
                                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                                    <span>INPUT ARGUMENT</span>
                                    <span>PROCESSOR</span>
                                    <span>RETURN VALUE</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                    {/* Inputs Column */}
                                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center space-y-1">
                                        <div className="text-[10px] text-slate-500 font-mono uppercase">Passed Argument</div>
                                        <div className="text-xs font-mono text-cyan-300 font-bold truncate">
                                            {currentStepData?.action === 'call' ? 'numbers = [3, 7, 1, 9, 4]' : '[3, 7, 1, 9, 4]'}
                                        </div>
                                    </div>

                                    {/* The Black Box Function Machine */}
                                    <div className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                                        currentStepData?.action === 'call'
                                            ? 'bg-blue-900/40 border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'bg-slate-900 border-slate-700'
                                    }`}>
                                        <div className="flex items-center justify-center gap-1.5 text-blue-400 mb-1">
                                            <Zap className={`w-4 h-4 ${currentStepData?.action === 'call' ? 'animate-bounce' : ''}`} />
                                            <span className="font-mono font-bold text-sm">
                                                {currentStepData?.fnName ? `${currentStepData.fnName}()` : 'Function Machine'}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono">
                                            {currentStepData?.processing || 'Waiting for call...'}
                                        </div>
                                    </div>

                                    {/* Output / Return Column */}
                                    <div className={`p-3 rounded-lg border text-center space-y-1 transition-all ${
                                        currentStepData?.outputVal !== null && currentStepData?.outputVal !== undefined
                                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                                            : 'bg-slate-900 border-slate-800 text-slate-500'
                                    }`}>
                                        <div className="text-[10px] uppercase font-mono">Output Result</div>
                                        <div className="text-base font-mono font-bold">
                                            {currentStepData?.outputVal !== null && currentStepData?.outputVal !== undefined
                                                ? `${currentStepData.outputVal} ✓`
                                                : '—'}
                                        </div>
                                    </div>
                                </div>

                                {currentStepData?.targetVar && (
                                    <div className="text-center text-xs text-slate-300 font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                                        Returned <span className="text-emerald-400 font-bold">{currentStepData.outputVal}</span> assigned to identifier <span className="text-blue-400 font-bold">{currentStepData.targetVar}</span>
                                    </div>
                                )}
                            </div>

                            {/* Summary of 3 Built-ins used in this lesson */}
                            <div className="grid grid-cols-3 gap-2 pt-2">
                                {[
                                    { name: 'len()', role: 'Element counter', res: '5', active: currentStepData?.fnName === 'len' },
                                    { name: 'max()', role: 'Greatest value', res: '9', active: currentStepData?.fnName === 'max' },
                                    { name: 'sum()', role: 'Total summation', res: '24', active: currentStepData?.fnName === 'sum' },
                                ].map((b, i) => (
                                    <div
                                        key={i}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${
                                            b.active
                                                ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                                                : 'bg-slate-50 border-slate-200 text-slate-600'
                                        }`}
                                    >
                                        <div className="font-mono font-bold text-xs">{b.name}</div>
                                        <div className="text-[10px] text-slate-500">{b.role}</div>
                                        <div className="text-xs font-mono font-bold text-emerald-600 mt-0.5">→ {b.res}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SCENARIO 2: Function Definition with Defaults */}
                    {selectedExample === 1 && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                        <Layers className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Call Frame &amp; Default Parameter Dispatch
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                                    {currentStepData?.action === 'call' ? 'Call Active' : currentStepData?.action === 'return' ? 'Returning' : 'Stack Idle'}
                                </span>
                            </div>

                            {/* Function Blueprint */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Function Blueprint in Global Memory
                                </div>
                                <div className="flex items-center gap-2 font-mono text-xs">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md font-bold">def greet</span>
                                    <span className="text-slate-500">(</span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200 font-bold">name</span>
                                    <span className="text-slate-400">,</span>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded border border-emerald-200 font-bold">greeting = "Hello" (default)</span>
                                    <span className="text-slate-500">)</span>
                                </div>
                            </div>

                            {/* Active Call Stack Frame */}
                            {currentStepData?.frame ? (
                                <div className="p-4 bg-indigo-50/60 rounded-xl border-2 border-indigo-300 space-y-3 animate-fadeIn">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs font-mono">
                                            <span>📦 Active Stack Frame: greet()</span>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-800">
                                            {currentStepData.frame.stage}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2.5 bg-white rounded-lg border border-indigo-200 space-y-1">
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Param: name</div>
                                            <div className="text-xs font-mono font-bold text-blue-700">
                                                "{currentStepData.frame.name}"
                                            </div>
                                            <div className="text-[9px] text-slate-500 font-sans">Passed positional</div>
                                        </div>

                                        <div className="p-2.5 bg-white rounded-lg border border-indigo-200 space-y-1">
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Param: greeting</div>
                                            <div className="text-xs font-mono font-bold text-emerald-700">
                                                "{currentStepData.frame.greeting}"
                                            </div>
                                            <div className="text-[9px] text-slate-500 font-sans">
                                                {currentStepData.frame.greeting.includes('default') ? 'Default applied' : 'Overridden by caller'}
                                            </div>
                                        </div>
                                    </div>

                                    {currentStepData.frame.returnValue && (
                                        <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300 text-xs font-mono font-bold flex items-center justify-between">
                                            <span>Return Value:</span>
                                            <span className="text-emerald-800">"{currentStepData.frame.returnValue}"</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs italic">
                                    Call frame is empty. Click "Run Code" or "Step Forward" to watch arguments dispatch.
                                </div>
                            )}
                        </div>
                    )}

                    {/* SCENARIO 3: Docstrings & __doc__ Introspection */}
                    {selectedExample === 2 && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                                        <BookOpen className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Function Introspection &amp; Docstring Attribute
                                    </h3>
                                </div>
                            </div>

                            {/* Object Inspection Card */}
                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 font-mono text-xs space-y-3">
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                    Function Object in Memory: area
                                </div>
                                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                                    <div><span className="text-purple-400">__name__:</span> "area"</div>
                                    <div><span className="text-blue-400">__annotations__:</span> {`{}`}</div>
                                    <div>
                                        <span className="text-emerald-400">__doc__:</span>{" "}
                                        <span className="text-amber-200">
                                            "Calculate the area of a rectangle."
                                        </span>
                                    </div>
                                </div>
                                <div className="text-[11px] text-slate-400 font-sans">
                                    Python attaches triple-quoted docstrings immediately into the <code className="text-emerald-300 font-mono font-bold">.__doc__</code> property, powering automated documentation, IDE tooltips, and <code className="text-blue-300 font-mono">help()</code>.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Built-in Function Toolkit Quick Reference */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                            <span>Python Built-in Toolkit Reference</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {BUILTINS.map(b => (
                                <div key={b.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <div className="font-mono font-bold text-xs text-blue-700">{b.name}()</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">{b.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
