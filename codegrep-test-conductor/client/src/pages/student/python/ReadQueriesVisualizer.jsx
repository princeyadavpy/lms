import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Database, Search, Sparkles, CheckCircle2, ArrowRight,
    Filter, Table, Box, Layers, Code2
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 5: READ Queries (SELECT, fetchall, fetchone)
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'read-fetchall',
        label: 'SELECT & cursor.fetchall()',
        code: `import mysql.connector

conn = mysql.connector.connect(host="localhost", user="root", database="school")
cursor = conn.cursor()

# 1. Execute SELECT query
cursor.execute("SELECT id, name, marks FROM students WHERE marks >= %s", (85,))

# 2. fetchall() drains all matching records into a Python list
rows = cursor.fetchall()
print("Drained Rows Count:", len(rows))

for row in rows:
    print(f"Student ID: {row[0]}, Name: {row[1]}, Marks: {row[2]}")`,
        steps: [
            {
                lineNum: 7,
                action: 'execute_select',
                detail: 'cursor.execute() filters students with marks >= 85',
                spigotMode: 'idle',
                serverReservoir: [
                    { id: 1, name: 'Asha', marks: 95 },
                    { id: 3, name: 'Meera', marks: 91 }
                ],
                fetchedRows: [],
                explanation: 'MySQL server executes query and generates a temporary result set in server memory.',
                variables: { cursor: '<MySQLCursor>' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'call_fetchall',
                detail: 'cursor.fetchall() drains all rows across the wire at once',
                spigotMode: 'fetchall',
                serverReservoir: [],
                fetchedRows: [
                    { id: 1, name: 'Asha', marks: 95 },
                    { id: 3, name: 'Meera', marks: 91 }
                ],
                explanation: 'fetchall() copies all rows from the server buffer into a Python list of tuples.',
                variables: { rows: "[(1, 'Asha', 95), (3, 'Meera', 91)]" },
                outputs: []
            },
            {
                lineNum: 11,
                action: 'print_count',
                detail: 'print("Drained Rows Count:", 2)',
                spigotMode: 'fetchall',
                serverReservoir: [],
                fetchedRows: [
                    { id: 1, name: 'Asha', marks: 95 },
                    { id: 3, name: 'Meera', marks: 91 }
                ],
                explanation: 'Len of fetched list is 2.',
                variables: { rows: "[(1, 'Asha', 95), (3, 'Meera', 91)]" },
                outputs: ['Drained Rows Count: 2']
            },
            {
                lineNum: 14,
                action: 'iterate_rows',
                detail: 'Iterates and prints formatted tuple records',
                spigotMode: 'fetchall',
                serverReservoir: [],
                fetchedRows: [
                    { id: 1, name: 'Asha', marks: 95 },
                    { id: 3, name: 'Meera', marks: 91 }
                ],
                explanation: 'Accesses tuple elements by numerical index: row[0], row[1], row[2].',
                variables: { rows: '[(1, ...), (3, ...)]' },
                outputs: [
                    'Drained Rows Count: 2',
                    'Student ID: 1, Name: Asha, Marks: 95',
                    'Student ID: 3, Name: Meera, Marks: 91'
                ]
            }
        ]
    },
    {
        id: 'dict-cursor',
        label: 'Dictionary Cursor (dictionary=True)',
        code: `import mysql.connector

conn = mysql.connector.connect(host="localhost", user="root", database="school")

# dictionary=True maps column names directly to dict keys!
dict_cursor = conn.cursor(dictionary=True)
dict_cursor.execute("SELECT id, name, marks FROM students LIMIT 1")

record = dict_cursor.fetchone()
print("Dictionary Record:", record)
print("Key Access:", record["name"], record["marks"])`,
        steps: [
            {
                lineNum: 6,
                action: 'create_dict_cursor',
                detail: 'conn.cursor(dictionary=True) initialized',
                isDictCursor: true,
                record: null,
                explanation: 'Configures cursor to output associative dictionaries instead of raw tuples.',
                variables: { dict_cursor: '<MySQLCursorDict>' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'fetch_dict_record',
                detail: 'dict_cursor.fetchone() yields {"id": 1, "name": "Asha", "marks": 95}',
                isDictCursor: true,
                record: { id: 1, name: 'Asha', marks: 95 },
                explanation: 'Rows are accessible cleanly via column name strings (record["name"]) rather than hardcoded integer indexes.',
                variables: { record: "{'id': 1, 'name': 'Asha', 'marks': 95}" },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'print_dict_record',
                detail: 'print("Dictionary Record:", record)',
                isDictCursor: true,
                record: { id: 1, name: 'Asha', marks: 95 },
                explanation: 'Prints dict representation.',
                variables: { record: "{'id': 1, 'name': 'Asha', 'marks': 95}" },
                outputs: ["Dictionary Record: {'id': 1, 'name': 'Asha', 'marks': 95}"]
            },
            {
                lineNum: 11,
                action: 'print_key_access',
                detail: 'record["name"] → "Asha", record["marks"] → 95',
                isDictCursor: true,
                record: { id: 1, name: 'Asha', marks: 95 },
                explanation: 'Readable, self-documenting code without magical index numbers.',
                variables: { record: "{'id': 1, 'name': 'Asha', 'marks': 95}" },
                outputs: [
                    "Dictionary Record: {'id': 1, 'name': 'Asha', 'marks': 95}",
                    'Key Access: Asha 95'
                ]
            }
        ]
    }
];

export default function ReadQueriesVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                            <Search className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                READ Queries (SELECT, fetchall, fetchone)
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
                                        ? 'bg-sky-600 text-white shadow-xs'
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
                        badgeText="Query Client"
                        fileName="select_queries.py"
                        accentColor="#0284c7"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
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
                        /* PRESET 1: SERVER RESERVOIR & FETCHALL SPIGOT             */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-sky-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Server Result Reservoir &amp; Fetch Spigot
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded">
                                    WHERE marks &gt;= 85
                                </span>
                            </div>

                            {/* Server Result Set Box */}
                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-2">
                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                    <span>MYSQL SERVER MEMORY BUFFER</span>
                                    <span className="text-sky-300">
                                        {currentStepData?.serverReservoir?.length ? '2 MATCHING ROWS WAITING' : 'DRAINED BY FETCHALL'}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    {(currentStepData?.serverReservoir || []).length > 0 ? (
                                        (currentStepData.serverReservoir).map(r => (
                                            <div key={r.id} className="p-2 bg-slate-950 border border-slate-800 rounded flex justify-between">
                                                <span>ID: {r.id} | Name: &quot;{r.name}&quot;</span>
                                                <span className="text-emerald-400 font-bold">Marks: {r.marks}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-slate-500 text-xs italic text-center py-2">
                                            Server reservoir empty (All rows transferred to Python client)
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Python Client Memory Container */}
                            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2 font-mono text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sky-950">Python Client List: rows = cursor.fetchall()</span>
                                    <span className="text-[10px] bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded">
                                        {currentStepData?.fetchedRows?.length || 0} Tuples Loaded
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    {(currentStepData?.fetchedRows || []).map(r => (
                                        <div key={r.id} className="p-2 bg-white rounded border border-sky-200 flex justify-between">
                                            <span className="text-slate-800 font-bold">({r.id}, &apos;{r.name}&apos;, {r.marks})</span>
                                            <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                                                row[0]={r.id}, row[1]=&apos;{r.name}&apos;, row[2]={r.marks}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ======================================================== */
                        /* PRESET 2: DICTIONARY CURSOR TRANSFORMER BOX              */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Table className="w-4 h-4 text-sky-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Standard Tuple vs Dictionary Cursor
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded">
                                    conn.cursor(dictionary=True)
                                </span>
                            </div>

                            {/* Comparison Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                    <div className="font-bold text-slate-700">Standard Cursor (Default)</div>
                                    <div className="p-2 bg-white border border-slate-200 rounded text-slate-800">
                                        (1, &apos;Asha&apos;, 95)
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-sans">
                                        Requires brittle index lookups: <code className="font-mono">row[1]</code>. Breaks if SQL column order changes!
                                    </div>
                                </div>

                                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                                    <div className="font-bold text-emerald-900">Dictionary Cursor (Recommended)</div>
                                    <div className="p-2 bg-white border border-emerald-300 rounded text-emerald-900 font-bold">
                                        &#123;&quot;id&quot;: 1, &quot;name&quot;: &quot;Asha&quot;, &quot;marks&quot;: 95&#125;
                                    </div>
                                    <div className="text-[10px] text-emerald-700 font-sans">
                                        Robust key lookups: <code className="font-mono">row[&quot;name&quot;]</code>. Completely immune to column ordering shifts!
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

