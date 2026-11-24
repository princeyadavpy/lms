import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Binary,
    Package,
    Cpu,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Zap,
    HardDrive,
    ShieldAlert,
    Radio,
    Code,
    Sliders,
    Eye,
    RefreshCw
} from 'lucide-react';

// ── Preset Examples for Topic 5.4 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'raw-binary-bytes',
        label: 'Raw Bytes ("wb")',
        code: `# Raw byte buffers store binary values 0-255
data = bytes([72, 101, 108, 108, 111])  # 'Hello' in ASCII

# Write raw bytes directly to data.bin
with open("data.bin", "wb") as f:
    f.write(data)

# Read raw bytes back
with open("data.bin", "rb") as f:
    raw = f.read()
    print("Read bytes:", raw)`
    },
    {
        id: 'pickle-dump-object',
        label: 'pickle.dump()',
        code: `import pickle

# Python dictionary in heap memory
student = {
    "name": "Asha",
    "score": 95,
    "passed": True
}

# Serialize live Python object to binary pickle format
with open("student.pkl", "wb") as f:
    pickle.dump(student, f)

print("Pickle binary generated.")`
    },
    {
        id: 'pickle-load-restore',
        label: 'pickle.load()',
        code: `import pickle

# Deserialize student.pkl back into Python heap object
with open("student.pkl", "rb") as f:
    restored = pickle.load(f)

print("Restored Name:", restored["name"])
print("Restored Score:", restored["score"])
print("Object Type:", type(restored).__name__)`
    },
    {
        id: 'pickle-security-warning',
        label: 'Pickle Security',
        code: `import pickle

# WARNING: Never unpickle untrusted data!
# pickle can execute arbitrary code during deserialization
payload = b"\\x80\\x04\\x95\\x18\\x00\\x00\\x00\\x00\\x00\\x00\\x00}\\x94\\x8c\\x04name\\x94\\x8c\\x04Asha\\x94s."

safe_object = pickle.loads(payload)
print("Safely verified object:", safe_object)`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `with open("image.png", "r") as f:\n    data = f.read()`,
        question: 'Why will opening an image file in "r" (text mode) fail or corrupt data?',
        options: [
            'Images can only be opened with specialized PIL library',
            'UnicodeDecodeError because raw image bytes cannot be decoded as UTF-8 text',
            'FileNotFoundError',
            'It succeeds without issues'
        ],
        correct: 'UnicodeDecodeError because raw image bytes cannot be decoded as UTF-8 text',
        explanation: 'Binary files (images, audio, compiled binaries) contain arbitrary byte sequences that do not conform to UTF-8 text encoding rules. You must open with "rb" mode.'
    },
    {
        code: `import pickle\n# pickle.dump(obj, f)`,
        question: 'What is the primary difference between json and pickle in Python?',
        options: [
            'json is binary, pickle is plain text',
            'pickle is Python-specific and serializes almost any object; json is human-readable and universal across languages',
            'pickle is slower than json for all data types',
            'json requires mode "wb", pickle requires mode "w"'
        ],
        correct: 'pickle is Python-specific and serializes almost any object; json is human-readable and universal across languages',
        explanation: 'pickle is a Python-native binary serialization protocol that can store custom classes and complex object graphs, whereas JSON is a lightweight text standard supported across all programming languages.'
    }
];

// ── Detailed Hex Byte Definitions with Opcode Meanings ───────────────────────
const SAMPLE_HEX_BYTES = [
    { offset: '0000', hex: ['80', '04', '95', '1c', '00', '00', '00', '00'], ascii: '€...\\x1c....', desc: 'Pickle Protocol 4 Header' },
    { offset: '0008', hex: ['00', '00', '7d', '94', '8c', '04', '6e', '61'], ascii: '..}..na', desc: 'EMPTY_DICT & "name" key' },
    { offset: '0010', hex: ['6d', '65', '94', '8c', '04', '41', '73', '68'], ascii: 'me...Ash', desc: 'SHORT_BINUNICODE "Asha"' },
    { offset: '0018', hex: ['61', '94', '8c', '05', '73', '63', '6f', '72'], ascii: 'a...scor', desc: '"score" key tag' },
    { offset: '0020', hex: ['65', '94', '4b', '5f', '73', '2e'], ascii: 'e.K_s.', desc: 'BININT1 95 (0x5f), STOP' }
];

const OPCODE_LOOKUP = {
    '80': { name: 'PROTO', desc: 'Specifies Pickle protocol version (Protocol 4)' },
    '04': { name: 'VERSION 4', desc: 'Version parameter for Python 3.4+ 64-bit framing' },
    '95': { name: 'FRAME', desc: '64-bit frame length header for efficient streaming' },
    '7d': { name: 'EMPTY_DICT', desc: 'Pushes an empty dict {} onto the pickle evaluation stack' },
    '8c': { name: 'SHORT_BINUNICODE', desc: 'Pushes a short UTF-8 string (< 256 bytes) to the stack' },
    '94': { name: 'MEMOIZE', desc: 'Stores top stack item into memo table for deduplication' },
    '4b': { name: 'BININT1', desc: 'Pushes a 1-byte unsigned integer (e.g., 95)' },
    '5f': { name: '95', desc: 'Hex representation of integer value 95 (0x5F == 95)' },
    '73': { name: 'SETITEM', desc: 'Adds key/value pair into dictionary on stack' },
    '2e': { name: 'STOP', desc: 'Signals end of pickle byte stream. Reconstructed object returned.' }
};

// ── Step Execution Engine ────────────────────────────────────────────────────
function executePickleCode(codeStr, studentData) {
    const steps = [];
    const outputs = [];

    const addStep = (lineNum, action, detail, heapObject, byteStream, memoryAddress, outputsSnapshot) => {
        steps.push({
            lineNum,
            action,
            detail,
            heapObject: heapObject ? { ...heapObject } : null,
            byteStream: [...byteStream],
            memoryAddress,
            outputs: [...outputsSnapshot]
        });
    };

    if (codeStr.includes('bytes([72, 101, 108, 108, 111])')) {
        const byteArr = [72, 101, 108, 108, 111];
        addStep(2, 'def_bytes', 'Created raw immutable bytes buffer b"Hello" (ASCII 72, 101, 108, 108, 111)', null, byteArr, '0x7ffe01', outputs);
        addStep(5, 'open_wb', 'Opened data.bin in "wb" (write binary) mode', null, byteArr, '0x7ffe01', outputs);
        addStep(6, 'write_bytes', 'f.write(data) wrote 5 raw bytes directly to disk sector without UTF-8 encoding', null, byteArr, '0x7ffe01', outputs);
        addStep(9, 'open_rb', 'Opened data.bin in "rb" (read binary) mode', null, byteArr, '0x7ffe01', outputs);

        outputs.push("Read bytes: b'Hello'");
        addStep(11, 'print', 'f.read() returned raw bytes object b"Hello"', null, byteArr, '0x7ffe01', outputs);
    } else if (codeStr.includes('pickle.dump')) {
        addStep(1, 'import', 'Imported standard pickle module', null, [], '0x0', outputs);

        addStep(4, 'def_obj', `Allocated Python Dictionary on Heap at address 0x7ffeea40`, studentData, [], '0x7ffeea40', outputs);
        addStep(11, 'open', 'Opened student.pkl in mode "wb" (Write Binary)', studentData, [], '0x7ffeea40', outputs);

        const pickleHex = [0x80, 0x04, 0x95, 0x1c, 0x7d, 0x8c, 0x04, 0x41];
        addStep(12, 'pickle_dump', 'pickle.dump() serialized live heap object into binary byte stream (36 bytes on disk)', studentData, pickleHex, '0x7ffeea40', outputs);

        outputs.push('Pickle binary generated.');
        addStep(14, 'print', 'student.pkl successfully written to disk', studentData, pickleHex, '0x7ffeea40', outputs);
    } else if (codeStr.includes('pickle.load')) {
        addStep(1, 'import', 'Imported pickle module', null, [], '0x0', outputs);
        addStep(4, 'open_rb', 'Opened student.pkl in "rb" (read binary) mode', null, [0x80, 0x04], '0x0', outputs);

        const newHeapAddr = '0x7ffedc92';
        addStep(5, 'load', `pickle.load() reconstructed binary stream into fresh heap object at ${newHeapAddr}`, studentData, [0x80, 0x04], newHeapAddr, outputs);

        outputs.push(`Restored Name: ${studentData.name}`);
        addStep(7, 'print', `Accessed restored["name"] -> "${studentData.name}"`, studentData, [], newHeapAddr, outputs);

        outputs.push(`Restored Score: ${studentData.score}`);
        addStep(8, 'print', `Accessed restored["score"] -> ${studentData.score}`, studentData, [], newHeapAddr, outputs);

        outputs.push("Object Type: dict");
        addStep(9, 'print', 'Verified type(restored) is dict', studentData, [], newHeapAddr, outputs);
    } else if (codeStr.includes('payload')) {
        addStep(1, 'import', 'Imported pickle module', null, [], '0x0', outputs);
        addStep(5, 'payload', 'Defined raw binary pickle payload byte literal', null, [0x80, 0x04, 0x95], '0x0', outputs);

        const obj = { name: studentData.name };
        addStep(7, 'loads', 'pickle.loads() deserialized payload safely in sandbox', obj, [], '0x7ffebc10', outputs);

        outputs.push(`Safely verified object: {'name': '${studentData.name}'}`);
        addStep(8, 'print', 'Verified deserialized object structure', obj, [], '0x7ffebc10', outputs);
    } else {
        addStep(1, 'run', 'Executing binary file processing', null, [72, 101, 108, 108, 111], '0x7ffea1', outputs);
        outputs.push('Binary operations completed.');
        addStep(3, 'done', 'Done', null, [], '0x0', outputs);
    }

    return { steps, finalOutputs: outputs };
}

export default function PickleBinaryVisualizer() {
    const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
    const [code, setCode] = useState(EXAMPLES[0].code);

    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const speedMs = speed === 'slow' ? 1600 : speed === 'normal' ? 900 : 400;

    const timerRef = useRef(null);

    // ── Interactive State ──
    const [studentObject, setStudentObject] = useState({
        name: 'Asha',
        score: 95,
        passed: true
    });

    const [selectedHexByte, setSelectedHexByte] = useState('80');
    const [customAsciiInput, setCustomAsciiInput] = useState('HiGen');
    const [interactiveHeapAddress, setInteractiveHeapAddress] = useState('0x7ffeea40');
    const [teleportActive, setTeleportActive] = useState(false);

    // Challenge state
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleSelectExample = (id) => {
        const found = EXAMPLES.find(e => e.id === id);
        if (!found) return;
        setSelectedExampleId(id);
        setCode(found.code);
        resetExecution();
    };

    const resetExecution = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setExecutionState(null);
        setCurrentStepIdx(-1);
        setTeleportActive(false);
    };

    const runCode = () => {
        resetExecution();
        const state = executePickleCode(code, studentObject);
        setExecutionState(state);
        if (state.steps.length === 0) return;
        setCurrentStepIdx(0);
        setIsRunning(true);
    };

    useEffect(() => {
        if (!isRunning || !executionState) return;
        if (currentStepIdx >= executionState.steps.length - 1) {
            setIsRunning(false);
            return;
        }
        timerRef.current = setTimeout(() => {
            setCurrentStepIdx(prev => prev + 1);
        }, speedMs);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isRunning, currentStepIdx, executionState, speedMs]);

    const stepForward = () => {
        if (!executionState) {
            const state = executePickleCode(code, studentObject);
            setExecutionState(state);
            setCurrentStepIdx(0);
            return;
        }
        if (currentStepIdx < executionState.steps.length - 1) {
            setCurrentStepIdx(prev => prev + 1);
        }
    };

    const currentStep = executionState?.steps[currentStepIdx] || null;
    const currentLineNum = currentStep?.lineNum || null;
    const isPlayback = executionState !== null;

    const displayObject = isPlayback ? (currentStep?.heapObject || studentObject) : studentObject;
    const displayAddress = isPlayback ? (currentStep?.memoryAddress || interactiveHeapAddress) : interactiveHeapAddress;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    // ── Interactive Actions ──
    const handleTriggerSerialize = () => {
        resetExecution();
        setTeleportActive(true);
        setTimeout(() => setTeleportActive(false), 1200);
    };

    const handleTriggerDeserialize = () => {
        resetExecution();
        const newAddr = `0x7ffe${Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')}`;
        setInteractiveHeapAddress(newAddr);
        setTeleportActive(true);
        setTimeout(() => setTeleportActive(false), 1200);
    };

    const handleUpdateScore = (val) => {
        setStudentObject(prev => ({
            ...prev,
            score: Number(val)
        }));
    };

    const handleUpdateName = (val) => {
        setStudentObject(prev => ({
            ...prev,
            name: val
        }));
    };

    // Calculate binary bits for selected hex byte
    const decVal = parseInt(selectedHexByte, 16) || 0;
    const binBits = decVal.toString(2).padStart(8, '0').split('');
    const opcodeInfo = OPCODE_LOOKUP[selectedHexByte.toLowerCase()] || { name: 'DATA_BYTE', desc: `Raw byte literal value ${decVal} (0x${selectedHexByte.toUpperCase()})` };

    const customBytes = customAsciiInput.split('').map(c => c.charCodeAt(0));

    return (
        <div className="space-y-4">
            
            {/* ── 1. Top Header Card with Presets ── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 font-mono">
                                Topic 5.4
                            </span>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Binary Files & Pickle Object Serialization
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Click individual hex bytes to inspect 8-bit opcodes, teleport objects between heap and disk, or test raw ASCII byte conversion.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border bg-slate-900 text-cyan-400 border-slate-800 shadow-xs">
                            <Binary className="w-3.5 h-3.5" />
                            <span>Protocol: Pickle v4 Binary</span>
                        </span>
                    </div>
                </div>

                {/* Presets Segmented Tabs */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-start gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
                        Presets:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 shrink-0">
                        {EXAMPLES.map((ex, i) => {
                            const isSelected = selectedExampleId === ex.id;
                            return (
                                <button
                                    key={ex.id}
                                    type="button"
                                    onClick={() => handleSelectExample(ex.id)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                        isSelected
                                            ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                    }`}
                                >
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`}>
                                        {i + 1}.
                                    </span>
                                    <span>{ex.label.replace(/^\d+\.\s*/, '')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── 2. Main Two-Column View ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                
                {/* ── Left Column: Interactive Code Editor ── */}
                <div className="lg:col-span-5">
                    <InteractiveEditorWithArrow
                        code={code}
                        setCode={setCode}
                        currentLineNum={currentLineNum}
                        transitionInfo={transitionInfo}
                        isRunning={isRunning}
                        runCode={runCode}
                        stepForward={stepForward}
                        resetExecution={resetExecution}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={currentStep ? currentStep.detail : 'Ready to execute'}
                        stepCounterText={executionState ? `Step ${currentStepIdx + 1}/${executionState.steps.length}` : 'Idle'}
                        terminalLines={terminalLines}
                        badgeText="Pickle Engine"
                        fileName="binary_pickle.py"
                        accentColor="#0891b2"
                    />
                </div>

                {/* ── Right Column: Hex Editor Matrix & Object Serialization Machine ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Security Alert Banner */}
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                            <span className="font-bold text-amber-900 block mb-0.5">Pickle Security Rule</span>
                            <span className="text-amber-800 leading-relaxed">
                                Never unpickle data received from untrusted network sources! Pickle byte streams can execute arbitrary code upon deserialization. For public APIs, prefer JSON.
                            </span>
                        </div>
                    </div>

                    {/* Serialization Machine: Heap Object ◄──► Pickle Byte Stream */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-cyan-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Object Teleporter: Python Heap Memory ◄──► Disk Byte Stream
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleTriggerSerialize}
                                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 cursor-pointer flex items-center gap-1 shadow-2xs"
                                >
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                    <span>pickle.dump()</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleTriggerDeserialize}
                                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 cursor-pointer flex items-center gap-1 shadow-2xs"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>pickle.load()</span>
                                </button>
                            </div>
                        </div>

                        {/* Interactive Dual Cards: Python RAM Heap vs Persistent Disk File */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            
                            {/* Card A: Python Object in Heap Memory (Interactive Edit) */}
                            <div className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                                teleportActive ? 'bg-cyan-50 border-cyan-400 ring-2 ring-cyan-300' : 'bg-slate-50 border-slate-200/80'
                            }`}>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                        <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                                        <span>Python Heap Object</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-cyan-700 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                        id: {displayAddress}
                                    </span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">"name":</span>
                                        <input
                                            type="text"
                                            value={displayObject.name || ''}
                                            onChange={(e) => handleUpdateName(e.target.value)}
                                            className="px-1.5 py-0.5 text-xs border border-slate-200 rounded text-right w-24 outline-none focus:border-cyan-500 font-bold text-cyan-900"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">"score":</span>
                                        <input
                                            type="number"
                                            value={displayObject.score || 0}
                                            onChange={(e) => handleUpdateScore(e.target.value)}
                                            className="px-1.5 py-0.5 text-xs border border-slate-200 rounded text-right w-20 outline-none focus:border-cyan-500 font-bold text-cyan-900"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-slate-500">"passed":</span>
                                        <span className="font-bold text-emerald-600">{String(displayObject.passed)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card B: Binary File on Disk */}
                            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                                        <HardDrive className="w-3.5 h-3.5" />
                                        <span>Binary File on Disk</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">student.pkl (36B)</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-cyan-300 min-h-[72px] flex flex-col justify-center">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${teleportActive ? 'bg-amber-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
                                        <span>Pickle v4 Byte Stream:</span>
                                    </div>
                                    <p className="text-slate-400 text-[10px] mt-1 break-all">
                                        \x80\x04\x95\x1c\x00\x00\x00\x00\x00\x00\x00&#125;\x94\x8c\x04name...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Hex Dump Matrix */}
                        <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                <span>Real Hex Dump Inspector (Click Any Byte To Inspect Opcode):</span>
                                <span className="text-cyan-600 font-mono text-[10px]">Selected: 0x{selectedHexByte}</span>
                            </span>

                            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs border border-slate-800 overflow-x-auto select-none">
                                <div className="space-y-1.5 min-w-[420px]">
                                    <div className="text-slate-500 text-[10px] pb-1 border-b border-slate-800/80 flex items-center justify-between">
                                        <span>OFFSET &nbsp; &nbsp; 00 01 02 03 04 05 06 07</span>
                                        <span>ASCII TRANSLATION</span>
                                    </div>

                                    {SAMPLE_HEX_BYTES.map((row, rIdx) => (
                                        <div key={rIdx} className="flex items-center justify-between text-[11px] hover:bg-slate-900/60 px-1 rounded transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-500 font-bold">{row.offset}:</span>
                                                <div className="flex items-center gap-1.5 text-cyan-300">
                                                    {row.hex.map((b, bIdx) => {
                                                        const isSel = selectedHexByte.toLowerCase() === b.toLowerCase();
                                                        return (
                                                            <button
                                                                key={bIdx}
                                                                type="button"
                                                                onClick={() => setSelectedHexByte(b)}
                                                                className={`px-1 py-0.5 rounded cursor-pointer transition-all ${
                                                                    isSel
                                                                        ? 'bg-cyan-400 text-slate-950 font-black shadow-xs ring-1 ring-cyan-200 scale-105'
                                                                        : 'hover:bg-slate-800 hover:text-white'
                                                                }`}
                                                            >
                                                                {b}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <span className="text-emerald-400 font-bold pl-4">{row.ascii}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active Opcode Inspector Card with 8-Bit Binary Switchboard */}
                            <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs space-y-2 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-cyan-950 flex items-center gap-1.5">
                                        <Radio className="w-3.5 h-3.5 text-cyan-700" />
                                        <span>Active Byte: <strong>0x{selectedHexByte.toUpperCase()}</strong> ({opcodeInfo.name})</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-cyan-800">
                                        Decimal: <strong>{decVal}</strong> | ASCII: <strong>'{decVal >= 32 && decVal <= 126 ? String.fromCharCode(decVal) : '·'}'</strong>
                                    </span>
                                </div>
                                <p className="text-cyan-900 text-[11px]">{opcodeInfo.desc}</p>

                                {/* 8-Bit Binary Switches */}
                                <div className="flex items-center gap-1 pt-1 font-mono text-[10px]">
                                    <span className="text-slate-500 mr-1">8 Bits:</span>
                                    {binBits.map((bit, bitIdx) => (
                                        <span
                                            key={bitIdx}
                                            className={`px-1.5 py-0.5 rounded font-bold ${
                                                bit === '1' ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-600'
                                            }`}
                                        >
                                            {bit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Interactive Live Byte Sandbox ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Binary className="w-4 h-4 text-cyan-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Interactive Byte Converter (ASCII ◄──► Bytes)
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">Type to convert live</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customAsciiInput}
                                onChange={(e) => setCustomAsciiInput(e.target.value)}
                                placeholder="Type text to view raw byte conversion..."
                                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-cyan-500 font-mono"
                                maxLength={16}
                            />
                        </div>

                        <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs space-y-2 border border-slate-800">
                            <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                <span>Python bytes() representation:</span>
                                <span className="text-cyan-400 font-bold">b"{customAsciiInput}"</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                {customBytes.map((num, i) => (
                                    <div key={i} className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center min-w-[46px]">
                                        <span className="text-slate-400 text-[9px] block">'{customAsciiInput[i]}'</span>
                                        <span className="text-cyan-300 font-bold block">{num}</span>
                                        <span className="text-slate-500 text-[9px] block">0x{num.toString(16).toUpperCase()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Interactive Quiz / Challenge Section ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-cyan-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Concept Check #{challengeIdx + 1}
                                </h3>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">Binary & Serialization</span>
                        </div>

                        <div className="p-3 bg-slate-900 rounded-lg text-slate-100 font-mono text-xs whitespace-pre">
                            {CHALLENGES[challengeIdx].code}
                        </div>

                        <p className="text-xs font-semibold text-slate-800">
                            {CHALLENGES[challengeIdx].question}
                        </p>

                        <div className="space-y-1.5">
                            {CHALLENGES[challengeIdx].options.map((opt, idx) => {
                                const isChosen = selectedAnswer === opt;
                                const isCorrect = opt === CHALLENGES[challengeIdx].correct;
                                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                                if (showExplanation) {
                                    if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                                    else if (isChosen) btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAnswer(opt);
                                            setShowExplanation(true);
                                        }}
                                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                                    >
                                        <span>{opt}</span>
                                        {showExplanation && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                        {showExplanation && isChosen && !isCorrect && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 leading-relaxed animate-fadeIn">
                                <span className="font-bold block mb-0.5">Explanation:</span>
                                {CHALLENGES[challengeIdx].explanation}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
