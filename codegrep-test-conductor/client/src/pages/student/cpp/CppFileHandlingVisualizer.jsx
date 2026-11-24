import React, { useState, useEffect } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from '../python/InteractiveEditorWithArrow';
import CppExecutionInspector from './CppExecutionInspector';
import CppStackFootprint from './CppStackFootprint';
import {
    Play,
    RotateCcw,
    Code2,
    FileText,
    HardDrive,
    Terminal,
    Layers,
    ArrowRight,
    MoveRight,
    Binary,
    CheckCircle2
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /file operations/i,
        label: '8.1 File Operations',
        code: `#include <iostream>
#include <fstream>
#include <string>

int main() {
    // 1. Open file in write mode
    std::ofstream outFile("report.txt", std::ios::out);
    if (outFile.is_open()) {
        outFile << "Student: David Clark" << std::endl;
        outFile << "Score: 94" << std::endl;
        outFile.close();
    }

    // 2. Open file in read mode
    std::ifstream inFile("report.txt", std::ios::in);
    std::string line;
    while (std::getline(inFile, line)) {
        std::cout << "Read: " << line << std::endl;
    }
    inFile.close();

    return 0;
}`,
        steps: [
            { lineNum: 7, action: 'open_write', detail: 'ofstream outFile("report.txt", ios::out)', explanation: 'Creates or truncates report.txt in write mode. Stream buffer initialized.', vars: { file: 'report.txt', mode: 'ios::out', state: 'OPEN_WRITE' }, output: [] },
            { lineNum: 9, action: 'write_line1', detail: 'outFile << "Student: David Clark"', explanation: 'Buffered stream insertion writes string into file buffer.', vars: { file: 'report.txt', buffer: '"Student: David Clark\\n"' }, output: [] },
            { lineNum: 10, action: 'write_line2', detail: 'outFile << "Score: 94"', explanation: 'Flushes and appends second line to disk buffer.', vars: { file: 'report.txt', buffer: '"Score: 94\\n"' }, output: [] },
            { lineNum: 11, action: 'close_write', detail: 'outFile.close()', explanation: 'Flushes remaining stream buffer to disk and releases file handle.', vars: { file: 'report.txt', state: 'CLOSED' }, output: [] },
            { lineNum: 15, action: 'open_read', detail: 'ifstream inFile("report.txt", ios::in)', explanation: 'Opens existing file in read mode. Get-pointer placed at byte offset 0.', vars: { file: 'report.txt', mode: 'ios::in', state: 'OPEN_READ', getPtr: 0 }, output: [] },
            { lineNum: 18, action: 'getline1', detail: 'getline(inFile, line)', explanation: 'Reads until newline character into string variable line.', vars: { line: '"Student: David Clark"', getPtr: 21 }, output: ['Read: Student: David Clark'] },
            { lineNum: 18, action: 'getline2', detail: 'getline(inFile, line)', explanation: 'Reads second record line until EOF reached.', vars: { line: '"Score: 94"', getPtr: 31, eof: true }, output: ['Read: Student: David Clark', 'Read: Score: 94'] },
            { lineNum: 20, action: 'close_read', detail: 'inFile.close()', explanation: 'Releases file descriptor and closes stream.', vars: { file: 'report.txt', state: 'CLOSED' }, output: ['Read: Student: David Clark', 'Read: Score: 94', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /file pointer and their manipulation/i,
        label: '8.2 File Pointers (seekg/seekp)',
        code: `#include <iostream>
#include <fstream>

int main() {
    std::fstream file("log.txt", std::ios::in | std::ios::out | std::ios::trunc);
    file << "ABCDEFGHIJ0123456789";

    // Inspect Put pointer position
    std::streampos pPos = file.tellp(); // 20 bytes written

    // Seek Get pointer: Jump to index 5 from beginning
    file.seekg(5, std::ios::beg);
    char ch;
    file.get(ch); // Reads 'F'
    std::cout << "Byte at offset 5: " << ch << std::endl;

    // Seek Put pointer: Overwrite at offset 10
    file.seekp(10, std::ios::beg);
    file << "XYZ";

    // Read file size by seeking get pointer to end
    file.seekg(0, std::ios::end);
    std::cout << "File size: " << file.tellg() << " bytes" << std::endl;

    file.close();
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'write_init', detail: 'file << "ABCDEFGHIJ0123456789"', explanation: 'Writes 20 bytes. Put pointer advances automatically to end.', vars: { tellp: 20, tellg: 0, buffer: 'ABCDEFGHIJ0123456789' }, output: [] },
            { lineNum: 9, action: 'tellp', detail: 'pPos = file.tellp()', explanation: 'tellp() returns the current position of the write stream pointer (20).', vars: { pPos: 20 }, output: [] },
            { lineNum: 12, action: 'seekg', detail: 'file.seekg(5, ios::beg)', explanation: 'seekg adjusts the read pointer to byte offset 5 (0-indexed).', vars: { seekgPos: 5, charAt: 'F' }, output: [] },
            { lineNum: 14, action: 'get_char', detail: 'file.get(ch)', explanation: 'Extracts single character at get-pointer: ch = \'F\'. Get-pointer advances to 6.', vars: { ch: "'F'", seekgPos: 6 }, output: ['Byte at offset 5: F'] },
            { lineNum: 18, action: 'seekp_overwrite', detail: 'file.seekp(10, ios::beg); file << "XYZ"', explanation: 'Overwrites 3 bytes starting at index 10 from "012" to "XYZ".', vars: { buffer: 'ABCDEFGHIJXYZ3456789', seekpPos: 13 }, output: ['Byte at offset 5: F'] },
            { lineNum: 22, action: 'seek_end', detail: 'file.seekg(0, ios::end); file.tellg()', explanation: 'Seeking to offset 0 from ios::end measures total file size.', vars: { fileSize: '20 bytes', tellg: 20 }, output: ['Byte at offset 5: F', 'File size: 20 bytes', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /file updation with random access/i,
        label: '8.3 Binary Random Access',
        code: `#include <iostream>
#include <fstream>

struct Student {
    int id;
    char name[12];
    double gpa;
};

int main() {
    // Binary random access read/write
    std::fstream binFile("students.dat", std::ios::in | std::ios::out | std::ios::binary);

    // Update Record 2 in place (0-indexed: record 1)
    Student updated = { 102, "Bob Vance", 3.85 };
    
    // Calculate exact byte offset
    std::streampos offset = 1 * sizeof(Student);
    binFile.seekp(offset, std::ios::beg);

    // Write binary block
    binFile.write(reinterpret_cast<char*>(&updated), sizeof(Student));

    std::cout << "Record 2 updated in place at offset: " << offset << "B" << std::endl;
    binFile.close();
    return 0;
}`,
        steps: [
            { lineNum: 12, action: 'open_bin', detail: 'Open binary stream', explanation: 'Opens students.dat with ios::binary flag preventing CR/LF newline translation.', vars: { mode: 'ios::in | ios::out | ios::binary', recordSize: '24 bytes' }, output: [] },
            { lineNum: 15, action: 'prepare_rec', detail: 'Initialize updated Student record', explanation: 'Packed struct: id (4B) + name[12] (12B) + gpa (8B) = 24 bytes total.', vars: { 'updated.id': 102, 'updated.name': '"Bob Vance"', 'updated.gpa': 3.85 }, output: [] },
            { lineNum: 18, action: 'calc_offset', detail: 'offset = 1 * sizeof(Student)', explanation: 'Random access direct calculation: byte position = recordIndex * 24 = 24 bytes.', vars: { targetRecord: 1, offset: '24 bytes' }, output: [] },
            { lineNum: 19, action: 'seekp_rec', detail: 'binFile.seekp(offset, ios::beg)', explanation: 'Hardware file pointer seeks directly to byte 24 without scanning preceding bytes.', vars: { putPointer: '24B (Record #1)' }, output: [] },
            { lineNum: 22, action: 'write_rec', detail: 'binFile.write((char*)&updated, sizeof(Student))', explanation: 'Raw byte copy of 24 contiguous memory bytes into file descriptor.', vars: { status: 'OVERWRITTEN', record: 'Bob Vance (GPA: 3.85)' }, output: ['Record 2 updated in place at offset: 24B', '[Process completed with code 0]'] }
        ]
    }
];

export default function CppFileHandlingVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
    const getInitialPreset = () => {
        if (lessonOrder && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            return TOPIC_PRESETS[lessonOrder - 1];
        }
        if (lessonTitle) {
            const found = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
            if (found) return found;
        }
        return TOPIC_PRESETS[1]; // Default to File Pointers
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

    const simulationSteps = selectedExample.steps || TOPIC_PRESETS[1].steps;
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

    // File buffer bytes demonstration
    const fileBytes = selectedExample.topicId === 2
        ? (currentStep.vars.buffer || 'ABCDEFGHIJ0123456789').split('')
        : ['S','t','u','d','e','n','t',':',' ','D','a','v','i','d'];

    const getPtrOffset = selectedExample.topicId === 2
        ? (currentStep.vars.seekgPos ?? 0)
        : (currentStep.vars.getPtr ?? 0);

    const putPtrOffset = selectedExample.topicId === 2
        ? (currentStep.vars.seekpPos ?? currentStep.vars.pPos ?? 20)
        : 0;

    return (
        <div className="space-y-4 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        C++ File Streams &amp; Random Access
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

                {/* Right Column: Live Execution & Visual Stream Architecture (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Live Execution & State Mutation (Right-Top Aligned with Code) */}
                    <CppExecutionInspector
                        currentStep={currentStep}
                        stepIdx={stepIdx}
                        totalSteps={simulationSteps.length}
                        topicLabel={selectedExample.label}
                    />

                    {/* Visualizer Mode 1: File Stream Pipeline & Flags */}
                    {selectedExample.topicId === 1 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    I/O Stream Pipeline Architecture
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                    {currentStep.vars.state || 'ACTIVE'}
                                </span>
                            </div>

                            {/* Stream Buffer Diagram */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Stream Object</span>
                                    <span className="text-xs font-mono font-bold text-blue-600 mt-1">
                                        {currentStep.vars.mode?.includes('out') ? 'std::ofstream' : 'std::ifstream'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase">Active Buffer</span>
                                    <span className="text-[11px] font-mono font-bold text-slate-800 mt-1 truncate max-w-[120px]">
                                        {currentStep.vars.buffer || currentStep.vars.line || 'Idle'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Disk File</span>
                                    <span className="text-xs font-mono font-bold text-emerald-600 mt-1">report.txt</span>
                                </div>
                            </div>

                            {/* Stream State Bits */}
                            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                                <div className="text-[11px] font-bold text-slate-700">Stream Status Flags (std::ios)</div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px]">
                                    <div className={`p-1.5 rounded border ${!currentStep.vars.eof ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        good(): {!currentStep.vars.eof ? '1' : '0'}
                                    </div>
                                    <div className={`p-1.5 rounded border ${currentStep.vars.eof ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        eof(): {currentStep.vars.eof ? '1' : '0'}
                                    </div>
                                    <div className="p-1.5 rounded border bg-white border-slate-200 text-slate-400">
                                        fail(): 0
                                    </div>
                                    <div className="p-1.5 rounded border bg-white border-slate-200 text-slate-400">
                                        bad(): 0
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visualizer Mode 2: File Pointer Navigation (seekg / seekp) */}
                    {selectedExample.topicId === 2 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <MoveRight className="w-4 h-4 text-blue-600" />
                                    File Pointer Track (Offsets 0 - 19)
                                </span>
                                <div className="flex items-center gap-3 text-[11px] font-mono">
                                    <span className="text-blue-600 font-bold">seekg: {getPtrOffset}</span>
                                    <span className="text-amber-600 font-bold">seekp: {putPtrOffset}</span>
                                </div>
                            </div>

                            {/* Dual Pointer Byte Array Track */}
                            <div className="space-y-2">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Contiguous Disk Byte Sequence
                                </div>
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 font-mono text-center">
                                    {fileBytes.map((b, i) => {
                                        const isGetAt = getPtrOffset === i;
                                        const isPutAt = putPtrOffset === i;
                                        return (
                                            <div
                                                key={i}
                                                className={`p-1.5 rounded border transition-all text-xs relative ${
                                                    isGetAt && isPutAt
                                                        ? 'bg-purple-100 border-purple-400 font-black text-purple-900 ring-2 ring-purple-300'
                                                        : isGetAt
                                                        ? 'bg-blue-100 border-blue-400 font-black text-blue-900 ring-2 ring-blue-300'
                                                        : isPutAt
                                                        ? 'bg-amber-100 border-amber-400 font-black text-amber-900 ring-2 ring-amber-300'
                                                        : 'bg-slate-50 border-slate-200 text-slate-700'
                                                }`}
                                            >
                                                <div className="text-[9px] text-slate-400">{i}</div>
                                                <div className="font-bold">{b}</div>
                                                {isGetAt && (
                                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-600 text-[8px] text-white flex items-center justify-center font-sans font-bold">
                                                        G
                                                    </span>
                                                )}
                                                {isPutAt && (
                                                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-600 text-[8px] text-white flex items-center justify-center font-sans font-bold">
                                                        P
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                                    <span className="flex items-center gap-1 font-semibold text-blue-700">
                                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                        [G] = Get Pointer (seekg / tellg)
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-amber-700">
                                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                                        [P] = Put Pointer (seekp / tellp)
                                    </span>
                                </div>
                            </div>

                            {/* Reference Points Explanation */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                    <div className="text-[10px] font-bold text-slate-400">ios::beg</div>
                                    <div className="font-mono text-slate-700 font-semibold mt-0.5">Offset 0</div>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                    <div className="text-[10px] font-bold text-slate-400">ios::cur</div>
                                    <div className="font-mono text-slate-700 font-semibold mt-0.5">Current + N</div>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                    <div className="text-[10px] font-bold text-slate-400">ios::end</div>
                                    <div className="font-mono text-slate-700 font-semibold mt-0.5">EOF - N</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visualizer Mode 3: Binary Random Access Record Blocks */}
                    {selectedExample.topicId === 3 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Binary className="w-4 h-4 text-emerald-600" />
                                    Random-Access Binary Records on Disk
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                    sizeof(Student) = 24B
                                </span>
                            </div>

                            {/* Binary Record Slots */}
                            <div className="space-y-2">
                                {[
                                    { index: 0, offset: '0 - 23 bytes', id: 101, name: 'Alice Smith', gpa: 3.92, active: false },
                                    { index: 1, offset: '24 - 47 bytes', id: 102, name: currentStep.vars['updated.name'] ? 'Bob Vance' : 'Bob Vance', gpa: currentStep.vars['updated.gpa'] || 3.40, active: true },
                                    { index: 2, offset: '48 - 71 bytes', id: 103, name: 'Charlie Kim', gpa: 3.75, active: false }
                                ].map(rec => (
                                    <div
                                        key={rec.index}
                                        className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                                            rec.active && currentStep.vars.putPointer
                                                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200'
                                                : 'bg-slate-50 border-slate-200 text-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-700 text-xs">
                                                #{rec.index}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{rec.name}</div>
                                                <div className="text-[10px] font-mono text-slate-400">
                                                    ID: {rec.id} &bull; GPA: {rec.gpa} &bull; Offset: {rec.offset}
                                                </div>
                                            </div>
                                        </div>
                                        {rec.active && currentStep.vars.putPointer && (
                                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                                                <CheckCircle2 className="w-3 h-3" />
                                                seekp Target
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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

