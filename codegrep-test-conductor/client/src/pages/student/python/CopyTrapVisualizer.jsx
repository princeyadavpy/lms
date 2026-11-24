import React, { useState, useEffect, useRef } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Layers,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Sparkles,
    Copy,
    Link2,
    Zap,
    Unlink
} from 'lucide-react';

// ── Preset Examples for Topic 3.2 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'reference-alias',
        label: 'Ref Trap (b = a)',
        code: `a = [10, 20, 30]
b = a
b[0] = 999
print("a after mutating b:", a)
print("Are they the same object?", a is b)`
    },
    {
        id: 'shallow-copy',
        label: 'Shallow Copy',
        code: `original = [1, [2, 3]]
shallow = original[:]
shallow[0] = 100
shallow[1][0] = 999
print("original:", original)
print("shallow:", shallow)`
    },
    {
        id: 'deep-copy',
        label: 'Deep Copy',
        code: `import copy
base = ["config", [80, 443]]
isolated = copy.deepcopy(base)
isolated[1].append(8080)
print("base ports:", base[1])
print("isolated ports:", isolated[1])`
    },
    {
        id: 'enumerate-helper',
        label: 'enumerate()',
        code: `fruits = ["apple", "banana", "cherry"]
for idx, item in enumerate(fruits, start=1):
    print(f"Rank {idx}: {item}")`
    },
    {
        id: 'zip-parallel',
        label: 'zip() Walk',
        code: `names = ["Alice", "Bob", "Charlie"]
scores = [95, 88, 92]
for name, score in zip(names, scores):
    print(f"{name} -> {score}%")`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `x = [1, 2, 3]\ny = x\ny.append(4)`,
        question: 'What is len(x) after this code executes?',
        options: ['3', '4', '0', 'Error'],
        correct: '4',
        explanation: 'y = x copies the pointer address, not the list. Both x and y point to the exact same list in memory. y.append(4) mutates the shared list, so len(x) is 4.'
    },
    {
        code: `import copy\na = [[10, 20]]\nb = copy.copy(a)\nb[0][0] = 99`,
        question: 'What is a[0][0] after mutating b[0][0]?',
        options: ['10', '99', 'None', 'IndexError'],
        correct: '99',
        explanation: 'copy.copy() creates a shallow copy. The outer list is duplicated, but the nested list [10, 20] is shared by reference. Mutating b[0][0] mutates a[0][0].'
    }
];

// ── Address Helpers ─────────────────────────────────────────────────────────
function getHexAddress(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(4, '0').slice(-4);
    return `0x7ffee${hex}`;
}

// ── Simulation Engine ────────────────────────────────────────────────────────
function executeCopyTrapCode(codeStr) {
    const rawLines = codeStr.split('\n');
    const steps = [];
    const outputs = [];

    // Memory Heap: map of objId -> { id, address, items, isNested }
    let heap = {};
    // Symbol Table: map of varName -> objId
    let symTable = {};

    let objCounter = 1;

    const addStep = (lineNum, action, detail, alert = null) => {
        steps.push({
            lineNum,
            action,
            detail,
            alert,
            heap: JSON.parse(JSON.stringify(heap)),
            symTable: { ...symTable },
            outputs: [...outputs]
        });
    };

    for (let i = 0; i < rawLines.length; i++) {
        const lineNum = i + 1;
        const line = rawLines[i].trim();
        if (!line || line.startsWith('#') || line.startsWith('import')) continue;

        // 1. Initial list assignment: a = [10, 20, 30] or original = [1, [2, 3]]
        const initMatch = line.match(/^(\w+)\s*=\s*\[(.*)\]$/);
        if (initMatch) {
            const varName = initMatch[1];
            const rawItems = initMatch[2];
            const objId = `obj_${objCounter++}`;
            const address = getHexAddress(varName + objId);

            // Parse simple or nested items
            let items = [];
            if (rawItems.includes('[')) {
                // Nested example: [1, [2, 3]] or ["config", [80, 443]]
                const innerObjId = `obj_${objCounter++}`;
                const innerAddr = getHexAddress(`nested_${innerObjId}`);
                if (varName === 'original') {
                    heap[innerObjId] = { id: innerObjId, address: innerAddr, items: [2, 3], isNested: true };
                    items = [1, { ref: innerObjId, addr: innerAddr }];
                } else if (varName === 'base') {
                    heap[innerObjId] = { id: innerObjId, address: innerAddr, items: [80, 443], isNested: true };
                    items = ['"config"', { ref: innerObjId, addr: innerAddr }];
                } else {
                    items = [1, { ref: innerObjId, addr: innerAddr }];
                }
            } else {
                items = rawItems.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).map(s => isNaN(s) ? `"${s}"` : Number(s));
            }

            heap[objId] = { id: objId, address, items, isNested: false };
            symTable[varName] = objId;

            addStep(lineNum, 'alloc', `Allocated new list object in heap at ${address} assigned to '${varName}'`);
            continue;
        }

        // 2. Reference Assignment: b = a
        const aliasMatch = line.match(/^(\w+)\s*=\s*(\w+)$/);
        if (aliasMatch && symTable[aliasMatch[2]]) {
            const destVar = aliasMatch[1];
            const srcVar = aliasMatch[2];
            symTable[destVar] = symTable[srcVar];
            const sharedAddr = heap[symTable[srcVar]].address;

            addStep(
                lineNum,
                'alias',
                `'${destVar}' assigned reference of '${srcVar}' -> Both point to SAME heap address ${sharedAddr}!`,
                `REFERENCE ALIAS: No new memory allocated. '${destVar}' and '${srcVar}' are identical object pointers.`
            );
            continue;
        }

        // 3. Shallow Copy: shallow = original[:]
        const shallowMatch = line.match(/^(\w+)\s*=\s*(\w+)\[:\]$/);
        if (shallowMatch && symTable[shallowMatch[2]]) {
            const destVar = shallowMatch[1];
            const srcVar = shallowMatch[2];
            const srcObj = heap[symTable[srcVar]];

            const newObjId = `obj_${objCounter++}`;
            const newAddr = getHexAddress(destVar + newObjId);

            // Shallow duplicate: copy outer items (nested refs stay identical!)
            const clonedItems = [...srcObj.items];
            heap[newObjId] = { id: newObjId, address: newAddr, items: clonedItems, isNested: false };
            symTable[destVar] = newObjId;

            addStep(
                lineNum,
                'shallow',
                `Shallow copy created '${destVar}' at new address ${newAddr}, but inner nested objects remain SHARED references!`,
                `SHALLOW COPY TRAP: Outer list has address ${newAddr}, but inner list reference is shared!`
            );
            continue;
        }

        // 4. Deep Copy: isolated = copy.deepcopy(base)
        const deepMatch = line.match(/^(\w+)\s*=\s*copy\.deepcopy\((\w+)\)$/);
        if (deepMatch && symTable[deepMatch[2]]) {
            const destVar = deepMatch[1];
            const srcVar = deepMatch[2];
            const srcObj = heap[symTable[srcVar]];

            const newObjId = `obj_${objCounter++}`;
            const newAddr = getHexAddress(destVar + newObjId);

            // Clone nested objects deeply
            const clonedItems = srcObj.items.map(it => {
                if (typeof it === 'object' && it.ref) {
                    const innerCloneId = `obj_${objCounter++}`;
                    const innerCloneAddr = getHexAddress(`inner_${destVar}`);
                    heap[innerCloneId] = {
                        id: innerCloneId,
                        address: innerCloneAddr,
                        items: [...heap[it.ref].items],
                        isNested: true
                    };
                    return { ref: innerCloneId, addr: innerCloneAddr };
                }
                return it;
            });

            heap[newObjId] = { id: newObjId, address: newAddr, items: clonedItems, isNested: false };
            symTable[destVar] = newObjId;

            addStep(
                lineNum,
                'deepcopy',
                `Deep copy created completely independent object tree for '${destVar}' (inner and outer memory cloned).`
            );
            continue;
        }

        // 5. Direct index mutation: b[0] = 999 or shallow[0] = 100
        const mutateMatch = line.match(/^(\w+)\[(\d+)\]\s*=\s*(.+)$/);
        if (mutateMatch && symTable[mutateMatch[1]]) {
            const varName = mutateMatch[1];
            const idx = Number(mutateMatch[2]);
            const val = isNaN(mutateMatch[3]) ? mutateMatch[3].trim() : Number(mutateMatch[3]);

            const targetObj = heap[symTable[varName]];
            const oldVal = targetObj.items[idx];
            targetObj.items[idx] = val;

            // Find all variables that point to this object
            const aliases = Object.keys(symTable).filter(k => symTable[k] === symTable[varName] && k !== varName);
            const alertMsg = aliases.length > 0
                ? `MUTATION TRAP: Modifying '${varName}[${idx}]' simultaneously mutated '${aliases.join(', ')}' because both share ${targetObj.address}!`
                : null;

            addStep(lineNum, 'mutate', `Mutated slot [${idx}] from ${oldVal} to ${val}`, alertMsg);
            continue;
        }

        // 6. Nested index mutation: shallow[1][0] = 999
        const nestedMutateMatch = line.match(/^(\w+)\[(\d+)\]\[(\d+)\]\s*=\s*(.+)$/);
        if (nestedMutateMatch && symTable[nestedMutateMatch[1]]) {
            const varName = nestedMutateMatch[1];
            const outerIdx = Number(nestedMutateMatch[2]);
            const innerIdx = Number(nestedMutateMatch[3]);
            const val = Number(nestedMutateMatch[4]);

            const outerObj = heap[symTable[varName]];
            const nestedRef = outerObj.items[outerIdx]?.ref;
            if (nestedRef && heap[nestedRef]) {
                const innerObj = heap[nestedRef];
                innerObj.items[innerIdx] = val;

                // Find other objects that reference this inner list
                const affectedVars = Object.keys(symTable).filter(v => {
                    const obj = heap[symTable[v]];
                    return obj.items.some(it => it && it.ref === nestedRef);
                });

                addStep(
                    lineNum,
                    'nested_mutate',
                    `Mutated nested list item at ${innerObj.address} to ${val}`,
                    `SHALLOW COPY TRAP TRIGGERED: Nested list was shared! Both '${affectedVars.join("' and '")}' were affected!`
                );
            }
            continue;
        }

        // 7. Nested append: isolated[1].append(8080)
        const nestedAppendMatch = line.match(/^(\w+)\[(\d+)\]\.append\((.+)\)$/);
        if (nestedAppendMatch && symTable[nestedAppendMatch[1]]) {
            const varName = nestedAppendMatch[1];
            const outerIdx = Number(nestedAppendMatch[2]);
            const val = Number(nestedAppendMatch[3]);

            const outerObj = heap[symTable[varName]];
            const nestedRef = outerObj.items[outerIdx]?.ref;
            if (nestedRef && heap[nestedRef]) {
                heap[nestedRef].items.push(val);
                addStep(lineNum, 'nested_append', `Appended ${val} to isolated nested list at ${heap[nestedRef].address}`);
            }
            continue;
        }

        // 8. print() outputs
        if (line.startsWith('print(')) {
            if (line.includes('a is b')) {
                outputs.push('Are they the same object? True');
            } else if (line.includes('a after mutating b')) {
                outputs.push('a after mutating b: [999, 20, 30]');
            } else if (line.includes('"original:", original')) {
                outputs.push('original: [1, [999, 3]]');
            } else if (line.includes('"shallow:", shallow')) {
                outputs.push('shallow: [100, [999, 3]]');
            } else if (line.includes('"base ports:", base[1]')) {
                outputs.push('base ports: [80, 443]');
            } else if (line.includes('"isolated ports:", isolated[1]')) {
                outputs.push('isolated ports: [80, 443, 8080]');
            } else if (line.includes('Rank')) {
                outputs.push('Rank 1: apple\nRank 2: banana\nRank 3: cherry');
            } else if (line.includes('->')) {
                outputs.push('Alice -> 95%\nBob -> 88%\nCharlie -> 92%');
            } else {
                outputs.push('Execution completed.');
            }
            addStep(lineNum, 'print', 'Evaluated print statement to console output.');
            continue;
        }
    }

    if (steps.length === 0) {
        steps.push({
            lineNum: 1,
            action: 'idle',
            detail: 'Ready to execute',
            alert: null,
            heap: {},
            symTable: {},
            outputs: []
        });
    }

    return { steps, finalOutputs: outputs };
}

export default function CopyTrapVisualizer() {
    const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
    const [code, setCode] = useState(EXAMPLES[0].code);

    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal'); // 'slow' | 'normal' | 'fast'
    const speedMs = speed === 'slow' ? 1600 : speed === 'normal' ? 900 : 400;

    const timerRef = useRef(null);

    // Challenge state
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleSelectExample = (id) => {
        const found = EXAMPLES.find(e => e.id === id);
        if (!found) return;
        setSelectedExampleId(id);
        setCode(found.code);
        resetExecution();
    };

    const resetExecution = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setExecutionState(null);
        setCurrentStepIdx(-1);
    };

    const runCode = () => {
        resetExecution();
        const state = executeCopyTrapCode(code);
        setExecutionState(state);
        if (state.steps.length === 0) return;
        setCurrentStepIdx(0);
        setIsRunning(true);
    };

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
            const state = executeCopyTrapCode(code);
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
    const heap = currentStep?.heap || {};
    const symTable = currentStep?.symTable || {};
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    // Group variables by target heap object address
    const varNamesByObj = {};
    Object.entries(symTable).forEach(([varName, objId]) => {
        if (!varNamesByObj[objId]) varNamesByObj[objId] = [];
        varNamesByObj[objId].push(varName);
    });

    return (
        <div className="space-y-4 text-slate-800">
            {/* ── 1. Clean Structured Header with Full-Width Segmented Presets ────── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Copying Trap, References & Iterators Visualizer
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/60 shrink-0 hidden sm:inline-block">
                            Memory Reference Graph
                        </span>
                    </div>
                </div>

                

                {/* Presets Segmented Tabs */}
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
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                                        {i + 1}.
                                    </span>
                                    <span>{ex.label.replace(/^\d+\.\s*/, '')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── 2. Main Two-Column View ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                
                {/* ── Left Column: Interactive Code Editor with Animated Arrow Lane ── */}
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
                        badgeText="Reference Engine"
                        fileName="copy_trap.py"
                    />
                </div>

                {/* ── Right Column: Visual Memory Graph & Boxes (7 cols) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Mutation Trap Alert Banner */}
                    {currentStep?.alert && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 animate-fadeIn">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <span className="font-bold text-amber-900 block mb-0.5">Reference Trap Detected</span>
                                <span className="text-amber-800 leading-relaxed">{currentStep.alert}</span>
                            </div>
                        </div>
                    )}

                    {/* Heap Memory Cards */}
                    {Object.keys(heap).length > 0 ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                                <span className="flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Python Process Heap Memory (Object Allocation Map)</span>
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                    {Object.keys(heap).length} object(s) in RAM
                                </span>
                            </div>

                            {Object.entries(heap).map(([objId, objData]) => {
                                const boundVars = varNamesByObj[objId] || [];
                                const isAliased = boundVars.length > 1;

                                return (
                                    <div
                                        key={objId}
                                        className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 transition-all ${
                                            isAliased
                                                ? 'border-amber-300 ring-2 ring-amber-100'
                                                : 'border-slate-200'
                                        }`}
                                    >
                                        {/* Card Header: Variable Names & Pointers */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-slate-500">
                                                    Variable Pointer(s):
                                                </span>
                                                {boundVars.length > 0 ? (
                                                    boundVars.map(v => (
                                                        <span
                                                            key={v}
                                                            className={`px-2 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1 ${
                                                                isAliased
                                                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                            }`}
                                                        >
                                                            <Link2 className="w-3 h-3" />
                                                            <span>{v}</span>
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">
                                                        Nested Sub-object (referenced by parent)
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 text-xs font-mono">
                                                <span className="text-slate-400">{objData.address}</span>
                                                {isAliased && (
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                                                        Shared Memory Alias
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Object Memory Slots */}
                                        <div className="overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                            <div className="flex items-center gap-2 min-w-max">
                                                <span className="w-16 shrink-0 text-[10px] font-mono text-slate-400 text-right pr-2 uppercase tracking-wider font-bold">
                                                    Elements
                                                </span>
                                                {objData.items.map((it, idx) => {
                                                    const isNestedRef = typeof it === 'object' && it.ref;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`w-24 h-24 rounded-xl border flex flex-col justify-between p-2 text-center transition-all ${
                                                                isNestedRef
                                                                    ? 'bg-purple-950 border-purple-400 ring-2 ring-purple-500/20'
                                                                    : 'bg-[#0b101b] border-slate-800'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                                                                <span>[{idx}]</span>
                                                                <span>{isNestedRef ? 'pointer' : typeof it}</span>
                                                            </div>
                                                            <div className="font-mono font-bold text-xs text-emerald-300 truncate">
                                                                {isNestedRef ? `-> ${it.addr}` : String(it)}
                                                            </div>
                                                            <div className="text-[9px] font-mono text-slate-500 border-t border-slate-800 pt-1">
                                                                {isNestedRef ? 'Nested List Ref' : 'Value Slot'}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xs text-center space-y-3">
                            <Copy className="w-10 h-10 text-indigo-600 mx-auto opacity-80" />
                            <h3 className="text-base font-bold text-slate-900">
                                Ready to Trace Reference Binds & Shallow Copies
                            </h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                Click <strong>"Run Code"</strong> to observe how Python's symbol table binds variables to memory addresses, and see why shallow copying nested lists causes accidental mutations.
                            </p>
                        </div>
                    )}

                    {/* ── 3. Interactive Challenge ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <HelpCircle className="w-4 h-4 text-purple-600" />
                                <span>Knowledge Check: Memory Alias & Shallow Copy</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                                Question {challengeIdx + 1} of {CHALLENGES.length}
                            </span>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs">
                            <pre className="whitespace-pre-wrap">{CHALLENGES[challengeIdx].code}</pre>
                        </div>

                        <p className="text-xs font-semibold text-slate-800">
                            {CHALLENGES[challengeIdx].question}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            {CHALLENGES[challengeIdx].options.map((opt) => {
                                const isPicked = selectedAnswer === opt;
                                const isCorrect = opt === CHALLENGES[challengeIdx].correct;
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAnswer(opt);
                                            setShowExplanation(true);
                                        }}
                                        className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-left border cursor-pointer ${
                                            showExplanation
                                                ? isCorrect
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                                                    : isPicked
                                                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                                                    : 'bg-slate-50 border-slate-200 text-slate-500'
                                                : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                    {selectedAnswer === CHALLENGES[challengeIdx].correct ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                    )}
                                    <span>
                                        {selectedAnswer === CHALLENGES[challengeIdx].correct ? 'Correct Insight!' : 'Incorrect'}
                                    </span>
                                </div>
                                <p className="leading-relaxed">{CHALLENGES[challengeIdx].explanation}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setChallengeIdx((prev) => (prev + 1) % CHALLENGES.length);
                                        setSelectedAnswer(null);
                                        setShowExplanation(false);
                                    }}
                                    className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <span>Next Challenge</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

