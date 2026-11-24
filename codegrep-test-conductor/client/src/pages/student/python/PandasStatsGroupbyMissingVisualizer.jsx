import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    PieChart, BarChart3, Split, ArrowDown, Database,
    CheckCircle2, Sparkles, AlertTriangle, Trash2, ShieldCheck, Layers
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 6: Pandas Statistics, Groupby & Missing Data
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'groupby-split-apply-combine',
        label: '1. GroupBy: Split-Apply-Combine Funnel',
        code: `import pandas as pd

df = pd.DataFrame({
    "dept":   ["IT", "HR", "IT", "HR", "IT"],
    "salary": [50000, 42000, 60000, 38000, 70000]
})

# 1. Summary statistics
print("Overall Mean:", df["salary"].mean())

# 2. Split-Apply-Combine by Department
grouped = df.groupby("dept")["salary"].mean()
print("Mean Salary by Dept:")
print(grouped)`,
        steps: [
            {
                lineNum: 1,
                action: 'import_pandas',
                detail: 'import pandas as pd',
                phase: 'idle',
                groups: null,
                explanation: 'Imports pandas for data aggregation.',
                variables: { pd: '<module pandas>' },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'load_data',
                detail: 'df with 5 employees across IT and HR created',
                phase: 'initial',
                groups: null,
                explanation: 'Initial raw table contains 3 IT staff and 2 HR staff members.',
                variables: { 'df.shape': '(5, 2)' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'overall_mean',
                detail: 'df["salary"].mean() -> (50k + 42k + 60k + 38k + 70k) / 5 = 52,000',
                phase: 'mean',
                groups: null,
                explanation: 'Calculates global arithmetic mean across all 5 rows.',
                variables: { overall_mean: 52000.0 },
                outputs: ['Overall Mean: 52000.0']
            },
            {
                lineNum: 12,
                action: 'split_apply_combine',
                detail: 'df.groupby("dept")["salary"].mean() executed',
                phase: 'grouped',
                groups: {
                    IT: { salaries: [50000, 60000, 70000], mean: 60000.0 },
                    HR: { salaries: [42000, 38000], mean: 40000.0 }
                },
                explanation: '1. SPLIT: Separates into IT & HR buckets. 2. APPLY: Computes mean on each bucket. 3. COMBINE: Glues into resulting Series.',
                variables: { 'IT.mean': 60000.0, 'HR.mean': 40000.0 },
                outputs: ['Overall Mean: 52000.0', 'Mean Salary by Dept:']
            },
            {
                lineNum: 14,
                action: 'print_grouped',
                detail: 'print(grouped) outputs aggregated Series',
                phase: 'done',
                groups: {
                    IT: { salaries: [50000, 60000, 70000], mean: 60000.0 },
                    HR: { salaries: [42000, 38000], mean: 40000.0 }
                },
                explanation: 'Clean aggregated summary ready for executive reporting.',
                variables: { 'grouped.dtype': 'float64' },
                outputs: [
                    'Overall Mean: 52000.0',
                    'Mean Salary by Dept:',
                    'dept\nHR    40000.0\nIT    60000.0\nName: salary, dtype: float64'
                ]
            }
        ]
    },
    {
        id: 'missing-data-cleaning',
        label: '2. Missing Data Sanitization Station',
        code: `import pandas as pd
import numpy as np

# 1. Dirty data with NaN/None slots
df_dirty = pd.DataFrame({
    "a": [1.0, np.nan, 3.0],
    "b": ["x", "y", None]
})

print("NaN counts per column:")
print(df_dirty.isna().sum())

# 2. Impute with fillna()
cleaned = df_dirty.fillna({"a": 0.0, "b": "Unknown"})
print("Sanitized DataFrame:")
print(cleaned)`,
        steps: [
            {
                lineNum: 1,
                action: 'import_libs',
                detail: 'import pandas as pd, numpy as np',
                cleaningState: 'raw',
                explanation: 'Imports pandas and numpy.',
                variables: { pd: '<module pandas>', np: '<module numpy>' },
                outputs: []
            },
            {
                lineNum: 5,
                action: 'init_dirty',
                detail: 'df_dirty created with 2 missing cells (row 1 col "a", row 2 col "b")',
                cleaningState: 'dirty',
                explanation: 'Missing values in pandas represent missing, uncollected, or corrupted data points.',
                variables: { 'df_dirty.isna().sum()': 'a: 1, b: 1' },
                outputs: []
            },
            {
                lineNum: 11,
                action: 'count_nans',
                detail: 'df_dirty.isna().sum() tallies NaNs in each column',
                cleaningState: 'checked',
                explanation: 'Identifies 1 NaN in column "a" and 1 None in column "b".',
                variables: { 'a_missing': 1, 'b_missing': 1 },
                outputs: ['NaN counts per column:', 'a    1\nb    1\ndtype: int64']
            },
            {
                lineNum: 14,
                action: 'fillna_exec',
                detail: 'df_dirty.fillna({"a": 0.0, "b": "Unknown"}) performs targeted imputation',
                cleaningState: 'cleaned',
                explanation: 'Numeric NaN is filled with 0.0, string None is filled with "Unknown", leaving no missing holes!',
                variables: { 'cleaned.isna().sum()': 'a: 0, b: 0' },
                outputs: [
                    'NaN counts per column:',
                    'a    1\nb    1\ndtype: int64',
                    'Sanitized DataFrame:'
                ]
            },
            {
                lineNum: 16,
                action: 'print_cleaned',
                detail: 'print(cleaned) outputs pristine data ready for model training',
                cleaningState: 'done',
                explanation: 'Data cleansing complete without discarding valid rows.',
                variables: { 'cleaned.shape': '(3, 2)' },
                outputs: [
                    'NaN counts per column:',
                    'a    1\nb    1\ndtype: int64',
                    'Sanitized DataFrame:',
                    '     a        b\n0  1.0        x\n1  0.0        y\n2  3.0  Unknown'
                ]
            }
        ]
    }
];

export default function PandasStatsGroupbyMissingVisualizer() {
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

    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            Module 12 • Topic 6
                        </span>
                        <h2 className="text-lg font-bold text-slate-800">
                            Pandas Statistics, GroupBy & Missing Data
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
                                    {activeStepData ? activeStepData.explanation : 'Discover how group aggregations and data cleansing pipelines function.'}
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
                                <Split className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    {EXAMPLES[selectedExample].id === 'groupby-split-apply-combine' ? 'Split-Apply-Combine Funnel' : 'Missing Data Sanitization Station'}
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400">
                                {EXAMPLES[selectedExample].id === 'groupby-split-apply-combine' ? 'Aggregation Pipeline' : 'Data Integrity'}
                            </span>
                        </div>

                        {/* CASE 1: GroupBy Split-Apply-Combine Funnel */}
                        {EXAMPLES[selectedExample].id === 'groupby-split-apply-combine' && (
                            <div className="space-y-4">
                                {/* Funnel Visual Step 1: Raw Table */}
                                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                                    <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center justify-between">
                                        <span>1. Raw Mixed Table</span>
                                        <span className="font-mono text-slate-400">5 Records</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { dept: 'IT', sal: 50000 },
                                            { dept: 'HR', sal: 42000 },
                                            { dept: 'IT', sal: 60000 },
                                            { dept: 'HR', sal: 38000 },
                                            { dept: 'IT', sal: 70000 }
                                        ].map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 ${
                                                    item.dept === 'IT' ? 'bg-sky-50 border-sky-300 text-sky-800' : 'bg-purple-50 border-purple-300 text-purple-800'
                                                }`}
                                            >
                                                <span>{item.dept}</span>
                                                <span className="text-slate-600">₹{item.sal.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Funnel Arrow */}
                                <div className="flex justify-center">
                                    <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700 flex items-center gap-1.5">
                                        <Split className="w-3 h-3" />
                                        <span>SPLIT BY "dept" & APPLY mean()</span>
                                    </div>
                                </div>

                                {/* Funnel Step 2: Grouped Buckets */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* IT Bucket */}
                                    <div className={`p-3.5 rounded-xl border transition-all ${
                                        activeStepData?.groups ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-200' : 'bg-slate-50 border-slate-200 opacity-60'
                                    }`}>
                                        <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-2">
                                            <span>IT Group (3 rows)</span>
                                            <span className="font-mono text-sky-700">mean: ₹60,000</span>
                                        </div>
                                        <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-sky-200">
                                            (50k + 60k + 70k) / 3 = <strong>₹60,000</strong>
                                        </div>
                                    </div>

                                    {/* HR Bucket */}
                                    <div className={`p-3.5 rounded-xl border transition-all ${
                                        activeStepData?.groups ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-200' : 'bg-slate-50 border-slate-200 opacity-60'
                                    }`}>
                                        <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-2">
                                            <span>HR Group (2 rows)</span>
                                            <span className="font-mono text-purple-700">mean: ₹40,000</span>
                                        </div>
                                        <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-purple-200">
                                            (42k + 38k) / 2 = <strong>₹40,000</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Funnel Step 3: Combined Result Series */}
                                {activeStepData?.groups && (
                                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs animate-fadeInUp">
                                        <div className="flex items-center gap-2 text-emerald-900 font-bold">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span>COMBINE: Consolidated Series Output</span>
                                        </div>
                                        <span className="font-mono font-bold text-emerald-800">
                                            HR: ₹40k | IT: ₹60k
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CASE 2: Missing Data Sanitization Station */}
                        {EXAMPLES[selectedExample].id === 'missing-data-cleaning' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                                        <div className="font-bold text-red-900 flex items-center gap-1.5">
                                            <AlertTriangle className="w-4 h-4 text-red-600" />
                                            <span>df_dirty Missing Slots</span>
                                        </div>
                                        <p className="text-[11px] text-red-700">Column 'a': 1 NaN • Column 'b': 1 None</p>
                                    </div>
                                    <div className={`p-3 rounded-xl border transition-all ${
                                        activeStepData?.cleaningState === 'cleaned' || activeStepData?.cleaningState === 'done'
                                            ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                                            : 'bg-slate-50 border-slate-200'
                                    }`}>
                                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                            <span>fillna Imputation Policy</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600">Impute 'a' with 0.0 • Impute 'b' with "Unknown"</p>
                                    </div>
                                </div>

                                {/* Table Display */}
                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                                <th className="p-2 text-center text-slate-400 font-mono">Row</th>
                                                <th className="p-2">Column "a" (float64)</th>
                                                <th className="p-2">Column "b" (object)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr className="hover:bg-slate-50">
                                                <td className="p-2 text-center font-mono text-slate-400">0</td>
                                                <td className="p-2 font-mono font-bold text-slate-800">1.0</td>
                                                <td className="p-2 font-bold text-slate-800">"x"</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50">
                                                <td className="p-2 text-center font-mono text-slate-400">1</td>
                                                <td className="p-2 font-mono">
                                                    {activeStepData?.cleaningState === 'cleaned' || activeStepData?.cleaningState === 'done' ? (
                                                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                                                            0.0 (Imputed)
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold border border-red-300">
                                                            NaN (Missing)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-2 font-bold text-slate-800">"y"</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50">
                                                <td className="p-2 text-center font-mono text-slate-400">2</td>
                                                <td className="p-2 font-mono font-bold text-slate-800">3.0</td>
                                                <td className="p-2">
                                                    {activeStepData?.cleaningState === 'cleaned' || activeStepData?.cleaningState === 'done' ? (
                                                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                                                            "Unknown" (Imputed)
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold border border-red-300">
                                                            None (Missing)
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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

