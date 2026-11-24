import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    ShieldCheck, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle,
    ArrowRight, Check, X, Shield, Lock, Eye, Zap, Flame
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 4: Extended Patterns, Greedy vs Lazy & Validation
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'greedy-vs-lazy',
        label: 'Greedy (.*) vs Lazy (.*?) Arena',
        code: `import re

html = "<b>Bold 1</b> and <b>Bold 2</b>"

# 1. Greedy (default): Matches as MUCH as humanly possible!
greedy_matches = re.findall(r"<b>.*</b>", html)
print("Greedy Match (1 huge item):", greedy_matches)

# 2. Lazy (.*?): Matches the MINIMUM necessary!
lazy_matches = re.findall(r"<b>.*?</b>", html)
print("Lazy Matches (2 separate items):", lazy_matches)`,
        steps: [
            {
                lineNum: 1,
                action: 'load_engine',
                detail: 'import re loaded',
                activeArena: null,
                greedyResult: null,
                lazyResult: null,
                explanation: 'Loads regular expression engine.',
                variables: {},
                outputs: []
            },
            {
                lineNum: 3,
                action: 'load_html',
                detail: 'html = "<b>Bold 1</b> and <b>Bold 2</b>" loaded',
                activeArena: null,
                greedyResult: null,
                lazyResult: null,
                explanation: 'String contains two distinct <b> HTML tags separated by text.',
                variables: { html: '"<b>Bold 1</b> and <b>Bold 2</b>"' },
                outputs: []
            },
            {
                lineNum: 6,
                action: 'run_greedy',
                detail: 'Greedy quantifier .* eats from first <b> to LAST </b>!',
                activeArena: 'greedy',
                greedyResult: ['<b>Bold 1</b> and <b>Bold 2</b>'],
                lazyResult: null,
                explanation: 'Greedy .* is hungry! It does not stop at the first </b>. It swallows " and <b>Bold 2" to reach the final </b>!',
                variables: { greedy_matches: "['<b>Bold 1</b> and <b>Bold 2</b>']" },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'print_greedy',
                detail: 'print("Greedy Match:", [\'<b>Bold 1</b> and <b>Bold 2</b>\'])',
                activeArena: 'greedy',
                greedyResult: ['<b>Bold 1</b> and <b>Bold 2</b>'],
                lazyResult: null,
                explanation: 'Prints the single giant greedy match.',
                variables: { greedy_matches: "['<b>Bold 1</b> and <b>Bold 2</b>']" },
                outputs: ["Greedy Match (1 huge item): ['<b>Bold 1</b> and <b>Bold 2</b>']"]
            },
            {
                lineNum: 10,
                action: 'run_lazy',
                detail: 'Lazy quantifier .*? stops immediately at first </b>!',
                activeArena: 'lazy',
                greedyResult: ['<b>Bold 1</b> and <b>Bold 2</b>'],
                lazyResult: ['<b>Bold 1</b>', '<b>Bold 2</b>'],
                explanation: 'Appending "?" makes the quantifier lazy. It halts at the earliest valid closing tag, producing 2 distinct tags!',
                variables: { lazy_matches: "['<b>Bold 1</b>', '<b>Bold 2</b>']" },
                outputs: ["Greedy Match (1 huge item): ['<b>Bold 1</b> and <b>Bold 2</b>']"]
            },
            {
                lineNum: 11,
                action: 'print_lazy',
                detail: 'print("Lazy Matches:", [\'<b>Bold 1</b>\', \'<b>Bold 2</b>\'])',
                activeArena: 'lazy',
                greedyResult: ['<b>Bold 1</b> and <b>Bold 2</b>'],
                lazyResult: ['<b>Bold 1</b>', '<b>Bold 2</b>'],
                explanation: 'Successfully harvested clean, isolated tags.',
                variables: { lazy_matches: "['<b>Bold 1</b>', '<b>Bold 2</b>']" },
                outputs: [
                    "Greedy Match (1 huge item): ['<b>Bold 1</b> and <b>Bold 2</b>']",
                    "Lazy Matches (2 separate items): ['<b>Bold 1</b>', '<b>Bold 2</b>']"
                ]
            }
        ]
    },
    {
        id: 'email-validation',
        label: 'Production Email & Phone Validator',
        code: `import re

# Comprehensive email validation pattern
EMAIL_REGEX = r"^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$"

def validate_email(email):
    return bool(re.fullmatch(EMAIL_REGEX, email))

e1 = "student@univ.edu"
e2 = "invalid-email@com"  # Missing dot domain!

print("student@univ.edu valid?", validate_email(e1))
print("invalid-email@com valid?", validate_email(e2))`,
        steps: [
            {
                lineNum: 4,
                action: 'compile_email_regex',
                detail: 'EMAIL_REGEX = r"^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$" compiled',
                activeArena: 'validation',
                validations: [
                    { email: 'student@univ.edu', valid: true },
                    { email: 'invalid-email@com', valid: false }
                ],
                explanation: 'Demands string begins with username characters, an "@" symbol, a domain name, a dot, and a top-level domain.',
                variables: { EMAIL_REGEX: 'r"^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$"' },
                outputs: []
            },
            {
                lineNum: 11,
                action: 'validate_e1',
                detail: 'validate_email("student@univ.edu") → True ✓',
                activeArena: 'validation',
                validations: [
                    { email: 'student@univ.edu', valid: true },
                    { email: 'invalid-email@com', valid: false }
                ],
                explanation: 'Fullmatch succeeds across entire string.',
                variables: { e1: '"student@univ.edu"' },
                outputs: ['student@univ.edu valid? True']
            },
            {
                lineNum: 12,
                action: 'validate_e2',
                detail: 'validate_email("invalid-email@com") → False (Missing dot in domain)',
                activeArena: 'validation',
                validations: [
                    { email: 'student@univ.edu', valid: true },
                    { email: 'invalid-email@com', valid: false }
                ],
                explanation: '"invalid-email@com" lacks the required \\.\\w+ extension. Rejected by validation gate!',
                variables: { e2: '"invalid-email@com"' },
                outputs: ['student@univ.edu valid? True', 'invalid-email@com valid? False']
            }
        ]
    }
];

export default function GreedyLazyValidationVisualizer() {
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
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 leading-none">
                                Extended Patterns, Greedy Matching &amp; Validation
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
                        terminalLines={terminalLines}
                        badgeText="Pattern Gate"
                        fileName="greedy_and_validation.py"
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

                {/* Right Column: Visual Box Diagrams */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {selectedExample === 0 ? (
                        /* ======================================================== */
                        /* PRESET 1: GREEDY BEAST VS LAZY SNIPER ARENA              */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Greedy (.*) vs Lazy (.*?) Arena
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                                    Quantifier Semantics
                                </span>
                            </div>

                            {/* Raw HTML Target Display */}
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs">
                                <div className="text-[10px] text-slate-400 mb-1">TARGET STRING:</div>
                                <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-200">
                                    &lt;b&gt;Bold 1&lt;/b&gt; and &lt;b&gt;Bold 2&lt;/b&gt;
                                </div>
                            </div>

                            {/* GREEDY BEAST BOX */}
                            <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                currentStepData?.activeArena === 'greedy'
                                    ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-200'
                                    : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-xs text-amber-950 font-mono">
                                        <Flame className="w-4 h-4 text-amber-600" />
                                        <span>THE GREEDY BEAST: r&quot;&lt;b&gt;.*&lt;/b&gt;&quot;</span>
                                    </div>
                                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                                        1 GIANT SWALLOWED MATCH
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    The dot-star <code className="font-mono bg-white px-1 rounded font-bold">.*</code> is gluttonous by default. It eats past the first <code className="font-mono">&lt;/b&gt;</code> and swallows all the text in between until the very last closing tag!
                                </p>
                                {currentStepData?.greedyResult && (
                                    <div className="p-2 bg-amber-100 rounded-lg font-mono text-xs text-amber-900 border border-amber-300 font-bold">
                                        Match 1: &quot;{currentStepData.greedyResult[0]}&quot;
                                    </div>
                                )}
                            </div>

                            {/* LAZY SNIPER BOX */}
                            <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                                currentStepData?.activeArena === 'lazy'
                                    ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                                    : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-950 font-mono">
                                        <Zap className="w-4 h-4 text-emerald-600" />
                                        <span>THE LAZY SNIPER: r&quot;&lt;b&gt;.*?&lt;/b&gt;&quot;</span>
                                    </div>
                                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                                        2 SEPARATE PRECISION MATCHES
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Adding <code className="font-mono bg-white px-1 rounded font-bold">?</code> tames the quantifier. It stops at the very first closing tag, capturing each tag individually!
                                </p>
                                {currentStepData?.lazyResult && (
                                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-900 border border-emerald-300 font-bold text-center">
                                            &quot;{currentStepData.lazyResult[0]}&quot;
                                        </div>
                                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-900 border border-emerald-300 font-bold text-center">
                                            &quot;{currentStepData.lazyResult[1]}&quot;
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ======================================================== */
                        /* PRESET 2: PRODUCTION EMAIL VALIDATION GATE               */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Production Data Validation Gate
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                                    re.fullmatch Security Shield
                                </span>
                            </div>

                            {/* Schema Anatomy Box */}
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-2">
                                <div className="text-[10px] text-slate-400">EMAIL REGEX SCHEMA ANATOMY:</div>
                                <div className="grid grid-cols-4 gap-1 text-center text-[11px]">
                                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-emerald-300">
                                        ^[\w\.-]+
                                        <div className="text-[9px] text-slate-400">Username</div>
                                    </div>
                                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-violet-300">
                                        @
                                        <div className="text-[9px] text-slate-400">At Sign</div>
                                    </div>
                                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-sky-300">
                                        [\w\.-]+
                                        <div className="text-[9px] text-slate-400">Domain</div>
                                    </div>
                                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-amber-300">
                                        \.\w+$
                                        <div className="text-[9px] text-slate-400">TLD</div>
                                    </div>
                                </div>
                            </div>

                            {/* Validation Result Cards */}
                            <div className="space-y-2 font-mono text-xs">
                                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span className="font-bold text-emerald-950">&quot;student@univ.edu&quot;</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                                        VALID EMAIL ✓
                                    </span>
                                </div>

                                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                                        <span className="font-bold text-rose-950">&quot;invalid-email@com&quot;</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                                        REJECTED: Missing Dot Domain ✕
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                By anchoring with <code className="font-mono bg-slate-100 px-1 rounded font-bold">^</code> and <code className="font-mono bg-slate-100 px-1 rounded font-bold">$</code> and calling <code className="font-mono">re.fullmatch()</code>, the validation gate guarantees that the entire string complies strictly with expected formatting before storing it in your database.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

