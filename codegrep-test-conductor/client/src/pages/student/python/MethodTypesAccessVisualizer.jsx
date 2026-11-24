import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Shield, Lock, Unlock, Zap, Layers, Sparkles, Code2,
    CheckCircle2, ArrowRight, Eye, EyeOff, Radio, Cpu, AlertTriangle
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 4: Types of Methods & Access Control
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'method-types',
        label: 'The 3-Station Method Dispatch Machine',
        code: `class Account:
    bank_name = "PyBank"
    total_accounts = 0

    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
        Account.total_accounts += 1

    def deposit(self, amount):       # Station 1: Instance Method (self)
        self.balance += amount
        return self.balance

    @classmethod
    def get_bank(cls):              # Station 2: Class Method (cls)
        return f"{cls.bank_name} (Accounts: {cls.total_accounts})"

    @staticmethod
    def is_valid_rate(rate):        # Station 3: Static Method (no self/cls)
        return 0.0 <= rate <= 0.15

acc = Account("Sam", 1000)
acc.deposit(500)
print(Account.get_bank())
print("Rate valid:", Account.is_valid_rate(0.05))`,
        steps: [
            {
                lineNum: 1,
                action: 'define_class',
                detail: 'class Account defined with 3 distinct method stations',
                explanation: 'Account has deposit(self) [Instance], get_bank(cls) [@classmethod], and is_valid_rate(rate) [@staticmethod].',
                activeStation: null,
                variables: { Account: '<class Account>' },
                outputs: []
            },
            {
                lineNum: 21,
                action: 'instantiate',
                detail: 'acc = Account("Sam", 1000)',
                explanation: 'Account created for Sam with 1000 balance. Account.total_accounts becomes 1.',
                activeStation: null,
                variables: { Account: '<class Account>', acc: '<Account at 0x5a1>' },
                outputs: []
            },
            {
                lineNum: 22,
                action: 'instance_call',
                detail: 'acc.deposit(500) → Station 1: Instance Method Dispatch',
                explanation: 'Dispatches to deposit(self, amount). Python implicitly passes instance self=acc. Balance becomes 1500.',
                activeStation: 'instance',
                passedParam: 'self = <Account acc (Sam)>',
                variables: { Account: '<class Account>', acc: '<Account balance: 1500>' },
                outputs: []
            },
            {
                lineNum: 23,
                action: 'classmethod_call',
                detail: 'Account.get_bank() → Station 2: Class Method Dispatch',
                explanation: 'Dispatches to @classmethod get_bank(cls). Python implicitly passes class cls=Account. Reads cls.bank_name and cls.total_accounts.',
                activeStation: 'classmethod',
                passedParam: 'cls = <class Account>',
                variables: { Account: '<class Account>', acc: '<Account balance: 1500>' },
                outputs: ['PyBank (Accounts: 1)']
            },
            {
                lineNum: 24,
                action: 'staticmethod_call',
                detail: 'Account.is_valid_rate(0.05) → Station 3: Static Method Dispatch',
                explanation: 'Dispatches to @staticmethod. No implicit self or cls passed! Acts like an isolated plain utility function.',
                activeStation: 'staticmethod',
                passedParam: 'rate = 0.05 (No implicit self or cls)',
                variables: { Account: '<class Account>', acc: '<Account balance: 1500>' },
                outputs: ['PyBank (Accounts: 1)', 'Rate valid: True']
            },
        ]
    },
    {
        id: 'access-control',
        label: '3-Compartment Security Vault & Name Mangling Grinder',
        code: `class Vault:
    def __init__(self, secret_key):
        self.public_id = "VAULT-001"         # Public Zone (Open Door)
        self._internal_code = "SECRET-CODE"  # Protected Zone (Caution Sign)
        self.__master_key = secret_key       # Private Vault (Name Mangled!)

v = Vault("UltraSecret99")

print(v.public_id)
print(v._internal_code)

# Accessing v.__master_key directly raises AttributeError!
# But Python mangles it to _Vault__master_key:
print("Mangled access:", v._Vault__master_key)`,
        steps: [
            {
                lineNum: 1,
                action: 'define_class',
                detail: 'class Vault defined with Public, Protected, and Private fields',
                explanation: 'Python uses naming conventions: public (no prefix), protected (_single prefix), and private (__double prefix).',
                activeCompartment: null,
                variables: { Vault: '<class Vault>' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'instantiate',
                detail: 'v = Vault("UltraSecret99") created in memory',
                explanation: 'Python runs Name Mangling on __master_key, rewriting it internally as _Vault__master_key.',
                activeCompartment: null,
                variables: { Vault: '<class Vault>', v: '<Vault at 0x9c2>' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'read_public',
                detail: 'print(v.public_id) → Public Compartment: Open Door Access',
                explanation: 'Public attributes are open to direct external access everywhere.',
                activeCompartment: 'public',
                variables: { Vault: '<class Vault>', v: '<Vault at 0x9c2>' },
                outputs: ['VAULT-001']
            },
            {
                lineNum: 10,
                action: 'read_protected',
                detail: 'print(v._internal_code) → Protected Compartment: Caution Sign',
                explanation: 'A single underscore _ signals "internal use only" by convention. Python permits access, but warns developers.',
                activeCompartment: 'protected',
                variables: { Vault: '<class Vault>', v: '<Vault at 0x9c2>' },
                outputs: ['VAULT-001', 'SECRET-CODE']
            },
            {
                lineNum: 14,
                action: 'read_mangled',
                detail: 'print(v._Vault__master_key) → Name Mangler Gear Grinds __key into _Vault__key',
                explanation: 'Python mangled __master_key to _Vault__master_key to prevent accidental subclass override collisions.',
                activeCompartment: 'private',
                variables: { Vault: '<class Vault>', v: '<Vault at 0x9c2>' },
                outputs: ['VAULT-001', 'SECRET-CODE', 'Mangled access: UltraSecret99']
            },
        ]
    }
];

export default function MethodTypesAccessVisualizer() {
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
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Types of Methods &amp; Access Control
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
                                        ? 'bg-amber-600 text-white shadow-xs'
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
                        badgeText="Method Engine"
                        fileName="methods_access.py"
                        accentColor="#d97706"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Visual 3-Station Machine / Security Vault Boxes */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {selectedExample === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                        <Cpu className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        The 3-Station Method Dispatch Machine
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                                    Implicit Parameter Bindings
                                </span>
                            </div>

                            {/* 3 Dedicated Station Boxes */}
                            <div className="space-y-3">
                                {/* Station 1 Box */}
                                <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                    currentStepData?.activeStation === 'instance'
                                        ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-300'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</div>
                                            <span className="font-bold text-xs text-slate-900">Instance Method: def deposit(self, amount)</span>
                                        </div>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                                            Auto-Injects self (Instance)
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-snug">
                                        Has full access to individual instance attributes (<code className="font-mono bg-white px-1 rounded">self.balance</code>).
                                    </p>
                                    {currentStepData?.activeStation === 'instance' && (
                                        <div className="text-xs font-mono font-bold text-blue-900 bg-blue-100/90 p-2 rounded-lg">
                                            Dispatched: {currentStepData.passedParam}
                                        </div>
                                    )}
                                </div>

                                {/* Station 2 Box */}
                                <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                    currentStepData?.activeStation === 'classmethod'
                                        ? 'bg-purple-50/80 border-purple-500 shadow-md ring-2 ring-purple-300'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold text-xs flex items-center justify-center">2</div>
                                            <span className="font-bold text-xs text-slate-900">Class Method: @classmethod def get_bank(cls)</span>
                                        </div>
                                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded border border-purple-200">
                                            Auto-Injects cls (Class)
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-snug">
                                        Can inspect and mutate class-level variables (<code className="font-mono bg-white px-1 rounded">cls.bank_name</code>), but cannot access individual instances.
                                    </p>
                                    {currentStepData?.activeStation === 'classmethod' && (
                                        <div className="text-xs font-mono font-bold text-purple-900 bg-purple-100/90 p-2 rounded-lg">
                                            Dispatched: {currentStepData.passedParam}
                                        </div>
                                    )}
                                </div>

                                {/* Station 3 Box */}
                                <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                    currentStepData?.activeStation === 'staticmethod'
                                        ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-300'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-amber-600 text-white font-bold text-xs flex items-center justify-center">3</div>
                                            <span className="font-bold text-xs text-slate-900">Static Method: @staticmethod def is_valid_rate(rate)</span>
                                        </div>
                                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                                            Zero Injections (Pure Function)
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-snug">
                                        Receives no implicit <code className="font-mono">self</code> or <code className="font-mono">cls</code>. Acts as an isolated pure utility grouped logically within the class.
                                    </p>
                                    {currentStepData?.activeStation === 'staticmethod' && (
                                        <div className="text-xs font-mono font-bold text-amber-900 bg-amber-100/90 p-2 rounded-lg">
                                            Dispatched: {currentStepData.passedParam}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ── SCENARIO 2: 3-COMPARTMENT SECURITY VAULT & NAME MANGLING GRINDER ── */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                        <Lock className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        3-Compartment Security Vault &amp; Name Mangling
                                    </h3>
                                </div>
                            </div>

                            {/* 3 Security Boxes */}
                            <div className="space-y-3">
                                {/* Compartment 1: Public Zone (Open Door) */}
                                <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                    currentStepData?.activeCompartment === 'public'
                                        ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                                            <Unlock className="w-4 h-4 text-emerald-600" />
                                            1. PUBLIC COMPARTMENT: self.public_id
                                        </span>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                                            Open Access Everywhere
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Accessible directly from outside without any restrictions: <code className="font-mono bg-white px-1 rounded">print(v.public_id)</code> works cleanly.
                                    </p>
                                </div>

                                {/* Compartment 2: Protected Zone (Caution Sign) */}
                                <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                    currentStepData?.activeCompartment === 'protected'
                                        ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-200'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-xs text-amber-900 flex items-center gap-1.5">
                                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                                            2. PROTECTED COMPARTMENT: self._internal_code
                                        </span>
                                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                                            Convention: "Internal Only"
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Single underscore prefix <code className="font-mono bg-white px-1 rounded">_</code> tells other developers: "Don't access outside this class or subclasses!" Python still allows it, but linters will flag a warning.
                                    </p>
                                </div>

                                {/* Compartment 3: Private Vault & Name Mangling Grinder */}
                                <div className={`p-4 rounded-xl border-2 transition-all space-y-2.5 ${
                                    currentStepData?.activeCompartment === 'private'
                                        ? 'bg-purple-50 border-purple-500 shadow-md ring-2 ring-purple-200'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-xs text-purple-900 flex items-center gap-1.5">
                                            <Lock className="w-4 h-4 text-purple-600" />
                                            3. PRIVATE VAULT &amp; NAME MANGLING: self.__master_key
                                        </span>
                                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                                            Automatic Rewrite
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Direct access <code className="font-mono bg-white px-1 rounded text-rose-700">v.__master_key</code> throws <code className="font-mono text-rose-700">AttributeError</code>! Python secretly runs its <strong>Name Mangling Grinder</strong>:
                                    </p>

                                    {/* Name Mangling Transformer Box */}
                                    <div className="p-3 bg-slate-900 text-white rounded-lg font-mono text-xs flex items-center justify-between">
                                        <span className="text-rose-400">__master_key</span>
                                        <ArrowRight className="w-4 h-4 text-amber-400" />
                                        <span className="text-slate-400">Prepend _ClassName ➔</span>
                                        <span className="text-emerald-400 font-bold">_Vault__master_key</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
