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
    Binary,
    Grid,
    Cpu
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /intro.*array/i,
        label: '5.1 Introduction of Array',
        code: `#include <stdio.h>

// Array: Contiguous memory collection of homogeneous elements
int main() {
    int scores[4] = {85, 92, 78, 95};

    printf("Array base address: %p\\n", (void*)scores);
    printf("Total memory size: %zu bytes\\n", sizeof(scores));
    printf("Element count: %zu\\n", sizeof(scores) / sizeof(scores[0]));
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'alloc', detail: 'int scores[4] = {85, 92, 78, 95}', explanation: 'Allocates 16 contiguous bytes on stack (4 elements * 4 bytes each).', activeIdx: 0, vars: { 'scores[0]': '85', 'scores[1]': '92', 'scores[2]': '78', 'scores[3]': '95' }, output: [] },
            { lineNum: 7, action: 'print', detail: 'Base address of array', explanation: 'Array identifier decays to pointer pointing to &scores[0].', activeIdx: 0, vars: { baseAddr: '0x2000' }, output: ['Array base address: 0x2000'] },
            { lineNum: 8, action: 'sizeof', detail: 'Total memory size calculation', explanation: 'sizeof(scores) evaluates to 4 * 4 = 16 bytes at compile time.', activeIdx: 1, vars: { totalBytes: '16' }, output: ['Array base address: 0x2000', 'Total memory size: 16 bytes'] },
            { lineNum: 9, action: 'count', detail: 'Element count calculation', explanation: 'Total bytes / single element size yields 4.', activeIdx: 3, vars: { count: '4' }, output: ['Array base address: 0x2000', 'Total memory size: 16 bytes', 'Element count: 4'] },
            { lineNum: 10, action: 'return', detail: 'return 0', explanation: 'Process exited cleanly.', activeIdx: 3, vars: { exit: '0' }, output: ['Array base address: 0x2000', 'Total memory size: 16 bytes', 'Element count: 4', '[Process completed with code 0]'] }
        ],
        cells: [
            { idx: 0, val: 85, addr: '0x2000', label: 'scores[0]' },
            { idx: 1, val: 92, addr: '0x2004', label: 'scores[1]' },
            { idx: 2, val: 78, addr: '0x2008', label: 'scores[2]' },
            { idx: 3, val: 95, addr: '0x200C', label: 'scores[3]' }
        ],
        challenge: {
            question: 'If base address &scores[0] is 0x2000 and each int is 4 bytes, what is &scores[3]?',
            options: ['0x2003', '0x200C', '0x2012', '0x2006'],
            correct: '0x200C',
            explanation: 'Address = Base + (index * 4). Here: 0x2000 + (3 * 4) = 0x2000 + 12 (0x0C) = 0x200C.'
        }
    },
    {
        topicId: 2,
        matchPattern: /one dimensional|1d/i,
        label: '5.2 One Dimensional Array',
        code: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};

    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d at %p\\n", i, arr[i], (void*)&arr[i]);
    }
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'init', detail: 'int arr[5] allocated at 0x2000', explanation: 'Stack frame reserves 20 contiguous bytes.', activeIdx: 0, vars: { i: '0', 'arr[0]': '10' }, output: [] },
            { lineNum: 7, action: 'print', detail: 'arr[0] = 10 at 0x2000', explanation: 'Offset 0 * 4 = +0 bytes.', activeIdx: 0, vars: { i: '0', val: '10' }, output: ['arr[0] = 10 at 0x2000'] },
            { lineNum: 7, action: 'print', detail: 'arr[1] = 20 at 0x2004', explanation: 'Offset 1 * 4 = +4 bytes.', activeIdx: 1, vars: { i: '1', val: '20' }, output: ['arr[0] = 10 at 0x2000', 'arr[1] = 20 at 0x2004'] },
            { lineNum: 7, action: 'print', detail: 'arr[2] = 30 at 0x2008', explanation: 'Offset 2 * 4 = +8 bytes.', activeIdx: 2, vars: { i: '2', val: '30' }, output: ['arr[0] = 10 at 0x2000', 'arr[1] = 20 at 0x2004', 'arr[2] = 30 at 0x2008'] },
            { lineNum: 7, action: 'print', detail: 'arr[3] = 40 at 0x200C', explanation: 'Offset 3 * 4 = +12 bytes.', activeIdx: 3, vars: { i: '3', val: '40' }, output: ['arr[0] = 10 at 0x2000', 'arr[1] = 20 at 0x2004', 'arr[2] = 30 at 0x2008', 'arr[3] = 40 at 0x200C'] },
            { lineNum: 7, action: 'print', detail: 'arr[4] = 50 at 0x2010', explanation: 'Offset 4 * 4 = +16 bytes.', activeIdx: 4, vars: { i: '4', val: '50' }, output: ['arr[0] = 10 at 0x2000', 'arr[1] = 20 at 0x2004', 'arr[2] = 30 at 0x2008', 'arr[3] = 40 at 0x200C', 'arr[4] = 50 at 0x2010'] },
            { lineNum: 9, action: 'return', detail: 'return 0', explanation: 'Completed traversal.', activeIdx: 4, vars: { exit: '0' }, output: ['arr[0] = 10 at 0x2000', 'arr[1] = 20 at 0x2004', 'arr[2] = 30 at 0x2008', 'arr[3] = 40 at 0x200C', 'arr[4] = 50 at 0x2010', '[Process completed with code 0]'] }
        ],
        cells: [
            { idx: 0, val: 10, addr: '0x2000', label: 'arr[0]' },
            { idx: 1, val: 20, addr: '0x2004', label: 'arr[1]' },
            { idx: 2, val: 30, addr: '0x2008', label: 'arr[2]' },
            { idx: 3, val: 40, addr: '0x200C', label: 'arr[3]' },
            { idx: 4, val: 50, addr: '0x2010', label: 'arr[4]' }
        ],
        challenge: {
            question: 'What happens if you access arr[5] in a 5-element array in C?',
            options: ['IndexOutOfBoundsException is thrown', 'Undefined Behavior (reads out of bounds memory)', 'Compiler error', 'Returns NULL'],
            correct: 'Undefined Behavior (reads out of bounds memory)',
            explanation: 'C does not perform runtime array bound checking; accessing arr[5] reads whatever raw bytes exist beyond the allocated buffer (Undefined Behavior).'
        }
    },
    {
        topicId: 3,
        matchPattern: /two dimensional|2d/i,
        label: '5.3 Two Dimensional Array',
        code: `#include <stdio.h>

int main() {
    int mat[2][3] = {
        {10, 20, 30},
        {40, 50, 60}
    };

    printf("Row 0: %d %d %d\\n", mat[0][0], mat[0][1], mat[0][2]);
    printf("Row 1: %d %d %d\\n", mat[1][0], mat[1][1], mat[1][2]);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'alloc', detail: 'int mat[2][3] stored in Row-Major order', explanation: 'Stored sequentially: Row 0 followed immediately by Row 1.', activeIdx: 0, vars: { rows: '2', cols: '3' }, output: [] },
            { lineNum: 9, action: 'print', detail: 'Read Row 0 elements (linear indices 0, 1, 2)', explanation: 'mat[0][c] access.', activeIdx: 1, vars: { row: '0' }, output: ['Row 0: 10 20 30'] },
            { lineNum: 10, action: 'print', detail: 'Read Row 1 elements (linear indices 3, 4, 5)', explanation: 'mat[1][c] access: offset = (1 * 3 + c) * 4.', activeIdx: 4, vars: { row: '1' }, output: ['Row 0: 10 20 30', 'Row 1: 40 50 60'] },
            { lineNum: 11, action: 'return', detail: 'return 0', explanation: 'Complete.', activeIdx: 5, vars: { exit: '0' }, output: ['Row 0: 10 20 30', 'Row 1: 40 50 60', '[Process completed with code 0]'] }
        ],
        cells: [
            { idx: 0, val: 10, addr: '0x2000', label: 'mat[0][0]' },
            { idx: 1, val: 20, addr: '0x2004', label: 'mat[0][1]' },
            { idx: 2, val: 30, addr: '0x2008', label: 'mat[0][2]' },
            { idx: 3, val: 40, addr: '0x200C', label: 'mat[1][0]' },
            { idx: 4, val: 50, addr: '0x2010', label: 'mat[1][1]' },
            { idx: 5, val: 60, addr: '0x2014', label: 'mat[1][2]' }
        ],
        challenge: {
            question: 'In C, how are 2D arrays laid out physically in RAM?',
            options: ['Row-Major Order (Row by Row)', 'Column-Major Order (Col by Col)', 'Linked Nodes', 'Sparse Hash Map'],
            correct: 'Row-Major Order (Row by Row)',
            explanation: 'C strictly uses Row-Major layout: all columns of row 0 are contiguous, followed by all columns of row 1.'
        }
    },
    {
        topicId: 4,
        matchPattern: /multidimensional/i,
        label: '5.4 Multidimensional Array',
        code: `#include <stdio.h>

int main() {
    // 3D tensor: 2 layers, 2 rows, 2 cols (2 x 2 x 2 = 8 elements)
    int tensor[2][2][2] = {
        { {1, 2}, {3, 4} },
        { {5, 6}, {7, 8} }
    };

    printf("tensor[0][1][1] = %d\\n", tensor[0][1][1]);
    printf("tensor[1][0][0] = %d\\n", tensor[1][0][0]);
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'alloc', detail: '3D tensor[2][2][2] allocation', explanation: 'Total 8 integers = 32 contiguous bytes in RAM.', activeIdx: 0, vars: { depth: '2', rows: '2', cols: '2' }, output: [] },
            { lineNum: 10, action: 'access', detail: 'Access tensor[0][1][1]', explanation: 'Formula: Base + (0*4 + 1*2 + 1)*4 = Base + 12 = val 4.', activeIdx: 3, vars: { target: '4' }, output: ['tensor[0][1][1] = 4'] },
            { lineNum: 11, action: 'access', detail: 'Access tensor[1][0][0]', explanation: 'Formula: Base + (1*4 + 0*2 + 0)*4 = Base + 16 = val 5.', activeIdx: 4, vars: { target: '5' }, output: ['tensor[0][1][1] = 4', 'tensor[1][0][0] = 5'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Complete.', activeIdx: 7, vars: { exit: '0' }, output: ['tensor[0][1][1] = 4', 'tensor[1][0][0] = 5', '[Process completed with code 0]'] }
        ],
        cells: [
            { idx: 0, val: 1, addr: '0x2000', label: 'T[0][0][0]' },
            { idx: 1, val: 2, addr: '0x2004', label: 'T[0][0][1]' },
            { idx: 2, val: 3, addr: '0x2008', label: 'T[0][1][0]' },
            { idx: 3, val: 4, addr: '0x200C', label: 'T[0][1][1]' },
            { idx: 4, val: 5, addr: '0x2010', label: 'T[1][0][0]' },
            { idx: 5, val: 6, addr: '0x2014', label: 'T[1][0][1]' }
        ],
        challenge: {
            question: 'For array arr[D][R][C], what is the linear memory offset for arr[d][r][c]?',
            options: ['(d * R * C + r * C + c) * sizeof(type)', '(d + r + c) * sizeof(type)', 'd * r * c', '(c * R * D + r * D + d)'],
            correct: '(d * R * C + r * C + c) * sizeof(type)',
            explanation: 'Each plane contains R * C elements, each row has C elements, plus column offset c.'
        }
    },
    {
        topicId: 5,
        matchPattern: /dynamic.*array/i,
        label: '5.5 Dynamic Arrays',
        code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 4;
    int *arr = (int*)malloc(n * sizeof(int)); // Heap allocation

    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 100;

    printf("Dynamic element: %d\\n", arr[2]);
    free(arr); // Prevent memory leak
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'malloc', detail: 'malloc(4 * sizeof(int))', explanation: 'Allocates 16 bytes on Heap; arr holds heap pointer 0x8000.', activeIdx: 0, vars: { heapPtr: '0x8000', bytes: '16' }, output: [] },
            { lineNum: 8, action: 'populate', detail: 'Populate heap elements', explanation: 'Pointer arithmetic: *(arr + i) = (i+1)*100.', activeIdx: 2, vars: { 'arr[2]': '300' }, output: [] },
            { lineNum: 10, action: 'print', detail: 'printf arr[2]', explanation: 'Outputs 300.', activeIdx: 2, vars: { val: '300' }, output: ['Dynamic element: 300'] },
            { lineNum: 11, action: 'free', detail: 'free(arr)', explanation: 'Heap memory returned to OS memory pool.', activeIdx: 0, vars: { freed: 'true' }, output: ['Dynamic element: 300', '[Heap block freed]'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Exits cleanly.', activeIdx: 0, vars: { exit: '0' }, output: ['Dynamic element: 300', '[Heap block freed]', '[Process completed with code 0]'] }
        ],
        cells: [
            { idx: 0, val: 100, addr: '0x8000', label: '*(arr+0)' },
            { idx: 1, val: 200, addr: '0x8004', label: '*(arr+1)' },
            { idx: 2, val: 300, addr: '0x8008', label: '*(arr+2)' },
            { idx: 3, val: 400, addr: '0x800C', label: '*(arr+3)' }
        ],
        challenge: {
            question: 'Where is dynamic memory allocated by malloc() located in RAM?',
            options: ['Heap Segment', 'Stack Segment', 'Data Segment', 'Code Segment'],
            correct: 'Heap Segment',
            explanation: 'Static/local arrays live on the Stack; dynamic buffers allocated with malloc/calloc live on the Heap.'
        }
    },
    {
        topicId: 6,
        matchPattern: /string.*variable/i,
        label: '5.6 String Variables',
        code: `#include <stdio.h>

int main() {
    // In C, string is null-terminated ('\\0') char array
    char str[6] = "HiGen";

    printf("String: %s\\n", str);
    printf("str[0] = '%c' (0x%X)\\n", str[0], str[0]);
    printf("str[5] (sentinel): %d\\n", str[5]);
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'init', detail: "char str[6] = {'H','i','G','e','n','\\0'}", explanation: '6 bytes reserved; final byte is ASCII 0 sentinel.', activeIdx: 0, vars: { str: '"HiGen"', len: '5' }, output: [] },
            { lineNum: 7, action: 'print', detail: 'printf with %s', explanation: 'Reads until it encounters null terminator byte.', activeIdx: 2, vars: { out: 'HiGen' }, output: ['String: HiGen'] },
            { lineNum: 8, action: 'print', detail: "str[0] = 'H'", explanation: 'First character ASCII 72 (0x48).', activeIdx: 0, vars: { ch: 'H' }, output: ['String: HiGen', "str[0] = 'H' (0x48)"] },
            { lineNum: 9, action: 'print', detail: 'str[5] sentinel byte', explanation: 'Null terminator byte is integer value 0.', activeIdx: 5, vars: { sentinel: '0' }, output: ['String: HiGen', "str[0] = 'H' (0x48)", 'str[5] (sentinel): 0'] },
            { lineNum: 10, action: 'return', detail: 'return 0', explanation: 'Program exit.', activeIdx: 5, vars: { exit: '0' }, output: ['String: HiGen', "str[0] = 'H' (0x48)", 'str[5] (sentinel): 0', '[Process completed with code 0]'] }
        ],
        cells: [
            { idx: 0, val: "'H'", addr: '0x3000', label: 'str[0]' },
            { idx: 1, val: "'i'", addr: '0x3001', label: 'str[1]' },
            { idx: 2, val: "'G'", addr: '0x3002', label: 'str[2]' },
            { idx: 3, val: "'e'", addr: '0x3003', label: 'str[3]' },
            { idx: 4, val: "'n'", addr: '0x3004', label: 'str[4]' },
            { idx: 5, val: "'\\0'", addr: '0x3005', label: 'str[5]' }
        ],
        challenge: {
            question: "Why is the '\\0' (null character) essential for strings in C?",
            options: ['Signals the exact boundary where the string ends in memory', 'Required by CPU hardware', 'Capitalizes the first letter', 'Saves battery power'],
            correct: 'Signals the exact boundary where the string ends in memory',
            explanation: "C character arrays don't store string length in a header; standard routines rely on the '\\0' byte sentinel to stop reading memory."
        }
    },
    {
        topicId: 7,
        matchPattern: /string.*handling|string\.h/i,
        label: '5.7 String Handling Functions',
        code: `#include <stdio.h>
#include <string.h>

int main() {
    char s1[20] = "HiGen";
    char s2[] = "Labs";

    printf("strlen(s1) = %zu\\n", strlen(s1));
    strcat(s1, s2); // Concatenate s2 onto s1
    printf("After strcat: %s\\n", s1);
    printf("strcmp result: %d\\n", strcmp(s1, "HiGenLabs"));
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'init', detail: 's1 and s2 declared', explanation: 's1 has buffer capacity for 20 bytes; currently holds "HiGen".', activeIdx: 0, vars: { 's1': 'HiGen', 's2': 'Labs' }, output: [] },
            { lineNum: 8, action: 'strlen', detail: 'strlen(s1) count', explanation: 'Counts characters excluding null terminator = 5.', activeIdx: 1, vars: { len: '5' }, output: ['strlen(s1) = 5'] },
            { lineNum: 9, action: 'strcat', detail: 'strcat(s1, s2)', explanation: 'Appends "Labs" starting at old null terminator location.', activeIdx: 2, vars: { 's1': 'HiGenLabs' }, output: ['strlen(s1) = 5'] },
            { lineNum: 10, action: 'print', detail: 'printf after strcat', explanation: 'Outputs combined string.', activeIdx: 2, vars: { result: 'HiGenLabs' }, output: ['strlen(s1) = 5', 'After strcat: HiGenLabs'] },
            { lineNum: 11, action: 'strcmp', detail: 'strcmp(s1, "HiGenLabs")', explanation: 'Strings are identical; returns 0.', activeIdx: 3, vars: { cmp: '0' }, output: ['strlen(s1) = 5', 'After strcat: HiGenLabs', 'strcmp result: 0'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Completed.', activeIdx: 3, vars: { exit: '0' }, output: ['strlen(s1) = 5', 'After strcat: HiGenLabs', 'strcmp result: 0', '[Process completed with code 0]'] }
        ],
        cells: [
            { idx: 0, val: "'H'", addr: '0x3000', label: 's1[0]' },
            { idx: 1, val: "'i'", addr: '0x3001', label: 's1[1]' },
            { idx: 2, val: "'G'", addr: '0x3002', label: 's1[2]' },
            { idx: 3, val: "'L'", addr: '0x3005', label: 's1[5]' },
            { idx: 4, val: "'a'", addr: '0x3006', label: 's1[6]' },
            { idx: 5, val: "'\\0'", addr: '0x3009', label: 's1[9]' }
        ],
        challenge: {
            question: 'What does strcmp(str1, str2) return if both strings are identical?',
            options: ['0', '1', '-1', 'true'],
            correct: '0',
            explanation: 'strcmp compares character ASCII differences; when all characters match, the difference is 0.'
        }
    }
];

export default function CArraysStringsVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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
                        Arrays &amp; Strings
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
                        badgeText="C Memory Grid Engine"
                        fileName="arrays_layout.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Contiguous Memory Layout (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Database className="w-3.5 h-3.5 text-blue-600" />
                            Contiguous Memory Visualizer
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {selectedPreset.cells[0]?.addr || '0x2000'}
                        </span>
                    </div>

                    {/* 1. Contiguous Byte Cell Visualizer */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-bold text-white">
                                    {selectedPreset.topicId >= 6 ? 'Null-Terminated String Carriage Train' : 'Contiguous Hardware RAM Layout'}
                                </h3>
                            </div>
                            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                                {selectedPreset.topicId >= 6 ? '1 Byte / Char' : '4 Bytes / Slot'}
                            </span>
                        </div>

                        {/* Visual Shape Diagram: String Train or 2D Matrix Plane or 1D Tape */}
                        {selectedPreset.topicId >= 6 ? (
                            /* String Train Carriage Shape */
                            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 overflow-x-auto">
                                <div className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">String Sentinel Structure:</div>
                                <div className="flex items-center gap-1.5 min-w-[280px]">
                                    {selectedPreset.cells.map((cell, idx) => {
                                        const isSentinel = cell.val === "'\\0'";
                                        const isActive = currentStep.activeIdx === cell.idx;
                                        return (
                                            <div key={cell.idx} className="flex items-center gap-1.5">
                                                <div className={`p-2.5 rounded-lg border text-center transition-all min-w-[44px] ${
                                                    isSentinel
                                                        ? 'bg-rose-950/80 border-rose-500 text-rose-300 ring-1 ring-rose-400/50'
                                                        : isActive
                                                        ? 'bg-blue-950 border-blue-400 text-blue-200 ring-1 ring-blue-400'
                                                        : 'bg-slate-900 border-slate-700 text-slate-300'
                                                }`}>
                                                    <div className="text-base font-black font-mono">{cell.val}</div>
                                                    <div className="text-[9px] text-slate-400 font-mono">{isSentinel ? 'END' : `[${idx}]`}</div>
                                                </div>
                                                {idx < selectedPreset.cells.length - 1 && (
                                                    <span className="text-slate-600 font-mono text-xs">─</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : selectedPreset.topicId === 3 ? (
                            /* 2D Matrix Row-Major Flattening Plane */
                            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Row-Major Flattening in RAM:</div>
                                <div className="space-y-1.5 font-mono text-xs">
                                    <div className="flex items-center gap-2 p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                                        <span className="text-blue-400 font-bold w-14">Row 0:</span>
                                        <span className="text-slate-200">[0][0]: 10</span>
                                        <span className="text-slate-400">&bull;</span>
                                        <span className="text-slate-200">[0][1]: 20</span>
                                        <span className="text-slate-400">&bull;</span>
                                        <span className="text-slate-200">[0][2]: 30</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                                        <span className="text-emerald-400 font-bold w-14">Row 1:</span>
                                        <span className="text-slate-200">[1][0]: 40</span>
                                        <span className="text-slate-400">&bull;</span>
                                        <span className="text-slate-200">[1][1]: 50</span>
                                        <span className="text-slate-400">&bull;</span>
                                        <span className="text-slate-200">[1][2]: 60</span>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono pt-1">
                                    Address = Base + (Row &times; 3 + Col) &times; 4 Bytes
                                </div>
                            </div>
                        ) : (
                            /* 1D Address Bus Ruler Tape */
                            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                                    <span>Offset +0B</span>
                                    <span>Offset +4B</span>
                                    <span>Offset +8B</span>
                                    <span>Offset +12B</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                                    <div className="w-1/4 h-full bg-blue-500 border-r border-slate-900" />
                                    <div className="w-1/4 h-full bg-cyan-500 border-r border-slate-900" />
                                    <div className="w-1/4 h-full bg-teal-500 border-r border-slate-900" />
                                    <div className="w-1/4 h-full bg-emerald-500" />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono text-center">
                            {selectedPreset.cells.map(cell => {
                                const isActive = currentStep.activeIdx === cell.idx;
                                return (
                                    <div
                                        key={cell.idx}
                                        className={`p-3 rounded-xl border transition-all ${
                                            isActive
                                                ? 'bg-blue-950/80 border-blue-500 shadow-md ring-1 ring-blue-400/50 scale-105'
                                                : 'bg-slate-800/60 border-slate-700/60'
                                        }`}
                                    >
                                        <div className="text-[10px] text-slate-400">{cell.label}</div>
                                        <div className={`text-base font-black my-1 ${isActive ? 'text-blue-300' : 'text-slate-100'}`}>
                                            {cell.val}
                                        </div>
                                        <div className="text-[9px] text-slate-500">{cell.addr}</div>
                                    </div>
                                );
                            })}
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
