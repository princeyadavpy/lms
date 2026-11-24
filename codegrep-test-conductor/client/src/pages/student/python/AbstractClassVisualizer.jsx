import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Zap,
    Sparkles, Code2, Info, ArrowRight, Layers, FileCheck,
    Check, X, AlertOctagon, Lock, Unlock, Cpu, Box, HelpCircle
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 6: Abstract Classes & Interfaces (abc)
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'abstract-contract',
        label: 'ABC & Concrete Implementation',
        code: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self): pass

    @abstractmethod
    def perimeter(self): pass

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def area(self):
        return self.w * self.h

    def perimeter(self):
        return 2 * (self.w + self.h)

r = Rectangle(4, 5)
print("Area:", r.area())
print("Perimeter:", r.perimeter())`,
        steps: [
            {
                lineNum: 1,
                action: 'import_abc',
                detail: 'from abc import ABC, abstractmethod loaded',
                explanation: 'Imports Python\'s Abstract Base Class module infrastructure.',
                gateStatus: 'standby',
                slots: [
                    { name: 'area()', status: 'unregistered', detail: 'Pending contract' },
                    { name: 'perimeter()', status: 'unregistered', detail: 'Pending contract' }
                ],
                completionPct: 0,
                instanceObj: null,
                variables: {},
                outputs: []
            },
            {
                lineNum: 3,
                action: 'define_abc',
                detail: 'class Shape(ABC): Abstract Blueprint Stencil etched with 2 cutout slots',
                explanation: 'Shape is declared as an Abstract Base Class (ABC). It defines 2 required method slots that all subclasses MUST implement.',
                gateStatus: 'contract_defined',
                slots: [
                    { name: 'area()', status: 'required', detail: '@abstractmethod slot created' },
                    { name: 'perimeter()', status: 'required', detail: '@abstractmethod slot created' }
                ],
                completionPct: 0,
                instanceObj: null,
                variables: { Shape: '<class Shape (ABC)>' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'define_concrete',
                detail: 'class Rectangle(Shape): Fulfills contract by implementing both slots',
                explanation: 'Rectangle supplies concrete code for both area() and perimeter(). Both cutout slots are now filled!',
                gateStatus: 'contract_satisfied',
                slots: [
                    { name: 'area()', status: 'fulfilled', detail: 'return self.w * self.h' },
                    { name: 'perimeter()', status: 'fulfilled', detail: 'return 2 * (self.w + self.h)' }
                ],
                completionPct: 100,
                instanceObj: null,
                variables: { Shape: '<class Shape>', Rectangle: '<class Rectangle>' },
                outputs: []
            },
            {
                lineNum: 20,
                action: 'instantiate',
                detail: 'r = Rectangle(4, 5) — Security Gate opens: Instantiation Permitted ✓',
                explanation: 'Python checks abstract methods before instantiation. All slots are filled, so the object is cleanly constructed!',
                gateStatus: 'passed',
                slots: [
                    { name: 'area()', status: 'fulfilled', detail: 'return self.w * self.h' },
                    { name: 'perimeter()', status: 'fulfilled', detail: 'return 2 * (self.w + self.h)' }
                ],
                completionPct: 100,
                instanceObj: { name: 'r', type: 'Rectangle', w: 4, h: 5, area: null, perimeter: null },
                variables: { Shape: '<class Shape>', Rectangle: '<class Rectangle>', r: '<Rectangle w=4, h=5>' },
                outputs: []
            },
            {
                lineNum: 21,
                action: 'call_area',
                detail: 'print("Area:", r.area()) → Executed concrete code: 20',
                explanation: 'Calls concrete area() method: 4 * 5 = 20.',
                gateStatus: 'passed',
                slots: [
                    { name: 'area()', status: 'fulfilled', detail: 'return self.w * self.h' },
                    { name: 'perimeter()', status: 'fulfilled', detail: 'return 2 * (self.w + self.h)' }
                ],
                completionPct: 100,
                instanceObj: { name: 'r', type: 'Rectangle', w: 4, h: 5, area: 20, perimeter: null },
                variables: { r: '<Rectangle w=4, h=5>' },
                outputs: ['Area: 20']
            },
            {
                lineNum: 22,
                action: 'call_perimeter',
                detail: 'print("Perimeter:", r.perimeter()) → Executed concrete code: 18',
                explanation: 'Calls concrete perimeter() method: 2 * (4 + 5) = 18.',
                gateStatus: 'passed',
                slots: [
                    { name: 'area()', status: 'fulfilled', detail: 'return self.w * self.h' },
                    { name: 'perimeter()', status: 'fulfilled', detail: 'return 2 * (self.w + self.h)' }
                ],
                completionPct: 100,
                instanceObj: { name: 'r', type: 'Rectangle', w: 4, h: 5, area: 20, perimeter: 18 },
                variables: { r: '<Rectangle w=4, h=5>' },
                outputs: ['Area: 20', 'Perimeter: 18']
            },
        ]
    },
    {
        id: 'incomplete-trap',
        label: 'TypeError: Incomplete Subclass Shield',
        code: `from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def connect(self): pass

    @abstractmethod
    def query(self, sql): pass

# INCOMPLETE SUBCLASS: forgot to implement query()!
class BadDatabase(Database):
    def connect(self):
        return "Connected"

try:
    db = BadDatabase()
except TypeError as err:
    print("Blocked:", "Can't instantiate abstract class")`,
        steps: [
            {
                lineNum: 3,
                action: 'define_contract',
                detail: 'class Database(ABC): Contract etched with connect() and query()',
                explanation: 'Database requires 2 methods: connect() and query().',
                gateStatus: 'contract_defined',
                slots: [
                    { name: 'connect()', status: 'required', detail: '@abstractmethod slot created' },
                    { name: 'query(sql)', status: 'required', detail: '@abstractmethod slot created' }
                ],
                completionPct: 0,
                errorTriggered: false,
                variables: { Database: '<class Database>' },
                outputs: []
            },
            {
                lineNum: 11,
                action: 'define_bad',
                detail: 'BadDatabase implements connect() but OMITS query() slot!',
                explanation: 'BadDatabase fulfills slot 1 (connect), but fails to provide slot 2 (query). The contract is broken!',
                gateStatus: 'incomplete',
                slots: [
                    { name: 'connect()', status: 'fulfilled', detail: 'return "Connected"' },
                    { name: 'query(sql)', status: 'missing', detail: 'MISSING IMPLEMENTATION!' }
                ],
                completionPct: 50,
                errorTriggered: false,
                variables: { Database: '<class Database>', BadDatabase: '<class BadDatabase>' },
                outputs: []
            },
            {
                lineNum: 16,
                action: 'try_instantiate',
                detail: 'db = BadDatabase() — INSTANTIATION BLOCKED BY ABC SHIELD!',
                explanation: 'Python examines BadDatabase before creating an object. Because query() is abstract, Python raises TypeError and slams down the security barrier!',
                gateStatus: 'blocked',
                slots: [
                    { name: 'connect()', status: 'fulfilled', detail: 'return "Connected"' },
                    { name: 'query(sql)', status: 'missing', detail: 'MISSING IMPLEMENTATION!' }
                ],
                completionPct: 50,
                errorTriggered: true,
                errorMessage: "TypeError: Can't instantiate abstract class BadDatabase with abstract method query",
                variables: { Database: '<class Database>', BadDatabase: '<class BadDatabase>' },
                outputs: []
            },
            {
                lineNum: 18,
                action: 'caught_exception',
                detail: 'except TypeError caught cleanly: Architecture protected!',
                explanation: 'The application safely catches the error. The ABC shield prevented an incomplete object with missing methods from polluting memory.',
                gateStatus: 'blocked',
                slots: [
                    { name: 'connect()', status: 'fulfilled', detail: 'return "Connected"' },
                    { name: 'query(sql)', status: 'missing', detail: 'MISSING IMPLEMENTATION!' }
                ],
                completionPct: 50,
                errorTriggered: true,
                errorMessage: "TypeError: Can't instantiate abstract class BadDatabase with abstract method query",
                variables: { Database: '<class Database>' },
                outputs: ["Blocked: Can't instantiate abstract class"]
            },
        ]
    }
];

export default function AbstractClassVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                            <FileCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Abstract Classes &amp; Interfaces (abc)
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
                                        ? 'bg-teal-600 text-white shadow-xs'
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
                        badgeText="ABC Engine"
                        fileName="abstract_classes.py"
                        accentColor="#0d9488"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Visual Box Diagrams */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {/* BOX 1: THE ABSTRACT CONTRACT BLUEPRINT STENCIL */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-teal-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Abstract Contract Stencil: {selectedExample === 0 ? 'class Shape(ABC)' : 'class Database(ABC)'}
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded">
                                Cannot Instatiate Directly
                            </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            An Abstract Base Class (ABC) acts as a strict architectural contract. It declares required cutout slots using <code className="font-mono bg-slate-100 px-1 rounded font-bold text-teal-700">@abstractmethod</code>. Any concrete child class <strong>must</strong> implement all slots before it can be instantiated.
                        </p>

                        {/* Cutout Slots Container */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentStepData?.slots?.map((slot, idx) => {
                                const isFulfilled = slot.status === 'fulfilled';
                                const isMissing = slot.status === 'missing';
                                return (
                                    <div
                                        key={slot.name}
                                        className={`rounded-xl border-2 p-3 transition-all ${
                                            isFulfilled
                                                ? 'bg-emerald-50/90 border-emerald-500 shadow-xs'
                                                : isMissing
                                                ? 'bg-rose-50/90 border-rose-500 shadow-md ring-2 ring-rose-200 animate-pulse'
                                                : 'bg-slate-50 border-slate-300 border-dashed'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[10px] font-mono text-slate-500">Slot #{idx + 1}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                                isFulfilled
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : isMissing
                                                    ? 'bg-rose-100 text-rose-800'
                                                    : 'bg-slate-200 text-slate-600'
                                            }`}>
                                                {isFulfilled ? 'FULFILLED ✓' : isMissing ? 'MISSING ✕' : '@abstractmethod'}
                                            </span>
                                        </div>

                                        <div className="font-mono font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                            {isFulfilled ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            ) : isMissing ? (
                                                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                            )}
                                            <span>def {slot.name}</span>
                                        </div>

                                        <div className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                                            {slot.detail}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Progress Fulfillment Bar */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                                <span>Contract Fulfillment Progress</span>
                                <span>{currentStepData?.completionPct ?? 0}% Satisfied</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${
                                        currentStepData?.completionPct === 100
                                            ? 'bg-emerald-500'
                                            : currentStepData?.completionPct === 50
                                            ? 'bg-amber-500'
                                            : 'bg-slate-300'
                                    }`}
                                    style={{ width: `${currentStepData?.completionPct ?? 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* BOX 2: THE INSTANTIATION QUALITY CONTROL SECURITY GATE */}
                    <div className={`rounded-2xl border-2 p-5 transition-all shadow-sm ${
                        currentStepData?.gateStatus === 'blocked'
                            ? 'bg-rose-50/90 border-rose-500 shadow-lg shadow-rose-100 ring-2 ring-rose-200'
                            : currentStepData?.gateStatus === 'passed'
                            ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                            : 'bg-white border-slate-200'
                    }`}>
                        <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-200/60">
                            <div className="flex items-center gap-2">
                                {currentStepData?.gateStatus === 'blocked' ? (
                                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                                ) : currentStepData?.gateStatus === 'passed' ? (
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                ) : (
                                    <Lock className="w-5 h-5 text-slate-500" />
                                )}
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Quality Control Gate: Instantiation Checker
                                </h3>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                currentStepData?.gateStatus === 'blocked'
                                    ? 'bg-rose-200 text-rose-900'
                                    : currentStepData?.gateStatus === 'passed'
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : 'bg-slate-100 text-slate-600'
                            }`}>
                                {currentStepData?.gateStatus === 'blocked'
                                    ? 'LASER BARRIER DOWN: BLOCKED'
                                    : currentStepData?.gateStatus === 'passed'
                                    ? 'GATE OPEN: APPROVED'
                                    : 'AWAITING INSTANTIATION'}
                            </span>
                        </div>

                        {/* Gate Status Content */}
                        {currentStepData?.gateStatus === 'blocked' ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-rose-950 text-white rounded-xl font-mono text-xs border border-rose-800 space-y-1">
                                    <div className="text-rose-400 font-bold flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>PYTHON RUNTIME INTERCEPTOR:</span>
                                    </div>
                                    <div className="text-rose-200 leading-relaxed font-bold">
                                        {currentStepData.errorMessage}
                                    </div>
                                </div>
                                <p className="text-xs text-rose-800 leading-relaxed">
                                    <strong>Why did Python block this?</strong> If Python permitted <code className="font-mono bg-rose-100 px-1 rounded font-bold">BadDatabase()</code> to exist, code calling <code className="font-mono">db.query("SELECT *")</code> would crash unexpectedly in production. The ABC Shield guarantees that incomplete subclasses are stopped dead in their tracks at creation time!
                                </p>
                            </div>
                        ) : currentStepData?.gateStatus === 'passed' && currentStepData?.instanceObj ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                                    <div className="p-2.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                                        <div className="text-[10px] text-slate-400">INSTANTIATED OBJECT</div>
                                        <div className="font-bold text-slate-800">{currentStepData.instanceObj.name} = Rectangle(4, 5)</div>
                                        <div className="text-slate-500">w={currentStepData.instanceObj.w}, h={currentStepData.instanceObj.h}</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                                        <div className="text-[10px] text-slate-400">EXECUTED METHODS</div>
                                        <div className="text-emerald-700 font-bold">
                                            r.area() → {currentStepData.instanceObj.area ?? 'ready'}
                                        </div>
                                        <div className="text-emerald-700 font-bold">
                                            r.perimeter() → {currentStepData.instanceObj.perimeter ?? 'ready'}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-emerald-800 leading-relaxed">
                                    <strong>Contract Passed:</strong> All required methods were properly coded in <code className="font-mono bg-emerald-100 px-1 rounded font-bold">Rectangle</code>. Instantiation succeeded with guaranteed interface compliance!
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" />
                                <span>
                                    Step forward or run code to watch Python inspect the concrete class and decide whether to grant or deny object instantiation.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
