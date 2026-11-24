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
    FileText,
    HardDrive,
    SlidersHorizontal,
    Cpu,
    ExternalLink
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /open.*close|fopen/i,
        label: '9.1 Opening & Closing a File',
        code: `#include <stdio.h>

int main() {
    // Open stream in write mode ("w")
    FILE *fp = fopen("output.txt", "w");

    if (fp == NULL) {
        printf("Error: Failed to open file!\\n");
        return 1;
    }

    printf("File stream opened successfully. fp = %p\\n", (void*)fp);
    fputs("HiGen Labs C Engine\\n", fp);

    fclose(fp); // Flush buffer and release file descriptor
    printf("File closed cleanly.\\n");
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'fopen', detail: 'fopen("output.txt", "w")', explanation: 'OS allocates FILE stream buffer in RAM and binds to disk file descriptor.', fileState: { name: 'output.txt', mode: 'w', cursor: 0, content: '', status: 'OPEN' }, output: [] },
            { lineNum: 7, action: 'check', detail: 'Check if (fp == NULL)', explanation: 'Stream successfully acquired; condition false.', fileState: { name: 'output.txt', mode: 'w', cursor: 0, content: '', status: 'OPEN' }, output: [] },
            { lineNum: 12, action: 'print', detail: 'printf stream descriptor', explanation: 'fp holds memory address of OS FILE struct.', fileState: { name: 'output.txt', mode: 'w', cursor: 0, content: '', status: 'OPEN' }, output: ['File stream opened successfully. fp = 0x55aa10'] },
            { lineNum: 13, action: 'fputs', detail: 'fputs text to buffer', explanation: 'Writes 20 bytes into standard I/O buffer.', fileState: { name: 'output.txt', mode: 'w', cursor: 20, content: 'HiGen Labs C Engine\n', status: 'BUFFERED' }, output: ['File stream opened successfully. fp = 0x55aa10'] },
            { lineNum: 15, action: 'fclose', detail: 'fclose(fp)', explanation: 'Flushes write buffer to disk block and releases kernel file descriptor.', fileState: { name: 'output.txt', mode: 'w', cursor: 20, content: 'HiGen Labs C Engine\n', status: 'CLOSED' }, output: ['File stream opened successfully. fp = 0x55aa10', 'File closed cleanly.'] },
            { lineNum: 17, action: 'return', detail: 'return 0', explanation: 'Execution complete.', fileState: { name: 'output.txt', mode: 'w', cursor: 20, content: 'HiGen Labs C Engine\n', status: 'CLOSED' }, output: ['File stream opened successfully. fp = 0x55aa10', 'File closed cleanly.', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What happens if you omit fclose(fp) after writing to a file in C?',
            options: ['Buffered data might not be flushed to disk, causing data loss and file descriptor leaks', 'The computer reboots immediately', 'The compiler throws an error', 'The file becomes executable'],
            correct: 'Buffered data might not be flushed to disk, causing data loss and file descriptor leaks',
            explanation: 'fclose() flushes the C runtime buffer to disk storage and informs the OS kernel to release the file handle.'
        }
    },
    {
        topicId: 2,
        matchPattern: /read and write|fgetc|fgets/i,
        label: '9.2 Read & Write Operations',
        code: `#include <stdio.h>

int main() {
    FILE *fp = fopen("notes.txt", "r");
    if (!fp) return 1;

    char buffer[50];
    // Read formatted line stream
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("Read: %s", buffer);
    }

    fclose(fp);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'open', detail: 'fopen("notes.txt", "r")', explanation: 'Opens existing file in read mode; read cursor at byte 0.', fileState: { name: 'notes.txt', mode: 'r', cursor: 0, content: 'Line 1: System Init\nLine 2: Server Ready\n', status: 'READING' }, output: [] },
            { lineNum: 9, action: 'fgets-1', detail: 'fgets Line 1', explanation: 'Reads until newline: "Line 1: System Init\\n". Cursor moves +20 bytes.', fileState: { name: 'notes.txt', mode: 'r', cursor: 20, content: 'Line 1: System Init\nLine 2: Server Ready\n', status: 'READING' }, output: ['Read: Line 1: System Init'] },
            { lineNum: 9, action: 'fgets-2', detail: 'fgets Line 2', explanation: 'Reads "Line 2: Server Ready\\n". Cursor moves +21 bytes.', fileState: { name: 'notes.txt', mode: 'r', cursor: 41, content: 'Line 1: System Init\nLine 2: Server Ready\n', status: 'READING' }, output: ['Read: Line 1: System Init', 'Read: Line 2: Server Ready'] },
            { lineNum: 9, action: 'eof', detail: 'EOF reached (NULL returned)', explanation: 'End of file sentinel encountered; loop terminates.', fileState: { name: 'notes.txt', mode: 'r', cursor: 41, content: 'Line 1: System Init\nLine 2: Server Ready\n', status: 'EOF' }, output: ['Read: Line 1: System Init', 'Read: Line 2: Server Ready'] },
            { lineNum: 13, action: 'close', detail: 'fclose(fp)', explanation: 'Closes read stream.', fileState: { name: 'notes.txt', mode: 'r', cursor: 41, content: 'Line 1: System Init\nLine 2: Server Ready\n', status: 'CLOSED' }, output: ['Read: Line 1: System Init', 'Read: Line 2: Server Ready', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What does fgets() return when it reaches the end of the file (EOF) without reading any characters?',
            options: ['NULL', '0', 'EOF (-1)', 'Empty string ""'],
            correct: 'NULL',
            explanation: 'fgets() returns a pointer to the buffer on success, and NULL upon reaching EOF or encountering a read error.'
        }
    },
    {
        topicId: 3,
        matchPattern: /random access|fseek|ftell/i,
        label: '9.3 Random Access (fseek/ftell)',
        code: `#include <stdio.h>

int main() {
    FILE *fp = fopen("system.log", "w+");
    fputs("HIGEN-LABS-SYSTEM", fp); // 17 bytes written

    printf("ftell after write: %ld\\n", ftell(fp)); // byte 17

    // Reposition cursor to 6th byte relative to start
    fseek(fp, 6, SEEK_SET);
    printf("ftell after fseek(6, SEEK_SET): %ld\\n", ftell(fp));

    char word[5];
    fgets(word, 5, fp); // Reads 4 chars + '\\0'
    printf("Read word at offset 6: %s\\n", word);

    fclose(fp);
    return 0;
}`,
        steps: [
            { lineNum: 5, action: 'write', detail: 'fputs 17 bytes ("HIGEN-LABS-SYSTEM")', explanation: 'File pointer cursor advances to byte 17.', fileState: { name: 'system.log', mode: 'w+', cursor: 17, content: 'HIGEN-LABS-SYSTEM', status: 'AT BYTE 17' }, output: [] },
            { lineNum: 7, action: 'ftell', detail: 'ftell(fp) returns 17', explanation: 'ftell returns current byte offset from beginning of file.', fileState: { name: 'system.log', mode: 'w+', cursor: 17, content: 'HIGEN-LABS-SYSTEM', status: 'AT BYTE 17' }, output: ['ftell after write: 17'] },
            { lineNum: 10, action: 'fseek', detail: 'fseek(fp, 6, SEEK_SET)', explanation: 'Cursor jumps directly to byte offset 6 ("LABS...").', fileState: { name: 'system.log', mode: 'w+', cursor: 6, content: 'HIGEN-LABS-SYSTEM', status: 'SEEK TO 6' }, output: ['ftell after write: 17'] },
            { lineNum: 11, action: 'ftell-check', detail: 'ftell after seek is 6', explanation: 'Cursor verified at index 6.', fileState: { name: 'system.log', mode: 'w+', cursor: 6, content: 'HIGEN-LABS-SYSTEM', status: 'SEEK TO 6' }, output: ['ftell after write: 17', 'ftell after fseek(6, SEEK_SET): 6'] },
            { lineNum: 14, action: 'fgets', detail: 'fgets read 4 bytes', explanation: 'Reads "LABS" starting at index 6.', fileState: { name: 'system.log', mode: 'w+', cursor: 10, content: 'HIGEN-LABS-SYSTEM', status: 'AT BYTE 10' }, output: ['ftell after write: 17', 'ftell after fseek(6, SEEK_SET): 6', 'Read word at offset 6: LABS'] },
            { lineNum: 16, action: 'close', detail: 'fclose(fp)', explanation: 'Stream closed cleanly.', fileState: { name: 'system.log', mode: 'w+', cursor: 10, content: 'HIGEN-LABS-SYSTEM', status: 'CLOSED' }, output: ['ftell after write: 17', 'ftell after fseek(6, SEEK_SET): 6', 'Read word at offset 6: LABS', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What is the purpose of fseek(fp, 0, SEEK_END) followed by ftell(fp)?',
            options: ['Computes the exact total byte size of the file', 'Clears file contents', 'Rewinds back to byte 0', 'Generates a checksum'],
            correct: 'Computes the exact total byte size of the file',
            explanation: 'Seeking to offset 0 from SEEK_END moves the cursor to the end; ftell() then returns the total bytes from start to end.'
        }
    },
    {
        topicId: 4,
        matchPattern: /command line|argc|argv/i,
        label: '9.4 Command Line Arguments',
        code: `#include <stdio.h>

// argc = argument count
// argv = array of argument strings
int main(int argc, char *argv[]) {
    printf("Total arguments passed: %d\\n", argc);

    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\\n", i, argv[i]);
    }
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'count', detail: 'Terminal invocation: ./app test.txt 100', explanation: 'OS loader parses 3 tokens: argv[0]="./app", argv[1]="test.txt", argv[2]="100". argc = 3.', fileState: { name: 'CLI Input', mode: 'argv', cursor: 3, content: './app test.txt 100', status: 'ARGC = 3' }, output: ['Total arguments passed: 3'] },
            { lineNum: 9, action: 'print-0', detail: 'argv[0] is executable path', explanation: 'Always contains binary name/path.', fileState: { name: 'CLI Input', mode: 'argv', cursor: 0, content: './app', status: 'ARG 0' }, output: ['Total arguments passed: 3', 'argv[0] = ./app'] },
            { lineNum: 9, action: 'print-1', detail: 'argv[1] = "test.txt"', explanation: 'First user argument.', fileState: { name: 'CLI Input', mode: 'argv', cursor: 1, content: 'test.txt', status: 'ARG 1' }, output: ['Total arguments passed: 3', 'argv[0] = ./app', 'argv[1] = test.txt'] },
            { lineNum: 9, action: 'print-2', detail: 'argv[2] = "100"', explanation: 'Second user argument string.', fileState: { name: 'CLI Input', mode: 'argv', cursor: 2, content: '100', status: 'ARG 2' }, output: ['Total arguments passed: 3', 'argv[0] = ./app', 'argv[1] = test.txt', 'argv[2] = 100'] },
            { lineNum: 11, action: 'return', detail: 'return 0', explanation: 'Exited with status code 0.', fileState: { name: 'CLI Input', mode: 'argv', cursor: 3, content: './app test.txt 100', status: 'DONE' }, output: ['Total arguments passed: 3', 'argv[0] = ./app', 'argv[1] = test.txt', 'argv[2] = 100', '[Process completed with code 0]'] }
        ],
        challenge: {
            question: 'What is guaranteed to be stored in argv[0] when running a C program from the command line?',
            options: ['The name or executable file path used to invoke the program', 'The first user parameter', 'NULL', 'The current working directory only'],
            correct: 'The name or executable file path used to invoke the program',
            explanation: 'By convention in C and POSIX systems, argv[0] contains the program name or path used to launch the binary.'
        }
    }
];

export default function CFileHandlingVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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
                        File Handling
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
                        badgeText="C Stream I/O Engine"
                        fileName="file_io.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Stream Buffer & File System Visualizer (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                            OS Stream & Buffer Status
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Cursor: Byte {currentStep.fileState.cursor}
                        </span>
                    </div>

                    {/* 1. File Stream Box */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-bold text-white">{currentStep.fileState.name}</h3>
                            </div>
                            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                                Mode: {currentStep.fileState.mode} | {currentStep.fileState.status}
                            </span>
                        </div>

                        {/* Visual Disk Track & Needle Cursor Shape */}
                        <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <span>SEEK_SET (0)</span>
                                <span>SEEK_CUR (Byte {currentStep.fileState.cursor})</span>
                                <span>SEEK_END (20)</span>
                            </div>

                            {/* SVG Track with Cursor Needle */}
                            <svg viewBox="0 0 320 60" className="w-full h-auto">
                                {/* Track Base */}
                                <rect x="10" y="25" width="300" height="12" rx="3" fill="#1e293b" />
                                
                                {/* Byte Markers */}
                                {[0, 4, 8, 12, 16, 20].map((b, i) => (
                                    <line key={b} x1={15 + i * 58} y1="20" x2={15 + i * 58} y2="42" stroke="#475569" strokeWidth="1" />
                                ))}

                                {/* Animated Read/Write Head Needle */}
                                {(() => {
                                    const maxBytes = 20;
                                    const cur = Math.min(Math.max(currentStep.fileState.cursor, 0), maxBytes);
                                    const needleX = 15 + (cur / maxBytes) * 290;
                                    return (
                                        <g className="transition-all duration-300">
                                            {/* Top Needle Head */}
                                            <polygon points={`${needleX - 7},5 ${needleX + 7},5 ${needleX},20`} fill="#38bdf8" />
                                            {/* Vertical Indicator Beam */}
                                            <line x1={needleX} y1="18" x2={needleX} y2="45" stroke="#38bdf8" strokeWidth="2.5" />
                                            <circle cx={needleX} cy="31" r="3" fill="#ffffff" />
                                            <text x={needleX} y="55" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                                                {cur}B
                                            </text>
                                        </g>
                                    );
                                })()}
                            </svg>
                        </div>

                        {/* Stream Content Preview */}
                        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-xs space-y-2">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Disk Stream Buffer Content:</div>
                            <div className="text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 whitespace-pre font-mono">
                                {currentStep.fileState.content || '<Empty / Initializing>'}
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                <span>Current Seek Position:</span>
                                <span className="text-emerald-400 font-bold">{currentStep.fileState.cursor} bytes</span>
                            </div>
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
