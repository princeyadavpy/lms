import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Ghost, AlertOctagon, Sparkles, CheckCircle2, ArrowRight,
    Lock, ShieldAlert, RefreshCw, Box, Layers, Zap, Skull
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 5: Deadlocks & Daemon Threads
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'deadlock-trap',
        label: 'The Deadlock Circular Wait Impasse',
        code: `# DEADLOCK: Circular Lock Dependency!
# Thread 1: Acquires Lock A, waits for Lock B
# Thread 2: Acquires Lock B, waits for Lock A
import threading
import time

lock_A = threading.Lock()
lock_B = threading.Lock()

def task1():
    with lock_A:
        time.sleep(0.1)
        with lock_B:  # WAITING FOREVER!
            print("Task 1 finished")

def task2():
    with lock_B:
        time.sleep(0.1)
        with lock_A:  # WAITING FOREVER!
            print("Task 2 finished")

t1 = threading.Thread(target=task1)
t2 = threading.Thread(target=task2)
t1.start(); t2.start()`,
        steps: [
            {
                lineNum: 7,
                action: 'init_locks',
                detail: 'lock_A and lock_B mutex locks initialized',
                deadlockState: 'idle',
                t1Has: null,
                t1Wants: null,
                t2Has: null,
                t2Wants: null,
                explanation: 'Two independent locks created in memory.',
                variables: { lock_A: '<unlocked>', lock_B: '<unlocked>' },
                outputs: []
            },
            {
                lineNum: 11,
                action: 't1_holds_A',
                detail: 'Thread 1 acquires lock_A',
                deadlockState: 'partial',
                t1Has: 'Lock A',
                t1Wants: null,
                t2Has: null,
                t2Wants: null,
                explanation: 'Thread 1 enters its outer critical section.',
                variables: { lock_A: '<locked by T1>' },
                outputs: []
            },
            {
                lineNum: 18,
                action: 't2_holds_B',
                detail: 'Thread 2 acquires lock_B',
                deadlockState: 'partial',
                t1Has: 'Lock A',
                t1Wants: null,
                t2Has: 'Lock B',
                t2Wants: null,
                explanation: 'Thread 2 enters its outer critical section.',
                variables: { lock_A: '<locked by T1>', lock_B: '<locked by T2>' },
                outputs: []
            },
            {
                lineNum: 13,
                action: 'circular_impasse',
                detail: 'CIRCULAR DEADLOCK! T1 waits for Lock B, T2 waits for Lock A',
                deadlockState: 'deadlocked',
                t1Has: 'Lock A',
                t1Wants: 'Lock B',
                t2Has: 'Lock B',
                t2Wants: 'Lock A',
                explanation: 'Neither thread can proceed. Both are frozen indefinitely until the process is killed.',
                variables: { lock_A: '<locked by T1>', lock_B: '<locked by T2>' },
                outputs: ['DEADLOCK: Process frozen in circular wait!']
            }
        ]
    },
    {
        id: 'daemon-thread',
        label: 'Daemon Thread (Abrupt Exit Behavior)',
        code: `import threading
import time

def background_heartbeat():
    while True:
        print("Pulse...")
        time.sleep(1)

# daemon=True: Thread dies instantly when MainThread exits!
daemon_worker = threading.Thread(
    target=background_heartbeat,
    daemon=True
)

daemon_worker.start()
print("MainThread doing work for 2 seconds...")
time.sleep(2)
print("MainThread exited! (Daemon immediately terminated)")`,
        steps: [
            {
                lineNum: 10,
                action: 'create_daemon',
                detail: 'threading.Thread(target=heartbeat, daemon=True) created',
                daemonState: 'running',
                mainState: 'running',
                explanation: 'Daemon threads run background tasks (telemetry, garbage collection, health checks).',
                variables: { daemon_worker: '<Thread (daemon=True)>' },
                outputs: []
            },
            {
                lineNum: 15,
                action: 'main_work',
                detail: 'MainThread works for 2 seconds while Daemon pulses',
                daemonState: 'running',
                mainState: 'running',
                explanation: 'Daemon prints pulses concurrently with MainThread.',
                variables: { daemon_worker: '<Thread (alive)>' },
                outputs: ['Pulse...', 'MainThread doing work for 2 seconds...', 'Pulse...']
            },
            {
                lineNum: 18,
                action: 'main_exits_daemon_killed',
                detail: 'MainThread terminates! Daemon thread is instantly killed by Python',
                daemonState: 'terminated',
                mainState: 'exited',
                explanation: 'Python does not wait for daemon threads. The instant non-daemon threads complete, the interpreter exits immediately.',
                variables: { daemon_worker: '<terminated>' },
                outputs: ['Pulse...', 'MainThread doing work for 2 seconds...', 'Pulse...', 'MainThread exited! (Daemon immediately terminated)']
            }
        ]
    }
];

export default function DeadlocksDaemonVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                            <Skull className="w-4 h-4 text-rose-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Deadlocks &amp; Daemon Threads
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
                                        ? 'bg-slate-900 text-white shadow-xs'
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
                        badgeText="Deadlock Audit"
                        fileName="deadlock_daemon.py"
                        accentColor="#475569"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
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
                    {selectedExample === 0 ? (
                        /* ======================================================== */
                        /* PRESET 1: THE CIRCULAR DEADLOCK TRAP BOX                 */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <AlertOctagon className="w-4 h-4 text-rose-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Circular Deadlock Impasse
                                    </h3>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.deadlockState === 'deadlocked'
                                        ? 'bg-rose-200 text-rose-900 animate-bounce'
                                        : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {currentStepData?.deadlockState === 'deadlocked' ? 'PERMANENT FROZEN DEADLOCK' : 'Active'}
                                </span>
                            </div>

                            {/* Dual Thread Lock Stand-off Schema */}
                            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                                <div className={`p-4 rounded-xl border-2 space-y-2 ${
                                    currentStepData?.deadlockState === 'deadlocked'
                                        ? 'bg-rose-50 border-rose-400'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="font-bold text-slate-900">Thread 1 Status:</div>
                                    <div className="text-emerald-700 font-bold">Holds: {currentStepData?.t1Has || 'None'}</div>
                                    <div className="text-rose-700 font-bold">Wants: {currentStepData?.t1Wants || 'None'}</div>
                                </div>

                                <div className={`p-4 rounded-xl border-2 space-y-2 ${
                                    currentStepData?.deadlockState === 'deadlocked'
                                        ? 'bg-rose-50 border-rose-400'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="font-bold text-slate-900">Thread 2 Status:</div>
                                    <div className="text-emerald-700 font-bold">Holds: {currentStepData?.t2Has || 'None'}</div>
                                    <div className="text-rose-700 font-bold">Wants: {currentStepData?.t2Wants || 'None'}</div>
                                </div>
                            </div>

                            {/* Prevention Rules Box */}
                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white space-y-2 text-xs">
                                <div className="font-bold text-amber-300">How to Prevent Deadlocks in Production:</div>
                                <ul className="text-slate-300 list-disc list-inside space-y-1">
                                    <li><strong>Rule 1 (Lock Ordering):</strong> Always acquire locks in the exact same order across all threads (e.g. Lock A then Lock B everywhere).</li>
                                    <li><strong>Rule 2 (Timeouts):</strong> Use <code className="font-mono bg-slate-800 text-amber-200 px-1 rounded">lock.acquire(timeout=2)</code> to avoid waiting indefinitely.</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        /* ======================================================== */
                        /* PRESET 2: DAEMON THREAD TERMINATION LIFECYCLE            */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Ghost className="w-4 h-4 text-purple-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Daemon Thread Lifecycle
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">
                                    daemon=True Behavior
                                </span>
                            </div>

                            {/* Main vs Daemon Lifespan Comparison */}
                            <div className="space-y-3 font-mono text-xs">
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-slate-900">MainThread (Non-Daemon)</div>
                                        <div className="text-slate-500 text-[11px]">Controls overall process lifetime</div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        currentStepData?.mainState === 'exited'
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                        {currentStepData?.mainState === 'exited' ? 'EXITED' : 'RUNNING'}
                                    </span>
                                </div>

                                <div className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                                    currentStepData?.daemonState === 'terminated'
                                        ? 'bg-rose-50 border-rose-400'
                                        : 'bg-purple-50 border-purple-400'
                                }`}>
                                    <div>
                                        <div className="font-bold text-purple-950 flex items-center gap-1.5">
                                            <Ghost className="w-4 h-4 text-purple-600" />
                                            <span>Daemon Worker (background_heartbeat)</span>
                                        </div>
                                        <div className="text-slate-500 text-[11px]">Killed instantly when MainThread exits</div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        currentStepData?.daemonState === 'terminated'
                                            ? 'bg-rose-200 text-rose-900'
                                            : 'bg-purple-200 text-purple-900 animate-pulse'
                                    }`}>
                                        {currentStepData?.daemonState === 'terminated' ? 'ABRUPTLY KILLED BY PVM' : 'PULSING...'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                <strong>Key Rule:</strong> Never use daemon threads for tasks that perform stateful operations or file writes (like writing to an open database), because the Python runtime halts them mid-byte without invoking cleanup or finally blocks!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

