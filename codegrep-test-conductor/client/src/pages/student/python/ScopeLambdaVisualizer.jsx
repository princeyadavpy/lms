import React, { useState, useEffect, useRef, useCallback } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play, RotateCcw, SkipForward, ChevronRight, Terminal,
    Layers, Zap, Search, Box, CheckCircle2, ArrowRight,
    Sparkles, HelpCircle, ArrowDown, Sliders, Code2, Globe, Database
} from 'lucide-react';

// ── Preset Examples ──────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'scope-lookup',
        label: 'Local vs Global Scope',
        badge: 'Variable Shadowing',
        code: `# Variable Scope Resolution Demo
x = "global"

def outer():
    x = "enclosing"

    def inner():
        x = "local"
        print("Inner x:", x)

    inner()
    print("Outer x:", x)

outer()
print("Top-level x:", x)`,
        steps: [
            { lineNum: 2, action: 'assign', detail: 'x = "global" in Module scope', vars: { module: { x: '"global"' } }, activeScope: 'global', resolvedVar: { name: 'x', scope: 'global', val: '"global"' }, outputs: [] },
            { lineNum: 4, action: 'define', detail: 'def outer() registered in Module scope', vars: { module: { x: '"global"', outer: '<func>' } }, activeScope: 'global', resolvedVar: null, outputs: [] },
            { lineNum: 16, action: 'call', detail: 'outer() invoked -> pushes outer frame', vars: { module: { x: '"global"', outer: '<func>' } }, activeScope: 'global', resolvedVar: null, outputs: [] },
            { lineNum: 5, action: 'assign', detail: 'x = "enclosing" assigned in outer frame', vars: { module: { x: '"global"', outer: '<func>' }, outer: { x: '"enclosing"' } }, activeScope: 'enclosing', resolvedVar: { name: 'x', scope: 'enclosing', val: '"enclosing"' }, outputs: [] },
            { lineNum: 7, action: 'define', detail: 'def inner() registered inside outer frame', vars: { module: { x: '"global"', outer: '<func>' }, outer: { x: '"enclosing"', inner: '<func>' } }, activeScope: 'enclosing', resolvedVar: null, outputs: [] },
            { lineNum: 11, action: 'call', detail: 'inner() invoked -> pushes inner frame', vars: { module: { x: '"global"', outer: '<func>' }, outer: { x: '"enclosing"', inner: '<func>' }, inner: {} }, activeScope: 'enclosing', resolvedVar: null, outputs: [] },
            { lineNum: 8, action: 'assign', detail: 'x = "local" in inner frame (shadows outer x)', vars: { module: { x: '"global"', outer: '<func>' }, outer: { x: '"enclosing"', inner: '<func>' }, inner: { x: '"local"' } }, activeScope: 'local', resolvedVar: { name: 'x', scope: 'local', val: '"local"' }, outputs: [] },
            { lineNum: 9, action: 'print', detail: 'print("Inner x:", x) -> finds x="local" in current frame', vars: { module: { x: '"global"', outer: '<func>' }, outer: { x: '"enclosing"', inner: '<func>' }, inner: { x: '"local"' } }, activeScope: 'local', resolvedVar: { name: 'x', scope: 'local', val: '"local"' }, outputs: ['Inner x: local'] },
            { lineNum: 12, action: 'print', detail: 'inner() ended -> popped. print finds outer x="enclosing"', vars: { module: { x: '"global"', outer: '<func>' }, outer: { x: '"enclosing"', inner: '<func>' } }, activeScope: 'enclosing', resolvedVar: { name: 'x', scope: 'enclosing', val: '"enclosing"' }, outputs: ['Inner x: local', 'Outer x: enclosing'] },
            { lineNum: 17, action: 'print', detail: 'outer() ended -> popped. print finds global x="global"', vars: { module: { x: '"global"', outer: '<func>' } }, activeScope: 'global', resolvedVar: { name: 'x', scope: 'global', val: '"global"' }, outputs: ['Inner x: local', 'Outer x: enclosing', 'Top-level x: global'] },
        ]
    },
    {
        id: 'nonlocal-closure',
        label: 'nonlocal & Closures',
        badge: 'Mutating Enclosing Scope',
        code: `# nonlocal allows inner function to mutate enclosing state
def make_counter():
    count = 0           # Enclosing variable

    def increment():
        nonlocal count  # Re-bind to enclosing variable
        count += 1
        return count

    return increment

counter = make_counter()
print("Step 1:", counter())
print("Step 2:", counter())
print("Step 3:", counter())`,
        steps: [
            { lineNum: 2, action: 'define', detail: 'def make_counter() defined in module', vars: { module: { make_counter: '<func>' } }, activeScope: 'global', resolvedVar: null, outputs: [] },
            { lineNum: 12, action: 'call', detail: 'counter = make_counter() initializes closure state', vars: { module: { make_counter: '<func>' } }, activeScope: 'global', resolvedVar: null, outputs: [] },
            { lineNum: 3, action: 'assign', detail: 'count = 0 initialized in enclosing frame', vars: { module: { make_counter: '<func>' }, make_counter: { count: '0' } }, activeScope: 'enclosing', resolvedVar: { name: 'count', scope: 'enclosing', val: '0' }, outputs: [] },
            { lineNum: 5, action: 'define', detail: 'def increment() defined with closure over count', vars: { module: { make_counter: '<func>' }, make_counter: { count: '0', increment: '<func>' } }, activeScope: 'enclosing', resolvedVar: null, outputs: [] },
            { lineNum: 10, action: 'return', detail: 'return increment closure returned to module scope', vars: { module: { make_counter: '<func>', counter: '<closure>' }, closure_env: { count: '0' } }, activeScope: 'global', resolvedVar: null, outputs: [] },
            { lineNum: 13, action: 'call', detail: 'counter() call 1: nonlocal count mutated from 0 -> 1', vars: { module: { make_counter: '<func>', counter: '<closure>' }, closure_env: { count: '1' } }, activeScope: 'local', resolvedVar: { name: 'count', scope: 'enclosing', val: '1' }, outputs: ['Step 1: 1'] },
            { lineNum: 14, action: 'call', detail: 'counter() call 2: nonlocal count mutated from 1 -> 2', vars: { module: { make_counter: '<func>', counter: '<closure>' }, closure_env: { count: '2' } }, activeScope: 'local', resolvedVar: { name: 'count', scope: 'enclosing', val: '2' }, outputs: ['Step 1: 1', 'Step 2: 2'] },
            { lineNum: 15, action: 'call', detail: 'counter() call 3: nonlocal count mutated from 2 -> 3', vars: { module: { make_counter: '<func>', counter: '<closure>' }, closure_env: { count: '3' } }, activeScope: 'local', resolvedVar: { name: 'count', scope: 'enclosing', val: '3' }, outputs: ['Step 1: 1', 'Step 2: 2', 'Step 3: 3'] },
        ]
    },
    {
        id: 'lambda-pipeline',
        label: 'Lambda Functions',
        badge: 'Anonymous Expressions',
        code: `# Lambda: single-expression inline function
square = lambda x: x ** 2
double = lambda x: x * 2

nums = [4, 1, 9, 3, 7]
# Sort numbers by custom key
sorted_nums = sorted(nums, key=lambda n: n)
print("Sorted:", sorted_nums)

# Transform using map() with lambda
squared_nums = list(map(square, [1, 2, 3, 4]))
print("Squares:", squared_nums)`,
        steps: [
            { lineNum: 2, action: 'define', detail: 'square = lambda x: x ** 2 assigned to variable', vars: { module: { square: '<λ: x**2>' } }, activeScope: 'global', resolvedVar: { name: 'square', scope: 'global', val: '<lambda>' }, outputs: [] },
            { lineNum: 3, action: 'define', detail: 'double = lambda x: x * 2 assigned to variable', vars: { module: { square: '<λ: x**2>', double: '<λ: x*2>' } }, activeScope: 'global', resolvedVar: { name: 'double', scope: 'global', val: '<lambda>' }, outputs: [] },
            { lineNum: 5, action: 'assign', detail: 'nums = [4, 1, 9, 3, 7] list created', vars: { module: { square: '<λ>', double: '<λ>', nums: '[4, 1, 9, 3, 7]' } }, activeScope: 'global', resolvedVar: { name: 'nums', scope: 'global', val: '[4, 1, 9, 3, 7]' }, outputs: [] },
            { lineNum: 7, action: 'call', detail: 'sorted(nums, key=lambda n: n) executes lambda on each item', vars: { module: { square: '<λ>', double: '<λ>', nums: '[4, 1, 9, 3, 7]', sorted_nums: '[1, 3, 4, 7, 9]' } }, activeScope: 'global', resolvedVar: { name: 'sorted_nums', scope: 'global', val: '[1, 3, 4, 7, 9]' }, outputs: [] },
            { lineNum: 8, action: 'print', detail: 'print("Sorted:", [1, 3, 4, 7, 9])', vars: { module: { square: '<λ>', double: '<λ>', nums: '[4, 1, 9, 3, 7]', sorted_nums: '[1, 3, 4, 7, 9]' } }, activeScope: 'global', resolvedVar: null, outputs: ['Sorted: [1, 3, 4, 7, 9]'] },
            { lineNum: 11, action: 'call', detail: 'map(square, [1, 2, 3, 4]) evaluates square(1), square(2)...', vars: { module: { square: '<λ>', double: '<λ>', nums: '[4, 1, 9, 3, 7]', sorted_nums: '[1, 3, 4, 7, 9]', squared_nums: '[1, 4, 9, 16]' } }, activeScope: 'global', resolvedVar: { name: 'squared_nums', scope: 'global', val: '[1, 4, 9, 16]' }, outputs: [] },
            { lineNum: 12, action: 'print', detail: 'print("Squares:", [1, 4, 9, 16])', vars: { module: { square: '<λ>', double: '<λ>', nums: '[4, 1, 9, 3, 7]', sorted_nums: '[1, 3, 4, 7, 9]', squared_nums: '[1, 4, 9, 16]' } }, activeScope: 'global', resolvedVar: null, outputs: ['Sorted: [1, 3, 4, 7, 9]', 'Squares: [1, 4, 9, 16]'] },
        ]
    }
];

export default function ScopeLambdaVisualizer() {
    const [selectedExIdx, setSelectedExIdx] = useState(0);
    const activeEx = EXAMPLES[selectedExIdx];

    const [code, setCode] = useState(activeEx.code);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');

    // Interactive Scope Lookup query state
    const [lookupQuery, setLookupQuery] = useState('x');

    // Interactive Lambda Studio State
    const [lambdaVal, setLambdaVal] = useState(5);
    const [selectedLambdaOp, setSelectedLambdaOp] = useState('square');

    const steps = activeEx.steps;
    const currentStep = currentStepIdx >= 0 ? steps[currentStepIdx] : null;
    const currentLineNum = currentStep ? currentStep.lineNum : null;

    const transitionInfo = getStepTransitionInfo(steps, currentStepIdx);

    const speedMs = { slow: 1500, normal: 800, fast: 300 };

    // Switch example
    const handleSelectExample = (idx) => {
        setSelectedExIdx(idx);
        setCode(EXAMPLES[idx].code);
        setCurrentStepIdx(-1);
        setIsRunning(false);
    };

    // Step Forward
    const stepForward = () => {
        if (currentStepIdx < steps.length - 1) {
            setCurrentStepIdx(prev => prev + 1);
        } else {
            setIsRunning(false);
        }
    };

    // Run execution loop
    const runCode = () => {
        if (isRunning) {
            setIsRunning(false);
            return;
        }
        if (currentStepIdx >= steps.length - 1) {
            setCurrentStepIdx(0);
        } else if (currentStepIdx === -1) {
            setCurrentStepIdx(0);
        }
        setIsRunning(true);
    };

    // Reset
    const resetExecution = () => {
        setIsRunning(false);
        setCurrentStepIdx(-1);
    };

    // Auto-advance
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setTimeout(() => {
                if (currentStepIdx < steps.length - 1) {
                    setCurrentStepIdx(prev => prev + 1);
                } else {
                    setIsRunning(false);
                }
            }, speedMs[speed]);
        }
        return () => clearTimeout(timer);
    }, [isRunning, currentStepIdx, speed, steps.length]);

    // Active variables state in current step
    const currentVars = currentStep ? currentStep.vars : (steps[0]?.vars || {});

    // Compute interactive lambda output
    const evaluateLambda = (op, val) => {
        switch (op) {
            case 'square': return { expr: 'lambda x: x ** 2', result: val ** 2 };
            case 'double': return { expr: 'lambda x: x * 2', result: val * 2 };
            case 'cube': return { expr: 'lambda x: x ** 3', result: val ** 3 };
            case 'is_even': return { expr: 'lambda x: x % 2 == 0', result: val % 2 === 0 ? 'True' : 'False' };
            default: return { expr: 'lambda x: x', result: val };
        }
    };

    const activeLambdaResult = evaluateLambda(selectedLambdaOp, lambdaVal);

    return (
        <div className="space-y-5 animate-fadeIn">
            {/* ── 1. Top Bar: Preset Example Switcher ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                            <Layers className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Variable Scope &amp; Lambda Functions
                            </h2>
                        </div>
                    </div>

                    {/* Example selector pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {EXAMPLES.map((ex, idx) => (
                            <button
                                key={ex.id}
                                onClick={() => handleSelectExample(idx)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedExIdx === idx
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                }`}
                            >
                                <span>{ex.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 2. Main Two-Column View ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
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
                        stepCounterText={currentStep ? `Step ${currentStepIdx + 1}/${steps.length}` : 'Idle'}
                        terminalLines={currentStep?.outputs || []}
                        badgeText="Scope & Lambda Engine"
                        fileName="scope_demo.py"
                        accentColor="#8b5cf6"
                    />
                </div>

                {/* ── Right Column: Interactive Scope Stack & Lambda Studio ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Execution Frame Hierarchy Stack */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-purple-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Active Execution Call Stack &amp; Environment Frames
                                </span>
                            </div>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                                {currentStep?.activeScope ? `In ${currentStep.activeScope} scope` : 'Global idle'}
                            </span>
                        </div>

                        {/* Stacked Frames Display */}
                        <div className="space-y-3">
                            {/* 1. Local Frame */}
                            <div className={`p-3.5 rounded-xl border transition-all ${
                                currentStep?.activeScope === 'local'
                                    ? 'bg-blue-50/70 border-blue-400 shadow-sm ring-2 ring-blue-500/20'
                                    : 'bg-slate-50 border-slate-200 opacity-80'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="text-xs font-bold text-slate-800 font-mono">
                                            Local Frame: inner()
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                                        Innermost Frame
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs font-mono">
                                    {currentVars.inner && Object.entries(currentVars.inner).length > 0 ? (
                                        Object.entries(currentVars.inner).map(([k, v]) => (
                                            <div key={k} className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 shadow-2xs">
                                                <span className="font-bold text-blue-600">{k}</span> = <span className="text-slate-800 font-semibold">{v}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-[11px] text-slate-400 italic">No local bindings (frame inactive or empty)</span>
                                    )}
                                </div>
                            </div>

                            {/* Downward search arrow */}
                            <div className="flex items-center justify-center text-slate-400 text-[10px] font-mono gap-1">
                                <ArrowDown className="w-3 h-3 text-slate-400" />
                                <span>looks up if variable not found locally</span>
                            </div>

                            {/* 2. Enclosing Frame */}
                            <div className={`p-3.5 rounded-xl border transition-all ${
                                currentStep?.activeScope === 'enclosing'
                                    ? 'bg-emerald-50/70 border-emerald-400 shadow-sm ring-2 ring-emerald-500/20'
                                    : 'bg-slate-50 border-slate-200 opacity-80'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-bold text-slate-800 font-mono">
                                            Enclosing Frame: outer() / Closure State
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                        Parent Frame
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs font-mono">
                                    {(currentVars.outer || currentVars.make_counter || currentVars.closure_env) ? (
                                        Object.entries(currentVars.outer || currentVars.make_counter || currentVars.closure_env || {}).map(([k, v]) => (
                                            <div key={k} className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 shadow-2xs">
                                                <span className="font-bold text-emerald-600">{k}</span> = <span className="text-slate-800 font-semibold">{v}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-[11px] text-slate-400 italic">No enclosing function frame active</span>
                                    )}
                                </div>
                            </div>

                            {/* Downward search arrow */}
                            <div className="flex items-center justify-center text-slate-400 text-[10px] font-mono gap-1">
                                <ArrowDown className="w-3 h-3 text-slate-400" />
                                <span>looks up if variable not found in enclosing</span>
                            </div>

                            {/* 3. Global Environment */}
                            <div className={`p-3.5 rounded-xl border transition-all ${
                                currentStep?.activeScope === 'global'
                                    ? 'bg-amber-50/70 border-amber-400 shadow-sm ring-2 ring-amber-500/20'
                                    : 'bg-slate-50 border-slate-200 opacity-90'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-3.5 h-3.5 text-amber-600" />
                                        <span className="text-xs font-bold text-slate-800 font-mono">
                                            Global Scope (Module main.py)
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                                        Module Level
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs font-mono">
                                    {currentVars.module && Object.entries(currentVars.module).length > 0 ? (
                                        Object.entries(currentVars.module).map(([k, v]) => (
                                            <div key={k} className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 shadow-2xs">
                                                <span className="font-bold text-amber-700">{k}</span> = <span className="text-slate-800 font-semibold">{v}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-[11px] text-slate-400 italic">No global variables initialized yet</span>
                                    )}
                                </div>
                            </div>

                            {/* 4. Built-in Environment */}
                            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700 font-bold">
                                        <Database className="w-3.5 h-3.5 text-purple-600" />
                                        <span>Built-in Scope: len, print, range, sum, sorted, map, int, str...</span>
                                    </div>
                                    <span className="text-[9px] uppercase font-bold text-purple-600 bg-purple-100 px-1.5 py-0.2 rounded">
                                        Always Available
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Scope Search Query Box */}
                        <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                                    <Search className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Interactive Scope Resolver</span>
                                </span>
                                <div className="flex items-center gap-1">
                                    {['x', 'count', 'nums', 'print'].map((varName) => (
                                        <button
                                            key={varName}
                                            onClick={() => setLookupQuery(varName)}
                                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                                                lookupQuery === varName
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-100'
                                            }`}
                                        >
                                            {varName}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-white border border-purple-100 text-xs text-slate-700 flex items-center justify-between">
                                <span>Lookup for <code>{lookupQuery}</code> resolves in:</span>
                                <span className="font-bold text-purple-700 font-mono">
                                    {lookupQuery === 'print' ? 'Built-in Scope' :
                                     lookupQuery === 'count' ? 'Enclosing Frame (outer make_counter)' :
                                     lookupQuery === 'nums' ? 'Global Scope' :
                                     currentStep?.activeScope === 'local' ? 'Local Frame (x = "local")' :
                                     currentStep?.activeScope === 'enclosing' ? 'Enclosing Frame (x = "enclosing")' :
                                     'Global Scope (x = "global")'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Lambda Function Studio */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Interactive Lambda Expression Transformer
                                </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-500 font-semibold">
                                Live Python λ Simulator
                            </span>
                        </div>

                        {/* Operation selector */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {[
                                { id: 'square', label: 'Square (x ** 2)', expr: 'lambda x: x ** 2' },
                                { id: 'double', label: 'Double (x * 2)', expr: 'lambda x: x * 2' },
                                { id: 'cube', label: 'Cube (x ** 3)', expr: 'lambda x: x ** 3' },
                                { id: 'is_even', label: 'Even Test (x % 2 == 0)', expr: 'lambda x: x % 2 == 0' },
                            ].map((op) => (
                                <button
                                    key={op.id}
                                    onClick={() => setSelectedLambdaOp(op.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                                        selectedLambdaOp === op.id
                                            ? 'bg-amber-500 text-white font-bold shadow-xs'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {op.label}
                                </button>
                            ))}
                        </div>

                        {/* Interactive Pipeline Diagram */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                                {/* Input Node */}
                                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs w-full sm:w-auto">
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Input Argument</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-slate-600 font-bold">x =</span>
                                        <input
                                            type="number"
                                            value={lambdaVal}
                                            onChange={(e) => setLambdaVal(Number(e.target.value) || 0)}
                                            className="w-16 px-2 py-1 bg-slate-100 rounded border border-slate-300 font-mono text-xs font-bold text-slate-900 text-center"
                                        />
                                    </div>
                                </div>

                                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                                {/* Lambda Operator Chamber */}
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 shadow-2xs flex-1 text-center">
                                    <span className="text-[10px] font-bold uppercase text-amber-700 block mb-1">Lambda Callable</span>
                                    <code className="text-xs font-mono font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
                                        {activeLambdaResult.expr}
                                    </code>
                                </div>

                                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                                {/* Evaluated Result */}
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 shadow-2xs w-full sm:w-auto text-center">
                                    <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">Evaluated Result</span>
                                    <span className="text-sm font-mono font-black text-emerald-700">
                                        {String(activeLambdaResult.result)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Lambda vs Def comparison card */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                    <span>When to use Lambda</span>
                                </span>
                                <p className="text-[11px] text-slate-600 leading-snug">
                                    Use for short, single-expression anonymous functions passed directly into <code>sorted(key=...)</code>, <code>map()</code>, or <code>filter()</code>.
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                                    <span>When to use standard `def`</span>
                                </span>
                                <p className="text-[11px] text-slate-600 leading-snug">
                                    Use standard <code>def</code> for multi-line statements, docstrings, loops, or complex branch logic that needs a reusable name.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

