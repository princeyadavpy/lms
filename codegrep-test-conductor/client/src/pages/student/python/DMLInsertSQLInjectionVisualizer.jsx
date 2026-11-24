import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Database, ShieldCheck, ShieldAlert, Sparkles, CheckCircle2,
    ArrowRight, AlertOctagon, Check, RefreshCw, Box, HardDrive, Layers
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 4: DML INSERT & SQL Injection Defense
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'dml-insert-commit',
        label: 'DML INSERT & Transaction commit()',
        code: `import mysql.connector

conn = mysql.connector.connect(host="localhost", user="root", database="school")
cursor = conn.cursor()

# Parameterized INSERT query using %s placeholders
sql = "INSERT INTO students (name, course, marks) VALUES (%s, %s, %s)"

# 1. Single Insert
cursor.execute(sql, ("Asha", "Python", 95))
print("Staged Row ID:", cursor.lastrowid)

# 2. COMMIT: Crucial step to persist changes to disk!
conn.commit()
print("Transaction COMMITTED permanently to disk!")`,
        steps: [
            {
                lineNum: 7,
                action: 'define_sql_template',
                detail: 'sql template compiled with %s parameter placeholders',
                stagedRows: [],
                committed: false,
                injectionSafe: true,
                explanation: 'Parameterized query separates SQL command logic from user-supplied values.',
                variables: { sql: '"INSERT INTO students VALUES (%s, %s, %s)"' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'execute_insert',
                detail: 'cursor.execute(sql, ("Asha", "Python", 95)) — STAGED IN BUFFER',
                stagedRows: [{ id: 1, name: 'Asha', course: 'Python', marks: 95 }],
                committed: false,
                injectionSafe: true,
                explanation: 'Row is placed into transaction buffer memory. It is NOT yet permanent on disk!',
                variables: { lastrowid: 1 },
                outputs: ['Staged Row ID: 1']
            },
            {
                lineNum: 14,
                action: 'commit_transaction',
                detail: 'conn.commit() executed! Staging buffer burned to permanent disk storage',
                stagedRows: [{ id: 1, name: 'Asha', course: 'Python', marks: 95 }],
                committed: true,
                injectionSafe: true,
                explanation: 'Transactions guarantee ACID durability. Until conn.commit() is invoked, uncommitted inserts can be rolled back.',
                variables: { committed: true },
                outputs: ['Staged Row ID: 1', 'Transaction COMMITTED permanently to disk!']
            }
        ]
    },
    {
        id: 'sql-injection-defense',
        label: 'SQL Injection Defense (Shield vs Trap)',
        code: `import mysql.connector

# USER INPUT: Malicious payload attempting to bypass auth!
user_input = "' OR '1'='1"

# ❌ INSECURE STRING CONCATENATION (Never do this!):
# bad_sql = "SELECT * FROM users WHERE name = '" + user_input + "'"
# Resulting query: SELECT * FROM users WHERE name = '' OR '1'='1' (PWNED!)

# ✅ SECURE PARAMETERIZED PLACEHOLDER:
secure_sql = "SELECT * FROM users WHERE name = %s"
# Database treats user_input purely as literal data:
cursor.execute(secure_sql, (user_input,))
print("SQL Injection neutralized! Engine treated payload as harmless text.")`,
        steps: [
            {
                lineNum: 4,
                action: 'load_payload',
                detail: 'Attacker injects SQL fragment: "\' OR \'1\'=\'1"',
                stagedRows: [],
                committed: false,
                injectionSafe: true,
                explanation: 'Attacker tries to alter SQL query grammar by injecting boolean tautology.',
                variables: { user_input: "\"' OR '1'='1\"" },
                outputs: []
            },
            {
                lineNum: 12,
                action: 'secure_param_execute',
                detail: 'cursor.execute(secure_sql, (user_input,)) — Sanitized by DB-API Shield',
                stagedRows: [],
                committed: false,
                injectionSafe: true,
                explanation: 'The database engine compiles the query blueprint FIRST. The parameter placeholder %s is treated 100% as raw string text, rendering the injection harmless!',
                variables: { secure_sql: '"SELECT * FROM users WHERE name = %s"' },
                outputs: ['SQL Injection neutralized! Engine treated payload as harmless text.']
            }
        ]
    }
];

export default function DMLInsertSQLInjectionVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                DML INSERT &amp; SQL Injection Defense
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
                        badgeText="DML Engine"
                        fileName="insert_commit.py"
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

                {/* Right Column: Visual Box Diagrams */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {selectedExample === 0 ? (
                        /* ======================================================== */
                        /* PRESET 1: TRANSACTION STAGING BUFFER & COMMIT PERSISTENCE*/
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-amber-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Transaction Staging Buffer &amp; Disk Commit
                                    </h3>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.committed
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : (currentStepData?.stagedRows?.length || 0) > 0
                                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                                        : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {currentStepData?.committed ? 'COMMITTED TO DISK ✓' : (currentStepData?.stagedRows?.length || 0) > 0 ? 'UNCOMMITTED STAGING BUFFER' : 'IDLE'}
                                </span>
                            </div>

                            {/* Staging Buffer Container */}
                            <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                currentStepData?.committed
                                    ? 'bg-emerald-50/90 border-emerald-500 shadow-md'
                                    : (currentStepData?.stagedRows?.length || 0) > 0
                                    ? 'bg-amber-50/90 border-amber-500'
                                    : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="flex items-center justify-between font-mono text-xs">
                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                        <HardDrive className="w-4 h-4 text-amber-600" />
                                        <span>InnoDB Buffer Pool</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500">
                                        {currentStepData?.committed ? 'Persistent Storage' : 'Volatile RAM'}
                                    </span>
                                </div>

                                {(currentStepData?.stagedRows || []).length > 0 ? (
                                    <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-slate-800">Row #1:</span> &quot;Asha&quot; | Course: &quot;Python&quot; | Marks: 95
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                            currentStepData?.committed
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {currentStepData?.committed ? 'COMMITTED' : 'UNCOMMITTED'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-xs text-slate-400 italic font-mono">
                                        Buffer empty — awaiting cursor.execute(INSERT)
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                <strong>Why conn.commit() is Mandatory:</strong> In relational databases, DML operations (INSERT, UPDATE, DELETE) run inside transactions. If your Python script crashes before calling <code className="font-mono bg-slate-100 px-1 rounded font-bold">conn.commit()</code>, the server automatically rolls back all changes!
                            </p>
                        </div>
                    ) : (
                        /* ======================================================== */
                        /* PRESET 2: SQL INJECTION DEFENSE (SHIELD VS TRAP)         */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        SQL Injection Defense: Parameterized Placeholders
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                                    Zero Trust Architecture
                                </span>
                            </div>

                            {/* Attacker Payload Box */}
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-1">
                                <div className="text-[10px] text-rose-400 font-bold">MALICIOUS USER INPUT:</div>
                                <div className="p-2 bg-slate-950 rounded border border-rose-900 text-rose-300 font-bold">
                                    user_input = &quot;&apos; OR &apos;1&apos;=&apos;1&quot;
                                </div>
                            </div>

                            {/* Insecure vs Secure Comparison */}
                            <div className="space-y-2.5 font-mono text-xs">
                                {/* Insecure */}
                                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl space-y-1">
                                    <div className="text-rose-800 font-bold flex items-center justify-between">
                                        <span>❌ INSECURE: String Concatenation (+)</span>
                                        <span className="text-[9px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">VULNERABLE</span>
                                    </div>
                                    <div className="text-slate-600 text-[11px]">
                                        &quot;WHERE name = &apos;&quot; + user_input + &quot;&apos;&quot; ➔ Alters query syntax, dumping all database records!
                                    </div>
                                </div>

                                {/* Secure */}
                                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
                                    <div className="text-emerald-800 font-bold flex items-center justify-between">
                                        <span>✅ SECURE: Parameter Placeholders (%s)</span>
                                        <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">PROTECTED</span>
                                    </div>
                                    <div className="text-slate-600 text-[11px]">
                                        cursor.execute(sql, (user_input,)) ➔ Engine treats input 100% as literal text data!
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                Never construct SQL queries using string formatting (<code className="font-mono bg-slate-100 px-1 rounded font-bold">+</code>, <code className="font-mono bg-slate-100 px-1 rounded font-bold">f&quot;...&quot;</code>, or <code className="font-mono bg-slate-100 px-1 rounded font-bold">%</code> operator). Always pass dynamic arguments as a secondary tuple parameter to <code className="font-mono">cursor.execute()</code>!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

