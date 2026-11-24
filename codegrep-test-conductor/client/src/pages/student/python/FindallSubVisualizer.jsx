import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Repeat, Replace, Sparkles, CheckCircle2, ArrowRight,
    Search, Layers, Code2, Scissors, Calendar, RefreshCw, Zap, Sliders
} from 'lucide-react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';

// ─────────────────────────────────────────────────────────────
// EXAMPLES FOR TOPIC 3: findall, finditer & Substitution (sub)
// ─────────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'findall-extract',
        label: 'findall & finditer',
        code: `import re

text = "Items: 12 apples, 45 oranges, 9 bananas"

# findall extracts ALL matches directly into a Python list
all_nums = re.findall(r"\\d+", text)
print("Harvested Numbers:", all_nums)

# finditer returns match objects with positions
for m in re.finditer(r"\\d+", text):
    print(f"Found {m.group()} at index {m.start()}")`,
        steps: [
            {
                lineNum: 1,
                action: 'load_engine',
                detail: 'import re loaded',
                explanation: 'Imports Python Regular Expressions engine.',
                outputs: []
            },
            {
                lineNum: 3,
                action: 'load_inventory',
                detail: 'text initialized with inventory quantities',
                explanation: 'Target text contains multiple numerical values embedded across words.',
                outputs: []
            },
            {
                lineNum: 6,
                action: 'execute_findall',
                detail: 're.findall(r"\\d+", text) harversts all digits',
                explanation: 'findall() searches exhaustively and returns a list of all matching substrings.',
                outputs: []
            },
            {
                lineNum: 7,
                action: 'print_findall',
                detail: 'print("Harvested Numbers:", all_nums)',
                explanation: 'Outputs the harvested list of matched elements.',
                outputs: ["Harvested Numbers: ['12', '45', '9']"]
            },
            {
                lineNum: 10,
                action: 'execute_finditer',
                detail: 'finditer yields Match objects with positions',
                explanation: 'finditer() gives start() and end() index positions for every match.',
                outputs: [
                    "Harvested Numbers: ['12', '45', '9']",
                    "Found 12 at index 7",
                    "Found 45 at index 18",
                    "Found 9 at index 30"
                ]
            }
        ]
    },
    {
        id: 'sub-replace',
        label: 're.sub() & Replace',
        code: `import re

# 1. Mask sensitive digits
raw_account = "Account: 4829"
masked = re.sub(r"\\d", "*", raw_account)
print("Masked Account:", masked)

# 2. Rearrange date format using captured groups \\3/\\2/\\1
raw_date = "12-03-2026"
rearranged = re.sub(r"(\\d+)-(\\d+)-(\\d+)", r"\\3/\\2/\\1", raw_date)
print("Rearranged Date:", rearranged)`,
        steps: [
            {
                lineNum: 4,
                action: 'load_account',
                detail: 'raw_account = "Account: 4829"',
                explanation: 'Loads raw account number containing secret digits.',
                outputs: []
            },
            {
                lineNum: 5,
                action: 'mask_sub',
                detail: 're.sub(r"\\d", "*", raw_account) replaces every digit',
                explanation: 're.sub substitutes every matching character with asterisk.',
                outputs: []
            },
            {
                lineNum: 6,
                action: 'print_masked',
                detail: 'print("Masked Account:", masked)',
                explanation: 'Outputs masked string: "Account: ****".',
                outputs: ["Masked Account: Account: ****"]
            },
            {
                lineNum: 9,
                action: 'load_date',
                detail: 'raw_date = "12-03-2026"',
                explanation: 'Loads original date formatted as Day-Month-Year.',
                outputs: ["Masked Account: Account: ****"]
            },
            {
                lineNum: 10,
                action: 'rearrange_date',
                detail: 'Backreference groups \\3/\\2/\\1 reorganizes to Year/Month/Day',
                explanation: 'Parentheses capture (Day), (Month), and (Year), swapped via backreferences.',
                outputs: ["Masked Account: Account: ****"]
            },
            {
                lineNum: 11,
                action: 'print_date',
                detail: 'print("Rearranged Date:", rearranged)',
                explanation: 'Outputs rearranged date string.',
                outputs: [
                    "Masked Account: Account: ****",
                    "Rearranged Date: 2026/03/12"
                ]
            }
        ]
    }
];

export default function FindallSubVisualizer() {
    const [selectedExample, setSelectedExample] = useState(0);
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [steps, setSteps] = useState(EXAMPLES[0].steps);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const [highlightedMatchIdx, setHighlightedMatchIdx] = useState(null);
    const intervalRef = useRef(null);

    const speedMs = { slow: 1800, normal: 1000, fast: 400 };

    const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;
    const currentLineNum = currentStepData?.lineNum ?? null;
    const transitionInfo = getStepTransitionInfo(steps, currentStep);

    // ─────────────────────────────────────────────────────────────
    // DYNAMIC REACTIVE VALUE PARSING & LIVE REGEX EVALUATION
    // ─────────────────────────────────────────────────────────────
    // Extract target text dynamically from user-edited code
    const extractedText = useMemo(() => {
        const match = code.match(/text\s*=\s*["'](.*?)["']/);
        if (match) return match[1];
        return "Items: 12 apples, 45 oranges, 9 bananas";
    }, [code]);

    // Extract regex pattern dynamically from user-edited code
    const extractedPattern = useMemo(() => {
        const match = code.match(/re\.(?:findall|finditer)\(\s*r?["'](.*?)["']/);
        if (match) return match[1];
        return "\\d+";
    }, [code]);

    // Compute live matches in real time based on active code
    const liveMatches = useMemo(() => {
        try {
            const re = new RegExp(extractedPattern, 'g');
            const matches = [];
            let m;
            while ((m = re.exec(extractedText)) !== null) {
                matches.push({ val: m[0], index: m.index });
                if (!re.global) break;
            }
            return matches;
        } catch {
            return [];
        }
    }, [extractedText, extractedPattern]);

    // For Example 2: Extract date and account dynamically
    const extractedDate = useMemo(() => {
        const m = code.match(/raw_date\s*=\s*["'](.*?)["']/);
        return m ? m[1] : "12-03-2026";
    }, [code]);

    const liveRearrangedDate = useMemo(() => {
        try {
            return extractedDate.replace(/(\d+)-(\d+)-(\d+)/, '$3/$2/$1');
        } catch {
            return extractedDate;
        }
    }, [extractedDate]);

    // Dynamic terminal output synchronized with edited values
    const dynamicOutputs = useMemo(() => {
        if (selectedExample === 0) {
            const matchedVals = liveMatches.map(m => `'${m.val}'`).join(', ');
            if (currentStep === 3) return [`Harvested Numbers: [${matchedVals}]`];
            if (currentStep >= 4) {
                const iterLines = liveMatches.map(m => `Found ${m.val} at index ${m.index}`);
                return [`Harvested Numbers: [${matchedVals}]`, ...iterLines];
            }
            return [];
        }
        return currentStepData?.outputs || [];
    }, [selectedExample, currentStep, liveMatches, currentStepData]);

    const loadExample = useCallback((idx) => {
        clearInterval(intervalRef.current);
        setSelectedExample(idx);
        setCode(EXAMPLES[idx].code);
        setSteps(EXAMPLES[idx].steps);
        setCurrentStep(-1);
        setIsRunning(false);
        setHighlightedMatchIdx(null);
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
        setHighlightedMatchIdx(null);
    };

    // Quick Test Value Presets
    const handleQuickTest = (newText) => {
        const updatedCode = code.replace(/text\s*=\s*["'].*?["']/, `text = "${newText}"`);
        setCode(updatedCode);
        resetExecution();
    };

    const handleQuickDateTest = (newDate) => {
        const updatedCode = code.replace(/raw_date\s*=\s*["'].*?["']/, `raw_date = "${newDate}"`);
        setCode(updatedCode);
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
            {/* Top Bar – Just a Clean Title and Crisp Tabs (No messy subtitles) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm">
                            <Repeat className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-slate-900 leading-none">
                            findall, finditer &amp; Substitution
                        </h2>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {EXAMPLES.map((ex, idx) => (
                            <button
                                key={ex.id}
                                onClick={() => loadExample(idx)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedExample === idx
                                        ? 'bg-pink-600 text-white shadow-xs'
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
                        badgeText="re Module"
                        fileName="findall_and_sub.py"
                        accentColor="#db2777"
                    />

                    {/* Step Explanation */}
                    {currentStepData && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
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

                {/* Right Column: Visual Box Diagrams (Sticky with Live Interaction) */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    {selectedExample === 0 ? (
                        /* ======================================================== */
                        /* PRESET 1: LIVE REACTIVE MULTI-TARGET HARVESTER BOX      */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Repeat className="w-4 h-4 text-pink-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        findall &amp; finditer Live Harvester
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-pink-50 text-pink-700 font-bold px-2 py-0.5 rounded border border-pink-200">
                                    Pattern: r&quot;{extractedPattern}&quot;
                                </span>
                            </div>

                            {/* Quick Test Value Presets (Interactive Visualizer Feature) */}
                            <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
                                <span className="text-slate-400 font-medium">Quick Values:</span>
                                {[
                                    'Items: 12 apples, 45 oranges, 9 bananas',
                                    'Scores: 98 math, 74 science, 100 art',
                                    'Order #501 with 3 items at $45 total'
                                ].map((t, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleQuickTest(t)}
                                        className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono cursor-pointer transition-colors ${
                                            extractedText === t
                                                ? 'bg-pink-100 text-pink-800 border-pink-300 font-bold'
                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        Preset {idx + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Dynamic Text Stream with Real-time Matched Highlighting */}
                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-2">
                                <div className="text-slate-400 text-[10px] tracking-wider uppercase font-semibold flex items-center justify-between">
                                    <span>Target Text Stream</span>
                                    <span className="text-emerald-400 text-[10px] font-sans font-bold">● Live Synchronized</span>
                                </div>
                                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 leading-loose">
                                    {liveMatches.length > 0 ? (
                                        (() => {
                                            const parts = [];
                                            let lastIdx = 0;
                                            liveMatches.forEach((m, idx) => {
                                                if (m.index > lastIdx) {
                                                    parts.push(extractedText.substring(lastIdx, m.index));
                                                }
                                                const isSelected = highlightedMatchIdx === idx;
                                                parts.push(
                                                    <span
                                                        key={idx}
                                                        onClick={() => setHighlightedMatchIdx(idx)}
                                                        className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-all ${
                                                            isSelected
                                                                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-110 inline-block'
                                                                : 'bg-pink-600 text-white hover:bg-pink-500'
                                                        }`}
                                                        title={`Match #${idx + 1}: "${m.val}" at index ${m.index}`}
                                                    >
                                                        {m.val}
                                                    </span>
                                                );
                                                lastIdx = m.index + m.val.length;
                                            });
                                            if (lastIdx < extractedText.length) {
                                                parts.push(extractedText.substring(lastIdx));
                                            }
                                            return parts;
                                        })()
                                    ) : (
                                        <span>{extractedText}</span>
                                    )}
                                </div>
                            </div>

                            {/* Live Harvested List Box */}
                            <div className="p-4 bg-pink-50/70 border border-pink-200 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-pink-900 uppercase tracking-wider flex items-center gap-1.5">
                                        <span>Harvested Matches: re.findall()</span>
                                    </span>
                                    <span className="text-[10px] font-bold bg-pink-200 text-pink-900 px-2 py-0.5 rounded">
                                        Count: {liveMatches.length}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 font-mono text-xs">
                                    {liveMatches.map((m, i) => {
                                        const isSelected = highlightedMatchIdx === i;
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => setHighlightedMatchIdx(isSelected ? null : i)}
                                                className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300 scale-102'
                                                        : 'bg-white text-slate-800 border-pink-200 hover:border-pink-400 shadow-xs'
                                                }`}
                                            >
                                                <div className="text-[10px] text-pink-700 font-semibold mb-0.5">
                                                    Match #{i + 1}
                                                </div>
                                                <div className="text-sm font-black">&quot;{m.val}&quot;</div>
                                                <div className="text-[9px] text-slate-400 mt-0.5">
                                                    index: {m.index}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                <strong>Interactive Note:</strong> Click any match card above to highlight its exact position in the target text. You can also edit the text or pattern in the code editor, and the visualizer immediately reflects the new matches!
                            </p>
                        </div>
                    ) : (
                        /* ======================================================== */
                        /* PRESET 2: RE.SUB() LIVE TRANSFORMER & BACKREFERENCES    */
                        /* ======================================================== */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Replace className="w-4 h-4 text-pink-600" />
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        re.sub() Live String Transformer
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono bg-pink-50 text-pink-700 font-bold px-2 py-0.5 rounded border border-pink-200">
                                    Pattern: r&quot;(\d+)-(\d+)-(\d+)&quot;
                                </span>
                            </div>

                            {/* Quick Value Presets for Date Transformer */}
                            <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
                                <span className="text-slate-400 font-medium">Quick Dates:</span>
                                {[
                                    '12-03-2026',
                                    '31-12-2024',
                                    '15-08-1947'
                                ].map((d, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleQuickDateTest(d)}
                                        className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono cursor-pointer transition-colors ${
                                            extractedDate === d
                                                ? 'bg-pink-100 text-pink-800 border-pink-300 font-bold'
                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>

                            {/* Date Rearranging Box with Live Capture Groups */}
                            {(() => {
                                const parts = extractedDate.split('-');
                                const day = parts[0] || '12';
                                const month = parts[1] || '03';
                                const year = parts[2] || '2026';

                                return (
                                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono text-xs space-y-3">
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span>CAPTURE GROUPS: r&quot;(\d+)-(\d+)-(\d+)&quot;</span>
                                            <span className="text-pink-300 font-bold">TARGET: r&quot;\3/\2/\1&quot;</span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                                                <div className="text-[10px] text-pink-400">GROUP \1 (Day)</div>
                                                <div className="text-base font-bold text-white">&quot;{day}&quot;</div>
                                            </div>
                                            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                                                <div className="text-[10px] text-sky-400">GROUP \2 (Month)</div>
                                                <div className="text-base font-bold text-white">&quot;{month}&quot;</div>
                                            </div>
                                            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                                                <div className="text-[10px] text-emerald-400">GROUP \3 (Year)</div>
                                                <div className="text-base font-bold text-white">&quot;{year}&quot;</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Transformer Conveyor Output Box */}
                            <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl flex items-center justify-between font-mono text-xs">
                                <div className="space-y-0.5">
                                    <div className="text-[10px] text-slate-500 font-sans">ORIGINAL STRING</div>
                                    <div className="font-bold text-slate-800">&quot;{extractedDate}&quot;</div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-pink-600 animate-pulse shrink-0" />
                                <div className="space-y-0.5 text-right">
                                    <div className="text-[10px] text-emerald-600 font-bold font-sans">TRANSFORMED VIA \3/\2/\1</div>
                                    <div className="font-bold text-emerald-800 text-sm">&quot;{liveRearrangedDate}&quot;</div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                Backreferences like <code className="font-mono bg-slate-100 px-1 rounded font-bold">\1</code>, <code className="font-mono bg-slate-100 px-1 rounded font-bold">\2</code>, and <code className="font-mono bg-slate-100 px-1 rounded font-bold">\3</code> dynamically reorganize captured parenthetical groups without string slicing.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
