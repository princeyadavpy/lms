import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Lock, Unlock, ShieldAlert, ShieldCheck, Sparkles, CheckCircle2,
    AlertTriangle, RefreshCw, Box, Layers, ArrowRight, Zap, Flame
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 3: Thread Synchronization & Race Conditions
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'race-condition',
        label: 'Race Condition Trap (WITHOUT Lock)',
        code: `# UNSAFE: counter += 1 is NOT atomic!
# It compiles to 3 bytecode ops:
# 1. READ counter
# 2. ADD 1
# 3. WRITE counter
import threading

counter = 0

def unsafe_worker():
    global counter
    # Thread interleaves during read/write
    temp = counter
    # Context switch happens here!
    counter = temp + 1

t1 = threading.Thread(target=unsafe_worker)
t2 = threading.Thread(target=unsafe_worker)
t1.start(); t2.start()
t1.join(); t2.join()

print("Expected Counter: 2")
print("Actual Counter:  ", counter)  # Only 1 due to collision!`,
        steps: [
            {
                lineNum: 8,
                action: 'init_counter',
                detail: 'Shared memory allocated: counter = 0',
                lockState: 'none',
                t1Action: 'idle',
                t2Action: 'idle',
                counterVal: 0,
                isCollision: false,
                explanation: 'Both threads share the exact same global heap space.',
                variables: { counter: 0 },
                outputs: []
            },
            {
                lineNum: 13,
                action: 't1_read',
                detail: 'Thread 1 reads counter = 0 into its local register (temp=0)',
                lockState: 'none',
                t1Action: 'read_0',
                t2Action: 'idle',
                counterVal: 0,
                isCollision: false,
                explanation: 'Thread 1 loads counter value 0.',
                variables: { 'T1.temp': 0, counter: 0 },
                outputs: []
            },
            {
                lineNum: 13,
                action: 'context_switch_t2_read',
                detail: 'CONTEXT SWITCH! Thread 2 ALSO reads counter = 0 (before T1 writes!)',
                lockState: 'none',
                t1Action: 'read_0',
                t2Action: 'read_0',
                counterVal: 0,
                isCollision: true,
                explanation: 'CRITICAL RACE CONDITION: Thread 2 reads the stale value 0 because Thread 1 has not written yet!',
                variables: { 'T1.temp': 0, 'T2.temp': 0, counter: 0 },
                outputs: []
            },
            {
                lineNum: 15,
                action: 't1_write',
                detail: 'Thread 1 computes 0 + 1 and writes counter = 1',
                lockState: 'none',
                t1Action: 'write_1',
                t2Action: 'read_0',
                counterVal: 1,
                isCollision: true,
                explanation: 'Thread 1 finishes write.',
                variables: { counter: 1 },
                outputs: []
            },
            {
                lineNum: 15,
                action: 't2_write_overwrite',
                detail: 'Thread 2 computes 0 + 1 and writes counter = 1 (OVERWRITES T1!)',
                lockState: 'none',
                t1Action: 'done',
                t2Action: 'write_1',
                counterVal: 1,
                isCollision: true,
                explanation: 'LOST UPDATE GLITCH! Two separate threads incremented, but final counter is only 1 instead of 2!',
                variables: { counter: 1 },
                outputs: ['Expected Counter: 2', 'Actual Counter:   1']
            }
        ]
    },
    {
        id: 'with-lock-safe',
        label: 'Synchronized with threading.Lock()',
        code: `# SAFE: Mutex Lock ensures mutual exclusion
import threading

counter = 0
lock = threading.Lock()

def safe_worker():
    global counter
    # 'with lock:' acquires lock before entering,
    # and automatically releases when exiting!
    with lock:
        temp = counter
        counter = temp + 1

t1 = threading.Thread(target=safe_worker)
t2 = threading.Thread(target=safe_worker)
t1.start(); t2.start()
t1.join(); t2.join()

print("Expected Counter: 2")
print("Actual Counter:  ", counter)  # Perfectly 2!`,
        steps: [
            {
                lineNum: 5,
                action: 'init_lock',
                detail: 'Shared counter = 0 and threading.Lock() vault initialized',
                lockState: 'unlocked',
                t1Action: 'idle',
                t2Action: 'idle',
                counterVal: 0,
                isCollision: false,
                explanation: 'Mutex lock created to guard critical section.',
                variables: { counter: 0, lock: '<unlocked _thread.lock>' },
                outputs: []
            },
            {
                lineNum: 11,
                action: 't1_acquire_lock',
                detail: 'Thread 1 acquires Lock! Vault door locks: Thread 2 BLOCKED',
                lockState: 'locked_t1',
                t1Action: 'inside_vault',
                t2Action: 'waiting_at_gate',
                counterVal: 0,
                isCollision: false,
                explanation: 'Thread 1 enters the critical section exclusively. Thread 2 is forced to wait in the waiting room.',
                variables: { lock: '<locked by Thread-1>', counter: 0 },
                outputs: []
            },
            {
                lineNum: 13,
                action: 't1_increment_and_release',
                detail: 'Thread 1 writes counter = 1 and RELEASES Lock!',
                lockState: 'unlocked',
                t1Action: 'done',
                t2Action: 'waiting_at_gate',
                counterVal: 1,
                isCollision: false,
                explanation: 'Thread 1 increments counter to 1 and releases the lock cleanly.',
                variables: { counter: 1, lock: '<unlocked>' },
                outputs: []
            },
            {
                lineNum: 11,
                action: 't2_acquire_lock',
                detail: 'Thread 2 acquires Lock! Reads fresh counter = 1',
                lockState: 'locked_t2',
                t1Action: 'done',
                t2Action: 'inside_vault',
                counterVal: 1,
                isCollision: false,
                explanation: 'Thread 2 enters critical section, reads fresh value 1, and prepares to write 2.',
                variables: { lock: '<locked by Thread-2>', counter: 1 },
                outputs: []
            },
            {
                lineNum: 13,
                action: 't2_write_complete',
                detail: 'Thread 2 writes counter = 2! 100% Data Integrity preserved ✓',
                lockState: 'unlocked',
                t1Action: 'done',
                t2Action: 'done',
                counterVal: 2,
                isCollision: false,
                explanation: 'Both increments registered accurately. Counter is 2!',
                variables: { counter: 2, lock: '<unlocked>' },
                outputs: ['Expected Counter: 2', 'Actual Counter:   2']
            }
        ]
    }
];

export default function ThreadSynchronizationVisualizer() {
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
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Thread Synchronization &amp; Race Conditions
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
                        badgeText="Mutex Engine"
                        fileName="race_condition_locks.py"
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

                {/* Right Column: Visual Box Diagrams */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {/* CRITICAL SECTION / SHARED MEMORY POD */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                {selectedExample === 0 ? (
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                ) : (
                                    <Lock className="w-4 h-4 text-emerald-600" />
                                )}
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    {selectedExample === 0 ? 'Unprotected Critical Section' : 'threading.Lock() Protected Vault'}
                                </h3>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                currentStepData?.isCollision
                                    ? 'bg-rose-100 text-rose-800 animate-bounce'
                                    : currentStepData?.lockState === 'unlocked'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-600'
                            }`}>
                                {currentStepData?.isCollision ? 'COLLISION DETECTED!' : currentStepData?.lockState === 'locked_t1' ? 'LOCKED BY T1' : currentStepData?.lockState === 'locked_t2' ? 'LOCKED BY T2' : 'UNLOCKED'}
                            </span>
                        </div>

                        {/* Central Counter Display Box */}
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono flex items-center justify-between">
                            <div>
                                <div className="text-[10px] text-slate-400">SHARED HEAP VARIABLE</div>
                                <div className="text-sm font-bold text-slate-200">counter</div>
                            </div>
                            <div className="text-3xl font-bold text-emerald-400">
                                {currentStepData?.counterVal ?? 0}
                            </div>
                        </div>

                        {/* WORKER ACTIONS COMPARISON BOX */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                            <div className={`p-3 rounded-xl border-2 space-y-1 transition-all ${
                                currentStepData?.t1Action === 'inside_vault' || currentStepData?.t1Action === 'write_1'
                                    ? 'bg-blue-50 border-blue-500'
                                    : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="font-bold text-blue-900">Thread 1 Action:</div>
                                <div className="text-slate-600 font-medium">
                                    {currentStepData?.t1Action === 'read_0' && 'Read temp=0'}
                                    {currentStepData?.t1Action === 'write_1' && 'Write counter=1'}
                                    {currentStepData?.t1Action === 'inside_vault' && 'Inside Vault (Locked)'}
                                    {currentStepData?.t1Action === 'done' && 'Finished ✓'}
                                    {(!currentStepData?.t1Action || currentStepData?.t1Action === 'idle') && 'Standby'}
                                </div>
                            </div>

                            <div className={`p-3 rounded-xl border-2 space-y-1 transition-all ${
                                currentStepData?.t2Action === 'inside_vault' || currentStepData?.t2Action === 'write_1'
                                    ? 'bg-indigo-50 border-indigo-500'
                                    : currentStepData?.t2Action === 'waiting_at_gate'
                                    ? 'bg-amber-50 border-amber-400 animate-pulse'
                                    : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="font-bold text-indigo-900">Thread 2 Action:</div>
                                <div className="text-slate-600 font-medium">
                                    {currentStepData?.t2Action === 'read_0' && 'Read stale temp=0! (Race)'}
                                    {currentStepData?.t2Action === 'write_1' && 'Overwrite counter=1!'}
                                    {currentStepData?.t2Action === 'waiting_at_gate' && 'Blocked at Lock Gate ⏳'}
                                    {currentStepData?.t2Action === 'inside_vault' && 'Inside Vault (Locked)'}
                                    {currentStepData?.t2Action === 'done' && 'Finished ✓'}
                                    {(!currentStepData?.t2Action || currentStepData?.t2Action === 'idle') && 'Standby'}
                                </div>
                            </div>
                        </div>

                        {/* OUTCOME ANALYSIS BOX */}
                        {selectedExample === 0 ? (
                            <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-1.5 text-xs text-rose-900">
                                <div className="flex items-center gap-2 font-bold text-rose-700">
                                    <ShieldAlert className="w-4 h-4" />
                                    <span>Why Did the Race Condition Happen?</span>
                                </div>
                                <p className="leading-relaxed">
                                    In Python, <code className="font-mono bg-rose-100 px-1 rounded font-bold">counter += 1</code> is not atomic. It requires 3 separate CPU operations: read, add, write. Without a lock, Thread 2 reads before Thread 1 writes, causing one increment to be completely erased!
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1.5 text-xs text-emerald-900">
                                <div className="flex items-center gap-2 font-bold text-emerald-700">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Mutual Exclusion Guaranteed</span>
                                </div>
                                <p className="leading-relaxed">
                                    Using <code className="font-mono bg-emerald-100 px-1 rounded font-bold">with lock:</code> forces mutual exclusion. Only one thread can enter the vault at a time, eliminating lost updates completely.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

