import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Award, BarChart3, TrendingUp, CheckCircle2, Sparkles,
    Database, ArrowRight, Layers, Table, GraduationCap
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// MINI-PROJECT: Student Results Analysis Pipeline (Topic 8)
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'results-pipeline',
        label: 'End-to-End Data Science Pipeline',
        code: `import pandas as pd
import matplotlib.pyplot as plt

# 1. Ingest raw test scores
data = pd.DataFrame({
    "student": ["Asha", "Ravi", "Meera", "Karan", "Divya", "Sana"],
    "maths":   [88, 74, 91, 55, 67, 80],
    "science": [92, 70, 85, 60, 72, 78]
})

# 2. Vectorized Feature Engineering: Calculate total
data["total"] = data["maths"] + data["science"]

# 3. Discretization: Bin scores into Letter Grades
data["grade"] = pd.cut(data["total"], bins=[0, 120, 150, 200], labels=["C", "B", "A"])

# 4. Sorting & Performance Rankings
ranked = data.sort_values("total", ascending=False)
print("--- Performance Rankings ---")
print(ranked)

# 5. Comparative Visual Analytics
# data.set_index("student")[["maths", "science"]].plot(kind="bar")
plt.title("Subject Marks by Student")
plt.show()`,
        steps: [
            {
                lineNum: 1,
                action: 'import_libs',
                detail: 'import pandas as pd, matplotlib.pyplot as plt',
                stage: 1,
                pipelineTitle: 'Stage 1: Ingestion',
                hasTotal: false,
                hasGrade: false,
                isSorted: false,
                hasPlot: false,
                explanation: 'Imports analytical data structures and visual graphing engine.',
                variables: { pd: '<module pandas>', plt: '<module matplotlib.pyplot>' },
                outputs: []
            },
            {
                lineNum: 5,
                action: 'load_data',
                detail: 'data = pd.DataFrame({...}) loaded with 6 student scorecards',
                stage: 1,
                pipelineTitle: 'Stage 1: Raw Ingestion',
                hasTotal: false,
                hasGrade: false,
                isSorted: false,
                hasPlot: false,
                explanation: 'Ingests raw examination marks for 6 students across Mathematics and Science.',
                variables: { 'data.shape': '(6, 3)' },
                outputs: []
            },
            {
                lineNum: 12,
                action: 'calc_total',
                detail: 'data["total"] = data["maths"] + data["science"] computed in SIMD',
                stage: 2,
                pipelineTitle: 'Stage 2: Vectorized Feature Engineering',
                hasTotal: true,
                hasGrade: false,
                isSorted: false,
                hasPlot: false,
                explanation: 'Direct column vector addition adds marks across all 6 records simultaneously.',
                variables: { 'data["total"]': '[180, 144, 176, 115, 139, 158]' },
                outputs: []
            },
            {
                lineNum: 15,
                action: 'cut_grades',
                detail: 'pd.cut(data["total"], bins=[0, 120, 150, 200], labels=["C", "B", "A"])',
                stage: 3,
                pipelineTitle: 'Stage 3: Categorical Binning (pd.cut)',
                hasTotal: true,
                hasGrade: true,
                isSorted: false,
                hasPlot: false,
                explanation: 'Bins numeric totals into discrete categorical letter tiers: 150-200 -> A, 120-150 -> B, 0-120 -> C.',
                variables: { 'data["grade"]': 'Categorical: [A, B, A, C, B, A]' },
                outputs: []
            },
            {
                lineNum: 18,
                action: 'sort_rankings',
                detail: 'ranked = data.sort_values("total", ascending=False)',
                stage: 4,
                pipelineTitle: 'Stage 4: Leaderboard Sorting',
                hasTotal: true,
                hasGrade: true,
                isSorted: true,
                hasPlot: false,
                explanation: 'Sorts by total descending: Asha (180, A) takes 1st rank, Meera (176, A) takes 2nd rank!',
                variables: { 'rank_1': 'Asha (180)', 'rank_last': 'Karan (115)' },
                outputs: [
                    '--- Performance Rankings ---',
                    '  student  maths  science  total grade\n0    Asha     88       92    180     A\n2   Meera     91       85    176     A\n5    Sana     80       78    158     A\n1    Ravi     74       70    144     B\n4   Divya     67       72    139     B\n3   Karan     55       60    115     C'
                ]
            },
            {
                lineNum: 24,
                action: 'render_plot',
                detail: 'Comparative multi-bar chart rendered with plt.show()',
                stage: 5,
                pipelineTitle: 'Stage 5: Comparative Visual Analytics',
                hasTotal: true,
                hasGrade: true,
                isSorted: true,
                hasPlot: true,
                explanation: 'Generates dual-column grouped bar graph comparing Maths vs Science scores per student.',
                variables: { 'chart_status': 'rendered' },
                outputs: [
                    '--- Performance Rankings ---',
                    '  student  maths  science  total grade\n0    Asha     88       92    180     A\n2   Meera     91       85    176     A\n5    Sana     80       78    158     A\n1    Ravi     74       70    144     B\n4   Divya     67       72    139     B\n3   Karan     55       60    115     C',
                    '<Figure size 800x400 with 1 Axes>',
                    'Displaying Subject Marks by Student'
                ]
            }
        ]
    }
];

export default function StudentResultsProjectVisualizer() {
    const [selectedExample, setSelectedExample] = useState(0);
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [steps, setSteps] = useState(EXAMPLES[0].steps);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const intervalRef = useRef(null);

    const speedDelays = { slow: 1800, normal: 1100, fast: 600 };

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

    // Initial student data
    const rawStudents = [
        { student: 'Asha', maths: 88, science: 92, total: 180, grade: 'A' },
        { student: 'Ravi', maths: 74, science: 70, total: 144, grade: 'B' },
        { student: 'Meera', maths: 91, science: 85, total: 176, grade: 'A' },
        { student: 'Karan', maths: 55, science: 60, total: 115, grade: 'C' },
        { student: 'Divya', maths: 67, science: 72, total: 139, grade: 'B' },
        { student: 'Sana', maths: 80, science: 78, total: 158, grade: 'A' }
    ];

    // Sorted by total
    const sortedStudents = [...rawStudents].sort((a, b) => b.total - a.total);
    const displayedStudents = activeStepData?.isSorted ? sortedStudents : rawStudents;

    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Module 12 • Capstone Project
                        </span>
                        <h2 className="text-lg font-bold text-slate-800">
                            Mini-Project: Student Results Analysis Pipeline
                        </h2>
                    </div>
                    
                </div>
                <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Full Curriculum Capstone</span>
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
                                    {activeStepData ? activeStepData.explanation : 'Walk through the 5-stage Data Science production pipeline.'}
                                </p>
                            </div>
                        </div>
                        {activeStepData && (
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-200/70 text-blue-800 rounded font-semibold">
                                {activeStepData.pipelineTitle}
                            </span>
                        )}
                    </div>

                    {/* Pipeline Stage Indicators */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                        {[
                            { s: 1, label: '1. Ingest' },
                            { s: 2, label: '2. Totals' },
                            { s: 3, label: '3. Cut' },
                            { s: 4, label: '4. Rank' },
                            { s: 5, label: '5. Graph' }
                        ].map(st => (
                            <div
                                key={st.s}
                                className={`py-1.5 px-1 rounded-lg border transition-all ${
                                    activeStepData && activeStepData.stage >= st.s
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                        : 'bg-slate-50 border-slate-200 text-slate-400'
                                }`}
                            >
                                {st.label}
                            </div>
                        ))}
                    </div>

                    {/* Canvas Area: Dynamic Leaderboard Table & Live Bar Chart */}
                    <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Table className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    {activeStepData?.hasPlot ? 'Comparative Analytics & Leaderboard' : 'Student Performance Table'}
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400">
                                {activeStepData?.isSorted ? 'Sorted Descending by Total' : 'Raw Input Sequence'}
                            </span>
                        </div>

                        {/* Interactive Data Table */}
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                        <th className="p-2 text-center text-slate-400 font-mono">Rank</th>
                                        <th className="p-2">Student</th>
                                        <th className="p-2 font-mono">Maths</th>
                                        <th className="p-2 font-mono">Science</th>
                                        {activeStepData?.hasTotal && (
                                            <th className="p-2 font-mono text-blue-700 bg-blue-50/50">Total</th>
                                        )}
                                        {activeStepData?.hasGrade && (
                                            <th className="p-2 text-center">Grade</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {displayedStudents.map((st, idx) => (
                                        <tr key={st.student} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-2 text-center font-mono font-bold text-slate-400">
                                                {activeStepData?.isSorted ? `#${idx + 1}` : idx}
                                            </td>
                                            <td className="p-2 font-bold text-slate-800 flex items-center gap-1.5">
                                                {activeStepData?.isSorted && idx === 0 && (
                                                    <Award className="w-3.5 h-3.5 text-amber-500" />
                                                )}
                                                <span>{st.student}</span>
                                            </td>
                                            <td className="p-2 font-mono text-slate-600">{st.maths}</td>
                                            <td className="p-2 font-mono text-slate-600">{st.science}</td>
                                            {activeStepData?.hasTotal && (
                                                <td className="p-2 font-mono font-black text-blue-800 bg-blue-50/30">
                                                    {st.total}
                                                </td>
                                            )}
                                            {activeStepData?.hasGrade && (
                                                <td className="p-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                                        st.grade === 'A'
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                            : st.grade === 'B'
                                                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                    }`}>
                                                        Grade {st.grade}
                                                    </span>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Live Matplotlib Grouped Bar Chart */}
                        {activeStepData?.hasPlot && (
                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-3 animate-fadeIn">
                                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1">
                                    <span className="font-bold text-slate-200">Matplotlib Bar Chart Output</span>
                                    <div className="flex items-center gap-3 text-[10px]">
                                        <span className="flex items-center gap-1">
                                            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Maths
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" /> Science
                                        </span>
                                    </div>
                                </div>

                                {/* Dynamic SVG Bar Chart */}
                                <svg viewBox="0 0 420 150" className="w-full h-36 font-mono text-[9px]">
                                    {/* Grid Lines */}
                                    <line x1="30" y1="20" x2="410" y2="20" stroke="#334155" strokeDasharray="3 3" />
                                    <line x1="30" y1="65" x2="410" y2="65" stroke="#334155" strokeDasharray="3 3" />
                                    <line x1="30" y1="110" x2="410" y2="110" stroke="#475569" strokeWidth="1.5" />

                                    {/* Y Labels */}
                                    <text x="24" y="24" fill="#64748b" textAnchor="end">100</text>
                                    <text x="24" y="69" fill="#64748b" textAnchor="end">50</text>
                                    <text x="24" y="114" fill="#64748b" textAnchor="end">0</text>

                                    {/* Grouped Bars per student */}
                                    {rawStudents.map((st, i) => {
                                        const groupX = 40 + i * 62;
                                        const mathHeight = (st.maths / 100) * 90;
                                        const sciHeight = (st.science / 100) * 90;

                                        return (
                                            <g key={st.student}>
                                                {/* Maths Bar */}
                                                <rect
                                                    x={groupX}
                                                    y={110 - mathHeight}
                                                    width="16"
                                                    height={mathHeight}
                                                    fill="#6366f1"
                                                    rx="2"
                                                />
                                                {/* Science Bar */}
                                                <rect
                                                    x={groupX + 18}
                                                    y={110 - sciHeight}
                                                    width="16"
                                                    height={sciHeight}
                                                    fill="#38bdf8"
                                                    rx="2"
                                                />
                                                {/* Student Name */}
                                                <text
                                                    x={groupX + 17}
                                                    y="126"
                                                    fill="#cbd5e1"
                                                    textAnchor="middle"
                                                    fontWeight="bold"
                                                >
                                                    {st.student}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

