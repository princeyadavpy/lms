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
    Repeat,
    FastForward,
    ShieldAlert
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /4\.1|concept of loop/i,
        label: '4.1 Concept of Loop',
        code: `#include <stdio.h>

int main() {
    int counter = 1;

    // Loop repeats as long as condition evaluates to true
    while (counter <= 3) {
        printf("Iteration %d: Executing task\\n", counter);
        counter++;
    }
    printf("Loop finished! Counter is %d\\n", counter);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'init', detail: 'int counter = 1 (Initialization)', explanation: 'Counter initialized to starting value 1.', iter: 1, phase: 'init', vars: { counter: '1' }, output: [] },
            { lineNum: 7, action: 'cond-check', detail: 'Condition Check (1 <= 3): TRUE', explanation: 'Loop entry guard allows execution.', iter: 1, phase: 'check', vars: { counter: '1' }, output: [] },
            { lineNum: 8, action: 'body', detail: 'printf iteration 1', explanation: 'Body statements executed.', iter: 1, phase: 'body', vars: { counter: '1' }, output: ['Iteration 1: Executing task'] },
            { lineNum: 9, action: 'step', detail: 'counter++ -> 2 (Increment)', explanation: 'Loop variable stepped forward.', iter: 1, phase: 'step', vars: { counter: '2' }, output: ['Iteration 1: Executing task'] },
            { lineNum: 7, action: 'cond-check', detail: 'Condition Check (2 <= 3): TRUE', explanation: 'Iteration 2 approved.', iter: 2, phase: 'check', vars: { counter: '2' }, output: ['Iteration 1: Executing task'] },
            { lineNum: 8, action: 'body', detail: 'printf iteration 2', explanation: 'Body statements executed.', iter: 2, phase: 'body', vars: { counter: '2' }, output: ['Iteration 1: Executing task', 'Iteration 2: Executing task'] },
            { lineNum: 9, action: 'step', detail: 'counter++ -> 3 (Increment)', explanation: 'Counter now 3.', iter: 2, phase: 'step', vars: { counter: '3' }, output: ['Iteration 1: Executing task', 'Iteration 2: Executing task'] },
            { lineNum: 7, action: 'cond-check', detail: 'Condition Check (3 <= 3): TRUE', explanation: 'Final matching run.', iter: 3, phase: 'check', vars: { counter: '3' }, output: ['Iteration 1: Executing task', 'Iteration 2: Executing task'] },
            { lineNum: 8, action: 'body', detail: 'printf iteration 3', explanation: 'Executed.', iter: 3, phase: 'body', vars: { counter: '3' }, output: ['Iteration 1: Executing task', 'Iteration 2: Executing task', 'Iteration 3: Executing task'] },
            { lineNum: 9, action: 'step', detail: 'counter++ -> 4', explanation: 'Steps to 4.', iter: 3, phase: 'step', vars: { counter: '4' }, output: ['Iteration 1: Executing task', 'Iteration 2: Executing task', 'Iteration 3: Executing task'] },
            { lineNum: 7, action: 'cond-fail', detail: 'Condition Check (4 <= 3): FALSE (0)', explanation: 'Condition failed! Loop terminates.', iter: 3, phase: 'exit', vars: { counter: '4' }, output: ['Iteration 1: Executing task', 'Iteration 2: Executing task', 'Iteration 3: Executing task'] },
            { lineNum: 11, action: 'post', detail: 'printf post loop message', explanation: 'Sequential execution resumed.', iter: 3, phase: 'exit', vars: { counter: '4' }, output: ['Iteration 1: Executing task', 'Iteration 2: Executing task', 'Iteration 3: Executing task', 'Loop finished! Counter is 4'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Process complete.', iter: 3, phase: 'exit', vars: { counter: '4' }, output: ['Iteration 1: Executing task', 'Iteration 2: Executing task', 'Iteration 3: Executing task', 'Loop finished! Counter is 4', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /4\.2|for loop/i,
        label: '4.2 For Loop',
        code: `#include <stdio.h>

int main() {
    int total = 0;

    for (int i = 1; i <= 3; i++) {
        total += i;
        printf("i=%d, total=%d\\n", i, total);
    }
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'init', detail: 'total = 0', explanation: 'Accumulator variable ready.', iter: 0, phase: 'init', vars: { total: '0', i: '-' }, output: [] },
            { lineNum: 6, action: 'init-loop', detail: 'i = 1; check i <= 3 (TRUE)', explanation: 'For loop head initialization and first check.', iter: 1, phase: 'check', vars: { total: '0', i: '1' }, output: [] },
            { lineNum: 7, action: 'body', detail: 'total += 1 (total = 1)', explanation: 'Accumulated.', iter: 1, phase: 'body', vars: { total: '1', i: '1' }, output: [] },
            { lineNum: 8, action: 'print', detail: 'printf i=1, total=1', explanation: 'Written to stdout.', iter: 1, phase: 'body', vars: { total: '1', i: '1' }, output: ['i=1, total=1'] },
            { lineNum: 6, action: 'step', detail: 'i++ -> 2; check 2 <= 3 (TRUE)', explanation: 'Step and re-evaluation.', iter: 2, phase: 'step', vars: { total: '1', i: '2' }, output: ['i=1, total=1'] },
            { lineNum: 7, action: 'body', detail: 'total += 2 (total = 3)', explanation: 'Body executes for i=2.', iter: 2, phase: 'body', vars: { total: '3', i: '2' }, output: ['i=1, total=1'] },
            { lineNum: 8, action: 'print', detail: 'printf i=2, total=3', explanation: 'Written to stdout.', iter: 2, phase: 'body', vars: { total: '3', i: '2' }, output: ['i=1, total=1', 'i=2, total=3'] },
            { lineNum: 6, action: 'step', detail: 'i++ -> 3; check 3 <= 3 (TRUE)', explanation: 'Step to 3.', iter: 3, phase: 'step', vars: { total: '3', i: '3' }, output: ['i=1, total=1', 'i=2, total=3'] },
            { lineNum: 7, action: 'body', detail: 'total += 3 (total = 6)', explanation: 'Final accumulation.', iter: 3, phase: 'body', vars: { total: '6', i: '3' }, output: ['i=1, total=1', 'i=2, total=3'] },
            { lineNum: 8, action: 'print', detail: 'printf i=3, total=6', explanation: 'Written to stdout.', iter: 3, phase: 'body', vars: { total: '6', i: '3' }, output: ['i=1, total=1', 'i=2, total=3', 'i=3, total=6'] },
            { lineNum: 6, action: 'step', detail: 'i++ -> 4; check 4 <= 3 (FALSE)', explanation: 'Loop exits cleanly.', iter: 3, phase: 'exit', vars: { total: '6', i: '4' }, output: ['i=1, total=1', 'i=2, total=3', 'i=3, total=6'] },
            { lineNum: 10, action: 'return', detail: 'return 0', explanation: 'Completed successfully.', iter: 3, phase: 'exit', vars: { total: '6', i: '4' }, output: ['i=1, total=1', 'i=2, total=3', 'i=3, total=6', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /4\.3|while loop/i,
        label: '4.3 While Loop',
        code: `#include <stdio.h>

int main() {
    int n = 16;

    // Entry-controlled: divides until n becomes 1
    while (n > 1) {
        printf("n = %d\\n", n);
        n /= 2;
    }
    printf("Final n = %d\\n", n);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'init', detail: 'n = 16', explanation: 'Integer initialized.', iter: 1, phase: 'init', vars: { n: '16' }, output: [] },
            { lineNum: 7, action: 'check', detail: 'Check 16 > 1 (TRUE)', explanation: 'Entry condition passed.', iter: 1, phase: 'check', vars: { n: '16' }, output: [] },
            { lineNum: 8, action: 'print', detail: 'printf n = 16', explanation: 'Logged.', iter: 1, phase: 'body', vars: { n: '16' }, output: ['n = 16'] },
            { lineNum: 9, action: 'step', detail: 'n /= 2 -> 8', explanation: 'Binary right shift / division.', iter: 1, phase: 'step', vars: { n: '8' }, output: ['n = 16'] },
            { lineNum: 7, action: 'check', detail: 'Check 8 > 1 (TRUE)', explanation: 'Passed.', iter: 2, phase: 'check', vars: { n: '8' }, output: ['n = 16'] },
            { lineNum: 8, action: 'print', detail: 'printf n = 8', explanation: 'Logged.', iter: 2, phase: 'body', vars: { n: '8' }, output: ['n = 16', 'n = 8'] },
            { lineNum: 9, action: 'step', detail: 'n /= 2 -> 4', explanation: 'Divided.', iter: 2, phase: 'step', vars: { n: '4' }, output: ['n = 16', 'n = 8'] },
            { lineNum: 7, action: 'check', detail: 'Check 4 > 1 (TRUE)', explanation: 'Passed.', iter: 3, phase: 'check', vars: { n: '4' }, output: ['n = 16', 'n = 8'] },
            { lineNum: 8, action: 'print', detail: 'printf n = 4', explanation: 'Logged.', iter: 3, phase: 'body', vars: { n: '4' }, output: ['n = 16', 'n = 8', 'n = 4'] },
            { lineNum: 9, action: 'step', detail: 'n /= 2 -> 2', explanation: 'Divided.', iter: 3, phase: 'step', vars: { n: '2' }, output: ['n = 16', 'n = 8', 'n = 4'] },
            { lineNum: 7, action: 'check', detail: 'Check 2 > 1 (TRUE)', explanation: 'Passed.', iter: 4, phase: 'check', vars: { n: '2' }, output: ['n = 16', 'n = 8', 'n = 4'] },
            { lineNum: 8, action: 'print', detail: 'printf n = 2', explanation: 'Logged.', iter: 4, phase: 'body', vars: { n: '2' }, output: ['n = 16', 'n = 8', 'n = 4', 'n = 2'] },
            { lineNum: 9, action: 'step', detail: 'n /= 2 -> 1', explanation: 'Divided.', iter: 4, phase: 'step', vars: { n: '1' }, output: ['n = 16', 'n = 8', 'n = 4', 'n = 2'] },
            { lineNum: 7, action: 'check', detail: 'Check 1 > 1 (FALSE)', explanation: '1 is not > 1. Loop terminates.', iter: 4, phase: 'exit', vars: { n: '1' }, output: ['n = 16', 'n = 8', 'n = 4', 'n = 2'] },
            { lineNum: 11, action: 'print', detail: 'printf Final n = 1', explanation: 'Final output.', iter: 4, phase: 'exit', vars: { n: '1' }, output: ['n = 16', 'n = 8', 'n = 4', 'n = 2', 'Final n = 1'] },
            { lineNum: 12, action: 'return', detail: 'return 0', explanation: 'Complete.', iter: 4, phase: 'exit', vars: { n: '1' }, output: ['n = 16', 'n = 8', 'n = 4', 'n = 2', 'Final n = 1', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 4,
        matchPattern: /4\.4|do while/i,
        label: '4.4 Do While Loop',
        code: `#include <stdio.h>

int main() {
    int val = 100;

    // Exit-controlled: Guaranteed to execute AT LEAST ONCE
    do {
        printf("Executing body once with val=%d\\n", val);
        val++;
    } while (val < 50); // Condition is false (101 < 50)

    printf("Exited do-while! val = %d\\n", val);
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'init', detail: 'int val = 100', explanation: 'Value exceeds while condition from the start.', iter: 1, phase: 'init', vars: { val: '100' }, output: [] },
            { lineNum: 8, action: 'body', detail: 'Body executes unconditionally on first run!', explanation: 'Do-while never checks condition prior to first execution.', iter: 1, phase: 'body', vars: { val: '100' }, output: ['Executing body once with val=100'] },
            { lineNum: 9, action: 'step', detail: 'val++ -> 101', explanation: 'Incremented to 101.', iter: 1, phase: 'step', vars: { val: '101' }, output: ['Executing body once with val=100'] },
            { lineNum: 10, action: 'check', detail: 'Check (101 < 50): FALSE', explanation: 'Condition failed at bottom. Execution proceeds to next statement.', iter: 1, phase: 'exit', vars: { val: '101' }, output: ['Executing body once with val=100'] },
            { lineNum: 12, action: 'print', detail: 'printf Exited do-while! val = 101', explanation: 'Guaranteed at least 1 run completed.', iter: 1, phase: 'exit', vars: { val: '101' }, output: ['Executing body once with val=100', 'Exited do-while! val = 101'] },
            { lineNum: 13, action: 'return', detail: 'return 0', explanation: 'Complete.', iter: 1, phase: 'exit', vars: { val: '101' }, output: ['Executing body once with val=100', 'Exited do-while! val = 101', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 5,
        matchPattern: /4\.5|jumping/i,
        label: '4.5 Jumping in Loop',
        code: `#include <stdio.h>

int main() {
    for (int r = 1; r <= 2; r++) {
        for (int c = 1; c <= 3; c++) {
            if (c == 2) {
                printf("Breaking inner loop at c=2!\\n");
                break; // Jumps out of INNER loop only
            }
            printf("[%d, %d] ", r, c);
        }
        printf("\\n");
    }
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'outer-1', detail: 'Outer loop r = 1', explanation: 'Outer cycle 1 begun.', iter: 1, phase: 'body', vars: { r: '1', c: '-' }, output: [] },
            { lineNum: 5, action: 'inner-1', detail: 'Inner loop c = 1', explanation: 'c=1 satisfies condition.', iter: 1, phase: 'body', vars: { r: '1', c: '1' }, output: [] },
            { lineNum: 10, action: 'print', detail: 'printf [1, 1]', explanation: 'First cell printed.', iter: 1, phase: 'body', vars: { r: '1', c: '1' }, output: ['[1, 1] '] },
            { lineNum: 5, action: 'inner-2', detail: 'Inner loop c = 2: Triggers condition!', explanation: 'c==2 is true.', iter: 1, phase: 'check', vars: { r: '1', c: '2' }, output: ['[1, 1] '] },
            { lineNum: 8, action: 'break', detail: 'break: Jump out of inner loop', explanation: 'Inner loop aborted early. Outer loop continues!', iter: 1, phase: 'break', vars: { r: '1', c: '2' }, output: ['[1, 1] ', 'Breaking inner loop at c=2!'] },
            { lineNum: 4, action: 'outer-2', detail: 'Outer loop r = 2', explanation: 'Outer cycle 2.', iter: 2, phase: 'body', vars: { r: '2', c: '-' }, output: ['[1, 1] ', 'Breaking inner loop at c=2!'] },
            { lineNum: 14, action: 'return', detail: 'return 0', explanation: 'Execution complete.', iter: 2, phase: 'exit', vars: { r: '2', c: '2' }, output: ['[1, 1] ', 'Breaking inner loop at c=2!', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 6,
        matchPattern: /4\.6|break and continue/i,
        label: '4.6 Break & Continue Statement',
        code: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 5; i++) {
        if (i == 2) {
            printf("continue: Skipping i=2\\n");
            continue; // Skips printf below, jumps directly to i++
        }
        if (i == 4) {
            printf("break: Aborting at i=4\\n");
            break; // Exits loop permanently
        }
        printf("Processed i = %d\\n", i);
    }
    return 0;
}`,
        steps: [
            { lineNum: 4, action: 'init', detail: 'i = 1', explanation: 'Normal iteration.', iter: 1, phase: 'body', vars: { i: '1' }, output: [] },
            { lineNum: 13, action: 'print', detail: 'printf Processed i = 1', explanation: 'Completed.', iter: 1, phase: 'body', vars: { i: '1' }, output: ['Processed i = 1'] },
            { lineNum: 4, action: 'step', detail: 'i = 2: Matches continue condition', explanation: 'Condition matched.', iter: 2, phase: 'check', vars: { i: '2' }, output: ['Processed i = 1'] },
            { lineNum: 7, action: 'continue', detail: 'continue executed: Skips rest of body!', explanation: 'Instant jump back to i++ without printing.', iter: 2, phase: 'continue', vars: { i: '2' }, output: ['Processed i = 1', 'continue: Skipping i=2'] },
            { lineNum: 4, action: 'step', detail: 'i = 3: Normal execution', explanation: 'Resumed.', iter: 3, phase: 'body', vars: { i: '3' }, output: ['Processed i = 1', 'continue: Skipping i=2'] },
            { lineNum: 13, action: 'print', detail: 'printf Processed i = 3', explanation: 'Completed.', iter: 3, phase: 'body', vars: { i: '3' }, output: ['Processed i = 1', 'continue: Skipping i=2', 'Processed i = 3'] },
            { lineNum: 4, action: 'step', detail: 'i = 4: Matches break condition', explanation: 'Abort trigger reached.', iter: 4, phase: 'check', vars: { i: '4' }, output: ['Processed i = 1', 'continue: Skipping i=2', 'Processed i = 3'] },
            { lineNum: 11, action: 'break', detail: 'break executed: Permanent loop exit', explanation: 'Skips all remaining iterations (i=4, i=5).', iter: 4, phase: 'break', vars: { i: '4' }, output: ['Processed i = 1', 'continue: Skipping i=2', 'Processed i = 3', 'break: Aborting at i=4'] },
            { lineNum: 15, action: 'return', detail: 'return 0', explanation: 'Process complete.', iter: 4, phase: 'exit', vars: { i: '4' }, output: ['Processed i = 1', 'continue: Skipping i=2', 'Processed i = 3', 'break: Aborting at i=4', '[Process completed with code 0]'] }
        ]
    }
];

const CHALLENGES = [
    {
        code: `int x = 0;\nfor (int i = 0; i < 5; i++) {\n    if (i % 2 == 0) continue;\n    x += i;\n}\nprintf("%d", x);`,
        question: 'What is printed after the loop completes?',
        options: ['4 (1 + 3)', '10', '6', '0'],
        correct: '4 (1 + 3)',
        explanation: 'When i is even (0, 2, 4), continue skips x += i. When i is odd (1, 3), x += i executes. Total: 1 + 3 = 4.'
    },
    {
        code: `int count = 5;\ndo {\n    count += 2;\n} while (count < 5);\nprintf("%d", count);`,
        question: 'What is printed by this do-while loop?',
        options: ['7', '5', 'Infinite loop', 'Compilation error'],
        correct: '7',
        explanation: 'do-while executes the body at least once before testing condition: 5 + 2 = 7. Then 7 < 5 is false, terminating loop.'
    }
];

export default function CLoopVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
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

    // Calculate rotation angle on circular track for current loop phase
    let angle = 0;
    if (currentStep.phase === 'init') angle = 0;
    else if (currentStep.phase === 'check') angle = 90;
    else if (currentStep.phase === 'body') angle = 180;
    else if (currentStep.phase === 'step') angle = 270;
    else if (currentStep.phase === 'continue') angle = 270;
    else if (currentStep.phase === 'break' || currentStep.phase === 'exit') angle = 330;

    return (
        <div className="space-y-4">
            {/* Simple & Clean Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        Loops &amp; Iteration
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
                        badgeText="C Loop Engine"
                        fileName="loops.c"
                        accentColor="#2563eb"
                    />
                </div>

                {/* ── RIGHT SIDE: Geometric Circular Loop Orbit & Registers (6 Cols) ── */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Repeat className="w-3.5 h-3.5 text-blue-600" />
                            Circular Iteration Orbit Shape
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Cycle {currentStep.iter || 1}
                        </span>
                    </div>

                    {/* 1. VISUAL CIRCULAR LOOP ORBIT SHAPE */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Repeat className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-semibold text-white">Execution Loop Wheel</h3>
                            </div>
                            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                Phase: {currentStep.phase?.toUpperCase()}
                            </span>
                        </div>

                        {/* Circular SVG Loop Track */}
                        <div className="py-2 flex items-center justify-center">
                            <svg viewBox="0 0 320 220" className="w-full max-w-[320px] h-auto">
                                {/* Outer Circular Orbit Path */}
                                <circle cx="160" cy="110" r="75" fill="none" stroke="#1e293b" strokeWidth="6" />
                                
                                {/* Active Revolving Arc */}
                                <circle
                                    cx="160"
                                    cy="110"
                                    r="75"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="6"
                                    strokeDasharray="471"
                                    strokeDashoffset={471 - (471 * (angle / 360))}
                                    strokeLinecap="round"
                                    className="transition-all duration-300"
                                />

                                {/* 4 Orbit Milestone Nodes */}
                                {/* Node 1: Check (Top) */}
                                <circle cx="160" cy="35" r="14" fill={currentStep.phase === 'check' ? '#10b981' : '#0f172a'} stroke="#3b82f6" strokeWidth="2" />
                                <text x="160" y="39" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">CHK</text>
                                <text x="160" y="18" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Condition?</text>

                                {/* Node 2: Body (Right) */}
                                <circle cx="235" cy="110" r="14" fill={currentStep.phase === 'body' ? '#3b82f6' : '#0f172a'} stroke="#3b82f6" strokeWidth="2" />
                                <text x="235" y="114" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">EXEC</text>
                                <text x="285" y="114" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Body</text>

                                {/* Node 3: Step / Increment (Bottom) */}
                                <circle cx="160" cy="185" r="14" fill={currentStep.phase === 'step' ? '#8b5cf6' : '#0f172a'} stroke="#3b82f6" strokeWidth="2" />
                                <text x="160" y="189" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">i++</text>
                                <text x="160" y="208" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Increment</text>

                                {/* Node 4: Loopback Curve (Left) */}
                                <circle cx="85" cy="110" r="14" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                                <text x="85" y="114" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold">↺</text>
                                <text x="40" y="114" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Loopback</text>

                                {/* Center Hub displaying live Iteration */}
                                <circle cx="160" cy="110" r="35" fill="#020617" stroke="#334155" strokeWidth="2" />
                                <text x="160" y="105" textAnchor="middle" fill="#64748b" fontSize="8" uppercase="true">ITERATION</text>
                                <text x="160" y="125" textAnchor="middle" fill="#38bdf8" fontSize="18" fontWeight="bold" fontFamily="monospace">
                                    {currentStep.iter || 1}
                                </text>

                                {/* Break Exit Escape Tube */}
                                {currentStep.phase === 'break' && (
                                    <g className="animate-pulse">
                                        <line x1="235" y1="110" x2="310" y2="70" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arrow)" />
                                        <rect x="250" y="45" width="65" height="18" rx="4" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
                                        <text x="282" y="57" textAnchor="middle" fill="#fecdd3" fontSize="8" fontWeight="bold">BREAK EXIT</text>
                                    </g>
                                )}

                                {/* Continue Shortcut Arrow */}
                                {currentStep.phase === 'continue' && (
                                    <g className="animate-pulse">
                                        <path d="M 235 110 Q 200 150 160 185" fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="3 2" />
                                        <text x="200" y="145" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">CONTINUE SKIP</text>
                                    </g>
                                )}
                            </svg>
                        </div>

                        {/* Live Variables & Explanation */}
                        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                            {Object.entries(currentStep.vars || {}).map(([vName, vVal]) => (
                                <div key={vName} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                                    <span className="text-slate-400">{vName}</span>
                                    <span className="text-base font-bold text-blue-300">{vVal}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed font-mono">
                            <strong className="text-blue-400 font-semibold">Status: </strong>
                            {currentStep.detail}
                        </div>
                    </div>

                    {/* 2. Mechanics Explanation Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                                <FastForward className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">Execution Cycle Analysis</h3>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                Cycle {currentStep.iter || 1}
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
                        <h3 className="text-sm font-semibold text-white">Interactive Loop Check</h3>
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

                        <div className="grid grid-cols-2 gap-2">
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
