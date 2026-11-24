import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Cpu, Key, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
    Layers, Zap, RefreshCw, Box, Lock, Unlock, HardDrive, Network
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 1: Processes vs Threads & The GIL
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'gil-io-bound',
        label: 'The GIL & I/O-Bound Concurrency (Release GIL)',
        code: `# I/O-Bound Tasks: Threads excel!
# When a thread waits for I/O (sleep, network, disk),
# it RELEASES the GIL, letting other threads run!
import threading
import time

def io_task(name):
    print(f"{name}: started (holding GIL)")
    time.sleep(1)  # Releases GIL during sleep!
    print(f"{name}: completed")

t1 = threading.Thread(target=io_task, args=("Thread-1",))
t2 = threading.Thread(target=io_task, args=("Thread-2",))

t1.start()
t2.start()
t1.join()
t2.join()`,
        steps: [
            {
                lineNum: 6,
                action: 'define_task',
                detail: 'io_task defined with time.sleep() latency simulator',
                gilHolder: 'MainThread',
                thread1State: 'idle',
                thread2State: 'idle',
                concurrencyMode: 'io',
                explanation: 'Function represents an I/O task (fetching from a web API or reading from a database).',
                variables: { io_task: '<function>' },
                outputs: []
            },
            {
                lineNum: 14,
                action: 'start_t1',
                detail: 't1.start(): Thread-1 grabs GIL token and enters CPU frame',
                gilHolder: 'Thread-1',
                thread1State: 'running',
                thread2State: 'idle',
                concurrencyMode: 'io',
                explanation: 'Thread-1 acquires the Global Interpreter Lock (GIL) and begins executing Python bytecodes.',
                variables: { t1: '<Thread-1 (started)>' },
                outputs: ['Thread-1: started (holding GIL)']
            },
            {
                lineNum: 15,
                action: 't1_sleep_release_gil',
                detail: 'Thread-1 hits time.sleep(1) → RELEASES THE GIL TOKEN!',
                gilHolder: 'Thread-2',
                thread1State: 'io_waiting',
                thread2State: 'running',
                concurrencyMode: 'io',
                explanation: 'CPython automatically drops the GIL whenever a thread pauses for I/O. Thread-2 immediately grabs the lock!',
                variables: { t1: '<Thread-1 (waiting)>', t2: '<Thread-2 (started)>' },
                outputs: ['Thread-1: started (holding GIL)', 'Thread-2: started (holding GIL)']
            },
            {
                lineNum: 16,
                action: 'both_waiting',
                detail: 'Both threads waiting on I/O concurrently (Total time: 1s instead of 2s!)',
                gilHolder: 'None (I/O Wait)',
                thread1State: 'io_waiting',
                thread2State: 'io_waiting',
                concurrencyMode: 'io',
                explanation: 'Because both threads slept in parallel while releasing the lock, I/O tasks achieve near 200% concurrency.',
                variables: { t1: '<Thread-1>', t2: '<Thread-2>' },
                outputs: ['Thread-1: started (holding GIL)', 'Thread-2: started (holding GIL)']
            },
            {
                lineNum: 17,
                action: 'join_complete',
                detail: 'Both threads complete! Execution resumed on MainThread',
                gilHolder: 'MainThread',
                thread1State: 'done',
                thread2State: 'done',
                concurrencyMode: 'io',
                explanation: 't1.join() and t2.join() confirm all I/O work finished.',
                variables: { t1: '<Thread-1 (stopped)>', t2: '<Thread-2 (stopped)>' },
                outputs: ['Thread-1: started (holding GIL)', 'Thread-2: started (holding GIL)', 'Thread-1: completed', 'Thread-2: completed']
            }
        ]
    },
    {
        id: 'gil-cpu-bound',
        label: 'CPU-Bound Contention (GIL Bottleneck)',
        code: `# CPU-Bound Tasks: Threads CANNOT run in parallel on CPython!
# Heavy math hogs the GIL without releasing it.
# Solution: Use multiprocessing for separate PIDs!
import threading

def cpu_heavy(n):
    total = 0
    for i in range(n):
        total += i
    return total

t1 = threading.Thread(target=cpu_heavy, args=(10000000,))
t2 = threading.Thread(target=cpu_heavy, args=(10000000,))

t1.start()
t2.start()
t1.join()
t2.join()`,
        steps: [
            {
                lineNum: 6,
                action: 'define_cpu_task',
                detail: 'cpu_heavy task defined (Pure mathematical loop)',
                gilHolder: 'MainThread',
                thread1State: 'idle',
                thread2State: 'idle',
                concurrencyMode: 'cpu',
                explanation: 'CPU-bound loops continuously execute bytecode instructions without any natural I/O pause.',
                variables: { cpu_heavy: '<function>' },
                outputs: []
            },
            {
                lineNum: 14,
                action: 't1_hogs_gil',
                detail: 'Thread-1 hogs the GIL! Thread-2 is BLOCKED and waits in line',
                gilHolder: 'Thread-1',
                thread1State: 'running',
                thread2State: 'blocked',
                concurrencyMode: 'cpu',
                explanation: 'Because only ONE thread can execute bytecodes at any instant, Thread-2 cannot use other CPU cores simultaneously.',
                variables: { t1: '<Thread-1 (running)>', t2: '<Thread-2 (waiting for GIL)>' },
                outputs: []
            },
            {
                lineNum: 17,
                action: 'time_slice_switch',
                detail: 'OS triggers context switch: GIL switches to Thread-2',
                gilHolder: 'Thread-2',
                thread1State: 'blocked',
                thread2State: 'running',
                concurrencyMode: 'cpu',
                explanation: 'Threads take turns on a single core via time slicing. No speedup achieved over sequential execution!',
                variables: { t1: '<Thread-1>', t2: '<Thread-2>' },
                outputs: []
            }
        ]
    }
];

export default function ProcessesVsThreadsGILVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                            <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Processes vs Threads &amp; The GIL
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
                                        ? 'bg-blue-600 text-white shadow-xs'
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
                        badgeText="GIL Inspector"
                        fileName="gil_concurrency.py"
                        accentColor="#2563eb"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: GIL Turnstile & Thread Execution Pods */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {/* GIL ROTATING TOKEN GATE BOX */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-amber-500" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    The GIL (Global Interpreter Lock) Chamber
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded">
                                1 Thread at a Time
                            </span>
                        </div>

                        {/* GIL Token Status Box */}
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-mono font-bold text-slate-200">ACTIVE GIL TOKEN:</span>
                            </div>
                            <div className={`px-3 py-1 rounded-lg font-mono font-bold text-xs ${
                                currentStepData?.gilHolder === 'Thread-1'
                                    ? 'bg-blue-600 text-white animate-pulse'
                                    : currentStepData?.gilHolder === 'Thread-2'
                                    ? 'bg-indigo-600 text-white animate-pulse'
                                    : 'bg-slate-800 text-amber-300'
                            }`}>
                                {currentStepData?.gilHolder || 'IDLE'}
                            </div>
                        </div>

                        {/* DUAL THREAD WORKER PODS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                            {/* Thread 1 Pod */}
                            <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                currentStepData?.thread1State === 'running'
                                    ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-200'
                                    : currentStepData?.thread1State === 'io_waiting'
                                    ? 'bg-emerald-50/90 border-emerald-400'
                                    : currentStepData?.thread1State === 'blocked'
                                    ? 'bg-rose-50/90 border-rose-400'
                                    : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-blue-950">Thread-1 (I/O or CPU)</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        currentStepData?.thread1State === 'running'
                                            ? 'bg-blue-200 text-blue-900'
                                            : currentStepData?.thread1State === 'io_waiting'
                                            ? 'bg-emerald-200 text-emerald-900'
                                            : currentStepData?.thread1State === 'blocked'
                                            ? 'bg-rose-200 text-rose-900'
                                            : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {currentStepData?.thread1State === 'running' ? 'HOLDING GIL (Running)' : currentStepData?.thread1State === 'io_waiting' ? 'I/O SLEEP (GIL Released)' : currentStepData?.thread1State === 'blocked' ? 'BLOCKED (Waiting GIL)' : 'Idle'}
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-sans">
                                    Shares heap memory with peer threads. Releasing the lock during I/O allows Thread-2 to run without delay.
                                </div>
                            </div>

                            {/* Thread 2 Pod */}
                            <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                currentStepData?.thread2State === 'running'
                                    ? 'bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-200'
                                    : currentStepData?.thread2State === 'io_waiting'
                                    ? 'bg-emerald-50/90 border-emerald-400'
                                    : currentStepData?.thread2State === 'blocked'
                                    ? 'bg-rose-50/90 border-rose-400'
                                    : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-indigo-950">Thread-2 (Peer Worker)</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        currentStepData?.thread2State === 'running'
                                            ? 'bg-indigo-200 text-indigo-900'
                                            : currentStepData?.thread2State === 'io_waiting'
                                            ? 'bg-emerald-200 text-emerald-900'
                                            : currentStepData?.thread2State === 'blocked'
                                            ? 'bg-rose-200 text-rose-900'
                                            : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {currentStepData?.thread2State === 'running' ? 'HOLDING GIL (Running)' : currentStepData?.thread2State === 'io_waiting' ? 'I/O SLEEP (GIL Released)' : currentStepData?.thread2State === 'blocked' ? 'BLOCKED (Waiting GIL)' : 'Idle'}
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-sans">
                                    In CPU-bound tasks, cannot run concurrently on multi-core CPUs due to the single CPython GIL lock.
                                </div>
                            </div>
                        </div>

                        {/* PROCESS VS THREAD CHEAT-SHEET BOX */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <Box className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Process (multiprocessing)</span>
                                </div>
                                <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-0.5">
                                    <li>Dedicated isolated memory space</li>
                                    <li>Own independent GIL per process</li>
                                    <li>Ideal for <strong>CPU-Bound tasks</strong> (heavy math)</li>
                                </ul>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Thread (threading)</span>
                                </div>
                                <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-0.5">
                                    <li>Shared heap &amp; global memory</li>
                                    <li>Lightweight creation overhead</li>
                                    <li>Ideal for <strong>I/O-Bound tasks</strong> (APIs, disks)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

