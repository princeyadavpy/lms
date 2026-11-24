import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Hash, AlertTriangle, Layers, ArrowRight, ArrowDown, ArrowUp, Zap,
    Shield, Code2, Info, RefreshCw, Sparkles, Database, Building2, Radio
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 3: Instance vs Class Variables & Namespaces
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'shared-class-var',
        label: 'Shared Class Variable Tower vs Instance Pods',
        code: `class Employee:
    company = "HiGen Labs"  # Shared Class Variable

    def __init__(self, name, salary):
        self.name = name      # Instance variable
        self.salary = salary  # Instance variable

e1 = Employee("Dev", 85000)
e2 = Employee("Priya", 92000)

print("e1 company:", e1.company)
print("e2 company:", e2.company)`,
        steps: [
            {
                lineNum: 1,
                action: 'define_class',
                detail: 'class Employee defined: company = "HiGen Labs" registered in Central Class Tower',
                explanation: 'Class variable "company" lives inside the shared Employee.__dict__ Central Tower. Both e1 and e2 can see it.',
                classDict: { company: '"HiGen Labs"' },
                instances: {},
                activeLookup: null,
                variables: { Employee: '<class Employee>' },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'create_e1',
                detail: 'e1 = Employee("Dev", 85000): Instance Pod #1 created',
                explanation: 'Instance Pod e1 has its own local namespace storing name="Dev" and salary=85000.',
                classDict: { company: '"HiGen Labs"' },
                instances: {
                    e1: { name: '"Dev"', salary: '85000' }
                },
                activeLookup: null,
                variables: { Employee: '<class Employee>', e1: '<Employee at 0x11>' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'create_e2',
                detail: 'e2 = Employee("Priya", 92000): Instance Pod #2 created',
                explanation: 'Instance Pod e2 has separate local namespace storing name="Priya" and salary=92000.',
                classDict: { company: '"HiGen Labs"' },
                instances: {
                    e1: { name: '"Dev"', salary: '85000' },
                    e2: { name: '"Priya"', salary: '92000' }
                },
                activeLookup: null,
                variables: { Employee: '<class Employee>', e1: '<Employee at 0x11>', e2: '<Employee at 0x22>' },
                outputs: []
            },
            {
                lineNum: 11,
                action: 'lookup_e1',
                detail: 'e1.company: Lookup checks e1 Pod (miss) → Beams up to Central Tower (hit!)',
                explanation: 'Since "company" is not inside e1\'s local pod, lookup ascends the inheritance arrow to Central Tower Employee.__dict__ and finds "HiGen Labs".',
                classDict: { company: '"HiGen Labs"' },
                instances: {
                    e1: { name: '"Dev"', salary: '85000' },
                    e2: { name: '"Priya"', salary: '92000' }
                },
                activeLookup: { target: 'e1', attr: 'company', foundIn: 'Central Tower: Employee.__dict__', value: 'HiGen Labs' },
                variables: { Employee: '<class Employee>', e1: '<Employee at 0x11>', e2: '<Employee at 0x22>' },
                outputs: ['e1 company: HiGen Labs']
            },
            {
                lineNum: 12,
                action: 'lookup_e2',
                detail: 'e2.company: Checks e2 Pod (miss) → Beams up to Central Tower (hit!)',
                explanation: 'e2 also borrows the single shared class variable from the Central Tower.',
                classDict: { company: '"HiGen Labs"' },
                instances: {
                    e1: { name: '"Dev"', salary: '85000' },
                    e2: { name: '"Priya"', salary: '92000' }
                },
                activeLookup: { target: 'e2', attr: 'company', foundIn: 'Central Tower: Employee.__dict__', value: 'HiGen Labs' },
                variables: { Employee: '<class Employee>', e1: '<Employee at 0x11>', e2: '<Employee at 0x22>' },
                outputs: ['e1 company: HiGen Labs', 'e2 company: HiGen Labs']
            },
        ]
    },
    {
        id: 'shadowing-trap',
        label: 'The Shadowing Mutation Trap Simulator',
        code: `class Counter:
    count = 0  # Class variable in Central Tower

c1 = Counter()
c2 = Counter()

# MUTATION TRAP: Writing through instance pastes a local shadow sticker!
c1.count = 99

print("c1.count:", c1.count)
print("c2.count:", c2.count)
print("Counter.count:", Counter.count)`,
        steps: [
            {
                lineNum: 1,
                action: 'define_class',
                detail: 'Counter defined with shared count = 0 in Central Tower',
                explanation: 'Central Tower holds count = 0.',
                classDict: { count: 0 },
                instances: { c1: {}, c2: {} },
                trapWarning: false,
                variables: { Counter: '<class Counter>' },
                outputs: []
            },
            {
                lineNum: 4,
                action: 'instantiate',
                detail: 'c1 and c2 instances allocated with empty local pods',
                explanation: 'Both pods start completely empty {}.',
                classDict: { count: 0 },
                instances: { c1: {}, c2: {} },
                trapWarning: false,
                variables: { Counter: '<class Counter>', c1: '<Counter 0x01>', c2: '<Counter 0x02>' },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'shadow_mutate',
                detail: '⚠️ c1.count = 99: Pastes shadow sticker into c1 Pod only!',
                explanation: 'Assigning to c1.count does NOT touch the Central Tower. It writes into c1.__dict__["count"] = 99.',
                classDict: { count: 0 },
                instances: { c1: { count: 99 }, c2: {} },
                trapWarning: true,
                variables: { Counter: '<class Counter>', c1: '<Counter 0x01>', c2: '<Counter 0x02>' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'read_c1',
                detail: 'c1.count → 99 (Intercepted by local shadow sticker!)',
                explanation: 'Lookup checks c1 Pod first, finds 99, and never needs to check the Central Tower.',
                classDict: { count: 0 },
                instances: { c1: { count: 99 }, c2: {} },
                trapWarning: true,
                variables: { Counter: '<class Counter>', c1: '<Counter 0x01>', c2: '<Counter 0x02>' },
                outputs: ['c1.count: 99']
            },
            {
                lineNum: 11,
                action: 'read_c2',
                detail: 'c2.count → 0 (Empty pod still reads from Central Tower)',
                explanation: 'c2 Pod is empty, so its lookup beam reaches the Central Tower and returns 0.',
                classDict: { count: 0 },
                instances: { c1: { count: 99 }, c2: {} },
                trapWarning: true,
                variables: { Counter: '<class Counter>', c1: '<Counter 0x01>', c2: '<Counter 0x02>' },
                outputs: ['c1.count: 99', 'c2.count: 0']
            },
            {
                lineNum: 12,
                action: 'read_class',
                detail: 'Counter.count → 0 (Central Tower remained untouched all along!)',
                explanation: 'To mutate a class variable, you MUST write "Counter.count = 99", never "instance.count = 99".',
                classDict: { count: 0 },
                instances: { c1: { count: 99 }, c2: {} },
                trapWarning: true,
                variables: { Counter: '<class Counter>', c1: '<Counter 0x01>', c2: '<Counter 0x02>' },
                outputs: ['c1.count: 99', 'c2.count: 0', 'Counter.count: 0']
            },
        ]
    }
];

export default function ClassVsInstanceVarsVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                            <Database className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Instance vs Class Variables &amp; Namespaces
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
                                        ? 'bg-emerald-600 text-white shadow-xs'
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
                        badgeText="Namespace Engine"
                        fileName="namespaces.py"
                        accentColor="#059669"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Visual Central Tower vs Pods Boxes */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                    <Building2 className="w-3.5 h-3.5" />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Central Class Tower vs Individual Instance Pods
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                Namespace Schematics
                            </span>
                        </div>

                        {/* Top Shared Class Tower Box */}
                        <div className="p-4 bg-emerald-950 rounded-xl border-2 border-emerald-500 text-white space-y-3 shadow-md">
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-emerald-300 font-bold flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-emerald-400" />
                                    CENTRAL CLASS TOWER: {selectedExample === 0 ? 'Employee.__dict__' : 'Counter.__dict__'}
                                </span>
                                <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded font-bold">
                                    Single Shared Copy
                                </span>
                            </div>

                            <div className="p-3 bg-slate-950 rounded-lg border border-emerald-800 font-mono text-xs flex items-center justify-between">
                                <span className="text-slate-400">{selectedExample === 0 ? '"company":' : '"count":'}</span>
                                <span className="text-emerald-400 font-bold text-sm">
                                    {selectedExample === 0 ? currentStepData?.classDict?.company ?? '"HiGen Labs"' : currentStepData?.classDict?.count ?? '0'}
                                </span>
                            </div>
                            <div className="text-[11px] text-slate-400 leading-snug">
                                All instances share wireless access to this single central memory tower.
                            </div>
                        </div>

                        {/* Lookup Connection Beams */}
                        <div className="flex items-center justify-around text-xs font-mono text-slate-400 px-4">
                            <div className="flex flex-col items-center">
                                <ArrowUp className={`w-4 h-4 transition-all ${
                                    currentStepData?.activeLookup?.target === 'e1' ? 'text-emerald-600 animate-bounce' : 'text-slate-300'
                                }`} />
                                <span className="text-[10px]">e1 Lookup Beam</span>
                            </div>
                            <div className="text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                Checks local pod first ➔ Falls back to Tower on miss
                            </div>
                            <div className="flex flex-col items-center">
                                <ArrowUp className={`w-4 h-4 transition-all ${
                                    currentStepData?.activeLookup?.target === 'e2' ? 'text-emerald-600 animate-bounce' : 'text-slate-300'
                                }`} />
                                <span className="text-[10px]">e2 Lookup Beam</span>
                            </div>
                        </div>

                        {/* Bottom Instance Pod Boxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Pod 1 */}
                            <div className={`p-4 rounded-xl border-2 transition-all space-y-2.5 ${
                                currentStepData?.trapWarning && selectedExample === 1
                                    ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-300'
                                    : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-xs text-slate-800">
                                        Instance Pod #1: {selectedExample === 0 ? 'e1' : 'c1'}
                                    </span>
                                    {currentStepData?.trapWarning && selectedExample === 1 ? (
                                        <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded animate-pulse">
                                            LOCAL SHADOW STICKER!
                                        </span>
                                    ) : (
                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">
                                            Local Pod
                                        </span>
                                    )}
                                </div>

                                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                                    {selectedExample === 0 ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">self.name:</span>
                                                <span className="text-blue-700 font-bold">{currentStepData?.instances?.e1?.name ?? '—'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">self.salary:</span>
                                                <span className="text-emerald-700 font-bold">{currentStepData?.instances?.e1?.salary ?? '—'}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">c1.__dict__["count"]:</span>
                                            <span className={currentStepData?.instances?.c1?.count !== undefined ? 'text-amber-600 font-bold text-sm' : 'text-slate-300 italic'}>
                                                {currentStepData?.instances?.c1?.count !== undefined ? `${currentStepData.instances.c1.count} (Shadows Tower)` : 'None (Empty)'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pod 2 */}
                            <div className="p-4 rounded-xl border-2 bg-slate-50 border-slate-200 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-xs text-slate-800">
                                        Instance Pod #2: {selectedExample === 0 ? 'e2' : 'c2'}
                                    </span>
                                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">
                                        Local Pod
                                    </span>
                                </div>

                                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                                    {selectedExample === 0 ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">self.name:</span>
                                                <span className="text-blue-700 font-bold">{currentStepData?.instances?.e2?.name ?? '—'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">self.salary:</span>
                                                <span className="text-emerald-700 font-bold">{currentStepData?.instances?.e2?.salary ?? '—'}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">c2.__dict__["count"]:</span>
                                            <span className="text-slate-400 italic">None (Reads Tower: 0)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shadowing Trap Alert Box */}
                        {selectedExample === 1 && currentStepData?.trapWarning && (
                            <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-xl text-amber-900 space-y-1.5 animate-fadeIn">
                                <div className="font-bold text-xs flex items-center gap-1.5 text-amber-800">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>Python Shadowing Trap Explained</span>
                                </div>
                                <p className="text-xs leading-relaxed text-amber-800">
                                    Writing <code className="font-mono bg-amber-100 px-1 rounded font-bold">c1.count = 99</code> pasted a sticker on <code className="font-mono font-bold">c1</code>'s local pod. When <code className="font-mono">c1.count</code> is queried, it finds 99 locally and stops. But the Central Tower still holds 0! Therefore, <code className="font-mono">Counter.count</code> and <code className="font-mono">c2.count</code> remain <code className="font-mono font-bold text-amber-950">0</code>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
