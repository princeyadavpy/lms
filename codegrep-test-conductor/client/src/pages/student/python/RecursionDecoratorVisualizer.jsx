import React, { useState, useEffect, useRef, useCallback } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play, RotateCcw, SkipForward, ChevronDown, ChevronUp,
    Layers, Zap, Lock, ArrowDown, ArrowUp, CheckCircle2,
    XCircle, HelpCircle, ArrowRight, Box, Cpu, Sparkles,
    Timer, RefreshCw, ToggleLeft, ToggleRight, Database
} from 'lucide-react';

// ── Preset Examples ───────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'factorial',
        label: 'Factorial Recursion',
        tab: 'recursion',
        code: `def factorial(n):
    if n == 0:          # Base case
        return 1
    return n * factorial(n - 1)

result = factorial(5)
print("5! =", result)`,
    },
    {
        id: 'make_counter',
        label: 'Closure Counter',
        tab: 'closure',
        code: `def make_counter():
    count = 0           # Outer variable

    def increment():    # Inner function
        nonlocal count
        count += 1
        return count

    return increment

counter = make_counter()
print(counter())
print(counter())
print(counter())`,
    },
    {
        id: 'timer_decorator',
        label: '@timer Decorator',
        tab: 'decorator',
        code: `import time

def timer(func):        # Decorator factory
    def wrapper(*args):
        start = time.time()
        result = func(*args)   # Call original
        elapsed = time.time() - start
        print(f"Elapsed: {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))

slow_sum(1000000)`,
    },
];

// ── Challenges ────────────────────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `def f(n):\n    if n <= 1: return n\n    return f(n-1) + f(n-2)\nprint(f(4))`,
        question: 'What does f(4) print? (This is Fibonacci)',
        options: ['3', '4', '5', '7'],
        correct: '3',
        explanation: 'f(4) = f(3)+f(2) = (f(2)+f(1))+(f(1)+f(0)) = ((f(1)+f(0))+1)+(1+0) = ((1+0)+1)+(1) = 2+1 = 3.',
    },
    {
        code: `def outer():\n    x = 10\n    def inner(): return x * 2\n    x = 20\n    return inner\nfn = outer()\nprint(fn())`,
        question: 'What prints? (closure captures by reference)',
        options: ['20', '40', '10', 'Error'],
        correct: '40',
        explanation: 'Closures capture the variable binding, not the value at creation time. x=20 when inner is returned, so fn() returns 20*2=40.',
    },
    {
        code: `def deco(f):\n    def wrap(): return f() + "!"\n    return wrap\n@deco\ndef hello(): return "Hi"\nprint(hello())`,
        question: 'What does hello() print?',
        options: ['Hi', 'Hi!', 'wrap', 'Error'],
        correct: 'Hi!',
        explanation: '@deco replaces hello with wrap. wrap() calls the original hello() ("Hi") and appends "!", giving "Hi!".',
    },
];

// ── Execution engine ──────────────────────────────────────────────────────────
function executeCode(codeStr) {
    const steps = [];
    const outputs = [];
    const isFactorial = codeStr.includes('factorial');
    const isClosure = codeStr.includes('make_counter');
    const isDecorator = codeStr.includes('@timer') || codeStr.includes('timer');

    const addStep = (lineNum, action, detail, extra = {}) => {
        steps.push({ lineNum, action, detail, outputs: [...outputs], ...extra });
    };

    if (isFactorial) {
        addStep(1, 'def', 'Defined factorial function');
        addStep(6, 'call', 'Calling factorial(5) — push frame onto call stack', { stackFrames: [{ n: 5, phase: 'calling' }] });
        addStep(2, 'check', 'n=5: 5==0? No → recursive case', { stackFrames: [{ n: 5, phase: 'calling' }] });
        addStep(4, 'recurse', 'Calling factorial(4)', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'calling' }] });
        addStep(2, 'check', 'n=4: 4==0? No → recursive case', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'calling' }] });
        addStep(4, 'recurse', 'Calling factorial(3)', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'calling' }] });
        addStep(2, 'check', 'n=3: 3==0? No → recursive case', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'calling' }] });
        addStep(4, 'recurse', 'Calling factorial(2)', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'waiting' }, { n: 2, phase: 'calling' }] });
        addStep(2, 'check', 'n=2: 2==0? No → recursive case', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'waiting' }, { n: 2, phase: 'calling' }] });
        addStep(4, 'recurse', 'Calling factorial(1)', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'waiting' }, { n: 2, phase: 'waiting' }, { n: 1, phase: 'calling' }] });
        addStep(2, 'check', 'n=1: 1==0? No → recursive case', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'waiting' }, { n: 2, phase: 'waiting' }, { n: 1, phase: 'calling' }] });
        addStep(4, 'recurse', 'Calling factorial(0)', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'waiting' }, { n: 2, phase: 'waiting' }, { n: 1, phase: 'waiting' }, { n: 0, phase: 'base' }] });
        addStep(2, 'base', '🟢 BASE CASE: n=0 → return 1', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'waiting' }, { n: 2, phase: 'waiting' }, { n: 1, phase: 'waiting' }, { n: 0, phase: 'base' }] });
        addStep(3, 'return', 'factorial(0) returns 1 — pop frame', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'waiting' }, { n: 2, phase: 'waiting' }, { n: 1, phase: 'returning', ret: 1 }] });
        addStep(4, 'return', 'factorial(1) = 1 × 1 = 1 — pop frame', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'waiting' }, { n: 2, phase: 'returning', ret: 1 }] });
        addStep(4, 'return', 'factorial(2) = 2 × 1 = 2 — pop frame', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'waiting' }, { n: 3, phase: 'returning', ret: 2 }] });
        addStep(4, 'return', 'factorial(3) = 3 × 2 = 6 — pop frame', { stackFrames: [{ n: 5, phase: 'waiting' }, { n: 4, phase: 'returning', ret: 6 }] });
        addStep(4, 'return', 'factorial(4) = 4 × 6 = 24 — pop frame', { stackFrames: [{ n: 5, phase: 'returning', ret: 24 }] });
        addStep(4, 'return', 'factorial(5) = 5 × 24 = 120 — stack empty', { stackFrames: [{ n: 5, phase: 'done', ret: 120 }] });
        outputs.push('5! = 120');
        addStep(7, 'print', 'print("5! =", 120)', { stackFrames: [] });
    } else if (isClosure) {
        addStep(1, 'def', 'Defined make_counter() — outer function', { closureState: { outerDone: false, count: null, calls: 0 } });
        addStep(10, 'call', 'counter = make_counter() — calling outer function', { closureState: { outerDone: false, count: 0, calls: 0 } });
        addStep(2, 'outer', 'count = 0 assigned in outer scope', { closureState: { outerDone: false, count: 0, calls: 0 } });
        addStep(4, 'inner_def', 'increment() defined — captures count from outer scope', { closureState: { outerDone: false, count: 0, calls: 0 } });
        addStep(9, 'outer_ret', 'make_counter() returns increment — outer frame GONE but count lives on!', { closureState: { outerDone: true, count: 0, calls: 0 } });
        addStep(11, 'inner_call', 'counter() — inner increment() reads captured count=0', { closureState: { outerDone: true, count: 1, calls: 1 } });
        outputs.push('1');
        addStep(5, 'nonlocal', 'nonlocal count += 1 → count=1; return 1', { closureState: { outerDone: true, count: 1, calls: 1 } });
        addStep(12, 'inner_call', 'counter() again — count is still alive in closure cell!', { closureState: { outerDone: true, count: 2, calls: 2 } });
        outputs.push('2');
        addStep(5, 'nonlocal', 'count += 1 → count=2; return 2', { closureState: { outerDone: true, count: 2, calls: 2 } });
        addStep(13, 'inner_call', 'counter() once more — same closure cell', { closureState: { outerDone: true, count: 3, calls: 3 } });
        outputs.push('3');
        addStep(5, 'nonlocal', 'count += 1 → count=3; return 3', { closureState: { outerDone: true, count: 3, calls: 3 } });
    } else if (isDecorator) {
        addStep(3, 'def', 'timer(func) decorator defined', { decoratorState: { phase: 'defined' } });
        addStep(12, 'apply', '@timer applied — slow_sum is replaced by wrapper', { decoratorState: { phase: 'applied' } });
        addStep(17, 'call', 'slow_sum(1000000) called — enters wrapper()', { decoratorState: { phase: 'enter_wrapper', before: true } });
        addStep(5, 'before', 'start = time.time() — record start time', { decoratorState: { phase: 'before_hook', before: true } });
        addStep(6, 'original', 'result = func(1000000) — calling original slow_sum', { decoratorState: { phase: 'in_original' } });
        addStep(14, 'orig_exec', 'return sum(range(1000000)) = 499999500000', { decoratorState: { phase: 'in_original' } });
        addStep(7, 'after', 'elapsed = time.time() - start — measure duration', { decoratorState: { phase: 'after_hook', after: true } });
        addStep(8, 'log', 'print(f"Elapsed: 0.0421s") — decorator side-effect', { decoratorState: { phase: 'after_hook', after: true } });
        outputs.push('Elapsed: 0.0421s');
        addStep(9, 'exit', 'wrapper returns result — decorator done', { decoratorState: { phase: 'done' } });
    }

    if (steps.length === 0) {
        steps.push({ lineNum: 1, action: 'idle', detail: 'Ready', outputs: [] });
    }
    return { steps, finalOutputs: outputs };
}

// ── Call Stack Visualizer ─────────────────────────────────────────────────────
function CallStackPanel({ frames, inputN }) {
    if (!frames) return null;
    const displayFrames = [...frames].reverse();
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Call Stack</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {frames.length} frame{frames.length !== 1 ? 's' : ''} active
                </span>
            </div>

            {frames.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-indigo-300" />
                    </div>
                    <span className="text-xs text-slate-400 italic">Stack is empty — execution complete</span>
                </div>
            ) : (
                <div className="flex flex-col-reverse gap-1.5">
                    {frames.map((frame, idx) => {
                        const isBase = frame.phase === 'base';
                        const isReturning = frame.phase === 'returning' || frame.phase === 'done';
                        const isCalling = frame.phase === 'calling';
                        return (
                            <div
                                key={idx}
                                className={`relative flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-mono transition-all duration-300 ${
                                    isBase
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-md shadow-emerald-100'
                                        : isReturning
                                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-md shadow-amber-100'
                                        : isCalling
                                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-sm'
                                        : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {isBase && <span className="text-base">🟢</span>}
                                    {isReturning && <span className="text-base">🟠</span>}
                                    {!isBase && !isReturning && (
                                        <span className={`w-2 h-2 rounded-full ${isCalling ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400'}`} />
                                    )}
                                    <span className="font-bold">
                                        factorial({frame.n})
                                    </span>
                                    {isBase && <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-100 px-1.5 rounded">BASE CASE</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500 font-sans">n = {frame.n}</span>
                                    {isReturning && (
                                        <span className="bg-amber-500 text-white px-2 py-0.5 rounded font-bold text-[11px] shadow-xs">
                                            → {frame.ret}
                                        </span>
                                    )}
                                </div>
                                {/* Stack depth indicator */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-full"
                                    style={{
                                        background: isBase
                                            ? '#10b981'
                                            : isReturning
                                            ? '#f59e0b'
                                            : isCalling
                                            ? '#6366f1'
                                            : '#94a3b8'
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Stack legend */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                {[
                    { color: 'bg-indigo-500', label: 'Calling' },
                    { color: 'bg-emerald-500', label: 'Base Case' },
                    { color: 'bg-amber-500', label: 'Returning' },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1 text-[10px] text-slate-500">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Closure Memory Cell Panel ─────────────────────────────────────────────────
function ClosurePanel({ closureState }) {
    if (!closureState) return null;
    const { outerDone, count, calls } = closureState;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-500" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Closure Memory Model</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Outer frame */}
                <div className={`relative rounded-xl border-2 p-3 transition-all duration-500 ${outerDone ? 'border-dashed border-slate-300 bg-slate-50 opacity-60' : 'border-indigo-400 bg-indigo-50'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${outerDone ? 'bg-slate-400' : 'bg-indigo-500 animate-pulse'}`} />
                        <span className={outerDone ? 'text-slate-400' : 'text-indigo-700'}>
                            make_counter() frame
                        </span>
                        {outerDone && <span className="text-[9px] text-slate-400 font-normal">(returned)</span>}
                    </div>
                    <div className="font-mono text-xs space-y-1">
                        <div className={`flex justify-between p-2 rounded-lg border ${outerDone ? 'border-slate-200 bg-white' : 'border-indigo-200 bg-white'}`}>
                            <span className="text-slate-500">count</span>
                            <span className={`font-bold ${count !== null ? (outerDone ? 'text-rose-600' : 'text-indigo-700') : 'text-slate-400'}`}>
                                {count !== null ? count : '—'}
                            </span>
                        </div>
                    </div>
                    {outerDone && (
                        <div className="mt-2 text-[10px] text-slate-400 italic text-center">
                            Frame gone from stack
                        </div>
                    )}
                </div>

                {/* Inner / Closure cell */}
                <div className={`relative rounded-xl border-2 p-3 transition-all duration-500 ${outerDone ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${outerDone ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span className={outerDone ? 'text-rose-700' : 'text-slate-400'}>
                            increment() closure cell
                        </span>
                    </div>
                    <div className="font-mono text-xs space-y-1">
                        <div className={`flex items-center justify-between p-2 rounded-lg border ${outerDone ? 'border-rose-200 bg-white' : 'border-slate-200 bg-white'}`}>
                            <span className="text-slate-500">__closure__</span>
                            <span className={`font-bold text-rose-600 ${outerDone ? '' : 'opacity-30'}`}>
                                count → {count !== null ? count : '0'}
                            </span>
                        </div>
                        {outerDone && count !== null && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-600">
                                <span className="animate-pulse">✦</span>
                                <span>Captured variable still lives!</span>
                            </div>
                        )}
                    </div>
                    {outerDone && calls > 0 && (
                        <div className="mt-2 text-[10px] text-rose-700 font-bold text-center bg-rose-100 rounded-lg py-1">
                            Called {calls}× — count = {count}
                        </div>
                    )}
                </div>
            </div>

            {/* Closure arrow */}
            {outerDone && (
                <div className="flex items-center justify-center gap-2 py-1">
                    <div className="text-xs text-slate-500 italic text-center">
                        <span className="font-bold text-rose-600">increment</span> holds a live reference to <span className="font-mono font-bold text-indigo-600">count</span> even though <span className="font-bold">make_counter()</span> has returned.
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Decorator Wrapper Visual ──────────────────────────────────────────────────
function DecoratorPanel({ decoratorState }) {
    if (!decoratorState) return null;
    const { phase } = decoratorState;

    const phases = {
        defined: { label: 'Decorator Defined', active: 'none' },
        applied: { label: '@timer Applied', active: 'outer' },
        enter_wrapper: { label: 'Enter wrapper()', active: 'outer' },
        before_hook: { label: 'Before Hook ⚡', active: 'outer' },
        in_original: { label: 'Calling original func', active: 'inner' },
        after_hook: { label: 'After Hook ⚡', active: 'outer' },
        done: { label: 'wrapper returns result', active: 'none' },
    };

    const current = phases[phase] || phases.defined;
    const enterWrapper = ['enter_wrapper', 'before_hook', 'in_original', 'after_hook', 'done'].includes(phase);
    const inOriginal = phase === 'in_original';
    const afterHook = ['after_hook', 'done'].includes(phase);
    const beforeHook = ['before_hook', 'in_original', 'after_hook', 'done'].includes(phase);

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Decorator Wrapper Layers</h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    enterWrapper ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                    {current.label}
                </span>
            </div>

            {/* Three-layer decorator visual */}
            <div className="relative flex flex-col items-center gap-0">
                {/* @timer label */}
                <div className={`relative z-30 w-full max-w-xs text-center py-1.5 px-4 rounded-t-xl border-2 font-mono text-xs font-bold transition-all ${
                    ['applied', 'enter_wrapper', 'before_hook', 'after_hook', 'done'].includes(phase)
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-md'
                        : 'border-indigo-200 bg-indigo-50 text-indigo-400'
                }`}>
                    @timer
                </div>

                {/* Wrapper layer */}
                <div className={`relative z-20 w-full max-w-xs border-2 border-t-0 px-4 py-3 transition-all duration-300 ${
                    enterWrapper
                        ? 'border-amber-400 bg-amber-50 shadow-amber-100 shadow-md'
                        : 'border-amber-200 bg-amber-50/40'
                }`}>
                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">wrapper()</div>

                    {/* Before hook */}
                    <div className={`text-[11px] font-mono px-2 py-1 rounded mb-1.5 transition-all border ${
                        beforeHook ? 'bg-indigo-100 border-indigo-300 text-indigo-800 font-bold' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                        start = time.time()
                        {beforeHook && <span className="ml-2 text-indigo-600">← before</span>}
                    </div>

                    {/* Original function call slot */}
                    <div className={`relative text-[11px] font-mono px-2 py-2 rounded border-2 my-1 transition-all ${
                        inOriginal ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold shadow-sm' : 'border-slate-200 bg-white text-slate-400'
                    }`}>
                        {inOriginal && <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-emerald-500">▶</span>}
                        result = func(*args)

                        {/* Inner: Original function */}
                        <div className={`mt-1.5 text-[10px] rounded px-2 py-1 border transition-all ${
                            inOriginal ? 'bg-emerald-600 border-emerald-700 text-white font-bold' : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}>
                            slow_sum(n) — original
                        </div>
                    </div>

                    {/* After hook */}
                    <div className={`text-[11px] font-mono px-2 py-1 rounded mt-1.5 transition-all border ${
                        afterHook ? 'bg-rose-100 border-rose-300 text-rose-800 font-bold' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                        elapsed = time.time() - start
                        {afterHook && <span className="ml-2 text-rose-600">← after</span>}
                    </div>
                </div>

                {/* Bottom cap */}
                <div className={`relative z-20 w-full max-w-xs text-center py-1 border-2 border-t-0 rounded-b-xl text-[10px] font-bold transition-all ${
                    phase === 'done'
                        ? 'border-emerald-400 bg-emerald-100 text-emerald-800'
                        : 'border-amber-200 bg-amber-50/40 text-slate-400'
                }`}>
                    {phase === 'done' ? 'return result ✓' : 'return result'}
                </div>
            </div>

            {/* Execution flow legend */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-[10px]">
                {[
                    { color: 'bg-indigo-500', label: '@decorator applied' },
                    { color: 'bg-amber-400', label: 'wrapper active' },
                    { color: 'bg-emerald-500', label: 'original called' },
                    { color: 'bg-rose-400', label: 'after hook' },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1 text-slate-500">
                        <span className={`w-2 h-2 rounded-sm ${color}`} />
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RecursionDecoratorVisualizer() {
    const [selectedExId, setSelectedExId] = useState(EXAMPLES[0].id);
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [activeTab, setActiveTab] = useState('recursion');

    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const speedMs = speed === 'slow' ? 1400 : speed === 'normal' ? 750 : 320;

    // Standalone visualizer state (independent of code runner)
    const [recursionN, setRecursionN] = useState(5);
    const [recursionFrames, setRecursionFrames] = useState([]);
    const [recursionPhase, setRecursionPhase] = useState('idle'); // idle | pushing | popping | done
    const [recursionSpeed, setRecursionSpeed] = useState(500);
    const recursionTimer = useRef(null);

    const [closureCallCount, setClosureCallCount] = useState(0);
    const [closureOuterReturned, setClosureOuterReturned] = useState(false);
    const [closureCount, setClosureCount] = useState(0);

    const [decoratorEnabled, setDecoratorEnabled] = useState(true);
    const [decoratorPhase, setDecoratorPhase] = useState('idle');
    const decoratorTimer = useRef(null);

    // Challenge state
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const timerRef = useRef(null);

    // ── Code execution ──
    const resetExecution = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsRunning(false);
        setExecutionState(null);
        setCurrentStepIdx(-1);
    }, []);

    const runCode = useCallback(() => {
        resetExecution();
        const state = executeCode(code);
        setExecutionState(state);
        if (!state.steps.length) return;
        setCurrentStepIdx(0);
        setIsRunning(true);
    }, [code, resetExecution]);

    useEffect(() => {
        if (!isRunning || !executionState) return;
        if (currentStepIdx >= executionState.steps.length - 1) { setIsRunning(false); return; }
        timerRef.current = setTimeout(() => setCurrentStepIdx(p => p + 1), speedMs);
        return () => clearTimeout(timerRef.current);
    }, [isRunning, currentStepIdx, executionState, speedMs]);

    const stepForward = useCallback(() => {
        if (!executionState) { const s = executeCode(code); setExecutionState(s); setCurrentStepIdx(0); return; }
        if (currentStepIdx < executionState.steps.length - 1) setCurrentStepIdx(p => p + 1);
    }, [executionState, currentStepIdx, code]);

    const handleSelectExample = (id) => {
        const ex = EXAMPLES.find(e => e.id === id);
        if (!ex) return;
        setSelectedExId(id);
        setCode(ex.code);
        setActiveTab(ex.tab);
        resetExecution();
    };

    const currentStep = executionState?.steps[currentStepIdx] || null;
    const currentLineNum = currentStep?.lineNum || null;
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);
    const stackFrames = currentStep?.stackFrames || null;
    const closureState = currentStep?.closureState || null;
    const decoratorStateFromCode = currentStep?.decoratorState || null;

    // ── Standalone Recursion Animator ──
    const startRecursionAnim = () => {
        if (recursionTimer.current) clearInterval(recursionTimer.current);
        setRecursionFrames([]);
        setRecursionPhase('pushing');

        const pushQueue = [];
        for (let i = recursionN; i >= 0; i--) {
            pushQueue.push({ n: i, phase: i === 0 ? 'base' : 'calling' });
        }

        let pushIdx = 0;
        const built = [];

        recursionTimer.current = setInterval(() => {
            if (pushIdx < pushQueue.length) {
                built.push(pushQueue[pushIdx]);
                setRecursionFrames([...built]);
                pushIdx++;
            } else {
                clearInterval(recursionTimer.current);
                setRecursionPhase('popping');

                // Now pop with return values
                const retVals = [1];
                for (let i = 1; i <= recursionN; i++) retVals.push(i * retVals[retVals.length - 1]);

                let popIdx = 0;
                recursionTimer.current = setInterval(() => {
                    if (popIdx <= recursionN) {
                        const remaining = built.slice(0, recursionN - popIdx + 1);
                        if (remaining.length > 0) {
                            remaining[remaining.length - 1] = { ...remaining[remaining.length - 1], phase: 'returning', ret: retVals[remaining.length - 1] };
                        }
                        setRecursionFrames([...remaining]);
                        popIdx++;
                    } else {
                        clearInterval(recursionTimer.current);
                        setRecursionFrames([]);
                        setRecursionPhase('done');
                    }
                }, recursionSpeed);
            }
        }, recursionSpeed);
    };

    // ── Standalone Decorator Animator ──
    const runDecoratorAnim = () => {
        if (decoratorTimer.current) clearInterval(decoratorTimer.current);
        const decorPhases = decoratorEnabled
            ? ['enter_wrapper', 'before_hook', 'in_original', 'after_hook', 'done']
            : ['in_original', 'done'];
        let idx = 0;
        setDecoratorPhase(decorPhases[0]);
        decoratorTimer.current = setInterval(() => {
            idx++;
            if (idx < decorPhases.length) {
                setDecoratorPhase(decorPhases[idx]);
            } else {
                clearInterval(decoratorTimer.current);
            }
        }, 900);
    };

    return (
        <div className="space-y-4 text-slate-800">
            {/* ── Header ── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Recursion, Closures &amp; Decorators Visualizer
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/60 shrink-0 hidden sm:inline-block">
                            Module 6 · Topic 4
                        </span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Watch the <span className="font-semibold text-indigo-600">call stack grow and shrink</span> during recursion. See how <span className="font-semibold text-rose-600">closures capture outer variables</span> even after the outer function returns. Visualize how <span className="font-semibold text-amber-600">decorators wrap functions</span> with before/after hooks.
                </p>

                {/* Preset Tabs */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Presets:</span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 shrink-0">
                        {EXAMPLES.map((ex, i) => {
                            const isSelected = selectedExId === ex.id;
                            return (
                                <button
                                    key={ex.id}
                                    type="button"
                                    onClick={() => handleSelectExample(ex.id)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                        isSelected ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                    }`}
                                >
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>{i + 1}.</span>
                                    <span>{ex.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Concept tabs */}
                <div className="flex gap-1">
                    {[
                        { id: 'recursion', label: 'Recursion', icon: Layers, color: 'indigo' },
                        { id: 'closure', label: 'Closures', icon: Lock, color: 'rose' },
                        { id: 'decorator', label: 'Decorators', icon: Box, color: 'amber' },
                    ].map(({ id, label, icon: Icon, color }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                activeTab === id
                                    ? `bg-${color}-600 text-white border-${color}-600 shadow-sm`
                                    : `bg-white text-slate-600 border-slate-200 hover:border-${color}-300`
                            }`}
                            style={activeTab === id ? {
                                background: color === 'indigo' ? '#4f46e5' : color === 'rose' ? '#e11d48' : '#d97706',
                                borderColor: color === 'indigo' ? '#4f46e5' : color === 'rose' ? '#e11d48' : '#d97706',
                            } : {}}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Main Two-Column Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left: Code Editor */}
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
                        badgeText="Recursion Engine"
                        fileName={selectedExId === 'factorial' ? 'factorial.py' : selectedExId === 'make_counter' ? 'closure.py' : 'decorator.py'}
                    />
                </div>

                {/* Right: Visualizers */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">

                    {/* ── Recursion Tab ── */}
                    {activeTab === 'recursion' && (
                        <div className="space-y-4">
                            <CallStackPanel frames={stackFrames || []} />
                            
                            {/* Recursion Insight Box */}
                            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                                <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                    <span>Recursion Mechanics: Stack Growth &amp; Unwinding</span>
                                </div>
                                <p className="text-xs text-indigo-800 leading-relaxed">
                                    Each recursive call pushes a new frame with its own local parameter <code className="font-mono bg-white px-1 rounded">n</code> onto the call stack. When <code className="font-mono bg-white px-1 rounded">n == 0</code> (the base case), the stack stops growing and begins unwinding, multiplying return values back down to the caller.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Closure Tab ── */}
                    {activeTab === 'closure' && (
                        <div className="space-y-4">
                            {closureState ? (
                                <ClosurePanel closureState={closureState} />
                            ) : (
                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs italic bg-white">
                                    Click "Run Code" or "Step Forward" to trace the outer frame and retained closure cell.
                                </div>
                            )}

                            {/* Closure Insight Box */}
                            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                                <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                                    <Lock className="w-4 h-4 text-rose-600" />
                                    <span>Closure Mechanics: Retained Enclosing State</span>
                                </div>
                                <p className="text-xs text-rose-800 leading-relaxed">
                                    Even after <code className="font-mono bg-white px-1 rounded">make_counter()</code> finishes and its stack frame is discarded, the returned <code className="font-mono bg-white px-1 rounded">increment()</code> function preserves access to <code className="font-mono bg-white px-1 rounded">count</code> inside its private closure cell via <code className="font-mono bg-white px-1 rounded">nonlocal</code>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Decorator Tab ── */}
                    {activeTab === 'decorator' && (
                        <div className="space-y-4">
                            {decoratorStateFromCode ? (
                                <DecoratorPanel decoratorState={decoratorStateFromCode} />
                            ) : (
                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs italic bg-white">
                                    Click "Run Code" or "Step Forward" to watch the decorator wrap and measure the function.
                                </div>
                            )}

                            {/* Decorator Insight Box */}
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                                    <Box className="w-4 h-4 text-amber-600" />
                                    <span>Decorator Mechanics: Metaprogramming Wrapper</span>
                                </div>
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    <code className="font-mono bg-white px-1 rounded">@timer</code> is syntactic sugar for <code className="font-mono bg-white px-1 rounded">slow_sum = timer(slow_sum)</code>. The wrapper intercepts every call, executes pre-logic (start timer), delegates to the original function, and runs post-logic (calculating elapsed time).
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Challenge Quiz ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <HelpCircle className="w-4 h-4 text-indigo-600" />
                                <span>Try It Yourself: Predict the Output</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                                Q {challengeIdx + 1}/{CHALLENGES.length}
                            </span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0b101b] text-slate-100 font-mono text-xs">
                            <pre className="whitespace-pre-wrap">{CHALLENGES[challengeIdx].code}</pre>
                        </div>
                        <p className="text-xs font-semibold text-slate-800">{CHALLENGES[challengeIdx].question}</p>

                        <div className="grid grid-cols-2 gap-2">
                            {CHALLENGES[challengeIdx].options.map((opt) => {
                                const isPicked = selectedAnswer === opt;
                                const isCorrect = opt === CHALLENGES[challengeIdx].correct;
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => { setSelectedAnswer(opt); setShowExplanation(true); }}
                                        className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold text-left border cursor-pointer transition-all ${
                                            showExplanation
                                                ? isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                                : isPicked ? 'bg-rose-50 border-rose-400 text-rose-800'
                                                : 'bg-slate-50 border-slate-200 text-slate-400'
                                                : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                    {selectedAnswer === CHALLENGES[challengeIdx].correct
                                        ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        : <XCircle className="w-4 h-4 text-rose-600" />}
                                    <span>{selectedAnswer === CHALLENGES[challengeIdx].correct ? 'Correct!' : 'Not quite!'}</span>
                                </div>
                                <p className="leading-relaxed">{CHALLENGES[challengeIdx].explanation}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setChallengeIdx(p => (p + 1) % CHALLENGES.length);
                                        setSelectedAnswer(null);
                                        setShowExplanation(false);
                                    }}
                                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    Next Challenge <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
