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
    Share2,
    ChevronsUp,
    Cpu,
    GitCommit
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /concept.*function/i,
        label: '6.1 Concept of Function',
        code: `#include <stdio.h>

void greet(void) {
    printf("--> Inside greet() stack frame\\n");
}

int main() {
    printf("Entering main()\\n");
    greet(); // Subroutine invocation
    printf("Back in main()\\n");
    return 0;
}`,
        steps: [
            { lineNum: 8, action: 'entry', detail: 'main() entered', explanation: 'OS allocates main() activation record on runtime call stack.', stack: [{ frame: 'main()', vars: 'argc=1', ret: 'OS' }], output: ['Entering main()'] },
            { lineNum: 9, action: 'call', detail: 'call greet()', explanation: 'Call instruction pushes return address to next instruction in main() and creates greet() frame.', stack: [{ frame: 'main()', vars: 'argc=1', ret: 'OS' }, { frame: 'greet()', vars: 'void', ret: 'main:L10' }], output: ['Entering main()'] },
            { lineNum: 4, action: 'exec', detail: 'printf inside greet()', explanation: 'greet() statements executing on top of call stack.', stack: [{ frame: 'main()', vars: 'argc=1', ret: 'OS' }, { frame: 'greet()', vars: 'void', ret: 'main:L10' }], output: ['Entering main()', '--> Inside greet() stack frame'] },
            { lineNum: 5, action: 'return', detail: 'greet() returns', explanation: 'greet() frame popped; stack pointer unwinds back to main().', stack: [{ frame: 'main()', vars: 'argc=1', ret: 'OS' }], output: ['Entering main()', '--> Inside greet() stack frame'] },
            { lineNum: 10, action: 'resume', detail: 'Resume main()', explanation: 'Continues execution at main() instruction pointer.', stack: [{ frame: 'main()', vars: 'argc=1', ret: 'OS' }], output: ['Entering main()', '--> Inside greet() stack frame', 'Back in main()'] },
            { lineNum: 11, action: 'exit', detail: 'return 0', explanation: 'main() frame popped. Execution terminates.', stack: [], output: ['Entering main()', '--> Inside greet() stack frame', 'Back in main()', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What data structure manages active function invocations and local variables in C?',
            options: ['Call Stack (LIFO)', 'Queue (FIFO)', 'Binary Heap', 'Hash Table'],
            correct: 'Call Stack (LIFO)',
            explanation: 'Function calls push activation records onto the Call Stack in Last-In, First-Out (LIFO) order, popped upon returning.'
        }
    },
    {
        topicId: 2,
        matchPattern: /user defined/i,
        label: '6.2 User Defined Functions',
        code: `#include <stdio.h>

// 1. Function Prototype Declaration
int calculateSquare(int n);

int main() {
    int val = 6;
    // 2. Function Call
    int res = calculateSquare(val);
    printf("%d squared is %d\\n", val, res);
    return 0;
}

// 3. Function Definition
int calculateSquare(int n) {
    return n * n;
}`,
        steps: [
            { lineNum: 7, action: 'init', detail: 'val = 6 in main()', explanation: 'Local variable val initialized.', stack: [{ frame: 'main()', vars: 'val=6, res=?', ret: 'OS' }], output: [] },
            { lineNum: 9, action: 'call', detail: 'calculateSquare(6)', explanation: 'Pushes calculateSquare frame with argument n = 6.', stack: [{ frame: 'main()', vars: 'val=6, res=?', ret: 'OS' }, { frame: 'calculateSquare()', vars: 'n=6', ret: 'main:L9' }], output: [] },
            { lineNum: 16, action: 'compute', detail: 'return 6 * 6 (36)', explanation: 'Evaluates product 36 and returns value to caller register.', stack: [{ frame: 'main()', vars: 'val=6, res=?', ret: 'OS' }, { frame: 'calculateSquare()', vars: 'n=6, ret=36', ret: 'main:L9' }], output: [] },
            { lineNum: 9, action: 'assign', detail: 'res = 36', explanation: 'main() assigns returned 36 to res.', stack: [{ frame: 'main()', vars: 'val=6, res=36', ret: 'OS' }], output: [] },
            { lineNum: 10, action: 'print', detail: 'printf result', explanation: 'Outputs formatted result.', stack: [{ frame: 'main()', vars: 'val=6, res=36', ret: 'OS' }], output: ['6 squared is 36'] },
            { lineNum: 11, action: 'return', detail: 'return 0', explanation: 'Program complete.', stack: [], output: ['6 squared is 36', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'Why do we write function prototypes before main() in C?',
            options: ['To inform the compiler about function name, return type, and parameter types before its call', 'To allocate heap memory for the function', 'To automatically speed up CPU execution', 'Prototypes are mandatory syntax errors otherwise'],
            correct: 'To inform the compiler about function name, return type, and parameter types before its call',
            explanation: 'C compilers read files top-to-bottom; prototypes allow the compiler to validate call signatures before reaching the actual function definition.'
        }
    },
    {
        topicId: 3,
        matchPattern: /system defined|library function/i,
        label: '6.3 System Defined Functions',
        code: `#include <stdio.h>
#include <math.h>
#include <ctype.h>

int main() {
    double root = sqrt(49.0);     // math.h library
    double p = pow(2.0, 3.0);      // math.h library
    char upper = toupper('h');     // ctype.h library

    printf("sqrt(49) = %.1f\\n", root);
    printf("pow(2, 3) = %.1f\\n", p);
    printf("toupper('h') = '%c'\\n", upper);
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'sqrt', detail: 'sqrt(49.0)', explanation: 'C standard library routine computes square root using FPU = 7.0.', stack: [{ frame: 'main()', vars: 'root=7.0', ret: 'OS' }], output: [] },
            { lineNum: 7, action: 'pow', detail: 'pow(2.0, 3.0)', explanation: 'Standard library computes 2^3 = 8.0.', stack: [{ frame: 'main()', vars: 'root=7.0, p=8.0', ret: 'OS' }], output: [] },
            { lineNum: 8, action: 'toupper', detail: "toupper('h')", explanation: "ctype routine transforms ASCII 'h' (104) to 'H' (72).", stack: [{ frame: 'main()', vars: "root=7.0, p=8.0, upper='H'", ret: 'OS' }], output: [] },
            { lineNum: 10, action: 'print', detail: 'printf root and power', explanation: 'Outputs math results.', stack: [{ frame: 'main()', vars: "root=7.0, p=8.0, upper='H'", ret: 'OS' }], output: ['sqrt(49) = 7.0', 'pow(2, 3) = 8.0'] },
            { lineNum: 12, action: 'print', detail: 'printf uppercase', explanation: 'Outputs uppercase character.', stack: [{ frame: 'main()', vars: "root=7.0, p=8.0, upper='H'", ret: 'OS' }], output: ['sqrt(49) = 7.0', 'pow(2, 3) = 8.0', "toupper('h') = 'H'"] },
            { lineNum: 13, action: 'return', detail: 'return 0', explanation: 'Process complete.', stack: [], output: ['sqrt(49) = 7.0', 'pow(2, 3) = 8.0', "toupper('h') = 'H'", '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'When compiling code using <math.h> with GCC on Linux, which linker flag is often required?',
            options: ['-lm', '-math', '-libm', '-std=math'],
            correct: '-lm',
            explanation: 'The standard math routines reside in the separate libm library; GCC requires -lm to link with the math library binary.'
        }
    },
    {
        topicId: 4,
        matchPattern: /parameter passing|call by/i,
        label: '6.4 Parameter Passing (Value vs Reference)',
        code: `#include <stdio.h>

void swapByVal(int a, int b) {
    int tmp = a; a = b; b = tmp;
}

void swapByRef(int *a, int *b) {
    int tmp = *a; *a = *b; *b = tmp;
}

int main() {
    int x = 10, y = 20;

    swapByVal(x, y); // Copies values
    printf("After swapByVal: x=%d, y=%d\\n", x, y);

    swapByRef(&x, &y); // Passes memory addresses
    printf("After swapByRef: x=%d, y=%d\\n", x, y);
    return 0;
}`,
        steps: [
            { lineNum: 13, action: 'init', detail: 'int x = 10, y = 20 in main()', explanation: 'Stack frame stores x at 0x1000 and y at 0x1004.', stack: [{ frame: 'main()', vars: 'x=10, y=20', ret: 'OS' }], output: [] },
            { lineNum: 15, action: 'call-val', detail: 'swapByVal(10, 20)', explanation: 'Copies 10 and 20 into swapByVal frame. Caller memory remains isolated.', stack: [{ frame: 'main()', vars: 'x=10, y=20', ret: 'OS' }, { frame: 'swapByVal()', vars: 'a=10, b=20', ret: 'main:L16' }], output: [] },
            { lineNum: 16, action: 'print', detail: 'x and y unchanged (10, 20)', explanation: 'swapByVal mutations discarded upon return.', stack: [{ frame: 'main()', vars: 'x=10, y=20', ret: 'OS' }], output: ['After swapByVal: x=10, y=20'] },
            { lineNum: 18, action: 'call-ref', detail: 'swapByRef(&x, &y)', explanation: 'Passes pointers 0x1000 and 0x1004. swapByRef dereferences and mutates caller slots directly.', stack: [{ frame: 'main()', vars: 'x=10, y=20', ret: 'OS' }, { frame: 'swapByRef()', vars: 'a->0x1000, b->0x1004', ret: 'main:L19' }], output: ['After swapByVal: x=10, y=20'] },
            { lineNum: 19, action: 'print', detail: 'x and y swapped to 20, 10', explanation: 'Direct memory dereference succeeded.', stack: [{ frame: 'main()', vars: 'x=20, y=10', ret: 'OS' }], output: ['After swapByVal: x=10, y=20', 'After swapByRef: x=20, y=10'] },
            { lineNum: 20, action: 'return', detail: 'return 0', explanation: 'Program exit.', stack: [], output: ['After swapByVal: x=10, y=20', 'After swapByRef: x=20, y=10', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'Why does swapByVal fail to swap variables x and y in the caller function?',
            options: ['Because C passes copies of values, so swaps happen only on local function copies', 'Because functions cannot accept more than 1 argument', 'Because x and y are read-only', 'Because main() terminates immediately'],
            correct: 'Because C passes copies of values, so swaps happen only on local function copies',
            explanation: 'In Call by Value, the callee receives isolated copies on its own stack frame; modifications do not reflect in the caller frame.'
        }
    }
];

export default function CFunctionsVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
    const [selectedPreset, setSelectedPreset] = useState(TOPIC_PRESETS[0]);
    const [code, setCode] = useState(TOPIC_PRESETS[0].code);
    const [stepIdx, setStepIdx] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Auto-sync preset based on activeLesson / lessonOrder / lessonTitle
    useEffect(() => {
        let matchedPreset = null;
        if (typeof lessonOrder === 'number' && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            matchedPreset = TOPIC_PRESETS[lessonOrder - 1];
        } else if (lessonTitle) {
            matchedPreset = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
        }

        if (matchedPreset && matchedPreset.topicId !== selectedPreset.topicId) {
            setSelectedPreset(matchedPreset);
            setCode(matchedPreset.code);
            setStepIdx(0);
            setIsRunning(false);
            setSelectedOption(null);
            setShowExplanation(false);
        }
    }, [lessonOrder, lessonTitle]);

    const steps = selectedPreset.steps;
    const currentStep = steps[stepIdx] || steps[0];
    const transitionInfo = getStepTransitionInfo(steps, stepIdx);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setTimeout(() => {
                if (stepIdx < steps.length - 1) {
                    setStepIdx(prev => prev + 1);
                } else {
                    setIsRunning(false);
                }
            }, 1200 / speed);
        }
        return () => clearTimeout(timer);
    }, [isRunning, stepIdx, speed, steps.length]);

    const handleSelectPreset = (preset) => {
        setSelectedPreset(preset);
        setCode(preset.code);
        setStepIdx(0);
        setIsRunning(false);
        setSelectedOption(null);
        setShowExplanation(false);
    };

    return (
        <div className="space-y-4">
            {/* Simple & Clean Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        Functions &amp; Call Stack
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                        &bull; {selectedPreset.label}
                    </span>
                </div>

                {/* Compact Topic Pills */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
                    {TOPIC_PRESETS.map(preset => (
                        <button
                            key={preset.topicId}
                            onClick={() => handleSelectPreset(preset)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                selectedPreset.topicId === preset.topicId
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                            }`}
                        >
                            {preset.label.split(' ')[0]}
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
                        <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {selectedPreset.label}
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
                            if (stepIdx < steps.length - 1) setStepIdx(prev => prev + 1);
                        }}
                        resetExecution={() => {
                            setStepIdx(0);
                            setIsRunning(false);
                        }}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={currentStep.detail}
                        stepCounterText={`Step ${stepIdx + 1} of ${steps.length}`}
                        terminalLines={currentStep.output}
                        badgeText="C Call Stack Engine"
                        fileName="functions_stack.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Live Call Stack Visualizer (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Layers className="w-3.5 h-3.5 text-blue-600" />
                            Runtime Call Stack Architecture
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Active Frames: {currentStep.stack?.length || 0}
                        </span>
                    </div>

                    {/* 1. Stack Frames Visualizer */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <ChevronsUp className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-bold text-white">LIFO Call Stack Memory</h3>
                            </div>
                            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                                Stack Growth: Top to Bottom
                            </span>
                        </div>

                        {/* Visual LIFO Stack Chamber Shape */}
                        <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <span>Stack Base (High RAM)</span>
                                <span className="text-blue-400 font-bold">&darr; Stack Pointer (SP)</span>
                                <span>Direction: PUSH / POP</span>
                            </div>

                            {/* Stack Silo Shape */}
                            <div className="border-x-2 border-b-2 border-slate-700 bg-slate-900/60 rounded-b-xl p-2.5 space-y-1.5 min-h-[90px] flex flex-col-reverse justify-start">
                                {(!currentStep.stack || currentStep.stack.length === 0) ? (
                                    <div className="text-center text-slate-600 text-xs py-4 font-mono">
                                        Empty Stack Frame Silo
                                    </div>
                                ) : (
                                    currentStep.stack.map((frame, idx) => {
                                        const isTop = idx === currentStep.stack.length - 1;
                                        return (
                                            <div
                                                key={idx}
                                                className={`p-2 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                                                    isTop
                                                        ? 'bg-blue-950 border-blue-400 text-blue-200 shadow-md ring-1 ring-blue-400/50'
                                                        : 'bg-slate-900 border-slate-700 text-slate-400'
                                                }`}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold">{frame.frame}</span>
                                                    {isTop && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">&larr; SP (TOP)</span>}
                                                </div>
                                                <span className="text-[10px] text-slate-400">Ret: {frame.ret}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Visual stack slots */}
                        <div className="space-y-2 font-mono">
                            {(!currentStep.stack || currentStep.stack.length === 0) ? (
                                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                                    Stack is currently empty (Process terminated)
                                </div>
                            ) : (
                                currentStep.stack.map((frame, idx) => {
                                    const isTop = idx === currentStep.stack.length - 1;
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded-xl border transition-all ${
                                                isTop
                                                    ? 'bg-blue-950/70 border-blue-500 shadow-md ring-1 ring-blue-400/40'
                                                    : 'bg-slate-800/40 border-slate-700/50 opacity-75'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <span className={`font-bold ${isTop ? 'text-blue-300' : 'text-slate-300'}`}>
                                                    {frame.frame} {isTop && '(TOP)'}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    Ret: {frame.ret}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-slate-300 mt-1.5 flex items-center gap-1.5">
                                                <span className="text-slate-500">Locals:</span>
                                                <span className="text-emerald-400 font-semibold">{frame.vars}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-400">Action:</span>
                            <span className="text-blue-400 font-bold">{currentStep.detail}</span>
                        </div>
                    </div>

                    {/* 2. Challenge Card */}
                    {selectedPreset.challenge && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                                <HelpCircle className="w-4 h-4 text-blue-600" />
                                <span>Concept Challenge: {selectedPreset.label}</span>
                            </div>

                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                {selectedPreset.challenge.question}
                            </p>

                            <div className="space-y-2">
                                {selectedPreset.challenge.options.map(opt => {
                                    const isChosen = selectedOption === opt;
                                    const isCorrect = opt === selectedPreset.challenge.correct;
                                    let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700';

                                    if (showExplanation) {
                                        if (isCorrect) {
                                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                                        } else if (isChosen) {
                                            btnStyle = 'border-rose-400 bg-rose-50 text-rose-800 line-through';
                                        }
                                    }

                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setSelectedOption(opt);
                                                setShowExplanation(true);
                                            }}
                                            className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnStyle}`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>

                            {showExplanation && (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                                    <div className="font-bold flex items-center gap-1.5 text-slate-800">
                                        {selectedOption === selectedPreset.challenge.correct ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span className="text-emerald-700">Correct!</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4 text-rose-600" />
                                                <span className="text-rose-700">Incorrect</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-slate-600">{selectedPreset.challenge.explanation}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
