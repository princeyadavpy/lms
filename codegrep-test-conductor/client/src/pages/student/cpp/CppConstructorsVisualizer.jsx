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
    Trash2,
    Sparkles
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /concept of constructor/i,
        label: '5.1 Concept of Constructor',
        code: `#include <iostream>

class Box {
public:
    int width, height;

    // Default Constructor: Automatically invoked on instantiation
    Box() {
        width = 10;
        height = 20;
        std::cout << "Default Constructor called! Box initialized." << std::endl;
    }
};

int main() {
    std::cout << "Creating box b1:" << std::endl;
    Box b1; // Constructor runs immediately!

    std::cout << "Dimensions: " << b1.width << "x" << b1.height << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 16, action: 'print', detail: 'Creating box b1', explanation: 'Execution reaches declaration point.', vars: { 'b1.width': '-', 'b1.height': '-' }, output: ['Creating box b1:'] },
            { lineNum: 17, action: 'construct', detail: 'Box b1 invokes Box()', explanation: 'Allocates memory on stack and executes constructor body to initialize members.', vars: { 'b1.width': '10', 'b1.height': '20' }, output: ['Creating box b1:', 'Default Constructor called! Box initialized.'] },
            { lineNum: 19, action: 'print', detail: 'Print dimensions', explanation: 'Outputs 10x20.', vars: { 'b1.width': '10', 'b1.height': '20' }, output: ['Creating box b1:', 'Default Constructor called! Box initialized.', 'Dimensions: 10x20'] },
            { lineNum: 20, action: 'return', detail: 'return 0', explanation: 'Process complete.', vars: {}, output: ['Creating box b1:', 'Default Constructor called! Box initialized.', 'Dimensions: 10x20', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /types of constructors/i,
        label: '5.2 Types of Constructors (Copy & Param)',
        code: `#include <iostream>

class Point {
public:
    int x, y;

    // Parameterized Constructor
    Point(int a, int b) : x(a), y(b) {
        std::cout << "Parameterized (" << x << ", " << y << ")" << std::endl;
    }

    // Copy Constructor (Pass by const reference)
    Point(const Point &p) : x(p.x), y(p.y) {
        std::cout << "Copy Constructor: Copied from (" << x << ", " << y << ")" << std::endl;
    }
};

int main() {
    Point p1(5, 12);   // Parameterized
    Point p2 = p1;      // Copy Constructor

    return 0;
}`,
        steps: [
            { lineNum: 19, action: 'construct', detail: 'Point p1(5, 12) parameterized', explanation: 'Initializes p1 with arguments a=5, b=12.', vars: { 'p1.x': '5', 'p1.y': '12', 'p2': '-' }, output: ['Parameterized (5, 12)'] },
            { lineNum: 20, action: 'copy', detail: 'Point p2 = p1 copy construction', explanation: 'Executes copy constructor Point(const Point &p), cloning values from p1 to p2.', vars: { 'p1.x': '5', 'p1.y': '12', 'p2.x': '5', 'p2.y': '12' }, output: ['Parameterized (5, 12)', 'Copy Constructor: Copied from (5, 12)'] },
            { lineNum: 22, action: 'return', detail: 'return 0', explanation: 'Done.', vars: {}, output: ['Parameterized (5, 12)', 'Copy Constructor: Copied from (5, 12)', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /memory allocation/i,
        label: '5.3 Dynamic Memory (new & delete)',
        code: `#include <iostream>

int main() {
    // Dynamic allocation of single integer on the Heap
    int* ptr = new int(42);
    std::cout << "Heap Value: " << *ptr << " at Address: " << ptr << std::endl;

    delete ptr; // Deallocates heap memory (prevents memory leak!)
    ptr = nullptr; // Safety: Prevents dangling pointer!

    // Dynamic array allocation
    int* arr = new int[3]{10, 20, 30};
    delete[] arr; // Array deallocation with delete[]
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'new', detail: 'int* ptr = new int(42)', explanation: 'Heap allocates 4 bytes at address 0x10f00 and writes 42. ptr holds address on stack.', vars: { ptr: '0x10f00', '*ptr': '42' }, output: [] },
            { lineNum: 6, action: 'print', detail: 'Print dereferenced *ptr', explanation: 'Streams 42.', vars: { ptr: '0x10f00', '*ptr': '42' }, output: ['Heap Value: 42 at Address: 0x10f00'] },
            { lineNum: 8, action: 'delete', detail: 'delete ptr (Free heap memory)', explanation: 'Returns heap block 0x10f00 back to the OS memory pool.', vars: { ptr: '0x10f00 (dangling)', '*ptr': '[freed]' }, output: ['Heap Value: 42 at Address: 0x10f00'] },
            { lineNum: 9, action: 'null', detail: 'ptr = nullptr', explanation: 'Clears pointer variable to null, preventing undefined dangling behavior.', vars: { ptr: 'nullptr', '*ptr': '[null]' }, output: ['Heap Value: 42 at Address: 0x10f00'] },
            { lineNum: 13, action: 'return', detail: 'return 0', explanation: 'Done.', vars: {}, output: ['Heap Value: 42 at Address: 0x10f00', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 4,
        matchPattern: /usage of destructor/i,
        label: '5.4 Usage of Destructor (~)',
        code: `#include <iostream>

class ResourceHolder {
public:
    int id;
    ResourceHolder(int i) : id(i) {
        std::cout << "Acquired Resource #" << id << std::endl;
    }

    // Destructor: Automatically called when object goes out of scope (RAII)
    ~ResourceHolder() {
        std::cout << "Released Resource #" << id << " (RAII Cleanup!)" << std::endl;
    }
};

int main() {
    {
        ResourceHolder r1(101); // Scope starts
    } // r1 automatically destroyed here!

    std::cout << "Main scope continues..." << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 17, action: 'construct', detail: 'r1(101) Constructor', explanation: 'Constructs r1 in inner block scope.', vars: { 'r1.id': '101' }, output: ['Acquired Resource #101'] },
            { lineNum: 18, action: 'destruct', detail: '~ResourceHolder() Destructor', explanation: 'Inner block closes: ~ResourceHolder() executes automatically, guaranteeing cleanup.', vars: { 'r1': '[destructed]' }, output: ['Acquired Resource #101', 'Released Resource #101 (RAII Cleanup!)'] },
            { lineNum: 20, action: 'print', detail: 'Print main scope message', explanation: 'Demonstrates deterministic cleanup before this line executes.', vars: {}, output: ['Acquired Resource #101', 'Released Resource #101 (RAII Cleanup!)', 'Main scope continues...'] },
            { lineNum: 21, action: 'return', detail: 'return 0', explanation: 'Done.', vars: {}, output: ['Acquired Resource #101', 'Released Resource #101 (RAII Cleanup!)', 'Main scope continues...', '[Process completed with code 0]'] }
        ]
    }
];

export default function CppConstructorsVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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
                        C++ Constructors, Destructors &amp; RAII
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

                {/* Right Column: Live Execution & Object Lifecycle (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Live Execution & State Mutation (Right-Top Aligned with Code) */}
                    <CppExecutionInspector
                        currentStep={currentStep}
                        stepIdx={stepIdx}
                        totalSteps={simulationSteps.length}
                        topicLabel={selectedExample.label}
                    />

                    {/* Visual Lifecycle Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                Object Lifecycle Timeline (RAII)
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                Automatic Cleanup
                            </span>
                        </div>

                        {/* Lifecycle Step Flow */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="p-2.5 bg-white border border-blue-200 rounded-xl shadow-2xs space-y-1">
                                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mx-auto text-[10px]">1</span>
                                    <span className="font-bold text-slate-900 block">Constructor</span>
                                    <span className="text-[10px] text-blue-600 font-mono">Box()</span>
                                </div>
                                <div className="p-2.5 bg-white border border-emerald-200 rounded-xl shadow-2xs space-y-1">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mx-auto text-[10px]">2</span>
                                    <span className="font-bold text-slate-900 block">Active Scope</span>
                                    <span className="text-[10px] text-emerald-600 font-mono">r1.work()</span>
                                </div>
                                <div className="p-2.5 bg-white border border-red-200 rounded-xl shadow-2xs space-y-1">
                                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center mx-auto text-[10px]">3</span>
                                    <span className="font-bold text-slate-900 block">Destructor</span>
                                    <span className="text-[10px] text-red-600 font-mono">~Box()</span>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                In C++, <strong>RAII (Resource Acquisition Is Initialization)</strong> guarantees that when an object leaves its scope, its destructor <code>~ClassName()</code> is deterministically invoked to free memory, close file streams, and release mutexes.
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

