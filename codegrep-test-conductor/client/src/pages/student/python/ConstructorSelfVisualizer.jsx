import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Layers, Zap, ArrowRight, ArrowDown, User, BookOpen,
    CheckCircle2, Sparkles, Code2, Hash, Cpu, Sliders, Box,
    RefreshCw, FileText
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 2: self, Constructors (__init__) & __str__
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'self-init',
        label: 'self & __init__ Constructor Assembly Line',
        code: `class Student:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks

    def display(self):
        return f"{self.name}: {self.marks} marks"

s1 = Student("Asha", 92)
s2 = Student("Rohan", 85)

print(s1.display())
print(s2.display())`,
        steps: [
            {
                lineNum: 1,
                action: 'define_class',
                detail: 'class Student: Blueprint defined with __init__ & display',
                explanation: 'Class Student is registered. It provides the __init__ constructor blueprint with parameters (self, name, marks).',
                assemblyStage: 'idle',
                selfTarget: null,
                instances: {},
                variables: { Student: '<class Student>' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'allocate_s1',
                detail: 'Stage 1: Python allocates empty memory frame 0x4a01 for s1',
                explanation: 'Before __init__ runs, Python creates a raw empty object at 0x4a01 and passes it as the first argument "self".',
                assemblyStage: 'allocating',
                selfTarget: '0x4a01',
                instances: {
                    '0x4a01': { id: '0x4a01', name: null, marks: null, label: 's1', stage: 'Raw Empty Slot' }
                },
                variables: { Student: '<class Student>' },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'bind_name',
                detail: 'Stage 2: self.name = "Asha" (Laser pointer binds name)',
                explanation: 'self points to 0x4a01. The value "Asha" is injected into self.__dict__["name"].',
                assemblyStage: 'binding_name',
                selfTarget: '0x4a01',
                instances: {
                    '0x4a01': { id: '0x4a01', name: '"Asha"', marks: null, label: 's1', stage: 'Binding Attributes' }
                },
                variables: { Student: '<class Student>', self: '<Student 0x4a01>', name: '"Asha"' },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'bind_marks',
                detail: 'Stage 3: self.marks = 92 (Assembly complete for s1)',
                explanation: '92 is injected into self.__dict__["marks"]. Object s1 is fully assembled and returned to the caller.',
                assemblyStage: 'assembled',
                selfTarget: '0x4a01',
                instances: {
                    '0x4a01': { id: '0x4a01', name: '"Asha"', marks: 92, label: 's1', stage: 'Fully Assembled ✓' }
                },
                variables: { Student: '<class Student>', s1: '<Student 0x4a01>' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'allocate_s2',
                detail: 's2 = Student("Rohan", 85) — New instance allocation at 0x4a02',
                explanation: 'A second independent instance is allocated. "self" now swings over to point to 0x4a02.',
                assemblyStage: 'allocating',
                selfTarget: '0x4a02',
                instances: {
                    '0x4a01': { id: '0x4a01', name: '"Asha"', marks: 92, label: 's1', stage: 'Complete' },
                    '0x4a02': { id: '0x4a02', name: null, marks: null, label: 's2', stage: 'Raw Empty Slot' }
                },
                variables: { Student: '<class Student>', s1: '<Student 0x4a01>' },
                outputs: []
            },
            {
                lineNum: 3,
                action: 'bind_name_s2',
                detail: 'self.name = "Rohan" (Laser pointer binds name for s2)',
                explanation: 'self refers to 0x4a02. Injects "Rohan" into s2.',
                assemblyStage: 'binding_name',
                selfTarget: '0x4a02',
                instances: {
                    '0x4a01': { id: '0x4a01', name: '"Asha"', marks: 92, label: 's1', stage: 'Complete' },
                    '0x4a02': { id: '0x4a02', name: '"Rohan"', marks: null, label: 's2', stage: 'Binding Attributes' }
                },
                variables: { Student: '<class Student>', s1: '<Student 0x4a01>', self: '<Student 0x4a02>' },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'bind_marks_s2',
                detail: 'self.marks = 85 (Assembly complete for s2)',
                explanation: 'Injects 85 into s2. Constructor finishes and binds to s2.',
                assemblyStage: 'assembled',
                selfTarget: '0x4a02',
                instances: {
                    '0x4a01': { id: '0x4a01', name: '"Asha"', marks: 92, label: 's1', stage: 'Complete' },
                    '0x4a02': { id: '0x4a02', name: '"Rohan"', marks: 85, label: 's2', stage: 'Fully Assembled ✓' }
                },
                variables: { Student: '<class Student>', s1: '<Student 0x4a01>', s2: '<Student 0x4a02>' },
                outputs: []
            },
            {
                lineNum: 12,
                action: 'call_display_s1',
                detail: 's1.display() → Dispatches Student.display(self=s1)',
                explanation: 's1 invokes display. Inside the method, self points to s1 (0x4a01), reading its name and marks.',
                assemblyStage: 'method_call',
                selfTarget: '0x4a01',
                instances: {
                    '0x4a01': { id: '0x4a01', name: '"Asha"', marks: 92, label: 's1', stage: 'Executing display()' },
                    '0x4a02': { id: '0x4a02', name: '"Rohan"', marks: 85, label: 's2', stage: 'Idle' }
                },
                variables: { s1: '<Student 0x4a01>', s2: '<Student 0x4a02>' },
                outputs: ['Asha: 92 marks']
            },
            {
                lineNum: 13,
                action: 'call_display_s2',
                detail: 's2.display() → Dispatches Student.display(self=s2)',
                explanation: 's2 invokes display. self points to s2 (0x4a02), reading its name and marks.',
                assemblyStage: 'method_call',
                selfTarget: '0x4a02',
                instances: {
                    '0x4a01': { id: '0x4a01', name: '"Asha"', marks: 92, label: 's1', stage: 'Idle' },
                    '0x4a02': { id: '0x4a02', name: '"Rohan"', marks: 85, label: 's2', stage: 'Executing display()' }
                },
                variables: { s1: '<Student 0x4a01>', s2: '<Student 0x4a02>' },
                outputs: ['Asha: 92 marks', 'Rohan: 85 marks']
            },
        ]
    },
    {
        id: 'str-dunder',
        label: '__str__ Human-Readable Representation Converter',
        code: `class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        return f"'{self.title}' by {self.author}"

b = Book("Fluent Python", "Luciano Ramalho")

# Without __str__: <Book object at 0x8b12> (ugly hex)
# With __str__: Clean formatted text output!
print(str(b))
print(b)`,
        steps: [
            {
                lineNum: 1,
                action: 'define_class',
                detail: 'class Book defined with __init__ and __str__',
                explanation: '__str__ is a special dunder method that converts objects to human-friendly strings for print() and str().',
                dunderActive: false,
                variables: { Book: '<class Book>' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'init_book',
                detail: 'b = Book("Fluent Python", "Luciano Ramalho")',
                explanation: 'Allocates book instance at 0x8b12 with title and author.',
                dunderActive: false,
                variables: { Book: '<class Book>', b: '<Book at 0x8b12>' },
                outputs: []
            },
            {
                lineNum: 13,
                action: 'call_str',
                detail: 'str(b) triggers b.__str__()',
                explanation: 'Python automatically routes str(b) to b.__str__(), returning formatted string.',
                dunderActive: true,
                variables: { Book: '<class Book>', b: '<Book at 0x8b12>' },
                outputs: ["'Fluent Python' by Luciano Ramalho"]
            },
            {
                lineNum: 14,
                action: 'print_b',
                detail: 'print(b) automatically routes to b.__str__()',
                explanation: 'print() always calls str() under the hood, activating __str__.',
                dunderActive: true,
                variables: { Book: '<class Book>', b: '<Book at 0x8b12>' },
                outputs: ["'Fluent Python' by Luciano Ramalho", "'Fluent Python' by Luciano Ramalho"]
            },
        ]
    }
];

export default function ConstructorSelfVisualizer() {
    const [selectedExample, setSelectedExample] = useState(0);
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [steps, setSteps] = useState(EXAMPLES[0].steps);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const intervalRef = useRef(null);

    const speedMs = { slow: 1800, normal: 1000, fast: 400 };

    const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;
    const currentLineNum = currentStepData?.lineNum ?? null;
    const transitionInfo = getStepTransitionInfo(steps, currentStep);
    const terminalLines = currentStepData?.outputs ?? [];

    const loadExample = useCallback((idx) => {
        clearInterval(intervalRef.current);
        setSelectedExample(idx);
        setCode(EXAMPLES[idx].code);
        setSteps(EXAMPLES[idx].steps);
        setCurrentStep(-1);
        setIsRunning(false);
    }, []);

    useEffect(() => {
        clearInterval(intervalRef.current);
        if (!isRunning) return;
        intervalRef.current = setInterval(() => {
            setCurrentStep(prev => {
                if (prev + 1 >= steps.length) {
                    setIsRunning(false);
                    clearInterval(intervalRef.current);
                    return prev;
                }
                return prev + 1;
            });
        }, speedMs[speed]);
        return () => clearInterval(intervalRef.current);
    }, [isRunning, speed, steps.length]);

    const runCode = () => {
        setCurrentStep(0);
        setIsRunning(true);
    };

    const stepForward = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const resetExecution = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setCurrentStep(-1);
    };

    const statusText = currentStepData
        ? `${currentStepData.action.toUpperCase()}: ${currentStepData.detail}`
        : 'Ready — press Run Code or Step Forward';
    const stepCounterText = currentStep >= 0
        ? `Step ${currentStep + 1} / ${steps.length}`
        : `Ready (0 / ${steps.length})`;

    return (
        <div className="space-y-5 animate-fadeIn">
            {/* Top Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                            <Layers className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                self, Constructors (__init__) &amp; __str__
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {EXAMPLES.map((ex, idx) => (
                            <button
                                key={ex.id}
                                onClick={() => loadExample(idx)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedExample === idx
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                }`}
                            >
                                <span>{idx + 1}. {ex.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column: Code Editor */}
                <div className="lg:col-span-5 space-y-4">
                    <InteractiveEditorWithArrow
                        code={code}
                        setCode={c => { setCode(c); resetExecution(); }}
                        currentLineNum={currentLineNum}
                        transitionInfo={transitionInfo}
                        isRunning={isRunning}
                        runCode={runCode}
                        stepForward={stepForward}
                        resetExecution={resetExecution}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={statusText}
                        stepCounterText={stepCounterText}
                        terminalLines={terminalLines}
                        badgeText="Constructor Engine"
                        fileName="constructors.py"
                        accentColor="#9333ea"
                    />

                    {/* Step Explanation Card */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-bold text-slate-800 mb-0.5">
                                        Line {currentStepData.lineNum} — <span className="uppercase text-slate-500 font-mono">{currentStepData.action}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">{currentStepData.explanation}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Visual Box Diagrammatic Assembly Line */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {selectedExample === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                        <Zap className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        The 3-Stage Constructor Assembly Line
                                    </h3>
                                </div>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                    currentStepData?.selfTarget
                                        ? 'bg-purple-100 text-purple-800 border border-purple-300 animate-pulse'
                                        : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {currentStepData?.selfTarget ? `self → ${currentStepData.selfTarget}` : 'self: waiting'}
                                </span>
                            </div>

                            {/* 3-Stage Box Sequence Diagram */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Stage 1 Box */}
                                <div className={`p-3.5 rounded-xl border-2 transition-all space-y-1.5 ${
                                    currentStepData?.assemblyStage === 'allocating'
                                        ? 'bg-purple-50 border-purple-500 shadow-md ring-2 ring-purple-200'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Step 1: Allocation</div>
                                    <div className="text-xs font-bold text-slate-900">1. Allocate Raw Slot</div>
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                        Python creates an empty memory slot at a unique hex address on the heap.
                                    </p>
                                </div>

                                {/* Stage 2 Box */}
                                <div className={`p-3.5 rounded-xl border-2 transition-all space-y-1.5 ${
                                    currentStepData?.assemblyStage === 'binding_name'
                                        ? 'bg-purple-50 border-purple-500 shadow-md ring-2 ring-purple-200'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="text-[10px] font-mono uppercase font-bold text-purple-600">Step 2: __init__ Run</div>
                                    <div className="text-xs font-bold text-purple-900">2. Laser "self" Pointer</div>
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                        <code className="text-purple-700 font-bold font-mono">self</code> points to the slot. Arguments stamp into <code className="font-mono">self.attr</code>.
                                    </p>
                                </div>

                                {/* Stage 3 Box */}
                                <div className={`p-3.5 rounded-xl border-2 transition-all space-y-1.5 ${
                                    currentStepData?.assemblyStage === 'assembled' || currentStepData?.assemblyStage === 'method_call'
                                        ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="text-[10px] font-mono uppercase font-bold text-emerald-600">Step 3: Ready</div>
                                    <div className="text-xs font-bold text-emerald-900">3. Delivered to Caller</div>
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                        Fully populated instance is returned and bound to reference <code className="font-mono font-bold">s1</code>.
                                    </p>
                                </div>
                            </div>

                            {/* Live Memory Slots with Visual self Pointer */}
                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white space-y-3">
                                <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                                    <span className="flex items-center gap-1.5">
                                        <Zap className="w-4 h-4 text-purple-400" />
                                        LIVE HEAP SLOTS &amp; "self" POINTER
                                    </span>
                                    <span className="text-[10px] text-slate-400">Instance Attribute Slots</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {['0x4a01', '0x4a02'].map(addr => {
                                        const inst = currentStepData?.instances?.[addr];
                                        const isTarget = currentStepData?.selfTarget === addr;
                                        return (
                                            <div
                                                key={addr}
                                                className={`p-3 rounded-lg border-2 transition-all space-y-2 ${
                                                    isTarget
                                                        ? 'bg-purple-950/80 border-purple-400 shadow-lg shadow-purple-500/20'
                                                        : inst
                                                        ? 'bg-slate-950 border-slate-700'
                                                        : 'bg-slate-950/40 border-dashed border-slate-800 opacity-40'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between text-xs font-mono">
                                                    <span className="font-bold text-purple-300">
                                                        {inst ? inst.label : addr === '0x4a01' ? 's1' : 's2'} ({addr})
                                                    </span>
                                                    {isTarget && (
                                                        <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded font-bold animate-pulse">
                                                            ← self POINTS HERE
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="p-2 bg-slate-900 rounded border border-slate-800 space-y-1 font-mono text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">self.name:</span>
                                                        <span className={inst?.name ? 'text-cyan-300 font-bold' : 'text-slate-600 italic'}>
                                                            {inst?.name ?? 'empty slot'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">self.marks:</span>
                                                        <span className={inst?.marks ? 'text-emerald-400 font-bold' : 'text-slate-600 italic'}>
                                                            {inst?.marks ?? 'empty slot'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ── SCENARIO 2: __str__ DUNDER CONVERTER BOX ── */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                        <BookOpen className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        __str__ Dunder String Representation Transformer Box
                                    </h3>
                                </div>
                            </div>

                            {/* Side-by-Side Comparison Box */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Without __str__ */}
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-2">
                                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                        <span>WITHOUT __str__</span>
                                        <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">Default Python</span>
                                    </div>
                                    <div className="p-3 bg-slate-900 text-slate-400 font-mono text-xs rounded border border-slate-800">
                                        &lt;Book object at 0x8b12&gt;
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                        Prints raw memory pointer address. Not friendly for users or logging.
                                    </p>
                                </div>

                                {/* With __str__ */}
                                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-400 space-y-2 shadow-xs">
                                    <div className="text-xs font-bold text-purple-900 flex items-center justify-between">
                                        <span>WITH __str__ IMPLEMENTED</span>
                                        <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded font-bold">Clean Output</span>
                                    </div>
                                    <div className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded border border-purple-300 font-bold">
                                        'Fluent Python' by Luciano Ramalho
                                    </div>
                                    <p className="text-[11px] text-purple-700 leading-snug">
                                        Automatically transforms object into clear, formatted human text whenever passed to <code className="font-mono bg-purple-100 px-1 rounded">print()</code> or <code className="font-mono bg-purple-100 px-1 rounded">str()</code>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
