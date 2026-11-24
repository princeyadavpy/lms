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
    Hash,
    Database,
    Tag,
    Cpu
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /keywords and identifiers/i,
        label: '2.1 Keywords & Identifiers',
        code: `#include <iostream>

// C++ Keywords: class, public, private, int, double, return
// Identifiers: Employee, empId, salary
class Employee {
public:
    int empId;
    double salary;
};

int main() {
    Employee emp;
    emp.empId = 101;
    emp.salary = 75000.50;

    std::cout << "Emp ID: " << emp.empId << std::endl;
    std::cout << "Salary: $" << emp.salary << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 12, action: 'instantiate', detail: 'Employee emp allocated on stack', explanation: 'Creates object identifier emp with member slots empId and salary.', vars: { 'emp.empId': '-', 'emp.salary': '-' }, output: [] },
            { lineNum: 13, action: 'assign', detail: 'emp.empId = 101', explanation: 'Sets 4-byte integer identifier empId.', vars: { 'emp.empId': '101', 'emp.salary': '-' }, output: [] },
            { lineNum: 14, action: 'assign', detail: 'emp.salary = 75000.50', explanation: 'Sets 8-byte IEEE-754 double floating point field.', vars: { 'emp.empId': '101', 'emp.salary': '75000.50' }, output: [] },
            { lineNum: 16, action: 'print', detail: 'cout << emp.empId', explanation: 'Streams empId to stdout.', vars: { 'emp.empId': '101', 'emp.salary': '75000.50' }, output: ['Emp ID: 101'] },
            { lineNum: 17, action: 'print', detail: 'cout << emp.salary', explanation: 'Streams salary to stdout.', vars: { 'emp.empId': '101', 'emp.salary': '75000.50' }, output: ['Emp ID: 101', 'Salary: $75000.5'] },
            { lineNum: 18, action: 'return', detail: 'return 0', explanation: 'Main finishes cleanly.', vars: {}, output: ['Emp ID: 101', 'Salary: $75000.5', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /operators/i,
        label: '2.2 C++ Operators & Scope (::)',
        code: `#include <iostream>

int globalVal = 500; // Global variable in global namespace

int main() {
    int globalVal = 10; // Local shadowing variable

    std::cout << "Local globalVal:  " << globalVal << std::endl;
    std::cout << "Global ::globalVal: " << ::globalVal << std::endl;

    // Stream operators: << (insertion) and >> (extraction)
    int a = 15, b = 4;
    std::cout << "Modulus (a % b): " << (a % b) << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'assign', detail: 'Local variable shadow', explanation: 'Stack frame allocates local globalVal = 10, shadowing the outer global variable.', vars: { localVal: '10', '::globalVal': '500' }, output: [] },
            { lineNum: 8, action: 'print', detail: 'Print local variable', explanation: 'Resolves to nearest block scope (10).', vars: { localVal: '10', '::globalVal': '500' }, output: ['Local globalVal:  10'] },
            { lineNum: 9, action: 'print', detail: 'Scope Resolution ::globalVal', explanation: 'Unary :: operator accesses the file-level global variable (500).', vars: { localVal: '10', '::globalVal': '500' }, output: ['Local globalVal:  10', 'Global ::globalVal: 500'] },
            { lineNum: 13, action: 'print', detail: 'Modulus expression', explanation: 'Computes remainder: 15 % 4 = 3.', vars: { 'a % b': '3' }, output: ['Local globalVal:  10', 'Global ::globalVal: 500', 'Modulus (a % b): 3'] },
            { lineNum: 14, action: 'return', detail: 'return 0', explanation: 'Program exit.', vars: {}, output: ['Local globalVal:  10', 'Global ::globalVal: 500', 'Modulus (a % b): 3', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /constants/i,
        label: '2.3 Constants & constexpr',
        code: `#include <iostream>

// constexpr is evaluated at compile time by the compiler
constexpr int calculateBuffer(int factor) {
    return factor * 64;
}

int main() {
    const double PI = 3.14159265;
    constexpr int bufferSize = calculateBuffer(4); // 256 computed at compile time

    std::cout << "PI (const): " << PI << std::endl;
    std::cout << "bufferSize (constexpr): " << bufferSize << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 9, action: 'const', detail: 'const double PI = 3.14159265', explanation: 'Read-only variable in stack memory; re-assignment produces compiler error.', vars: { PI: '3.14159', bufferSize: '-' }, output: [] },
            { lineNum: 10, action: 'constexpr', detail: 'constexpr bufferSize = 256', explanation: 'calculateBuffer(4) is baked directly into the assembly literal by the compiler.', vars: { PI: '3.14159', bufferSize: '256 (compile-time)' }, output: [] },
            { lineNum: 12, action: 'print', detail: 'Print PI', explanation: 'Outputs constant value.', vars: { PI: '3.14159', bufferSize: '256' }, output: ['PI (const): 3.14159'] },
            { lineNum: 13, action: 'print', detail: 'Print bufferSize', explanation: 'Outputs compile-time constant.', vars: { PI: '3.14159', bufferSize: '256' }, output: ['PI (const): 3.14159', 'bufferSize (constexpr): 256'] },
            { lineNum: 14, action: 'return', detail: 'return 0', explanation: 'Execution complete.', vars: {}, output: ['PI (const): 3.14159', 'bufferSize (constexpr): 256', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 4,
        matchPattern: /variables/i,
        label: '2.4 Reference Variables (&)',
        code: `#include <iostream>

int main() {
    int original = 42;
    // 'ref' is an alias (reference) to 'original' - shares the exact same memory!
    int &ref = original;

    std::cout << "Initial original: " << original << ", ref: " << ref << std::endl;

    ref = 99; // Modifying through the reference modifies 'original' directly
    std::cout << "After ref = 99  : " << original << ", ref: " << ref << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'assign', detail: 'int original = 42', explanation: 'Allocates memory cell at 0x7ffee4 storing value 42.', vars: { original: '42', ref: '-' }, output: [] },
            { lineNum: 6, action: 'bind', detail: 'int &ref = original', explanation: 'Alias bound: ref points directly to address 0x7ffee4. No new memory allocated.', vars: { original: '42', ref: '42 (alias of original)' }, output: [] },
            { lineNum: 8, action: 'print', detail: 'Initial printout', explanation: 'Both display 42.', vars: { original: '42', ref: '42' }, output: ['Initial original: 42, ref: 42'] },
            { lineNum: 10, action: 'mutate', detail: 'ref = 99', explanation: 'Modifies address 0x7ffee4. Both original and ref now read 99.', vars: { original: '99', ref: '99' }, output: ['Initial original: 42, ref: 42'] },
            { lineNum: 11, action: 'print', detail: 'Print updated state', explanation: 'Confirm original has changed.', vars: { original: '99', ref: '99' }, output: ['Initial original: 42, ref: 42', 'After ref = 99  : 99, ref: 99'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Done.', vars: {}, output: ['Initial original: 42, ref: 42', 'After ref = 99  : 99, ref: 99', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 5,
        matchPattern: /data types/i,
        label: '2.5 Fundamental Data Types',
        code: `#include <iostream>

int main() {
    bool isEngineRunning = true; // 1 byte (0 or 1)
    char grade = 'A';           // 1 byte ASCII
    int counter = 2026;         // 4 bytes signed integer
    double preciseVal = 3.14159;// 8 bytes double precision
    auto deduced = 450L;        // auto deductions (long integer)

    std::cout << "Size of bool:   " << sizeof(bool) << " byte" << std::endl;
    std::cout << "Size of int:    " << sizeof(int) << " bytes" << std::endl;
    std::cout << "Size of double: " << sizeof(double) << " bytes" << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'alloc', detail: 'bool isEngineRunning = true', explanation: 'Allocates 1 byte boolean flag (1).', vars: { isEngineRunning: 'true (1)', counter: '-' }, output: [] },
            { lineNum: 6, action: 'alloc', detail: 'int counter = 2026', explanation: 'Allocates 4 bytes signed integer.', vars: { isEngineRunning: 'true', counter: '2026' }, output: [] },
            { lineNum: 7, action: 'alloc', detail: 'double preciseVal = 3.14159', explanation: 'Allocates 8 bytes high-precision float.', vars: { counter: '2026', preciseVal: '3.14159' }, output: [] },
            { lineNum: 10, action: 'print', detail: 'sizeof(bool)', explanation: 'Reports 1 byte memory footprint.', vars: {}, output: ['Size of bool:   1 byte'] },
            { lineNum: 11, action: 'print', detail: 'sizeof(int)', explanation: 'Reports 4 bytes memory footprint.', vars: {}, output: ['Size of bool:   1 byte', 'Size of int:    4 bytes'] },
            { lineNum: 12, action: 'print', detail: 'sizeof(double)', explanation: 'Reports 8 bytes memory footprint.', vars: {}, output: ['Size of bool:   1 byte', 'Size of int:    4 bytes', 'Size of double: 8 bytes'] },
            { lineNum: 13, action: 'return', detail: 'return 0', explanation: 'Process complete.', vars: {}, output: ['Size of bool:   1 byte', 'Size of int:    4 bytes', 'Size of double: 8 bytes', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 6,
        matchPattern: /precedence/i,
        label: '2.6 Operator Precedence',
        code: `#include <iostream>

int main() {
    // Multiplication (*) and Division (/) have higher precedence than Addition (+)
    int res1 = 10 + 5 * 2;     // 10 + 10 = 20
    int res2 = (10 + 5) * 2;   // 15 * 2 = 30 (parentheses override)

    bool comp = 5 + 3 > 7 && 10 - 2 == 8; // Arithmetic > Relational > Logical
    std::cout << "res1 (10 + 5 * 2):   " << res1 << std::endl;
    std::cout << "res2 ((10 + 5) * 2): " << res2 << std::endl;
    std::cout << "comp result:         " << (comp ? "true" : "false") << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'calc', detail: 'Evaluate 10 + 5 * 2', explanation: '5 * 2 evaluated first (10), then 10 + 10 = 20.', vars: { res1: '20', res2: '-' }, output: [] },
            { lineNum: 6, action: 'calc', detail: 'Evaluate (10 + 5) * 2', explanation: 'Parentheses evaluated first: 15 * 2 = 30.', vars: { res1: '20', res2: '30' }, output: [] },
            { lineNum: 8, action: 'calc', detail: 'Compound precedence evaluation', explanation: 'Arithmetic (8 > 7 and 8 == 8) -> True && True -> True (1).', vars: { res1: '20', res2: '30', comp: 'true' }, output: [] },
            { lineNum: 9, action: 'print', detail: 'Print res1', explanation: 'Streams 20.', vars: {}, output: ['res1 (10 + 5 * 2):   20'] },
            { lineNum: 10, action: 'print', detail: 'Print res2', explanation: 'Streams 30.', vars: {}, output: ['res1 (10 + 5 * 2):   20', 'res2 ((10 + 5) * 2): 30'] },
            { lineNum: 11, action: 'print', detail: 'Print comp', explanation: 'Streams true.', vars: {}, output: ['res1 (10 + 5 * 2):   20', 'res2 ((10 + 5) * 2): 30', 'comp result:         true'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Exits.', vars: {}, output: ['res1 (10 + 5 * 2):   20', 'res2 ((10 + 5) * 2): 30', 'comp result:         true', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 7,
        matchPattern: /scope and lifetime/i,
        label: '2.7 Scope & Lifetime of Variables',
        code: `#include <iostream>

namespace MyNamespace {
    int appVersion = 3;
}

int main() {
    int outer = 100;
    {
        int inner = 200; // Block scope - destroyed when block exits
        std::cout << "Inside block: inner = " << inner << ", outer = " << outer << std::endl;
    } // 'inner' memory is deallocated right here!

    std::cout << "Namespace var: " << MyNamespace::appVersion << std::endl;
    std::cout << "Outer var: " << outer << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 8, action: 'alloc', detail: 'outer = 100 in main frame', explanation: 'outer variable allocated on stack with function lifetime.', vars: { outer: '100', inner: '-' }, output: [] },
            { lineNum: 10, action: 'alloc', detail: 'inner = 200 in nested block', explanation: 'inner variable allocated on stack with block lifetime.', vars: { outer: '100', inner: '200' }, output: [] },
            { lineNum: 11, action: 'print', detail: 'Print inside block', explanation: 'Both inner and outer are accessible.', vars: { outer: '100', inner: '200' }, output: ['Inside block: inner = 200, outer = 100'] },
            { lineNum: 12, action: 'free', detail: 'Block closes: inner destroyed', explanation: 'Block scope ends. inner goes out of scope and is popped from stack.', vars: { outer: '100', inner: '[destroyed]' }, output: ['Inside block: inner = 200, outer = 100'] },
            { lineNum: 14, action: 'print', detail: 'Print namespace variable', explanation: 'MyNamespace::appVersion resolved.', vars: { outer: '100' }, output: ['Inside block: inner = 200, outer = 100', 'Namespace var: 3'] },
            { lineNum: 16, action: 'return', detail: 'return 0', explanation: 'Main finishes.', vars: {}, output: ['Inside block: inner = 200, outer = 100', 'Namespace var: 3', 'Outer var: 100', '[Process completed with code 0]'] }
        ]
    }
];

export default function CppTokensVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
    const getInitialPreset = () => {
        if (lessonOrder && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            return TOPIC_PRESETS[lessonOrder - 1];
        }
        if (lessonTitle) {
            const found = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
            if (found) return found;
        }
        return TOPIC_PRESETS[3]; // Default to Reference Variables
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
                        C++ Tokens &amp; Memory Semantics
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

                {/* Right Column: Live Execution & Interactive Topic Visualizer (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Live Execution & State Mutation (Right-Top Aligned with Code) */}
                    <CppExecutionInspector
                        currentStep={currentStep}
                        stepIdx={stepIdx}
                        totalSteps={simulationSteps.length}
                        topicLabel={selectedExample.label}
                    />

                    {/* Topic-Specific Visual Architecture */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                                {selectedExample.label} Diagram
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                C++ Core Model
                            </span>
                        </div>

                        {/* 2.1: Keywords & Identifiers Taxonomy */}
                        {selectedExample.topicId === 1 && (
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 space-y-1.5">
                                    <div className="font-bold text-purple-900 font-sans text-[11px] uppercase tracking-wider">C++ Keywords</div>
                                    <div className="flex flex-wrap gap-1">
                                        {['class', 'public', 'private', 'int', 'double', 'return'].map(k => (
                                            <span key={k} className="px-1.5 py-0.5 rounded bg-white text-purple-700 font-bold border border-purple-200 text-[10px]">
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-purple-600 font-sans mt-1">Reserved compiler tokens</p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1.5">
                                    <div className="font-bold text-blue-900 font-sans text-[11px] uppercase tracking-wider">Identifiers</div>
                                    <div className="flex flex-wrap gap-1">
                                        {['Employee', 'empId', 'salary', 'e1', 'main'].map(i => (
                                            <span key={i} className="px-1.5 py-0.5 rounded bg-white text-blue-700 font-bold border border-blue-200 text-[10px]">
                                                {i}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-blue-600 font-sans mt-1">User-defined names</p>
                                </div>
                            </div>
                        )}

                        {/* 2.2: Scope Resolution :: Operator */}
                        {selectedExample.topicId === 2 && (
                            <div className="space-y-2 text-xs font-mono">
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                    <span className="text-slate-500 font-sans">Global Scope Access:</span>
                                    <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">::counter (0x7ffd00)</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                    <span className="text-slate-500 font-sans">Local Shadowed Variable:</span>
                                    <span className="font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">counter (0x7ffd10)</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                    <span className="text-slate-500 font-sans">Class Static Member:</span>
                                    <span className="font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">Math::PI</span>
                                </div>
                            </div>
                        )}

                        {/* 2.3: constexpr & const */}
                        {selectedExample.topicId === 3 && (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                                    <div className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider font-mono">constexpr</div>
                                    <div className="text-base font-black text-emerald-700 font-mono">Compile-Time</div>
                                    <p className="text-[10px] text-emerald-600 leading-snug">Zero runtime computation cost. Evaluated directly by compiler.</p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                                    <div className="font-bold text-blue-900 text-[11px] uppercase tracking-wider font-mono">const</div>
                                    <div className="text-base font-black text-blue-700 font-mono">Run-Time ROM</div>
                                    <p className="text-[10px] text-blue-600 leading-snug">Immutable read-only storage assigned at execution time.</p>
                                </div>
                            </div>
                        )}

                        {/* 2.4 - 2.7: General C++ Token Evaluation Card */}
                        {selectedExample.topicId >= 4 && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                                <div className="flex items-center justify-between font-mono">
                                    <span className="text-slate-500">Evaluation Phase:</span>
                                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                        Step {stepIdx + 1} / {simulationSteps.length}
                                    </span>
                                </div>
                                <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] flex items-center justify-between">
                                    <span className="text-slate-600">Active Token Action:</span>
                                    <span className="font-bold text-slate-900">{currentStep.action}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                    {currentStep.explanation}
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

