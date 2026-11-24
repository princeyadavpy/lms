import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Shield, ShieldAlert, ShieldCheck, CheckCircle2,
    Sparkles, ArrowRight, RefreshCw, Box, Lock, Check,
    AlertTriangle, Zap, RotateCcw
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 2: Handling with try, except, else & finally
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'success-path',
        label: 'Clean Run (try → else → finally)',
        code: `try:
    num = 5
    result = 100 / num
    print("Computed:", result)
except ZeroDivisionError:
    print("Handled: Division by zero")
except ValueError:
    print("Handled: Invalid value")
else:
    print("Success: else block ran (0 errors!)")
finally:
    print("Cleanup: finally block ALWAYS runs")`,
        steps: [
            {
                lineNum: 1,
                action: 'enter_try',
                detail: 'Enters try: Hazard protection zone activated',
                activeBlock: 'try',
                tryState: 'active',
                exceptState: 'bypassed',
                elseState: 'pending',
                finallyState: 'pending',
                explanation: 'Execution enters the protected try block. Python arms exception interceptors for ZeroDivisionError and ValueError.',
                variables: {},
                outputs: []
            },
            {
                lineNum: 2,
                action: 'assign_num',
                detail: 'num = 5 assigned',
                activeBlock: 'try',
                tryState: 'active',
                exceptState: 'bypassed',
                elseState: 'pending',
                finallyState: 'pending',
                explanation: 'Variable num set to 5 inside try block.',
                variables: { num: 5 },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'compute_div',
                detail: 'result = 100 / 5 = 20.0 (Valid division)',
                activeBlock: 'try',
                tryState: 'active',
                exceptState: 'bypassed',
                elseState: 'pending',
                finallyState: 'pending',
                explanation: '100 / 5 divides cleanly. No exception is generated.',
                variables: { num: 5, result: 20.0 },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'print_computed',
                detail: 'print("Computed:", 20.0)',
                activeBlock: 'try',
                tryState: 'completed_clean',
                exceptState: 'bypassed',
                elseState: 'pending',
                finallyState: 'pending',
                explanation: 'try block finishes with ZERO exceptions raised!',
                variables: { num: 5, result: 20.0 },
                outputs: ['Computed: 20.0']
            },
            {
                lineNum: 9,
                action: 'enter_else',
                detail: 'else: UNLOCKED! (Runs because try completed with 0 errors)',
                activeBlock: 'else',
                tryState: 'completed_clean',
                exceptState: 'bypassed',
                elseState: 'active',
                finallyState: 'pending',
                explanation: 'The else block ONLY executes when the try block succeeds without any exceptions.',
                variables: { num: 5, result: 20.0 },
                outputs: ['Computed: 20.0']
            },
            {
                lineNum: 10,
                action: 'print_else',
                detail: 'print("Success: else block ran (0 errors!)")',
                activeBlock: 'else',
                tryState: 'completed_clean',
                exceptState: 'bypassed',
                elseState: 'done',
                finallyState: 'pending',
                explanation: 'Confirms that else block ran successfully.',
                variables: { num: 5, result: 20.0 },
                outputs: ['Computed: 20.0', 'Success: else block ran (0 errors!)']
            },
            {
                lineNum: 11,
                action: 'enter_finally',
                detail: 'finally: GUARANTEED CLEANUP AIRLOCK ACTIVATED',
                activeBlock: 'finally',
                tryState: 'completed_clean',
                exceptState: 'bypassed',
                elseState: 'done',
                finallyState: 'active',
                explanation: 'The finally block executes unconditionally for resource cleanup (closing sockets, files, database connections).',
                variables: { num: 5, result: 20.0 },
                outputs: ['Computed: 20.0', 'Success: else block ran (0 errors!)']
            },
            {
                lineNum: 12,
                action: 'print_finally',
                detail: 'print("Cleanup: finally block ALWAYS runs")',
                activeBlock: 'finally',
                tryState: 'completed_clean',
                exceptState: 'bypassed',
                elseState: 'done',
                finallyState: 'done',
                explanation: 'Clean completion of entire try-except-else-finally pipeline!',
                variables: { num: 5, result: 20.0 },
                outputs: ['Computed: 20.0', 'Success: else block ran (0 errors!)', 'Cleanup: finally block ALWAYS runs']
            }
        ]
    },
    {
        id: 'zerodiv-caught',
        label: 'Caught ZeroDivisionError (try → except → finally)',
        code: `try:
    num = 0
    result = 100 / num  # Triggers ZeroDivisionError!
    print("Computed:", result)
except ZeroDivisionError:
    print("Caught: ZeroDivisionError safely neutralized!")
else:
    print("Success: else block ran")
finally:
    print("Cleanup: finally block runs even after exception!")`,
        steps: [
            {
                lineNum: 1,
                action: 'enter_try',
                detail: 'Enters try: Safety net armed',
                activeBlock: 'try',
                tryState: 'active',
                exceptState: 'waiting',
                elseState: 'locked',
                finallyState: 'pending',
                explanation: 'Protected zone initialized.',
                variables: {},
                outputs: []
            },
            {
                lineNum: 2,
                action: 'assign_zero',
                detail: 'num = 0 assigned',
                activeBlock: 'try',
                tryState: 'active',
                exceptState: 'waiting',
                elseState: 'locked',
                finallyState: 'pending',
                explanation: 'num set to 0.',
                variables: { num: 0 },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'trigger_error',
                detail: '100 / 0 raises ZeroDivisionError inside try block!',
                activeBlock: 'try',
                tryState: 'exception_thrown',
                exceptState: 'intercepting',
                elseState: 'locked',
                finallyState: 'pending',
                explanation: 'An exception erupts! Execution immediately jumps out of try block without running line 4.',
                variables: { num: 0 },
                outputs: []
            },
            {
                lineNum: 5,
                action: 'enter_except',
                detail: 'except ZeroDivisionError matches exception type! Intercepted ✓',
                activeBlock: 'except',
                tryState: 'exception_thrown',
                exceptState: 'caught',
                elseState: 'locked',
                finallyState: 'pending',
                explanation: 'The exception is successfully caught and neutralized. Program crash prevented!',
                variables: { num: 0 },
                outputs: []
            },
            {
                lineNum: 6,
                action: 'print_caught',
                detail: 'print("Caught: ZeroDivisionError safely neutralized!")',
                activeBlock: 'except',
                tryState: 'exception_thrown',
                exceptState: 'done',
                elseState: 'locked',
                finallyState: 'pending',
                explanation: 'Except recovery code executes.',
                variables: { num: 0 },
                outputs: ['Caught: ZeroDivisionError safely neutralized!']
            },
            {
                lineNum: 9,
                action: 'enter_finally',
                detail: 'finally: Titanium box activates (else was skipped because try failed)',
                activeBlock: 'finally',
                tryState: 'exception_thrown',
                exceptState: 'done',
                elseState: 'locked',
                finallyState: 'active',
                explanation: 'Notice the else block was bypassed completely. But finally ALWAYS runs!',
                variables: { num: 0 },
                outputs: ['Caught: ZeroDivisionError safely neutralized!']
            },
            {
                lineNum: 10,
                action: 'print_finally',
                detail: 'print("Cleanup: finally block runs even after exception!")',
                activeBlock: 'finally',
                tryState: 'exception_thrown',
                exceptState: 'done',
                elseState: 'locked',
                finallyState: 'done',
                explanation: 'Guaranteed cleanup completed smoothly.',
                variables: { num: 0 },
                outputs: ['Caught: ZeroDivisionError safely neutralized!', 'Cleanup: finally block runs even after exception!']
            }
        ]
    }
];

export default function TryExceptElseFinallyVisualizer() {
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

    // Dynamic Reactive Detection: if user edits code to num = 0, switch to exception steps
    useEffect(() => {
        const numMatch = code.match(/num\s*=\s*(\d+)/);
        if (numMatch && numMatch[1] === '0') {
            if (selectedExample !== 1) {
                setSelectedExample(1);
                setSteps(EXAMPLES[1].steps);
            }
        } else if (numMatch && numMatch[1] !== '0') {
            if (selectedExample !== 0) {
                setSelectedExample(0);
                setSteps(EXAMPLES[0].steps);
            }
        }
    }, [code, selectedExample]);

    const handleSetNum = (val) => {
        const updated = code.replace(/num\s*=\s*\d+/, `num = ${val}`);
        setCode(updated);
        resetExecution();
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
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Handling with try, except, else &amp; finally
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
                                        ? 'bg-amber-600 text-white shadow-xs'
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
                        badgeText="Try-Catch Pipeline"
                        fileName="exception_handling.py"
                        accentColor="#d97706"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: 4-Chamber Interconnected Safety System */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-amber-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    The 4-Chamber Exception Architecture
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                                Active: {currentStepData?.activeBlock ? currentStepData.activeBlock.toUpperCase() : 'STANDBY'}
                            </span>
                        </div>

                        {/* Interactive Value Presets */}
                        <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
                            <span className="text-slate-400 font-medium">Quick Values:</span>
                            <button
                                type="button"
                                onClick={() => handleSetNum(5)}
                                className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-mono cursor-pointer transition-colors ${
                                    code.includes('num = 5')
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                num = 5 (Clean Flow)
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSetNum(0)}
                                className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-mono cursor-pointer transition-colors ${
                                    code.includes('num = 0')
                                        ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                num = 0 (ZeroDivisionError)
                            </button>
                        </div>

                        {/* CHAMBER 1: TRY (Hazardous Zone) */}
                        <div className={`p-4 rounded-xl border-2 transition-all ${
                            currentStepData?.activeBlock === 'try'
                                ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-200'
                                : currentStepData?.tryState === 'completed_clean'
                                ? 'bg-emerald-50/50 border-emerald-300'
                                : currentStepData?.tryState === 'exception_thrown'
                                ? 'bg-rose-50/50 border-rose-300'
                                : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                    <span className="font-mono font-bold text-xs text-amber-950">
                                        CHAMBER 1: try (Airbag Protected Zone)
                                    </span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.tryState === 'completed_clean'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : currentStepData?.tryState === 'exception_thrown'
                                        ? 'bg-rose-100 text-rose-800'
                                        : currentStepData?.activeBlock === 'try'
                                        ? 'bg-amber-200 text-amber-900 animate-pulse'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {currentStepData?.tryState === 'completed_clean' ? 'Passed with 0 Errors ✓' : currentStepData?.tryState === 'exception_thrown' ? 'Exception Triggered ⚡' : 'Protected'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Put dangerous or unpredictable operations here (file I/O, network requests, math divisions, user conversions).
                            </p>
                        </div>

                        {/* CHAMBER 2: EXCEPT (Interceptor Rescue Net) */}
                        <div className={`p-4 rounded-xl border-2 transition-all ${
                            currentStepData?.activeBlock === 'except'
                                ? 'bg-rose-50/90 border-rose-500 shadow-md ring-2 ring-rose-200'
                                : currentStepData?.exceptState === 'bypassed'
                                ? 'bg-slate-50 border-slate-200 opacity-60'
                                : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                                    <span className="font-mono font-bold text-xs text-rose-950">
                                        CHAMBER 2: except (Crash Interceptor Net)
                                    </span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.activeBlock === 'except'
                                        ? 'bg-rose-200 text-rose-900 animate-pulse'
                                        : currentStepData?.exceptState === 'bypassed'
                                        ? 'bg-slate-200 text-slate-500'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {currentStepData?.activeBlock === 'except' ? 'INTERCEPTING CRASH' : currentStepData?.exceptState === 'bypassed' ? 'Bypassed (No Errors)' : 'Armed'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Catches specific exception types. Neutralizes the error so your program keeps running gracefully instead of crashing.
                            </p>
                        </div>

                        {/* CHAMBER 3: ELSE (Success VIP Lounge) */}
                        <div className={`p-4 rounded-xl border-2 transition-all ${
                            currentStepData?.activeBlock === 'else'
                                ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                                : currentStepData?.elseState === 'locked'
                                ? 'bg-slate-100 border-slate-200 opacity-50'
                                : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    <span className="font-mono font-bold text-xs text-emerald-950">
                                        CHAMBER 3: else (Success VIP Lounge)
                                    </span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.activeBlock === 'else'
                                        ? 'bg-emerald-200 text-emerald-900 animate-pulse'
                                        : currentStepData?.elseState === 'locked'
                                        ? 'bg-rose-100 text-rose-700'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {currentStepData?.elseState === 'locked' ? 'Locked (try had errors)' : currentStepData?.activeBlock === 'else' ? 'UNLOCKED & RUNNING' : 'Waiting for clean try'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Executes <strong>only</strong> if the try block completed cleanly without throwing any exceptions.
                            </p>
                        </div>

                        {/* CHAMBER 4: FINALLY (Titanium Cleanup Lockbox) */}
                        <div className={`p-4 rounded-xl border-2 transition-all ${
                            currentStepData?.activeBlock === 'finally'
                                ? 'bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-200'
                                : 'bg-slate-900 border-slate-800 text-white'
                        }`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <Lock className={`w-3.5 h-3.5 ${currentStepData?.activeBlock === 'finally' ? 'text-indigo-600' : 'text-amber-400'}`} />
                                    <span className={`font-mono font-bold text-xs ${currentStepData?.activeBlock === 'finally' ? 'text-indigo-950' : 'text-slate-100'}`}>
                                        CHAMBER 4: finally (Guaranteed Cleanup Lockbox)
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded">
                                    ALWAYS EXECUTES
                                </span>
                            </div>
                            <p className={`text-xs leading-relaxed ${currentStepData?.activeBlock === 'finally' ? 'text-slate-700' : 'text-slate-300'}`}>
                                Executes unconditionally! Whether an exception occurred or not, or even if a return statement was executed, <code className="font-mono bg-slate-800 text-amber-300 px-1 rounded">finally</code> guarantees critical resources (files, sockets, database handles) are properly closed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

