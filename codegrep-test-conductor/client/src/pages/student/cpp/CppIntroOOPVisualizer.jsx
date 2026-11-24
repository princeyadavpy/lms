import React, { useState, useEffect } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from '../python/InteractiveEditorWithArrow';
import CppExecutionInspector from './CppExecutionInspector';
import CppStackFootprint from './CppStackFootprint';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Layers,
    Code2,
    CheckCircle2,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Shield,
    Box,
    GitBranch,
    RefreshCw
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /concept of oop|procedural/i,
        label: '1.1 Concept of OOP',
        code: `#include <iostream>
#include <string>

// OOP Entity: Data & Functions bound together
class BankAccount {
private:
    std::string owner;
    double balance;

public:
    BankAccount(std::string name, double initial) 
        : owner(name), balance(initial) {}

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    void display() const {
        std::cout << owner << " Balance: $" << balance << std::endl;
    }
};

int main() {
    BankAccount account("Alex", 1000.0);
    account.deposit(250.0);
    account.display();
    return 0;
}`,
        steps: [
            { lineNum: 21, action: 'instantiate', detail: 'Instantiate BankAccount object', explanation: 'Creates BankAccount object on the stack with owner "Alex" and balance 1000.0.', vars: { owner: '"Alex"', balance: '1000.0' }, output: [] },
            { lineNum: 22, action: 'deposit', detail: 'Invoke deposit(250.0) method', explanation: 'Member function securely accesses private balance member and adds 250.0.', vars: { owner: '"Alex"', balance: '1250.0' }, output: [] },
            { lineNum: 23, action: 'display', detail: 'Invoke display() method', explanation: 'Streams encapsulated state to standard output.', vars: { owner: '"Alex"', balance: '1250.0' }, output: ['Alex Balance: $1250'] },
            { lineNum: 24, action: 'return', detail: 'return 0', explanation: 'Program terminates successfully.', vars: { owner: '"Alex"', balance: '1250.0' }, output: ['Alex Balance: $1250', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /features of oop|pillars/i,
        label: '1.2 Features of OOP (4 Pillars)',
        code: `#include <iostream>

// 1. Encapsulation: Private members with public interface
// 2. Abstraction: Simple public API, implementation hidden
class Vehicle {
protected:
    int speed;
public:
    Vehicle() : speed(0) {}
    virtual void accelerate() = 0; // Pure virtual (Abstraction)
};

// 3. Inheritance: Car inherits from Vehicle
// 4. Polymorphism: Overrides accelerate behavior
class SportsCar : public Vehicle {
public:
    void accelerate() override {
        speed += 30;
        std::cout << "SportsCar Speed: " << speed << " km/h" << std::endl;
    }
};

int main() {
    Vehicle* v = new SportsCar();
    v->accelerate();
    delete v;
    return 0;
}`,
        steps: [
            { lineNum: 23, action: 'poly', detail: 'Polymorphic pointer allocation', explanation: 'Base class pointer Vehicle* assigned address of newly allocated derived SportsCar.', vars: { type: 'SportsCar', speed: '0' }, output: [] },
            { lineNum: 24, action: 'call', detail: 'Dynamic dispatch accelerate()', explanation: 'Virtual method resolves dynamically to SportsCar::accelerate at runtime.', vars: { type: 'SportsCar', speed: '30' }, output: ['SportsCar Speed: 30 km/h'] },
            { lineNum: 25, action: 'cleanup', detail: 'delete v heap deallocation', explanation: 'Releases SportsCar object from heap memory.', vars: { type: 'freed', speed: '-' }, output: ['SportsCar Speed: 30 km/h'] },
            { lineNum: 26, action: 'return', detail: 'return 0', explanation: 'Execution complete.', vars: {}, output: ['SportsCar Speed: 30 km/h', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /introduction of 'c\+\+'/i,
        label: "1.3 Introduction to 'C++'",
        code: `#include <iostream>

// C++ was developed by Bjarne Stroustrup in 1979 at Bell Labs
// Started as "C with Classes" and renamed to C++ in 1983
int main() {
    std::cout << "C++ Standard: " << __cplusplus << std::endl;
    std::cout << "Combines High-Performance Systems with OOP!" << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'print', detail: 'Print C++ standard macro', explanation: 'Outputs compiler standard version identifier value.', vars: { standard: '202002L (C++20)' }, output: ['C++ Standard: 202002L'] },
            { lineNum: 7, action: 'print', detail: 'Print paradigm statement', explanation: 'Demonstrates hybrid multi-paradigm power of C++.', vars: { standard: '202002L' }, output: ['C++ Standard: 202002L', 'Combines High-Performance Systems with OOP!'] },
            { lineNum: 8, action: 'return', detail: 'return 0', explanation: 'Success exit.', vars: {}, output: ['C++ Standard: 202002L', 'Combines High-Performance Systems with OOP!', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 4,
        matchPattern: /structure of 'c\+\+'/i,
        label: "1.4 Structure of C++ Program",
        code: `#include <iostream>  // Header inclusion
using namespace std; // Namespace declaration

// Class declaration section
class Greeter {
public:
    void greet(string name) {
        cout << "Hello, " << name << "! Welcome to C++." << endl;
    }
};

// Main function: Program entry point
int main() {
    Greeter g;
    g.greet("Developer");
    return 0;
}`,
        steps: [
            { lineNum: 14, action: 'instantiate', detail: 'Greeter g object created', explanation: 'Instantiates Greeter on the stack.', vars: { object: 'g' }, output: [] },
            { lineNum: 15, action: 'call', detail: 'g.greet("Developer")', explanation: 'Transfers execution into member function with stream output.', vars: { object: 'g', name: '"Developer"' }, output: ['Hello, Developer! Welcome to C++.'] },
            { lineNum: 16, action: 'return', detail: 'return 0', explanation: 'Main returns code 0.', vars: {}, output: ['Hello, Developer! Welcome to C++.', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 5,
        matchPattern: /executing and debugging/i,
        label: '1.5 Compilation & Execution',
        code: `// C++ Compilation Pipeline:
// 1. Preprocessing: g++ -E main.cpp -> main.i
// 2. Compilation:   g++ -S main.i   -> main.s (assembly)
// 3. Assembly:      g++ -c main.s   -> main.o (machine object)
// 4. Linking:       g++ main.o      -> a.out (executable)

#include <iostream>

int main() {
    int x = 10;
    int y = 20;
    int sum = x + y;
    std::cout << "Sum: " << sum << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 10, action: 'assign', detail: 'x = 10', explanation: 'Stack allocates 4-byte signed integer x.', vars: { x: '10', y: '-', sum: '-' }, output: [] },
            { lineNum: 11, action: 'assign', detail: 'y = 20', explanation: 'Stack allocates 4-byte signed integer y.', vars: { x: '10', y: '20', sum: '-' }, output: [] },
            { lineNum: 12, action: 'calc', detail: 'sum = x + y', explanation: 'ALU performs binary addition: 10 + 20 = 30.', vars: { x: '10', y: '20', sum: '30' }, output: [] },
            { lineNum: 13, action: 'print', detail: 'cout << sum', explanation: 'Streams result 30 to stdout.', vars: { x: '10', y: '20', sum: '30' }, output: ['Sum: 30'] },
            { lineNum: 14, action: 'return', detail: 'return 0', explanation: 'Process finishes with return code 0.', vars: {}, output: ['Sum: 30', '[Process completed with code 0]'] }
        ]
    }
];

export default function CppIntroOOPVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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
    const [activePillar, setActivePillar] = useState('encapsulation');

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
            {/* Header with Topic Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        C++ OOP Architecture &amp; Foundations
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
                {/* Left Column: Interactive Code Editor (6 Cols) */}
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

                    {/* Terminal Console Output */}
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

                {/* Right Column: Live Execution & Interactive Diagram (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Live Execution & State Mutation (Right-Top Aligned with Code) */}
                    <CppExecutionInspector
                        currentStep={currentStep}
                        stepIdx={stepIdx}
                        totalSteps={simulationSteps.length}
                        topicLabel={selectedExample.label}
                    />

                    {/* 4 Pillars Interactive Tab Strip */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-blue-600" />
                                OOP Core Architecture Model
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                4 Pillars
                            </span>
                        </div>

                        {/* Pillar Selector Pills */}
                        <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
                            {[
                                { id: 'encapsulation', label: 'Encapsulation' },
                                { id: 'abstraction', label: 'Abstraction' },
                                { id: 'inheritance', label: 'Inheritance' },
                                { id: 'polymorphism', label: 'Polymorphism' }
                            ].map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setActivePillar(p.id)}
                                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                                        activePillar === p.id
                                            ? 'bg-white text-blue-600 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {/* Pillar Visual Representation */}
                        {activePillar === 'encapsulation' && (
                            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                    <span>Encapsulation (Data Hiding &amp; Bundling)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="p-3 bg-white rounded-xl border border-red-200 shadow-2xs">
                                        <span className="text-[10px] font-bold text-red-600 uppercase block">Private Scope (Hidden)</span>
                                        <div className="mt-1 font-mono text-xs text-slate-800 font-semibold space-y-0.5">
                                            <div>owner: "Alex"</div>
                                            <div>balance: $1250.0</div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase block">Public Interface (Accessible)</span>
                                        <div className="mt-1 font-mono text-xs text-slate-800 font-semibold space-y-0.5">
                                            <div>deposit(amt)</div>
                                            <div>display()</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                    Member data is wrapped securely in private storage. External code can only interact via public methods.
                                </p>
                            </div>
                        )}

                        {activePillar === 'abstraction' && (
                            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    <Box className="w-4 h-4 text-blue-600" />
                                    <span>Abstraction (Hiding Complex Internals)</span>
                                </div>
                                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block">User Sees (Essential API)</span>
                                        <span className="font-mono font-bold text-blue-700">v-&gt;accelerate();</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Internal Complex Engine</span>
                                        <span className="font-mono text-slate-600">fuel_inj, rpm, torque</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                    C++ uses abstract classes and pure virtual functions (<code>= 0</code>) to define clean interface contracts.
                                </p>
                            </div>
                        )}

                        {activePillar === 'inheritance' && (
                            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    <GitBranch className="w-4 h-4 text-purple-600" />
                                    <span>Inheritance (Code Reusability &amp; Hierarchy)</span>
                                </div>
                                <div className="space-y-1.5 text-center">
                                    <div className="p-2 bg-purple-50 text-purple-800 rounded-lg border border-purple-200 text-xs font-mono font-bold">
                                        Base Class: Vehicle (speed, fuel)
                                    </div>
                                    <div className="text-slate-400 text-xs">&darr; public inheritance &darr;</div>
                                    <div className="p-2 bg-white text-slate-800 rounded-lg border border-slate-300 text-xs font-mono font-bold">
                                        Derived Class: SportsCar (inherits speed, adds turbo)
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                    Eliminates redundant code by modeling hierarchical "is-a" relationships between classes.
                                </p>
                            </div>
                        )}

                        {activePillar === 'polymorphism' && (
                            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-amber-600" />
                                    <span>Polymorphism (One Interface, Many Forms)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Compile-Time</span>
                                        <span className="font-semibold text-slate-800">Function &amp; Operator Overloading</span>
                                    </div>
                                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Runtime</span>
                                        <span className="font-semibold text-blue-700">Virtual Functions &amp; Dynamic Dispatch</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                    Allows a base class pointer (<code>Vehicle*</code>) to dynamically invoke the derived class behavior.
                                </p>
                            </div>
                        )}
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

