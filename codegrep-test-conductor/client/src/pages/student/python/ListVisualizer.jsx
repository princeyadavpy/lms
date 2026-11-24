import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
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
    Database,
    Zap
} from 'lucide-react';

// ── Preset Examples ──────────────────────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'append-extend',
        label: 'append() & extend()',
        code: `fruits = ["apple", "banana"]
fruits.append("cherry")
fruits.append("date")
fruits.extend(["elderberry", "fig"])
print("Final count:", len(fruits))`
    },
    {
        id: 'insert-pop',
        label: 'insert() & pop()',
        code: `nums = [10, 20, 40]
nums.insert(2, 30)
removed = nums.pop()
first = nums.pop(0)
nums.append(50)
print("Remaining:", nums)`
    },
    {
        id: 'index-mutate',
        label: 'Index Mutation',
        code: `scores = [85, 90, 78, 92]
scores[0] = 100
scores[2] = 88
scores.remove(90)
print("Updated scores:", scores)`
    },
    {
        id: 'slicing',
        label: 'Slicing [1:4]',
        code: `letters = ["A", "B", "C", "D", "E"]
sub = letters[1:4]
first_two = letters[:2]
last_two = letters[-2:]
print("Slice sub:", sub)`
    },
    {
        id: 'sort-reverse',
        label: 'sort() & reverse()',
        code: `values = [42, 17, 88, 3, 25]
values.sort()
values.reverse()
values.pop()
print("Top values:", values)`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `items = [10, 20, 30]\nitems.append(40)\nitems.pop(1)\nitems.insert(1, 99)`,
        question: 'After executing this code, what value is stored at index 1?',
        options: ['20', '99', '30', '40'],
        correct: '99',
        explanation: 'items starts as [10, 20, 30]. append(40) makes it [10, 20, 30, 40]. pop(1) removes 20 leaving [10, 30, 40]. insert(1, 99) places 99 at index 1.'
    },
    {
        code: `chars = ["p", "y", "t", "h", "o", "n"]\nsub = chars[1:4]`,
        question: 'What elements are captured in sub = chars[1:4]?',
        options: ['["p", "y", "t"]', '["y", "t", "h"]', '["y", "t", "h", "o"]', '["t", "h", "o"]'],
        correct: '["y", "t", "h"]',
        explanation: 'Python slicing [start:stop] starts at index 1 ("y") and stops before index 4 ("h"), producing ["y", "t", "h"].'
    }
];

// ── Deterministic Memory Address Generator ───────────────────────────────────
function getVarAddress(varName) {
    let hash = 0;
    for (let i = 0; i < varName.length; i++) {
        hash = (hash << 5) - hash + varName.charCodeAt(i);
        hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(4, '0').slice(-4);
    return `0x7ffee${hex}`;
}

function getItemAddress(val, idx) {
    const str = `${val}_${idx}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(4, '0').slice(-4);
    return `0x${hex}`;
}

// ── Mini Python List Interpreter ─────────────────────────────────────────────
function evaluateVal(raw, vars) {
    const r = raw.trim();
    if (!r) return undefined;
    // string
    if ((r.startsWith('"') && r.endsWith('"')) || (r.startsWith("'") && r.endsWith("'"))) {
        return r.slice(1, -1);
    }
    // number
    if (!isNaN(Number(r))) return Number(r);
    // boolean
    if (r === 'True') return true;
    if (r === 'False') return false;
    // list literal [1, 2, 3]
    if (r.startsWith('[') && r.endsWith(']')) {
        const inner = r.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(',').map(s => evaluateVal(s.trim(), vars)).filter(x => x !== undefined);
    }
    // variable
    if (vars[r] !== undefined) return JSON.parse(JSON.stringify(vars[r]));
    // len(var)
    const lenMatch = r.match(/^len\((\w+)\)$/);
    if (lenMatch && Array.isArray(vars[lenMatch[1]])) {
        return vars[lenMatch[1]].length;
    }
    return r;
}

function executeListCode(codeStr) {
    const rawLines = codeStr.split('\n');
    const steps = [];
    const variables = {};
    const outputs = [];

    const addStep = (lineNum, action, detail, affectedVar = null, affectedIdx = null, sliceRange = null) => {
        steps.push({
            lineNum,
            action,
            detail,
            affectedVar,
            affectedIdx,
            sliceRange,
            variables: JSON.parse(JSON.stringify(variables)),
            outputs: [...outputs]
        });
    };

    for (let i = 0; i < rawLines.length; i++) {
        const lineNum = i + 1;
        const line = rawLines[i].trim();
        if (!line || line.startsWith('#')) continue;

        // 1. Initial list assignment: fruits = ["apple", "banana"]
        const listInit = line.match(/^(\w+)\s*=\s*(\[.*\])$/);
        if (listInit) {
            const varName = listInit[1];
            const parsedList = evaluateVal(listInit[2], variables) || [];
            variables[varName] = parsedList;
            addStep(lineNum, 'init', `Allocated list "${varName}" with ${parsedList.length} items`, varName);
            continue;
        }

        // 2. Slicing assignment: sub = letters[1:4]
        const sliceMatch = line.match(/^(\w+)\s*=\s*(\w+)\[(-?\d*)?:(-?\d*)?(?::(-?\d*))?\]$/);
        if (sliceMatch) {
            const destVar = sliceMatch[1];
            const srcVar = sliceMatch[2];
            if (Array.isArray(variables[srcVar])) {
                const srcArr = variables[srcVar];
                const startRaw = sliceMatch[3];
                const stopRaw = sliceMatch[4];
                const start = startRaw !== undefined && startRaw !== '' ? Number(startRaw) : 0;
                const stop = stopRaw !== undefined && stopRaw !== '' ? Number(stopRaw) : srcArr.length;
                const sliced = srcArr.slice(start, stop);
                variables[destVar] = sliced;
                addStep(lineNum, 'slice', `Sliced ${srcVar}[${startRaw || ''}:${stopRaw || ''}] -> "${destVar}" with ${sliced.length} items`, srcVar, null, [start, stop]);
                continue;
            }
        }

        // 3. append: fruits.append("cherry")
        const appendMatch = line.match(/^(\w+)\.append\((.+)\)$/);
        if (appendMatch) {
            const varName = appendMatch[1];
            const val = evaluateVal(appendMatch[2], variables);
            if (Array.isArray(variables[varName])) {
                variables[varName].push(val);
                const newIdx = variables[varName].length - 1;
                addStep(lineNum, 'append', `${varName}.append(${JSON.stringify(val)}) -> Inserted at index [${newIdx}]`, varName, newIdx);
            }
            continue;
        }

        // 4. extend: fruits.extend(["e", "f"])
        const extendMatch = line.match(/^(\w+)\.extend\((.+)\)$/);
        if (extendMatch) {
            const varName = extendMatch[1];
            const items = evaluateVal(extendMatch[2], variables);
            if (Array.isArray(variables[varName]) && Array.isArray(items)) {
                const startIdx = variables[varName].length;
                variables[varName].push(...items);
                addStep(lineNum, 'extend', `${varName}.extend() appended ${items.length} items`, varName, startIdx);
            }
            continue;
        }

        // 5. insert: nums.insert(1, 15)
        const insertMatch = line.match(/^(\w+)\.insert\((\d+)\s*,\s*(.+)\)$/);
        if (insertMatch) {
            const varName = insertMatch[1];
            const insIdx = Number(insertMatch[2]);
            const val = evaluateVal(insertMatch[3], variables);
            if (Array.isArray(variables[varName])) {
                variables[varName].splice(insIdx, 0, val);
                addStep(lineNum, 'insert', `${varName}.insert(${insIdx}, ${JSON.stringify(val)}) -> Elements shifted right`, varName, insIdx);
            }
            continue;
        }

        // 6. pop assignment or statement: removed = nums.pop() or nums.pop(0)
        const popMatch = line.match(/^(?:(\w+)\s*=\s*)?(\w+)\.pop\((\d+)?\)$/);
        if (popMatch) {
            const destVar = popMatch[1];
            const srcVar = popMatch[2];
            const popIdxRaw = popMatch[3];
            if (Array.isArray(variables[srcVar]) && variables[srcVar].length > 0) {
                const popIdx = popIdxRaw !== undefined ? Number(popIdxRaw) : variables[srcVar].length - 1;
                const removedVal = variables[srcVar].splice(popIdx, 1)[0];
                if (destVar) {
                    variables[destVar] = removedVal;
                }
                addStep(lineNum, 'pop', `Popped item ${JSON.stringify(removedVal)} from index [${popIdx}]`, srcVar, popIdx);
            }
            continue;
        }

        // 7. remove: nums.remove(val)
        const removeMatch = line.match(/^(\w+)\.remove\((.+)\)$/);
        if (removeMatch) {
            const varName = removeMatch[1];
            const val = evaluateVal(removeMatch[2], variables);
            if (Array.isArray(variables[varName])) {
                const remIdx = variables[varName].indexOf(val);
                if (remIdx !== -1) {
                    variables[varName].splice(remIdx, 1);
                    addStep(lineNum, 'remove', `Removed first occurrence of ${JSON.stringify(val)} at index [${remIdx}]`, varName, remIdx);
                }
            }
            continue;
        }

        // 8. index mutation: scores[0] = 100
        const mutateMatch = line.match(/^(\w+)\[(-?\d+)\]\s*=\s*(.+)$/);
        if (mutateMatch) {
            const varName = mutateMatch[1];
            let mutIdx = Number(mutateMatch[2]);
            const val = evaluateVal(mutateMatch[3], variables);
            if (Array.isArray(variables[varName])) {
                if (mutIdx < 0) mutIdx = variables[varName].length + mutIdx;
                if (mutIdx >= 0 && mutIdx < variables[varName].length) {
                    variables[varName][mutIdx] = val;
                    addStep(lineNum, 'mutate', `Mutated ${varName}[${mutIdx}] = ${JSON.stringify(val)} in place`, varName, mutIdx);
                }
            }
            continue;
        }

        // 9. sort: values.sort()
        const sortMatch = line.match(/^(\w+)\.sort\((.*)\)$/);
        if (sortMatch) {
            const varName = sortMatch[1];
            const isReverse = sortMatch[2].includes('reverse=True');
            if (Array.isArray(variables[varName])) {
                variables[varName].sort((a, b) => {
                    if (typeof a === 'number' && typeof b === 'number') {
                        return isReverse ? b - a : a - b;
                    }
                    return isReverse ? String(b).localeCompare(String(a)) : String(a).localeCompare(String(b));
                });
                addStep(lineNum, 'sort', `Sorted list "${varName}" in place (${isReverse ? 'descending' : 'ascending'})`, varName);
            }
            continue;
        }

        // 10. reverse: values.reverse()
        const revMatch = line.match(/^(\w+)\.reverse\(\)$/);
        if (revMatch) {
            const varName = revMatch[1];
            if (Array.isArray(variables[varName])) {
                variables[varName].reverse();
                addStep(lineNum, 'reverse', `Reversed elements in list "${varName}" in place`, varName);
            }
            continue;
        }

        // 11. print statement
        const printMatch = line.match(/^print\((.+)\)$/);
        if (printMatch) {
            const evaluated = evaluateVal(printMatch[1], variables);
            const strVal = typeof evaluated === 'object' ? JSON.stringify(evaluated) : String(evaluated);
            outputs.push(strVal);
            addStep(lineNum, 'print', `stdout: ${strVal}`);
            continue;
        }

        // Fallback generic step
        addStep(lineNum, 'exec', `Executed statement: ${line}`);
    }

    return { steps, finalVariables: variables, finalOutputs: outputs };
}

// ── Main ListVisualizer Component ─────────────────────────────────────────────
const ListVisualizer = () => {
    const [selectedExampleId, setSelectedExampleId] = useState('append-extend');
    const [code, setCode] = useState(EXAMPLES[0].code);

    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal'); // 'slow' | 'normal' | 'fast'

    // Challenge State
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [isPredictionSubmitted, setIsPredictionSubmitted] = useState(false);

    const timerRef = useRef(null);

    const speedMs = speed === 'slow' ? 1200 : speed === 'normal' ? 700 : 350;

    // Load example
    const handleSelectExample = (exId) => {
        const found = EXAMPLES.find(e => e.id === exId);
        if (found) {
            setSelectedExampleId(exId);
            setCode(found.code);
            resetExecution();
        }
    };

    const resetExecution = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setExecutionState(null);
        setCurrentStepIdx(-1);
    };

    const runCode = () => {
        resetExecution();
        const state = executeListCode(code);
        setExecutionState(state);
        if (state.steps.length === 0) return;

        setCurrentStepIdx(0);
        setIsRunning(true);
    };

    // Auto-advance execution loop
    useEffect(() => {
        if (!isRunning || !executionState) return;

        if (currentStepIdx >= executionState.steps.length - 1) {
            setIsRunning(false);
            return;
        }

        timerRef.current = setTimeout(() => {
            setCurrentStepIdx(prev => prev + 1);
        }, speedMs);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isRunning, currentStepIdx, executionState, speedMs]);

    const stepForward = () => {
        if (!executionState) {
            const state = executeListCode(code);
            setExecutionState(state);
            setCurrentStepIdx(0);
            return;
        }
        if (currentStepIdx < executionState.steps.length - 1) {
            setCurrentStepIdx(prev => prev + 1);
        }
    };

    const currentStep = executionState?.steps[currentStepIdx] || null;
    const currentLineNum = currentStep?.lineNum || null;
    const activeVariables = currentStep?.variables || {};
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    // Extract all list variables currently in state
    const listEntries = Object.entries(activeVariables).filter(([_, val]) => Array.isArray(val));

    // Calculate dynamic capacity (power of 2 doubling representation)
    const getCapacity = (len) => {
        if (len === 0) return 4;
        let cap = 4;
        while (cap < len) cap *= 2;
        return cap;
    };

    return (
        <div className="space-y-4 text-slate-800">
            
            {/* ── 1. Clean Structured Header with Full-Width Segmented Presets ────── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                {/* Title & Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Python List Memory Architecture Visualizer
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200/60 shrink-0 hidden sm:inline-block">
                            Contiguous Array Engine
                        </span>
                    </div>
                </div>

                {/* Subtitle */}
                

                {/* Presets Segmented Tabs (Full width row, neatly aligned) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-start gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
                        Presets:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 shrink-0">
                        {EXAMPLES.map((ex, i) => {
                            const isSelected = selectedExampleId === ex.id;
                            return (
                                <button
                                    key={ex.id}
                                    type="button"
                                    onClick={() => handleSelectExample(ex.id)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                        isSelected
                                            ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                    }`}
                                >
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                                        {i + 1}.
                                    </span>
                                    <span>{ex.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── 2. Main Two-Column View: Code on Left | Boxes on Right ─ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                {/* ── LEFT COLUMN: Interactive Code Editor with Animated Arrow Lane ── */}
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
                        badgeText="Python List Engine"
                        fileName="lists.py"
                    />
                </div>

                {/* ── RIGHT COLUMN: The Visual of Memory Boxes (7 cols) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {listEntries.length > 0 ? (
                        listEntries.map(([varName, items]) => {
                            const capacity = getCapacity(items.length);
                            const emptySlotsCount = Math.max(0, capacity - items.length);
                            const baseAddress = getVarAddress(varName);
                            const isTargetVar = currentStep?.affectedVar === varName;
                            const affectedIdx = isTargetVar ? currentStep?.affectedIdx : null;
                            const sliceRange = isTargetVar ? currentStep?.sliceRange : null;

                            return (
                                <div
                                    key={varName}
                                    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4 transition-all"
                                >
                                    {/* List Metadata Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                        <div className="flex items-center gap-2.5">
                                            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200/80">
                                                {varName}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-800">
                                                list (Dynamic Array)
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                            <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 border border-slate-200/60">
                                                len = {items.length}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-slate-500 text-[11px]">
                                                Capacity: {capacity} slots
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-slate-400 text-[11px] font-mono">
                                                {baseAddress}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── THE VISUAL BOXES (Horizontal Contiguous Memory Array) ── */}
                                    <div className="overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                        <div className="min-w-max space-y-2.5">
                                            
                                            {/* 1. Positive Indices Row (Top) */}
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 shrink-0 text-[10px] font-mono text-slate-400 text-right pr-2 uppercase tracking-wider font-bold">
                                                    Index [i]
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {items.map((_, idx) => (
                                                        <div
                                                            key={`pos-${idx}`}
                                                            className={`w-20 sm:w-24 text-center py-1 rounded-md text-[11px] font-mono font-bold transition-all ${
                                                                affectedIdx === idx
                                                                    ? 'bg-blue-600 text-white shadow-xs scale-105'
                                                                    : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                                            }`}
                                                        >
                                                            {idx}
                                                        </div>
                                                    ))}
                                                    {/* Empty slot indicators for capacity */}
                                                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                                                        <div
                                                            key={`empty-idx-${idx}`}
                                                            className="w-20 sm:w-24 text-center py-1 rounded-md text-[10px] font-mono text-slate-400 border border-dashed border-slate-200 bg-slate-50/50"
                                                        >
                                                            {items.length + idx}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 2. THE MEMORY BOXES (Middle Contiguous Array Cells) */}
                                            <div className="flex items-center gap-2 relative">
                                                <span className="w-20 shrink-0 text-[10px] font-mono text-slate-500 text-right pr-2 uppercase tracking-wider font-bold">
                                                    Memory
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {/* Render Occupied Boxes */}
                                                    {items.map((val, idx) => {
                                                        const isAffected = affectedIdx === idx;
                                                        const valType = typeof val;
                                                        const itemAddr = getItemAddress(val, idx);

                                                        // Slicing bracket highlight
                                                        const isInSlice = sliceRange && idx >= sliceRange[0] && idx < sliceRange[1];

                                                        return (
                                                            <div
                                                                key={`box-${idx}-${val}`}
                                                                className={`w-20 h-24 sm:w-24 sm:h-28 rounded-xl border-2 flex flex-col justify-between p-2.5 transition-all duration-300 relative select-text ${
                                                                    isAffected
                                                                        ? currentStep?.action === 'append' || currentStep?.action === 'insert'
                                                                            ? 'bg-emerald-950 border-emerald-400 ring-4 ring-emerald-500/20 scale-105 shadow-md'
                                                                            : currentStep?.action === 'pop' || currentStep?.action === 'remove'
                                                                            ? 'bg-rose-950 border-rose-400 ring-4 ring-rose-500/20 scale-95 opacity-60'
                                                                            : 'bg-amber-950 border-amber-400 ring-4 ring-amber-500/20 scale-105 shadow-md'
                                                                        : isInSlice
                                                                        ? 'bg-blue-950/90 border-blue-400 ring-2 ring-blue-500/20'
                                                                        : 'bg-[#0b101b] border-slate-800 shadow-sm'
                                                                }`}
                                                            >
                                                                {/* Type Badge */}
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[9px] font-mono uppercase font-bold text-slate-400 bg-slate-800/80 px-1 rounded">
                                                                        {valType === 'string' ? 'str' : valType === 'number' ? 'int' : valType}
                                                                    </span>
                                                                    <span className="text-[9px] font-mono text-slate-500">
                                                                        [{idx}]
                                                                    </span>
                                                                </div>

                                                                {/* Value inside the Box */}
                                                                <div className="text-center font-mono font-bold text-xs sm:text-sm text-emerald-300 truncate py-1">
                                                                    {valType === 'string' ? `"${val}"` : String(val)}
                                                                </div>

                                                                {/* Pointer address */}
                                                                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-800/80">
                                                                    <span className="text-slate-600">ptr</span>
                                                                    <span className="text-slate-400">{itemAddr}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* Render Empty Pre-allocated Capacity Slots */}
                                                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                                                        <div
                                                            key={`empty-box-${idx}`}
                                                            className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center p-2"
                                                        >
                                                            <span className="text-[10px] font-mono text-slate-400 font-medium">
                                                                Empty
                                                            </span>
                                                            <span className="text-[9px] text-slate-300 mt-1 font-mono">
                                                                Allocated
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 3. Negative Indices Row (Bottom) */}
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 shrink-0 text-[10px] font-mono text-amber-700/80 text-right pr-2 uppercase tracking-wider font-bold">
                                                    Index [-i]
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {items.map((_, idx) => {
                                                        const negIdx = idx - items.length;
                                                        return (
                                                            <div
                                                                key={`neg-${idx}`}
                                                                className="w-20 sm:w-24 text-center py-1 rounded-md text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/60"
                                                            >
                                                                {negIdx}
                                                            </div>
                                                        );
                                                    })}
                                                    {/* Empty slot spacer so alignment matches exactly */}
                                                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                                                        <div
                                                            key={`empty-neg-${idx}`}
                                                            className="w-20 sm:w-24 text-center py-1 text-[10px] text-transparent select-none"
                                                        >
                                                            -
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Insight Badge */}
                                    {isTargetVar && currentStep && (
                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5 text-slate-700">
                                                <Zap className="w-3.5 h-3.5 text-blue-600" />
                                                <span className="font-semibold text-slate-900">{currentStep.detail}</span>
                                            </div>
                                            <span className="text-[11px] text-slate-400 font-mono">
                                                Line {currentStep.lineNum}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        /* Empty state before running */
                        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xs text-center space-y-3">
                            <Layers className="w-10 h-10 text-blue-600 mx-auto opacity-80" />
                            <h3 className="text-base font-bold text-slate-900">
                                Ready to Visualize Python List Memory
                            </h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                Click <strong>"Run Code"</strong> on the left. The visualizer will construct the contiguous memory array boxes, displaying positive indices, heap pointers, and negative indices in real time.
                            </p>
                        </div>
                    )}

                    {/* Slicing Explanation Card if Slicing Occurred */}
                    {currentStep?.action === 'slice' && currentStep?.sliceRange && (
                        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-1">
                            <div className="font-bold flex items-center gap-1.5 text-blue-900">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                <span>Slicing Mechanism: Shallow Copy Creation</span>
                            </div>
                            <p className="leading-relaxed">
                                Python slicing creates a <strong>brand-new independent list</strong> containing copies of the references. Modifying the slice will not mutate the original list!
                            </p>
                        </div>
                    )}

                    {/* ── 3. Interactive Challenge / Knowledge Check ──────────── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <HelpCircle className="w-4 h-4 text-purple-600" />
                                <span>Try It Yourself: List Prediction Challenge</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                                Question {challengeIdx + 1} of {CHALLENGES.length}
                            </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#0b101b] font-mono text-xs text-emerald-300 whitespace-pre leading-relaxed border border-slate-800">
                            {CHALLENGES[challengeIdx].code}
                        </div>

                        <p className="text-xs font-medium text-slate-800">
                            {CHALLENGES[challengeIdx].question}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {CHALLENGES[challengeIdx].options.map((opt) => {
                                const isSelected = selectedPrediction === opt;
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        disabled={isPredictionSubmitted}
                                        onClick={() => setSelectedPrediction(opt)}
                                        className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            {!isPredictionSubmitted ? (
                                <button
                                    type="button"
                                    disabled={!selectedPrediction}
                                    onClick={() => setIsPredictionSubmitted(true)}
                                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-all cursor-pointer"
                                >
                                    Check Prediction
                                </button>
                            ) : (
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-1.5 text-xs font-bold">
                                        {selectedPrediction === CHALLENGES[challengeIdx].correct ? (
                                            <span className="text-emerald-600 flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                                            </span>
                                        ) : (
                                            <span className="text-rose-600 flex items-center gap-1">
                                                <XCircle className="w-4 h-4" /> Incorrect. Correct is {CHALLENGES[challengeIdx].correct}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setChallengeIdx((challengeIdx + 1) % CHALLENGES.length);
                                            setSelectedPrediction(null);
                                            setIsPredictionSubmitted(false);
                                        }}
                                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                                    >
                                        <span>Next Question</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {isPredictionSubmitted && (
                            <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed font-normal">
                                {CHALLENGES[challengeIdx].explanation}
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ListVisualizer;

