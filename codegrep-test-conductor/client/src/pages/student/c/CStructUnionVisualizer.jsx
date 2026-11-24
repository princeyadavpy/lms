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
    Boxes,
    Split,
    ShieldAlert,
    Cpu,
    Grid
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /need.*structure/i,
        label: '8.1 Need of Structure',
        code: `#include <stdio.h>

// Struct groups heterogeneous data attributes under one entity
struct Student {
    int rollNo;
    char grade;
    float gpa;
};

int main() {
    struct Student s1 = {101, 'A', 3.85f};

    printf("Roll No: %d\\n", s1.rollNo);
    printf("Grade: %c\\n", s1.grade);
    printf("GPA: %.2f\\n", s1.gpa);
    printf("Total struct size: %zu bytes\\n", sizeof(s1));
    return 0;
}`,
        steps: [
            { lineNum: 11, action: 'init', detail: "struct Student s1 = {101, 'A', 3.85f}", explanation: 'Allocates structured record on stack containing int, char, and float.', members: [{ name: 's1.rollNo', val: '101', bytes: '4B', type: 'int' }, { name: 's1.grade', val: "'A'", bytes: '1B (+3B pad)', type: 'char' }, { name: 's1.gpa', val: '3.85', bytes: '4B', type: 'float' }], output: [] },
            { lineNum: 13, action: 'print', detail: 'printf s1.rollNo', explanation: 'Outputs 101.', members: [{ name: 's1.rollNo', val: '101', bytes: '4B', type: 'int' }], output: ['Roll No: 101'] },
            { lineNum: 14, action: 'print', detail: 'printf s1.grade', explanation: "Outputs 'A'.", members: [{ name: 's1.grade', val: "'A'", bytes: '1B (+3B pad)', type: 'char' }], output: ['Roll No: 101', 'Grade: A'] },
            { lineNum: 15, action: 'print', detail: 'printf s1.gpa', explanation: 'Outputs 3.85.', members: [{ name: 's1.gpa', val: '3.85', bytes: '4B', type: 'float' }], output: ['Roll No: 101', 'Grade: A', 'GPA: 3.85'] },
            { lineNum: 16, action: 'sizeof', detail: 'sizeof(s1) calculation', explanation: '12 bytes total due to 4-byte boundary alignment.', members: [{ name: 'Total Size', val: '12 bytes', bytes: '12B', type: 'struct' }], output: ['Roll No: 101', 'Grade: A', 'GPA: 3.85', 'Total struct size: 12 bytes'] },
            { lineNum: 17, action: 'return', detail: 'return 0', explanation: 'Exits cleanly.', members: [], output: ['Roll No: 101', 'Grade: A', 'GPA: 3.85', 'Total struct size: 12 bytes', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'Why do we need structures instead of basic arrays in C?',
            options: ['Arrays only store homogeneous data; structures can group different data types together', 'Structures execute 2x faster than arrays', 'Arrays cannot be passed to functions', 'Structures live on the GPU'],
            correct: 'Arrays only store homogeneous data; structures can group different data types together',
            explanation: 'An array requires all elements to be the exact same type; a struct allows grouping mixed types (ints, chars, floats, pointers).'
        }
    },
    {
        topicId: 2,
        matchPattern: /structure variable/i,
        label: '8.2 Structure Variables',
        code: `#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main() {
    struct Point p1 = {10, 25};
    struct Point *ptr = &p1; // Pointer to struct

    printf("Dot operator: p1.x = %d\\n", p1.x);
    // Arrow operator (->) is syntactic sugar for (*ptr).member
    printf("Arrow operator: ptr->y = %d\\n", ptr->y);

    ptr->x = 50; // Mutate via pointer
    printf("Updated p1.x = %d\\n", p1.x);
    return 0;
}`,
        steps: [
            { lineNum: 9, action: 'init', detail: 'struct Point p1 = {10, 25}', explanation: 'Stack frame allocates 8 bytes (4B for x, 4B for y).', members: [{ name: 'p1.x', val: '10', bytes: '4B', type: 'int' }, { name: 'p1.y', val: '25', bytes: '4B', type: 'int' }], output: [] },
            { lineNum: 10, action: 'ptr-init', detail: 'struct Point *ptr = &p1', explanation: 'ptr holds address of p1.', members: [{ name: 'ptr', val: '&p1 (0x2000)', bytes: '8B', type: 'pointer' }], output: [] },
            { lineNum: 12, action: 'print', detail: 'p1.x via dot operator', explanation: 'Outputs 10.', members: [{ name: 'p1.x', val: '10', bytes: '4B', type: 'int' }], output: ['Dot operator: p1.x = 10'] },
            { lineNum: 14, action: 'print', detail: 'ptr->y via arrow operator', explanation: 'Dereferences ptr and accesses y = 25.', members: [{ name: 'ptr->y', val: '25', bytes: '4B', type: 'int' }], output: ['Dot operator: p1.x = 10', 'Arrow operator: ptr->y = 25'] },
            { lineNum: 16, action: 'write', detail: 'ptr->x = 50', explanation: 'Directly mutates p1.x memory slot.', members: [{ name: 'p1.x', val: '50', bytes: '4B', type: 'int' }], output: ['Dot operator: p1.x = 10', 'Arrow operator: ptr->y = 25'] },
            { lineNum: 17, action: 'print', detail: 'printf updated p1.x', explanation: 'Outputs 50.', members: [{ name: 'p1.x', val: '50', bytes: '4B', type: 'int' }], output: ['Dot operator: p1.x = 10', 'Arrow operator: ptr->y = 25', 'Updated p1.x = 50'] },
            { lineNum: 18, action: 'return', detail: 'return 0', explanation: 'Complete.', members: [], output: ['Dot operator: p1.x = 10', 'Arrow operator: ptr->y = 25', 'Updated p1.x = 50', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What is ptr->member equivalent to in C syntax?',
            options: ['(*ptr).member', '*ptr.member', '&ptr.member', 'ptr.member'],
            correct: '(*ptr).member',
            explanation: 'The arrow operator ptr->member dereferences the pointer first (*ptr) and accesses the member.'
        }
    },
    {
        topicId: 3,
        matchPattern: /array of structure/i,
        label: '8.3 Array of Structure',
        code: `#include <stdio.h>

struct Item {
    int id;
    int price;
};

int main() {
    struct Item inventory[3] = {
        {101, 150},
        {102, 300},
        {103, 450}
    };

    for (int i = 0; i < 3; i++) {
        printf("Item %d: ID=%d, Price=$%d\\n", i, inventory[i].id, inventory[i].price);
    }
    return 0;
}`,
        steps: [
            { lineNum: 9, action: 'init-arr', detail: 'inventory[3] allocated contiguously', explanation: 'Allocates 3 * 8 = 24 contiguous bytes in RAM.', members: [{ name: 'inv[0]', val: 'ID:101, $150', bytes: '8B', type: 'struct Item' }, { name: 'inv[1]', val: 'ID:102, $300', bytes: '8B', type: 'struct Item' }, { name: 'inv[2]', val: 'ID:103, $450', bytes: '8B', type: 'struct Item' }], output: [] },
            { lineNum: 16, action: 'print', detail: 'Print Item 0', explanation: 'Accesses inventory[0].', members: [{ name: 'inv[0]', val: 'ID:101, $150', bytes: '8B', type: 'struct Item' }], output: ['Item 0: ID=101, Price=$150'] },
            { lineNum: 16, action: 'print', detail: 'Print Item 1', explanation: 'Offset: +8 bytes from base.', members: [{ name: 'inv[1]', val: 'ID:102, $300', bytes: '8B', type: 'struct Item' }], output: ['Item 0: ID=101, Price=$150', 'Item 1: ID=102, Price=$300'] },
            { lineNum: 16, action: 'print', detail: 'Print Item 2', explanation: 'Offset: +16 bytes from base.', members: [{ name: 'inv[2]', val: 'ID:103, $450', bytes: '8B', type: 'struct Item' }], output: ['Item 0: ID=101, Price=$150', 'Item 1: ID=102, Price=$300', 'Item 2: ID=103, Price=$450'] },
            { lineNum: 18, action: 'return', detail: 'return 0', explanation: 'Complete.', members: [], output: ['Item 0: ID=101, Price=$150', 'Item 1: ID=102, Price=$300', 'Item 2: ID=103, Price=$450', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'If sizeof(struct Item) is 8 bytes and &inventory[0] is 0x3000, what is &inventory[2]?',
            options: ['0x3010', '0x3008', '0x3002', '0x3016'],
            correct: '0x3010',
            explanation: 'Address = Base + (2 * 8) = 0x3000 + 16 (0x10 hex) = 0x3010.'
        }
    },
    {
        topicId: 4,
        matchPattern: /structure within|nested/i,
        label: '8.4 Structure within Structure',
        code: `#include <stdio.h>

struct Date { int day; int month; int year; };

struct Employee {
    int id;
    struct Date joinDate; // Nested struct!
};

int main() {
    struct Employee emp = {5001, {15, 8, 2024}};

    printf("Employee ID: %d\\n", emp.id);
    printf("Joined: %02d/%02d/%d\\n", emp.joinDate.day, emp.joinDate.month, emp.joinDate.year);
    return 0;
}`,
        steps: [
            { lineNum: 11, action: 'init', detail: 'struct Employee emp initialized', explanation: 'Outer struct contains inner struct Date (3 integers = 12B). Total 16B.', members: [{ name: 'emp.id', val: '5001', bytes: '4B', type: 'int' }, { name: 'emp.joinDate.day', val: '15', bytes: '4B', type: 'int' }, { name: 'emp.joinDate.month', val: '8', bytes: '4B', type: 'int' }, { name: 'emp.joinDate.year', val: '2024', bytes: '4B', type: 'int' }], output: [] },
            { lineNum: 13, action: 'print', detail: 'printf emp.id', explanation: 'Outputs 5001.', members: [{ name: 'emp.id', val: '5001', bytes: '4B', type: 'int' }], output: ['Employee ID: 5001'] },
            { lineNum: 14, action: 'print', detail: 'printf nested members', explanation: 'Accesses emp.joinDate.day, month, year.', members: [{ name: 'emp.joinDate', val: '15/08/2024', bytes: '12B', type: 'struct Date' }], output: ['Employee ID: 5001', 'Joined: 15/08/2024'] },
            { lineNum: 15, action: 'return', detail: 'return 0', explanation: 'Process complete.', members: [], output: ['Employee ID: 5001', 'Joined: 15/08/2024', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'How do you access the member of a nested structure variable in C?',
            options: ['Using chained dot operators: outer.inner.member', 'Using double colons: outer::inner::member', 'Using outer->inner.member always', 'Nested structs cannot be accessed directly'],
            correct: 'Using chained dot operators: outer.inner.member',
            explanation: 'You chain the dot operator for each level of nested structure: emp.joinDate.day.'
        }
    },
    {
        topicId: 5,
        matchPattern: /union/i,
        label: '8.5 Union',
        code: `#include <stdio.h>

union DataUnion {
    int i;
    float f;
    char str[8]; // Largest member (8 bytes) defines total size
};

int main() {
    union DataUnion u;
    printf("sizeof(union DataUnion): %zu bytes\\n", sizeof(u));

    u.i = 42;
    printf("u.i = %d\\n", u.i);

    u.f = 3.14f; // Overwrites the same shared 4 bytes!
    printf("u.f = %.2f\\n", u.f);
    printf("u.i is now corrupted: %d\\n", u.i);
    return 0;
}`,
        steps: [
            { lineNum: 11, action: 'sizeof', detail: 'sizeof(union DataUnion) is 8 bytes', explanation: 'Unions allocate only enough memory for their single largest member.', members: [{ name: 'Shared Memory Block', val: '8 Bytes Total', bytes: '8B', type: 'union' }], output: ['sizeof(union DataUnion): 8 bytes'] },
            { lineNum: 13, action: 'write-int', detail: 'u.i = 42', explanation: 'Integer 42 stored in first 4 bytes of shared memory block.', members: [{ name: 'u.i', val: '42', bytes: '4B', type: 'int' }], output: ['sizeof(union DataUnion): 8 bytes'] },
            { lineNum: 14, action: 'print', detail: 'printf u.i', explanation: 'Outputs 42.', members: [{ name: 'u.i', val: '42', bytes: '4B', type: 'int' }], output: ['sizeof(union DataUnion): 8 bytes', 'u.i = 42'] },
            { lineNum: 16, action: 'write-float', detail: 'u.f = 3.14f (Overwrites u.i!)', explanation: 'Floating point IEEE-754 bit pattern overwrites the exact same 4 bytes.', members: [{ name: 'u.f', val: '3.14', bytes: '4B', type: 'float' }], output: ['sizeof(union DataUnion): 8 bytes', 'u.i = 42'] },
            { lineNum: 17, action: 'print', detail: 'printf u.f', explanation: 'Outputs 3.14.', members: [{ name: 'u.f', val: '3.14', bytes: '4B', type: 'float' }], output: ['sizeof(union DataUnion): 8 bytes', 'u.i = 42', 'u.f = 3.14'] },
            { lineNum: 18, action: 'print', detail: 'printf corrupted u.i', explanation: 'Reads float bits as int (produces garbage integer).', members: [{ name: 'u.i (corrupted)', val: '1078523331', bytes: '4B', type: 'int' }], output: ['sizeof(union DataUnion): 8 bytes', 'u.i = 42', 'u.f = 3.14', 'u.i is now corrupted: 1078523331'] },
            { lineNum: 19, action: 'return', detail: 'return 0', explanation: 'Complete.', members: [], output: ['sizeof(union DataUnion): 8 bytes', 'u.i = 42', 'u.f = 3.14', 'u.i is now corrupted: 1078523331', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'How much memory does a union allocate in RAM?',
            options: ['Exactly the size of its largest member', 'The sum of all its members', '8 bytes always', 'Zero bytes until allocated'],
            correct: 'Exactly the size of its largest member',
            explanation: 'All union members share the exact same starting memory address; thus the union size is determined solely by its largest member.'
        }
    },
    {
        topicId: 6,
        matchPattern: /diff.*struct.*union/i,
        label: '8.6 Struct vs Union Difference',
        code: `#include <stdio.h>

struct S {
    int a;    // 4 bytes
    double b; // 8 bytes (struct total = 16B due to alignment)
};

union U {
    int a;    // 4 bytes
    double b; // 8 bytes (union total = 8B shared)
};

int main() {
    printf("sizeof(struct S): %zu bytes\\n", sizeof(struct S));
    printf("sizeof(union U):  %zu bytes\\n", sizeof(union U));
    return 0;
}`,
        steps: [
            { lineNum: 14, action: 'struct-size', detail: 'sizeof(struct S)', explanation: 'Struct allocates independent memory for every member (4B + 4B pad + 8B = 16B).', members: [{ name: 'struct.a', val: '4B slot', bytes: '4B', type: 'int' }, { name: 'struct.b', val: '8B slot', bytes: '8B', type: 'double' }], output: ['sizeof(struct S): 16 bytes'] },
            { lineNum: 15, action: 'union-size', detail: 'sizeof(union U)', explanation: 'Union shares single 8B slot for both members.', members: [{ name: 'union shared', val: '8B max', bytes: '8B', type: 'shared' }], output: ['sizeof(struct S): 16 bytes', 'sizeof(union U):  8 bytes'] },
            { lineNum: 16, action: 'return', detail: 'return 0', explanation: 'Complete.', members: [], output: ['sizeof(struct S): 16 bytes', 'sizeof(union U):  8 bytes', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'When should a systems programmer choose a union over a struct?',
            options: ['When only one of several alternative values needs to be held at any given time, saving RAM', 'When all values must be accessed concurrently', 'When writing recursive algorithms', 'When allocating memory on disk'],
            correct: 'When only one of several alternative values needs to be held at any given time, saving RAM',
            explanation: 'Unions are ideal for variant types, network packet decoders, and low-level hardware registers where memory states are mutually exclusive.'
        }
    }
];

export default function CStructUnionVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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
                        Structures &amp; Unions
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
                        badgeText="C Struct/Union Engine"
                        fileName="struct_union_memory.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Memory Alignment & Overlap Engine (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Split className="w-3.5 h-3.5 text-blue-600" />
                            Memory Offset & Padding Layout
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Alignment Engine
                        </span>
                    </div>

                    {/* 1. Member Memory Slots */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Boxes className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-bold text-white">
                                    {selectedPreset.topicId >= 5 ? 'Union Shared Overlapping Chamber' : 'Struct Segmented Memory Alignment'}
                                </h3>
                            </div>
                            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                                {selectedPreset.topicId >= 5 ? 'Shared Single Offset' : 'Padded Memory Blocks'}
                            </span>
                        </div>

                        {/* Visual Memory Partition Shape */}
                        <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800">
                            {selectedPreset.topicId >= 5 ? (
                                /* Union Overlapping Single Chamber Shape */
                                <div className="space-y-2">
                                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Shared 8-Byte Chamber:</div>
                                    <div className="relative p-3 bg-slate-900 border-2 border-emerald-500 rounded-xl font-mono text-center">
                                        <div className="text-xs text-emerald-400 font-bold mb-1">[ 0x3000 to 0x3008 &bull; Shared 8 Bytes ]</div>
                                        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                                            <div className="p-1.5 bg-blue-950/80 border border-blue-500/50 rounded text-blue-300">
                                                u.i (4B int)
                                            </div>
                                            <div className="p-1.5 bg-amber-950/80 border border-amber-500/50 rounded text-amber-300">
                                                u.f (4B float)
                                            </div>
                                            <div className="p-1.5 bg-teal-950/80 border border-teal-500/50 rounded text-teal-300">
                                                u.str (8B max)
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-2 italic">
                                            Mutating u.f rewrites the exact same bytes occupied by u.i
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Struct Segmented Memory Allocation with Padding */
                                <div className="space-y-2">
                                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Contiguous Memory Partitions:</div>
                                    <div className="flex items-center gap-1 font-mono text-[10px] text-center overflow-x-auto">
                                        <div className="flex-1 p-2 bg-blue-950 border border-blue-500 rounded-lg text-blue-300">
                                            <div>Member 1</div>
                                            <div className="font-bold text-white text-xs">4 Bytes</div>
                                            <div className="text-[9px] text-slate-400">Offset +0</div>
                                        </div>
                                        <div className="p-2 bg-amber-950 border border-amber-500 rounded-lg text-amber-300 w-16">
                                            <div>Char</div>
                                            <div className="font-bold text-white text-xs">1 Byte</div>
                                            <div className="text-[9px] text-slate-400">Offset +4</div>
                                        </div>
                                        <div className="p-2 bg-slate-900 border border-dashed border-slate-700 rounded-lg text-slate-400 w-20">
                                            <div>Padding</div>
                                            <div className="font-bold text-slate-300 text-xs">3 Bytes</div>
                                            <div className="text-[9px] text-slate-500">Alignment</div>
                                        </div>
                                        <div className="flex-1 p-2 bg-emerald-950 border border-emerald-500 rounded-lg text-emerald-300">
                                            <div>Member 3</div>
                                            <div className="font-bold text-white text-xs">4 Bytes</div>
                                            <div className="text-[9px] text-slate-400">Offset +8</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono text-center pt-1">
                                        Total Struct Size: 12 Bytes (4B + 1B + 3B padding + 4B)
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2.5 font-mono">
                            {currentStep.members.map((m, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-400 font-bold">{m.name}</span>
                                        <span className="text-slate-500 text-[10px]">({m.bytes})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                            {m.val}
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
