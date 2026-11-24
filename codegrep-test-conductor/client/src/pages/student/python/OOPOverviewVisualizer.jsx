import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Layers, Zap, CheckCircle2, ArrowRight, ArrowDown, Sparkles,
    Shield, ShieldCheck, Lock, Unlock, Code2, Info, RefreshCw, Cpu,
    GitFork, Car, Volume2, Sliders, EyeOff
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 1: OVERVIEW OF OOP & CLASSES
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'blueprint-instance',
        label: 'Blueprint vs Instance',
        code: `class Dog:
    species = "Canis familiaris"  # Class attribute

    def bark(self):
        return "Woof!"

buddy = Dog()
miles = Dog()

print("Species:", buddy.species)
print("Sound:", buddy.bark())
print("Same object?", buddy is miles)`,
        steps: [
            {
                lineNum: 1,
                action: 'define_class',
                detail: 'class Dog: registers class blueprint in memory',
                explanation: 'Python creates a class object "Dog" in memory. It serves as an architectural blueprint containing species="Canis familiaris" and bark().',
                instances: [],
                activeInstance: null,
                activeCall: null,
                variables: { Dog: '<class Dog>' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'instantiate',
                detail: 'buddy = Dog() — instance allocated at 0x7fa1',
                explanation: 'Calling Dog() allocates a new distinct object on the heap. Python assigns it unique address 0x7fa1 with reference "buddy".',
                instances: [{ id: '0x7fa1', name: 'buddy', ref: 'Dog instance #1' }],
                activeInstance: '0x7fa1',
                activeCall: null,
                variables: { Dog: '<class Dog>', buddy: '<Dog object at 0x7fa1>' },
                outputs: []
            },
            {
                lineNum: 8,
                action: 'instantiate',
                detail: 'miles = Dog() — second instance allocated at 0x7fa2',
                explanation: 'A second independent object is stamped from the same blueprint. It gets separate memory address 0x7fa2.',
                instances: [
                    { id: '0x7fa1', name: 'buddy', ref: 'Dog instance #1' },
                    { id: '0x7fa2', name: 'miles', ref: 'Dog instance #2' }
                ],
                activeInstance: '0x7fa2',
                activeCall: null,
                variables: { Dog: '<class Dog>', buddy: '<Dog object at 0x7fa1>', miles: '<Dog object at 0x7fa2>' },
                outputs: []
            },
            {
                lineNum: 10,
                action: 'lookup',
                detail: 'buddy.species → "Canis familiaris"',
                explanation: 'Attribute lookup: buddy delegates to Dog.species since buddy has no instance-level override.',
                instances: [
                    { id: '0x7fa1', name: 'buddy', ref: 'Dog instance #1' },
                    { id: '0x7fa2', name: 'miles', ref: 'Dog instance #2' }
                ],
                activeInstance: '0x7fa1',
                activeCall: 'Dog.species',
                variables: { Dog: '<class Dog>', buddy: '<Dog object at 0x7fa1>', miles: '<Dog object at 0x7fa2>' },
                outputs: ['Species: Canis familiaris']
            },
            {
                lineNum: 11,
                action: 'method_call',
                detail: 'buddy.bark() → returns "Woof!"',
                explanation: 'Method dispatch: buddy.bark() invokes Dog.bark(self=buddy). It returns "Woof!".',
                instances: [
                    { id: '0x7fa1', name: 'buddy', ref: 'Dog instance #1' },
                    { id: '0x7fa2', name: 'miles', ref: 'Dog instance #2' }
                ],
                activeInstance: '0x7fa1',
                activeCall: 'bark()',
                variables: { Dog: '<class Dog>', buddy: '<Dog object at 0x7fa1>', miles: '<Dog object at 0x7fa2>' },
                outputs: ['Species: Canis familiaris', 'Sound: Woof!']
            },
            {
                lineNum: 12,
                action: 'identity_check',
                detail: 'buddy is miles → False (different heap addresses)',
                explanation: 'Identity check "buddy is miles" evaluates to False because 0x7fa1 !== 0x7fa2. Each instance has its own identity.',
                instances: [
                    { id: '0x7fa1', name: 'buddy', ref: 'Dog instance #1' },
                    { id: '0x7fa2', name: 'miles', ref: 'Dog instance #2' }
                ],
                activeInstance: null,
                activeCall: null,
                variables: { Dog: '<class Dog>', buddy: '<Dog object at 0x7fa1>', miles: '<Dog object at 0x7fa2>' },
                outputs: ['Species: Canis familiaris', 'Sound: Woof!', 'Same object? False']
            },
        ]
    },
    {
        id: 'four-pillars',
        label: 'The Four Pillars of OOP',
        code: `# Four Core Pillars of Object-Oriented Programming
# Press 'Run Code' or 'Step Forward' to activate each pillar box

# 1. ENCAPSULATION: Bundling state + logic inside protected shell
# 2. INHERITANCE: Parent class passing properties down to Child
# 3. POLYMORPHISM: Single method interface with multiple behaviors
# 4. ABSTRACTION: Exposing simple steering, hiding complex engine

class OOPArchitectureDemo:
    def verify(self):
        return "All 4 pillars active and interconnected!"

system = OOPArchitectureDemo()
print(system.verify())`,
        steps: [
            {
                lineNum: 1,
                action: 'intro',
                detail: 'Overview of the 4 Foundational OOP Pillars',
                explanation: 'OOP organizes software into modular, reusable, and secure conceptual blocks.',
                activePillar: 'all',
                variables: {},
                outputs: []
            },
            {
                lineNum: 4,
                action: 'encapsulation',
                detail: 'Pillar 1: Encapsulation (Protective Vault Box)',
                explanation: 'Encapsulation locks internal attributes (__balance) inside a secure shell and only exposes validated methods (deposit, withdraw).',
                activePillar: 'encapsulation',
                variables: {},
                outputs: []
            },
            {
                lineNum: 5,
                action: 'inheritance',
                detail: 'Pillar 2: Inheritance (Parent → Child Flow Box)',
                explanation: 'Inheritance allows class ElectricCar to inherit speed and move() directly from class Vehicle without copying code.',
                activePillar: 'inheritance',
                variables: {},
                outputs: []
            },
            {
                lineNum: 6,
                action: 'polymorphism',
                detail: 'Pillar 3: Polymorphism (Single Interface → Multiple Forms Box)',
                explanation: 'Polymorphism allows one unified call animal.speak() to produce "Woof!" for Dog, "Meow!" for Cat, and "Quack!" for Duck.',
                activePillar: 'polymorphism',
                variables: {},
                outputs: []
            },
            {
                lineNum: 7,
                action: 'abstraction',
                detail: 'Pillar 4: Abstraction (Dashboard vs Engine Box)',
                explanation: 'Abstraction exposes clean buttons (drive, brake) while concealing the internal complexity of fuel combustion and valve timing.',
                activePillar: 'abstraction',
                variables: {},
                outputs: []
            },
            {
                lineNum: 9,
                action: 'define_class',
                detail: 'class OOPArchitectureDemo defined',
                explanation: 'Registers demo class that unifies all 4 concepts.',
                activePillar: 'all',
                variables: { OOPArchitectureDemo: '<class OOPArchitectureDemo>' },
                outputs: []
            },
            {
                lineNum: 13,
                action: 'instantiate',
                detail: 'system = OOPArchitectureDemo() instantiated',
                explanation: 'Creates system object on heap.',
                activePillar: 'all',
                variables: { system: '<OOPArchitectureDemo at 0x90a1>' },
                outputs: []
            },
            {
                lineNum: 14,
                action: 'execute',
                detail: 'print(system.verify())',
                explanation: 'Executes method and prints verification string.',
                activePillar: 'all',
                variables: { system: '<OOPArchitectureDemo at 0x90a1>' },
                outputs: ['All 4 pillars active and interconnected!']
            },
        ]
    }
];

export default function OOPOverviewVisualizer() {
    const [selectedExample, setSelectedExample] = useState(0);
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [steps, setSteps] = useState(EXAMPLES[0].steps);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const [selectedPillarTab, setSelectedPillarTab] = useState('all');
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
        setSelectedPillarTab('all');
    }, []);

    // Sync active pillar tab when stepping through code
    useEffect(() => {
        if (currentStepData?.activePillar && currentStepData.activePillar !== 'all') {
            setSelectedPillarTab(currentStepData.activePillar);
        }
    }, [currentStepData]);

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
        setSelectedPillarTab('all');
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
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                            <Box className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Overview of OOP &amp; Classes
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
                                        ? 'bg-blue-600 text-white shadow-xs'
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
                        badgeText="OOP Engine"
                        fileName="classes_intro.py"
                        accentColor="#3b82f6"
                    />

                    {/* Step Detail */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Visualizer */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {selectedExample === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                        <Cpu className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Class Blueprint &amp; Instance Stamping Factory
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                                    Heap Memory
                                </span>
                            </div>

                            {/* Blueprint Card */}
                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white space-y-3">
                                <div className="flex items-center justify-between text-xs text-blue-400 font-mono">
                                    <span className="flex items-center gap-1.5">
                                        <Box className="w-4 h-4" />
                                        CLASS BLUEPRINT: class Dog
                                    </span>
                                    <span className="text-[10px] text-slate-400">Type Object in Memory</span>
                                </div>

                                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs">
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span>• species:</span>
                                        <span className="text-emerald-400 font-bold">"Canis familiaris"</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span>• def bark(self):</span>
                                        <span className="text-cyan-400">return "Woof!"</span>
                                    </div>
                                </div>
                            </div>

                            {/* Instance Stamping Area */}
                            <div className="space-y-3">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                                    <span>Allocated Heap Instances</span>
                                    <span>Count: {currentStepData?.instances?.length || 0}</span>
                                </div>

                                {currentStepData?.instances && currentStepData.instances.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {currentStepData.instances.map((inst) => {
                                            const isActive = currentStepData.activeInstance === inst.id;
                                            return (
                                                <div
                                                    key={inst.id}
                                                    className={`p-4 rounded-xl border-2 transition-all duration-300 space-y-2 ${
                                                        isActive
                                                            ? 'bg-blue-50/80 border-blue-500 shadow-md scale-102'
                                                            : 'bg-slate-50 border-slate-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono font-bold text-xs text-blue-700">
                                                            {inst.name}
                                                        </span>
                                                        <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                                                            {inst.id}
                                                        </span>
                                                    </div>

                                                    <div className="text-xs font-mono text-slate-600 space-y-1 pt-1 border-t border-slate-200/80">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-400">__class__:</span>
                                                            <span className="font-semibold text-purple-700">Dog</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-400">species (lookup):</span>
                                                            <span className="font-semibold text-emerald-700">"Canis familiaris"</span>
                                                        </div>
                                                    </div>

                                                    {isActive && (
                                                        <div className="text-[10px] text-blue-600 font-bold bg-blue-100/70 py-1 px-2 rounded text-center">
                                                            Target of Active Operation
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs italic">
                                        No objects created yet. Click "Run Code" or "Step Forward" to watch Dog() stamp instances into heap memory.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ── SCENARIO 2: THE FOUR FUNDAMENTAL PILLARS OF OOP (BOX-BASED DIAGRAMS) ── */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Visual Architecture: The Four Pillars of OOP
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Interactive schematic boxes showing how data, hierarchy, dispatch, and abstraction work
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                    {[
                                        { id: 'all', label: 'All 4 Boxes' },
                                        { id: 'encapsulation', label: 'Encapsulation' },
                                        { id: 'inheritance', label: 'Inheritance' },
                                        { id: 'polymorphism', label: 'Polymorphism' },
                                        { id: 'abstraction', label: 'Abstraction' },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setSelectedPillarTab(tab.id)}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                                selectedPillarTab === tab.id
                                                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── 1. ENCAPSULATION BOX (Protective Capsule Vault) ── */}
                            {(selectedPillarTab === 'all' || selectedPillarTab === 'encapsulation') && (
                                <div className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                                    currentStepData?.activePillar === 'encapsulation'
                                        ? 'bg-blue-50/70 border-blue-500 shadow-md ring-2 ring-blue-300'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                                                1
                                            </div>
                                            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                                                Encapsulation Box (Protective Security Vault)
                                            </span>
                                        </div>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                                            Data Shielding
                                        </span>
                                    </div>

                                    {/* The Visual Capsule */}
                                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white space-y-3">
                                        <div className="text-[11px] font-mono text-blue-300 flex items-center justify-between">
                                            <span>CLASS CONTAINER: BankAccount</span>
                                            <span className="text-emerald-400 flex items-center gap-1">
                                                <ShieldCheck className="w-3.5 h-3.5" /> Protective Boundary
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                            {/* External Caller */}
                                            <div className="sm:col-span-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-center space-y-1">
                                                <div className="text-[10px] text-slate-400 font-mono">External Code</div>
                                                <div className="text-xs font-mono text-amber-300 font-bold">acc.deposit(100)</div>
                                                <div className="text-[9px] text-emerald-400 font-bold">Allowed via Method ✓</div>
                                            </div>

                                            {/* Access Gate */}
                                            <div className="sm:col-span-1 flex justify-center text-blue-400">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>

                                            {/* Public Interface Gate */}
                                            <div className="sm:col-span-4 p-3 bg-blue-950/60 rounded-lg border border-blue-500 text-center space-y-1">
                                                <div className="text-[10px] text-blue-300 font-bold uppercase font-mono">Public Methods Gate</div>
                                                <div className="text-xs font-mono text-white">def deposit()</div>
                                                <div className="text-xs font-mono text-white">def get_balance()</div>
                                            </div>

                                            {/* Protected Inner Vault */}
                                            <div className="sm:col-span-4 p-3 bg-rose-950/60 rounded-lg border-2 border-dashed border-rose-500 text-center space-y-1">
                                                <div className="text-[10px] text-rose-300 font-bold uppercase font-mono flex items-center justify-center gap-1">
                                                    <Lock className="w-3 h-3" /> Private Internal State
                                                </div>
                                                <div className="text-xs font-mono text-rose-200">self.__balance = 5000</div>
                                                <div className="text-[9px] text-rose-400 font-bold">Direct Access Blocked 🚫</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        <strong>Concept:</strong> State is enclosed inside the capsule. External code cannot corrupt <code className="font-mono bg-white px-1 rounded text-rose-700">__balance</code> directly—it must travel through the public method gates.
                                    </p>
                                </div>
                            )}

                            {/* ── 2. INHERITANCE BOX (Parent to Child Hierarchy Flow) ── */}
                            {(selectedPillarTab === 'all' || selectedPillarTab === 'inheritance') && (
                                <div className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                                    currentStepData?.activePillar === 'inheritance'
                                        ? 'bg-purple-50/70 border-purple-500 shadow-md ring-2 ring-purple-300'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                                                2
                                            </div>
                                            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                                                Inheritance Box (Parent → Child Property Flow)
                                            </span>
                                        </div>
                                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                                            Code Reuse
                                        </span>
                                    </div>

                                    {/* Visual Parent-Child Flow */}
                                    <div className="space-y-2">
                                        {/* Top Parent Box */}
                                        <div className="p-3.5 bg-purple-900 text-white rounded-xl border border-purple-700 space-y-2">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold">
                                                <span className="text-purple-300">PARENT SUPERCLASS: class Vehicle</span>
                                                <span className="text-[10px] bg-purple-800 px-2 py-0.5 rounded">Source Blueprint</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs font-mono">
                                                <span className="px-2 py-1 bg-purple-950 rounded border border-purple-600">self.speed = 120</span>
                                                <span className="px-2 py-1 bg-purple-950 rounded border border-purple-600">def start_engine()</span>
                                                <span className="px-2 py-1 bg-purple-950 rounded border border-purple-600">def apply_brakes()</span>
                                            </div>
                                        </div>

                                        {/* Connecting Flow Arrow */}
                                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-purple-600">
                                            <ArrowDown className="w-4 h-4 animate-bounce" />
                                            <span className="font-bold">extends / inherits down (zero code duplication)</span>
                                            <ArrowDown className="w-4 h-4 animate-bounce" />
                                        </div>

                                        {/* Bottom Child Box */}
                                        <div className="p-3.5 bg-white text-slate-900 rounded-xl border-2 border-purple-400 shadow-xs space-y-2">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-900">
                                                <span>CHILD SUBCLASS: class ElectricCar(Vehicle)</span>
                                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                                    Specialized Child
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs font-mono">
                                                <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-300 font-bold">
                                                    ✓ speed [Inherited]
                                                </span>
                                                <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-300 font-bold">
                                                    ✓ start_engine() [Inherited]
                                                </span>
                                                <span className="px-2 py-1 bg-blue-50 text-blue-800 rounded border border-blue-300 font-bold">
                                                    + battery_kwh = 75 [New Added]
                                                </span>
                                                <span className="px-2 py-1 bg-blue-50 text-blue-800 rounded border border-blue-300 font-bold">
                                                    + charge() [New Added]
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        <strong>Concept:</strong> <code className="font-mono bg-white px-1 rounded">ElectricCar</code> acquires all properties of <code className="font-mono bg-white px-1 rounded">Vehicle</code> automatically. It only writes what is new or specialized.
                                    </p>
                                </div>
                            )}

                            {/* ── 3. POLYMORPHISM BOX (Single Call → Multi-Form Dispatch) ── */}
                            {(selectedPillarTab === 'all' || selectedPillarTab === 'polymorphism') && (
                                <div className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                                    currentStepData?.activePillar === 'polymorphism'
                                        ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                                                3
                                            </div>
                                            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                                                Polymorphism Box (One Interface → Many Forms)
                                            </span>
                                        </div>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                            Dynamic Dispatch
                                        </span>
                                    </div>

                                    {/* Dispatch Diagram */}
                                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white space-y-3">
                                        {/* Caller Box */}
                                        <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/50 text-center space-y-1">
                                            <div className="text-[10px] text-slate-400 font-mono uppercase">Single Unified Trigger</div>
                                            <div className="text-sm font-mono text-emerald-300 font-bold">for animal in [dog, cat, duck]: animal.speak()</div>
                                        </div>

                                        {/* 3 Branching Boxes */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center space-y-1">
                                                <div className="text-xs font-mono font-bold text-blue-400">class Dog</div>
                                                <div className="text-xs font-mono text-emerald-400 font-bold bg-slate-900 py-1 rounded">"Woof!" 🐶</div>
                                            </div>

                                            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center space-y-1">
                                                <div className="text-xs font-mono font-bold text-purple-400">class Cat</div>
                                                <div className="text-xs font-mono text-emerald-400 font-bold bg-slate-900 py-1 rounded">"Meow!" 🐱</div>
                                            </div>

                                            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center space-y-1">
                                                <div className="text-xs font-mono font-bold text-amber-400">class Duck</div>
                                                <div className="text-xs font-mono text-emerald-400 font-bold bg-slate-900 py-1 rounded">"Quack!" 🦆</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        <strong>Concept:</strong> "Poly" (many) + "Morph" (forms). The loop caller does not care what type each animal is—invoking <code className="font-mono bg-white px-1 rounded">.speak()</code> dynamically triggers the correct class implementation at runtime.
                                    </p>
                                </div>
                            )}

                            {/* ── 4. ABSTRACTION BOX (Dashboard vs Concealed Complexity) ── */}
                            {(selectedPillarTab === 'all' || selectedPillarTab === 'abstraction') && (
                                <div className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                                    currentStepData?.activePillar === 'abstraction'
                                        ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-300'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                                                4
                                            </div>
                                            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                                                Abstraction Box (Dashboard vs Concealed Engine)
                                            </span>
                                        </div>
                                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                            Complexity Hiding
                                        </span>
                                    </div>

                                    {/* Visual Dashboard vs Hidden Engine */}
                                    <div className="space-y-2">
                                        {/* Clean Exposed Interface */}
                                        <div className="p-3.5 bg-amber-900 text-white rounded-xl border border-amber-700 space-y-2">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold">
                                                <span className="text-amber-300 flex items-center gap-1.5">
                                                    <Sliders className="w-4 h-4" /> EXPOSED INTERFACE (User Dashboard)
                                                </span>
                                                <span className="text-[10px] bg-amber-800 px-2 py-0.5 rounded">Simple &amp; Clean</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs font-mono">
                                                <div className="p-2 bg-amber-950 rounded border border-amber-600 font-bold">car.drive()</div>
                                                <div className="p-2 bg-amber-950 rounded border border-amber-600 font-bold">car.brake()</div>
                                                <div className="p-2 bg-amber-950 rounded border border-amber-600 font-bold">car.steer()</div>
                                            </div>
                                        </div>

                                        {/* Abstraction Divider */}
                                        <div className="p-2 bg-slate-200 text-slate-600 rounded-lg text-center text-[10px] font-mono font-bold tracking-widest border border-slate-300">
                                            ▼ ABSTRACTION BARRIER — INTERNAL COMPLEXITY CONCEALED ▼
                                        </div>

                                        {/* Concealed Implementation Details */}
                                        <div className="p-3 bg-slate-900 text-slate-400 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <EyeOff className="w-3.5 h-3.5" /> Hidden Low-Level Engineering:
                                                </span>
                                                <span>Internal Machinery</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1">
                                                <div className="p-2 bg-slate-950 rounded border border-slate-800">• Fuel Injection Timing</div>
                                                <div className="p-2 bg-slate-950 rounded border border-slate-800">• Hydraulic Braking Valves</div>
                                                <div className="p-2 bg-slate-950 rounded border border-slate-800">• Transmission Gear Ratios</div>
                                                <div className="p-2 bg-slate-950 rounded border border-slate-800">• Alternator Voltage Regulation</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        <strong>Concept:</strong> The driver simply calls <code className="font-mono bg-white px-1 rounded">car.drive()</code> without needing to understand or manage internal combustion physics. Abstraction protects the user from unnecessary complexity.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
