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
    Database,
    AlertTriangle,
    Check,
    Cpu,
    ExternalLink
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /concept.*dynamic/i,
        label: '10.1 Concept of Dynamic Allocation',
        code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 3;
    // Runtime allocation on Heap segment
    int *heapArr = (int*)malloc(n * sizeof(int));

    if (heapArr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    printf("Allocated %zu bytes on Heap at %p\\n", n * sizeof(int), (void*)heapArr);
    heapArr[0] = 10; heapArr[1] = 20; heapArr[2] = 30;

    printf("Values: %d, %d, %d\\n", heapArr[0], heapArr[1], heapArr[2]);
    free(heapArr);
    return 0;
}`,
        steps: [
            { lineNum: 7, action: 'malloc', detail: 'malloc(3 * sizeof(int))', explanation: 'Heap allocator requests 12 contiguous bytes from OS kernel.', heapBlocks: [{ id: 1, addr: '0x8000', size: '12B', status: 'ALLOCATED', val: '[?, ?, ?]' }], output: [] },
            { lineNum: 9, action: 'check', detail: 'Check if (heapArr == NULL)', explanation: 'Allocation successful; pointer is valid.', heapBlocks: [{ id: 1, addr: '0x8000', size: '12B', status: 'ALLOCATED', val: '[?, ?, ?]' }], output: [] },
            { lineNum: 14, action: 'print', detail: 'printf heap address', explanation: 'Outputs allocated heap address.', heapBlocks: [{ id: 1, addr: '0x8000', size: '12B', status: 'ALLOCATED', val: '[?, ?, ?]' }], output: ['Allocated 12 bytes on Heap at 0x8000'] },
            { lineNum: 15, action: 'populate', detail: 'Populate heap elements', explanation: 'Writes 10, 20, 30 into heap slots.', heapBlocks: [{ id: 1, addr: '0x8000', size: '12B', status: 'POPULATED', val: '[10, 20, 30]' }], output: ['Allocated 12 bytes on Heap at 0x8000'] },
            { lineNum: 17, action: 'print', detail: 'printf values', explanation: 'Reads back values.', heapBlocks: [{ id: 1, addr: '0x8000', size: '12B', status: 'POPULATED', val: '[10, 20, 30]' }], output: ['Allocated 12 bytes on Heap at 0x8000', 'Values: 10, 20, 30'] },
            { lineNum: 18, action: 'free', detail: 'free(heapArr)', explanation: 'Block returned to heap free list.', heapBlocks: [{ id: 1, addr: '0x8000', size: '12B', status: 'FREED', val: '[freed]' }], output: ['Allocated 12 bytes on Heap at 0x8000', 'Values: 10, 20, 30'] },
            { lineNum: 19, action: 'return', detail: 'return 0', explanation: 'Complete.', heapBlocks: [], output: ['Allocated 12 bytes on Heap at 0x8000', 'Values: 10, 20, 30', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What is the primary difference between Stack and Heap memory in C?',
            options: ['Stack is automatically managed with fixed compile-time lifetimes; Heap is explicitly allocated/freed at runtime', 'Stack is 100x slower than Heap', 'Heap memory is cleared automatically when functions return', 'Stack can store gigabytes while Heap is limited to 1MB'],
            correct: 'Stack is automatically managed with fixed compile-time lifetimes; Heap is explicitly allocated/freed at runtime',
            explanation: 'Stack frames are created and destroyed automatically by function calls; Heap buffers persist until explicitly released with free().'
        }
    },
    {
        topicId: 2,
        matchPattern: /malloc.*calloc.*realloc|allocating memory/i,
        label: '10.2 malloc, calloc & realloc',
        code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // calloc zero-initializes memory
    int *zeros = (int*)calloc(2, sizeof(int));
    printf("calloc zeros: %d, %d\\n", zeros[0], zeros[1]);

    // realloc expands buffer from 2 to 4 elements
    int *expanded = (int*)realloc(zeros, 4 * sizeof(int));
    if (expanded) {
        zeros = expanded;
        zeros[2] = 30; zeros[3] = 40;
        printf("realloc expanded: %d, %d, %d, %d\\n", zeros[0], zeros[1], zeros[2], zeros[3]);
    }

    free(zeros);
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'calloc', detail: 'calloc(2, sizeof(int))', explanation: 'Allocates 8 bytes and clears every byte to binary zero.', heapBlocks: [{ id: 1, addr: '0x8100', size: '8B', status: 'ZEROED', val: '[0, 0]' }], output: [] },
            { lineNum: 7, action: 'print', detail: 'printf zeros', explanation: 'Outputs 0, 0.', heapBlocks: [{ id: 1, addr: '0x8100', size: '8B', status: 'ZEROED', val: '[0, 0]' }], output: ['calloc zeros: 0, 0'] },
            { lineNum: 10, action: 'realloc', detail: 'realloc(zeros, 4 * sizeof(int))', explanation: 'Expands contiguous heap buffer to 16 bytes while preserving existing data.', heapBlocks: [{ id: 1, addr: '0x8100', size: '16B', status: 'EXPANDED', val: '[0, 0, ?, ?]' }], output: ['calloc zeros: 0, 0'] },
            { lineNum: 13, action: 'populate', detail: 'Populate indices 2 & 3', explanation: 'zeros[2]=30, zeros[3]=40.', heapBlocks: [{ id: 1, addr: '0x8100', size: '16B', status: 'POPULATED', val: '[0, 0, 30, 40]' }], output: ['calloc zeros: 0, 0'] },
            { lineNum: 14, action: 'print', detail: 'printf 4 elements', explanation: 'Outputs expanded elements.', heapBlocks: [{ id: 1, addr: '0x8100', size: '16B', status: 'POPULATED', val: '[0, 0, 30, 40]' }], output: ['calloc zeros: 0, 0', 'realloc expanded: 0, 0, 30, 40'] },
            { lineNum: 17, action: 'free', detail: 'free(zeros)', explanation: 'Releases 16B.', heapBlocks: [{ id: 1, addr: '0x8100', size: '16B', status: 'FREED', val: '[freed]' }], output: ['calloc zeros: 0, 0', 'realloc expanded: 0, 0, 30, 40'] },
            { lineNum: 18, action: 'return', detail: 'return 0', explanation: 'Complete.', heapBlocks: [], output: ['calloc zeros: 0, 0', 'realloc expanded: 0, 0, 30, 40', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'How does calloc() differ from malloc()?',
            options: ['calloc initializes all allocated bytes to zero; malloc leaves memory containing garbage values', 'calloc allocates on the stack; malloc on the heap', 'calloc is faster than malloc', 'calloc can only allocate characters'],
            correct: 'calloc initializes all allocated bytes to zero; malloc leaves memory containing garbage values',
            explanation: 'malloc() allocates raw uninitialized memory; calloc() explicitly zeros out all requested bytes.'
        }
    },
    {
        topicId: 3,
        matchPattern: /releasing.*space|free/i,
        label: '10.3 Releasing Space & free()',
        code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = (int*)malloc(sizeof(int));
    *ptr = 999;
    printf("ptr points to: %d\\n", *ptr);

    free(ptr);    // Deallocates heap chunk
    ptr = NULL;   // Defensive programming: Neutralize dangling pointer!

    if (ptr == NULL) {
        printf("Safe: ptr neutralized to NULL\\n");
    }
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'malloc', detail: 'malloc(sizeof(int))', explanation: 'Heap block allocated at 0x8200; *ptr = 999.', heapBlocks: [{ id: 1, addr: '0x8200', size: '4B', status: 'ACTIVE', val: '999' }], output: [] },
            { lineNum: 7, action: 'print', detail: 'printf *ptr', explanation: 'Outputs 999.', heapBlocks: [{ id: 1, addr: '0x8200', size: '4B', status: 'ACTIVE', val: '999' }], output: ['ptr points to: 999'] },
            { lineNum: 9, action: 'free', detail: 'free(ptr)', explanation: 'OS reclaims 0x8200. Without ptr = NULL, ptr would be a Dangerous Dangling Pointer!', heapBlocks: [{ id: 1, addr: '0x8200', size: '4B', status: 'FREED (DANGLING)', val: '?' }], output: ['ptr points to: 999'] },
            { lineNum: 10, action: 'nullify', detail: 'ptr = NULL', explanation: 'ptr set to 0x0. Neutralizes Use-After-Free attack vector.', heapBlocks: [{ id: 1, addr: 'NULL', size: '0B', status: 'SAFE (NULL)', val: '0x0' }], output: ['ptr points to: 999'] },
            { lineNum: 13, action: 'print', detail: 'printf safe message', explanation: 'Verified guarded state.', heapBlocks: [{ id: 1, addr: 'NULL', size: '0B', status: 'SAFE (NULL)', val: '0x0' }], output: ['ptr points to: 999', 'Safe: ptr neutralized to NULL'] },
            { lineNum: 15, action: 'return', detail: 'return 0', explanation: 'Complete.', heapBlocks: [], output: ['ptr points to: 999', 'Safe: ptr neutralized to NULL', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What is a "Dangling Pointer" in C?',
            options: ['A pointer that still references a memory location that has already been deallocated by free()', 'A pointer that points to NULL', 'A pointer with syntax error', 'A pointer stored in global memory'],
            correct: 'A pointer that still references a memory location that has already been deallocated by free()',
            explanation: 'After free(ptr), the pointer still holds the old address. Accessing it is a Use-After-Free bug; assigning ptr = NULL prevents accidental reuse.'
        }
    }
];

export default function CDynamicMemoryVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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
                        Dynamic Memory (Heap)
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
                        badgeText="C Dynamic Memory Engine"
                        fileName="dynamic_heap.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Heap Segment & Allocation Visualizer (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Database className="w-3.5 h-3.5 text-blue-600" />
                            OS Heap Segment Visualizer
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Heap Chunks: {currentStep.heapBlocks?.length || 0}
                        </span>
                    </div>

                    {/* 1. Heap Blocks Container */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-bold text-white">Dynamic Heap Chunks</h3>
                            </div>
                            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                                Runtime Memory Manager
                            </span>
                        </div>

                        {/* Visual Heap vs Stack RAM Pool Shape */}
                        <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <span>High RAM: Stack &darr;</span>
                                <span className="text-blue-400 font-bold">&larr; Free RAM Gap &rarr;</span>
                                <span>Low RAM: Heap &uarr;</span>
                            </div>
                            <div className="h-4 w-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex p-0.5 gap-1">
                                <div className="w-1/4 h-full bg-blue-600/70 rounded-xs flex items-center justify-center text-[8px] text-white font-mono font-bold">
                                    Stack
                                </div>
                                <div className="flex-1 h-full bg-slate-800/40 rounded-xs flex items-center justify-center text-[8px] text-slate-500 font-mono">
                                    Available RAM
                                </div>
                                <div className={`w-1/3 h-full rounded-xs flex items-center justify-center text-[8px] font-mono font-bold transition-colors ${
                                    currentStep.action === 'free' ? 'bg-rose-600/70 text-rose-200' : 'bg-emerald-600/70 text-emerald-100'
                                }`}>
                                    Heap Buffer
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5 font-mono">
                            {(!currentStep.heapBlocks || currentStep.heapBlocks.length === 0) ? (
                                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                                    No active heap allocations (Memory clean)
                                </div>
                            ) : (
                                currentStep.heapBlocks.map((chunk, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3.5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-2 text-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-400 font-bold">Chunk #{chunk.id}</span>
                                                <span className="text-slate-400 text-[10px]">({chunk.addr})</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                chunk.status.includes('FREED')
                                                    ? 'bg-rose-950 text-rose-400 border border-rose-800/50'
                                                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                                            }`}>
                                                {chunk.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] pt-1">
                                            <span className="text-slate-400">Payload: <strong className="text-slate-200">{chunk.val}</strong></span>
                                            <span className="text-slate-500">Size: {chunk.size}</span>
                                        </div>
                                    </div>
                                ))
                            )}
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
