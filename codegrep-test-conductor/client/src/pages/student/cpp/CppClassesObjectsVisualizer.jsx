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
    Box,
    Grid,
    Sliders,
    Monitor
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /classes & object specifier|classes and object/i,
        label: '3.1 Classes & Access Specifiers',
        code: `#include <iostream>

class Student {
private:
    int secretId;  // Accessible ONLY inside class methods

public:
    std::string name; // Accessible anywhere

    void setSecret(int id) { secretId = id; }
    int getSecret() const { return secretId; }
};

int main() {
    Student s1;
    s1.name = "John Doe";
    s1.setSecret(90210);

    std::cout << "Student: " << s1.name << std::endl;
    std::cout << "Secret:  " << s1.getSecret() << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 14, action: 'instantiate', detail: 'Student s1 allocated on stack', explanation: 'Creates s1 object with private secretId slot and public name slot.', vars: { 's1.name': '""', 's1.secretId': '[hidden]' }, output: [] },
            { lineNum: 15, action: 'assign', detail: 's1.name = "John Doe"', explanation: 'Public member directly assigned from main scope.', vars: { 's1.name': '"John Doe"', 's1.secretId': '[hidden]' }, output: [] },
            { lineNum: 16, action: 'call', detail: 's1.setSecret(90210)', explanation: 'Public mutator method safely sets private secretId.', vars: { 's1.name': '"John Doe"', 's1.secretId': '90210' }, output: [] },
            { lineNum: 18, action: 'print', detail: 'Print public name', explanation: 'Outputs John Doe to stdout.', vars: { 's1.name': '"John Doe"', 's1.secretId': '90210' }, output: ['Student: John Doe'] },
            { lineNum: 19, action: 'print', detail: 'Print getSecret()', explanation: 'Public accessor retrieves private 90210.', vars: { 's1.name': '"John Doe"', 's1.secretId': '90210' }, output: ['Student: John Doe', 'Secret:  90210'] },
            { lineNum: 20, action: 'return', detail: 'return 0', explanation: 'Process complete.', vars: {}, output: ['Student: John Doe', 'Secret:  90210', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /defining data members/i,
        label: '3.2 Member Function Definitions (::)',
        code: `#include <iostream>

class Calculator {
public:
    // Defined inside class (implicitly inline)
    int multiply(int a, int b) { return a * b; }

    // Declared inside class, defined outside using ::
    int divide(int a, int b);
};

// Outside class definition using Scope Resolution (::)
int Calculator::divide(int a, int b) {
    if (b == 0) return 0;
    return a / b;
}

int main() {
    Calculator calc;
    int prod = calc.multiply(6, 7);
    int quot = calc.divide(42, 6);

    std::cout << "6 * 7 = " << prod << std::endl;
    std::cout << "42 / 6 = " << quot << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 18, action: 'instantiate', detail: 'Calculator calc instantiated', explanation: 'Instantiates Calculator on stack.', vars: { calc: 'Calculator', prod: '-', quot: '-' }, output: [] },
            { lineNum: 19, action: 'call', detail: 'calc.multiply(6, 7)', explanation: 'Executes inline inside-class method. 6 * 7 = 42.', vars: { calc: 'Calculator', prod: '42', quot: '-' }, output: [] },
            { lineNum: 20, action: 'call', detail: 'calc.divide(42, 6)', explanation: 'Executes outside-class definition Calculator::divide. 42 / 6 = 7.', vars: { calc: 'Calculator', prod: '42', quot: '7' }, output: [] },
            { lineNum: 22, action: 'print', detail: 'Print multiply result', explanation: 'Streams 42.', vars: { prod: '42', quot: '7' }, output: ['6 * 7 = 42'] },
            { lineNum: 23, action: 'print', detail: 'Print divide result', explanation: 'Streams 7.', vars: { prod: '42', quot: '7' }, output: ['6 * 7 = 42', '42 / 6 = 7'] },
            { lineNum: 24, action: 'return', detail: 'return 0', explanation: 'Done.', vars: {}, output: ['6 * 7 = 42', '42 / 6 = 7', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /array of objects/i,
        label: '3.3 Array of Objects',
        code: `#include <iostream>

class Product {
public:
    int id;
    double price;

    void set(int i, double p) { id = i; price = p; }
};

int main() {
    // Array of 3 Product objects in contiguous stack memory
    Product inventory[3];
    inventory[0].set(101, 19.99);
    inventory[1].set(102, 49.50);
    inventory[2].set(103, 9.75);

    for (int i = 0; i < 3; i++) {
        std::cout << "Item #" << inventory[i].id << ": $" << inventory[i].price << std::endl;
    }
    return 0;
}`,
        steps: [
            { lineNum: 12, action: 'alloc', detail: 'Product inventory[3] allocated', explanation: 'Allocates contiguous memory for 3 Product records.', vars: { 'inv[0]': 'uninitialized', 'inv[1]': 'uninitialized', 'inv[2]': 'uninitialized' }, output: [] },
            { lineNum: 13, action: 'assign', detail: 'inventory[0].set(101, 19.99)', explanation: 'Initializes first slot.', vars: { 'inv[0]': '{id:101, $19.99}', 'inv[1]': '-', 'inv[2]': '-' }, output: [] },
            { lineNum: 14, action: 'assign', detail: 'inventory[1].set(102, 49.50)', explanation: 'Initializes second slot.', vars: { 'inv[0]': '{101, $19.99}', 'inv[1]': '{102, $49.50}', 'inv[2]': '-' }, output: [] },
            { lineNum: 15, action: 'assign', detail: 'inventory[2].set(103, 9.75)', explanation: 'Initializes third slot.', vars: { 'inv[0]': '{101, $19.99}', 'inv[1]': '{102, $49.50}', 'inv[2]': '{103, $9.75}' }, output: [] },
            { lineNum: 18, action: 'loop', detail: 'Traverse array & print', explanation: 'Iterates through contiguous memory blocks.', vars: { 'inv[0..2]': 'populated' }, output: ['Item #101: $19.99', 'Item #102: $49.5', 'Item #103: $9.75'] },
            { lineNum: 20, action: 'return', detail: 'return 0', explanation: 'Exits.', vars: {}, output: ['Item #101: $19.99', 'Item #102: $49.5', 'Item #103: $9.75', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 4,
        matchPattern: /manipulators/i,
        label: '3.7 Stream Manipulators (<iomanip>)',
        code: `#include <iostream>
#include <iomanip>

int main() {
    double pi = 3.14159265;
    int num = 42;

    std::cout << "Default: " << pi << std::endl;
    std::cout << "setprecision(2): " << std::fixed << std::setprecision(2) << pi << std::endl;
    std::cout << "setw(6) with fill: [" << std::setw(6) << std::setfill('0') << num << "]" << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 8, action: 'print', detail: 'Default stream output', explanation: 'Default cout prints 3.14159.', vars: { pi: '3.14159', num: '42' }, output: ['Default: 3.14159'] },
            { lineNum: 9, action: 'manip', detail: 'setprecision(2) applied', explanation: 'Formats stream to exactly 2 fixed decimal places: 3.14.', vars: { pi: '3.14', num: '42' }, output: ['Default: 3.14159', 'setprecision(2): 3.14'] },
            { lineNum: 10, action: 'manip', detail: 'setw(6) & setfill(0)', explanation: 'Pads right-aligned integer with leading zeros to width 6: [000042].', vars: { formatted: '[000042]' }, output: ['Default: 3.14159', 'setprecision(2): 3.14', 'setw(6) with fill: [000042]'] },
            { lineNum: 11, action: 'return', detail: 'return 0', explanation: 'Success exit.', vars: {}, output: ['Default: 3.14159', 'setprecision(2): 3.14', 'setw(6) with fill: [000042]', '[Process completed with code 0]'] }
        ]
    }
];

export default function CppClassesObjectsVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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
                        C++ Classes, Objects &amp; Console Streams
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

                {/* Right Column: Live Execution & Object Layout (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Live Execution & State Mutation (Right-Top Aligned with Code) */}
                    <CppExecutionInspector
                        currentStep={currentStep}
                        stepIdx={stepIdx}
                        totalSteps={simulationSteps.length}
                        topicLabel={selectedExample.label}
                    />

                    {/* Visual Class & Object Memory Structure */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <Box className="w-3.5 h-3.5 text-blue-600" />
                                Object Memory Layout Diagram
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                Stack Footprint
                            </span>
                        </div>

                        {/* Visual Memory Block */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                <span>Instance: <code className="text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">Student s1</code></span>
                                <span className="text-[10px] font-mono text-slate-500">Base Addr: 0x7ffe30</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-bold text-red-700">private:</span>
                                        <span className="text-[10px] font-mono text-slate-400">+0 bytes</span>
                                    </div>
                                    <div className="font-mono font-bold text-slate-900">int secretId</div>
                                    <div className="text-xs text-red-600 font-bold">{currentStep.vars?.['s1.secretId'] || '90210'}</div>
                                    <span className="text-[9px] text-slate-500 block">Restricted Access</span>
                                </div>

                                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-bold text-emerald-700">public:</span>
                                        <span className="text-[10px] font-mono text-slate-400">+4 bytes</span>
                                    </div>
                                    <div className="font-mono font-bold text-slate-900">string name</div>
                                    <div className="text-xs text-emerald-700 font-bold">{currentStep.vars?.['s1.name'] || '"John Doe"'}</div>
                                    <span className="text-[9px] text-slate-500 block">Open Access</span>
                                </div>
                            </div>

                            <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
                                <span className="font-bold text-slate-700">Member Functions:</span>
                                <span className="font-mono text-blue-600">Shared in Code Segment (.text)</span>
                            </div>
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

