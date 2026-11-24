import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Activity, Play, CheckCircle2, Sparkles, ArrowRight,
    FastForward, Download, Clock, ShieldCheck, Box
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 2: Starting Threads & The threading Module
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'thread-spawn-join',
        label: 'Spawning Concurrent Threads & join()',
        code: `import threading
import time

def download(file_name, delay):
    print(f"Starting {file_name}")
    time.sleep(delay)
    print(f"Finished {file_name}")

t1 = threading.Thread(target=download, args=("file1.zip", 2))
t2 = threading.Thread(target=download, args=("file2.zip", 2))

t1.start()
t2.start()

# join() halts MainThread until workers finish
t1.join()
t2.join()
print("All downloads finished in ~2s instead of 4s!")`,
        steps: [
            {
                lineNum: 4,
                action: 'define_download',
                detail: 'download() function defined',
                t1Progress: 0,
                t2Progress: 0,
                mainBlocked: false,
                explanation: 'Worker function simulating file download latency.',
                variables: { download: '<function>' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'create_t1_t2',
                detail: 'Thread objects t1 and t2 instantiated (Target: download)',
                t1Progress: 0,
                t2Progress: 0,
                mainBlocked: false,
                explanation: 'Threads created with specific arguments. Not running yet until start() is called.',
                variables: { t1: '<Thread (initial)>', t2: '<Thread (initial)>' },
                outputs: []
            },
            {
                lineNum: 12,
                action: 'start_both',
                detail: 't1.start() and t2.start(): Concurrency Expressway launched!',
                t1Progress: 50,
                t2Progress: 50,
                mainBlocked: false,
                explanation: 'Both threads execute concurrently on separate tracks. Both download bars fill in parallel.',
                variables: { t1: '<Thread (started)>', t2: '<Thread (started)>' },
                outputs: ['Starting file1.zip', 'Starting file2.zip']
            },
            {
                lineNum: 16,
                action: 'join_barrier',
                detail: 't1.join(): MainThread pauses at Synchronization Barrier',
                t1Progress: 100,
                t2Progress: 100,
                mainBlocked: true,
                explanation: 'join() instructs MainThread not to advance until worker thread finishes. Both downloads hit 100% together!',
                variables: { t1: '<Thread (stopped)>', t2: '<Thread (stopped)>' },
                outputs: ['Starting file1.zip', 'Starting file2.zip', 'Finished file1.zip', 'Finished file2.zip']
            },
            {
                lineNum: 18,
                action: 'main_resumed',
                detail: 'Barrier lowered! All tasks complete in ~2s wall-clock time',
                t1Progress: 100,
                t2Progress: 100,
                mainBlocked: false,
                explanation: 'Sequential download would have taken 2s + 2s = 4s. Parallel multithreading finishes both in ~2s.',
                variables: { t1: '<Thread (stopped)>', t2: '<Thread (stopped)>' },
                outputs: [
                    'Starting file1.zip',
                    'Starting file2.zip',
                    'Finished file1.zip',
                    'Finished file2.zip',
                    'All downloads finished in ~2s instead of 4s!'
                ]
            }
        ]
    }
];

export default function ThreadingModuleVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                            <Activity className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Starting Threads &amp; The threading Module
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
                                        ? 'bg-teal-600 text-white shadow-xs'
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
                        badgeText="Thread Spawner"
                        fileName="thread_download.py"
                        accentColor="#0d9488"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Parallel Expressway & join() Barrier */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-teal-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Parallel Download Expressway
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded">
                                Concurrency: 2x Speedup
                            </span>
                        </div>

                        {/* TRACK 1: file1.zip */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 font-mono text-xs">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Download className="w-4 h-4 text-teal-600" />
                                    <span className="font-bold text-slate-800">Thread-1: file1.zip</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.t1Progress === 100
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : currentStepData?.t1Progress > 0
                                        ? 'bg-teal-100 text-teal-800 animate-pulse'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {currentStepData?.t1Progress === 100 ? 'DOWNLOAD COMPLETE ✓' : currentStepData?.t1Progress > 0 ? 'DOWNLOADING (50%)' : 'STANDBY'}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-teal-500 h-full transition-all duration-500 rounded-full"
                                    style={{ width: `${currentStepData?.t1Progress || 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* TRACK 2: file2.zip */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 font-mono text-xs">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Download className="w-4 h-4 text-teal-600" />
                                    <span className="font-bold text-slate-800">Thread-2: file2.zip</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.t2Progress === 100
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : currentStepData?.t2Progress > 0
                                        ? 'bg-teal-100 text-teal-800 animate-pulse'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {currentStepData?.t2Progress === 100 ? 'DOWNLOAD COMPLETE ✓' : currentStepData?.t2Progress > 0 ? 'DOWNLOADING (50%)' : 'STANDBY'}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-teal-500 h-full transition-all duration-500 rounded-full"
                                    style={{ width: `${currentStepData?.t2Progress || 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* THE join() SYNCHRONIZATION BARRIER */}
                        <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                            currentStepData?.mainBlocked
                                ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-200'
                                : currentStepData?.t1Progress === 100
                                ? 'bg-emerald-50/90 border-emerald-500 shadow-xs'
                                : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                                    <Clock className="w-4 h-4 text-teal-600" />
                                    <span>t1.join() &amp; t2.join() Synchronization Gate</span>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.mainBlocked
                                        ? 'bg-amber-200 text-amber-900 animate-pulse'
                                        : currentStepData?.t1Progress === 100
                                        ? 'bg-emerald-200 text-emerald-900'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {currentStepData?.mainBlocked ? 'BARRIER ACTIVE: WAITING' : currentStepData?.t1Progress === 100 ? 'BARRIER LOWERED: PASSED ✓' : 'STANDBY'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Calling <code className="font-mono bg-white px-1 rounded font-bold text-teal-700">t.join()</code> guarantees that the calling thread (MainThread) will not move past this line until thread <code className="font-mono">t</code> has terminated cleanly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

