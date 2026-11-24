import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Table, Database, Key, Sparkles, CheckCircle2, ArrowRight,
    Layers, Box, ShieldCheck, Code2, PlusCircle
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 3: DDL Operations: CREATE Databases & Tables
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'ddl-create-table',
        label: 'DDL: CREATE DATABASE & Table Schema',
        code: `import mysql.connector

conn = mysql.connector.connect(host="localhost", user="root")
cursor = conn.cursor()

# 1. Create Database namespace
cursor.execute("CREATE DATABASE IF NOT EXISTS school")
cursor.execute("USE school")

# 2. Carve out physical Table Schema
cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    course VARCHAR(30),
    marks INT
)
""")
print("DDL schema successfully etched onto disk!")`,
        steps: [
            {
                lineNum: 4,
                action: 'open_cursor',
                detail: 'cursor initialized on MySQL server',
                activeStage: 'connected',
                activeDb: null,
                tableCreated: false,
                explanation: 'Connects to database engine.',
                variables: { conn: '<MySQLConnection>', cursor: '<MySQLCursor>' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'create_db',
                detail: 'CREATE DATABASE IF NOT EXISTS school executed',
                activeStage: 'db_created',
                activeDb: 'school',
                tableCreated: false,
                explanation: 'Allocates the "school" schema directory on MySQL server.',
                variables: { activeDb: '"school"' },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'use_db',
                detail: 'USE school: Active database context selected',
                activeStage: 'db_selected',
                activeDb: 'school',
                tableCreated: false,
                explanation: 'Switches the session namespace to the "school" database.',
                variables: { activeDb: '"school"' },
                outputs: []
            },
            {
                lineNum: 11,
                action: 'create_table',
                detail: 'CREATE TABLE students with 4 defined columns & PRIMARY KEY',
                activeStage: 'table_created',
                activeDb: 'school',
                tableCreated: true,
                explanation: 'Carves out the physical schema columns (id, name, course, marks). DDL is auto-committed instantly!',
                variables: { table: 'students' },
                outputs: []
            },
            {
                lineNum: 19,
                action: 'ddl_complete',
                detail: 'DDL operation verified: Schema permanently etched onto disk',
                activeStage: 'table_created',
                activeDb: 'school',
                tableCreated: true,
                explanation: 'The students table structure is ready for DML insert operations.',
                variables: { table: 'students' },
                outputs: ['DDL schema successfully etched onto disk!']
            }
        ]
    }
];

export default function DDLOperationsVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            <Table className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                DDL Operations: CREATE Databases &amp; Tables
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
                                        ? 'bg-indigo-600 text-white shadow-xs'
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
                        badgeText="DDL Architect"
                        fileName="create_schema.py"
                        accentColor="#4f46e5"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Physical Table Schema Blueprint */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-indigo-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Active Database: {currentStepData?.activeDb ? `[ ${currentStepData.activeDb} ]` : 'None'}
                                </h3>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                currentStepData?.tableCreated
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-600'
                            }`}>
                                {currentStepData?.tableCreated ? 'TABLE SCHEMA ETCHED ✓' : 'Awaiting DDL Execution'}
                            </span>
                        </div>

                        {/* PHYSICAL TABLE BLUEPRINT BOX */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                <div className="flex items-center gap-1.5">
                                    <Table className="w-4 h-4 text-indigo-600" />
                                    <span>TABLE: students</span>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono font-normal">
                                    ENGINE = InnoDB
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                                {/* Column 1: id */}
                                <div className={`p-3 rounded-xl border-2 transition-all space-y-1 ${
                                    currentStepData?.tableCreated
                                        ? 'bg-indigo-50/90 border-indigo-500 shadow-xs'
                                        : 'bg-slate-50 border-slate-200 opacity-50'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 font-bold text-indigo-950">
                                            <Key className="w-3.5 h-3.5 text-amber-500" />
                                            <span>id</span>
                                        </div>
                                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold font-sans">
                                            PRIMARY KEY 🔑
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-slate-600">INT AUTO_INCREMENT</div>
                                </div>

                                {/* Column 2: name */}
                                <div className={`p-3 rounded-xl border-2 transition-all space-y-1 ${
                                    currentStepData?.tableCreated
                                        ? 'bg-indigo-50/90 border-indigo-500 shadow-xs'
                                        : 'bg-slate-50 border-slate-200 opacity-50'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-indigo-950">name</span>
                                        <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold font-sans">
                                            NOT NULL
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-slate-600">VARCHAR(50)</div>
                                </div>

                                {/* Column 3: course */}
                                <div className={`p-3 rounded-xl border-2 transition-all space-y-1 ${
                                    currentStepData?.tableCreated
                                        ? 'bg-indigo-50/90 border-indigo-500 shadow-xs'
                                        : 'bg-slate-50 border-slate-200 opacity-50'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-indigo-950">course</span>
                                        <span className="text-[9px] text-slate-400 font-sans">NULLABLE</span>
                                    </div>
                                    <div className="text-[11px] text-slate-600">VARCHAR(30)</div>
                                </div>

                                {/* Column 4: marks */}
                                <div className={`p-3 rounded-xl border-2 transition-all space-y-1 ${
                                    currentStepData?.tableCreated
                                        ? 'bg-indigo-50/90 border-indigo-500 shadow-xs'
                                        : 'bg-slate-50 border-slate-200 opacity-50'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-indigo-950">marks</span>
                                        <span className="text-[9px] text-slate-400 font-sans">INT</span>
                                    </div>
                                    <div className="text-[11px] text-slate-600">Integer (Whole Grade)</div>
                                </div>
                            </div>
                        </div>

                        {/* AUTO-COMMIT PRINCIPLE BOX */}
                        <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>DDL commands (CREATE, DROP, ALTER) are automatically permanent.</span>
                            </div>
                            <span className="text-[10px] font-mono text-amber-300 font-bold bg-slate-800 px-2 py-0.5 rounded">
                                No commit() needed
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

