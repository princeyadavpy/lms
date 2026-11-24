import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Table,
    FileJson,
    FolderTree,
    Database,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Zap,
    Cpu,
    Boxes,
    FileSpreadsheet,
    Braces,
    Plus,
    Trash2,
    Sliders,
    ArrowUpDown,
    Check
} from 'lucide-react';

// ── Preset Examples for Topic 5.3 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'csv-reader-matrix',
        label: 'CSV Reader',
        format: 'csv',
        code: `import csv

# Reading rows as parsed string lists
with open("students.csv", "r") as f:
    reader = csv.reader(f)
    header = next(reader)
    print("Header columns:", header)
    
    for row in reader:
        print("Student record:", row)`
    },
    {
        id: 'csv-dict-reader',
        label: 'CSV DictReader',
        format: 'csv',
        code: `import csv

# DictReader maps header to dictionary keys
with open("students.csv", "r") as f:
    reader = csv.DictReader(f)
    for record in reader:
        name = record["Name"]
        score = int(record["Score"])
        print(f"{name} scored {score}")`
    },
    {
        id: 'json-dump-serialize',
        label: 'json.dump()',
        format: 'json',
        code: `import json

profile = {
    "name": "Asha",
    "scores": [95, 88, 92],
    "active": True,
    "advisor": None
}

# Serialize in-memory Python dict to student.json
with open("student.json", "w") as f:
    json.dump(profile, f, indent=2)

print("JSON file generated.")`
    },
    {
        id: 'json-load-deserialize',
        label: 'json.load()',
        format: 'json',
        code: `import json

# Deserialize student.json from disk into Python dict
with open("student.json", "r") as f:
    student_obj = json.load(f)

print("Restored Name:", student_obj["name"])
print("First Score:", student_obj["scores"][0])
print("Is Active?", student_obj["active"])`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `import json\nd = {"valid": True, "note": None}\ns = json.dumps(d)`,
        question: 'What do True and None convert to in the resulting JSON string?',
        options: [
            'True and None (unchanged)',
            'true and null',
            '1 and 0',
            '"True" and "None" strings'
        ],
        correct: 'true and null',
        explanation: 'JSON specifications enforce lowercase booleans (true / false) and null instead of Python True / False and None. json.dump/dumps handles this conversion automatically.'
    },
    {
        code: `import csv\n# row = ["101", "Asha", "95"]\n# total = row[2] + 5`,
        question: 'What happens when evaluating row[2] + 5 in Python without typecasting?',
        options: [
            '100 (numeric addition)',
            'TypeError: can only concatenate str (not "int") to str',
            '"955"',
            'ValueError'
        ],
        correct: 'TypeError: can only concatenate str (not "int") to str',
        explanation: 'csv.reader returns all field values as strings. row[2] is "95" (str), so adding an int raises TypeError. You must explicitly convert with int(row[2]).'
    }
];

// ── Initial Seed Data ────────────────────────────────────────────────────────
const INITIAL_CSV = [
    { id: '101', name: 'Asha Sharma', score: '95', status: 'Passed' },
    { id: '102', name: 'Ravi Verma', score: '88', status: 'Passed' },
    { id: '103', name: 'Priya Patel', score: '92', status: 'Passed' }
];

const INITIAL_JSON = {
    name: 'Asha',
    scores: [95, 88, 92],
    active: true,
    advisor: null
};

// ── Step Execution Engine ────────────────────────────────────────────────────
function executeStructuredCode(codeStr, csvRows, jsonData, delimiter) {
    const steps = [];
    const outputs = [];

    const addStep = (lineNum, action, detail, format, activeRowIdx, outputsSnapshot) => {
        steps.push({
            lineNum,
            action,
            detail,
            format,
            activeRowIdx,
            outputs: [...outputsSnapshot]
        });
    };

    if (codeStr.includes('header = next(reader)')) {
        addStep(1, 'import', 'Imported standard csv module', 'csv', -1, outputs);
        addStep(4, 'open', 'Opened students.csv on disk', 'csv', -1, outputs);
        addStep(5, 'reader', `Initialized csv.reader stream with delimiter "${delimiter}"`, 'csv', -1, outputs);

        outputs.push("Header columns: ['ID', 'Name', 'Score', 'Status']");
        addStep(7, 'header', 'next(reader) yielded header row (Row 0)', 'csv', 0, outputs);

        csvRows.forEach((row, i) => {
            const rowArr = [row.id, row.name, row.score, row.status];
            outputs.push(`Student record: ['${rowArr.join("', '")}']`);
            addStep(9, 'iter_row', `Parsed row ${i + 1} into Python list of strings`, 'csv', i, outputs);
        });
    } else if (codeStr.includes('DictReader')) {
        addStep(1, 'import', 'Imported csv module', 'csv', -1, outputs);
        addStep(4, 'open', 'Opened students.csv', 'csv', -1, outputs);
        addStep(5, 'dict_reader', 'csv.DictReader mapping header columns to dictionary keys', 'csv', -1, outputs);

        csvRows.forEach((row, i) => {
            outputs.push(`${row.name} scored ${row.score}`);
            addStep(7, 'dict_row', `DictReader row ${i + 1}: {"Name": "${row.name}", "Score": "${row.score}"}`, 'csv', i, outputs);
        });
    } else if (codeStr.includes('json.dump')) {
        addStep(1, 'import', 'Imported json module', 'json', -1, outputs);
        addStep(3, 'def_dict', 'Created in-memory Python dictionary profile', 'json', -1, outputs);
        addStep(11, 'open', 'Opened student.json in mode "w"', 'json', -1, outputs);
        addStep(12, 'dump', 'json.dump() serialized Python Dict to formatted JSON on disk (True -> true, None -> null)', 'json', -1, outputs);

        outputs.push('JSON file generated.');
        addStep(14, 'print', 'Persisted student.json successfully.', 'json', -1, outputs);
    } else if (codeStr.includes('json.load')) {
        addStep(1, 'import', 'Imported json module', 'json', -1, outputs);
        addStep(4, 'open', 'Opened student.json on disk', 'json', -1, outputs);
        addStep(5, 'load', 'json.load() deserialized JSON text into live Python dictionary with native types', 'json', -1, outputs);

        outputs.push(`Restored Name: ${jsonData.name}`);
        addStep(7, 'print', `Accessed student_obj["name"] -> "${jsonData.name}"`, 'json', -1, outputs);

        outputs.push(`First Score: ${jsonData.scores?.[0] ?? 95}`);
        addStep(8, 'print', `Accessed student_obj["scores"][0] -> ${jsonData.scores?.[0] ?? 95} (int)`, 'json', -1, outputs);

        outputs.push(`Is Active? ${jsonData.active ? 'True' : 'False'}`);
        addStep(9, 'print', `Accessed student_obj["active"] -> ${jsonData.active ? 'True' : 'False'} (bool)`, 'json', -1, outputs);
    } else {
        addStep(1, 'run', 'Executing structured file parsing', 'csv', 0, outputs);
        outputs.push('Structured processing completed.');
        addStep(3, 'done', 'Done', 'csv', -1, outputs);
    }

    return { steps, finalOutputs: outputs };
}

export default function StructuredDataVisualizer() {
    const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
    const [code, setCode] = useState(EXAMPLES[0].code);

    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const speedMs = speed === 'slow' ? 1600 : speed === 'normal' ? 900 : 400;

    const timerRef = useRef(null);

    // Active visual presentation format (csv or json)
    const currentExample = EXAMPLES.find(e => e.id === selectedExampleId) || EXAMPLES[0];
    const [activeFormatTab, setActiveFormatTab] = useState(currentExample.format);

    // ── Interactive Real-Time State ──
    const [csvRows, setCsvRows] = useState(INITIAL_CSV);
    const [delimiter, setDelimiter] = useState(',');
    const [selectedCell, setSelectedCell] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);

    const [jsonData, setJsonData] = useState(INITIAL_JSON);
    const [jsonIndent, setJsonIndent] = useState(2);
    const [isScoresCollapsed, setIsScoresCollapsed] = useState(false);
    const [newJsonKey, setNewJsonKey] = useState('');
    const [newJsonVal, setNewJsonVal] = useState('');

    // Challenge state
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleSelectExample = (id) => {
        const found = EXAMPLES.find(e => e.id === id);
        if (!found) return;
        setSelectedExampleId(id);
        setCode(found.code);
        setActiveFormatTab(found.format);
        resetExecution();
    };

    const resetExecution = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setExecutionState(null);
        setCurrentStepIdx(-1);
    };

    const runCode = () => {
        resetExecution();
        const state = executeStructuredCode(code, csvRows, jsonData, delimiter);
        setExecutionState(state);
        if (state.steps.length === 0) return;
        setCurrentStepIdx(0);
        setIsRunning(true);
    };

    useEffect(() => {
        if (!isRunning || !executionState) return;
        if (currentStepIdx >= executionState.steps.length - 1) {
            setIsRunning(false);
            return;
        }
        timerRef.current = setTimeout(() => {
            setCurrentStepIdx(prev => prev + 1);
        }, speedMs);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isRunning, currentStepIdx, executionState, speedMs]);

    const stepForward = () => {
        if (!executionState) {
            const state = executeStructuredCode(code, csvRows, jsonData, delimiter);
            setExecutionState(state);
            setCurrentStepIdx(0);
            return;
        }
        if (currentStepIdx < executionState.steps.length - 1) {
            setCurrentStepIdx(prev => prev + 1);
        }
    };

    const currentStep = executionState?.steps[currentStepIdx] || null;
    const currentLineNum = currentStep?.lineNum || null;
    const activeRowIdx = currentStep?.activeRowIdx !== undefined ? currentStep.activeRowIdx : -1;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    // ── Interactive CSV Handlers ──
    const handleSortBy = (key) => {
        const sorted = [...csvRows].sort((a, b) => {
            if (key === 'score') {
                return sortAsc ? Number(a.score) - Number(b.score) : Number(b.score) - Number(a.score);
            }
            return sortAsc ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
        });
        setCsvRows(sorted);
        setSortAsc(!sortAsc);
    };

    const handleAddStudent = () => {
        const nextId = String(100 + csvRows.length + 1);
        const names = ['Karan Singhania', 'Meera Rao', 'Vikram Joshi', 'Sunita Roy'];
        const randomName = names[csvRows.length % names.length];
        const randomScore = String(80 + Math.floor(Math.random() * 18));
        setCsvRows(prev => [...prev, { id: nextId, name: randomName, score: randomScore, status: 'Passed' }]);
    };

    const handleDeleteRow = (idx) => {
        setCsvRows(prev => prev.filter((_, i) => i !== idx));
        setSelectedCell(null);
    };

    // ── Interactive JSON Handlers ──
    const handleAddJsonKey = () => {
        if (!newJsonKey.trim()) return;
        let parsedVal = newJsonVal.trim();
        if (parsedVal === 'true') parsedVal = true;
        else if (parsedVal === 'false') parsedVal = false;
        else if (parsedVal === 'null') parsedVal = null;
        else if (!isNaN(Number(parsedVal)) && parsedVal !== '') parsedVal = Number(parsedVal);

        setJsonData(prev => ({
            ...prev,
            [newJsonKey.trim()]: parsedVal
        }));
        setNewJsonKey('');
        setNewJsonVal('');
    };

    const rawDelimitedText = [
        ['ID', 'Name', 'Score', 'Status'].join(delimiter),
        ...csvRows.map(r => [r.id, r.name, r.score, r.status].join(delimiter))
    ].join('\n');

    return (
        <div className="space-y-4">
            
            {/* ── 1. Top Header Card with Presets ── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                                Topic 5.3
                            </span>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Structured Data Engines: CSV & JSON
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Click table cells or sort columns in CSV, toggle delimiters, and expand/collapse interactive JSON object trees.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setActiveFormatTab('csv')}
                                className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    activeFormatTab === 'csv'
                                        ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <FileSpreadsheet className="w-3.5 h-3.5" />
                                <span>CSV Matrix</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFormatTab('json')}
                                className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    activeFormatTab === 'json'
                                        ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <FileJson className="w-3.5 h-3.5" />
                                <span>JSON Tree</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Presets Segmented Tabs */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-start gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
                        Presets:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 shrink-0">
                        {EXAMPLES.map((ex, i) => {
                            const isSelected = selectedExampleId === ex.id;
                            return (
                                <button
                                    key={ex.id}
                                    type="button"
                                    onClick={() => handleSelectExample(ex.id)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                        isSelected
                                            ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                    }`}
                                >
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                                        {i + 1}.
                                    </span>
                                    <span>{ex.label.replace(/^\d+\.\s*/, '')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── 2. Main Two-Column View ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                
                {/* ── Left Column: Interactive Code Editor ── */}
                <div className="lg:col-span-5">
                    <InteractiveEditorWithArrow
                        code={code}
                        setCode={setCode}
                        currentLineNum={currentLineNum}
                        transitionInfo={transitionInfo}
                        isRunning={isRunning}
                        runCode={runCode}
                        stepForward={stepForward}
                        resetExecution={resetExecution}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={currentStep ? currentStep.detail : 'Ready to execute'}
                        stepCounterText={executionState ? `Step ${currentStepIdx + 1}/${executionState.steps.length}` : 'Idle'}
                        terminalLines={terminalLines}
                        badgeText="Structured Parser"
                        fileName={activeFormatTab === 'csv' ? 'parse_csv.py' : 'parse_json.py'}
                        accentColor="#4f46e5"
                    />
                </div>

                {/* ── Right Column: Dual Structured Simulator (CSV or JSON) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Mode A: CSV 2D Table Matrix */}
                    {activeFormatTab === 'csv' && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        CSV 2D Matrix (<span className="text-emerald-600 font-mono">students.csv</span>)
                                    </h3>
                                </div>

                                {/* Delimiter Selector */}
                                <div className="flex items-center gap-1.5 text-xs font-mono">
                                    <span className="text-slate-400 text-[10px]">Delimiter:</span>
                                    {['comma (,)', 'tab (\\t)', 'pipe (|)', 'semicolon (;)'].map((d) => {
                                        const char = d.includes('tab') ? '\t' : d.includes('pipe') ? '|' : d.includes('semicolon') ? ';' : ',';
                                        const isSel = delimiter === char;
                                        return (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => setDelimiter(char)}
                                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                                    isSel ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                            >
                                                {char === '\t' ? '\\t' : char}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Raw Delimited File on Disk */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <span>Raw Stream on Disk:</span>
                                    <span className="text-[10px] font-normal text-slate-400">Updates live with delimiter</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 leading-relaxed overflow-x-auto whitespace-pre">
                                    {rawDelimitedText}
                                </div>
                            </div>

                            {/* Rendered Interactive 2D Grid in Python Memory */}
                            <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                        Parsed In-Memory 2D Matrix:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleAddStudent}
                                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer flex items-center gap-1 shadow-2xs"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Row</span>
                                    </button>
                                </div>

                                <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-100/80 font-mono text-[11px] text-slate-600 uppercase border-b border-slate-200">
                                            <tr>
                                                <th className="py-2.5 px-3">#</th>
                                                <th className="py-2.5 px-3 cursor-pointer hover:text-blue-600" onClick={() => handleSortBy('id')}>
                                                    <span className="flex items-center gap-1">ID <ArrowUpDown className="w-3 h-3 opacity-60" /></span>
                                                </th>
                                                <th className="py-2.5 px-3 cursor-pointer hover:text-blue-600" onClick={() => handleSortBy('name')}>
                                                    <span className="flex items-center gap-1">Name <ArrowUpDown className="w-3 h-3 opacity-60" /></span>
                                                </th>
                                                <th className="py-2.5 px-3 cursor-pointer hover:text-blue-600" onClick={() => handleSortBy('score')}>
                                                    <span className="flex items-center gap-1">Score <ArrowUpDown className="w-3 h-3 opacity-60" /></span>
                                                </th>
                                                <th className="py-2.5 px-3">Status</th>
                                                <th className="py-2.5 px-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-mono">
                                            {csvRows.map((r, i) => {
                                                const isActive = activeRowIdx === i;
                                                return (
                                                    <tr
                                                        key={i}
                                                        className={`transition-all duration-200 ${
                                                            isActive
                                                                ? 'bg-blue-50 font-bold text-blue-900 border-l-4 border-l-blue-600'
                                                                : 'hover:bg-slate-50 text-slate-700'
                                                        }`}
                                                    >
                                                        <td className="py-2 px-3 text-slate-400 text-[10px]">{i + 1}</td>
                                                        <td
                                                            className="py-2 px-3 cursor-pointer hover:underline text-blue-600"
                                                            onClick={() => setSelectedCell({ row: i, col: 'ID', val: r.id })}
                                                        >
                                                            {r.id}
                                                        </td>
                                                        <td
                                                            className="py-2 px-3 cursor-pointer hover:underline text-slate-900 font-semibold"
                                                            onClick={() => setSelectedCell({ row: i, col: 'Name', val: r.name })}
                                                        >
                                                            {r.name}
                                                        </td>
                                                        <td
                                                            className="py-2 px-3 cursor-pointer hover:underline text-emerald-600 font-bold"
                                                            onClick={() => setSelectedCell({ row: i, col: 'Score', val: r.score })}
                                                        >
                                                            {r.score}
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                                {r.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteRow(i)}
                                                                className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                                                                title="Delete row"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {selectedCell && (
                                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-mono flex items-center justify-between animate-fadeIn">
                                        <span>Inspecting Cell: Row {selectedCell.row + 1}, Column "{selectedCell.col}"</span>
                                        <span>Value: <strong>"{selectedCell.val}"</strong> (Parsed as &lt;class 'str'&gt;)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mode B: JSON Hierarchical Tree & Schema Mapper */}
                    {activeFormatTab === 'json' && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Braces className="w-4 h-4 text-indigo-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        JSON Hierarchical Graph (<span className="text-indigo-600 font-mono">student.json</span>)
                                    </h3>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-mono">
                                    <span className="text-slate-400 text-[10px]">Indent:</span>
                                    {[2, 4, null].map((ind, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setJsonIndent(ind)}
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                                                jsonIndent === ind ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {ind ? `${ind} spaces` : 'compact'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dual Side-by-Side: Raw JSON Text vs Python Data Types */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                
                                {/* Left: Raw JSON Document on Disk */}
                                <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs border border-slate-800 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                        Live Serialized JSON on Disk:
                                    </span>
                                    <div className="text-indigo-300 whitespace-pre leading-relaxed text-[11px] max-h-[160px] overflow-y-auto">
                                        {JSON.stringify(jsonData, null, jsonIndent)}
                                    </div>
                                </div>

                                {/* Right: Python Type Translation Matrix */}
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                                        Python ◄──► JSON Type Mapping:
                                    </span>

                                    <div className="space-y-1 font-mono text-[11px]">
                                        <div className="p-1 bg-white rounded border border-slate-200 flex justify-between items-center">
                                            <span className="text-blue-700 font-bold">dict &#123;&#125;</span>
                                            <span className="text-slate-400">◄──►</span>
                                            <span className="text-indigo-700 font-bold">object &#123;&#125;</span>
                                        </div>
                                        <div className="p-1 bg-white rounded border border-slate-200 flex justify-between items-center">
                                            <span className="text-blue-700 font-bold">list []</span>
                                            <span className="text-slate-400">◄──►</span>
                                            <span className="text-indigo-700 font-bold">array []</span>
                                        </div>
                                        <div className="p-1 bg-white rounded border border-slate-200 flex justify-between items-center">
                                            <span className="text-emerald-700 font-bold">True / False</span>
                                            <span className="text-slate-400">◄──►</span>
                                            <span className="text-indigo-700 font-bold">true / false</span>
                                        </div>
                                        <div className="p-1 bg-white rounded border border-slate-200 flex justify-between items-center">
                                            <span className="text-rose-700 font-bold">None</span>
                                            <span className="text-slate-400">◄──►</span>
                                            <span className="text-indigo-700 font-bold">null</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Interactive In-Memory Python Object Node Tree */}
                            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                                        <Boxes className="w-3.5 h-3.5 text-indigo-600" />
                                        <span>Interactive Object Node Inspector:</span>
                                    </span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-indigo-800 font-bold border border-indigo-200">
                                        type: &lt;class 'dict'&gt;
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100 shadow-2xs">
                                        <span className="text-[10px] text-slate-400 block">student_obj["name"]</span>
                                        <span className="text-indigo-900 font-bold">"{jsonData.name}"</span>
                                        <span className="text-[9px] text-blue-500 block mt-0.5">&lt;str&gt;</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100 shadow-2xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400">["scores"]</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsScoresCollapsed(!isScoresCollapsed)}
                                                className="text-[9px] text-indigo-600 underline cursor-pointer"
                                            >
                                                {isScoresCollapsed ? 'expand' : 'collapse'}
                                            </button>
                                        </div>
                                        <span className="text-indigo-900 font-bold">
                                            {isScoresCollapsed ? `[...${jsonData.scores?.length} items]` : JSON.stringify(jsonData.scores)}
                                        </span>
                                        <span className="text-[9px] text-blue-500 block mt-0.5">&lt;list&gt;</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100 shadow-2xs">
                                        <span className="text-[10px] text-slate-400 block">["active"]</span>
                                        <span className="text-emerald-600 font-bold">{String(jsonData.active)}</span>
                                        <span className="text-[9px] text-blue-500 block mt-0.5">&lt;bool&gt;</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100 shadow-2xs">
                                        <span className="text-[10px] text-slate-400 block">["advisor"]</span>
                                        <span className="text-rose-600 font-bold">{String(jsonData.advisor)}</span>
                                        <span className="text-[9px] text-blue-500 block mt-0.5">&lt;NoneType&gt;</span>
                                    </div>
                                </div>

                                {/* Interactive Add Custom Key to JSON */}
                                <div className="p-2.5 bg-white rounded-lg border border-indigo-100 space-y-2">
                                    <span className="text-[11px] font-bold text-slate-700 block">Add Key-Value to Python Dict:</span>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newJsonKey}
                                            onChange={(e) => setNewJsonKey(e.target.value)}
                                            placeholder='Key name (e.g. gpa)'
                                            className="px-2 py-1 text-xs border border-slate-200 rounded font-mono w-1/3 outline-none focus:border-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            value={newJsonVal}
                                            onChange={(e) => setNewJsonVal(e.target.value)}
                                            placeholder='Value (e.g. 3.9)'
                                            className="px-2 py-1 text-xs border border-slate-200 rounded font-mono flex-1 outline-none focus:border-indigo-500"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddJsonKey()}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddJsonKey}
                                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                                        >
                                            Add Key
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Interactive Quiz / Challenge Section ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-indigo-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Concept Check #{challengeIdx + 1}
                                </h3>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">CSV & JSON Standards</span>
                        </div>

                        <div className="p-3 bg-slate-900 rounded-lg text-slate-100 font-mono text-xs whitespace-pre">
                            {CHALLENGES[challengeIdx].code}
                        </div>

                        <p className="text-xs font-semibold text-slate-800">
                            {CHALLENGES[challengeIdx].question}
                        </p>

                        <div className="space-y-1.5">
                            {CHALLENGES[challengeIdx].options.map((opt, idx) => {
                                const isChosen = selectedAnswer === opt;
                                const isCorrect = opt === CHALLENGES[challengeIdx].correct;
                                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                                if (showExplanation) {
                                    if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                                    else if (isChosen) btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAnswer(opt);
                                            setShowExplanation(true);
                                        }}
                                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                                    >
                                        <span>{opt}</span>
                                        {showExplanation && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                        {showExplanation && isChosen && !isCorrect && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 leading-relaxed animate-fadeIn">
                                <span className="font-bold block mb-0.5">Explanation:</span>
                                {CHALLENGES[challengeIdx].explanation}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
