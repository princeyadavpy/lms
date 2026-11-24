import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    AlertOctagon, AlertTriangle, Bug, CheckCircle2,
    Sparkles, ArrowRight, XCircle, ShieldAlert, Cpu, Terminal
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 1: Error Classification & Exceptions
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'syntax-error',
        label: 'Compile-Time (Syntax) Error',
        code: `# Compile-Time Error: Syntax violation caught before running
print("Step 1: Parsing script...")
if 5 > 2   # Missing colon ':'
    print("Five is greater than two")
print("Step 2: Complete")`,
        steps: [
            {
                lineNum: 1,
                action: 'source_read',
                detail: 'Python Lexer reads raw source characters',
                phase: 'lexing',
                parserStatus: 'scanning',
                pvmStatus: 'halted',
                explanation: 'Before executing any code, Python scans and tokenizes the source file to build an Abstract Syntax Tree (AST).',
                variables: {},
                outputs: []
            },
            {
                lineNum: 3,
                action: 'syntax_violation',
                detail: 'SyntaxError: expected \':\' at end of if-statement',
                phase: 'parsing',
                parserStatus: 'failed',
                pvmStatus: 'never_started',
                explanation: 'Python grammar parser detects missing colon \':\'. Compilation aborts instantly! Line 2 never even executed.',
                error: 'SyntaxError: expected \':\'',
                variables: {},
                outputs: ['SyntaxError: expected \':\' on line 3']
            }
        ]
    },
    {
        id: 'runtime-exception',
        label: 'Runtime Error (Exception)',
        code: `# Runtime Error: Valid grammar, crashes during execution
a = 100
b = 0
print("Before division")
result = a / b  # Exception triggered at runtime!
print("After division:", result)`,
        steps: [
            {
                lineNum: 2,
                action: 'assign_a',
                detail: 'a = 100 allocated in memory',
                phase: 'execution',
                parserStatus: 'passed',
                pvmStatus: 'running',
                explanation: 'Grammar was 100% valid, so Python compiled bytecode and started the Python Virtual Machine (PVM). a = 100 is created.',
                variables: { a: 100 },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'assign_b',
                detail: 'b = 0 allocated in memory',
                phase: 'execution',
                parserStatus: 'passed',
                pvmStatus: 'running',
                explanation: 'b = 0 is allocated in local frame memory.',
                variables: { a: 100, b: 0 },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'print_before',
                detail: 'print("Before division") executed successfully',
                phase: 'execution',
                parserStatus: 'passed',
                pvmStatus: 'running',
                explanation: 'Standard I/O output stream writes message to console.',
                variables: { a: 100, b: 0 },
                outputs: ['Before division']
            },
            {
                lineNum: 5,
                action: 'runtime_crash',
                detail: 'result = a / b raises ZeroDivisionError!',
                phase: 'exception_unhandled',
                parserStatus: 'passed',
                pvmStatus: 'crashed',
                error: 'ZeroDivisionError: division by zero',
                explanation: 'Mathematical operation 100 / 0 is illegal. CPU ALU signals fault. Python halts execution and unwinds stack.',
                variables: { a: 100, b: 0 },
                outputs: ['Before division', 'ZeroDivisionError: division by zero']
            }
        ]
    },
    {
        id: 'logical-error',
        label: 'Logical Error (Silent Bug)',
        code: `# Logical Error: 0 crashes, but calculation is wrong!
math_score = 90
sci_score = 80

# Bug: Operator precedence! Did 90 + (80 / 2) = 130 instead of 85!
average = math_score + sci_score / 2
print("Calculated Average:", average)`,
        steps: [
            {
                lineNum: 2,
                action: 'assign_math',
                detail: 'math_score = 90',
                phase: 'execution',
                parserStatus: 'passed',
                pvmStatus: 'running',
                explanation: 'math_score initialized with 90.',
                variables: { math_score: 90 },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'assign_sci',
                detail: 'sci_score = 80',
                phase: 'execution',
                parserStatus: 'passed',
                pvmStatus: 'running',
                explanation: 'sci_score initialized with 80.',
                variables: { math_score: 90, sci_score: 80 },
                outputs: []
            },
            {
                lineNum: 6,
                action: 'compute_flawed',
                detail: 'average = 90 + 80 / 2 → 90 + 40.0 = 130.0',
                phase: 'logic_flaw',
                parserStatus: 'passed',
                pvmStatus: 'running',
                explanation: 'Due to operator precedence, division executes before addition. Result is 130.0 instead of (90+80)/2 = 85.0.',
                variables: { math_score: 90, sci_score: 80, average: 130.0 },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'print_output',
                detail: 'print("Calculated Average:", 130.0) — Exit Code 0',
                phase: 'logic_flaw',
                parserStatus: 'passed',
                pvmStatus: 'finished_with_bug',
                explanation: 'Program finished with zero errors or crashes, but business data is completely corrupted!',
                variables: { math_score: 90, sci_score: 80, average: 130.0 },
                outputs: ['Calculated Average: 130.0']
            }
        ]
    }
];

export default function ErrorClassificationVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                            <AlertOctagon className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Error Classification &amp; Exceptions
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
                                        ? 'bg-rose-600 text-white shadow-xs'
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
                        badgeText="Error Analyzer"
                        fileName="error_classes.py"
                        accentColor="#e11d48"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Tri-Chamber Diagnostic Stage */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {/* Diagnostic Pipeline Ribbon */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Python Execution Lifecycle
                            </span>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                                Lifecycle Stages
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                            <div className={`p-2 rounded-xl border transition-all ${
                                selectedExample === 0
                                    ? currentStepData?.parserStatus === 'failed'
                                        ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-md'
                                        : 'bg-rose-50 text-rose-900 border-rose-300 font-bold'
                                    : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                                1. Parser (Syntax)
                            </div>
                            <div className={`p-2 rounded-xl border transition-all ${
                                selectedExample === 1
                                    ? currentStepData?.pvmStatus === 'crashed'
                                        ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-md'
                                        : 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                                    : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                                2. Runtime (PVM)
                            </div>
                            <div className={`p-2 rounded-xl border transition-all ${
                                selectedExample === 2
                                    ? 'bg-purple-50 text-purple-900 border-purple-300 font-bold'
                                    : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                                3. Logic (Semantics)
                            </div>
                        </div>
                    </div>

                    {/* DEDICATED DIAGNOSTIC BOX PER PRESET */}
                    {selectedExample === 0 && (
                        /* ======================================================== */
                        /* PRESET 1: COMPILE-TIME / SYNTAX ERROR PARSER BLOCK       */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Compile-Time Grammar Parser Box
                                    </h3>
                                </div>
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                                    Pre-Runtime Rejection
                                </span>
                            </div>

                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white space-y-3 font-mono text-xs">
                                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                    <span>TOKENIZER SCANNER</span>
                                    <span>LINE 3 DETECTED</span>
                                </div>
                                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                                    <span className="text-rose-300">if 5 &gt; 2</span>
                                    <span className="text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 font-bold text-[10px]">
                                        MISSING &apos;:&apos; DELIMITER!
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                                    <AlertOctagon className="w-4 h-4 text-rose-600" />
                                    <span>CRITICAL TAKEAWAY: Zero Execution Occurred</span>
                                </div>
                                <p className="text-xs text-rose-800 leading-relaxed">
                                    Python rejects the program <strong>before running line 1</strong>. The code is never converted to bytecode, the virtual machine never boots up, and no memory or variables are ever created.
                                </p>
                            </div>
                        </div>
                    )}

                    {selectedExample === 1 && (
                        /* ======================================================== */
                        /* PRESET 2: RUNTIME ERROR / EXCEPTION UNWINDING BOX        */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Runtime Engine &amp; Exception Capsule Ejection
                                    </h3>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.pvmStatus === 'crashed'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                    {currentStepData?.pvmStatus === 'crashed' ? 'CRASHED' : 'EXECUTING'}
                                </span>
                            </div>

                            {/* Active Variables in Memory Pod */}
                            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="text-[10px] text-slate-400">VARIABLE: a</div>
                                    <div className="font-bold text-slate-800 text-base">100</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="text-[10px] text-slate-400">VARIABLE: b</div>
                                    <div className="font-bold text-slate-800 text-base">0</div>
                                </div>
                            </div>

                            {/* Exception Object Ejection Box */}
                            {currentStepData?.pvmStatus === 'crashed' ? (
                                <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-xl space-y-2 animate-bounce">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-bold text-rose-800 text-xs font-mono">
                                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                                            <span>EXCEPTION OBJECT EJECTED: ZeroDivisionError</span>
                                        </div>
                                        <span className="text-[9px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-mono font-bold">
                                            Heap 0xef42
                                        </span>
                                    </div>
                                    <p className="text-xs text-rose-700 leading-relaxed">
                                        Python grammar was fine. But at runtime, dividing by zero is mathematically undefined. Because there was no <code className="font-mono bg-rose-100 px-1 rounded font-bold">try-except</code> block, the exception crashed the entire application!
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                                    PVM running line-by-line until hazardous operation is encountered...
                                </div>
                            )}
                        </div>
                    )}

                    {selectedExample === 2 && (
                        /* ======================================================== */
                        /* PRESET 3: LOGICAL ERROR / SEMANTIC BUG AUDIT BOX         */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Bug className="w-4 h-4 text-purple-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Semantic Auditor: The &quot;Silent Killer&quot;
                                    </h3>
                                </div>
                                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                    Exit Code 0 (No Crash)
                                </span>
                            </div>

                            {/* Expected vs Actual Comparison Box */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1">
                                    <div className="text-[10px] font-bold text-emerald-800 uppercase">Intended Formula</div>
                                    <div className="font-mono text-xs font-bold text-emerald-900">(90 + 80) / 2</div>
                                    <div className="text-sm font-bold text-emerald-700">= 85.0 (Correct)</div>
                                </div>
                                <div className="p-3 bg-rose-50 rounded-xl border border-rose-300 space-y-1">
                                    <div className="text-[10px] font-bold text-rose-800 uppercase">Written Formula</div>
                                    <div className="font-mono text-xs font-bold text-rose-900">90 + (80 / 2)</div>
                                    <div className="text-sm font-bold text-rose-700">= 130.0 (Buggy!)</div>
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                    <span>Why Logical Errors are the Most Dangerous:</span>
                                </div>
                                <p className="text-xs text-purple-800 leading-relaxed">
                                    Neither the Python parser nor the runtime throws any alert or traceback! The program appears to succeed, but delivers corrupted numbers to users or databases. Only unit tests and careful code review catch these bugs.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

