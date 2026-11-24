import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Activity, BarChart2, PieChart, ScatterChart, TrendingUp,
    Sparkles, CheckCircle2, Layers, Sliders, Image, Download, Eye
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 7: Part C: Matplotlib - Visual Analytics
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'wave-analytics',
        label: '1. Dynamic Sine & Cosine Wave Plot',
        code: `import matplotlib.pyplot as plt
import numpy as np

# 1. Generate 100 continuous timeline points
x = np.linspace(0, 10, 100)

# 2. Plot sin(x) and cos(x) curves
plt.plot(x, np.sin(x), label="sin(x)", color="#2563eb", linestyle="--")
plt.plot(x, np.cos(x), label="cos(x)", color="#f59e0b")

# 3. Canvas Decoration & Layout
plt.title("Wave Analytics")
plt.xlabel("Timeline (x)")
plt.ylabel("Amplitude")
plt.legend()
plt.grid(True)
plt.savefig("chart.png", dpi=150)
plt.show()`,
        steps: [
            {
                lineNum: 1,
                action: 'import_matplotlib',
                detail: 'import matplotlib.pyplot as plt, numpy as np',
                canvasState: { hasSin: false, hasCos: false, hasGrid: false, hasLegend: false, title: '' },
                explanation: 'Imports Matplotlib functional state-machine interface (pyplot) and NumPy math engine.',
                variables: { plt: '<module matplotlib.pyplot>' },
                outputs: []
            },
            {
                lineNum: 5,
                action: 'generate_domain',
                detail: 'x = np.linspace(0, 10, 100) -> 100 points in interval [0, 10]',
                canvasState: { hasSin: false, hasCos: false, hasGrid: false, hasLegend: false, title: '' },
                explanation: 'Generates evenly spaced continuous timeline array for smooth curve rendering.',
                variables: { 'len(x)': 100, 'x[0]': 0.0, 'x[-1]': 10.0 },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'plot_sin',
                detail: 'plt.plot(x, np.sin(x), label="sin(x)", color="#2563eb", linestyle="--")',
                canvasState: { hasSin: true, hasCos: false, hasGrid: false, hasLegend: false, title: '' },
                explanation: 'Calculates sin(x) values in [-1, +1] and renders blue dashed trajectory onto the active Axes.',
                variables: { 'sin(x)[0]': 0.0, 'sin(x)[peak]': 1.0 },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'plot_cos',
                detail: 'plt.plot(x, np.cos(x), label="cos(x)", color="#f59e0b")',
                canvasState: { hasSin: true, hasCos: true, hasGrid: false, hasLegend: false, title: '' },
                explanation: 'Overlays cos(x) wave in amber with a 90-degree phase lead.',
                variables: { 'cos(x)[0]': 1.0, 'cos(x)[trough]': -1.0 },
                outputs: []
            },
            {
                lineNum: 12,
                action: 'add_decorations',
                detail: 'plt.title("Wave Analytics"), plt.xlabel(...), plt.ylabel(...)',
                canvasState: { hasSin: true, hasCos: true, hasGrid: false, hasLegend: false, title: 'Wave Analytics' },
                explanation: 'Attaches cartesian coordinate labels and main figure title.',
                variables: { title: 'Wave Analytics', xlabel: 'Timeline (x)', ylabel: 'Amplitude' },
                outputs: []
            },
            {
                lineNum: 15,
                action: 'add_legend_grid',
                detail: 'plt.legend() & plt.grid(True) enabled',
                canvasState: { hasSin: true, hasCos: true, hasGrid: true, hasLegend: true, title: 'Wave Analytics' },
                explanation: 'Enables coordinate grid lines and interactive colored line legend for readability.',
                variables: { grid: true, legend: 'sin(x), cos(x)' },
                outputs: []
            },
            {
                lineNum: 17,
                action: 'save_and_show',
                detail: 'plt.savefig("chart.png", dpi=150) -> Saved high-resolution PNG artifact',
                canvasState: { hasSin: true, hasCos: true, hasGrid: true, hasLegend: true, title: 'Wave Analytics', saved: true },
                explanation: 'Renders vectors into raster buffer at 150 DPI and invokes GUI backend display.',
                variables: { file_saved: 'chart.png (150 DPI)' },
                outputs: ['<Figure size 640x480 with 1 Axes>', 'chart.png successfully generated.']
            }
        ]
    },
    {
        id: 'archetypes',
        label: '2. Five Essential Matplotlib Archetypes',
        code: `import matplotlib.pyplot as plt

# 1. Line Plot: plt.plot(x, y)          -> Trends over time
# 2. Bar Chart: plt.bar(categories, val) -> Category comparisons
# 3. Histogram: plt.hist(samples, bins)  -> Frequency distributions
# 4. Scatter:   plt.scatter(x, y)        -> Variable correlations
# 5. Pie Chart: plt.pie(sizes, labels)   -> Proportions of a whole

print("Matplotlib Archetypes Gallery Loaded!")`,
        steps: [
            {
                lineNum: 1,
                action: 'init_gallery',
                detail: 'Matplotlib Archetype Catalog',
                archetype: 'line',
                explanation: 'Matplotlib provides specialized plotting functions for different statistical data distributions.',
                variables: { archetypes: 5 },
                outputs: ['Matplotlib Archetypes Gallery Loaded!']
            }
        ]
    }
];

export default function MatplotlibVisualAnalyticsVisualizer() {
    const [selectedExample, setSelectedExample] = useState(0);
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [steps, setSteps] = useState(EXAMPLES[0].steps);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const [activeArchetype, setActiveArchetype] = useState('line');
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

    // SVG coordinate math for Example 1
    const width = 440;
    const height = 180;
    const pad = 35;

    // Generate real sine & cosine SVG paths
    const pointsCount = 60;
    const sinPoints = [];
    const cosPoints = [];
    for (let i = 0; i <= pointsCount; i++) {
        const xVal = (i / pointsCount) * 10;
        const svgX = pad + (i / pointsCount) * (width - 2 * pad);

        const ySin = Math.sin(xVal);
        const svgYSin = (height / 2) - (ySin * ((height - 2 * pad) / 2));
        sinPoints.push(`${svgX},${svgYSin}`);

        const yCos = Math.cos(xVal);
        const svgYCos = (height / 2) - (yCos * ((height - 2 * pad) / 2));
        cosPoints.push(`${svgX},${svgYCos}`);
    }
    const sinD = 'M ' + sinPoints.join(' L ');
    const cosD = 'M ' + cosPoints.join(' L ');

    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            Module 12 • Topic 7
                        </span>
                        <h2 className="text-lg font-bold text-slate-800">
                            Matplotlib — Visual Analytics
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
                                    {activeStepData ? activeStepData.explanation : 'Learn how Figure, Axes, and vector graphics elements assemble.'}
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
                                <Activity className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    {selectedExample === 0 ? 'Live Matplotlib Figure & Axes Canvas' : '5 Core Chart Archetypes'}
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400">
                                DPI 150 Engine
                            </span>
                        </div>

                        {/* CASE 1: Dynamic SVG Plotting Canvas */}
                        {selectedExample === 0 && (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner flex flex-col items-center">
                                    {/* Figure Title */}
                                    <div className="text-xs font-bold text-slate-200 mb-1">
                                        {activeStepData?.canvasState?.title || 'Figure 1'}
                                    </div>

                                    {/* SVG Cartesian Plot */}
                                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible font-mono text-[9px]">
                                        {/* Grid Lines */}
                                        {activeStepData?.canvasState?.hasGrid && (
                                            <g stroke="#334155" strokeDasharray="3 3" strokeWidth="1">
                                                <line x1={pad} y1={pad} x2={width - pad} y2={pad} />
                                                <line x1={pad} y1={height / 2} x2={width - pad} y2={height / 2} />
                                                <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} />
                                                <line x1={pad + (width - 2 * pad) * 0.25} y1={pad} x2={pad + (width - 2 * pad) * 0.25} y2={height - pad} />
                                                <line x1={pad + (width - 2 * pad) * 0.5} y1={pad} x2={pad + (width - 2 * pad) * 0.5} y2={height - pad} />
                                                <line x1={pad + (width - 2 * pad) * 0.75} y1={pad} x2={pad + (width - 2 * pad) * 0.75} y2={height - pad} />
                                            </g>
                                        )}

                                        {/* Axes */}
                                        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#94a3b8" strokeWidth="1.5" />
                                        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#94a3b8" strokeWidth="1.5" />

                                        {/* Y-Axis Ticks & Labels */}
                                        <text x={pad - 8} y={pad + 4} fill="#64748b" textAnchor="end">+1.0</text>
                                        <text x={pad - 8} y={height / 2 + 3} fill="#64748b" textAnchor="end">0.0</text>
                                        <text x={pad - 8} y={height - pad + 3} fill="#64748b" textAnchor="end">-1.0</text>

                                        {/* X-Axis Ticks & Labels */}
                                        <text x={pad} y={height - pad + 14} fill="#64748b" textAnchor="middle">0</text>
                                        <text x={pad + (width - 2 * pad) * 0.5} y={height - pad + 14} fill="#64748b" textAnchor="middle">5</text>
                                        <text x={width - pad} y={height - pad + 14} fill="#64748b" textAnchor="middle">10</text>

                                        {/* Sine Curve */}
                                        {activeStepData?.canvasState?.hasSin && (
                                            <path d={sinD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5 3" className="animate-fadeIn" />
                                        )}

                                        {/* Cosine Curve */}
                                        {activeStepData?.canvasState?.hasCos && (
                                            <path d={cosD} fill="none" stroke="#f59e0b" strokeWidth="2.5" className="animate-fadeIn" />
                                        )}
                                    </svg>

                                    {/* Legend Box */}
                                    {activeStepData?.canvasState?.hasLegend && (
                                        <div className="mt-2 px-3 py-1 bg-slate-800/90 border border-slate-700 rounded-full flex items-center gap-4 text-[11px] animate-fadeIn">
                                            <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                                                <span className="w-3 h-0.5 bg-blue-500 border-t border-dashed" />
                                                <span>sin(x)</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                                <span className="w-3 h-0.5 bg-amber-500" />
                                                <span>cos(x)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Matplotlib Anatomy Tags */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                                    <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
                                        <div className="font-bold text-slate-800">Figure</div>
                                        <div className="text-[10px] text-slate-500">Outer Window/Canvas</div>
                                    </div>
                                    <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
                                        <div className="font-bold text-slate-800">Axes</div>
                                        <div className="text-[10px] text-slate-500">Subplot Coordinate Plane</div>
                                    </div>
                                    <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
                                        <div className="font-bold text-slate-800">Line2D</div>
                                        <div className="text-[10px] text-slate-500">Plotted Curves & Rays</div>
                                    </div>
                                    <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
                                        <div className="font-bold text-slate-800">Spines & Ticks</div>
                                        <div className="text-[10px] text-slate-500">Scale Rulers & Ticks</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CASE 2: Archetypes Gallery */}
                        {selectedExample === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                    {[
                                        { id: 'line', label: 'Line Plot', func: 'plt.plot()', use: 'Trends over time' },
                                        { id: 'bar', label: 'Bar Chart', func: 'plt.bar()', use: 'Category comparison' },
                                        { id: 'hist', label: 'Histogram', func: 'plt.hist()', use: 'Distribution density' },
                                        { id: 'scatter', label: 'Scatter', func: 'plt.scatter()', use: 'Correlation/clusters' },
                                        { id: 'pie', label: 'Pie Chart', func: 'plt.pie()', use: 'Part-to-whole slice' }
                                    ].map(arc => (
                                        <button
                                            key={arc.id}
                                            onClick={() => setActiveArchetype(arc.id)}
                                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                activeArchetype === arc.id
                                                    ? 'bg-blue-50 border-blue-400 shadow-xs ring-2 ring-blue-200'
                                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className="font-bold text-xs text-slate-800">{arc.label}</div>
                                            <div className="font-mono text-[10px] text-blue-700 font-semibold">{arc.func}</div>
                                            <div className="text-[9px] text-slate-500 mt-0.5">{arc.use}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* Archetype Showcase Preview Box */}
                                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white flex flex-col items-center justify-center min-h-[140px]">
                                    {activeArchetype === 'line' && (
                                        <div className="text-center space-y-2">
                                            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto" />
                                            <div className="text-xs font-bold">Line Plot: plt.plot(x, y)</div>
                                            <p className="text-[11px] text-slate-400 max-w-sm">Optimal for continuous time series, stock prices, sensor timelines, and functional mathematics.</p>
                                        </div>
                                    )}
                                    {activeArchetype === 'bar' && (
                                        <div className="text-center space-y-2">
                                            <BarChart2 className="w-8 h-8 text-emerald-400 mx-auto" />
                                            <div className="text-xs font-bold">Bar Chart: plt.bar(categories, values)</div>
                                            <p className="text-[11px] text-slate-400 max-w-sm">Ideal for discrete categories: department headcount, quarterly revenues, regional sales.</p>
                                        </div>
                                    )}
                                    {activeArchetype === 'hist' && (
                                        <div className="text-center space-y-2">
                                            <Activity className="w-8 h-8 text-purple-400 mx-auto" />
                                            <div className="text-xs font-bold">Histogram: plt.hist(data, bins=10)</div>
                                            <p className="text-[11px] text-slate-400 max-w-sm">Aggregates observations into continuous intervals (bins) to reveal normal distribution and skewness.</p>
                                        </div>
                                    )}
                                    {activeArchetype === 'scatter' && (
                                        <div className="text-center space-y-2">
                                            <ScatterChart className="w-8 h-8 text-amber-400 mx-auto" />
                                            <div className="text-xs font-bold">Scatter Plot: plt.scatter(x, y)</div>
                                            <p className="text-[11px] text-slate-400 max-w-sm">Plots individual data points without line connections to reveal statistical correlation (r-value).</p>
                                        </div>
                                    )}
                                    {activeArchetype === 'pie' && (
                                        <div className="text-center space-y-2">
                                            <PieChart className="w-8 h-8 text-rose-400 mx-auto" />
                                            <div className="text-xs font-bold">Pie Chart: plt.pie(sizes, labels=...)</div>
                                            <p className="text-[11px] text-slate-400 max-w-sm">Shows proportion of total budget or market share divided into radial slices.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

