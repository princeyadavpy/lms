import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Scan, Sparkles, CheckCircle2, ArrowRight,
    Search, Binary, Code2, Layers, Cpu, Check, X, Eye
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 1: Introduction to RegEx & Pattern Symbols
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'symbols-digits-words',
        label: 'Digits & Quantifiers (\\d{3}-\\w+)',
        code: `import re

# Raw string r"..." prevents Python escape issues
pattern = r"\\d{3}-\\w+"
text = "Order 981-PRO shipped"

match = re.search(pattern, text)
if match:
    print("Found Pattern:", match.group())
    print("At Indices:", match.span())`,
        steps: [
            {
                lineNum: 1,
                action: 'import_re',
                detail: 'import re module loaded into runtime',
                explanation: 'Imports Python\'s built-in regular expression engine.',
                activeToken: null,
                activeSpan: null,
                tokens: [
                    { sym: '\\d', label: 'Digit [0-9]', active: false },
                    { sym: '{3}', label: 'Exactly 3 times', active: false },
                    { sym: '-', label: 'Literal dash', active: false },
                    { sym: '\\w+', label: '1+ Word Chars [a-zA-Z0-9_]', active: false }
                ],
                variables: {},
                outputs: []
            },
            {
                lineNum: 4,
                action: 'compile_pattern',
                detail: 'pattern = r"\\d{3}-\\w+" compiled into DFA state machine',
                explanation: 'Raw string r"..." treats backslashes literally. The pattern demands: exactly 3 digits, a dash, then 1 or more word characters.',
                activeToken: null,
                activeSpan: null,
                tokens: [
                    { sym: '\\d', label: 'Digit [0-9]', active: true },
                    { sym: '{3}', label: 'Exactly 3 times', active: true },
                    { sym: '-', label: 'Literal dash', active: true },
                    { sym: '\\w+', label: '1+ Word Chars', active: true }
                ],
                variables: { pattern: 'r"\\d{3}-\\w+"' },
                outputs: []
            },
            {
                lineNum: 5,
                action: 'load_text',
                detail: 'text = "Order 981-PRO shipped" loaded onto character conveyor',
                explanation: 'Target string is partitioned into indexed character slots [0..21].',
                activeToken: null,
                activeSpan: null,
                tokens: [
                    { sym: '\\d', label: 'Digit [0-9]', active: false },
                    { sym: '{3}', label: 'Exactly 3 times', active: false },
                    { sym: '-', label: 'Literal dash', active: false },
                    { sym: '\\w+', label: '1+ Word Chars', active: false }
                ],
                variables: { pattern: 'r"\\d{3}-\\w+"', text: '"Order 981-PRO shipped"' },
                outputs: []
            },
            {
                lineNum: 7,
                action: 'execute_search',
                detail: 'Optical scanner hits match at indices [6..13]: "981-PRO"',
                explanation: 'The regex scanner scans characters: "Order " fails \\d. At index 6, "981" satisfies \\d{3}, "-" matches dash, "PRO" satisfies \\w+!',
                activeToken: 'ALL',
                activeSpan: [6, 13],
                tokens: [
                    { sym: '\\d', label: 'Digit: 9, 8, 1', active: true, matched: '981' },
                    { sym: '{3}', label: 'Count: 3', active: true, matched: '3' },
                    { sym: '-', label: 'Literal: -', active: true, matched: '-' },
                    { sym: '\\w+', label: 'Word: PRO', active: true, matched: 'PRO' }
                ],
                variables: { match: '<re.Match object; span=(6, 13), match=\'981-PRO\'>' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'print_group',
                detail: 'print("Found Pattern:", match.group()) → "981-PRO"',
                explanation: 'match.group() retrieves the matched substring.',
                activeToken: 'ALL',
                activeSpan: [6, 13],
                tokens: [
                    { sym: '\\d', label: 'Digit [0-9]', active: true, matched: '981' },
                    { sym: '{3}', label: 'Count: 3', active: true, matched: '3' },
                    { sym: '-', label: 'Literal: -', active: true, matched: '-' },
                    { sym: '\\w+', label: '1+ Word Chars', active: true, matched: 'PRO' }
                ],
                variables: { match: '<re.Match>' },
                outputs: ['Found Pattern: 981-PRO']
            },
            {
                lineNum: 10,
                action: 'print_span',
                detail: 'print("At Indices:", match.span()) → (6, 13)',
                explanation: 'match.span() outputs start index 6 and end index 13.',
                activeToken: 'ALL',
                activeSpan: [6, 13],
                tokens: [
                    { sym: '\\d', label: 'Digit [0-9]', active: true, matched: '981' },
                    { sym: '{3}', label: 'Count: 3', active: true, matched: '3' },
                    { sym: '-', label: 'Literal: -', active: true, matched: '-' },
                    { sym: '\\w+', label: '1+ Word Chars', active: true, matched: 'PRO' }
                ],
                variables: { match: '<re.Match>' },
                outputs: ['Found Pattern: 981-PRO', 'At Indices: (6, 13)']
            }
        ]
    },
    {
        id: 'anchors-wildcards',
        label: 'Anchors (^, $) & Wildcards (.)',
        code: `import re

# ^ means start of string, $ means end of string
pattern = r"^Cat.+$"

line1 = "Catnip is green"
line2 = "The Cat jumped"

print("Line 1 match:", bool(re.search(pattern, line1)))
print("Line 2 match:", bool(re.search(pattern, line2)))`,
        steps: [
            {
                lineNum: 4,
                action: 'define_anchor_pattern',
                detail: 'pattern = r"^Cat.+$" (Starts with "Cat", ends at end of string)',
                explanation: '^ asserts the match begins at the 0th character. . matches any character. + means 1 or more characters until $.',
                variables: { pattern: 'r"^Cat.+$"' },
                outputs: []
            },
            {
                lineNum: 9,
                action: 'test_line1',
                detail: 're.search(pattern, "Catnip is green") → MATCH! Starts with "Cat"',
                explanation: 'Starts with "Cat" at index 0, and continues to the end. Matches successfully.',
                variables: { line1: '"Catnip is green"' },
                outputs: ['Line 1 match: True']
            },
            {
                lineNum: 10,
                action: 'test_line2',
                detail: 're.search(pattern, "The Cat jumped") → NO MATCH! Starts with "The"',
                explanation: 'Even though "Cat" is in the string, it is NOT at index 0 (^ anchor). Returns None.',
                variables: { line2: '"The Cat jumped"' },
                outputs: ['Line 1 match: True', 'Line 2 match: False']
            }
        ]
    }
];

export default function RegexSymbolsVisualizer() {
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

    // Dynamic Reactive String & Span Parsing
    const activeText = useMemo(() => {
        const m = code.match(/text\s*=\s*["'](.*?)["']/);
        return m ? m[1] : "Order 981-PRO shipped";
    }, [code]);

    const liveMatchSpan = useMemo(() => {
        try {
            const m = activeText.match(/\d{3}-\w+/);
            if (m) {
                return [m.index, m.index + m[0].length];
            }
        } catch {}
        return null;
    }, [activeText]);

    const dynamicOutputs = useMemo(() => {
        const out = [];
        if (currentStep >= 3 && liveMatchSpan) {
            const matchedText = activeText.substring(liveMatchSpan[0], liveMatchSpan[1]);
            out.push(`Found Pattern: ${matchedText}`);
        }
        if (currentStep >= 4 && liveMatchSpan) {
            out.push(`At Indices: (${liveMatchSpan[0]}, ${liveMatchSpan[1]})`);
        }
        return out;
    }, [currentStep, activeText, liveMatchSpan]);

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

    const sampleString = "Order 981-PRO shipped";

    return (
        <div className="space-y-5 animate-fadeIn">
            {/* Top Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-200/80">
                            <Scan className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                            <span className="ref-label text-[10px]">MODULE 9 • TOPIC 1</span>
                            <h2 className="text-sm font-bold text-slate-900 leading-none mt-0.5">
                                Introduction to RegEx &amp; Pattern Symbols
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
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
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
                        badgeText="Regex Engine"
                        fileName="regex_symbols.py"
                        accentColor="#7c3aed"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Regex Optical Scanner & Token Ribbon */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin] font-sans">
                    {/* TOKEN DECODER LENSES BOX */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="ref-label">
                                <Scan className="w-4 h-4 text-violet-600" />
                                <span>
                                    OPTICAL PATTERN LENSES: r&quot;\d{'{'}3{'}'}-\w+&quot;
                                </span>
                            </div>
                            <span className="ref-badge-green font-mono">
                                Raw String Format
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                            <div className="p-3 bg-violet-50/80 border border-violet-200 rounded-xl space-y-1">
                                <div className="text-base font-bold text-violet-800">\d</div>
                                <div className="text-[10px] text-slate-500 font-sans">Any Digit [0-9]</div>
                            </div>
                            <div className="p-3 bg-violet-50/80 border border-violet-200 rounded-xl space-y-1">
                                <div className="text-base font-bold text-violet-800">{'{'}3{'}'}</div>
                                <div className="text-[10px] text-slate-500 font-sans">Quantifier: Exactly 3</div>
                            </div>
                            <div className="p-3 bg-violet-50/80 border border-violet-200 rounded-xl space-y-1">
                                <div className="text-base font-bold text-violet-800">-</div>
                                <div className="text-[10px] text-slate-500 font-sans">Literal Dash &apos;-&apos;</div>
                            </div>
                            <div className="p-3 bg-violet-50/80 border border-violet-200 rounded-xl space-y-1">
                                <div className="text-base font-bold text-violet-800">\w+</div>
                                <div className="text-[10px] text-slate-500 font-sans">1+ Word Chars [a-zA-Z0-9_]</div>
                            </div>
                        </div>

                        {/* CHARACTER CONVEYOR BELT TRACK */}
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                                <span>CHARACTER CONVEYOR TRACK [text]</span>
                                <span className={currentStepData?.activeSpan ? 'text-emerald-400 font-bold' : ''}>
                                    {currentStepData?.activeSpan ? 'MATCH ACTIVE [6..13]' : 'IDLE'}
                                </span>
                            </div>

                            {/* Character Tiles */}
                            <div className="flex gap-1 overflow-x-auto py-2 font-mono text-xs">
                                {activeText.split('').map((char, idx) => {
                                    const isMatch = currentStep >= 3 && liveMatchSpan && idx >= liveMatchSpan[0] && idx < liveMatchSpan[1];
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex flex-col items-center justify-center w-7 h-10 rounded shrink-0 border transition-all ${
                                                isMatch
                                                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md scale-105'
                                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                            }`}
                                        >
                                            <span className="text-[9px] text-slate-400 select-none">{idx}</span>
                                            <span className="text-xs">{char === ' ' ? '␣' : char}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {currentStepData?.activeSpan && (
                                <div className="p-2 bg-emerald-950/80 border border-emerald-500/80 rounded-lg text-emerald-300 text-xs flex items-center justify-between font-mono">
                                    <span>MATCHED SUBSTRING: &quot;981-PRO&quot;</span>
                                    <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded font-bold">span=(6, 13)</span>
                                </div>
                            )}
                        </div>

                        {/* COMMON SYMBOLS CHEAT-SHEET BOX */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="font-mono font-bold text-violet-700">^</span> / <span className="font-mono font-bold text-violet-700">$</span>
                                <div className="text-[10px] text-slate-500">Start / End of string</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="font-mono font-bold text-violet-700">.</span> (Dot)
                                <div className="text-[10px] text-slate-500">Any char except newline</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="font-mono font-bold text-violet-700">*</span> / <span className="font-mono font-bold text-violet-700">+</span>
                                <div className="text-[10px] text-slate-500">0+ / 1+ repetitions</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="font-mono font-bold text-violet-700">?</span>
                                <div className="text-[10px] text-slate-500">0 or 1 (Optional)</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="font-mono font-bold text-violet-700">\s</span> / <span className="font-mono font-bold text-violet-700">\S</span>
                                <div className="text-[10px] text-slate-500">Whitespace / Non-whitespace</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="font-mono font-bold text-violet-700">[a-z]</span>
                                <div className="text-[10px] text-slate-500">Character class range</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

