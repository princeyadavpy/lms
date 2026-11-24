import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Sliders, HardDrive, Sparkles, CheckCircle2, ArrowRight,
    ArrowDown, FileText, Check, Layers, RefreshCw, BarChart2
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 3: NumPy Array Processing & File I/O
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'axis-aggregations',
        label: 'Multi-Axis Aggregations (axis=0 vs axis=1)',
        code: `import numpy as np

# 2x3 Matrix
m = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print("Total Sum: ", m.sum())        # 21
print("Mean:      ", m.mean())       # 3.5
print("Axis=0 (Columns Sum):", m.sum(axis=0))  # [5, 7, 9] (Vertical)
print("Axis=1 (Rows Sum):   ", m.sum(axis=1))  # [6, 15]   (Horizontal)

# Conditional replacement with np.where
flags = np.where(m > 3, "HIGH", "LOW")
print("np.where flags:\\n", flags)`,
        steps: [
            {
                lineNum: 4,
                action: 'load_m',
                detail: '2x3 Matrix initialized: [[1, 2, 3], [4, 5, 6]]',
                activeAxis: null,
                axisResult: null,
                explanation: 'Allocates a 2x3 matrix for multi-axis compression.',
                variables: { m: '2x3 array' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'calc_total_sum',
                detail: 'm.sum() compresses all 6 elements → 21',
                activeAxis: 'total',
                axisResult: 21,
                explanation: '1 + 2 + 3 + 4 + 5 + 6 = 21.',
                variables: { total: 21 },
                outputs: ['Total Sum:  21']
            },
            {
                lineNum: 10,
                action: 'calc_mean',
                detail: 'm.mean() calculates average → 3.5',
                activeAxis: 'mean',
                axisResult: 3.5,
                explanation: '21 / 6 = 3.5.',
                variables: { mean: 3.5 },
                outputs: ['Total Sum:  21', 'Mean:       3.5']
            },
            {
                lineNum: 11,
                action: 'compress_axis_0',
                detail: 'm.sum(axis=0) compresses vertically down columns → [5, 7, 9]',
                activeAxis: 'axis0',
                axisResult: [5, 7, 9],
                explanation: 'Col 0: 1+4=5, Col 1: 2+5=7, Col 2: 3+6=9.',
                variables: { col_sums: '[5, 7, 9]' },
                outputs: ['Total Sum:  21', 'Mean:       3.5', 'Axis=0 (Columns Sum): [5 7 9]']
            },
            {
                lineNum: 12,
                action: 'compress_axis_1',
                detail: 'm.sum(axis=1) compresses horizontally across rows → [6, 15]',
                activeAxis: 'axis1',
                axisResult: [6, 15],
                explanation: 'Row 0: 1+2+3=6, Row 1: 4+5+6=15.',
                variables: { row_sums: '[6, 15]' },
                outputs: [
                    'Total Sum:  21',
                    'Mean:       3.5',
                    'Axis=0 (Columns Sum): [5 7 9]',
                    'Axis=1 (Rows Sum):    [ 6 15]'
                ]
            },
            {
                lineNum: 15,
                action: 'apply_where',
                detail: 'np.where(m > 3, "HIGH", "LOW") conditional matrix transform',
                activeAxis: 'where',
                axisResult: null,
                explanation: 'Replaces elements > 3 with "HIGH" and <= 3 with "LOW".',
                variables: { flags: '[["LOW", "LOW", "LOW"], ["HIGH", "HIGH", "HIGH"]]' },
                outputs: [
                    'Total Sum:  21',
                    'Mean:       3.5',
                    'Axis=0 (Columns Sum): [5 7 9]',
                    'Axis=1 (Rows Sum):    [ 6 15]',
                    'np.where flags:\n [[\'LOW\' \'LOW\' \'LOW\']\n [\'HIGH\' \'HIGH\' \'HIGH\']]'
                ]
            }
        ]
    }
];

export default function NumpyProcessingFileIOVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
                            <Sliders className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                NumPy: Array Processing &amp; File I/O
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
                                        ? 'bg-cyan-600 text-white shadow-xs'
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
                        badgeText="Axis Compressor"
                        fileName="numpy_processing.py"
                        accentColor="#0891b2"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
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
                                <Sliders className="w-4 h-4 text-cyan-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Dimensional Axis Compressor
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded">
                                Active Axis: {currentStepData?.activeAxis ? currentStepData.activeAxis.toUpperCase() : 'NONE'}
                            </span>
                        </div>

                        {/* MATRIX WITH AXIS COMPRESSION BEAMS */}
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span>ORIGINAL 2x3 MATRIX</span>
                                <span className="text-cyan-300">
                                    {currentStepData?.activeAxis === 'axis0' ? 'COMPRESSING AXIS=0 (Vertical ⬇)' : currentStepData?.activeAxis === 'axis1' ? 'COMPRESSING AXIS=1 (Horizontal ➡)' : 'IDLE'}
                                </span>
                            </div>

                            <div className="grid grid-cols-4 gap-2 text-center">
                                {/* Row 0 */}
                                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-bold text-slate-200">1</div>
                                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-bold text-slate-200">2</div>
                                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-bold text-slate-200">3</div>
                                <div className={`p-2.5 rounded font-bold transition-all ${
                                    currentStepData?.activeAxis === 'axis1'
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-slate-800 text-slate-500'
                                }`}>
                                    ➡ 6
                                </div>

                                {/* Row 1 */}
                                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-bold text-slate-200">4</div>
                                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-bold text-slate-200">5</div>
                                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-bold text-slate-200">6</div>
                                <div className={`p-2.5 rounded font-bold transition-all ${
                                    currentStepData?.activeAxis === 'axis1'
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-slate-800 text-slate-500'
                                }`}>
                                    ➡ 15
                                </div>

                                {/* Vertical Column Sums (Axis=0) */}
                                <div className={`p-2 rounded font-bold transition-all ${
                                    currentStepData?.activeAxis === 'axis0'
                                        ? 'bg-cyan-600 text-white shadow-md'
                                        : 'bg-slate-800 text-slate-500'
                                }`}>
                                    ⬇ 5
                                </div>
                                <div className={`p-2 rounded font-bold transition-all ${
                                    currentStepData?.activeAxis === 'axis0'
                                        ? 'bg-cyan-600 text-white shadow-md'
                                        : 'bg-slate-800 text-slate-500'
                                }`}>
                                    ⬇ 7
                                </div>
                                <div className={`p-2 rounded font-bold transition-all ${
                                    currentStepData?.activeAxis === 'axis0'
                                        ? 'bg-cyan-600 text-white shadow-md'
                                        : 'bg-slate-800 text-slate-500'
                                }`}>
                                    ⬇ 9
                                </div>
                                <div className="p-2 text-slate-500 text-[10px]">Total: 21</div>
                            </div>
                        </div>

                        {/* AXIS CHEAT-SHEET BOX */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl space-y-1">
                                <div className="font-bold text-cyan-950 font-mono">axis=0 (Down Columns)</div>
                                <p className="text-[11px] text-slate-600">
                                    Collapses rows vertically. Produces a 1D result with 1 entry per column.
                                </p>
                            </div>

                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                                <div className="font-bold text-emerald-950 font-mono">axis=1 (Across Rows)</div>
                                <p className="text-[11px] text-slate-600">
                                    Collapses columns horizontally. Produces a 1D result with 1 entry per row.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

