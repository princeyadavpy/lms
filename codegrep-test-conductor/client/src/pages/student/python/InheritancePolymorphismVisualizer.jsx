import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    GitFork, ArrowUp, Zap, Sparkles, Layers, CheckCircle2,
    Code2, Info, ArrowRight, RefreshCw, Box, ShieldCheck,
    Volume2, Radio, Play, Check, AlertCircle, Cpu, Network
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 5: Inheritance, super() & Polymorphism
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'inheritance-super',
        label: 'Inheritance & super() Chaining',
        code: `class Person:
    def __init__(self, name):
        self.name = name

class Employee(Person):
    def __init__(self, name, emp_id):
        super().__init__(name)  # Delegating to parent constructor
        self.emp_id = emp_id

dev = Employee("Kavita", "EMP-401")

print("Name:", dev.name)
print("Employee ID:", dev.emp_id)
print("Is person?", isinstance(dev, Person))`,
        steps: [
            {
                lineNum: 1,
                action: 'define_parent',
                detail: 'class Person defined (Base Superclass Box)',
                explanation: 'Person is registered as the Parent Superclass. It owns the base constructor __init__(self, name).',
                activeNode: 'Person',
                superElevator: 'idle',
                mroActive: 'Person',
                assembledDev: null,
                isinstanceCheck: null,
                variables: { Person: '<class Person>' },
                outputs: []
            },
            {
                lineNum: 5,
                action: 'define_child',
                detail: 'class Employee(Person): Child class inherits from Person',
                explanation: 'Employee is declared as a subclass of Person. MRO chain is established: Employee → Person → object.',
                activeNode: 'Employee',
                superElevator: 'idle',
                mroActive: 'Employee',
                assembledDev: null,
                isinstanceCheck: null,
                variables: { Person: '<class Person>', Employee: '<class Employee>' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'create_instance',
                detail: 'dev = Employee("Kavita", "EMP-401") — Memory frame allocated',
                explanation: 'Python allocates a blank Employee instance and invokes Employee.__init__(self, "Kavita", "EMP-401").',
                activeNode: 'Employee',
                superElevator: 'preparing',
                mroActive: 'Employee',
                assembledDev: { name: '...', emp_id: '...' },
                isinstanceCheck: null,
                variables: { Person: '<class Person>', Employee: '<class Employee>' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'super_call',
                detail: 'super().__init__(name) climbs Elevator to Person.__init__',
                explanation: 'super() ascends the MRO ladder to Person. It executes Person.__init__ to initialize self.name = "Kavita".',
                activeNode: 'Person',
                superElevator: 'ascending',
                mroActive: 'Person',
                assembledDev: { name: '"Kavita"', emp_id: '...' },
                isinstanceCheck: null,
                variables: { Person: '<class Person>', Employee: '<class Employee>', 'self.name': '"Kavita"' },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'child_init',
                detail: 'Elevator descends: self.emp_id = "EMP-401" bound in Child Box',
                explanation: 'After super() completes, execution returns to Employee frame to bind self.emp_id = "EMP-401".',
                activeNode: 'Employee',
                superElevator: 'descended',
                mroActive: 'Employee',
                assembledDev: { name: '"Kavita"', emp_id: '"EMP-401"' },
                isinstanceCheck: null,
                variables: { Person: '<class Person>', Employee: '<class Employee>', dev: '<Employee name="Kavita" emp_id="EMP-401">' },
                outputs: []
            },
            {
                lineNum: 12,
                action: 'read_attr_name',
                detail: 'print("Name:", dev.name) → Reads inherited attribute',
                explanation: 'dev.name resolves directly to "Kavita", which was populated via the Person superclass constructor.',
                activeNode: 'Person',
                superElevator: 'descended',
                mroActive: 'Person',
                assembledDev: { name: '"Kavita"', emp_id: '"EMP-401"' },
                isinstanceCheck: null,
                variables: { dev: '<Employee name="Kavita" emp_id="EMP-401">' },
                outputs: ['Name: Kavita']
            },
            {
                lineNum: 13,
                action: 'read_attr_empid',
                detail: 'print("Employee ID:", dev.emp_id) → Reads subclass attribute',
                explanation: 'dev.emp_id resolves to "EMP-401", populated directly by the Employee subclass constructor.',
                activeNode: 'Employee',
                superElevator: 'descended',
                mroActive: 'Employee',
                assembledDev: { name: '"Kavita"', emp_id: '"EMP-401"' },
                isinstanceCheck: null,
                variables: { dev: '<Employee name="Kavita" emp_id="EMP-401">' },
                outputs: ['Name: Kavita', 'Employee ID: EMP-401']
            },
            {
                lineNum: 14,
                action: 'isinstance_check',
                detail: 'isinstance(dev, Person) → True (Dual-Citizenship verified)',
                explanation: 'dev is an Employee, but because Employee inherits from Person, dev is also an authentic Person!',
                activeNode: 'Person',
                superElevator: 'descended',
                mroActive: 'Person',
                assembledDev: { name: '"Kavita"', emp_id: '"EMP-401"' },
                isinstanceCheck: { isEmployee: true, isPerson: true, isObject: true },
                variables: { dev: '<Employee name="Kavita" emp_id="EMP-401">' },
                outputs: ['Name: Kavita', 'Employee ID: EMP-401', 'Is person? True']
            },
        ]
    },
    {
        id: 'polymorphism-demo',
        label: 'Polymorphism & Dynamic Dispatch',
        code: `class Dog:
    def speak(self): return "Woof!"

class Cat:
    def speak(self): return "Meow!"

class Duck:
    def speak(self): return "Quack!"

animals = [Dog(), Cat(), Duck()]

for a in animals:
    # Polymorphic call: same method name, different behavior!
    print(f"{type(a).__name__}: {a.speak()}")`,
        steps: [
            {
                lineNum: 1,
                action: 'define_classes',
                detail: 'Dog, Cat, and Duck classes defined with speak() interface',
                explanation: 'Three independent classes implement the common speak() method signature without needing a common base class.',
                currentAnimal: null,
                signalActive: false,
                sound: null,
                dispatchedIndex: -1,
                variables: {},
                outputs: []
            },
            {
                lineNum: 10,
                action: 'create_list',
                detail: 'animals = [Dog(), Cat(), Duck()] loaded into polymorphic pipeline',
                explanation: 'A list containing 3 completely different object instances, all sharing the polymorphic capability to respond to .speak().',
                currentAnimal: null,
                signalActive: false,
                sound: null,
                dispatchedIndex: -1,
                variables: { animals: '[Dog, Cat, Duck]' },
                outputs: []
            },
            {
                lineNum: 14,
                action: 'dispatch_dog',
                detail: 'Dynamic Dispatch #1: a.speak() on Dog() → invokes Dog.speak()',
                explanation: 'Caller sends generic "speak()" signal. Python inspects instance type (Dog) and dynamically routes call to Dog.speak() → "Woof!".',
                currentAnimal: 'Dog',
                signalActive: true,
                sound: 'Woof!',
                dispatchedIndex: 0,
                variables: { a: '<Dog>' },
                outputs: ['Dog: Woof!']
            },
            {
                lineNum: 14,
                action: 'dispatch_cat',
                detail: 'Dynamic Dispatch #2: a.speak() on Cat() → invokes Cat.speak()',
                explanation: 'Same line of code "a.speak()", but Python detects Cat type and routes to Cat.speak() → "Meow!".',
                currentAnimal: 'Cat',
                signalActive: true,
                sound: 'Meow!',
                dispatchedIndex: 1,
                variables: { a: '<Cat>' },
                outputs: ['Dog: Woof!', 'Cat: Meow!']
            },
            {
                lineNum: 14,
                action: 'dispatch_duck',
                detail: 'Dynamic Dispatch #3: a.speak() on Duck() → invokes Duck.speak()',
                explanation: 'Duck Typing in action: "If it walks like a duck and quacks like a duck, it is a duck!" Routes to Duck.speak() → "Quack!".',
                currentAnimal: 'Duck',
                signalActive: true,
                sound: 'Quack!',
                dispatchedIndex: 2,
                variables: { a: '<Duck>' },
                outputs: ['Dog: Woof!', 'Cat: Meow!', 'Duck: Quack!']
            },
        ]
    }
];

export default function InheritancePolymorphismVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            <GitFork className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Inheritance, super() &amp; Polymorphism
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
                                        ? 'bg-indigo-600 text-white shadow-xs'
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
                        badgeText="Inheritance Engine"
                        fileName="inheritance.py"
                        accentColor="#4f46e5"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
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
                    {selectedExample === 0 ? (
                        /* ======================================================== */
                        /* PRESET 1: MULTI-STORY INHERITANCE ARCHITECTURE & super() */
                        /* ======================================================== */
                        <div className="space-y-4">
                            {/* MRO Pipeline Ribbon Box */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Network className="w-4 h-4 text-indigo-600" />
                                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            MRO (Method Resolution Order) Pipeline
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                                        Employee.__mro__
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-xs font-mono">
                                    <div className={`px-3 py-1.5 rounded-xl border-2 font-bold transition-all ${
                                        currentStepData?.mroActive === 'Employee'
                                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                    }`}>
                                        1. Employee (Child)
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                                    <div className={`px-3 py-1.5 rounded-xl border-2 font-bold transition-all ${
                                        currentStepData?.mroActive === 'Person'
                                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                    }`}>
                                        2. Person (Parent)
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                                    <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium">
                                        3. object (Root)
                                    </div>
                                </div>
                            </div>

                            {/* Multi-Floor Architecture Box */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-indigo-600" />
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                            Class Hierarchy &amp; super() Elevator Shaft
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                        Delegation in Action
                                    </span>
                                </div>

                                {/* FLOOR 2: BASE SUPERCLASS BOX (Person) */}
                                <div className={`p-4 rounded-xl border-2 transition-all ${
                                    currentStepData?.activeNode === 'Person'
                                        ? 'bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-200'
                                        : 'bg-slate-50/80 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                                            <span className="font-mono font-bold text-xs text-indigo-950">
                                                FLOOR 2: class Person (Base Class)
                                            </span>
                                        </div>
                                        <span className="text-[10px] bg-white text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                                            Provides self.name
                                        </span>
                                    </div>

                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200/80 font-mono text-xs space-y-1">
                                        <div className="text-slate-500 text-[11px]">def __init__(self, name):</div>
                                        <div className={`p-1.5 rounded flex items-center justify-between ${
                                            currentStepData?.activeNode === 'Person' && currentStepData?.assembledDev?.name
                                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                                                : 'text-slate-700 bg-slate-50'
                                        }`}>
                                            <span>self.name = name</span>
                                            {currentStepData?.assembledDev?.name && (
                                                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                                    Initialized: {currentStepData.assembledDev.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* THE VERTICAL super() ELEVATOR SHAFT */}
                                <div className="relative py-2 px-4 bg-slate-900 rounded-xl border border-slate-800 text-white flex items-center justify-between overflow-hidden">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                                            currentStepData?.superElevator === 'ascending'
                                                ? 'bg-amber-400 text-slate-900 animate-bounce shadow-lg shadow-amber-400/50'
                                                : currentStepData?.superElevator === 'descended'
                                                ? 'bg-emerald-400 text-slate-900'
                                                : 'bg-slate-800 text-slate-400'
                                        }`}>
                                            <ArrowUp className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5">
                                                <span>super().__init__(name)</span>
                                                {currentStepData?.superElevator === 'ascending' && (
                                                    <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded font-sans">
                                                        ASCENDING TO PARENT ⬆
                                                    </span>
                                                )}
                                                {currentStepData?.superElevator === 'descended' && (
                                                    <span className="text-[9px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded font-sans">
                                                        RETURNED TO CHILD ✓
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-400">
                                                Climbs MRO ladder so child doesn't duplicate parent initialization logic.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                                        Payload: name="Kavita"
                                    </div>
                                </div>

                                {/* FLOOR 1: DERIVED SUBCLASS BOX (Employee) */}
                                <div className={`p-4 rounded-xl border-2 transition-all ${
                                    currentStepData?.activeNode === 'Employee'
                                        ? 'bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-200'
                                        : 'bg-slate-50/80 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                                            <span className="font-mono font-bold text-xs text-indigo-950">
                                                FLOOR 1: class Employee(Person) [Subclass]
                                            </span>
                                        </div>
                                        <span className="text-[10px] bg-white text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                                            Extends Person
                                        </span>
                                    </div>

                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200/80 font-mono text-xs space-y-1">
                                        <div className="text-slate-500 text-[11px]">def __init__(self, name, emp_id):</div>
                                        <div className="text-slate-400 text-[11px] pl-2 border-l-2 border-indigo-200">
                                            super().__init__(name) # Delegated above ⬆
                                        </div>
                                        <div className={`p-1.5 rounded flex items-center justify-between ${
                                            currentStepData?.assembledDev?.emp_id && currentStepData?.assembledDev?.emp_id !== '...'
                                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                                                : 'text-slate-700 bg-slate-50'
                                        }`}>
                                            <span>self.emp_id = emp_id</span>
                                            {currentStepData?.assembledDev?.emp_id && currentStepData?.assembledDev?.emp_id !== '...' && (
                                                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                                    Initialized: {currentStepData.assembledDev.emp_id}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ASSEMBLED INSTANCE POD & isinstance() SCANNER */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Resulting Instance Memory Pod */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Box className="w-4 h-4 text-indigo-600" />
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                dev Object Pod
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                                            Heap: 0x8f22
                                        </span>
                                    </div>

                                    {currentStepData?.assembledDev ? (
                                        <div className="space-y-1.5 font-mono text-xs">
                                            <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-200 flex items-center justify-between">
                                                <span className="text-indigo-900 font-medium">dev.name (from Person)</span>
                                                <span className="font-bold text-indigo-700">{currentStepData.assembledDev.name}</span>
                                            </div>
                                            <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-200 flex items-center justify-between">
                                                <span className="text-indigo-900 font-medium">dev.emp_id (from Employee)</span>
                                                <span className="font-bold text-indigo-700">{currentStepData.assembledDev.emp_id}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                                            Waiting for instantiation...
                                        </div>
                                    )}
                                </div>

                                {/* isinstance() Dual-Citizenship Box */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                isinstance() Dual Citizen
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                            Polymorphic Nature
                                        </span>
                                    </div>

                                    <div className="space-y-1 font-mono text-xs">
                                        <div className="p-1.5 rounded flex items-center justify-between bg-slate-50 border border-slate-200">
                                            <span>isinstance(dev, Employee)</span>
                                            <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                                                True (Exact Class)
                                            </span>
                                        </div>
                                        <div className="p-1.5 rounded flex items-center justify-between bg-slate-50 border border-slate-200">
                                            <span>isinstance(dev, Person)</span>
                                            <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                                                True (Inherited)
                                            </span>
                                        </div>
                                        <div className="p-1.5 rounded flex items-center justify-between bg-slate-50 border border-slate-200">
                                            <span>isinstance(dev, object)</span>
                                            <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                                                True (Python Root)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ======================================================== */
                        /* PRESET 2: DYNAMIC DISPATCH SOUNDBOARD & DUCK TYPING BOX */
                        /* ======================================================== */
                        <div className="space-y-4">
                            {/* Central Controller Box */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Radio className="w-4 h-4 text-indigo-600" />
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                            Polymorphic Dispatcher: for a in animals: a.speak()
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                                        Dynamic Late Binding
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    The caller executes the identical line <code className="font-mono bg-slate-100 px-1 rounded font-bold">a.speak()</code> in each loop iteration. Python dynamically determines at runtime which concrete method to execute!
                                </p>
                            </div>

                            {/* 3 Speaker Stations Box */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { name: 'Dog', icon: '🐕', sound: 'Woof!', code: 'def speak(self): return "Woof!"' },
                                    { name: 'Cat', icon: '🐈', sound: 'Meow!', code: 'def speak(self): return "Meow!"' },
                                    { name: 'Duck', icon: '🦆', sound: 'Quack!', code: 'def speak(self): return "Quack!"' },
                                ].map((animal, idx) => {
                                    const isDispatched = currentStepData?.currentAnimal === animal.name;
                                    return (
                                        <div
                                            key={animal.name}
                                            className={`rounded-2xl border-2 p-4 transition-all duration-300 text-center flex flex-col justify-between space-y-3 ${
                                                isDispatched
                                                    ? 'bg-indigo-50/90 border-indigo-600 shadow-lg shadow-indigo-100 scale-103 ring-2 ring-indigo-200'
                                                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold font-mono text-slate-500">#{idx + 1}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    isDispatched
                                                        ? 'bg-indigo-600 text-white animate-pulse'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {isDispatched ? 'ACTIVE SPEAKER' : 'Standby'}
                                                </span>
                                            </div>

                                            <div className="text-4xl my-1">{animal.icon}</div>

                                            <div>
                                                <div className="font-mono font-bold text-sm text-slate-900">{animal.name}</div>
                                                <div className="text-[11px] font-mono text-slate-500 mt-1">{animal.code}</div>
                                            </div>

                                            {/* Sound Wave Emission Box */}
                                            <div className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all ${
                                                isDispatched
                                                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md flex items-center justify-center gap-1.5'
                                                    : 'bg-slate-50 text-slate-400 border-slate-200'
                                            }`}>
                                                <Volume2 className={`w-3.5 h-3.5 ${isDispatched ? 'animate-bounce' : ''}`} />
                                                <span>{isDispatched ? `→ "${animal.sound}"` : animal.sound}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Duck Typing Philosophy Box */}
                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                                            The "Duck Typing" Principle
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                        Pythonic Dynamic Typing
                                    </span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    In Python, polymorphism does <em>not</em> require rigid interface inheritance. As long as an object implements the expected method (<code className="font-mono bg-slate-800 text-indigo-300 px-1 rounded">.speak()</code>), Python will happily invoke it.
                                    <br />
                                    <span className="text-amber-200 font-semibold italic">
                                        "If it walks like a duck and quacks like a duck, it's a duck!"
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
