import React, { useState, useEffect } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from '../python/InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Layers,
    Code2,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Cpu,
    Binary,
    Database,
    Zap,
    Tag
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /keyword|identifier/i,
        label: '2.1 Keywords & Identifiers',
        code: `#include <stdio.h>

// 'int', 'return' are 32 ANSI C reserved keywords
// 'studentAge', 'calcAverage' are programmer identifiers
int main() {
    int studentAge = 21;
    double calcAverage = 88.5;

    printf("Identifier studentAge = %d\\n", studentAge);
    printf("Identifier calcAverage = %.1f\\n", calcAverage);
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'keyword', detail: "Keywords 'int' & identifier 'studentAge'", explanation: "'int' is a compiler keyword; 'studentAge' is an allocated identifier in local scope.", vars: { studentAge: '21', calcAverage: '-' }, output: [] },
            { lineNum: 7, action: 'keyword', detail: "Keywords 'double' & identifier 'calcAverage'", explanation: "'double' reserves 8 bytes for high-precision real numbers.", vars: { studentAge: '21', calcAverage: '88.5' }, output: [] },
            { lineNum: 9, action: 'print', detail: "printf statement", explanation: "Outputs variable values associated with the identifiers.", vars: { studentAge: '21', calcAverage: '88.5' }, output: ['Identifier studentAge = 21'] },
            { lineNum: 10, action: 'print', detail: "printf statement", explanation: "Outputs calcAverage.", vars: { studentAge: '21', calcAverage: '88.5' }, output: ['Identifier studentAge = 21', 'Identifier calcAverage = 88.5'] },
            { lineNum: 11, action: 'return', detail: "Keyword 'return'", explanation: "Terminates main with exit status 0.", vars: { studentAge: '21', calcAverage: '88.5' }, output: ['Identifier studentAge = 21', 'Identifier calcAverage = 88.5', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /operator/i,
        label: '2.2 Operators & Bitwise',
        code: `#include <stdio.h>

int main() {
    unsigned char a = 12; // 0000 1100
    unsigned char b = 10; // 0000 1010

    unsigned char and_res = a & b; // 0000 1000 = 8
    unsigned char or_res  = a | b; // 0000 1110 = 14
    unsigned char xor_res = a ^ b; // 0000 0110 = 6
    unsigned char shift_l = a << 2;// 0011 0000 = 48

    printf("AND: %d, OR: %d, XOR: %d, LSHIFT: %d\\n", and_res, or_res, xor_res, shift_l);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'assign', detail: 'a = 12 (0000 1100 in binary)', explanation: 'Operand a loaded into register.', vars: { a: '12', b: '-' }, output: [] },
            { lineNum: 5, action: 'assign', detail: 'b = 10 (0000 1010 in binary)', explanation: 'Operand b loaded into register.', vars: { a: '12', b: '10' }, output: [] },
            { lineNum: 7, action: 'bitwise', detail: 'Bitwise AND: 12 & 10 = 8', explanation: 'Both bits must be 1 to produce 1.', vars: { a: '12', b: '10', and: '8' }, output: [] },
            { lineNum: 8, action: 'bitwise', detail: 'Bitwise OR: 12 | 10 = 14', explanation: 'Either bit being 1 produces 1.', vars: { a: '12', b: '10', or: '14' }, output: [] },
            { lineNum: 12, action: 'print', detail: 'printf bitwise results', explanation: 'Values printed to terminal output.', vars: { a: '12', b: '10' }, output: ['AND: 8, OR: 14, XOR: 6, LSHIFT: 48'] },
            { lineNum: 13, action: 'return', detail: 'return 0', explanation: 'Success exit.', vars: { a: '12', b: '10' }, output: ['AND: 8, OR: 14, XOR: 6, LSHIFT: 48', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /constant/i,
        label: '2.3 Constants',
        code: `#include <stdio.h>

#define MAX_USERS 100 // Preprocessor constant

int main() {
    const double TAX_RATE = 0.18; // Read-only constant
    double price = 250.0;
    double final_cost = price + (price * TAX_RATE);

    printf("Max Users: %d\\n", MAX_USERS);
    printf("TAX_RATE (const): %.2f\\n", TAX_RATE);
    printf("Final cost: %.2f\\n", final_cost);
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'const', detail: 'const double TAX_RATE = 0.18', explanation: 'Compiler places TAX_RATE in read-only data section; re-assignment is disallowed.', vars: { TAX_RATE: '0.18 (const)', price: '-' }, output: [] },
            { lineNum: 7, action: 'assign', detail: 'price = 250.0', explanation: 'Mutable price variable initialized on stack.', vars: { TAX_RATE: '0.18', price: '250.0' }, output: [] },
            { lineNum: 10, action: 'print', detail: 'printf MAX_USERS', explanation: 'Macro literal expanded at compile-time.', vars: { TAX_RATE: '0.18', price: '250.0' }, output: ['Max Users: 100'] },
            { lineNum: 12, action: 'print', detail: 'printf final_cost', explanation: 'Calculated using constant rate.', vars: { TAX_RATE: '0.18', price: '250.0' }, output: ['Max Users: 100', 'TAX_RATE (const): 0.18', 'Final cost: 295.00'] },
            { lineNum: 13, action: 'return', detail: 'return 0', explanation: 'Program complete.', vars: {}, output: ['Max Users: 100', 'TAX_RATE (const): 0.18', 'Final cost: 295.00', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 4,
        matchPattern: /variable/i,
        label: '2.4 Variables & Memory Addresses',
        code: `#include <stdio.h>

int main() {
    int counter = 10;
    printf("Variable value: %d\\n", counter);
    printf("Variable memory address (&): %p\\n", (void*)&counter);

    counter = 25; // Mutation
    printf("Updated value: %d\\n", counter);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'decl', detail: 'int counter = 10 (at address 0x7ffd10)', explanation: 'Variable represents a named memory slot on the hardware stack.', vars: { counter: '10 (addr 0x7ffd10)' }, output: [] },
            { lineNum: 5, action: 'print', detail: 'printf counter value: 10', explanation: 'Reading memory slot.', vars: { counter: '10' }, output: ['Variable value: 10'] },
            { lineNum: 6, action: 'print', detail: 'printf &counter address: 0x7ffd10', explanation: 'Printing physical stack frame location.', vars: { counter: '10' }, output: ['Variable value: 10', 'Variable memory address (&): 0x7ffd10'] },
            { lineNum: 8, action: 'mutate', detail: 'counter = 25', explanation: 'Slot 0x7ffd10 overwritten with 25.', vars: { counter: '25 (addr 0x7ffd10)' }, output: ['Variable value: 10', 'Variable memory address (&): 0x7ffd10'] },
            { lineNum: 9, action: 'print', detail: 'printf updated value', explanation: 'Verification of state change.', vars: { counter: '25' }, output: ['Variable value: 10', 'Variable memory address (&): 0x7ffd10', 'Updated value: 25', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 5,
        matchPattern: /data type/i,
        label: '2.5 Data Types & sizeof',
        code: `#include <stdio.h>

int main() {
    char ch = 'A';
    int count = 42;
    float temp = 98.6f;
    double pi = 3.14159265;

    printf("char size: %zu byte\\n", sizeof(ch));
    printf("int size: %zu bytes\\n", sizeof(count));
    printf("float size: %zu bytes\\n", sizeof(temp));
    printf("double size: %zu bytes\\n", sizeof(pi));
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'decl', detail: "char ch = 'A' (1 Byte at 0x7ffd00)", explanation: "Allocating 1 byte on stack for char 'A' (ASCII 65).", vars: { ch: "'A'", count: '-', temp: '-', pi: '-' }, output: [] },
            { lineNum: 5, action: 'decl', detail: 'int count = 42 (4 Bytes at 0x7ffd04)', explanation: 'Allocating 4 contiguous bytes for integer 42 (hex 0x2A).', vars: { ch: "'A'", count: '42', temp: '-', pi: '-' }, output: [] },
            { lineNum: 6, action: 'decl', detail: 'float temp = 98.6f (4 Bytes IEEE 754)', explanation: 'Single-precision floating-point format.', vars: { ch: "'A'", count: '42', temp: '98.6f', pi: '-' }, output: [] },
            { lineNum: 7, action: 'decl', detail: 'double pi = 3.14159265 (8 Bytes)', explanation: 'Double-precision IEEE 754 (64 bits).', vars: { ch: "'A'", count: '42', temp: '98.6f', pi: '3.14159265' }, output: [] },
            { lineNum: 9, action: 'sizeof', detail: 'sizeof(ch) = 1 byte', explanation: 'Evaluated at compile-time by compiler.', vars: { ch: "'A'" }, output: ['char size: 1 byte'] },
            { lineNum: 10, action: 'sizeof', detail: 'sizeof(count) = 4 bytes', explanation: '32-bit integer representation.', vars: { ch: "'A'", count: '42' }, output: ['char size: 1 byte', 'int size: 4 bytes'] },
            { lineNum: 13, action: 'return', detail: 'return 0', explanation: 'All sizeof expressions completed.', vars: {}, output: ['char size: 1 byte', 'int size: 4 bytes', 'float size: 4 bytes', 'double size: 8 bytes', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 6,
        matchPattern: /precedence/i,
        label: '2.6 Precedence of Operators',
        code: `#include <stdio.h>

int main() {
    int a = 10, b = 5, c = 2;
    int res1 = a + b * c;       // 10 + (5 * 2) = 20 (Multiplication first)
    int res2 = (a + b) * c;     // (10 + 5) * 2 = 30 (Parentheses override)
    int res3 = a > b && b > c;  // 1 (Logical AND after relational)

    printf("res1 = %d, res2 = %d, res3 = %d\\n", res1, res2, res3);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'decl', detail: 'int a = 10, b = 5, c = 2;', explanation: 'Operands initialized in CPU register slots.', vars: { a: '10', b: '5', c: '2' }, output: [] },
            { lineNum: 5, action: 'eval', detail: 'Evaluating a + b * c: 10 + (5 * 2) = 20', explanation: 'Multiplication * has higher precedence than addition +.', vars: { res1: '20' }, output: [] },
            { lineNum: 6, action: 'eval', detail: 'Evaluating (a + b) * c: (10 + 5) * 2 = 30', explanation: 'Parentheses () force addition to execute before multiplication.', vars: { res2: '30' }, output: [] },
            { lineNum: 9, action: 'print', detail: 'printf results', explanation: 'Outputs evaluation tree results.', vars: { res1: '20', res2: '30', res3: '1' }, output: ['res1 = 20, res2 = 30, res3 = 1'] },
            { lineNum: 10, action: 'return', detail: 'return 0', explanation: 'Complete.', vars: {}, output: ['res1 = 20, res2 = 30, res3 = 1', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 7,
        matchPattern: /scope|lifetime/i,
        label: '2.7 Scope & Lifetime',
        code: `#include <stdio.h>

int globalVar = 100; // Global Scope (Data Segment)

int main() {
    int blockVar = 50; // Local Scope (Stack Segment)

    {
        int innerVar = 10; // Block Scope (Lives inside braces only)
        printf("Inner block: innerVar=%d, blockVar=%d\\n", innerVar, blockVar);
    } // innerVar is destroyed here!

    printf("Outer block: blockVar=%d, globalVar=%d\\n", blockVar, globalVar);
    return 0;
}`,
        steps: [
            { lineNum: 3, action: 'global', detail: 'int globalVar = 100 in .data segment', explanation: 'Global variable allocated once before main() starts and lives for entire process.', vars: { globalVar: '100' }, output: [] },
            { lineNum: 6, action: 'local', detail: 'int blockVar = 50 in main stack', explanation: 'Local variable allocated on stack frame of main().', vars: { globalVar: '100', blockVar: '50' }, output: [] },
            { lineNum: 9, action: 'block', detail: 'int innerVar = 10 in nested block', explanation: 'Temporary stack offset allocated for inner block.', vars: { innerVar: '10', blockVar: '50' }, output: [] },
            { lineNum: 10, action: 'print', detail: 'Inner block execution', explanation: 'Both innerVar and blockVar accessible.', vars: { innerVar: '10' }, output: ['Inner block: innerVar=10, blockVar=50'] },
            { lineNum: 13, action: 'print', detail: 'Outer block execution', explanation: 'innerVar was destroyed at block closing brace; blockVar remains.', vars: { blockVar: '50' }, output: ['Inner block: innerVar=10, blockVar=50', 'Outer block: blockVar=50, globalVar=100', '[Process completed with code 0]'] }
        ]
    }
];

const CHALLENGES = [
    {
        code: `unsigned char a = 5; // 0000 0101\nunsigned char b = a << 2;`,
        question: 'What is the decimal value of b after shifting a left by 2 positions?',
        options: ['10', '20', '25', '7'],
        correct: '20',
        explanation: 'Shifting left by 2 multiplies by 2^2 (4). 5 * 4 = 20 (in binary 0001 0100 = 20).'
    },
    {
        code: `int x = 7, y = 2;\nfloat result = x / y;`,
        question: 'What value is stored in result?',
        options: ['3.5', '3.0', '4.0', 'Compilation Error'],
        correct: '3.0',
        explanation: 'Both x and y are ints, so x / y performs integer division resulting in 3. Then 3 is converted to 3.0f upon assignment.'
    }
];

export default function CTokensVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
    // Select initial preset based on lessonOrder or lessonTitle
    const getInitialPreset = () => {
        if (lessonOrder && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            return TOPIC_PRESETS[lessonOrder - 1];
        }
        if (lessonTitle) {
            const found = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
            if (found) return found;
        }
        return TOPIC_PRESETS[4]; // Default to 2.5 Data types
    };

    const [selectedExample, setSelectedExample] = useState(getInitialPreset());
    const [code, setCode] = useState(getInitialPreset().code);
    const [stepIdx, setStepIdx] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [activeBitwiseA, setActiveBitwiseA] = useState(12);
    const [activeBitwiseB, setActiveBitwiseB] = useState(10);
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Sync visualizer immediately whenever active topic changes in the syllabus drawer
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

    const simulationSteps = selectedExample.steps || TOPIC_PRESETS[4].steps;
    const currentStep = simulationSteps[stepIdx] || simulationSteps[0];
    const transitionInfo = getStepTransitionInfo(simulationSteps, stepIdx);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setTimeout(() => {
                if (stepIdx < simulationSteps.length - 1) {
                    setStepIdx(prev => prev + 1);
                } else {
                    setIsRunning(false);
                }
            }, 1200 / speed);
        }
        return () => clearTimeout(timer);
    }, [isRunning, stepIdx, speed, simulationSteps.length]);

    const handleSelectExample = (ex) => {
        setSelectedExample(ex);
        setCode(ex.code);
        setStepIdx(0);
        setIsRunning(false);
    };

    const toBinary8 = (val) => (val & 0xff).toString(2).padStart(8, '0');

    return (
        <div className="space-y-4">
            {/* Simple & Clean Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        C Tokens &amp; Data Types
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                        &bull; {selectedExample.label}
                    </span>
                </div>

                {/* Compact Topic Pills */}
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

            {/* Main Side-by-Side Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* ── LEFT SIDE: Code Runner & Arrow Trajectory (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Code2 className="w-3.5 h-3.5 text-blue-600" />
                            Live Code Execution
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
                            setStepIdx(0);
                            setIsRunning(true);
                        }}
                        stepForward={() => {
                            if (stepIdx < simulationSteps.length - 1) setStepIdx(prev => prev + 1);
                        }}
                        resetExecution={() => {
                            setStepIdx(0);
                            setIsRunning(false);
                        }}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={currentStep.detail}
                        stepCounterText={`Step ${stepIdx + 1} of ${simulationSteps.length}`}
                        terminalLines={currentStep.output}
                        badgeText="C Compiler (GCC)"
                        fileName="tokens.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Real-Time Memory & Hardware Visualizer (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Layers className="w-3.5 h-3.5 text-blue-600" />
                            Systems Memory State
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Stack: 0x7ffd00
                        </span>
                    </div>

                    {/* 1. Stack Memory Footprint & sizeof Breakdown */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-semibold text-white">Active Variables &amp; Hardware Scales</h3>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                {Object.keys(currentStep.vars || {}).length} Active Slots
                            </span>
                        </div>

                        {/* Visual Data Type Memory Scale Shape */}
                        <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
                            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">C Primary Type Size Gauge:</div>
                            <div className="flex items-center gap-1.5 font-mono text-center text-[10px]">
                                <div className="p-1.5 bg-cyan-950/70 border border-cyan-500/50 rounded-lg text-cyan-300 w-16">
                                    <div className="font-bold">char</div>
                                    <div className="text-[9px] text-slate-400">1 Byte</div>
                                </div>
                                <div className="p-1.5 bg-teal-950/70 border border-teal-500/50 rounded-lg text-teal-300 w-20">
                                    <div className="font-bold">short</div>
                                    <div className="text-[9px] text-slate-400">2 Bytes</div>
                                </div>
                                <div className="p-1.5 bg-blue-950/70 border border-blue-500/50 rounded-lg text-blue-300 flex-1">
                                    <div className="font-bold">int / float</div>
                                    <div className="text-[9px] text-slate-400">4 Bytes (32 bits)</div>
                                </div>
                                <div className="p-1.5 bg-emerald-950/70 border border-emerald-500/50 rounded-lg text-emerald-300 flex-1">
                                    <div className="font-bold">double / long</div>
                                    <div className="text-[9px] text-slate-400">8 Bytes (64 bits)</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 font-mono text-xs">
                            {Object.entries(currentStep.vars || {}).map(([vName, vVal]) => (
                                <div key={vName} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="text-slate-300 font-bold">{vName}</span>
                                    </div>
                                    <span className="text-blue-300 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800 font-semibold">
                                        {vVal}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                            <strong className="text-blue-400 font-semibold">Execution State: </strong>
                            {currentStep.explanation}
                        </div>
                    </div>

                    {/* 2. Interactive Bitwise Shift & Masking Workbench */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Binary className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">CPU ALU Bitboard</h3>
                            </div>
                            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                Binary Simulation
                            </span>
                        </div>

                        {/* Operands Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                                <label className="text-slate-400 block mb-1">Operand A (decimal):</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={activeBitwiseA}
                                    onChange={e => setActiveBitwiseA(Number(e.target.value) & 0xff)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-slate-400 block mb-1">Operand B (decimal):</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={activeBitwiseB}
                                    onChange={e => setActiveBitwiseB(Number(e.target.value) & 0xff)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Bitboard Display */}
                        <div className="space-y-1.5 font-mono text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">A ({activeBitwiseA}):</span>
                                <span className="text-blue-400 tracking-widest">{toBinary8(activeBitwiseA)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">B ({activeBitwiseB}):</span>
                                <span className="text-slate-300 tracking-widest">{toBinary8(activeBitwiseB)}</span>
                            </div>
                            <div className="border-t border-slate-800 pt-1.5 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-emerald-400 font-bold">A &amp; B (AND):</span>
                                    <span className="text-emerald-300 font-bold tracking-widest">{toBinary8(activeBitwiseA & activeBitwiseB)} = {(activeBitwiseA & activeBitwiseB)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-amber-400 font-bold">A | B (OR):</span>
                                    <span className="text-amber-300 font-bold tracking-widest">{toBinary8(activeBitwiseA | activeBitwiseB)} = {(activeBitwiseA | activeBitwiseB)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sky-400 font-bold">A &lt;&lt; 2 (LSHIFT):</span>
                                    <span className="text-sky-300 font-bold tracking-widest">{toBinary8(activeBitwiseA << 2)} = {(activeBitwiseA << 2) & 0xff}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Concept Challenge */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <h3 className="text-sm font-semibold text-white">Interactive Knowledge Check</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                        Question {challengeIdx + 1} of {CHALLENGES.length}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-blue-300">
                        <pre>{CHALLENGES[challengeIdx].code}</pre>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-medium text-slate-200">
                            {CHALLENGES[challengeIdx].question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {CHALLENGES[challengeIdx].options.map(opt => {
                                const isSelected = selectedOption === opt;
                                const isCorrect = opt === CHALLENGES[challengeIdx].correct;
                                let btnStyle = 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800';

                                if (showExplanation) {
                                    if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                                    else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                                }

                                return (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setSelectedOption(opt);
                                            setShowExplanation(true);
                                        }}
                                        className={`px-3 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer text-left ${btnStyle}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 animate-fadeIn">
                                <p className="leading-relaxed">
                                    <strong className="text-blue-400">Explanation: </strong>
                                    {CHALLENGES[challengeIdx].explanation}
                                </p>
                                <button
                                    onClick={() => {
                                        setChallengeIdx((challengeIdx + 1) % CHALLENGES.length);
                                        setSelectedOption(null);
                                        setShowExplanation(false);
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                                >
                                    Next Challenge <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
