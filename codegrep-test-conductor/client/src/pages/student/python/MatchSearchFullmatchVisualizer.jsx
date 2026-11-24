import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Search, Radar, Target, Sparkles, CheckCircle2,
    XCircle, ArrowRight, Box, Layers, Code2
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 2: match vs search vs fullmatch
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'match-vs-search',
        label: 'match() vs search()',
        code: `import re

text = "Order 4521 shipped"

# 1. match() checks ONLY at index 0
m1 = re.match(r"\\d+", text)
print("re.match(\\d+):", m1)  # None!

# 2. search() scans the ENTIRE string
m2 = re.search(r"\\d+", text)
if m2:
    print("re.search(\\d+):", m2.group())
    print("Found at span:", m2.span())`,
        steps: [
            {
                lineNum: 1,
                action: 'load_engine',
                detail: 'import re loaded',
                activeMethod: null,
                matchState: null,
                searchState: null,
                fullmatchState: null,
                targetIndex: null,
                explanation: 'Regex engine loaded.',
                variables: {},
                outputs: []
            },
            {
                lineNum: 3,
                action: 'load_text',
                detail: 'text initialized in memory',
                activeMethod: null,
                matchState: null,
                searchState: null,
                fullmatchState: null,
                targetIndex: null,
                explanation: 'Target string loaded for positional scanning.',
                variables: {},
                outputs: []
            },
            {
                lineNum: 6,
                action: 'execute_match',
                detail: 're.match(r"\\d+", text) inspects index 0 only',
                activeMethod: 'match',
                matchState: 'evaluated',
                searchState: null,
                fullmatchState: null,
                targetIndex: 0,
                explanation: 're.match() checks ONLY index 0. If the first character is not a match, it returns None immediately!',
                variables: { m1: 'None' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'print_match',
                detail: 'print("re.match(\\d+):", m1)',
                activeMethod: 'match',
                matchState: 'evaluated',
                searchState: null,
                fullmatchState: null,
                targetIndex: 0,
                explanation: 'Prints match() evaluation result.',
                variables: { m1: 'None' },
                outputs: ['re.match(\\d+): None']
            },
            {
                lineNum: 10,
                action: 'execute_search',
                detail: 're.search(r"\\d+", text) sweeps entire string',
                activeMethod: 'search',
                matchState: 'evaluated',
                searchState: 'evaluated',
                fullmatchState: null,
                targetIndex: null,
                explanation: 're.search() roams freely across the entire string until it encounters the first occurrence.',
                variables: {},
                outputs: ['re.match(\\d+): None']
            },
            {
                lineNum: 12,
                action: 'print_search_group',
                detail: 'print("re.search(\\d+):", m2.group())',
                activeMethod: 'search',
                matchState: 'evaluated',
                searchState: 'evaluated',
                fullmatchState: null,
                targetIndex: null,
                explanation: 'Outputs the matched substring.',
                variables: {},
                outputs: ['re.match(\\d+): None', 're.search(\\d+): 4521']
            },
            {
                lineNum: 13,
                action: 'print_search_span',
                detail: 'print("Found at span:", m2.span())',
                activeMethod: 'search',
                matchState: 'evaluated',
                searchState: 'evaluated',
                fullmatchState: null,
                targetIndex: null,
                explanation: 'Outputs span tuple.',
                variables: {},
                outputs: [
                    're.match(\\d+): None',
                    're.search(\\d+): 4521',
                    'Found at span: (6, 10)'
                ]
            }
        ]
    },
    {
        id: 'fullmatch-validation',
        label: 'fullmatch() Validation',
        code: `import re

# fullmatch requires 100% of characters to match pattern
pin_valid = "4829"
pin_invalid = "4829abc"

print("pin_valid:", re.fullmatch(r"\\d{4}", pin_valid))      # Match object
print("pin_invalid:", re.fullmatch(r"\\d{4}", pin_invalid))  # None!`,
        steps: [
            {
                lineNum: 4,
                action: 'load_pins',
                detail: 'pin_valid = "4829", pin_invalid = "4829abc"',
                activeMethod: 'fullmatch',
                matchState: null,
                searchState: null,
                fullmatchState: 'loaded',
                targetIndex: null,
                explanation: 'Loaded candidate security PIN strings.',
                variables: {},
                outputs: []
            },
            {
                lineNum: 7,
                action: 'eval_valid',
                detail: 're.fullmatch(r"\\d{4}", "4829") -> 100% of characters are 4 digits',
                activeMethod: 'fullmatch',
                matchState: null,
                searchState: null,
                fullmatchState: 'passed',
                targetIndex: null,
                explanation: 're.fullmatch succeeds only when the entire string conforms from index 0 to length-1.',
                variables: {},
                outputs: ["pin_valid: <re.Match object; span=(0, 4), match='4829'>"]
            },
            {
                lineNum: 8,
                action: 'eval_invalid',
                detail: 're.fullmatch(r"\\d{4}", "4829abc") -> Fails due to trailing "abc"',
                activeMethod: 'fullmatch',
                matchState: null,
                searchState: null,
                fullmatchState: 'failed',
                targetIndex: null,
                explanation: 'Trailing non-digit characters violate the 100% whole-string boundary requirement.',
                variables: {},
                outputs: [
                    "pin_valid: <re.Match object; span=(0, 4), match='4829'>",
                    "pin_invalid: None"
                ]
            }
        ]
    }
];

export default function MatchSearchFullmatchVisualizer() {
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

    // ─────────────────────────────────────────────────────────────
    // LIVE REACTIVE REGEX PARSING
    // ─────────────────────────────────────────────────────────────
    const activeText = useMemo(() => {
        const m = code.match(/text\s*=\s*["'](.*?)["']/);
        return m ? m[1] : "Order 4521 shipped";
    }, [code]);

    const liveMatchResult = useMemo(() => {
        const m = activeText.match(/^\d+/);
        return m ? { val: m[0], span: [0, m[0].length] } : null;
    }, [activeText]);

    const liveSearchResult = useMemo(() => {
        const m = activeText.match(/\d+/);
        if (m) {
            return { val: m[0], span: [m.index, m.index + m[0].length] };
        }
        return null;
    }, [activeText]);

    const dynamicOutputs = useMemo(() => {
        if (selectedExample === 0) {
            const out = [];
            if (currentStep >= 3) {
                out.push(`re.match(\\d+): ${liveMatchResult ? `<re.Match span=${JSON.stringify(liveMatchResult.span)}>` : 'None'}`);
            }
            if (currentStep >= 5) {
                out.push(`re.search(\\d+): ${liveSearchResult ? liveSearchResult.val : 'None'}`);
            }
            if (currentStep >= 6 && liveSearchResult) {
                out.push(`Found at span: (${liveSearchResult.span[0]}, ${liveSearchResult.span[1]})`);
            }
            return out;
        }
        return currentStepData?.outputs || [];
    }, [selectedExample, currentStep, liveMatchResult, liveSearchResult, currentStepData]);

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

    const handleQuickTest = (newText) => {
        const updated = code.replace(/text\s*=\s*["'].*?["']/, `text = "${newText}"`);
        setCode(updated);
        resetExecution();
    };

    const statusText = currentStepData
        ? `${currentStepData.action.toUpperCase()}: ${currentStepData.detail}`
        : 'Ready — edit code or values anytime';
    const stepCounterText = currentStep >= 0
        ? `Step ${currentStep + 1} / ${steps.length}`
        : `Ready (0 / ${steps.length})`;

    return (
        <div className="space-y-4 animate-fadeIn">
            {/* Top Bar – Just a Clean Title without subtitle clutter */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
                            <Radar className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-slate-900 leading-none">
                            match vs search vs fullmatch
                        </h2>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {EXAMPLES.map((ex, idx) => (
                            <button
                                key={ex.id}
                                onClick={() => loadExample(idx)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedExample === idx
                                        ? 'bg-cyan-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                }`}
                            >
                                <span>{ex.label}</span>
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
                        terminalLines={dynamicOutputs}
                        badgeText="re Scanner"
                        fileName="match_vs_search.py"
                        accentColor="#0891b2"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: 3-Mode Radar Scanner Comparison Box (Sticky) */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                                <Radar className="w-4 h-4 text-cyan-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Interactive Positional Radar
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded border border-cyan-200">
                                Live String: &quot;{activeText}&quot;
                            </span>
                        </div>

                        {/* Quick Test Value Presets */}
                        {selectedExample === 0 && (
                            <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
                                <span className="text-slate-400 font-medium">Quick Values:</span>
                                {[
                                    'Order 4521 shipped',
                                    '999 items ready',
                                    'Parcel #772 in transit'
                                ].map((t, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleQuickTest(t)}
                                        className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono cursor-pointer transition-colors ${
                                            activeText === t
                                                ? 'bg-cyan-100 text-cyan-800 border-cyan-300 font-bold'
                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        Preset {idx + 1}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* MODE 1: MATCH BOX */}
                        <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                            currentStepData?.activeMethod === 'match'
                                ? 'bg-cyan-50/90 border-cyan-500 shadow-md ring-2 ring-cyan-200'
                                : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-mono font-bold text-xs text-cyan-950">
                                    <Target className="w-4 h-4 text-cyan-600" />
                                    <span>re.match(r&quot;\d+&quot;, text)</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    liveMatchResult
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                }`}>
                                    {liveMatchResult ? `MATCH AT INDEX 0 ("${liveMatchResult.val}")` : 'RETURNS NONE (Index 0 Not A Digit)'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Checks <strong>only at the very beginning (index 0)</strong>. Character 0 is &quot;{activeText[0] || ''}&quot;.
                            </p>
                        </div>

                        {/* MODE 2: SEARCH BOX */}
                        <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                            currentStepData?.activeMethod === 'search'
                                ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                                : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-mono font-bold text-xs text-emerald-950">
                                    <Search className="w-4 h-4 text-emerald-600" />
                                    <span>re.search(r&quot;\d+&quot;, text)</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    liveSearchResult
                                        ? 'bg-emerald-200 text-emerald-900 font-bold'
                                        : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {liveSearchResult ? `FOUND "${liveSearchResult.val}" at [${liveSearchResult.span.join('..')}] ✓` : 'NO DIGITS FOUND'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Scans the <strong>entire string</strong> until encountering the first match anywhere.
                            </p>
                        </div>

                        {/* MODE 3: FULLMATCH BOX */}
                        <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                            selectedExample === 1
                                ? 'bg-purple-50/90 border-purple-500 shadow-md ring-2 ring-purple-200'
                                : 'bg-slate-50 border-slate-200 opacity-70'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-mono font-bold text-xs text-purple-950">
                                    <Box className="w-4 h-4 text-purple-600" />
                                    <span>re.fullmatch(r&quot;\d{'{4}'}&quot;, pin)</span>
                                </div>
                                <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                                    Exact 100% Boundary
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Requires the <strong>entire string</strong> from index 0 to length-1 to match. Trailing characters cause rejection.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
