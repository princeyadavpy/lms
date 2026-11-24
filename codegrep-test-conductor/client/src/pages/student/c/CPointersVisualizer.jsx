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
    MousePointer,
    MoveRight,
    Binary,
    Cpu,
    ExternalLink
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /need.*pointer/i,
        label: '7.1 Need of Pointers',
        code: `#include <stdio.h>

int main() {
    int target = 42;
    int *ptr = &target; // ptr stores address of target

    printf("target value: %d\\n", target);
    printf("target address: %p\\n", (void*)&target);
    printf("ptr stores: %p\\n", (void*)ptr);

    *ptr = 99; // Direct memory mutation!
    printf("After *ptr = 99: target = %d\\n", target);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'init', detail: 'int target = 42 at 0x2000', explanation: 'Allocates integer slot at memory address 0x2000.', memory: [{ name: 'target', addr: '0x2000', val: '42' }], ptrTarget: '0x2000', output: [] },
            { lineNum: 5, action: 'address-of', detail: 'int *ptr = &target', explanation: 'ptr holds memory address 0x2000.', memory: [{ name: 'target', addr: '0x2000', val: '42' }, { name: 'ptr', addr: '0x2008', val: '0x2000' }], ptrTarget: '0x2000', output: [] },
            { lineNum: 7, action: 'print', detail: 'printf target', explanation: 'Direct access: 42.', memory: [{ name: 'target', addr: '0x2000', val: '42' }, { name: 'ptr', addr: '0x2008', val: '0x2000' }], ptrTarget: '0x2000', output: ['target value: 42'] },
            { lineNum: 8, action: 'print', detail: 'printf address &target', explanation: 'Prints address 0x2000.', memory: [{ name: 'target', addr: '0x2000', val: '42' }, { name: 'ptr', addr: '0x2008', val: '0x2000' }], ptrTarget: '0x2000', output: ['target value: 42', 'target address: 0x2000'] },
            { lineNum: 9, action: 'print', detail: 'printf ptr', explanation: 'ptr holds 0x2000.', memory: [{ name: 'target', addr: '0x2000', val: '42' }, { name: 'ptr', addr: '0x2008', val: '0x2000' }], ptrTarget: '0x2000', output: ['target value: 42', 'target address: 0x2000', 'ptr stores: 0x2000'] },
            { lineNum: 11, action: 'deref-write', detail: '*ptr = 99 (Dereference write)', explanation: 'Dereferences 0x2000 and writes 99 directly into target memory cell.', memory: [{ name: 'target', addr: '0x2000', val: '99' }, { name: 'ptr', addr: '0x2008', val: '0x2000' }], ptrTarget: '0x2000', output: ['target value: 42', 'target address: 0x2000', 'ptr stores: 0x2000'] },
            { lineNum: 12, action: 'print', detail: 'printf updated target', explanation: 'Outputs 99.', memory: [{ name: 'target', addr: '0x2000', val: '99' }, { name: 'ptr', addr: '0x2008', val: '0x2000' }], ptrTarget: '0x2000', output: ['target value: 42', 'target address: 0x2000', 'ptr stores: 0x2000', 'After *ptr = 99: target = 99'] },
            { lineNum: 13, action: 'return', detail: 'return 0', explanation: 'Program complete.', memory: [{ name: 'target', addr: '0x2000', val: '99' }, { name: 'ptr', addr: '0x2008', val: '0x2000' }], ptrTarget: '0x2000', output: ['target value: 42', 'target address: 0x2000', 'ptr stores: 0x2000', 'After *ptr = 99: target = 99', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What is the role of the dereference operator (*) when used as an l-value (*ptr = val)?',
            options: ['Writes val directly into the memory location pointed to by ptr', 'Multiplies ptr by val', 'Deallocates the pointer', 'Prints the address'],
            correct: 'Writes val directly into the memory location pointed to by ptr',
            explanation: 'Dereferencing (*ptr) follows the address stored in ptr to access or modify the actual target storage slot.'
        }
    },
    {
        topicId: 2,
        matchPattern: /types of pointer|void.*pointer|null/i,
        label: '7.2 Types of Pointers',
        code: `#include <stdio.h>

int main() {
    int *null_ptr = NULL; // NULL Pointer (0x0)
    int num = 50;
    void *generic_ptr = &num; // Generic void* Pointer

    if (null_ptr == NULL) {
        printf("Safe: null_ptr is guarded (0x0)\\n");
    }

    // Must type-cast void* before dereferencing
    printf("Value via cast: %d\\n", *(int*)generic_ptr);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'init-null', detail: 'int *null_ptr = NULL', explanation: 'Points to address 0x0; dereferencing this causes a SegFault if unhandled.', memory: [{ name: 'null_ptr', addr: '0x1000', val: '0x0000 (NULL)' }], ptrTarget: 'NULL', output: [] },
            { lineNum: 6, action: 'init-void', detail: 'void *generic_ptr = &num', explanation: 'Generic pointer can hold address of any data type without type safety warnings.', memory: [{ name: 'num', addr: '0x2000', val: '50' }, { name: 'generic_ptr', addr: '0x1008', val: '0x2000' }], ptrTarget: '0x2000', output: [] },
            { lineNum: 8, action: 'check', detail: 'Check if (null_ptr == NULL)', explanation: 'Condition evaluates to true.', memory: [{ name: 'null_ptr', addr: '0x1000', val: '0x0000 (NULL)' }], ptrTarget: 'NULL', output: [] },
            { lineNum: 9, action: 'print', detail: 'printf safe message', explanation: 'Guards against null pointer dereference.', memory: [{ name: 'null_ptr', addr: '0x1000', val: '0x0000 (NULL)' }], ptrTarget: 'NULL', output: ['Safe: null_ptr is guarded (0x0)'] },
            { lineNum: 13, action: 'cast-deref', detail: '*(int*)generic_ptr cast', explanation: 'Cast to int* tells CPU to read 4 bytes starting at 0x2000.', memory: [{ name: 'num', addr: '0x2000', val: '50' }], ptrTarget: '0x2000', output: ['Safe: null_ptr is guarded (0x0)', 'Value via cast: 50'] },
            { lineNum: 14, action: 'return', detail: 'return 0', explanation: 'Exited cleanly.', memory: [], ptrTarget: null, output: ['Safe: null_ptr is guarded (0x0)', 'Value via cast: 50', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'Why can you NOT dereference a void* pointer directly (*void_ptr) without typecasting?',
            options: ['The compiler does not know the data type size in bytes to read from memory', 'void pointers are always NULL', 'void pointers only point to strings', 'It causes an immediate kernel freeze'],
            correct: 'The compiler does not know the data type size in bytes to read from memory',
            explanation: 'void has no byte size; the compiler needs an explicit cast (e.g. (int*)) to know how many bytes (1, 2, 4, 8) to read/write.'
        }
    },
    {
        topicId: 3,
        matchPattern: /arithmetic|expression/i,
        label: '7.3 Pointer Arithmetic & Scaling',
        code: `#include <stdio.h>

int main() {
    int arr[3] = {100, 200, 300};
    int *p = arr; // p = 0x2000

    printf("*p = %d at %p\\n", *p, (void*)p);
    p++; // Scaled by sizeof(int) = +4 bytes! (0x2004)
    printf("After p++: *p = %d at %p\\n", *p, (void*)p);
    p++; // Scaled again: +4 bytes (0x2008)
    printf("After 2nd p++: *p = %d at %p\\n", *p, (void*)p);
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'init', detail: 'int *p = arr (0x2000)', explanation: 'p points to arr[0] at address 0x2000.', memory: [{ name: 'arr[0]', addr: '0x2000', val: '100' }, { name: 'arr[1]', addr: '0x2004', val: '200' }, { name: 'arr[2]', addr: '0x2008', val: '300' }], ptrTarget: '0x2000', output: [] },
            { lineNum: 7, action: 'print', detail: '*p = 100 at 0x2000', explanation: 'Reads 4 bytes at 0x2000.', memory: [{ name: 'arr[0]', addr: '0x2000', val: '100' }], ptrTarget: '0x2000', output: ['*p = 100 at 0x2000'] },
            { lineNum: 8, action: 'increment', detail: 'p++: pointer increment', explanation: 'Address increases by 1 * sizeof(int) = +4 bytes: 0x2000 -> 0x2004.', memory: [{ name: 'arr[1]', addr: '0x2004', val: '200' }], ptrTarget: '0x2004', output: ['*p = 100 at 0x2000'] },
            { lineNum: 9, action: 'print', detail: '*p = 200 at 0x2004', explanation: 'Reads 4 bytes at 0x2004.', memory: [{ name: 'arr[1]', addr: '0x2004', val: '200' }], ptrTarget: '0x2004', output: ['*p = 100 at 0x2000', 'After p++: *p = 200 at 0x2004'] },
            { lineNum: 10, action: 'increment', detail: '2nd p++ increment', explanation: '0x2004 -> 0x2008.', memory: [{ name: 'arr[2]', addr: '0x2008', val: '300' }], ptrTarget: '0x2008', output: ['*p = 100 at 0x2000', 'After p++: *p = 200 at 0x2004'] },
            { lineNum: 11, action: 'print', detail: '*p = 300 at 0x2008', explanation: 'Reads 4 bytes at 0x2008.', memory: [{ name: 'arr[2]', addr: '0x2008', val: '300' }], ptrTarget: '0x2008', output: ['*p = 100 at 0x2000', 'After p++: *p = 200 at 0x2004', 'After 2nd p++: *p = 300 at 0x2008'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Complete.', memory: [], ptrTarget: null, output: ['*p = 100 at 0x2000', 'After p++: *p = 200 at 0x2004', 'After 2nd p++: *p = 300 at 0x2008', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'If double *ptr = 0x4000 (sizeof(double) = 8), what is the value of ptr + 2?',
            options: ['0x4002', '0x4008', '0x4010', '0x4016'],
            correct: '0x4010',
            explanation: 'ptr + 2 advances by 2 * 8 = 16 bytes (0x10 in hex). 0x4000 + 0x10 = 0x4010.'
        }
    },
    {
        topicId: 4,
        matchPattern: /array of pointer/i,
        label: '7.4 Arrays of Pointers',
        code: `#include <stdio.h>

int main() {
    int a = 10, b = 20, c = 30;
    int *ptrArr[3] = {&a, &b, &c}; // Array holding 3 addresses

    for (int i = 0; i < 3; i++) {
        printf("ptrArr[%d] -> points to %d at %p\\n", i, *ptrArr[i], (void*)ptrArr[i]);
    }
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'init', detail: 'int *ptrArr[3] = {&a, &b, &c}', explanation: 'Array contains 3 pointer addresses: 0x1000, 0x1004, 0x1008.', memory: [{ name: 'ptrArr[0]', addr: '0x3000', val: '&a (0x1000)' }, { name: 'ptrArr[1]', addr: '0x3008', val: '&b (0x1004)' }, { name: 'ptrArr[2]', addr: '0x3010', val: '&c (0x1008)' }], ptrTarget: '0x1000', output: [] },
            { lineNum: 8, action: 'print', detail: '*ptrArr[0] = 10', explanation: 'Dereferences first pointer in array.', memory: [{ name: 'a', addr: '0x1000', val: '10' }], ptrTarget: '0x1000', output: ['ptrArr[0] -> points to 10 at 0x1000'] },
            { lineNum: 8, action: 'print', detail: '*ptrArr[1] = 20', explanation: 'Dereferences second pointer in array.', memory: [{ name: 'b', addr: '0x1004', val: '20' }], ptrTarget: '0x1004', output: ['ptrArr[0] -> points to 10 at 0x1000', 'ptrArr[1] -> points to 20 at 0x1004'] },
            { lineNum: 8, action: 'print', detail: '*ptrArr[2] = 30', explanation: 'Dereferences third pointer in array.', memory: [{ name: 'c', addr: '0x1008', val: '30' }], ptrTarget: '0x1008', output: ['ptrArr[0] -> points to 10 at 0x1000', 'ptrArr[1] -> points to 20 at 0x1004', 'ptrArr[2] -> points to 30 at 0x1008'] },
            { lineNum: 10, action: 'return', detail: 'return 0', explanation: 'Program exit.', memory: [], ptrTarget: null, output: ['ptrArr[0] -> points to 10 at 0x1000', 'ptrArr[1] -> points to 20 at 0x1004', 'ptrArr[2] -> points to 30 at 0x1008', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What does char *argv[] in int main(int argc, char *argv[]) represent?',
            options: ['An array of character pointers (array of strings)', 'A single 2D character array', 'A pointer to a function', 'An array of integer codes'],
            correct: 'An array of character pointers (array of strings)',
            explanation: 'argv is an array of pointers to character strings, where each element points to one command-line argument.'
        }
    },
    {
        topicId: 5,
        matchPattern: /pointer.*function|function pointer/i,
        label: '7.5 Pointers and Functions',
        code: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

int main() {
    // Function Pointer pointing to code segment address
    int (*calc)(int, int) = add;
    printf("Add via pointer: %d\\n", calc(5, 3));

    calc = multiply; // Rebind to multiply function
    printf("Multiply via pointer: %d\\n", calc(5, 3));
    return 0;
}`,
        steps: [
            { lineNum: 8, action: 'bind-add', detail: 'calc = add', explanation: 'calc points to code entry point of add() in text segment (0x00401120).', memory: [{ name: 'calc', addr: '0x2000', val: 'add (0x00401120)' }], ptrTarget: '0x00401120', output: [] },
            { lineNum: 9, action: 'exec-add', detail: 'calc(5, 3) -> 8', explanation: 'Indirect jump to add() code; returns 8.', memory: [{ name: 'calc', addr: '0x2000', val: 'add' }], ptrTarget: '0x00401120', output: ['Add via pointer: 8'] },
            { lineNum: 11, action: 'rebind-mul', detail: 'calc = multiply', explanation: 'calc points to multiply() code entry point (0x00401160).', memory: [{ name: 'calc', addr: '0x2000', val: 'multiply (0x00401160)' }], ptrTarget: '0x00401160', output: ['Add via pointer: 8'] },
            { lineNum: 12, action: 'exec-mul', detail: 'calc(5, 3) -> 15', explanation: 'Indirect jump to multiply() code; returns 15.', memory: [{ name: 'calc', addr: '0x2000', val: 'multiply' }], ptrTarget: '0x00401160', output: ['Add via pointer: 8', 'Multiply via pointer: 15'] },
            { lineNum: 13, action: 'return', detail: 'return 0', explanation: 'Complete.', memory: [], ptrTarget: null, output: ['Add via pointer: 8', 'Multiply via pointer: 15', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What is the primary architectural purpose of function pointers in C systems programming?',
            options: ['Implementing callbacks, event-driven handlers, and virtual function dispatch tables', 'Speeding up CPU multiplication', 'Allocating memory on the GPU', 'Preventing buffer overflows'],
            correct: 'Implementing callbacks, event-driven handlers, and virtual function dispatch tables',
            explanation: 'Function pointers allow code routines to be passed as arguments, enabling callbacks (like qsort) and plug-in architectures.'
        }
    }
];

export default function CPointersVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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
                        Pointers &amp; Memory Addressing
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
                        badgeText="C Memory Pointer Engine"
                        fileName="pointers_runtime.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Memory Addressing & Dereference Engine (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Binary className="w-3.5 h-3.5 text-blue-600" />
                            Direct Memory Hardware Visualizer
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Target: {currentStep.ptrTarget || 'Direct'}
                        </span>
                    </div>

                    {/* 1. Memory Slots and Pointer Trajectory */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <MousePointer className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-bold text-white">RAM Address Bus & Laser Pointer Bridge</h3>
                            </div>
                            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                                64-bit Address Width
                            </span>
                        </div>

                        {/* Visual Pointer Laser Bridge Diagram */}
                        <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800">
                            <svg viewBox="0 0 340 130" className="w-full h-auto">
                                <defs>
                                    <marker id="ptr-laser" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L6,3 z" fill="#38bdf8" />
                                    </marker>
                                </defs>

                                {/* Left Cell: Pointer Variable */}
                                <rect x="15" y="35" width="115" height="60" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                                <text x="72" y="55" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold" fontFamily="monospace">ptr (Pointer)</text>
                                <text x="72" y="70" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">addr: 0x2008</text>
                                <text x="72" y="86" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                    {currentStep.ptrTarget === 'NULL' ? '0x0000 (NULL)' : '0x2000'}
                                </text>

                                {/* Dynamic Connecting Arrow */}
                                {currentStep.ptrTarget === 'NULL' ? (
                                    <g>
                                        <line x1="130" y1="65" x2="190" y2="65" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 3" />
                                        <circle cx="190" cy="65" r="5" fill="#f43f5e" />
                                        <text x="235" y="70" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">Blocked (0x0)</text>
                                    </g>
                                ) : (
                                    <g>
                                        <path
                                            d="M 130 65 C 160 30, 180 30, 205 60"
                                            fill="none"
                                            stroke="#38bdf8"
                                            strokeWidth="3"
                                            strokeDasharray="4 2"
                                            markerEnd="url(#ptr-laser)"
                                            className="animate-pulse"
                                        />
                                        <text x="170" y="32" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                                            *ptr deref
                                        </text>

                                        {/* Right Cell: Target Memory Cell */}
                                        <rect x="210" y="35" width="115" height="60" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                        <text x="267" y="55" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold" fontFamily="monospace">target (Direct)</text>
                                        <text x="267" y="70" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="monospace">addr: 0x2000</text>
                                        <text x="267" y="86" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="monospace">
                                            {currentStep.memory?.find(m => m.name === 'target')?.val || '42'}
                                        </text>

                                        {/* Pulsing Crosshair Reticle over target */}
                                        <circle cx="267" cy="80" r="18" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
                                    </g>
                                )}
                            </svg>
                        </div>

                        <div className="space-y-2 font-mono">
                            {currentStep.memory.map((slot, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-400 font-bold">{slot.name}</span>
                                        <span className="text-slate-500 text-[10px]">({slot.addr})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                            {slot.val}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-400">Current Action:</span>
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
