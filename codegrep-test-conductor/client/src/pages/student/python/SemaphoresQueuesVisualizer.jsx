import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Ticket, ShoppingCart, Sparkles, CheckCircle2, ArrowRight,
    Users, Box, Layers, RefreshCw, Send, Check
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 4: Semaphores, Queues & Producer-Consumer
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'semaphore-tokens',
        label: 'Semaphore(3) Connection Pool',
        code: `import threading
import time

# Permit up to 3 threads simultaneously
sem = threading.Semaphore(3)

def access_api(client_id):
    with sem:
        print(f"Client {client_id} active (Holding Token)")
        time.sleep(1)
    print(f"Client {client_id} finished (Released Token)")

threads = [threading.Thread(target=access_api, args=(i,)) for i in range(1, 6)]
for t in threads: t.start()
for t in threads: t.join()`,
        steps: [
            {
                lineNum: 5,
                action: 'init_semaphore',
                detail: 'Semaphore(3) initialized with 3 available access tokens',
                tokensAvailable: 3,
                activeClients: [],
                waitingClients: [],
                explanation: 'A Semaphore acts as a bouncer allowing up to N concurrent threads into the resource.',
                variables: { sem: '<Semaphore value=3>' },
                outputs: []
            },
            {
                lineNum: 13,
                action: 'spawn_5_clients',
                detail: '5 Client threads launched! First 3 grab tokens immediately',
                tokensAvailable: 0,
                activeClients: [1, 2, 3],
                waitingClients: [4, 5],
                explanation: 'Clients 1, 2, 3 each acquire a token (tokens drop from 3 to 0). Clients 4 and 5 must wait in line!',
                variables: { sem: '<Semaphore value=0>' },
                outputs: ['Client 1 active (Holding Token)', 'Client 2 active (Holding Token)', 'Client 3 active (Holding Token)']
            },
            {
                lineNum: 10,
                action: 'clients_release_and_admit',
                detail: 'Clients 1, 2 finish → Tokens released! Clients 4, 5 admitted',
                tokensAvailable: 1,
                activeClients: [3, 4, 5],
                waitingClients: [],
                explanation: 'As existing clients exit the with-block, their tokens are returned, immediately unblocking waiting clients 4 and 5!',
                variables: { sem: '<Semaphore value=0>' },
                outputs: [
                    'Client 1 active (Holding Token)',
                    'Client 2 active (Holding Token)',
                    'Client 3 active (Holding Token)',
                    'Client 1 finished (Released Token)',
                    'Client 2 finished (Released Token)',
                    'Client 4 active (Holding Token)',
                    'Client 5 active (Holding Token)'
                ]
            },
            {
                lineNum: 15,
                action: 'all_finished',
                detail: 'All 5 clients completed! Semaphore restored to 3 tokens',
                tokensAvailable: 3,
                activeClients: [],
                waitingClients: [],
                explanation: 'All threads safely utilized the API pool without exceeding rate limits.',
                variables: { sem: '<Semaphore value=3>' },
                outputs: [
                    'Client 1 active (Holding Token)',
                    'Client 2 active (Holding Token)',
                    'Client 3 active (Holding Token)',
                    'Client 1 finished (Released Token)',
                    'Client 2 finished (Released Token)',
                    'Client 4 active (Holding Token)',
                    'Client 5 active (Holding Token)',
                    'Client 3 finished (Released Token)',
                    'Client 4 finished (Released Token)',
                    'Client 5 finished (Released Token)'
                ]
            }
        ]
    },
    {
        id: 'queue-producer-consumer',
        label: 'queue.Queue() Thread-Safe Conveyor',
        code: `from queue import Queue
import threading

# FIFO Thread-Safe Queue
q = Queue()

def producer():
    for item in ["Pkg-A", "Pkg-B", "Pkg-C"]:
        q.put(item)
    q.put(None)  # Sentinel to signal consumer to stop

def consumer():
    while (item := q.get()) is not None:
        print(f"Consumed: {item}")
        q.task_done()

t1 = threading.Thread(target=producer)
t2 = threading.Thread(target=consumer)
t1.start(); t2.start()
t1.join(); t2.join()`,
        steps: [
            {
                lineNum: 5,
                action: 'init_queue',
                detail: 'Thread-safe FIFO Queue initialized',
                queueItems: [],
                producerState: 'idle',
                consumerState: 'idle',
                explanation: 'queue.Queue provides built-in locking so multiple threads can put and get without race conditions.',
                variables: { q: '<Queue (empty)>' },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'producer_put',
                detail: 'Producer puts "Pkg-A", "Pkg-B", "Pkg-C" onto conveyor belt',
                queueItems: ['Pkg-A', 'Pkg-B', 'Pkg-C'],
                producerState: 'producing',
                consumerState: 'waiting',
                explanation: 'Producer pushes items onto the queue buffer.',
                variables: { q: '["Pkg-A", "Pkg-B", "Pkg-C"]' },
                outputs: []
            },
            {
                lineNum: 13,
                action: 'consumer_get',
                detail: 'Consumer safely retrieves items in FIFO order',
                queueItems: ['Pkg-C'],
                producerState: 'done',
                consumerState: 'consuming',
                explanation: 'Consumer processes Pkg-A and Pkg-B, keeping data pipeline synchronized.',
                variables: { q: '["Pkg-C"]' },
                outputs: ['Consumed: Pkg-A', 'Consumed: Pkg-B']
            },
            {
                lineNum: 14,
                action: 'consumer_sentinel',
                detail: 'Consumer consumes Pkg-C, hits None sentinel and stops cleanly',
                queueItems: [],
                producerState: 'done',
                consumerState: 'done',
                explanation: 'Clean termination of producer-consumer pipeline.',
                variables: { q: '[]' },
                outputs: ['Consumed: Pkg-A', 'Consumed: Pkg-B', 'Consumed: Pkg-C']
            }
        ]
    }
];

export default function SemaphoresQueuesVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                            <Ticket className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Semaphores, Queues &amp; Producer-Consumer
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
                                        ? 'bg-purple-600 text-white shadow-xs'
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
                        badgeText="Concurrency Pool"
                        fileName="semaphores_queues.py"
                        accentColor="#9333ea"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
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
                        /* PRESET 1: SEMAPHORE TOKEN DISPENSER & CONNECTION POOL    */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Ticket className="w-4 h-4 text-purple-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Semaphore(3) Token Dispenser
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">
                                    Max 3 Simultaneous Connections
                                </span>
                            </div>

                            {/* Token Counter Box */}
                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] text-slate-400 font-mono">AVAILABLE TOKENS</div>
                                    <div className="text-xs text-slate-300">threading.Semaphore(3)</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3].map(t => (
                                        <div
                                            key={t}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                                                t <= (currentStepData?.tokensAvailable ?? 3)
                                                    ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/40 scale-105'
                                                    : 'bg-slate-800 text-slate-600 border border-slate-700'
                                            }`}
                                        >
                                            🎫
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active vs Waiting Clients Pod */}
                            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                                    <div className="font-bold text-emerald-900 flex items-center justify-between">
                                        <span>Active Clients (Holding Token):</span>
                                        <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded">
                                            {currentStepData?.activeClients?.length || 0} / 3
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {(currentStepData?.activeClients || []).map(c => (
                                            <span key={c} className="px-2 py-1 bg-emerald-600 text-white rounded font-bold">
                                                Client-{c}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                                    <div className="font-bold text-amber-900 flex items-center justify-between">
                                        <span>Waiting in Line:</span>
                                        <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">
                                            {currentStepData?.waitingClients?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {(currentStepData?.waitingClients || []).map(c => (
                                            <span key={c} className="px-2 py-1 bg-amber-600 text-white rounded font-bold animate-pulse">
                                                Client-{c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ======================================================== */
                        /* PRESET 2: QUEUE.QUEUE() PRODUCER-CONSUMER CONVEYOR       */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Thread-Safe FIFO Conveyor: queue.Queue()
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">
                                    Built-in Mutex Synchronization
                                </span>
                            </div>

                            {/* Conveyor Belt Display */}
                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-2">
                                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                    <span>PRODUCER THREAD ➔</span>
                                    <span>FIFO BUFFER</span>
                                    <span>➔ CONSUMER THREAD</span>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 min-h-12 overflow-x-auto">
                                    {(currentStepData?.queueItems || []).length > 0 ? (
                                        (currentStepData.queueItems).map((item, i) => (
                                            <div key={i} className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs shrink-0 shadow-sm">
                                                📦 {item}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-slate-500 text-xs italic text-center w-full">
                                            Conveyor Buffer Empty
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                Unlike standard Python lists, <code className="font-mono bg-slate-100 px-1 rounded font-bold">queue.Queue</code> handles all internal locking automatically. Multiple producers and consumers can push and pull simultaneously without race conditions or manual locks!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

