import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Database, Server, CheckCircle2, Sparkles, ArrowRight,
    Cpu, HardDrive, ShieldCheck, Box, Network, Terminal
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 1: Database Basics & Driver Installation
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'driver-testing',
        label: 'Testing MySQL DB-API Driver',
        code: `# Official Oracle DB-API 2.0 Driver for MySQL
import mysql.connector

# Verify driver version and connection protocol
print("Driver Name:    mysql-connector-python")
print("Driver Version:", mysql.connector.__version__)

# Test driver capability
has_cext = mysql.connector.HAVE_CEXT
print("C Extension Accelerated?", has_cext)`,
        steps: [
            {
                lineNum: 2,
                action: 'import_driver',
                detail: 'import mysql.connector loaded into runtime',
                activeDriver: 'mysql-connector-python',
                stage: 'loaded',
                explanation: 'Imports Python\'s standard DB-API 2.0 compliant MySQL connector driver.',
                variables: { 'mysql.connector': '<module>' },
                outputs: []
            },
            {
                lineNum: 5,
                action: 'read_driver_name',
                detail: 'print("Driver Name: mysql-connector-python")',
                activeDriver: 'mysql-connector-python',
                stage: 'inspected',
                explanation: 'Prints the registered driver name.',
                variables: {},
                outputs: ['Driver Name:    mysql-connector-python']
            },
            {
                lineNum: 6,
                action: 'read_version',
                detail: 'mysql.connector.__version__ → 9.1.0',
                activeDriver: 'mysql-connector-python',
                stage: 'version_checked',
                explanation: 'Driver version confirmed compatible with MySQL 8.x and 9.x servers.',
                variables: { version: '"9.1.0"' },
                outputs: ['Driver Name:    mysql-connector-python', 'Driver Version: 9.1.0']
            },
            {
                lineNum: 9,
                action: 'check_cext',
                detail: 'mysql.connector.HAVE_CEXT → True (C Accelerator Active)',
                activeDriver: 'mysql-connector-python',
                stage: 'ready',
                explanation: 'Checks if native C extension acceleration is enabled for maximum network throughput.',
                variables: { has_cext: 'True' },
                outputs: ['Driver Name:    mysql-connector-python', 'Driver Version: 9.1.0', 'C Extension Accelerated? True']
            }
        ]
    }
];

export default function DatabaseDriversVisualizer() {
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
                            <Database className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Database Basics &amp; Driver Installation
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
                        badgeText="Driver Tester"
                        fileName="driver_check.py"
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

                {/* Right Column: DB-API 2.0 Bridge & Driver Matrix */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {/* DB-API 2.0 STANDARDIZATION BRIDGE */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Network className="w-4 h-4 text-blue-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    PEP 249: Python DB-API 2.0 Architecture
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                                Uniform Interface
                            </span>
                        </div>

                        {/* Architecture Pipeline Flow */}
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs flex items-center justify-between">
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
                                <div className="text-[10px] text-slate-400">APPLICATION</div>
                                <div className="font-bold text-blue-300">Python Code</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500" />
                            <div className="p-2.5 bg-blue-950/80 rounded-lg border border-blue-500 text-center">
                                <div className="text-[10px] text-blue-300">STANDARD SPEC</div>
                                <div className="font-bold text-white">DB-API 2.0</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500" />
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
                                <div className="text-[10px] text-slate-400">DATABASE DRIVER</div>
                                <div className="font-bold text-emerald-300">mysql.connector</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500" />
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
                                <div className="text-[10px] text-slate-400">RDBMS ENGINE</div>
                                <div className="font-bold text-amber-300">MySQL Server</div>
                            </div>
                        </div>

                        {/* DRIVER OPTIONS MATRIX */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 bg-blue-50 border-2 border-blue-400 rounded-xl space-y-1">
                                <div className="font-bold text-blue-950 font-mono">mysql-connector</div>
                                <div className="text-[10px] text-blue-700 font-semibold">Official Oracle Driver</div>
                                <div className="text-[11px] text-slate-600">Full modern feature support, native SSL/TLS encryption.</div>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                <div className="font-bold text-slate-900 font-mono">PyMySQL</div>
                                <div className="text-[10px] text-slate-500 font-semibold">Pure-Python Driver</div>
                                <div className="text-[11px] text-slate-600">Requires no C compiler, installs anywhere easily.</div>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                <div className="font-bold text-slate-900 font-mono">sqlite3</div>
                                <div className="text-[10px] text-emerald-600 font-semibold">Built-in Standard Library</div>
                                <div className="text-[11px] text-slate-600">Zero installation required. Single-file database.</div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Because all Python database drivers adhere strictly to the <strong>PEP 249 (DB-API 2.0)</strong> standard, your operational workflow (<code className="font-mono bg-slate-100 px-1 rounded font-bold">connect()</code>, <code className="font-mono bg-slate-100 px-1 rounded font-bold">cursor()</code>, <code className="font-mono bg-slate-100 px-1 rounded font-bold">execute()</code>, <code className="font-mono bg-slate-100 px-1 rounded font-bold">commit()</code>) remains identical across MySQL, PostgreSQL, Oracle, and SQLite!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

