import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Grid, Box, Sparkles, CheckCircle2, ArrowRight,
    Cpu, HardDrive, Layers, RefreshCw, Hash
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 1: NumPy - Introduction & Creating Arrays
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'numpy-creation',
        label: 'NumPy Array Creation & Attributes',
        code: `import numpy as np

# 1. Create 2D Array from nested list
m = np.array([[1, 2, 3], [4, 5, 6]])

print("Shape:", m.shape)  # (2, 3) -> 2 rows, 3 columns
print("Dimensions:", m.ndim)  # 2
print("Total Elements:", m.size)  # 6
print("Data Type:", m.dtype)  # int64 (Contiguous Memory!)

# 2. Generator Functions
zeros = np.zeros((2, 3))
stepped = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]`,
        steps: [
            {
                lineNum: 1,
                action: 'import_numpy',
                detail: 'import numpy as np loaded',
                shape: null,
                matrixData: null,
                explanation: 'Loads NumPy C-accelerated linear algebra library.',
                variables: { np: '<module numpy>' },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'create_matrix',
                detail: 'm = np.array([[1, 2, 3], [4, 5, 6]]) allocated in memory',
                shape: [2, 3],
                matrixData: [[1, 2, 3], [4, 5, 6]],
                explanation: 'Allocates a contiguous homogeneous 2x3 block in RAM with zero pointer boxing overhead.',
                variables: { m: '[[1, 2, 3], [4, 5, 6]]' },
                outputs: []
            },
            {
                lineNum: 6,
                action: 'inspect_shape',
                detail: 'm.shape → (2, 3)',
                shape: [2, 3],
                matrixData: [[1, 2, 3], [4, 5, 6]],
                explanation: 'Shape indicates 2 rows and 3 columns.',
                variables: { 'm.shape': '(2, 3)' },
                outputs: ['Shape: (2, 3)']
            },
            {
                lineNum: 7,
                action: 'inspect_ndim',
                detail: 'm.ndim → 2 dimensions',
                shape: [2, 3],
                matrixData: [[1, 2, 3], [4, 5, 6]],
                explanation: 'ndim reports 2D matrix structure.',
                variables: { 'm.ndim': 2 },
                outputs: ['Shape: (2, 3)', 'Dimensions: 2']
            },
            {
                lineNum: 8,
                action: 'inspect_size',
                detail: 'm.size → 6 total elements',
                shape: [2, 3],
                matrixData: [[1, 2, 3], [4, 5, 6]],
                explanation: '2 * 3 = 6 contiguous numeric slots.',
                variables: { 'm.size': 6 },
                outputs: ['Shape: (2, 3)', 'Dimensions: 2', 'Total Elements: 6']
            },
            {
                lineNum: 9,
                action: 'inspect_dtype',
                detail: 'm.dtype → int64',
                shape: [2, 3],
                matrixData: [[1, 2, 3], [4, 5, 6]],
                explanation: 'Fixed 64-bit integer values packed side-by-side in cache.',
                variables: { 'm.dtype': 'int64' },
                outputs: ['Shape: (2, 3)', 'Dimensions: 2', 'Total Elements: 6', 'Data Type: int64']
            }
        ]
    }
];

export default function NumpyIntroArraysVisualizer() {
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

    // Dynamic Reactive Matrix Parsing
    const liveMatrix = useMemo(() => {
        try {
            const match = code.match(/np\.array\(\s*(\[\[[\s\S]*?\]\])\s*\)/);
            if (match) {
                const clean = match[1].replace(/'/g, '"');
                const parsed = JSON.parse(clean);
                if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
                    return parsed;
                }
            }
        } catch {}
        return [[1, 2, 3], [4, 5, 6]];
    }, [code]);

    const liveShape = useMemo(() => {
        const rows = Array.isArray(liveMatrix) ? liveMatrix.length : 2;
        const cols = (Array.isArray(liveMatrix) && Array.isArray(liveMatrix[0])) ? liveMatrix[0].length : 3;
        return [rows, cols];
    }, [liveMatrix]);

    const liveSize = useMemo(() => liveShape[0] * liveShape[1], [liveShape]);

    // Handle interactive cell click: increment value in code
    const handleCellClick = (rIdx, cIdx) => {
        if (!Array.isArray(liveMatrix) || !Array.isArray(liveMatrix[rIdx])) return;
        const nextMatrix = liveMatrix.map((row, r) =>
            Array.isArray(row)
                ? row.map((val, c) => (r === rIdx && c === cIdx ? Number(val || 0) + 1 : val))
                : row
        );
        const matrixStr = JSON.stringify(nextMatrix);
        const updatedCode = code.replace(/np\.array\(\s*\[\[[\s\S]*?\]\]\s*\)/, `np.array(${matrixStr})`);
        setCode(updatedCode);
        resetExecution();
    };

    const dynamicOutputs = useMemo(() => {
        const out = [];
        if (currentStep >= 2) out.push(`Shape: (${liveShape.join(', ')})`);
        if (currentStep >= 3) out.push(`Dimensions: 2`);
        if (currentStep >= 4) out.push(`Total Elements: ${liveSize}`);
        if (currentStep >= 5) out.push(`Data Type: int64`);
        return out;
    }, [currentStep, liveShape, liveSize]);

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
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-200/80">
                            <Grid className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <span className="ref-label text-[10px]">MODULE 12 • TOPIC 1</span>
                            <h2 className="text-sm font-bold text-slate-900 leading-none mt-0.5">
                                NumPy: Introduction &amp; Creating Arrays
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
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
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
                        terminalLines={dynamicOutputs}
                        badgeText="NumPy ndarray"
                        fileName="numpy_intro.py"
                        accentColor="#2563eb"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
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
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin] font-sans">
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="ref-label">
                                <Grid className="w-4 h-4 text-slate-700" />
                                <span>CONTIGUOUS 2D MATRIX FABRICATOR</span>
                            </div>
                            <span className="ref-badge-green font-mono">
                                {currentStep >= 1 ? `Shape: (${liveShape.join(', ')})` : 'Awaiting Allocation'}
                            </span>
                        </div>

                        {/* Interactive 2D Matrix Grid Display */}
                        {currentStep >= 1 ? (
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono space-y-3">
                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                    <span>{liveShape[0]}x{liveShape[1]} CONTIGUOUS MEMORY (CLICK CELL TO INCREMENT)</span>
                                    <span className="text-slate-300 font-bold">m = np.array(...)</span>
                                </div>

                                <div className="grid gap-2 max-w-xs mx-auto" style={{ gridTemplateRows: `repeat(${liveShape[0]}, minmax(0, 1fr))` }}>
                                    {Array.isArray(liveMatrix) && liveMatrix.map((row, rIdx) => (
                                        Array.isArray(row) && (
                                            <div key={rIdx} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${row.length || 1}, minmax(0, 1fr))` }}>
                                                {row.map((val, cIdx) => (
                                                    <button
                                                        key={cIdx}
                                                        type="button"
                                                        onClick={() => handleCellClick(rIdx, cIdx)}
                                                        title={`Click to increment element at [${rIdx}, ${cIdx}]`}
                                                        className="p-3 rounded-lg bg-slate-800 text-white text-center font-bold text-sm shadow-md border border-slate-700 hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                                    >
                                                        {val}
                                                        <div className="text-[9px] text-slate-400 font-normal mt-0.5 font-sans">
                                                            [{rIdx}, {cIdx}]
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-400 font-mono">
                                Press Run Code or Step Forward to allocate ndarray
                            </div>
                        )}

                        {/* Array Attributes Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center text-xs">
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="text-[10px] text-slate-400">shape</div>
                                <div className="font-bold text-slate-800">({liveShape.join(', ')})</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="text-[10px] text-slate-400">ndim</div>
                                <div className="font-bold text-slate-800">2</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="text-[10px] text-slate-400">size</div>
                                <div className="font-bold text-slate-800">{liveSize}</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="text-[10px] text-slate-400">dtype</div>
                                <div className="font-bold text-slate-900">int64</div>
                            </div>
                        </div>

                        {/* WHY NUMPY IS 50X FASTER BOX */}
                        <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs space-y-1">
                            <div className="font-bold text-amber-300">Why NumPy Crushes Native Python Lists:</div>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                                Python lists store references to scattered PyObject memory addresses. NumPy arrays store raw binary integers sequentially in memory, enabling CPU cache-locality and vector SIMD instructions!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

