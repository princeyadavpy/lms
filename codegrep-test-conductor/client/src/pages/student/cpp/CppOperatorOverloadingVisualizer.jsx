import React, { useState, useEffect } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from '../python/InteractiveEditorWithArrow';
import CppExecutionInspector from './CppExecutionInspector';
import CppStackFootprint from './CppStackFootprint';
import {
    Play,
    RotateCcw,
    Code2,
    Terminal,
    Layers,
    ArrowRight,
    Zap,
    Plus,
    Maximize2
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /unary and binary/i,
        label: '6.1 Unary & Binary Overloading',
        code: `#include <iostream>

class Complex {
public:
    double real, imag;

    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // Binary + Operator Overloading: c1 + c2 -> c1.operator+(c2)
    Complex operator+(const Complex &other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    // Unary ++ Operator Overloading (Prefix)
    Complex& operator++() {
        real++; imag++;
        return *this;
    }
};

int main() {
    Complex c1(3.5, 2.5);
    Complex c2(1.5, 4.5);

    // Invokes c1.operator+(c2)
    Complex c3 = c1 + c2;
    std::cout << "c3 = " << c3.real << " + " << c3.imag << "i" << std::endl;

    ++c3; // Invokes c3.operator++()
    std::cout << "After ++c3: " << c3.real << " + " << c3.imag << "i" << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 22, action: 'construct', detail: 'Initialize Complex c1 & c2', explanation: 'Creates c1(3.5, 2.5) and c2(1.5, 4.5) on stack.', vars: { 'c1': '3.5 + 2.5i', 'c2': '1.5 + 4.5i', 'c3': '-' }, output: [] },
            { lineNum: 25, action: 'binary_op', detail: 'c1 + c2 executes operator+', explanation: 'Binary operator maps to c1.operator+(c2). Computes (3.5+1.5) + (2.5+4.5)i = 5.0 + 7.0i.', vars: { 'c1': '3.5 + 2.5i', 'c2': '1.5 + 4.5i', 'c3': '5.0 + 7.0i' }, output: [] },
            { lineNum: 26, action: 'print', detail: 'Print c3 result', explanation: 'Streams 5 + 7i.', vars: { 'c3': '5.0 + 7.0i' }, output: ['c3 = 5 + 7i'] },
            { lineNum: 28, action: 'unary_op', detail: '++c3 executes operator++()', explanation: 'Unary prefix operator increments real and imag members in place: 6.0 + 8.0i.', vars: { 'c3': '6.0 + 8.0i' }, output: ['c3 = 5 + 7i'] },
            { lineNum: 29, action: 'print', detail: 'Print ++c3 result', explanation: 'Streams 6 + 8i.', vars: { 'c3': '6.0 + 8.0i' }, output: ['c3 = 5 + 7i', 'After ++c3: 6 + 8i'] },
            { lineNum: 30, action: 'return', detail: 'return 0', explanation: 'Execution complete.', vars: {}, output: ['c3 = 5 + 7i', 'After ++c3: 6 + 8i', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /friend function/i,
        label: '6.2 Friend Function Stream Overloading (<<)',
        code: `#include <iostream>

class Vector2D {
private:
    int x, y;
public:
    Vector2D(int a = 0, int b = 0) : x(a), y(b) {}

    // Overloading << requires friend function because left operand is std::ostream!
    friend std::ostream& operator<<(std::ostream &os, const Vector2D &v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os; // Return stream reference for chaining: cout << v1 << v2;
    }
};

int main() {
    Vector2D v1(10, 25);
    Vector2D v2(50, 75);

    // Chained stream insertion using overloaded operator<<
    std::cout << "Vector 1: " << v1 << " | Vector 2: " << v2 << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 16, action: 'construct', detail: 'Vector2D instances v1 & v2', explanation: 'Stack allocates v1(10, 25) and v2(50, 75).', vars: { 'v1': '(10, 25)', 'v2': '(50, 75)' }, output: [] },
            { lineNum: 20, action: 'stream_op', detail: 'operator<<(cout, v1) stream chaining', explanation: 'Invokes friend function passing cout and v1, returning ostream reference to chain v2.', vars: { 'v1': '(10, 25)', 'v2': '(50, 75)' }, output: ['Vector 1: (10, 25) | Vector 2: (50, 75)'] },
            { lineNum: 21, action: 'return', detail: 'return 0', explanation: 'Done.', vars: {}, output: ['Vector 1: (10, 25) | Vector 2: (50, 75)', '[Process completed with code 0]'] }
        ]
    }
];

export default function CppOperatorOverloadingVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
    const getInitialPreset = () => {
        if (lessonOrder && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            return TOPIC_PRESETS[lessonOrder - 1];
        }
        if (lessonTitle) {
            const found = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
            if (found) return found;
        }
        return TOPIC_PRESETS[0];
    };

    const [selectedExample, setSelectedExample] = useState(getInitialPreset());
    const [code, setCode] = useState(getInitialPreset().code);
    const [stepIdx, setStepIdx] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');

    const getDelay = (s) => {
        if (s === 'slow') return 1800;
        if (s === 'fast') return 600;
        if (typeof s === 'number') {
            if (s === 2) return 600;
            if (s === 0.5) return 1800;
            return 1200;
        }
        return 1200;
    };

    useEffect(() => {
        let matched = null;
        if (lessonOrder && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            matched = TOPIC_PRESETS[lessonOrder - 1];
        } else if (lessonTitle) {
            matched = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
        }
        if (matched && matched.topicId !== selectedExample.topicId) {
            setSelectedExample(matched);
            setCode(matched.code);
            setStepIdx(0);
            setIsRunning(false);
        }
    }, [lessonOrder, lessonTitle]);

    const simulationSteps = selectedExample.steps || TOPIC_PRESETS[0].steps;
    const currentStep = simulationSteps[stepIdx] || simulationSteps[0];
    const transitionInfo = getStepTransitionInfo(simulationSteps, stepIdx);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setTimeout(() => {
                setStepIdx(prev => {
                    if (prev < simulationSteps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsRunning(false);
                        return prev;
                    }
                });
            }, getDelay(speed));
        }
        return () => clearTimeout(timer);
    }, [isRunning, stepIdx, speed, simulationSteps.length]);

    const handleSelectExample = (ex) => {
        setSelectedExample(ex);
        setCode(ex.code);
        setStepIdx(0);
        setIsRunning(false);
    };

    return (
        <div className="space-y-4 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        C++ Operator Overloading Engine
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                        &bull; {selectedExample.label}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
                    {TOPIC_PRESETS.map(ex => (
                        <button
                            key={ex.topicId}
                            onClick={() => handleSelectExample(ex)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                selectedExample.topicId === ex.topicId
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                            }`}
                        >
                            {ex.label.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split Screen Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column: Code Editor (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Code2 className="w-3.5 h-3.5 text-blue-600" />
                            Live C++ Code Execution
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {selectedExample.label}
                        </span>
                    </div>

                    <InteractiveEditorWithArrow
                        code={code}
                        setCode={setCode}
                        currentLineNum={currentStep.lineNum}
                        transitionInfo={transitionInfo}
                        isRunning={isRunning}
                        runCode={() => {
                            if (isRunning) {
                                setIsRunning(false);
                            } else {
                                if (stepIdx >= simulationSteps.length - 1) setStepIdx(0);
                                setIsRunning(true);
                            }
                        }}
                        stepForward={() => {
                            setIsRunning(false);
                            if (stepIdx < simulationSteps.length - 1) setStepIdx(prev => prev + 1);
                        }}
                        resetExecution={() => {
                            setStepIdx(0);
                            setIsRunning(false);
                        }}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={isRunning ? `Executing line ${currentStep.lineNum}...` : (stepIdx >= simulationSteps.length - 1 ? '✓ Execution Complete' : `Line ${currentStep.lineNum} (${currentStep.action || 'ready'})`)}
                        stepCounterText={`Step ${stepIdx + 1} / ${simulationSteps.length}`}
                        badgeText="C++ Engine"
                        fileName="main.cpp"
                    />

                    {/* Terminal Output */}
                    <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-3 font-mono text-xs shadow-inner">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                            <span className="flex items-center gap-1.5 font-bold">
                                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                Standard Output (stdout)
                            </span>
                            <span className="text-[10px] text-slate-500">g++ -std=c++20</span>
                        </div>
                        <div className="min-h-[44px] text-emerald-400 space-y-1">
                            {(currentStep.output || []).length === 0 ? (
                                <span className="text-slate-600 italic">No output yet. Click "Run" or "Step" to execute.</span>
                            ) : (
                                currentStep.output.map((out, idx) => (
                                    <div key={idx} className="leading-snug">{out}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Execution & Operator Resolution (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Live Execution & State Mutation (Right-Top Aligned with Code) */}
                    <CppExecutionInspector
                        currentStep={currentStep}
                        stepIdx={stepIdx}
                        totalSteps={simulationSteps.length}
                        topicLabel={selectedExample.label}
                    />

                    {/* Visual Operator Mapping */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <Plus className="w-3.5 h-3.5 text-blue-600" />
                                Infix Syntax to Method Call Translation
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                Compiler Parser
                            </span>
                        </div>

                        {/* Translation Visual Box */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">User Infix Syntax</span>
                                    <span className="font-mono font-bold text-slate-900 text-sm">c3 = c1 + c2;</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-blue-600" />
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Compiler Dispatched Call</span>
                                    <span className="font-mono font-bold text-blue-700 text-sm">c1.operator+(c2);</span>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                In C++, operator overloading provides intuitive mathematical syntax for custom user-defined types without changing operator precedence or associativity rules.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Memory Address & Token Architecture • Stack Footprint */}
            <CppStackFootprint
                vars={currentStep.vars}
                currentStep={currentStep}
                topicLabel={selectedExample.label}
            />
        </div>
    );
}

