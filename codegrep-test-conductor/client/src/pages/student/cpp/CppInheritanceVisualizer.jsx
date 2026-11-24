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
    GitBranch,
    GitMerge,
    Shield,
    Database
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /types of inheritance/i,
        label: '7.1 Types of Inheritance',
        code: `#include <iostream>

// Base Class
class Person {
public:
    std::string name;
    Person(std::string n) : name(n) {}
};

// Derived Class (Single Inheritance)
class Student : public Person {
public:
    int studentId;
    Student(std::string n, int id) : Person(n), studentId(id) {}

    void display() {
        std::cout << "Student: " << name << ", ID: " << studentId << std::endl;
    }
};

int main() {
    Student s("Emily Watson", 4052);
    s.display();
    return 0;
}`,
        steps: [
            { lineNum: 20, action: 'construct', detail: 'Construct Student s("Emily Watson", 4052)', explanation: 'Executes Person base constructor first (initializes name), then Student derived constructor (initializes studentId).', vars: { 's.name': '"Emily Watson"', 's.studentId': '4052' }, output: [] },
            { lineNum: 21, action: 'call', detail: 's.display()', explanation: 'Derived class method accesses both inherited and derived members.', vars: { 's.name': '"Emily Watson"', 's.studentId': '4052' }, output: ['Student: Emily Watson, ID: 4052'] },
            { lineNum: 22, action: 'return', detail: 'return 0', explanation: 'Destructor order: Student destroyed first, then Person base destroyed.', vars: {}, output: ['Student: Emily Watson, ID: 4052', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /virtual base classes/i,
        label: '7.2 Diamond Problem & Virtual Base',
        code: `#include <iostream>

// Virtual Base Class solves Diamond Ambiguity!
class PoweredDevice {
public:
    int voltage = 120;
};

class Scanner : virtual public PoweredDevice {};
class Printer : virtual public PoweredDevice {};

// Copier inherits single shared instance of PoweredDevice
class Copier : public Scanner, public Printer {};

int main() {
    Copier c;
    // Without 'virtual', c.voltage is ambiguous! With virtual, exactly 1 copy exists.
    std::cout << "Copier Voltage: " << c.voltage << "V" << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 14, action: 'instantiate', detail: 'Copier c allocated', explanation: 'Scanner and Printer virtually share exactly ONE sub-object of PoweredDevice.', vars: { 'c.voltage': '120V' }, output: [] },
            { lineNum: 16, action: 'print', detail: 'Access c.voltage without ambiguity', explanation: 'Compiler resolves single shared voltage offset without ambiguity error.', vars: { 'c.voltage': '120V' }, output: ['Copier Voltage: 120V'] },
            { lineNum: 17, action: 'return', detail: 'return 0', explanation: 'Complete.', vars: {}, output: ['Copier Voltage: 120V', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /constructor and destructor in derived/i,
        label: '7.3 Constructor & Destructor Order',
        code: `#include <iostream>

class Base {
public:
    Base()  { std::cout << "1. Base Constructor" << std::endl; }
    ~Base() { std::cout << "4. Base Destructor" << std::endl; }
};

class Derived : public Base {
public:
    Derived()  { std::cout << "2. Derived Constructor" << std::endl; }
    ~Derived() { std::cout << "3. Derived Destructor" << std::endl; }
};

int main() {
    {
        Derived d; // Instantiation starts constructor chain
    } // Block exit starts destructor chain in REVERSE order!
    return 0;
}`,
        steps: [
            { lineNum: 17, action: 'construct', detail: 'Derived d instantiated', explanation: 'Base constructor executes first, followed by Derived constructor.', vars: { state: 'constructed' }, output: ['1. Base Constructor', '2. Derived Constructor'] },
            { lineNum: 18, action: 'destruct', detail: 'Block closes -> Destructors run', explanation: 'Destruction runs in exact REVERSE order: Derived destructor first, then Base destructor.', vars: { state: 'destroyed' }, output: ['1. Base Constructor', '2. Derived Constructor', '3. Derived Destructor', '4. Base Destructor'] },
            { lineNum: 19, action: 'return', detail: 'return 0', explanation: 'Clean exit.', vars: {}, output: ['1. Base Constructor', '2. Derived Constructor', '3. Derived Destructor', '4. Base Destructor', '[Process completed with code 0]'] }
        ]
    }
];

export default function CppInheritanceVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
    const getInitialPreset = () => {
        if (lessonOrder && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            return TOPIC_PRESETS[lessonOrder - 1];
        }
        if (lessonTitle) {
            const found = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
            if (found) return found;
        }
        return TOPIC_PRESETS[1]; // Default to Diamond Problem
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

    const simulationSteps = selectedExample.steps || TOPIC_PRESETS[1].steps;
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
                        C++ Inheritance &amp; Class Hierarchies
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

                {/* Right Column: Live Execution & Diamond Problem (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Live Execution & State Mutation (Right-Top Aligned with Code) */}
                    <CppExecutionInspector
                        currentStep={currentStep}
                        stepIdx={stepIdx}
                        totalSteps={simulationSteps.length}
                        topicLabel={selectedExample.label}
                    />

                    {/* Visual Hierarchy Diagram */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <GitMerge className="w-3.5 h-3.5 text-blue-600" />
                                Diamond Problem &amp; Virtual Base Class
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Ambiguity Solved
                            </span>
                        </div>

                        {/* Diamond Architecture Graph */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center text-xs">
                            {/* Top Root */}
                            <div className="inline-block px-4 py-1.5 bg-blue-600 text-white font-mono font-bold rounded-xl shadow-2xs">
                                PoweredDevice (voltage = 120)
                            </div>

                            <div className="flex justify-center gap-12 text-slate-400 text-xs font-bold">
                                <span>&swarr; virtual</span>
                                <span>virtual &searr;</span>
                            </div>

                            {/* Middle Branches */}
                            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                                <div className="p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-800">
                                    Scanner
                                </div>
                                <div className="p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-800">
                                    Printer
                                </div>
                            </div>

                            <div className="flex justify-center gap-12 text-slate-400 text-xs font-bold">
                                <span>&searr;</span>
                                <span>&swarr;</span>
                            </div>

                            {/* Derived Bottom */}
                            <div className="inline-block px-5 py-2 bg-slate-900 text-emerald-400 font-mono font-bold rounded-xl shadow-md border border-slate-700">
                                Copier (Single voltage copy)
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium pt-2 text-left">
                                By declaring <code>virtual public PoweredDevice</code>, the C++ compiler guarantees that only <strong>one single shared sub-object</strong> exists in memory for Copier.
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

