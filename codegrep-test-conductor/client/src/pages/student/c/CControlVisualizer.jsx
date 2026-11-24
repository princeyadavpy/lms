import React, { useState, useEffect } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from '../python/InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Layers,
    Code2,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    GitBranch,
    ShieldAlert,
    Cpu,
    CornerDownRight
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /3\.1|decision making using if/i,
        label: '3.1 Simple if Statement',
        code: `#include <stdio.h>

int main() {
    int age = 20;

    if (age >= 18) {
        printf("Eligible to vote in election!\\n");
    }
    printf("Execution continuing after if block.\\n");
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'assign', detail: 'int age = 20', explanation: 'Variable age assigned 20 on the stack frame.', branch: 'entry', conditionLabel: 'age >= 18', conditionResult: true, output: [] },
            { lineNum: 6, action: 'eval', detail: 'Evaluating (age >= 18): 20 >= 18 is TRUE (1)', explanation: 'Condition is true. CPU branches into the inner block.', branch: 'if-true', conditionLabel: 'age >= 18', conditionResult: true, output: [] },
            { lineNum: 7, action: 'exec', detail: 'printf("Eligible to vote in election!\\n")', explanation: 'Writing string to stdout.', branch: 'body', conditionLabel: 'age >= 18', conditionResult: true, output: ['Eligible to vote in election!'] },
            { lineNum: 9, action: 'exec', detail: 'printf post-condition statement', explanation: 'Sequential execution continues.', branch: 'exit', conditionLabel: 'age >= 18', conditionResult: true, output: ['Eligible to vote in election!', 'Execution continuing after if block.'] },
            { lineNum: 10, action: 'return', detail: 'return 0', explanation: 'Process completed successfully.', branch: 'exit', conditionLabel: 'age >= 18', conditionResult: true, output: ['Eligible to vote in election!', 'Execution continuing after if block.', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /3\.2|types of if/i,
        label: '3.2 if...else Ladder',
        code: `#include <stdio.h>

int main() {
    int marks = 78;

    if (marks >= 90) {
        printf("Grade: A+\\n");
    } else if (marks >= 75) {
        printf("Grade: B+\\n");
    } else if (marks >= 60) {
        printf("Grade: C\\n");
    } else {
        printf("Grade: Fail\\n");
    }
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'assign', detail: 'int marks = 78', explanation: 'Initialized marks = 78.', branch: 'entry', conditionLabel: 'marks >= 90', conditionResult: false, output: [] },
            { lineNum: 6, action: 'eval', detail: 'Evaluate marks >= 90: 78 >= 90 is FALSE (0)', explanation: 'False branch taken; CPU skips first block.', branch: 'if-false', conditionLabel: 'marks >= 90', conditionResult: false, output: [] },
            { lineNum: 8, action: 'eval', detail: 'Evaluate marks >= 75: 78 >= 75 is TRUE (1)', explanation: 'True condition matched! Entering block.', branch: 'elif-true', conditionLabel: 'marks >= 75', conditionResult: true, output: [] },
            { lineNum: 9, action: 'exec', detail: 'printf("Grade: B+\\n")', explanation: 'Executing Grade B+ write.', branch: 'body', conditionLabel: 'marks >= 75', conditionResult: true, output: ['Grade: B+'] },
            { lineNum: 15, action: 'return', detail: 'Jump directly to return 0', explanation: 'Remaining branches bypassed entirely.', branch: 'exit', conditionLabel: 'marks >= 75', conditionResult: true, output: ['Grade: B+', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /3\.3|switch case/i,
        label: '3.3 Switch Case Jump Table',
        code: `#include <stdio.h>

int main() {
    int opcode = 2;

    switch (opcode) {
        case 1:
            printf("Op 1: Initializing Disk\\n");
            break;
        case 2:
            printf("Op 2: Mounting File System\\n");
            break;
        case 3:
            printf("Op 3: Network Bind\\n");
            break;
        default:
            printf("Invalid Opcode\\n");
    }
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'assign', detail: 'int opcode = 2', explanation: 'Register holds opcode value 2.', branch: 'entry', activeCase: 2, output: [] },
            { lineNum: 6, action: 'switch', detail: 'Switch Jump: Direct index into case 2 at 0x401080', explanation: 'Compiler uses jump table for O(1) direct branching.', branch: 'switch-jump', activeCase: 2, output: [] },
            { lineNum: 11, action: 'exec', detail: 'printf("Op 2: Mounting File System\\n")', explanation: 'Case 2 code executes.', branch: 'body', activeCase: 2, output: ['Op 2: Mounting File System'] },
            { lineNum: 12, action: 'break', detail: 'break: Exit switch block immediately', explanation: 'Prevents fallthrough into case 3.', branch: 'break', activeCase: 2, output: ['Op 2: Mounting File System'] },
            { lineNum: 18, action: 'return', detail: 'return 0', explanation: 'Clean exit.', branch: 'exit', activeCase: 2, output: ['Op 2: Mounting File System', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 4,
        matchPattern: /3\.4|arithmetic/i,
        label: '3.4 Arithmetic Expressions',
        code: `#include <stdio.h>

int main() {
    int x = 15;
    int y = 4;

    int sum  = x + y; // 19
    int diff = x - y; // 11
    int prod = x * y; // 60
    int quot = x / y; // 3 (Integer division drops decimal!)
    int rem  = x % y; // 3 (Modulo remainder)

    printf("quot=%d, rem=%d, prod=%d\\n", quot, rem, prod);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'assign', detail: 'int x = 15, y = 4', explanation: 'Operands ready for arithmetic reduction.', branch: 'entry', expr: '15 / 4', output: [] },
            { lineNum: 10, action: 'arith', detail: 'quot = 15 / 4 = 3', explanation: 'Integer division discards fractional component.', branch: 'body', expr: 'quot: 3', output: [] },
            { lineNum: 11, action: 'arith', detail: 'rem = 15 % 4 = 3', explanation: 'Modulo returns remainder of division.', branch: 'body', expr: 'rem: 3', output: [] },
            { lineNum: 13, action: 'print', detail: 'printf results', explanation: 'Displays integer arithmetic results.', branch: 'exit', expr: 'prod: 60', output: ['quot=3, rem=3, prod=60'] },
            { lineNum: 14, action: 'return', detail: 'return 0', explanation: 'Complete.', branch: 'exit', expr: 'exit: 0', output: ['quot=3, rem=3, prod=60', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 5,
        matchPattern: /3\.5|evaluation/i,
        label: '3.5 Expression Evaluation',
        code: `#include <stdio.h>

int main() {
    int a = 5, b = 2;
    float result1 = a / b;          // 5 / 2 = 2 -> 2.0f (Integer truncation)
    float result2 = (float)a / b;   // Explicit cast: 5.0f / 2 = 2.5f

    printf("Truncated: %.2f\\n", result1);
    printf("With promotion: %.2f\\n", result2);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'assign', detail: 'int a = 5, b = 2', explanation: 'Two integer variables initialized.', branch: 'entry', cast: 'Raw Ints', output: [] },
            { lineNum: 5, action: 'eval', detail: 'a / b evaluates to 2 before float promotion', explanation: 'Integer division occurs before assignment to float.', branch: 'body', cast: '5 / 2 -> 2.0', output: [] },
            { lineNum: 6, action: 'eval', detail: '(float)a / b promotes b to float and yields 2.5f', explanation: 'Explicit cast promotes arithmetic to floating-point.', branch: 'body', cast: '(float)5 / 2 -> 2.5', output: [] },
            { lineNum: 8, action: 'print', detail: 'printf results', explanation: 'Displays difference between implicit and explicit promotion.', branch: 'exit', cast: 'Done', output: ['Truncated: 2.00', 'With promotion: 2.50'] },
            { lineNum: 10, action: 'return', detail: 'return 0', explanation: 'Exited cleanly.', branch: 'exit', cast: 'Done', output: ['Truncated: 2.00', 'With promotion: 2.50', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 6,
        matchPattern: /3\.6|goto/i,
        label: '3.6 GOTO Statement',
        code: `#include <stdio.h>

int main() {
    int attempts = 0;

retry_anchor:
    attempts++;
    printf("Attempt: %d\\n", attempts);

    if (attempts < 2) {
        printf("--> GOTO jumping to retry_anchor!\\n");
        goto retry_anchor; // Unconditional jump
    }

    printf("Finished successfully!\\n");
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'assign', detail: 'int attempts = 0', explanation: 'Initialized attempt counter.', branch: 'entry', gotoState: 'entry', output: [] },
            { lineNum: 7, action: 'anchor', detail: 'retry_anchor label: attempts = 1', explanation: 'Increment attempts counter to 1.', branch: 'body', gotoState: 'label', output: ['Attempt: 1'] },
            { lineNum: 11, action: 'goto', detail: 'goto retry_anchor: CPU Jump instruction', explanation: 'Unconditional jump alters Instruction Pointer (EIP/RIP) to target label.', branch: 'goto-jump', gotoState: 'jumping', output: ['Attempt: 1', '--> GOTO jumping to retry_anchor!'] },
            { lineNum: 7, action: 'anchor-2', detail: 'Target reached: attempts = 2', explanation: 'Execution resumes at labeled statement.', branch: 'body', gotoState: 'label', output: ['Attempt: 1', '--> GOTO jumping to retry_anchor!', 'Attempt: 2'] },
            { lineNum: 15, action: 'print', detail: 'Finished successfully', explanation: 'Loop condition passed.', branch: 'exit', gotoState: 'done', output: ['Attempt: 1', '--> GOTO jumping to retry_anchor!', 'Attempt: 2', 'Finished successfully!'] },
            { lineNum: 16, action: 'return', detail: 'return 0', explanation: 'Complete.', branch: 'exit', gotoState: 'done', output: ['Attempt: 1', '--> GOTO jumping to retry_anchor!', 'Attempt: 2', 'Finished successfully!', '[Process completed with code 0]'] }
        ]
    }
];

const CHALLENGES = [
    {
        code: `int a = 10, b = 20;\nif (a > 5 && b < 15) {\n    printf("True");\n} else {\n    printf("False");\n}`,
        question: 'What is printed by this control block?',
        options: ['True', 'False', 'Compilation Error', 'Nothing'],
        correct: 'False',
        explanation: 'a > 5 is true (10 > 5), but b < 15 is false (20 < 15). Logical AND (&&) requires both operands to be true. Since one is false, the else branch is taken.'
    },
    {
        code: `int x = 2;\nswitch(x) {\n    case 1: printf("One ");\n    case 2: printf("Two ");\n    case 3: printf("Three ");\n}`,
        question: 'Without a break statement in case 2, what will be printed?',
        options: ['Two ', 'Two Three ', 'One Two Three ', 'Error'],
        correct: 'Two Three ',
        explanation: 'In C, without a break statement, switch-case execution "falls through" to all subsequent cases. Execution starts at case 2 and continues into case 3.'
    }
];

export default function CControlVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
    const [selectedExample, setSelectedExample] = useState(TOPIC_PRESETS[0]);
    const [code, setCode] = useState(TOPIC_PRESETS[0].code);
    const [stepIdx, setStepIdx] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Auto-sync preset based on activeLesson / lessonOrder / lessonTitle
    useEffect(() => {
        let matched = null;
        if (typeof lessonOrder === 'number' && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            matched = TOPIC_PRESETS[lessonOrder - 1];
        } else if (lessonTitle) {
            matched = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
        }
        if (matched && matched.topicId !== selectedExample.topicId) {
            setSelectedExample(matched);
            setCode(matched.code);
            setStepIdx(0);
            setIsRunning(false);
        }
    }, [lessonOrder, lessonTitle]);

    const simulationSteps = selectedExample.steps || TOPIC_PRESETS[0].steps;
    const currentStep = simulationSteps[stepIdx] || simulationSteps[0];
    const transitionInfo = getStepTransitionInfo(simulationSteps, stepIdx);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setTimeout(() => {
                if (stepIdx < simulationSteps.length - 1) {
                    setStepIdx(prev => prev + 1);
                } else {
                    setIsRunning(false);
                }
            }, 1200 / speed);
        }
        return () => clearTimeout(timer);
    }, [isRunning, stepIdx, speed, simulationSteps.length]);

    const handleSelectExample = (ex) => {
        setSelectedExample(ex);
        setCode(ex.code);
        setStepIdx(0);
        setIsRunning(false);
    };

    const isTrueBranch = currentStep.branch === 'if-true' || currentStep.branch === 'elif-true';
    const isFalseBranch = currentStep.branch === 'if-false';

    return (
        <div className="space-y-4">
            {/* Simple & Clean Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        Control Statements
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                        &bull; {selectedExample.label}
                    </span>
                </div>

                {/* Compact Topic Pills */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
                    {TOPIC_PRESETS.map(ex => (
                        <button
                            key={ex.topicId}
                            onClick={() => handleSelectExample(ex)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                selectedExample.topicId === ex.topicId
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                            }`}
                        >
                            {ex.label.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Side-by-Side Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* ── LEFT SIDE: Code Runner & Arrow Trajectory (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Code2 className="w-3.5 h-3.5 text-blue-600" />
                            Live Code Execution
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {selectedExample.label}
                        </span>
                    </div>

                    <InteractiveEditorWithArrow
                        code={code}
                        setCode={setCode}
                        currentLineNum={currentStep.lineNum}
                        transitionInfo={transitionInfo}
                        isRunning={isRunning}
                        runCode={() => {
                            setStepIdx(0);
                            setIsRunning(true);
                        }}
                        stepForward={() => {
                            if (stepIdx < simulationSteps.length - 1) setStepIdx(prev => prev + 1);
                        }}
                        resetExecution={() => {
                            setStepIdx(0);
                            setIsRunning(false);
                        }}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={currentStep.detail}
                        stepCounterText={`Step ${stepIdx + 1} of ${simulationSteps.length}`}
                        terminalLines={currentStep.output}
                        badgeText="C Branch Engine"
                        fileName="control_flow.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Geometric Shapes & Flow Diagram Visualizer (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                            Branch Architecture &amp; Decision Shapes
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {currentStep.branch.toUpperCase()}
                        </span>
                    </div>

                    {/* 1. VISUAL SHAPE ENGINE (Flowchart Diamond or Switch Demuxer or Promotion Flow) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-semibold text-white">
                                    {selectedExample.topicId === 3 ? 'Hardware Demultiplexer Switch' : 'Decision Flowchart Shape'}
                                </h3>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                Real-Time Gate
                            </span>
                        </div>

                        {/* SHAPE RENDERING: Switch Multiplexer vs Diamond Flowchart */}
                        {selectedExample.topicId === 3 ? (
                            /* Switch Demultiplexer Shape */
                            <div className="py-2">
                                <svg viewBox="0 0 340 160" className="w-full h-auto">
                                    {/* Selector Input Pin */}
                                    <rect x="15" y="65" width="60" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                                    <text x="45" y="84" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold" fontFamily="monospace">op=2</text>
                                    
                                    {/* Central Multiplexer Wedge */}
                                    <polygon points="100,40 150,20 150,140 100,120" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                                    <text x="125" y="84" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">JMP</text>

                                    {/* Active Selector Arm to Case 2 */}
                                    <path d="M 75 80 L 125 80 L 190 75" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                                    <circle cx="190" cy="75" r="4" fill="#10b981" />

                                    {/* Case 1 Pin */}
                                    <path d="M 150 40 L 190 35" fill="none" stroke="#334155" strokeWidth="1.5" />
                                    <rect x="195" y="20" width="130" height="28" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                                    <text x="260" y="38" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">case 1 (Disk Init)</text>

                                    {/* Case 2 Pin (ACTIVE!) */}
                                    <rect x="195" y="60" width="130" height="30" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="2" className="animate-pulse" />
                                    <text x="260" y="79" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold" fontFamily="monospace">case 2 (Mount FS) ★</text>

                                    {/* Case 3 Pin */}
                                    <path d="M 150 120 L 190 125" fill="none" stroke="#334155" strokeWidth="1.5" />
                                    <rect x="195" y="110" width="130" height="28" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                                    <text x="260" y="128" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">case 3 (Network)</text>
                                </svg>
                                <div className="text-center text-[11px] font-mono text-emerald-400 mt-2 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-900/60">
                                    O(1) Instant Jump: Instruction pointer jumps directly to case 2 address (0x401080)
                                </div>
                            </div>
                        ) : (
                            /* Diamond Flowchart SVG Shape */
                            <div className="py-2">
                                <svg viewBox="0 0 340 180" className="w-full h-auto">
                                    {/* Top Entry Arrow */}
                                    <line x1="170" y1="5" x2="170" y2="28" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />

                                    {/* Decision Diamond Polygon */}
                                    <polygon
                                        points="170,30 260,65 170,100 80,65"
                                        fill="#0f172a"
                                        stroke={isTrueBranch ? '#10b981' : isFalseBranch ? '#f43f5e' : '#3b82f6'}
                                        strokeWidth="2"
                                        className="transition-colors duration-300"
                                    />
                                    <text x="170" y="69" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                        {currentStep.conditionLabel || 'Condition?'}
                                    </text>

                                    {/* True Path (Left / Down) */}
                                    <path
                                        d="M 80 65 L 45 65 L 45 125"
                                        fill="none"
                                        stroke={isTrueBranch ? '#10b981' : '#334155'}
                                        strokeWidth={isTrueBranch ? "3" : "1.5"}
                                        strokeDasharray={isTrueBranch ? "4 2" : "none"}
                                    />
                                    <rect
                                        x="15"
                                        y="70"
                                        width="32"
                                        height="16"
                                        rx="4"
                                        fill={isTrueBranch ? "#064e3b" : "#1e293b"}
                                        stroke={isTrueBranch ? "#10b981" : "#475569"}
                                        strokeWidth="1"
                                    />
                                    <text x="31" y="82" textAnchor="middle" fill={isTrueBranch ? "#6ee7b7" : "#94a3b8"} fontSize="9" fontWeight="bold">
                                        TRUE
                                    </text>

                                    {/* True Target Action Block */}
                                    <rect
                                        x="10"
                                        y="125"
                                        width="120"
                                        height="35"
                                        rx="8"
                                        fill={isTrueBranch ? "#064e3b" : "#0f172a"}
                                        stroke={isTrueBranch ? "#10b981" : "#334155"}
                                        strokeWidth={isTrueBranch ? "2" : "1"}
                                        className={isTrueBranch ? "animate-pulse" : ""}
                                    />
                                    <text x="70" y="146" textAnchor="middle" fill={isTrueBranch ? "#a7f3d0" : "#64748b"} fontSize="10" fontWeight="bold" fontFamily="monospace">
                                        {isTrueBranch ? 'Execute Block ✓' : 'Inner Block'}
                                    </text>

                                    {/* False Path (Right / Down) */}
                                    <path
                                        d="M 260 65 L 295 65 L 295 125"
                                        fill="none"
                                        stroke={isFalseBranch ? '#f43f5e' : '#334155'}
                                        strokeWidth={isFalseBranch ? "3" : "1.5"}
                                    />
                                    <rect
                                        x="290"
                                        y="70"
                                        width="35"
                                        height="16"
                                        rx="4"
                                        fill={isFalseBranch ? "#881337" : "#1e293b"}
                                        stroke={isFalseBranch ? "#f43f5e" : "#475569"}
                                        strokeWidth="1"
                                    />
                                    <text x="307" y="82" textAnchor="middle" fill={isFalseBranch ? "#fecdd3" : "#94a3b8"} fontSize="9" fontWeight="bold">
                                        FALSE
                                    </text>

                                    {/* False / Else Block */}
                                    <rect
                                        x="210"
                                        y="125"
                                        width="120"
                                        height="35"
                                        rx="8"
                                        fill={isFalseBranch ? "#881337" : "#0f172a"}
                                        stroke={isFalseBranch ? "#f43f5e" : "#334155"}
                                        strokeWidth={isFalseBranch ? "2" : "1"}
                                    />
                                    <text x="270" y="146" textAnchor="middle" fill={isFalseBranch ? "#fecdd3" : "#64748b"} fontSize="10" fontWeight="bold" fontFamily="monospace">
                                        {isFalseBranch ? 'Skip Block ✗' : 'Else / Next'}
                                    </text>
                                </svg>
                            </div>
                        )}

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed font-mono">
                            <strong className="text-blue-400 font-semibold">Active State: </strong>
                            {currentStep.detail}
                        </div>
                    </div>

                    {/* 2. Step Explanation & CPU Register status */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">CPU Flag &amp; Branch Outcome</h3>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                ZF / CF Flag
                            </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            {currentStep.explanation}
                        </p>
                    </div>
                </div>
            </div>

            {/* Interactive Concept Challenge */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <h3 className="text-sm font-semibold text-white">Interactive Concept Check</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                        Question {challengeIdx + 1} of {CHALLENGES.length}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-blue-300">
                        <pre>{CHALLENGES[challengeIdx].code}</pre>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-medium text-slate-200">
                            {CHALLENGES[challengeIdx].question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {CHALLENGES[challengeIdx].options.map(opt => {
                                const isSelected = selectedOption === opt;
                                const isCorrect = opt === CHALLENGES[challengeIdx].correct;
                                let btnStyle = 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800';

                                if (showExplanation) {
                                    if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                                    else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                                }

                                return (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setSelectedOption(opt);
                                            setShowExplanation(true);
                                        }}
                                        className={`px-3 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer text-left ${btnStyle}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 animate-fadeIn">
                                <p className="leading-relaxed">
                                    <strong className="text-blue-400">Explanation: </strong>
                                    {CHALLENGES[challengeIdx].explanation}
                                </p>
                                <button
                                    onClick={() => {
                                        setChallengeIdx((challengeIdx + 1) % CHALLENGES.length);
                                        setSelectedOption(null);
                                        setShowExplanation(false);
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                                >
                                    Next Challenge <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
