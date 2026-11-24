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
    Zap,
    Hash,
    Server,
    FileCode,
    Grid
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /intro.*storage/i,
        label: '11.1 Intro to Storage Classes',
        code: `#include <stdio.h>

int globalVar; // Default: 0 in BSS segment

void testScope() {
    int localVar; // Default: Garbage on Stack
    printf("globalVar default: %d\\n", globalVar);
    // localVar contains indeterminate stack garbage until initialized
}

int main() {
    testScope();
    return 0;
}`,
        steps: [
            { lineNum: 3, action: 'bss', detail: 'int globalVar in BSS', explanation: 'Allocated in BSS data segment with guaranteed default 0.', storageMap: [{ name: 'globalVar', scope: 'File (Global)', lifetime: 'Entire Program', segment: 'BSS Segment', defaultVal: '0' }], output: [] },
            { lineNum: 11, action: 'call', detail: 'testScope() invoked', explanation: 'Pushes stack frame; allocates uninitialized localVar slot.', storageMap: [{ name: 'globalVar', scope: 'File (Global)', lifetime: 'Entire Program', segment: 'BSS Segment', defaultVal: '0' }, { name: 'localVar', scope: 'Block (Local)', lifetime: 'Function Call', segment: 'Stack Frame', defaultVal: 'Garbage' }], output: [] },
            { lineNum: 7, action: 'print', detail: 'printf globalVar', explanation: 'Outputs 0.', storageMap: [{ name: 'globalVar', scope: 'File (Global)', lifetime: 'Entire Program', segment: 'BSS Segment', defaultVal: '0' }], output: ['globalVar default: 0'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Exited cleanly.', storageMap: [], output: ['globalVar default: 0', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What is the default initial value of an uninitialized global variable in C?',
            options: ['0 (Zero)', 'Garbage value', '-1', 'NULL pointer'],
            correct: '0 (Zero)',
            explanation: 'Global and static variables are placed in the BSS/Data segment, zero-initialized by the OS program loader before main() begins.'
        }
    },
    {
        topicId: 2,
        matchPattern: /types of storage|auto.*register|static.*extern/i,
        label: '11.2 Storage Classes (auto, static, register, extern)',
        code: `#include <stdio.h>

void demoStatic() {
    static int hitCount = 0; // Data segment: persists across calls
    auto int temp = 0;       // Stack slot: re-created every call

    hitCount++;
    temp++;
    printf("static hitCount: %d | auto temp: %d\\n", hitCount, temp);
}

int main() {
    demoStatic();
    demoStatic();
    demoStatic();
    return 0;
}`,
        steps: [
            { lineNum: 12, action: 'call-1', detail: 'demoStatic() call 1', explanation: 'static hitCount initialized to 0 in Data Segment. auto temp on Stack.', storageMap: [{ name: 'hitCount', type: 'static', val: '1', loc: 'Data Segment' }, { name: 'temp', type: 'auto', val: '1', loc: 'Stack' }], output: ['static hitCount: 1 | auto temp: 1'] },
            { lineNum: 13, action: 'call-2', detail: 'demoStatic() call 2', explanation: 'hitCount retains 1 and increments to 2! temp re-created at 0 -> 1.', storageMap: [{ name: 'hitCount', type: 'static', val: '2', loc: 'Data Segment' }, { name: 'temp', type: 'auto', val: '1', loc: 'Stack' }], output: ['static hitCount: 1 | auto temp: 1', 'static hitCount: 2 | auto temp: 1'] },
            { lineNum: 14, action: 'call-3', detail: 'demoStatic() call 3', explanation: 'hitCount increments to 3! temp re-created at 0 -> 1.', storageMap: [{ name: 'hitCount', type: 'static', val: '3', loc: 'Data Segment' }, { name: 'temp', type: 'auto', val: '1', loc: 'Stack' }], output: ['static hitCount: 1 | auto temp: 1', 'static hitCount: 2 | auto temp: 1', 'static hitCount: 3 | auto temp: 1'] },
            { lineNum: 15, action: 'return', detail: 'return 0', explanation: 'Program complete.', storageMap: [], output: ['static hitCount: 1 | auto temp: 1', 'static hitCount: 2 | auto temp: 1', 'static hitCount: 3 | auto temp: 1', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'Why does a static local variable retain its value between successive function calls?',
            options: ['It is stored in the Data Segment rather than the temporary Stack frame', 'The compiler duplicates the function', 'It is backed up on hard drive', 'It is marked read-only'],
            correct: 'It is stored in the Data Segment rather than the temporary Stack frame',
            explanation: 'Stack frames are destroyed when a function returns, but the Data Segment persists for the entire program execution lifetime.'
        }
    },
    {
        topicId: 3,
        matchPattern: /intro.*pre-processor|preprocessor/i,
        label: '11.3 Intro to Preprocessor',
        code: `#include <stdio.h>

// Directives beginning with '#' are evaluated before compilation
#define PI 3.14159
#define PLATFORM "x86_64"

int main() {
    printf("Preprocessed Platform: %s\\n", PLATFORM);
    printf("Constant PI: %.2f\\n", PI);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'prep', detail: '#define PI 3.14159 directive', explanation: 'Preprocessor replaces all occurrences of PI with 3.14159 text token.', storageMap: [{ name: 'PI', type: 'Macro Literal', val: '3.14159', loc: 'Text Replacement' }, { name: 'PLATFORM', type: 'Macro String', val: '"x86_64"', loc: 'Text Replacement' }], output: [] },
            { lineNum: 8, action: 'print-plat', detail: 'printf PLATFORM', explanation: 'Compiler receives string literal directly.', storageMap: [{ name: 'PLATFORM', type: 'String', val: '"x86_64"', loc: 'ROData Segment' }], output: ['Preprocessed Platform: x86_64'] },
            { lineNum: 9, action: 'print-pi', detail: 'printf PI', explanation: 'Compiler receives float token 3.14159.', storageMap: [{ name: 'PI', type: 'Float', val: '3.14159', loc: 'Immediate Value' }], output: ['Preprocessed Platform: x86_64', 'Constant PI: 3.14'] },
            { lineNum: 10, action: 'return', detail: 'return 0', explanation: 'Complete.', storageMap: [], output: ['Preprocessed Platform: x86_64', 'Constant PI: 3.14', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'At what phase of the C compilation lifecycle do #define and #include execute?',
            options: ['Preprocessing phase (before compilation)', 'Linking phase', 'Runtime execution phase', 'Assembler phase'],
            correct: 'Preprocessing phase (before compilation)',
            explanation: 'The preprocessor runs first (producing .i file), substituting text macros and expanding header files before the compiler parses syntax.'
        }
    },
    {
        topicId: 4,
        matchPattern: /macro substitution/i,
        label: '11.4 Macro Substitution',
        code: `#include <stdio.h>

#define BAD_SQUARE(x)  x * x
#define GOOD_SQUARE(x) ((x) * (x))

int main() {
    // BAD_SQUARE(2 + 3) expands to: 2 + 3 * 2 + 3 = 2 + 6 + 3 = 11!
    int bad = BAD_SQUARE(2 + 3);

    // GOOD_SQUARE(2 + 3) expands to: ((2 + 3) * (2 + 3)) = 5 * 5 = 25!
    int good = GOOD_SQUARE(2 + 3);

    printf("BAD_SQUARE(2+3)  = %d (Pitfall!)\\n", bad);
    printf("GOOD_SQUARE(2+3) = %d (Safe)\\n", good);
    return 0;
}`,
        steps: [
            { lineNum: 8, action: 'bad-macro', detail: 'BAD_SQUARE(2+3) text expansion', explanation: 'Textual replacement produces 2 + 3 * 2 + 3 = 11 (Operator precedence trap!).', storageMap: [{ name: 'BAD_SQUARE', val: '2 + 3 * 2 + 3 = 11', type: 'Pitfall' }], output: [] },
            { lineNum: 11, action: 'good-macro', detail: 'GOOD_SQUARE(2+3) parenthesized', explanation: 'Parentheses enforce grouping: ((2 + 3) * (2 + 3)) = 25.', storageMap: [{ name: 'GOOD_SQUARE', val: '((2+3) * (2+3)) = 25', type: 'Safe' }], output: [] },
            { lineNum: 13, action: 'print', detail: 'printf bad result', explanation: 'Outputs 11.', storageMap: [{ name: 'BAD_SQUARE', val: '11', type: 'Pitfall' }], output: ['BAD_SQUARE(2+3)  = 11 (Pitfall!)'] },
            { lineNum: 14, action: 'print', detail: 'printf good result', explanation: 'Outputs 25.', storageMap: [{ name: 'GOOD_SQUARE', val: '25', type: 'Safe' }], output: ['BAD_SQUARE(2+3)  = 11 (Pitfall!)', 'GOOD_SQUARE(2+3) = 25 (Safe)'] },
            { lineNum: 15, action: 'return', detail: 'return 0', explanation: 'Complete.', storageMap: [], output: ['BAD_SQUARE(2+3)  = 11 (Pitfall!)', 'GOOD_SQUARE(2+3) = 25 (Safe)', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'Why must macro arguments always be enclosed in parentheses e.g., ((x) * (x))?',
            options: ['To prevent operator precedence side-effects when expressions are passed as arguments', 'Required by C grammar syntax', 'To allocate register variables', 'To enable runtime debugging'],
            correct: 'To prevent operator precedence side-effects when expressions are passed as arguments',
            explanation: 'Because macros perform raw string substitutions, without parentheses an expression like 2+3*2+3 will multiply before adding.'
        }
    },
    {
        topicId: 5,
        matchPattern: /file inclusion|#include/i,
        label: '11.5 Header File Inclusion',
        code: `#include <stdio.h>       // 1. Standard library search path
#include "app_config.h"  // 2. Current workspace project path

// Header Guard Pattern:
// #ifndef APP_CONFIG_H
// #define APP_CONFIG_H
// ... declarations ...
// #endif

int main() {
    printf("Included standard and custom headers successfully!\\n");
    return 0;
}`,
        steps: [
            { lineNum: 1, action: 'include-sys', detail: '#include <stdio.h>', explanation: 'Searches standard system include directories (/usr/include or MSVC include).', storageMap: [{ name: '<stdio.h>', type: 'System Header', loc: 'Compiler System Directory' }], output: [] },
            { lineNum: 2, action: 'include-user', detail: '#include "app_config.h"', explanation: 'Searches local source directory first, then system directories.', storageMap: [{ name: '"app_config.h"', type: 'User Header', loc: 'Current Working Directory' }], output: [] },
            { lineNum: 11, action: 'print', detail: 'printf header status', explanation: 'Outputs confirmation.', storageMap: [], output: ['Included standard and custom headers successfully!'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Process complete.', storageMap: [], output: ['Included standard and custom headers successfully!', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What is the purpose of #ifndef / #define / #endif Header Guards in C header files?',
            options: ['Prevents multiple inclusion and duplicate symbol definition compiler errors', 'Encrypts source code', 'Compresses executable size', 'Increases runtime speed'],
            correct: 'Prevents multiple inclusion and duplicate symbol definition compiler errors',
            explanation: 'Header guards ensure a header file is parsed only once per translation unit, avoiding redefinition errors.'
        }
    }
];

export default function CStoragePreprocessorVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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
                        Storage Classes &amp; Preprocessor
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
                        badgeText="C Preprocessor & Storage Engine"
                        fileName="preprocessor_storage.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Storage Segments & Directives Engine (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Server className="w-3.5 h-3.5 text-blue-600" />
                            Memory Segments & Symbol Table
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Active Symbols: {currentStep.storageMap?.length || 0}
                        </span>
                    </div>

                    {/* 1. Storage Symbols Visualizer */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-bold text-white">Process Memory Segments</h3>
                            </div>
                            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                                Translation Unit Scope
                            </span>
                        </div>

                        {/* Visual Memory Segments Shape Stack */}
                        <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Process Virtual Memory Layout:</div>
                            <div className={`p-1.5 rounded-lg border text-center transition-all ${
                                currentStep.storageMap?.some(s => s.segment?.includes('Stack') || s.type === 'auto')
                                    ? 'bg-blue-950 border-blue-400 text-blue-200 font-bold'
                                    : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}>
                                Stack Segment (Local 'auto' variables &amp; Frames) &darr;
                            </div>
                            <div className="p-1 rounded-lg border border-dashed border-slate-800 bg-slate-950 text-center text-slate-600 text-[10px]">
                                &uarr; Heap Segment (malloc / calloc buffers)
                            </div>
                            <div className={`p-1.5 rounded-lg border text-center transition-all ${
                                currentStep.storageMap?.some(s => s.segment?.includes('BSS'))
                                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                                    : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}>
                                BSS Segment (Uninitialized globals &amp; static = 0)
                            </div>
                            <div className={`p-1.5 rounded-lg border text-center transition-all ${
                                currentStep.storageMap?.some(s => s.loc?.includes('Data') || s.type === 'static')
                                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200 font-bold'
                                    : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}>
                                Data Segment (Initialized static &amp; extern variables)
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-[11px]">
                                Text Segment (Read-only Code &amp; Machine instructions)
                            </div>
                        </div>

                        <div className="space-y-2.5 font-mono">
                            {(!currentStep.storageMap || currentStep.storageMap.length === 0) ? (
                                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                                    No active symbols in current scope
                                </div>
                            ) : (
                                currentStep.storageMap.map((sym, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-1.5 text-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-blue-400 font-bold">{sym.name}</span>
                                            <span className="text-slate-400 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                                {sym.loc || sym.segment}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                                            <span className="text-slate-500">Value / Target:</span>
                                            <span className="text-emerald-400 font-bold">{sym.val || sym.defaultVal}</span>
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
