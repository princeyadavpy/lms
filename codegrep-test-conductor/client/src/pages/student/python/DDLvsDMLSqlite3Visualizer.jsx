import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    FileCode, Database, CheckCircle2, Sparkles, ArrowRight,
    Layers, HardDrive, Check, Zap, ServerOff, Code2
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 6: DDL vs DML & Built-in sqlite3 Practice
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'sqlite3-practice',
        label: 'Built-in sqlite3: Serverless Single-File Database',
        code: `import sqlite3

# Serverless: Database resides in a single local file!
conn = sqlite3.connect("school.db")
cur = conn.cursor()

# 1. DDL: Create Table Structure
cur.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    marks INTEGER
)
""")

# 2. DML: Insert record using '?' placeholder (sqlite3 syntax)
cur.execute("INSERT INTO students (name, marks) VALUES (?, ?)", ("Asha", 95))
conn.commit()

# 3. Read back records
for row in cur.execute("SELECT * FROM students"):
    print("Found Student:", row)

conn.close()`,
        steps: [
            {
                lineNum: 4,
                action: 'connect_sqlite',
                detail: 'sqlite3.connect("school.db") opens local SQLite database file',
                stage: 'connected',
                fileCreated: true,
                tableExists: false,
                rowCount: 0,
                explanation: 'Zero installation or external server daemon required! SQLite creates school.db directly on local disk.',
                variables: { conn: '<sqlite3.Connection>' },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'execute_ddl',
                detail: 'DDL: CREATE TABLE students executed',
                stage: 'ddl_created',
                fileCreated: true,
                tableExists: true,
                rowCount: 0,
                explanation: 'Schema defined with AUTOINCREMENT INTEGER primary key.',
                variables: { table: 'students' },
                outputs: []
            },
            {
                lineNum: 17,
                action: 'execute_dml_insert',
                detail: 'DML: INSERT INTO students using "?" parameter syntax + conn.commit()',
                stage: 'dml_inserted',
                fileCreated: true,
                tableExists: true,
                rowCount: 1,
                explanation: 'Notice SQLite uses "?" parameter placeholders (compared to "%s" in MySQL). conn.commit() commits to school.db.',
                variables: { rowCount: 1 },
                outputs: []
            },
            {
                lineNum: 21,
                action: 'execute_read',
                detail: 'SELECT * FROM students returns (1, "Asha", 95)',
                stage: 'read_done',
                fileCreated: true,
                tableExists: true,
                rowCount: 1,
                explanation: 'Reads student record from SQLite file.',
                variables: { row: '(1, "Asha", 95)' },
                outputs: ["Found Student: (1, 'Asha', 95)"]
            }
        ]
    }
];

export default function DDLvsDMLSqlite3Visualizer() {
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
                            <ServerOff className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                DDL vs DML &amp; Built-in sqlite3 Practice
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
                        badgeText="SQLite Engine"
                        fileName="sqlite_practice.py"
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

                {/* Right Column: DDL vs DML Rules & SQLite File Container */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {/* DDL VS DML COMPARISON MATRIX */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-teal-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    DDL vs DML Fundamental Comparison
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded">
                                SQL Taxonomy
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            {/* DDL */}
                            <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2">
                                <div className="font-bold text-indigo-950 flex items-center justify-between">
                                    <span>DDL (Data Definition)</span>
                                    <span className="text-[9px] bg-indigo-200 text-indigo-900 px-1.5 py-0.2 rounded font-mono font-bold">
                                        STRUCTURE
                                    </span>
                                </div>
                                <div className="font-mono text-[11px] text-indigo-700 font-semibold">
                                    CREATE, ALTER, DROP, TRUNCATE
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                    Changes database tables and schemas. Auto-committed immediately in MySQL.
                                </p>
                            </div>

                            {/* DML */}
                            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                                <div className="font-bold text-emerald-950 flex items-center justify-between">
                                    <span>DML (Data Manipulation)</span>
                                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-mono font-bold">
                                        RECORDS
                                    </span>
                                </div>
                                <div className="font-mono text-[11px] text-emerald-700 font-semibold">
                                    INSERT, UPDATE, DELETE, SELECT
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                    Modifies rows inside existing tables. Requires explicit <code className="font-mono bg-white px-1 rounded">conn.commit()</code> to persist.
                                </p>
                            </div>
                        </div>

                        {/* SQLITE3 SERVERLESS FILE BOX */}
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-2">
                            <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                <span>SERVERLESS LOCAL DATABASE FILE</span>
                                <span className="text-teal-300 font-bold">&quot;school.db&quot;</span>
                            </div>

                            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-slate-300 font-bold">Table: students</div>
                                    <div className="text-slate-500 text-[11px]">
                                        {currentStepData?.tableExists ? 'Columns: id (INTEGER PK), name (TEXT), marks (INTEGER)' : 'Table not yet created'}
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    currentStepData?.rowCount > 0
                                        ? 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                                        : 'bg-slate-800 text-slate-400'
                                }`}>
                                    {currentStepData?.rowCount || 0} Rows Stored
                                </span>
                            </div>

                            <div className="text-[11px] text-slate-400 font-sans pt-1">
                                💡 <strong>Syntax difference to remember:</strong> SQLite uses <code className="font-mono text-teal-300 bg-slate-800 px-1 rounded">?</code> for parameter placeholders, whereas MySQL uses <code className="font-mono text-teal-300 bg-slate-800 px-1 rounded">%s</code>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

