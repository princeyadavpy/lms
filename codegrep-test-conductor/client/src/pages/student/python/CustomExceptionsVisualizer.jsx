import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Flame, Sparkles, CheckCircle2, AlertTriangle, ArrowUp,
    ShieldAlert, Box, Database, Check, DollarSign, Layers,
    CreditCard, UserCheck, Shield
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 4: Raising & User-Defined Exceptions
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'custom-bank-error',
        label: 'Custom Exception: InsufficientFundsError',
        code: `class InsufficientFundsError(Exception):
    def __init__(self, balance, required):
        super().__init__(f"Balance {balance} < required {required}")
        self.balance = balance
        self.required = required

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return balance - amount

try:
    withdraw(balance=100, amount=500)
except InsufficientFundsError as err:
    print("Transaction Blocked:", err)
    print("Shortfall:", err.required - err.balance)`,
        steps: [
            {
                lineNum: 1,
                action: 'define_custom_class',
                detail: 'class InsufficientFundsError(Exception) defined',
                status: 'class_defined',
                launcherState: 'idle',
                customPayload: null,
                explanation: 'User-defined exception class inherits from Exception. Custom __init__ attaches domain attributes balance and required.',
                variables: { InsufficientFundsError: '<class InsufficientFundsError>' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'define_withdraw',
                detail: 'withdraw(balance, amount) registered',
                status: 'func_defined',
                launcherState: 'idle',
                customPayload: null,
                explanation: 'Function contains business logic condition: if amount > balance, deliberately raise custom error.',
                variables: { withdraw: '<function withdraw>' },
                outputs: []
            },
            {
                lineNum: 13,
                action: 'call_withdraw',
                detail: 'withdraw(balance=100, amount=500) invoked in try block',
                status: 'in_call',
                launcherState: 'checking',
                customPayload: null,
                explanation: 'Enters protected try block. Calls withdraw(100, 500).',
                variables: { balance: 100, amount: 500 },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'check_guard',
                detail: 'Guard check: if 500 > 100 → True! Condition violated',
                status: 'guard_failed',
                launcherState: 'primed',
                customPayload: null,
                explanation: 'Withdrawal amount ($500) exceeds current balance ($100). Condition triggers raise statement.',
                variables: { balance: 100, amount: 500 },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'raise_exception',
                detail: 'raise InsufficientFundsError(100, 500) — EJECTED!',
                status: 'raised',
                launcherState: 'ejected',
                customPayload: { balance: 100, required: 500, deficit: 400 },
                explanation: 'A custom exception instance is instantiated and deliberately thrown up the call stack.',
                variables: { balance: 100, amount: 500 },
                outputs: []
            },
            {
                lineNum: 14,
                action: 'catch_custom',
                detail: 'except InsufficientFundsError as err: Caught cleanly!',
                status: 'caught',
                launcherState: 'neutralized',
                customPayload: { balance: 100, required: 500, deficit: 400 },
                explanation: 'Caller catches domain-specific error. Payload attributes err.balance and err.required are directly accessible.',
                variables: { err: '<InsufficientFundsError balance=100, required=500>' },
                outputs: ['Transaction Blocked: Balance 100 < required 500']
            },
            {
                lineNum: 16,
                action: 'inspect_attributes',
                detail: 'Read custom attributes: err.required - err.balance = 400',
                status: 'handled',
                launcherState: 'neutralized',
                customPayload: { balance: 100, required: 500, deficit: 400 },
                explanation: 'Application safely communicates exact deficit to user without crashing.',
                variables: { err: '<InsufficientFundsError>' },
                outputs: ['Transaction Blocked: Balance 100 < required 500', 'Shortfall: 400']
            }
        ]
    },
    {
        id: 'raise-builtin',
        label: 'Deliberate raise ValueError Guard',
        code: `def set_age(age):
    if age < 0 or age > 120:
        raise ValueError(f"Invalid human age: {age}")
    return age

try:
    set_age(-5)
except ValueError as err:
    print("Guard Triggered:", err)`,
        steps: [
            {
                lineNum: 1,
                action: 'define_func',
                detail: 'def set_age(age) with validation guard',
                status: 'func_defined',
                launcherState: 'idle',
                explanation: 'Input validation function guards against negative or unreasonable numbers.',
                variables: { set_age: '<function set_age>' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'call_func',
                detail: 'set_age(-5) called inside try block',
                status: 'in_call',
                launcherState: 'checking',
                explanation: 'Attempts to set age to -5.',
                variables: { age: -5 },
                outputs: []
            },
            {
                lineNum: 2,
                action: 'guard_check',
                detail: 'if -5 < 0: Guard fails!',
                status: 'guard_failed',
                launcherState: 'primed',
                explanation: 'Input violates domain integrity rules.',
                variables: { age: -5 },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'raise_builtin',
                detail: 'raise ValueError("Invalid human age: -5")',
                status: 'raised',
                launcherState: 'ejected',
                explanation: 'Python raises standard ValueError with informative message.',
                variables: { age: -5 },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'catch_builtin',
                detail: 'except ValueError caught cleanly',
                status: 'caught',
                launcherState: 'neutralized',
                explanation: 'Handled gracefully by caller.',
                variables: { err: 'Invalid human age: -5' },
                outputs: ['Guard Triggered: Invalid human age: -5']
            }
        ]
    }
];

export default function CustomExceptionsVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
                            <Flame className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Raising &amp; User-Defined Exceptions
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
                                        ? 'bg-orange-600 text-white shadow-xs'
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
                        badgeText="Raise Engine"
                        fileName="custom_exceptions.py"
                        accentColor="#ea580c"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Custom Exception Foundry & Launcher Stage */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {/* CUSTOM EXCEPTION FOUNDRY BOX */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-orange-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Custom Exception Foundry: class InsufficientFundsError(Exception)
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded">
                                Subclass of Exception
                            </span>
                        </div>

                        {/* Inheritance & Schema Blueprint */}
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-2">
                            <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                <span>INHERITANCE: Exception ➔ InsufficientFundsError</span>
                                <span>CUSTOM PAYLOAD ATTRIBUTES</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-orange-300">
                                    self.balance = balance
                                </div>
                                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-orange-300">
                                    self.required = required
                                </div>
                            </div>
                        </div>

                        {/* DELIBERATE EJECTION LAUNCHER BOX */}
                        <div className={`p-4 rounded-xl border-2 transition-all space-y-3 ${
                            currentStepData?.launcherState === 'ejected'
                                ? 'bg-rose-50/90 border-rose-500 shadow-lg shadow-rose-100 ring-2 ring-rose-200'
                                : currentStepData?.launcherState === 'neutralized'
                                ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                                : currentStepData?.launcherState === 'primed'
                                ? 'bg-amber-50/90 border-amber-500 animate-pulse'
                                : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-xs">
                                    <Flame className={`w-4 h-4 ${
                                        currentStepData?.launcherState === 'ejected' ? 'text-rose-600' : 'text-orange-500'
                                    }`} />
                                    <span className="text-slate-900">Deliberate Ejection Launcher (raise)</span>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.launcherState === 'ejected'
                                        ? 'bg-rose-200 text-rose-900 animate-bounce'
                                        : currentStepData?.launcherState === 'neutralized'
                                        ? 'bg-emerald-200 text-emerald-900'
                                        : currentStepData?.launcherState === 'primed'
                                        ? 'bg-amber-200 text-amber-900'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {currentStepData?.launcherState === 'ejected'
                                        ? 'EXCEPTION EJECTED 🚀'
                                        : currentStepData?.launcherState === 'neutralized'
                                        ? 'CAUGHT & MANAGED ✓'
                                        : currentStepData?.launcherState === 'primed'
                                        ? 'GUARD FAILED: PRIMED'
                                        : 'IDLE'}
                                </span>
                            </div>

                            {/* Payload Details */}
                            {currentStepData?.customPayload ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-center text-xs">
                                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                                        <div className="text-[10px] text-slate-400">BALANCE</div>
                                        <div className="font-bold text-slate-800">${currentStepData.customPayload.balance}</div>
                                    </div>
                                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                                        <div className="text-[10px] text-slate-400">REQUIRED</div>
                                        <div className="font-bold text-slate-800">${currentStepData.customPayload.required}</div>
                                    </div>
                                    <div className="p-2 bg-white rounded-lg border border-rose-300 bg-rose-50/50">
                                        <div className="text-[10px] text-rose-500 font-bold">DEFICIT</div>
                                        <div className="font-bold text-rose-700">${currentStepData.customPayload.deficit}</div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    The <code className="font-mono bg-white px-1 rounded font-bold text-orange-700">raise</code> statement allows developers to proactively halt invalid domain operations and pass rich context up to the error handling layer.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

