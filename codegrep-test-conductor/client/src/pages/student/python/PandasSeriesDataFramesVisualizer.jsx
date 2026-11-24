import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Table, Columns, Layers, PlusCircle, ArrowRight,
    Sparkles, CheckCircle2, Hash, Database, RefreshCw, BarChart2
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 4: Part B: Pandas - Series & DataFrames
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'pandas-series',
        label: '1. Pandas 1D Series (Labels & Indexing)',
        code: `import pandas as pd

# 1. Create 1D labeled Series
s = pd.Series([10, 20, 30], index=["a", "b", "c"])

# 2. Access by explicit label vs positional integer
print("Label index 'b':", s["b"])       # 20
print("Positional index 0:", s.iloc[0])  # 10

# 3. Vectorized scalar multiplication
s_doubled = s * 2
print("Doubled Series:")
print(s_doubled)`,
        steps: [
            {
                lineNum: 1,
                action: 'import_pandas',
                detail: 'import pandas as pd',
                structureType: 'series',
                data: null,
                activeKey: null,
                explanation: 'Imports Pandas analytical library with high-performance labeled structures.',
                variables: { pd: '<module pandas>' },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'create_series',
                detail: 's = pd.Series([10, 20, 30], index=["a", "b", "c"])',
                structureType: 'series',
                data: [
                    { label: 'a', pos: 0, val: 10, dtype: 'int64' },
                    { label: 'b', pos: 1, val: 20, dtype: 'int64' },
                    { label: 'c', pos: 2, val: 30, dtype: 'int64' }
                ],
                activeKey: null,
                explanation: 'Builds a 1D labeled pillar: values [10, 20, 30] mapped to explicit keys ["a", "b", "c"].',
                variables: { s: 'Series(a: 10, b: 20, c: 30)' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'access_label',
                detail: 's["b"] -> Label lookup at key "b"',
                structureType: 'series',
                data: [
                    { label: 'a', pos: 0, val: 10, dtype: 'int64' },
                    { label: 'b', pos: 1, val: 20, dtype: 'int64', highlighted: true, highlightType: 'label' },
                    { label: 'c', pos: 2, val: 30, dtype: 'int64' }
                ],
                activeKey: 'b',
                explanation: 'Lookup by explicit label index "b" returns 20 in O(1) time.',
                variables: { 's["b"]': 20 },
                outputs: ["Label index 'b': 20"]
            },
            {
                lineNum: 8,
                action: 'access_iloc',
                detail: 's.iloc[0] -> Positional index lookup at position 0',
                structureType: 'series',
                data: [
                    { label: 'a', pos: 0, val: 10, dtype: 'int64', highlighted: true, highlightType: 'pos' },
                    { label: 'b', pos: 1, val: 20, dtype: 'int64' },
                    { label: 'c', pos: 2, val: 30, dtype: 'int64' }
                ],
                activeKey: 'a',
                explanation: 's.iloc[0] looks up the underlying positional slot 0, yielding 10 regardless of custom labels.',
                variables: { 's.iloc[0]': 10 },
                outputs: ["Label index 'b': 20", "Positional index 0: 10"]
            },
            {
                lineNum: 11,
                action: 'vectorized_multiply',
                detail: 's_doubled = s * 2 (Vectorized SIMD broadcast)',
                structureType: 'series',
                data: [
                    { label: 'a', pos: 0, val: 20, originalVal: 10, dtype: 'int64', multiplied: true },
                    { label: 'b', pos: 1, val: 40, originalVal: 20, dtype: 'int64', multiplied: true },
                    { label: 'c', pos: 2, val: 60, originalVal: 30, dtype: 'int64', multiplied: true }
                ],
                activeKey: null,
                explanation: 'Multiplies every value by 2 simultaneously across the Series without Python loops.',
                variables: { s_doubled: 'Series(a: 20, b: 40, c: 60)' },
                outputs: ["Label index 'b': 20", "Positional index 0: 10", "Doubled Series:"]
            },
            {
                lineNum: 13,
                action: 'print_doubled',
                detail: 'print(s_doubled) outputs formatted series with dtype: int64',
                structureType: 'series',
                data: [
                    { label: 'a', pos: 0, val: 20, dtype: 'int64' },
                    { label: 'b', pos: 1, val: 40, dtype: 'int64' },
                    { label: 'c', pos: 2, val: 60, dtype: 'int64' }
                ],
                activeKey: null,
                explanation: 'Complete doubled Series output printed to standard console.',
                variables: { s_doubled: 'Series(a: 20, b: 40, c: 60)' },
                outputs: [
                    "Label index 'b': 20",
                    "Positional index 0: 10",
                    "Doubled Series:",
                    "a    20\nb    40\nc    60\ndtype: int64"
                ]
            }
        ]
    },
    {
        id: 'pandas-dataframe',
        label: '2. DataFrame 2D Table & Computed Columns',
        code: `import pandas as pd

# 1. Construct 2D DataFrame from Dictionary
df = pd.DataFrame({
    "name":   ["Asha", "Ravi", "Meera", "Karan"],
    "dept":   ["IT", "HR", "IT", "HR"],
    "salary": [50000, 42000, 61000, 39000]
})

print("Shape:", df.shape)  # (4, 3)

# 2. Add computed column via vectorization
df["bonus"] = df["salary"] * 0.10
print(df[["name", "salary", "bonus"]])`,
        steps: [
            {
                lineNum: 1,
                action: 'import_pandas',
                detail: 'import pandas as pd',
                structureType: 'dataframe',
                dfData: null,
                hasBonus: false,
                explanation: 'Pandas imported.',
                variables: { pd: '<module pandas>' },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'create_df',
                detail: 'df = pd.DataFrame({...}) allocated in memory',
                structureType: 'dataframe',
                dfData: [
                    { idx: 0, name: 'Asha', dept: 'IT', salary: 50000 },
                    { idx: 1, name: 'Ravi', dept: 'HR', salary: 42000 },
                    { idx: 2, name: 'Meera', dept: 'IT', salary: 61000 },
                    { idx: 3, name: 'Karan', dept: 'HR', salary: 39000 }
                ],
                hasBonus: false,
                explanation: 'Allocates a 2D tabular sheet: 4 rows by 3 columns with heterogeneous datatypes.',
                variables: { 'df.shape': '(4, 3)' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'check_shape',
                detail: 'df.shape -> (4, 3) -> 4 rows, 3 columns',
                structureType: 'dataframe',
                dfData: [
                    { idx: 0, name: 'Asha', dept: 'IT', salary: 50000 },
                    { idx: 1, name: 'Ravi', dept: 'HR', salary: 42000 },
                    { idx: 2, name: 'Meera', dept: 'IT', salary: 61000 },
                    { idx: 3, name: 'Karan', dept: 'HR', salary: 39000 }
                ],
                hasBonus: false,
                explanation: 'Inspects dataframe dimensions: 4 samples (axis 0), 3 features (axis 1).',
                variables: { 'df.shape': '(4, 3)' },
                outputs: ['Shape: (4, 3)']
            },
            {
                lineNum: 13,
                action: 'add_bonus_column',
                detail: 'df["bonus"] = df["salary"] * 0.10 generated',
                structureType: 'dataframe',
                dfData: [
                    { idx: 0, name: 'Asha', dept: 'IT', salary: 50000, bonus: 5000.0, newlyAdded: true },
                    { idx: 1, name: 'Ravi', dept: 'HR', salary: 42000, bonus: 4200.0, newlyAdded: true },
                    { idx: 2, name: 'Meera', dept: 'IT', salary: 61000, bonus: 6100.0, newlyAdded: true },
                    { idx: 3, name: 'Karan', dept: 'HR', salary: 39000, bonus: 3900.0, newlyAdded: true }
                ],
                hasBonus: true,
                explanation: 'Vectorized operation computes 10% of salary and immediately attaches a 4th column "bonus" (float64).',
                variables: { 'df.shape': '(4, 4)', 'df.columns': "['name', 'dept', 'salary', 'bonus']" },
                outputs: ['Shape: (4, 3)']
            },
            {
                lineNum: 14,
                action: 'print_df',
                detail: 'print(df[["name", "salary", "bonus"]])',
                structureType: 'dataframe',
                dfData: [
                    { idx: 0, name: 'Asha', dept: 'IT', salary: 50000, bonus: 5000.0 },
                    { idx: 1, name: 'Ravi', dept: 'HR', salary: 42000, bonus: 4200.0 },
                    { idx: 2, name: 'Meera', dept: 'IT', salary: 61000, bonus: 6100.0 },
                    { idx: 3, name: 'Karan', dept: 'HR', salary: 39000, bonus: 3900.0 }
                ],
                hasBonus: true,
                explanation: 'Prints the customized slice with newly calculated bonus rewards.',
                variables: { 'df.shape': '(4, 4)' },
                outputs: [
                    'Shape: (4, 3)',
                    '    name  salary   bonus\n0   Asha   50000  5000.0\n1   Ravi   42000  4200.0\n2  Meera   61000  6100.0\n3  Karan   39000  3900.0'
                ]
            }
        ]
    }
];

export default function PandasSeriesDataFramesVisualizer() {
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

    // Dynamic Reactive Series Values
    const liveSeriesValues = useMemo(() => {
        try {
            const m = code.match(/pd\.Series\(\s*\[(.*?)\]/);
            if (m) {
                const nums = m[1].split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
                if (nums.length > 0) return nums;
            }
        } catch {}
        return [10, 20, 30];
    }, [code]);

    const handleSeriesIncrement = (idx) => {
        const next = Array.isArray(liveSeriesValues) ? [...liveSeriesValues] : [10, 20, 30];
        next[idx] = (next[idx] || 0) + 5;
        const updatedCode = code.replace(/pd\.Series\(\s*\[.*?\]/, `pd.Series([${next.join(', ')}]`);
        setCode(updatedCode);
        resetExecution();
    };

    return (
        <div className="space-y-5 animate-fadeIn font-sans">
            {/* Top Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-200/80">
                            <Table className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <span className="ref-label text-[10px]">MODULE 12 • TOPIC 4</span>
                            <h2 className="text-sm font-bold text-slate-900 leading-none mt-0.5">
                                Pandas: Series &amp; DataFrames
                            </h2>
                        </div>
                    </div>

                    {/* Example Selector Tabs */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {EXAMPLES.map((ex, idx) => (
                            <button
                                key={ex.id}
                                onClick={() => handleSelectExample(idx)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedExample === idx
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
                                }`}
                            >
                                {ex.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Split Screen: Editor on Left, Live Diagrammatic Box on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Interactive Code Editor (5 cols) */}
                <div className="lg:col-span-5">
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
                        terminalLines={activeStepData ? activeStepData.outputs : []}
                    />
                </div>

                {/* Right Column: Dynamic Conceptual Boxes & Visualizer (7 cols) */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin] font-sans">
                    {/* Active Step Banner */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                                {currentStep + 1}
                            </span>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900">
                                    {activeStepData ? activeStepData.detail : 'Press "Run Code" or "Step Forward" to inspect'}
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                    {activeStepData ? activeStepData.explanation : 'Interactive step execution will animate Pandas Series and DataFrame structures.'}
                                </p>
                            </div>
                        </div>
                        {activeStepData && (
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded font-semibold">
                                Line {activeStepData.lineNum}
                            </span>
                        )}
                    </div>

                    {/* Visual Canvas: Diagrammatic Boxes */}
                    <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="ref-label">
                                <Table className="w-4 h-4 text-slate-700" />
                                <span>
                                    {EXAMPLES[selectedExample].id === 'pandas-series' ? 'PANDAS 1D SERIES ARCHITECTURE' : 'PANDAS 2D TABULAR DATAFRAME ARCHITECTURE'}
                                </span>
                            </div>
                            <span className="ref-badge-green font-mono">
                                {EXAMPLES[selectedExample].id === 'pandas-series' ? '1D Pillar' : '2D Table'}
                            </span>
                        </div>

                        {/* CASE 1: Series 1D Architecture */}
                        {EXAMPLES[selectedExample].id === 'pandas-series' && (
                            <div className="space-y-4">
                                {!activeStepData || !activeStepData.data ? (
                                    <div className="py-12 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        Click "Step Forward" to allocate pd.Series([10, 20, 30], index=["a", "b", "c"])
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-fadeInUp">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {Array.isArray(activeStepData.data) && activeStepData.data.map((item) => {
                                                const originalVal = Array.isArray(liveSeriesValues) && liveSeriesValues[item.pos] !== undefined
                                                    ? liveSeriesValues[item.pos]
                                                    : item.val;
                                                const currentVal = item.multiplied ? originalVal * 2 : originalVal;

                                                return (
                                                    <div
                                                        key={item.label}
                                                        onClick={() => handleSeriesIncrement(item.pos)}
                                                        title="Click cell to increment by 5"
                                                        className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:scale-102 ${
                                                            item.highlighted
                                                                ? item.highlightType === 'label'
                                                                    ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                                                                    : 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-300'
                                                                : item.multiplied
                                                                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
                                                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-2">
                                                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                                                                Pos: {item.pos}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
                                                                Label: '{item.label}'
                                                            </span>
                                                        </div>
                                                        <div className="flex items-baseline justify-between">
                                                            <div className="text-2xl font-black text-slate-800">
                                                                {currentVal}
                                                            </div>
                                                            {item.multiplied && (
                                                                <div className="text-[11px] text-slate-400 line-through">
                                                                    was {liveSeriesValues[item.pos]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200/60 pt-1.5 font-mono">
                                                            <span>dtype: {item.dtype}</span>
                                                            {item.highlighted && (
                                                                <span className="text-amber-700 font-bold">
                                                                    {item.highlightType === 'label' ? `s["${item.label}"]` : `s.iloc[${item.pos}]`}
                                                                </span>
                                                            )}
                                                            {item.multiplied && (
                                                                <span className="text-indigo-600 font-bold">x2 broadcast</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Series Key takeaway box */}
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs text-slate-700">
                                            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span>
                                                <strong>Two Indexing Systems:</strong> Label Index <code>s["b"]</code> accesses by user-specified names. Position Index <code>s.iloc[0]</code> accesses by 0-based integer offset!
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CASE 2: DataFrame 2D Tabular Architecture */}
                        {EXAMPLES[selectedExample].id === 'pandas-dataframe' && (
                            <div className="space-y-4">
                                {!activeStepData || !activeStepData.dfData ? (
                                    <div className="py-12 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        Click "Step Forward" to construct 2D pd.DataFrame
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-fadeInUp">
                                        {/* Tabular Box */}
                                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                                            <table className="w-full text-left border-collapse text-xs">
                                                <thead>
                                                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                                                        <th className="p-2.5 text-center font-mono text-slate-400">#</th>
                                                        <th className="p-2.5">name <span className="text-[10px] text-slate-400 font-normal">(object)</span></th>
                                                        <th className="p-2.5">dept <span className="text-[10px] text-slate-400 font-normal">(object)</span></th>
                                                        <th className="p-2.5">salary <span className="text-[10px] text-slate-400 font-normal">(int64)</span></th>
                                                        {activeStepData.hasBonus && (
                                                            <th className="p-2.5 bg-emerald-100 text-emerald-800 font-black animate-fadeIn">
                                                                bonus <span className="text-[10px] text-emerald-600 font-normal">(float64)</span>
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {activeStepData.dfData.map((row) => (
                                                        <tr key={row.idx} className="hover:bg-slate-50 transition-colors">
                                                            <td className="p-2.5 text-center font-mono text-slate-400 bg-slate-50/50 font-semibold">
                                                                {row.idx}
                                                            </td>
                                                            <td className="p-2.5 font-bold text-slate-800">{row.name}</td>
                                                            <td className="p-2.5">
                                                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                                                    row.dept === 'IT' ? 'bg-sky-100 text-sky-700' : 'bg-purple-100 text-purple-700'
                                                                }`}>
                                                                    {row.dept}
                                                                </span>
                                                            </td>
                                                            <td className="p-2.5 font-mono text-slate-700 font-semibold">
                                                                ₹{row.salary.toLocaleString()}
                                                            </td>
                                                            {activeStepData.hasBonus && (
                                                                <td className="p-2.5 font-mono font-bold text-emerald-700 bg-emerald-50/60 animate-fadeIn">
                                                                    +₹{row.bonus.toLocaleString()}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Computed Column Generation Pipeline Box */}
                                        {activeStepData.hasBonus && (
                                            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-fadeInUp">
                                                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                                                    <PlusCircle className="w-4 h-4 text-emerald-600" />
                                                    <span>Vectorized Column Generator: <code>df["salary"] * 0.10</code></span>
                                                </div>
                                                <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold font-mono">
                                                    +4 elements calculated in SIMD
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
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

