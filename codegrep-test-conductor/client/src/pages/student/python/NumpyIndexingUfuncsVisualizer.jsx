import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Grid, Scissors, Sparkles, CheckCircle2, ArrowRight,
    RefreshCw, Layers, Zap, Eye, Copy
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 2: NumPy Indexing, Transposition & Ufuncs
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'indexing-slicing',
        label: '2D Coordinate Indexing & Slicing',
        code: `import numpy as np

# 3x3 Matrix
m = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])

print("Exact Cell [1, 2]:", m[1, 2])    # 6 (row 1, col 2)
print("Entire Column 1:  ", m[:, 1])    # [2, 5, 8]
print("Sub-Matrix [:2, 1:]:\\n", m[:2, 1:])  # [[2, 3], [5, 6]]

# Boolean Mask Filtering
a = np.array([10, 20, 30, 40, 50])
print("Filter a > 25:     ", a[a > 25])  # [30, 40, 50]`,
        steps: [
            {
                lineNum: 4,
                action: 'load_3x3',
                detail: '3x3 matrix initialized',
                highlightMode: 'none',
                highlightedCells: [],
                explanation: 'Allocates a 3x3 array with 9 elements.',
                variables: { m: '3x3 array' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'index_single_cell',
                detail: 'm[1, 2] selects Row 1, Column 2 → 6',
                highlightMode: 'cell',
                highlightedCells: ['1,2'],
                explanation: 'Direct coordinate indexing retrieves element 6.',
                variables: { 'm[1, 2]': 6 },
                outputs: ['Exact Cell [1, 2]: 6']
            },
            {
                lineNum: 11,
                action: 'slice_column',
                detail: 'm[:, 1] slices ALL rows (:) at Column 1 → [2, 5, 8]',
                highlightMode: 'col',
                highlightedCells: ['0,1', '1,1', '2,1'],
                explanation: 'Slicing with colon : selects every row across column index 1.',
                variables: { 'm[:, 1]': '[2, 5, 8]' },
                outputs: ['Exact Cell [1, 2]: 6', 'Entire Column 1:   [2 5 8]']
            },
            {
                lineNum: 12,
                action: 'slice_submatrix',
                detail: 'm[:2, 1:] slices Rows 0..1 and Cols 1..2 → [[2, 3], [5, 6]]',
                highlightMode: 'submatrix',
                highlightedCells: ['0,1', '0,2', '1,1', '1,2'],
                explanation: 'Extracts a 2x2 sub-matrix view without copying memory.',
                variables: { sub: '[[2, 3], [5, 6]]' },
                outputs: [
                    'Exact Cell [1, 2]: 6',
                    'Entire Column 1:   [2 5 8]',
                    'Sub-Matrix [:2, 1:]:\n [[2 3]\n [5 6]]'
                ]
            },
            {
                lineNum: 16,
                action: 'boolean_filter',
                detail: 'Boolean indexing: a[a > 25] filters elements > 25 → [30, 40, 50]',
                highlightMode: 'boolean',
                highlightedCells: [],
                explanation: 'Creates a boolean mask [False, False, True, True, True] and returns matching values.',
                variables: { filtered: '[30, 40, 50]' },
                outputs: [
                    'Exact Cell [1, 2]: 6',
                    'Entire Column 1:   [2 5 8]',
                    'Sub-Matrix [:2, 1:]:\n [[2 3]\n [5 6]]',
                    'Filter a > 25:      [30 40 50]'
                ]
            }
        ]
    },
    {
        id: 'transpose-ufuncs',
        label: 'Transposition (m.T) & Ufuncs',
        code: `import numpy as np

# 2x3 Matrix
m = np.array([[1, 2, 3], [4, 5, 6]])
print("Original Shape: ", m.shape)  # (2, 3)

# Transposition flips rows and columns
transposed = m.T
print("Transposed Shape:", transposed.shape)  # (3, 2)

# Universal Functions (Ufuncs) execute vectorized in C!
a = np.array([1, 4, 9, 16])
print("np.sqrt(a):     ", np.sqrt(a))  # [1. 2. 3. 4.]
print("Vectorized * 2: ", a * 2)       # [2, 8, 18, 32]`,
        steps: [
            {
                lineNum: 4,
                action: 'init_m',
                detail: '2x3 Matrix m initialized: shape (2, 3)',
                stage: 'original',
                explanation: 'Matrix with 2 rows and 3 columns.',
                variables: { m: '[[1, 2, 3], [4, 5, 6]]' },
                outputs: ['Original Shape:  (2, 3)']
            },
            {
                lineNum: 8,
                action: 'transpose_m',
                detail: 'm.T flips axes across diagonal: shape becomes (3, 2)',
                stage: 'transposed',
                explanation: 'Rows become columns and columns become rows without data copying (strided view).',
                variables: { transposed: '[[1, 4], [2, 5], [3, 6]]' },
                outputs: ['Original Shape:  (2, 3)', 'Transposed Shape: (3, 2)']
            },
            {
                lineNum: 13,
                action: 'ufunc_sqrt',
                detail: 'np.sqrt([1, 4, 9, 16]) calculates vectorized square roots in C',
                stage: 'ufunc',
                explanation: 'Ufuncs execute compiled C SIMD loops over entire arrays simultaneously.',
                variables: { sqrt: '[1. 2. 3. 4.]' },
                outputs: [
                    'Original Shape:  (2, 3)',
                    'Transposed Shape: (3, 2)',
                    'np.sqrt(a):      [1. 2. 3. 4.]'
                ]
            },
            {
                lineNum: 14,
                action: 'ufunc_mult',
                detail: 'a * 2 applies element-wise scalar broadcasting',
                stage: 'ufunc',
                explanation: 'Every element is multiplied by 2 in parallel.',
                variables: { multiplied: '[2 8 18 32]' },
                outputs: [
                    'Original Shape:  (2, 3)',
                    'Transposed Shape: (3, 2)',
                    'np.sqrt(a):      [1. 2. 3. 4.]',
                    'Vectorized * 2:  [ 2  8 18 32]'
                ]
            }
        ]
    }
];

export default function NumpyIndexingUfuncsVisualizer() {
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

    const matrix3x3 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];

    return (
        <div className="space-y-5 animate-fadeIn">
            {/* Top Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            <Scissors className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                NumPy: Indexing, Transposition &amp; Ufuncs
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
                        badgeText="Array Slicer"
                        fileName="numpy_indexing.py"
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

                {/* Right Column: Visual Box Diagrams */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Grid className="w-4 h-4 text-indigo-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    {selectedExample === 0 ? '2D Coordinate Grid Slicer' : 'Matrix Transpose & Vector Blaster'}
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                                {selectedExample === 0 ? 'Active Slice Highlight' : 'Vectorized Mode'}
                            </span>
                        </div>

                        {selectedExample === 0 ? (
                            /* 3x3 MATRIX SLICE VIEWER */
                            <div className="space-y-3">
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono space-y-2">
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                        <span>3x3 COORDINATE GRID</span>
                                        <span className="text-indigo-300 font-bold">
                                            Highlight: {currentStepData?.highlightMode ? currentStepData.highlightMode.toUpperCase() : 'NONE'}
                                        </span>
                                    </div>

                                    <div className="grid grid-rows-3 gap-2 max-w-xs mx-auto">
                                        {matrix3x3.map((row, r) => (
                                            <div key={r} className="grid grid-cols-3 gap-2">
                                                {row.map((val, c) => {
                                                    const cellKey = `${r},${c}`;
                                                    const isHighlighted = (currentStepData?.highlightedCells || []).includes(cellKey);
                                                    return (
                                                        <div
                                                            key={c}
                                                            className={`p-3 rounded-lg text-center font-bold text-sm transition-all duration-300 border ${
                                                                isHighlighted
                                                                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg scale-105 ring-2 ring-indigo-300'
                                                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                                            }`}
                                                        >
                                                            {val}
                                                            <div className="text-[9px] text-slate-400 font-normal mt-0.5 font-sans">
                                                                [{r},{c}]
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                                    💡 <strong>NumPy Slices are Views, not copies!</strong> Modifying elements inside <code className="font-mono bg-white px-1 rounded font-bold">m[:2, 1:]</code> modifies the original matrix <code className="font-mono">m</code> directly. Use <code className="font-mono">.copy()</code> if you require full isolation.
                                </div>
                            </div>
                        ) : (
                            /* TRANSPOSE & UFUNCS VIEWER */
                            <div className="space-y-3 font-mono text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                        <div className="text-slate-500 text-[10px]">ORIGINAL (2, 3)</div>
                                        <div className="font-bold text-slate-800">
                                            [[1, 2, 3],<br />&nbsp;[4, 5, 6]]
                                        </div>
                                    </div>

                                    <div className="p-3 bg-indigo-50 border border-indigo-300 rounded-xl space-y-1">
                                        <div className="text-indigo-700 font-bold text-[10px]">TRANSPOSED m.T (3, 2)</div>
                                        <div className="font-bold text-indigo-900">
                                            [[1, 4],<br />&nbsp;[2, 5],<br />&nbsp;[3, 6]]
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-900 rounded-xl text-white border border-slate-800 space-y-1.5">
                                    <div className="text-indigo-300 font-bold text-xs flex items-center gap-1.5">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        <span>Universal Functions (Ufuncs) in C:</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span>np.sqrt([1, 4, 9, 16])</span>
                                        <span className="text-emerald-400 font-bold">→ [1.0, 2.0, 3.0, 4.0]</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span>[1, 4, 9, 16] * 2</span>
                                        <span className="text-emerald-400 font-bold">→ [2, 8, 18, 32]</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

