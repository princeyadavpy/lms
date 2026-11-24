import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    Pause,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Sparkles,
    Terminal,
    Lightbulb,
    Code2,
    ArrowRight,
    CornerDownRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// MINI PYTHON INTERPRETER
// Supports: assignment, if/elif/else, while, for+range,
//           break, continue, pass, print, +=, -=, %
// ─────────────────────────────────────────────────────────────

function evaluateExpr(expr, variables) {
    try {
        let e = expr.trim();
        // Sort vars longest-first to avoid partial replacements
        const sorted = Object.entries(variables).sort((a, b) => b[0].length - a[0].length);
        for (const [name, val] of sorted) {
            e = e.replace(new RegExp('\\b' + name + '\\b', 'g'), typeof val === 'string' ? JSON.stringify(val) : String(val));
        }
        e = e.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!');
        e = e.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false');
        // eslint-disable-next-line no-new-func
        return new Function('return (' + e + ')')();
    } catch {
        return undefined;
    }
}

function substituteVars(expr, variables) {
    let r = expr;
    const sorted = Object.entries(variables).sort((a, b) => b[0].length - a[0].length);
    for (const [name, val] of sorted) {
        r = r.replace(new RegExp('\\b' + name + '\\b', 'g'), JSON.stringify(val));
    }
    return r;
}

function extractPrint(line, variables) {
    // print("string")
    const s1 = line.match(/print\(\s*["'](.*?)["']\s*\)/);
    if (s1) return s1[1];
    // print(var)
    const s2 = line.match(/print\(\s*(\w+)\s*\)/);
    if (s2 && variables[s2[1]] !== undefined) return String(variables[s2[1]]);
    // print(f"...")
    const s3 = line.match(/print\(\s*f?["'](.*?)["']\s*\)/);
    if (s3) {
        return s3[1].replace(/\{([^}]+)\}/g, (_, ex) => {
            const v = evaluateExpr(ex, variables);
            return v !== undefined ? String(v) : `{${ex}}`;
        });
    }
    // print("str", var) or print(expr)
    const s4 = line.match(/print\((.+)\)/);
    if (s4) {
        const parts = [];
        let buf = '', inStr = false, strCh = '';
        for (const ch of s4[1]) {
            if (!inStr && (ch === '"' || ch === "'")) { inStr = true; strCh = ch; buf += ch; }
            else if (inStr && ch === strCh) { inStr = false; buf += ch; }
            else if (!inStr && ch === ',') { parts.push(buf.trim()); buf = ''; }
            else { buf += ch; }
        }
        if (buf.trim()) parts.push(buf.trim());
        return parts.map(p => {
            if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) return p.slice(1, -1);
            if (variables[p] !== undefined) return String(variables[p]);
            const ev = evaluateExpr(p, variables);
            return ev !== undefined ? String(ev) : p;
        }).join(' ');
    }
    return line;
}

export function parseAndExecute(codeStr, maxIter = 200) {
    const rawLines = codeStr.split('\n');
    const steps = [];
    const variables = {};
    const outputs = [];
    let iterCount = 0;

    const codeLines = rawLines.map((raw, idx) => ({
        lineNum: idx + 1,
        raw,
        trimmed: raw.trimEnd(),
        indent: raw.length - raw.trimStart().length,
        text: raw.trim(),
    }));

    function addStep(lineNum, action, detail, explanation, extra = {}) {
        steps.push({
            lineNum, action, detail, explanation,
            variables: { ...variables },
            outputs: [...outputs],
            ...extra,
        });
    }

    function getIndent(idx) { return codeLines[idx]?.indent ?? 0; }

    function exec(start, end, baseIndent) {
        let i = start;
        while (i < end && iterCount < maxIter) {
            iterCount++;
            const cl = codeLines[i];
            const t = cl.text;
            if (!t || t.startsWith('#')) { i++; continue; }

            // ── Assignment: x = expr  or  x += expr  or  x -= expr ──
            const augMatch = t.match(/^(\w+)\s*(\+|-)?=\s*(.+)$/);
            if (augMatch && !t.startsWith('if ') && !t.startsWith('elif ') && !t.startsWith('else') && !t.startsWith('print') && !t.startsWith('while ') && !t.startsWith('for ') && !t.startsWith('break') && !t.startsWith('continue') && !t.startsWith('pass') && !t.startsWith('assert ') && !t.startsWith('return')) {
                const vn = augMatch[1], op = augMatch[2], vs = augMatch[3].trim();
                let val = evaluateExpr(vs, variables);
                if (val === undefined) val = vs.replace(/^["']|["']$/g, '');
                if (op === '+') val = (variables[vn] || 0) + val;
                else if (op === '-') val = (variables[vn] || 0) - val;
                variables[vn] = val;
                addStep(cl.lineNum, 'assign', `${vn} = ${JSON.stringify(val)}`,
                    `Variable "${vn}" is now ${JSON.stringify(val)}.`);
                i++;
                continue;
            }

            // ── print(...) ──
            if (t.startsWith('print(')) {
                const out = extractPrint(t, variables);
                outputs.push(out);
                addStep(cl.lineNum, 'print', `Output: ${out}`,
                    `Python prints "${out}" to the console.`);
                i++;
                continue;
            }

            // ── pass ──
            if (t === 'pass') {
                addStep(cl.lineNum, 'execute', 'pass (do nothing)',
                    'pass is a placeholder that does nothing. Python moves to the next line.');
                i++;
                continue;
            }

            // ── assert ──
            if (t.startsWith('assert ')) {
                const assertExpr = t.slice(7).split(',')[0].trim();
                const result = evaluateExpr(assertExpr, variables);
                if (result) {
                    addStep(cl.lineNum, 'condition', `assert ${assertExpr} → True ✓`,
                        `Assertion passed! ${assertExpr} is True, so execution continues.`, { conditionResult: 'true' });
                } else {
                    const msg = t.includes(',') ? t.split(',').slice(1).join(',').trim().replace(/^["']|["']$/g, '') : 'AssertionError';
                    addStep(cl.lineNum, 'condition', `assert ${assertExpr} → False ✗ — ${msg}`,
                        `Assertion FAILED! ${assertExpr} is False. Python raises AssertionError: "${msg}".`, { conditionResult: 'false' });
                    outputs.push(`AssertionError: ${msg}`);
                }
                i++;
                continue;
            }

            // ── while loop ──
            if (t.startsWith('while ') && t.endsWith(':')) {
                const condExpr = t.slice(6, -1).trim();
                const bodyStart = i + 1;
                const bodyEnd = findBlockEnd(bodyStart, cl.indent);
                // Check for else
                let elseStart = -1, elseEnd = -1;
                if (bodyEnd < codeLines.length && codeLines[bodyEnd].text === 'else:' && codeLines[bodyEnd].indent === cl.indent) {
                    elseStart = bodyEnd + 1;
                    elseEnd = findBlockEnd(elseStart, cl.indent);
                }

                let brokeOut = false;
                let loopIter = 0;
                while (iterCount < maxIter) {
                    iterCount++;
                    const condVal = evaluateExpr(condExpr, variables);
                    addStep(cl.lineNum, 'condition',
                        `${condExpr} → ${substituteVars(condExpr, variables)} → ${condVal ? 'True ✓' : 'False ✗'}`,
                        condVal
                            ? `Loop condition "${condExpr}" is True. Entering loop body (iteration ${loopIter + 1}).`
                            : `Loop condition "${condExpr}" is False. Loop ends.`,
                        { conditionResult: condVal ? 'true' : 'false' });

                    if (!condVal) break;

                    const result = exec(bodyStart, bodyEnd, cl.indent + 4);
                    if (result === 'break') { brokeOut = true; break; }
                    if (result === 'continue') { /* just re-loop */ }
                    loopIter++;
                }

                // while-else
                if (!brokeOut && elseStart > 0) {
                    addStep(codeLines[bodyEnd].lineNum, 'else', 'Loop ended naturally → entering else block',
                        'The while loop completed without hitting break, so Python enters the else block.');
                    exec(elseStart, elseEnd, cl.indent + 4);
                    i = elseEnd;
                } else {
                    i = elseStart > 0 ? elseEnd : bodyEnd;
                }
                continue;
            }

            // ── for loop ──
            if (t.startsWith('for ') && t.includes(' in ') && t.endsWith(':')) {
                const forMatch = t.match(/^for\s+(\w+)\s+in\s+(.+):$/);
                if (!forMatch) { i++; continue; }
                const loopVar = forMatch[1];
                const iterExpr = forMatch[2].trim();
                const bodyStart = i + 1;
                const bodyEnd = findBlockEnd(bodyStart, cl.indent);
                // Check for else
                let elseStart = -1, elseEnd = -1;
                if (bodyEnd < codeLines.length && codeLines[bodyEnd].text === 'else:' && codeLines[bodyEnd].indent === cl.indent) {
                    elseStart = bodyEnd + 1;
                    elseEnd = findBlockEnd(elseStart, cl.indent);
                }

                // Build iterable
                const iterable = buildIterable(iterExpr, variables);

                let brokeOut = false;
                for (let ii = 0; ii < iterable.length && iterCount < maxIter; ii++) {
                    iterCount++;
                    variables[loopVar] = iterable[ii];
                    addStep(cl.lineNum, 'loop-iter',
                        `${loopVar} = ${JSON.stringify(iterable[ii])}  (item ${ii + 1} of ${iterable.length})`,
                        `for loop assigns ${loopVar} = ${JSON.stringify(iterable[ii])} and enters the body.`,
                        { conditionResult: 'true' });

                    const result = exec(bodyStart, bodyEnd, cl.indent + 4);
                    if (result === 'break') { brokeOut = true; break; }
                }

                if (!brokeOut && iterable.length > 0) {
                    addStep(cl.lineNum, 'condition', `for loop finished — no more items`,
                        `All items in the iterable have been processed. The for loop ends.`,
                        { conditionResult: 'false' });
                }

                // for-else
                if (!brokeOut && elseStart > 0) {
                    addStep(codeLines[bodyEnd].lineNum, 'else', 'Loop ended naturally → entering else block',
                        'The for loop completed without hitting break, so Python enters the else block.');
                    exec(elseStart, elseEnd, cl.indent + 4);
                    i = elseEnd;
                } else {
                    i = elseStart > 0 ? elseEnd : bodyEnd;
                }
                continue;
            }

            // ── break ──
            if (t === 'break') {
                addStep(cl.lineNum, 'break', 'break — exit loop immediately',
                    'Python encounters break and immediately exits the current loop.');
                return 'break';
            }

            // ── continue ──
            if (t === 'continue') {
                addStep(cl.lineNum, 'continue', 'continue — skip to next iteration',
                    'Python encounters continue and skips the rest of this iteration, jumping back to the loop condition.');
                return 'continue';
            }

            // ── if / elif / else ──
            if (t.startsWith('if ') && t.endsWith(':')) {
                const result = execIfChain(i, cl.indent);
                i = result.nextIdx;
                if (result.signal) return result.signal;
                continue;
            }

            // Unknown
            addStep(cl.lineNum, 'execute', t, `Executing: ${t}`);
            i++;
        }
        return null;
    }

    function findBlockEnd(start, parentIndent) {
        let j = start;
        while (j < codeLines.length) {
            const lt = codeLines[j].text;
            if (!lt) { j++; continue; }
            if (codeLines[j].indent <= parentIndent) break;
            j++;
        }
        return j;
    }

    function buildIterable(expr, vars) {
        // range(...)
        const rangeMatch = expr.match(/^range\((.+)\)$/);
        if (rangeMatch) {
            const args = rangeMatch[1].split(',').map(a => {
                const v = evaluateExpr(a.trim(), vars);
                return typeof v === 'number' ? v : parseInt(a.trim()) || 0;
            });
            const result = [];
            let start = 0, stop = 0, step = 1;
            if (args.length === 1) { stop = args[0]; }
            else if (args.length === 2) { start = args[0]; stop = args[1]; }
            else if (args.length >= 3) { start = args[0]; stop = args[1]; step = args[2]; }
            if (step > 0) { for (let x = start; x < stop && result.length < 50; x += step) result.push(x); }
            else if (step < 0) { for (let x = start; x > stop && result.length < 50; x += step) result.push(x); }
            return result;
        }
        // List literal: ["a", "b", "c"]
        const listMatch = expr.match(/^\[(.+)\]$/);
        if (listMatch) {
            return listMatch[1].split(',').map(item => {
                item = item.trim();
                if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith("'") && item.endsWith("'"))) return item.slice(1, -1);
                const n = Number(item);
                return isNaN(n) ? (vars[item] !== undefined ? vars[item] : item) : n;
            });
        }
        // String literal: "hello"
        if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
            return expr.slice(1, -1).split('');
        }
        // Variable holding a list or string
        if (vars[expr] !== undefined) {
            const v = vars[expr];
            if (Array.isArray(v)) return v;
            if (typeof v === 'string') return v.split('');
            return [v];
        }
        return [];
    }

    function execIfChain(startIdx, baseIndent) {
        let i = startIdx;
        const branches = [];

        while (i < codeLines.length) {
            const ct = codeLines[i].text;
            const ci = codeLines[i].indent;
            if (ci !== baseIndent) break;

            let condType = null, condExpr = null;
            if (ct.startsWith('if ') && ct.endsWith(':')) { condType = 'if'; condExpr = ct.slice(3, -1).trim(); }
            else if (ct.startsWith('elif ') && ct.endsWith(':')) { condType = 'elif'; condExpr = ct.slice(5, -1).trim(); }
            else if (ct === 'else:') { condType = 'else'; }
            else break;

            const branchLineNum = codeLines[i].lineNum;
            const bodyStart = i + 1;
            const bodyEnd = findBlockEnd(bodyStart, baseIndent);
            branches.push({ condType, condExpr, branchLineNum, bodyStart, bodyEnd });
            i = bodyEnd;
        }

        let executedBranch = null;
        for (const branch of branches) {
            if (branch.condType === 'else') {
                addStep(branch.branchLineNum, 'else', 'All prior conditions False → else',
                    'None of the previous conditions matched, so Python enters the else branch.',
                    { conditionResult: 'fallback' });
                executedBranch = branch;
                break;
            }
            const result = evaluateExpr(branch.condExpr, variables);
            const boolResult = Boolean(result);
            addStep(branch.branchLineNum, 'condition',
                `${branch.condExpr} → ${substituteVars(branch.condExpr, variables)} → ${boolResult ? 'True ✓' : 'False ✗'}`,
                boolResult
                    ? `Condition "${branch.condExpr}" is True! Entering this block.`
                    : `Condition "${branch.condExpr}" is False. Skipping this block.`,
                { conditionResult: boolResult ? 'true' : 'false' });
            if (boolResult) { executedBranch = branch; break; }
        }

        let signal = null;
        if (executedBranch) {
            signal = exec(executedBranch.bodyStart, executedBranch.bodyEnd, baseIndent + 4);
        }

        return { nextIdx: i, signal };
    }

    exec(0, codeLines.length, 0);

    addStep(null, 'done', 'Program execution complete',
        'All lines have been processed. The program has finished running.');

    return { steps, codeLines: rawLines };
}

// ─────────────────────────────────────────────────────────────
// REUSABLE VISUALIZER SHELL
// Props:
//   title        — Section heading
//   subtitle     — Description text
//   badgeText    — Label for the badge
//   examples     — { id, label, code }[]
//   challenges   — { code, question, options[], correct, explanation }[]
// ─────────────────────────────────────────────────────────────
export default function CodeVisualizer({ title, subtitle, badgeText, examples, challenges }) {
    const [activeExampleId, setActiveExampleId] = useState(examples[0]?.id || '');
    const [code, setCode] = useState(examples[0]?.code || '');
    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const [terminalLines, setTerminalLines] = useState([]);
    const [typingText, setTypingText] = useState('');

    // Transition Arrow Hover State
    const [isHoverPaused, setIsHoverPaused] = useState(false);
    const [hoveredTransition, setHoveredTransition] = useState(null);

    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [predictionSubmitted, setPredictionSubmitted] = useState(false);
    const [isPredictionCorrect, setIsPredictionCorrect] = useState(null);

    const timerRef = useRef(null);
    const speedMs = { slow: 1800, normal: 1000, fast: 500 };

    const switchExample = (id) => {
        const ex = examples.find(e => e.id === id);
        if (ex) { setActiveExampleId(id); setCode(ex.code); resetExecution(); }
    };

    const resetExecution = () => {
        clearTimeout(timerRef.current);
        setIsRunning(false);
        setIsHoverPaused(false);
        setHoveredTransition(null);
        setExecutionState(null);
        setCurrentStepIdx(-1);
        setTerminalLines([]);
        setTypingText('');
    };

    const handleRunCode = () => {
        clearTimeout(timerRef.current);
        setIsHoverPaused(false);
        setHoveredTransition(null);
        const result = parseAndExecute(code);
        setExecutionState(result);
        setCurrentStepIdx(0);
        setIsRunning(true);
        setTerminalLines([]);
        setTypingText('');
    };

    // Auto-advance steps while running (pauses when isHoverPaused is true)
    useEffect(() => {
        if (!isRunning || !executionState || currentStepIdx < 0 || isHoverPaused) return;
        if (currentStepIdx >= executionState.steps.length) { setIsRunning(false); return; }

        const step = executionState.steps[currentStepIdx];
        setTerminalLines(step.outputs || []);

        if (step.action === 'print' && step.outputs.length > 0) {
            const latest = step.outputs[step.outputs.length - 1];
            let ci = 0; setTypingText('');
            const t = setInterval(() => { ci++; setTypingText(latest.slice(0, ci)); if (ci >= latest.length) clearInterval(t); }, 30);
        }

        timerRef.current = setTimeout(() => {
            if (currentStepIdx < executionState.steps.length - 1) setCurrentStepIdx(p => p + 1);
            else setIsRunning(false);
        }, speedMs[speed]);

        return () => clearTimeout(timerRef.current);
    }, [isRunning, currentStepIdx, executionState, speed, isHoverPaused]);

    const currentStep = executionState?.steps?.[currentStepIdx] || null;
    const isFinished = executionState && currentStepIdx >= executionState.steps.length - 1 && !isRunning;

    // Compute transition arrow from current step to next step
    const getNextExecutableStep = (steps, fromIdx) => {
        if (!steps) return null;
        for (let i = fromIdx + 1; i < steps.length; i++) {
            if (steps[i].lineNum !== null && steps[i].lineNum !== undefined) {
                return steps[i];
            }
        }
        return steps[steps.length - 1];
    };

    const nextStep = executionState?.steps ? getNextExecutableStep(executionState.steps, currentStepIdx) : null;

    const getTransitionInfo = (current, next) => {
        if (!current || !current.lineNum) return null;
        const fromLine = current.lineNum;
        const toLine = next?.lineNum || null;

        let reason = '';
        let direction = 'down'; // 'down' | 'up' | 'end'
        let isJump = false;

        if (!toLine) {
            direction = 'end';
            reason = `Program has reached the end. Line ${fromLine} was the final executed statement, so Python will now terminate execution.`;
        } else if (toLine < fromLine) {
            direction = 'up';
            isJump = true;
            reason = `Loop body completed! Python jumps back UP to Line ${toLine} to re-evaluate the loop condition with updated variables.`;
        } else if (toLine > fromLine + 1) {
            direction = 'down';
            isJump = true;
            if (current.action === 'condition' && current.conditionResult === 'false') {
                reason = `Condition on Line ${fromLine} evaluated to False (${current.detail}). Python skipped lines ${fromLine + 1}–${toLine - 1} and jumped directly to Line ${toLine}.`;
            } else if (current.action === 'break') {
                reason = `break statement executed on Line ${fromLine}! Python immediately terminated the loop and jumped outside to Line ${toLine}.`;
            } else if (current.action === 'continue') {
                reason = `continue statement executed on Line ${fromLine}. Python skipped the rest of this iteration and jumped to Line ${toLine}.`;
            } else {
                reason = `Execution jumped from Line ${fromLine} to Line ${toLine} because previous statements or conditions directed program flow here.`;
            }
        } else {
            direction = 'down';
            if (current.action === 'condition' && current.conditionResult === 'true') {
                reason = `Condition on Line ${fromLine} evaluated to True (${current.detail}). Python enters the indented block and executes Line ${toLine}.`;
            } else if (current.action === 'loop-iter') {
                reason = `Loop condition is True. Variable was assigned and Python proceeds into the loop body at Line ${toLine}.`;
            } else if (current.action === 'else') {
                reason = `Entered else block on Line ${fromLine}. Execution proceeds to the first statement inside at Line ${toLine}.`;
            } else {
                reason = `Line ${fromLine} finished executing (${current.detail}). Python proceeds sequentially to the next statement on Line ${toLine}.`;
            }
        }

        return { fromLine, toLine, direction, isJump, reason };
    };

    const transitionInfo = getTransitionInfo(currentStep, nextStep);

    // Challenge
    const currentChallenge = challenges?.[challengeIdx];
    const handleTestPrediction = () => {
        if (!selectedPrediction || !currentChallenge) return;
        setPredictionSubmitted(true);
        setIsPredictionCorrect(selectedPrediction === currentChallenge.correct);
        setCode(currentChallenge.code);
        setTimeout(() => {
            const r = parseAndExecute(currentChallenge.code);
            setExecutionState(r);
            setCurrentStepIdx(0);
            setIsRunning(true);
            setTerminalLines([]);
            setTypingText('');
        }, 300);
    };
    const handleNextChallenge = () => {
        setChallengeIdx((challengeIdx + 1) % (challenges?.length || 1));
        setSelectedPrediction(null);
        setPredictionSubmitted(false);
        setIsPredictionCorrect(null);
    };

    const getLineStatus = (lineNum) => {
        if (!executionState || currentStepIdx < 0) return 'idle';
        const step = currentStep;
        if (!step) return 'idle';
        if (step.lineNum === lineNum) return 'executing';
        for (let s = 0; s < currentStepIdx; s++) {
            const ps = executionState.steps[s];
            if (ps.lineNum === lineNum) {
                if (ps.action === 'skipped') return 'skipped';
                if (ps.conditionResult === 'false') return 'condition-false';
                if (ps.conditionResult === 'true' || ps.action === 'loop-iter') return 'condition-true';
                return 'executed';
            }
        }
        return 'idle';
    };

    return (
        <div className="space-y-4 text-slate-800">
            {/* ── 1. Minimal Header ─────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                            {subtitle || 'Edit the code, click "Run Code", and observe execution line-by-line.'}
                        </p>
                    </div>

                    {/* Clean Segmented Tab Control */}
                    {examples.length > 1 && (
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 shrink-0 self-stretch sm:self-auto overflow-x-auto">
                            {examples.map((ex) => {
                                const isSelected = activeExampleId === ex.id;
                                return (
                                    <button
                                        key={ex.id}
                                        type="button"
                                        onClick={() => switchExample(ex.id)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                                            isSelected
                                                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                        }`}
                                    >
                                        {ex.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── 2. Main Two-Column Layout ─────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                
                {/* ── Left Column: Code Editor (7 cols) ─────────────── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-3 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    <div className="bg-[#0b101b] rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        {/* Editor Window Bar */}
                        <div className="px-4 py-2.5 bg-[#080d16] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                            <span className="font-medium text-slate-300">main.py</span>
                            <span className="text-[11px] text-slate-500">Python 3.12</span>
                        </div>

                        {/* Editor Area with Line Numbers, Arrow Lane, Code Textarea */}
                        <div className="flex min-h-[260px] relative">
                            {/* Line Numbers */}
                            <div className="bg-[#080d16]/90 py-3 px-2 select-none flex flex-col text-right font-mono text-xs leading-[1.72rem] border-r border-slate-800/80 min-w-[36px] shrink-0 text-slate-500">
                                {code.split('\n').map((_, idx) => {
                                    const ln = idx + 1;
                                    const status = getLineStatus(ln);
                                    const isCurrent = status === 'executing';
                                    return (
                                        <div
                                            key={ln}
                                            className={`flex items-center justify-end gap-1 ${
                                                isCurrent
                                                    ? 'text-blue-400 font-bold'
                                                    : status === 'executed' || status === 'condition-true'
                                                    ? 'text-emerald-500/80'
                                                    : status === 'condition-false'
                                                    ? 'text-rose-400/80'
                                                    : status === 'skipped'
                                                    ? 'text-slate-600'
                                                    : 'text-slate-500'
                                            }`}
                                        >
                                            {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                                            <span>{ln}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* SVG Curved Arrow Lane (44px) */}
                            <div className="relative w-[44px] bg-[#080d16]/40 border-r border-slate-800/60 shrink-0 select-none overflow-visible">
                                {transitionInfo && transitionInfo.fromLine && (
                                    (() => {
                                        const LINE_HEIGHT = 27.52;
                                        const PADDING_TOP = 12;
                                        const y1 = PADDING_TOP + (transitionInfo.fromLine - 0.5) * LINE_HEIGHT;
                                        const targetLine = transitionInfo.toLine || transitionInfo.fromLine + 1;
                                        const y2 = PADDING_TOP + (targetLine - 0.5) * LINE_HEIGHT;

                                        const isGoingUp = transitionInfo.direction === 'up' || y2 < y1;
                                        const dy = Math.abs(y2 - y1);

                                        const startX = 14;
                                        const endX = 40;

                                        let pathD = '';
                                        let angle = 0;
                                        let midX = 10;
                                        const midY = (y1 + y2) / 2;

                                        if (isGoingUp) {
                                            const curveLeft = Math.max(2, 14 - dy * 0.15);
                                            pathD = `M ${startX} ${y1} C ${curveLeft} ${y1 - 10}, ${curveLeft} ${y2 + 10}, ${endX} ${y2}`;
                                            angle = -24;
                                            midX = curveLeft;
                                        } else if (dy > LINE_HEIGHT) {
                                            const curveLeft = Math.max(2, 14 - dy * 0.15);
                                            pathD = `M ${startX} ${y1} C ${curveLeft} ${y1 + 10}, ${curveLeft} ${y2 - 10}, ${endX} ${y2}`;
                                            angle = 24;
                                            midX = curveLeft;
                                        } else {
                                            pathD = `M ${startX} ${y1} C 6 ${y1 + 6}, 12 ${y2 - 6}, ${endX} ${y2}`;
                                            angle = 18;
                                            midX = 8;
                                        }

                                        return (
                                            <div className="absolute inset-0 overflow-visible pointer-events-none">
                                                <svg
                                                    className="w-full h-full overflow-visible"
                                                    style={{ minHeight: Math.max(240, (code.split('\n').length + 1) * 27.52) }}
                                                >
                                                    <defs>
                                                        <linearGradient id="curvedArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#f87171" />
                                                            <stop offset="50%" stopColor="#ef4444" />
                                                            <stop offset="100%" stopColor="#dc2626" />
                                                        </linearGradient>
                                                        <filter id="curvedArrowGlow" x="-20%" y="-20%" width="140%" height="140%">
                                                            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#ef4444" floodOpacity="0.75" />
                                                        </filter>
                                                    </defs>

                                                    <g
                                                        key={`curved-arrow-${transitionInfo.fromLine}-${transitionInfo.toLine}-${currentStepIdx}`}
                                                        className="cursor-pointer pointer-events-auto group"
                                                        onMouseEnter={() => {
                                                            setIsHoverPaused(true);
                                                            setHoveredTransition(transitionInfo);
                                                        }}
                                                        onMouseLeave={() => {
                                                            setIsHoverPaused(false);
                                                            setHoveredTransition(null);
                                                        }}
                                                    >
                                                        {/* Hit-area for easy hover */}
                                                        <path d={pathD} fill="none" stroke="transparent" strokeWidth="26" />

                                                        {/* Dark Outline */}
                                                        <path
                                                            d={pathD}
                                                            fill="none"
                                                            stroke="#060911"
                                                            strokeWidth="6"
                                                            strokeLinecap="round"
                                                            pathLength="100"
                                                            strokeDasharray="100"
                                                            strokeDashoffset="0"
                                                        >
                                                            <animate
                                                                attributeName="stroke-dashoffset"
                                                                from="100"
                                                                to="0"
                                                                dur="0.4s"
                                                                fill="freeze"
                                                                calcMode="spline"
                                                                keySplines="0.25 0.1 0.25 1"
                                                                keyTimes="0;1"
                                                            />
                                                        </path>

                                                        {/* Vibrant Red Arrow Stem */}
                                                        <path
                                                            d={pathD}
                                                            fill="none"
                                                            stroke="url(#curvedArrowGrad)"
                                                            strokeWidth="3.5"
                                                            strokeLinecap="round"
                                                            filter="url(#curvedArrowGlow)"
                                                            pathLength="100"
                                                            strokeDasharray="100"
                                                            strokeDashoffset="0"
                                                        >
                                                            <animate
                                                                attributeName="stroke-dashoffset"
                                                                from="100"
                                                                to="0"
                                                                dur="0.4s"
                                                                fill="freeze"
                                                                calcMode="spline"
                                                                keySplines="0.25 0.1 0.25 1"
                                                                keyTimes="0;1"
                                                            />
                                                        </path>

                                                        {/* Barbed Arrowhead motion along curve */}
                                                        <g>
                                                            <animateMotion
                                                                dur="0.4s"
                                                                fill="freeze"
                                                                rotate="auto"
                                                                path={pathD}
                                                                calcMode="spline"
                                                                keySplines="0.25 0.1 0.25 1"
                                                                keyTimes="0;1"
                                                            />
                                                            <polygon
                                                                points="0,0 -14,-7 -9,0 -14,7"
                                                                fill="#060911"
                                                                stroke="#060911"
                                                                strokeWidth="2.5"
                                                                strokeLinejoin="round"
                                                            />
                                                            <polygon
                                                                points="0,0 -13,-6 -8.5,0 -13,6"
                                                                fill="url(#curvedArrowGrad)"
                                                                stroke="#7f1d1d"
                                                                strokeWidth="0.8"
                                                                strokeLinejoin="round"
                                                            />
                                                        </g>

                                                        {/* Small subtle hover indicator */}
                                                        <g transform={`translate(${midX + 2}, ${midY})`}>
                                                            <rect
                                                                x="-15"
                                                                y="-7"
                                                                width="30"
                                                                height="14"
                                                                rx="7"
                                                                fill={isHoverPaused ? '#ef4444' : '#1e293b'}
                                                                stroke="#ef4444"
                                                                strokeWidth="1"
                                                                className="transition-colors"
                                                            />
                                                            <text
                                                                x="0"
                                                                y="3"
                                                                textAnchor="middle"
                                                                fill="#ffffff"
                                                                fontSize="8"
                                                                fontWeight="600"
                                                                fontFamily="sans-serif"
                                                            >
                                                                {isHoverPaused ? '⏸' : 'why?'}
                                                            </text>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>

                            {/* Editor Textarea */}
                            <div className="relative flex-1">
                                <div className="absolute inset-0 py-3 pointer-events-none" aria-hidden="true">
                                    {code.split('\n').map((_, idx) => {
                                        const ln = idx + 1;
                                        const status = getLineStatus(ln);
                                        let bg = '';
                                        if (status === 'executing') bg = 'bg-blue-500/15 border-l-2 border-blue-500';
                                        else if (status === 'condition-true') bg = 'bg-emerald-500/10';
                                        else if (status === 'condition-false') bg = 'bg-rose-500/10';
                                        else if (status === 'skipped') bg = 'bg-slate-800/40 opacity-40';
                                        else if (status === 'executed') bg = 'bg-emerald-500/5';
                                        return <div key={ln} className={`h-[1.72rem] ${bg} transition-colors duration-150`} />;
                                    })}
                                </div>
                                <textarea
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        resetExecution();
                                    }}
                                    spellCheck={false}
                                    className="w-full h-full bg-transparent text-emerald-300 font-mono text-xs leading-[1.72rem] p-3 resize-none outline-none border-none relative z-10 min-h-[260px]"
                                    style={{ caretColor: '#60a5fa', tabSize: 4 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Editor Control Bar (Clean & Minimal) */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                        <button
                            type="button"
                            onClick={isFinished ? resetExecution : handleRunCode}
                            disabled={isRunning && !isHoverPaused}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                                isRunning
                                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                    : isFinished
                                    ? 'bg-slate-800 hover:bg-slate-900 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {isRunning ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Running...</span>
                                </>
                            ) : isFinished ? (
                                <>
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset Code</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-3.5 h-3.5 fill-white" />
                                    <span>Run Code</span>
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="font-medium mr-1">Speed:</span>
                            <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200/80">
                                {(['slow', 'normal', 'fast']).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSpeed(s)}
                                        className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize cursor-pointer transition-colors ${
                                            speed === s
                                                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Single Unified Execution Inspector (5 cols) ── */}
                <div className="lg:col-span-5 lg:sticky lg:top-4 self-start space-y-3 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Execution State Inspector Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        {/* Header Status */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    isHoverPaused
                                        ? 'bg-amber-500 animate-pulse'
                                        : isRunning
                                        ? 'bg-blue-500 animate-pulse'
                                        : isFinished
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-300'
                                }`} />
                                <span className="text-xs font-semibold text-slate-700">
                                    {isHoverPaused
                                        ? 'Paused on Hover'
                                        : isRunning
                                        ? `Executing Line ${currentStep?.lineNum || 1}`
                                        : isFinished
                                        ? 'Execution Finished'
                                        : 'Execution Idle'}
                                </span>
                            </div>

                            {transitionInfo && (
                                <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded">
                                    <span>L{transitionInfo.fromLine}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-400" />
                                    <span className="font-semibold text-slate-800">{transitionInfo.toLine ? `L${transitionInfo.toLine}` : 'End'}</span>
                                </div>
                            )}
                        </div>

                        {/* Inspector Body */}
                        {currentStep ? (
                            <div className="space-y-2.5">
                                {/* Code Detail */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 font-mono text-xs text-slate-800">
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                                        Current Statement
                                    </div>
                                    <div className="font-semibold">{currentStep.detail}</div>
                                </div>

                                {/* Explanation */}
                                <div className="text-xs text-slate-600 leading-relaxed font-normal">
                                    {isHoverPaused && transitionInfo ? (
                                        <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1.5">
                                            <div className="font-bold text-amber-900 text-xs">
                                                Why did execution jump here?
                                            </div>
                                            <p className="text-xs leading-relaxed text-amber-900 font-normal">
                                                {transitionInfo.reason}
                                            </p>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-[10px] text-amber-700 font-medium">
                                                    Move cursor away to resume
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsHoverPaused(false)}
                                                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                                >
                                                    <Play className="w-2.5 h-2.5 fill-white" />
                                                    <span>Resume</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>{currentStep.explanation}</p>
                                    )}
                                </div>

                                {/* Live Variables */}
                                {currentStep.variables && Object.keys(currentStep.variables).length > 0 && (
                                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                                        <span className="text-[10px] font-medium text-slate-400 mr-0.5">Variables:</span>
                                        {Object.entries(currentStep.variables).map(([k, v]) => (
                                            <span
                                                key={k}
                                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700 border border-slate-200/70"
                                            >
                                                <span className="font-medium text-blue-600">{k}</span>
                                                <span className="text-slate-400">=</span>
                                                <span className="font-semibold text-slate-900">{JSON.stringify(v)}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-6 text-center text-slate-400 text-xs">
                                <Code2 className="w-7 h-7 mx-auto text-slate-300 mb-2" />
                                <p className="font-medium text-slate-500">Ready to trace code</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Click "Run Code" to step through execution.</p>
                            </div>
                        )}

                        {/* Minimal Step Progress */}
                        {executionState && (
                            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 font-mono">
                                    Step {Math.min(currentStepIdx + 1, executionState.steps.length)} of {executionState.steps.length}
                                </span>
                                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-200"
                                        style={{ width: `${((currentStepIdx + 1) / executionState.steps.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Minimal Console Window */}
                    <div className="bg-[#0b101b] rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-3.5 py-2 bg-[#080d16] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                                <span>Output</span>
                            </div>
                            <span className="text-[10px] text-slate-500">stdout</span>
                        </div>
                        <div className="p-3.5 font-mono text-xs min-h-[90px] text-slate-300 space-y-1">
                            {terminalLines.length > 0 ? (
                                <>
                                    {terminalLines.map((line, idx) => (
                                        <div key={idx} className="text-emerald-400 flex items-center gap-1">
                                            <span>
                                                {idx === terminalLines.length - 1 && isRunning
                                                    ? typingText
                                                    : line}
                                            </span>
                                            {idx === terminalLines.length - 1 && isRunning && (
                                                <span className="inline-block w-1.5 h-3.5 bg-emerald-400 animate-pulse" />
                                            )}
                                        </div>
                                    ))}
                                    {isFinished && (
                                        <div className="text-slate-500 text-[10px] pt-1 border-t border-slate-800/60 mt-1.5">
                                            Process finished
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-slate-600 italic text-[11px]">
                                    {isRunning ? 'Running...' : 'Console output will appear here.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 3. Minimal Practice Challenge ─────────────────────── */}
            {challenges && challenges.length > 0 && currentChallenge && (
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-0.5">
                                Practice Challenge #{challengeIdx + 1} of {challenges.length}
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">{currentChallenge.question}</h3>
                        </div>
                        <button
                            type="button"
                            onClick={handleNextChallenge}
                            className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                            Next →
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {currentChallenge.options.map((opt, i) => (
                            <button
                                key={i}
                                type="button"
                                disabled={predictionSubmitted}
                                onClick={() => setSelectedPrediction(opt)}
                                className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-left cursor-pointer ${
                                    selectedPrediction === opt
                                        ? 'bg-blue-50/80 border-blue-500 text-blue-900 font-semibold'
                                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-500 text-[11px]">Select your answer, then verify.</span>
                        <button
                            type="button"
                            disabled={!selectedPrediction || predictionSubmitted}
                            onClick={handleTestPrediction}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                !selectedPrediction || predictionSubmitted
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                        >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Verify Prediction</span>
                        </button>
                    </div>

                    {predictionSubmitted && (
                        <div
                            className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs animate-fadeIn ${
                                isPredictionCorrect
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                            }`}
                        >
                            {isPredictionCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1">
                                <span className="font-bold">
                                    {isPredictionCorrect ? 'Correct prediction!' : 'Incorrect prediction'}
                                </span>
                                <p className="text-slate-700 leading-normal">{currentChallenge.explanation}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

