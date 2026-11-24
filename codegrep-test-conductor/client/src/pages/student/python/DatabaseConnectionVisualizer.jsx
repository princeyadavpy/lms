import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Database, Server, ShieldCheck, CheckCircle2, Sparkles,
    ArrowRight, Lock, Key, RefreshCw, Box, Power, Cable
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 2: Creating Database Connections
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'db-connection-flow',
        label: 'MySQL Handshake, Cursor & Teardown',
        code: `import mysql.connector
from mysql.connector import Error

try:
    # 1. Establish TCP socket & authenticate
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="secure_password"
    )

    if conn.is_connected():
        print("Connected to MySQL Server successfully!")
        cursor = conn.cursor()
        print("Cursor shuttle instantiated")
        cursor.close()
        conn.close()
        print("Connection closed cleanly")

except Error as e:
    print("Connection error:", e)`,
        steps: [
            {
                lineNum: 6,
                action: 'socket_open',
                detail: 'Initiating TCP handshake to localhost:3306',
                connState: 'connecting',
                cursorState: 'none',
                authStatus: 'authenticating',
                explanation: 'Python opens a network socket to MySQL port 3306.',
                variables: {},
                outputs: []
            },
            {
                lineNum: 11,
                action: 'auth_success',
                detail: 'Handshake complete! conn.is_connected() → True ✓',
                connState: 'connected',
                cursorState: 'none',
                authStatus: 'verified',
                explanation: 'MySQL server verifies user "root" credentials and establishes persistent session.',
                variables: { conn: '<MySQLConnection at 0x7f4a>' },
                outputs: ['Connected to MySQL Server successfully!']
            },
            {
                lineNum: 13,
                action: 'create_cursor',
                detail: 'cursor = conn.cursor() instantiated',
                connState: 'connected',
                cursorState: 'active',
                authStatus: 'verified',
                explanation: 'The Cursor object is the transport shuttle that sends queries and receives result rows.',
                variables: { conn: '<MySQLConnection>', cursor: '<MySQLCursor>' },
                outputs: ['Connected to MySQL Server successfully!', 'Cursor shuttle instantiated']
            },
            {
                lineNum: 15,
                action: 'teardown',
                detail: 'cursor.close() & conn.close() release network socket',
                connState: 'closed',
                cursorState: 'closed',
                authStatus: 'released',
                explanation: 'Proper resource cleanup releases database pool handles and prevents socket leaks.',
                variables: { conn: '<closed>', cursor: '<closed>' },
                outputs: ['Connected to MySQL Server successfully!', 'Cursor shuttle instantiated', 'Connection closed cleanly']
            }
        ]
    }
];

export default function DatabaseConnectionVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
                            <Cable className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Creating Database Connections
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
                                        ? 'bg-cyan-600 text-white shadow-xs'
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
                        badgeText="Connection Client"
                        fileName="connect_mysql.py"
                        accentColor="#0891b2"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Handshake Pipeline & Cursor Shuttle */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Server className="w-4 h-4 text-cyan-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    TCP Socket &amp; Authentication Pipeline
                                </h3>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                currentStepData?.connState === 'connected'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : currentStepData?.connState === 'connecting'
                                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                                    : currentStepData?.connState === 'closed'
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-slate-100 text-slate-400'
                            }`}>
                                {currentStepData?.connState === 'connected' ? 'SESSION ACTIVE (Port 3306)' : currentStepData?.connState === 'connecting' ? 'HANDSHAKE IN PROGRESS' : currentStepData?.connState === 'closed' ? 'SOCKET CLOSED' : 'DISCONNECTED'}
                            </span>
                        </div>

                        {/* Handshake Details */}
                        <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="text-[10px] text-slate-400">HOST</div>
                                <div className="font-bold text-slate-800">localhost:3306</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="text-[10px] text-slate-400">USER</div>
                                <div className="font-bold text-slate-800">&quot;root&quot;</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="text-[10px] text-slate-400">AUTH</div>
                                <div className="font-bold text-emerald-600">SHA-256 ✓</div>
                            </div>
                        </div>

                        {/* THE CURSOR TRANSPORT SHUTTLE BOX */}
                        <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                            currentStepData?.cursorState === 'active'
                                ? 'bg-cyan-50/90 border-cyan-500 shadow-md ring-2 ring-cyan-200'
                                : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                                    <Cable className="w-4 h-4 text-cyan-600" />
                                    <span>Cursor Transport Shuttle: cursor = conn.cursor()</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.cursorState === 'active'
                                        ? 'bg-cyan-200 text-cyan-900 animate-pulse'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {currentStepData?.cursorState === 'active' ? 'SHUTTLE ARMED & READY' : 'STANDBY'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                A connection maintains the physical network socket. The <strong>cursor</strong> is the lightweight vehicle that travels along the wire to execute statements and retrieve tabular result sets.
                            </p>
                        </div>

                        {/* TEARDOWN NOTICE */}
                        <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Power className="w-4 h-4 text-amber-400" />
                                <span>Always close cursors and connections when finished:</span>
                            </div>
                            <div className="font-mono text-[11px] text-cyan-300 font-bold">
                                cursor.close() ; conn.close()
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

