import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Columns, Layers, Filter, CheckCircle2, ArrowRight,
    Sparkles, AlertCircle, RefreshCw, Database, GitMerge, Sliders
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 5: Pandas Selecting (loc vs iloc) & Alignment
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'loc-vs-iloc',
        label: '1. loc (Label) vs iloc (Integer Position)',
        code: `import pandas as pd

df = pd.DataFrame({
    "name":   ["Asha", "Ravi", "Meera", "Karan"],
    "dept":   ["IT", "HR", "IT", "HR"],
    "salary": [50000, 42000, 61000, 39000]
}, index=["r0", "r1", "r2", "r3"])

# 1. loc: Label-based (Endpoint INCLUDED)
print("loc ['r0':'r2', ['name', 'salary']]:")
print(df.loc["r0":"r2", ["name", "salary"]])

# 2. iloc: Integer position-based (Endpoint EXCLUDED)
print("iloc [0:2, 0:2]:")
print(df.iloc[0:2, 0:2])

# 3. Boolean Filtering
high_earners = df[df["salary"] > 45000]
print("High Earners (> 45k):")
print(high_earners)`,
        steps: [
            {
                lineNum: 1,
                action: 'import_pandas',
                detail: 'import pandas as pd',
                mode: 'idle',
                selectedCells: [],
                explanation: 'Imports pandas for tabular slicing and indexing.',
                variables: { pd: '<module pandas>' },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'create_df',
                detail: 'df with labeled index ["r0", "r1", "r2", "r3"] created',
                mode: 'base',
                selectedCells: [],
                explanation: 'DataFrame created with explicit row labels r0..r3 and column headers.',
                variables: { 'df.shape': '(4, 3)' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'exec_loc',
                detail: 'df.loc["r0":"r2", ["name", "salary"]] -> Labels r0, r1, r2 (Endpoint Included!)',
                mode: 'loc',
                selectedRows: ['r0', 'r1', 'r2'],
                selectedCols: ['name', 'salary'],
                explanation: 'loc uses row labels and column names. Notice "r2" IS included because loc slices inclusive endpoints!',
                variables: { mode: 'loc (label)', endpoint: 'INCLUDED' },
                outputs: [
                    "loc ['r0':'r2', ['name', 'salary']]:",
                    "      name  salary\nr0   Asha   50000\nr1   Ravi   42000\nr2  Meera   61000"
                ]
            },
            {
                lineNum: 15,
                action: 'exec_iloc',
                detail: 'df.iloc[0:2, 0:2] -> Position offsets 0 and 1 only (Endpoint 2 Excluded!)',
                mode: 'iloc',
                selectedRows: ['r0', 'r1'],
                selectedCols: ['name', 'dept'],
                explanation: 'iloc uses standard 0-based integer indexes. 0:2 selects row 0 and 1, EXCLUDING position 2.',
                variables: { mode: 'iloc (integer position)', endpoint: 'EXCLUDED' },
                outputs: [
                    "loc ['r0':'r2', ['name', 'salary']]:",
                    "      name  salary\nr0   Asha   50000\nr1   Ravi   42000\nr2  Meera   61000",
                    "iloc [0:2, 0:2]:",
                    "      name dept\nr0   Asha   IT\nr1   Ravi   HR"
                ]
            },
            {
                lineNum: 19,
                action: 'exec_boolean',
                detail: 'df[df["salary"] > 45000] -> Mask [True, False, True, False]',
                mode: 'boolean',
                selectedRows: ['r0', 'r2'],
                selectedCols: ['name', 'dept', 'salary'],
                explanation: 'Evaluates salary > 45000 for each row. Only Asha (50k) and Meera (61k) evaluate to True!',
                variables: { mask: '[True, False, True, False]' },
                outputs: [
                    "loc ['r0':'r2', ['name', 'salary']]:",
                    "      name  salary\nr0   Asha   50000\nr1   Ravi   42000\nr2  Meera   61000",
                    "iloc [0:2, 0:2]:",
                    "      name dept\nr0   Asha   IT\nr1   Ravi   HR",
                    "High Earners (> 45k):",
                    "      name dept  salary\nr0   Asha   IT   50000\nr2  Meera   IT   61000"
                ]
            }
        ]
    },
    {
        id: 'index-alignment',
        label: '2. Automatic Index Alignment & NaN Preservation',
        code: `import pandas as pd

# Series A has keys ["x", "y"]
a = pd.Series([1, 2], index=["x", "y"])

# Series B has keys ["y", "z"]
b = pd.Series([10, 20], index=["y", "z"])

# Automatic Label Alignment in Pandas
result = a + b
print("Aligned Addition (a + b):")
print(result)`,
        steps: [
            {
                lineNum: 1,
                action: 'import_pandas',
                detail: 'import pandas as pd',
                stage: 'idle',
                explanation: 'Pandas imported.',
                variables: { pd: '<module pandas>' },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'init_series_a',
                detail: 'a = pd.Series([1, 2], index=["x", "y"]) created',
                stage: 'series_a',
                explanation: 'Series A holds: x -> 1, y -> 2.',
                variables: { a: 'x: 1, y: 2' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'init_series_b',
                detail: 'b = pd.Series([10, 20], index=["y", "z"]) created',
                stage: 'series_b',
                explanation: 'Series B holds: y -> 10, z -> 20. Note that only "y" appears in both!',
                variables: { a: 'x: 1, y: 2', b: 'y: 10, z: 20' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'align_addition',
                detail: 'result = a + b -> Automatic index union: {"x", "y", "z"}',
                stage: 'aligned',
                explanation: 'Pandas performs an outer join on labels: "x" lacks partner in B -> NaN; "y" matches (2 + 10) -> 12.0; "z" lacks partner in A -> NaN!',
                variables: { 'result["x"]': 'NaN', 'result["y"]': '12.0', 'result["z"]': 'NaN' },
                outputs: ['Aligned Addition (a + b):']
            },
            {
                lineNum: 12,
                action: 'print_result',
                detail: 'print(result) displays aligned series with float64 promoting NaN',
                stage: 'aligned_done',
                explanation: 'Values converted to float64 to support NaN IEEE 754 floating point markers.',
                variables: { 'result.dtype': 'float64' },
                outputs: [
                    'Aligned Addition (a + b):',
                    'x     NaN\ny    12.0\nz     NaN\ndtype: float64'
                ]
            }
        ]
    }
];

export default function PandasLocIlocAlignmentVisualizer() {
    const [selectedExample, setSelectedExample] = useState(0);
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [steps, setSteps] = useState(EXAMPLES[0].steps);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const intervalRef = useRef(null);

    const speedDelays = { slow: 1800, normal: 1100, fast: 600 };

    const handleSelectExample = (idx) => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setSelectedExample(idx);
        setCode(EXAMPLES[idx].code);
        setSteps(EXAMPLES[idx].steps);
        setCurrentStep(-1);
    };

    const resetExecution = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setCurrentStep(-1);
    };

    const stepForward = useCallback(() => {
        setCurrentStep(prev => {
            if (prev < steps.length - 1) return prev + 1;
            setIsRunning(false);
            return prev;
        });
    }, [steps.length]);

    const runCode = () => {
        if (currentStep >= steps.length - 1) {
            setCurrentStep(-1);
        }
        setIsRunning(true);
    };

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < steps.length - 1) return prev + 1;
                    setIsRunning(false);
                    return prev;
                });
            }, speedDelays[speed]);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, speed, steps.length]);

    const activeStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;
    const currentLineNum = activeStepData ? activeStepData.lineNum : null;
    const transitionInfo = getStepTransitionInfo(steps, currentStep);

    // Static sample DataFrame for Example 1
    const dfRows = [
        { label: 'r0', pos: 0, name: 'Asha', dept: 'IT', salary: 50000 },
        { label: 'r1', pos: 1, name: 'Ravi', dept: 'HR', salary: 42000 },
        { label: 'r2', pos: 2, name: 'Meera', dept: 'IT', salary: 61000 },
        { label: 'r3', pos: 3, name: 'Karan', dept: 'HR', salary: 39000 }
    ];

    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            Module 12 • Topic 5
                        </span>
                        <h2 className="text-lg font-bold text-slate-800">
                            Pandas Selecting (loc vs iloc) & Data Alignment
                        </h2>
                    </div>
                    
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2">
                    {EXAMPLES.map((ex, idx) => (
                        <button
                            key={ex.id}
                            onClick={() => handleSelectExample(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                selectedExample === idx
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                            {ex.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Code Editor (5 cols) */}
                <div className="lg:col-span-5">
                    <InteractiveEditorWithArrow
                        code={code}
                        currentLineNum={currentLineNum}
                        transitionInfo={transitionInfo}
                        isRunning={isRunning}
                        runCode={runCode}
                        stepForward={stepForward}
                        resetExecution={resetExecution}
                        speed={speed}
                        setSpeed={setSpeed}
                        terminalLines={activeStepData ? activeStepData.outputs : []}
                    />
                </div>

                {/* Right: Diagrammatic Boxes (7 cols) */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {/* Active Step Banner */}
                    <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                                {currentStep + 1}
                            </span>
                            <div>
                                <h4 className="text-xs font-bold text-blue-950">
                                    {activeStepData ? activeStepData.detail : 'Press "Run Code" or "Step Forward"'}
                                </h4>
                                <p className="text-[11px] text-blue-700">
                                    {activeStepData ? activeStepData.explanation : 'Learn how Pandas accesses data safely without positional ambiguities.'}
                                </p>
                            </div>
                        </div>
                        {activeStepData && (
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-200/70 text-blue-800 rounded font-semibold">
                                Line {activeStepData.lineNum}
                            </span>
                        )}
                    </div>

                    {/* Canvas Area */}
                    <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    {EXAMPLES[selectedExample].id === 'loc-vs-iloc' ? 'Interactive Selection Matrix' : 'Auto-Alignment Machine'}
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400">
                                {EXAMPLES[selectedExample].id === 'loc-vs-iloc' ? 'Endpoint Rule Comparison' : 'Union by Label'}
                            </span>
                        </div>

                        {/* CASE 1: loc vs iloc Matrix */}
                        {EXAMPLES[selectedExample].id === 'loc-vs-iloc' && (
                            <div className="space-y-4">
                                {/* Rule Badge Pill */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`p-3 rounded-xl border text-xs transition-all ${
                                        activeStepData?.mode === 'loc' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                        <div className="font-bold text-amber-900 flex items-center justify-between">
                                            <span>df.loc[start:stop]</span>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-200 text-amber-800 font-mono">LABEL</span>
                                        </div>
                                        <p className="text-[11px] text-amber-700 mt-1">Endpoint is <strong>INCLUDED</strong> (stop label is captured)</p>
                                    </div>
                                    <div className={`p-3 rounded-xl border text-xs transition-all ${
                                        activeStepData?.mode === 'iloc' ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                        <div className="font-bold text-emerald-900 flex items-center justify-between">
                                            <span>df.iloc[start:stop]</span>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-200 text-emerald-800 font-mono">INTEGER</span>
                                        </div>
                                        <p className="text-[11px] text-emerald-700 mt-1">Endpoint is <strong>EXCLUDED</strong> (like Python range)</p>
                                    </div>
                                </div>

                                {/* Table with Highlight Bounding */}
                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                                                <th className="p-2 text-center text-slate-400 font-mono">Pos</th>
                                                <th className="p-2 text-center text-purple-700 font-mono">Label</th>
                                                <th className="p-2">name</th>
                                                <th className="p-2">dept</th>
                                                <th className="p-2">salary</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dfRows.map((row) => {
                                                const isRowSelected = activeStepData?.selectedRows?.includes(row.label);
                                                return (
                                                    <tr key={row.label} className={`transition-colors ${
                                                        isRowSelected
                                                            ? activeStepData?.mode === 'loc'
                                                                ? 'bg-amber-50/70 font-semibold'
                                                                : activeStepData?.mode === 'iloc'
                                                                    ? 'bg-emerald-50/70 font-semibold'
                                                                    : 'bg-blue-50/70 font-semibold'
                                                            : 'hover:bg-slate-50'
                                                    }`}>
                                                        <td className="p-2 text-center font-mono text-slate-400 font-bold bg-slate-50/50">
                                                            {row.pos}
                                                        </td>
                                                        <td className="p-2 text-center font-mono font-bold text-purple-700 bg-purple-50/40">
                                                            '{row.label}'
                                                        </td>
                                                        <td className={`p-2 ${isRowSelected && activeStepData?.selectedCols?.includes('name') ? 'text-blue-900 font-black' : 'text-slate-700'}`}>
                                                            {row.name}
                                                        </td>
                                                        <td className={`p-2 ${isRowSelected && activeStepData?.selectedCols?.includes('dept') ? 'text-blue-900 font-black' : 'text-slate-700'}`}>
                                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                                                                {row.dept}
                                                            </span>
                                                        </td>
                                                        <td className={`p-2 font-mono ${isRowSelected && activeStepData?.selectedCols?.includes('salary') ? 'text-emerald-700 font-black' : 'text-slate-600'}`}>
                                                            ₹{row.salary.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* CASE 2: Automatic Index Alignment Machine */}
                        {EXAMPLES[selectedExample].id === 'index-alignment' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {/* Series A */}
                                    <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 space-y-2">
                                        <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                                            <span>Series A</span>
                                            <span className="text-[10px] font-mono text-blue-600">index: x, y</span>
                                        </div>
                                        <div className="space-y-1.5 text-xs font-mono">
                                            <div className="p-1.5 rounded bg-white border border-blue-200 flex justify-between">
                                                <span className="font-bold text-purple-700">'x':</span>
                                                <span className="text-slate-800 font-black">1</span>
                                            </div>
                                            <div className="p-1.5 rounded bg-white border border-blue-200 flex justify-between ring-2 ring-emerald-300">
                                                <span className="font-bold text-purple-700">'y':</span>
                                                <span className="text-slate-800 font-black">2</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alignment Merger Sign */}
                                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center">
                                        <GitMerge className="w-5 h-5 text-indigo-600 mb-1" />
                                        <span className="text-xs font-bold text-slate-800">Label Union (+)</span>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Key matching protects against positional offset bugs</p>
                                    </div>

                                    {/* Series B */}
                                    <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/60 space-y-2">
                                        <div className="text-xs font-bold text-purple-900 flex items-center justify-between">
                                            <span>Series B</span>
                                            <span className="text-[10px] font-mono text-purple-600">index: y, z</span>
                                        </div>
                                        <div className="space-y-1.5 text-xs font-mono">
                                            <div className="p-1.5 rounded bg-white border border-purple-200 flex justify-between ring-2 ring-emerald-300">
                                                <span className="font-bold text-purple-700">'y':</span>
                                                <span className="text-slate-800 font-black">10</span>
                                            </div>
                                            <div className="p-1.5 rounded bg-white border border-purple-200 flex justify-between">
                                                <span className="font-bold text-purple-700">'z':</span>
                                                <span className="text-slate-800 font-black">20</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Resulting Series Box */}
                                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 space-y-2">
                                    <div className="text-xs font-bold text-indigo-900 flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                            Aligned Result: <code>a + b</code>
                                        </span>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-200 text-indigo-800 font-bold">
                                            dtype: float64
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                                        <div className="p-2 bg-white rounded-lg border border-red-200 flex flex-col items-center">
                                            <span className="text-[10px] text-purple-700 font-bold">'x'</span>
                                            <span className="text-sm font-black text-rose-600 mt-1">NaN</span>
                                            <span className="text-[9px] text-slate-400 mt-0.5">Missing in B</span>
                                        </div>
                                        <div className="p-2 bg-white rounded-lg border border-emerald-300 ring-2 ring-emerald-200 flex flex-col items-center">
                                            <span className="text-[10px] text-purple-700 font-bold">'y'</span>
                                            <span className="text-sm font-black text-emerald-700 mt-1">12.0</span>
                                            <span className="text-[9px] text-emerald-600 font-bold mt-0.5">2 + 10 matched</span>
                                        </div>
                                        <div className="p-2 bg-white rounded-lg border border-red-200 flex flex-col items-center">
                                            <span className="text-[10px] text-purple-700 font-bold">'z'</span>
                                            <span className="text-sm font-black text-rose-600 mt-1">NaN</span>
                                            <span className="text-[9px] text-slate-400 mt-0.5">Missing in A</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Variables State Inspection Box */}
                        <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                                <span className="font-mono flex items-center gap-1.5 text-emerald-400 font-bold">
                                    <Database className="w-3.5 h-3.5" />
                                    Active Namespace & In-Memory Attributes
                                </span>
                                <span>Pandas v2.2 Engine</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                                {activeStepData && activeStepData.variables && Object.keys(activeStepData.variables).length > 0 ? (
                                    Object.entries(activeStepData.variables).map(([key, val]) => (
                                        <div key={key} className="flex items-center justify-between p-1.5 rounded bg-slate-800/80 border border-slate-700/50">
                                            <span className="text-amber-300 font-semibold">{key}:</span>
                                            <span className="text-slate-200">{String(val)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-500 italic text-[11px] col-span-2">No active variables loaded yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

