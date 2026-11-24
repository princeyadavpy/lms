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
    Cpu,
    GitBranch,
    Shield
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /call by reference|return by reference/i,
        label: '4.1 Call & Return by Reference',
        code: `#include <iostream>

void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    std::cout << "Before swap: x=" << x << ", y=" << y << std::endl;

    swap(x, y); // Passes actual variables, zero copying overhead!

    std::cout << "After swap : x=" << x << ", y=" << y << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 10, action: 'assign', detail: 'Initialize x=10, y=20', explanation: 'Caller allocates x and y on stack frame of main.', vars: { x: '10', y: '20' }, output: [] },
            { lineNum: 11, action: 'print', detail: 'Print before swap', explanation: 'Outputs initial state.', vars: { x: '10', y: '20' }, output: ['Before swap: x=10, y=20'] },
            { lineNum: 13, action: 'call', detail: 'swap(x, y) with references', explanation: 'Parameters a and b bind as aliases to x and y directly in place.', vars: { 'a (&x)': '10', 'b (&y)': '20' }, output: ['Before swap: x=10, y=20'] },
            { lineNum: 5, action: 'swap', detail: 'Swap values in place', explanation: 'Mutates memory cells of x and y directly through references.', vars: { x: '20', y: '10' }, output: ['Before swap: x=10, y=20'] },
            { lineNum: 15, action: 'print', detail: 'Print after swap', explanation: 'Confirms swapped values.', vars: { x: '20', y: '10' }, output: ['Before swap: x=10, y=20', 'After swap : x=20, y=10'] },
            { lineNum: 16, action: 'return', detail: 'return 0', explanation: 'Complete.', vars: {}, output: ['Before swap: x=10, y=20', 'After swap : x=20, y=10', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /function overloading/i,
        label: '4.2 Function Overloading',
        code: `#include <iostream>

// Compiler mangles names based on parameter signatures
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

int main() {
    int sumInt = add(5, 10);          // Calls add(int, int)
    double sumDouble = add(2.5, 3.5); // Calls add(double, double)

    std::cout << "Integer sum: " << sumInt << std::endl;
    std::cout << "Double sum:  " << sumDouble << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 13, action: 'call', detail: 'add(5, 10) resolution', explanation: 'Compiler resolves to _Z3addii (int, int signature). Result: 15.', vars: { sumInt: '15', sumDouble: '-' }, output: [] },
            { lineNum: 14, action: 'call', detail: 'add(2.5, 3.5) resolution', explanation: 'Compiler resolves to _Z3adddd (double, double signature). Result: 6.0.', vars: { sumInt: '15', sumDouble: '6.0' }, output: [] },
            { lineNum: 16, action: 'print', detail: 'Print sumInt', explanation: 'Streams 15.', vars: { sumInt: '15', sumDouble: '6.0' }, output: ['Integer sum: 15'] },
            { lineNum: 17, action: 'print', detail: 'Print sumDouble', explanation: 'Streams 6.0.', vars: { sumInt: '15', sumDouble: '6.0' }, output: ['Integer sum: 15', 'Double sum:  6'] },
            { lineNum: 18, action: 'return', detail: 'return 0', explanation: 'Done.', vars: {}, output: ['Integer sum: 15', 'Double sum:  6', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /static class members/i,
        label: '4.4 Static Class Members',
        code: `#include <iostream>

class Counter {
public:
    static int totalCount; // Shared across ALL instances

    Counter() { totalCount++; }
    static int getTotal() { return totalCount; }
};

// Definition outside class in static data segment
int Counter::totalCount = 0;

int main() {
    Counter c1;
    Counter c2;
    Counter c3;

    std::cout << "Total instances created: " << Counter::getTotal() << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 15, action: 'instantiate', detail: 'Counter c1 created', explanation: 'Constructor increments shared Counter::totalCount to 1.', vars: { 'Counter::totalCount': '1' }, output: [] },
            { lineNum: 16, action: 'instantiate', detail: 'Counter c2 created', explanation: 'Constructor increments shared Counter::totalCount to 2.', vars: { 'Counter::totalCount': '2' }, output: [] },
            { lineNum: 17, action: 'instantiate', detail: 'Counter c3 created', explanation: 'Constructor increments shared Counter::totalCount to 3.', vars: { 'Counter::totalCount': '3' }, output: [] },
            { lineNum: 19, action: 'print', detail: 'Invoke Counter::getTotal()', explanation: 'Static function accessed directly via class name without object qualifier.', vars: { 'Counter::totalCount': '3' }, output: ['Total instances created: 3'] },
            { lineNum: 20, action: 'return', detail: 'return 0', explanation: 'Exit.', vars: {}, output: ['Total instances created: 3', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 4,
        matchPattern: /virtual functions/i,
        label: '4.6 Virtual Functions & VTable',
        code: `#include <iostream>

class Base {
public:
    virtual void print() { std::cout << "Base::print" << std::endl; }
};

class Derived : public Base {
public:
    void print() override { std::cout << "Derived::print" << std::endl; }
};

int main() {
    Base* ptr = new Derived();
    // Dynamic binding via VPTR -> VTable lookup at runtime!
    ptr->print();

    delete ptr;
    return 0;
}`,
        steps: [
            { lineNum: 14, action: 'alloc', detail: 'Base* ptr = new Derived()', explanation: 'Allocates Derived instance on heap with invisible __vptr pointing to Derived VTable.', vars: { ptr: '0x10a20', '__vptr': '&Derived::vtable' }, output: [] },
            { lineNum: 16, action: 'dispatch', detail: 'ptr->print() virtual call', explanation: 'Follows ptr->__vptr -> looks up slot 0 -> dynamically invokes Derived::print().', vars: { invoked: 'Derived::print()' }, output: ['Derived::print'] },
            { lineNum: 18, action: 'free', detail: 'delete ptr', explanation: 'Frees heap instance.', vars: { ptr: 'freed' }, output: ['Derived::print'] },
            { lineNum: 19, action: 'return', detail: 'return 0', explanation: 'Done.', vars: {}, output: ['Derived::print', '[Process completed with code 0]'] }
        ]
    }
];

export default function CppFunctionsVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
    const getInitialPreset = () => {
        if (lessonOrder && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            return TOPIC_PRESETS[lessonOrder - 1];
        }
        if (lessonTitle) {
            const found = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
            if (found) return found;
        }
        return TOPIC_PRESETS[3]; // Default to Virtual Functions
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

    const simulationSteps = selectedExample.steps || TOPIC_PRESETS[3].steps;
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
                        C++ Functions &amp; Polymorphic Dispatch
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

                {/* Right Column: Live Execution & VTable Architecture (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Live Execution & State Mutation (Right-Top Aligned with Code) */}
                    <CppExecutionInspector
                        currentStep={currentStep}
                        stepIdx={stepIdx}
                        totalSteps={simulationSteps.length}
                        topicLabel={selectedExample.label}
                    />

                    {/* Visual VTable & Dynamic Binding Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                                Virtual Table (VTable) Dynamic Dispatch
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                Runtime Binding
                            </span>
                        </div>

                        {/* VTable Visual Scheme */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span>Object: <code className="text-blue-700 font-bold">Derived Instance</code></span>
                                <span className="text-[10px] font-mono text-slate-500">Heap: 0x10a20</span>
                            </div>

                            {/* VPTR arrow to VTable Box */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-2xs space-y-1">
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Object Header</span>
                                    <div className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-blue-800 font-mono text-xs font-bold flex items-center justify-between">
                                        <span>__vptr</span>
                                        <span>&rarr;</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500">Virtual Table Pointer</div>
                                </div>

                                <div className="p-3 bg-slate-900 text-white rounded-xl shadow-2xs space-y-1">
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Derived::vtable</span>
                                    <div className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-emerald-400 font-mono text-xs font-bold">
                                        [0]: &amp;Derived::print()
                                    </div>
                                    <div className="text-[9px] text-slate-400">Function Pointer Slot</div>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                At runtime, calling <code>ptr-&gt;print()</code> reads the hidden <code>__vptr</code> inside the object, looks up slot 0 in the VTable, and dynamically executes the overridden method.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Memory Address & Token Architecture • Stack Footprint */}
            <CppStackFootprint
                vars={currentStep.vars}
                currentStep={currentStep}
                stackFrameName={currentStep.action?.includes('swap') ? 'swap(int&, int&)' : 'main()'}
                topicLabel={selectedExample.label}
            />
        </div>
    );
}

