import React, { useState, useEffect, useRef, useCallback } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
    Play,
    RotateCcw,
    SkipForward,
    Terminal,
    Lock,
    Sparkles,
    Layers,
    CheckCircle2,
    XCircle,
    ArrowRight,
    HelpCircle,
    Key,
    MousePointer2
} from 'lucide-react';

// ── Preset Examples for Topic 4.4 ───────────────────────────────────────────
const EXAMPLES = [
    {
        id: 'intersection',
        label: 'Intersection (&)',
        code: `front = {"HTML", "CSS", "TypeScript", "React"}
back = {"Python", "SQL", "TypeScript", "Docker"}

# Elements in BOTH sets
shared = front & back
print("Shared skills (&):", shared)`
    },
    {
        id: 'union',
        label: 'Union (|)',
        code: `front = {"HTML", "CSS", "TypeScript"}
back = {"Python", "SQL", "TypeScript"}

# Elements in EITHER set (combined)
all_skills = front | back
print("All skills (|):", all_skills)`
    },
    {
        id: 'difference',
        label: 'Difference (-)',
        code: `front = {"HTML", "CSS", "TypeScript"}
back = {"Python", "SQL", "TypeScript"}

# Elements in front, but NOT in back
only_front = front - back
print("Unique to Frontend (-):", only_front)`
    },
    {
        id: 'sym-difference',
        label: 'Symmetric Diff (^)',
        code: `front = {"HTML", "CSS", "TypeScript"}
back = {"Python", "SQL", "TypeScript"}

# Elements in either, but NOT in both
non_shared = front ^ back
print("Non-shared skills (^):", non_shared)`
    },
    {
        id: 'frozenset-dict-key',
        label: 'frozenset Key',
        code: `# frozenset is immutable and therefore hashable
admin_roles = frozenset(["read", "write", "delete"])
viewer_roles = frozenset(["read"])

access_control = {
    admin_roles: "Superuser Tier",
    viewer_roles: "Read-only Guest Tier"
}

print("Admin Tier:", access_control[admin_roles])`
    }
];

// ── Interactive Challenges ───────────────────────────────────────────────────
const CHALLENGES = [
    {
        code: `a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a ^ b)`,
        question: 'What is the result of a ^ b (symmetric difference)?',
        options: ['{2, 3}', '{1, 4}', '{1, 2, 3, 4}', '{1}'],
        correct: '{1, 4}',
        explanation: 'Symmetric difference (a ^ b) captures elements that appear in either set, but NOT in both. 2 and 3 are in both sets, leaving {1, 4}.'
    },
    {
        code: `s = frozenset([1, 2])\ns.add(3)`,
        question: 'What happens when calling s.add(3) on a frozenset?',
        options: [
            'AttributeError: frozenset object has no attribute add',
            's becomes frozenset({1, 2, 3})',
            'TypeError',
            'None'
        ],
        correct: 'AttributeError: frozenset object has no attribute add',
        explanation: 'frozenset is strictly immutable. It does not possess mutator methods like .add() or .remove(), raising an AttributeError.'
    }
];

function executeSetTheoryCode(codeStr) {
    const rawLines = codeStr.split('\n');
    const steps = [];
    const outputs = [];

    let setA = ['HTML', 'CSS', 'TypeScript'];
    let setB = ['Python', 'SQL', 'TypeScript'];
    let operation = null; // 'intersection' | 'union' | 'difference' | 'sym_diff' | 'frozenset'
    let resultItems = [];

    const addStep = (lineNum, action, detail, extra = {}) => {
        steps.push({
            lineNum,
            action,
            detail,
            setA: [...setA],
            setB: [...setB],
            operation,
            resultItems: [...resultItems],
            outputs: [...outputs],
            ...extra
        });
    };

    if (codeStr.includes('front & back')) {
        operation = 'intersection';
        resultItems = ['TypeScript'];
        addStep(1, 'init', "Defined front = {'HTML', 'CSS', 'TypeScript', 'React'}");
        addStep(2, 'init', "Defined back = {'Python', 'SQL', 'TypeScript', 'Docker'}");
        addStep(5, 'compute', "front & back highlighted central overlap lens: {'TypeScript'}");
        outputs.push("Shared skills (&): {'TypeScript'}");
        addStep(6, 'print', 'Shared skills printed');
    } else if (codeStr.includes('front | back')) {
        operation = 'union';
        resultItems = ['HTML', 'CSS', 'TypeScript', 'Python', 'SQL'];
        addStep(1, 'init', "Defined front = {'HTML', 'CSS', 'TypeScript'}");
        addStep(2, 'init', "Defined back = {'Python', 'SQL', 'TypeScript'}");
        addStep(5, 'compute', 'front | back combined all items from both sets');
        outputs.push("All skills (|): {'HTML', 'CSS', 'TypeScript', 'Python', 'SQL'}");
        addStep(6, 'print', 'All skills printed');
    } else if (codeStr.includes('front - back')) {
        operation = 'difference';
        resultItems = ['HTML', 'CSS'];
        addStep(1, 'init', "Defined front = {'HTML', 'CSS', 'TypeScript'}");
        addStep(2, 'init', "Defined back = {'Python', 'SQL', 'TypeScript'}");
        addStep(5, 'compute', "front - back subtracted elements present in back, leaving {'HTML', 'CSS'}");
        outputs.push("Unique to Frontend (-): {'HTML', 'CSS'}");
        addStep(6, 'print', 'Difference printed');
    } else if (codeStr.includes('front ^ back')) {
        operation = 'sym_diff';
        resultItems = ['HTML', 'CSS', 'Python', 'SQL'];
        addStep(1, 'init', "Defined front = {'HTML', 'CSS', 'TypeScript'}");
        addStep(2, 'init', "Defined back = {'Python', 'SQL', 'TypeScript'}");
        addStep(5, 'compute', 'front ^ back collected items in either set but excluded overlapping TypeScript');
        outputs.push("Non-shared skills (^): {'HTML', 'CSS', 'Python', 'SQL'}");
        addStep(6, 'print', 'Symmetric difference printed');
    } else {
        operation = 'frozenset';
        resultItems = ['read', 'write', 'delete'];
        addStep(2, 'init', 'frozenset created immutable, hashable set object');
        addStep(6, 'dict_key', 'Successfully mapped frozenset as valid dictionary key in access_control');
        outputs.push('Admin Tier: Superuser Tier');
        addStep(10, 'print', 'Access control lookup printed');
    }

    if (steps.length === 0) {
        steps.push({ lineNum: 1, action: 'idle', detail: 'Ready to execute', outputs: [] });
    }

    return { steps, finalOutputs: outputs };
}

export default function SetTheoryVisualizer() {
    const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
    const [code, setCode] = useState(EXAMPLES[0].code);

    const [executionState, setExecutionState] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const speedMs = speed === 'slow' ? 1600 : speed === 'normal' ? 900 : 400;

    const timerRef = useRef(null);

    // Challenge state
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Interactive Venn: user can click zones or hover elements
    const [hoveredZone, setHoveredZone] = useState(null); // 'left' | 'center' | 'right' | null
    const [userPickedOp, setUserPickedOp] = useState(null); // allow manual exploration
    const [hoveredItem, setHoveredItem] = useState(null);
    // Drag state for Venn circles
    const [dragOffset, setDragOffset] = useState({ ax: 0, ay: 0, bx: 0, by: 0 });
    const [dragging, setDragging] = useState(null); // 'a' | 'b' | null
    const dragStart = useRef(null);
    const svgRef = useRef(null);

    const handleSelectExample = (id) => {
        const found = EXAMPLES.find(e => e.id === id);
        if (!found) return;
        setSelectedExampleId(id);
        setCode(found.code);
        resetExecution();
        setUserPickedOp(null);
    };

    const resetExecution = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setExecutionState(null);
        setCurrentStepIdx(-1);
    };

    const runCode = () => {
        resetExecution();
        setUserPickedOp(null);
        const state = executeSetTheoryCode(code);
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
            const state = executeSetTheoryCode(code);
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
    const codeOperation = currentStep?.operation || null;
    const activeOp = userPickedOp || codeOperation || 'intersection';
    const terminalLines = currentStep?.outputs || [];
    const transitionInfo = getStepTransitionInfo(executionState?.steps, currentStepIdx);

    // Determine set A and B items from current step or defaults
    const setAItems = currentStep?.setA || ['HTML', 'CSS', 'TypeScript'];
    const setBItems = currentStep?.setB || ['Python', 'SQL', 'TypeScript'];
    const sharedItems = setAItems.filter(x => setBItems.includes(x));
    const onlyA = setAItems.filter(x => !setBItems.includes(x));
    const onlyB = setBItems.filter(x => !setAItems.includes(x));

    // Compute result based on active operation
    const computeResult = (op) => {
        switch (op) {
            case 'intersection': return sharedItems;
            case 'union': return [...new Set([...setAItems, ...setBItems])];
            case 'difference': return onlyA;
            case 'sym_diff': return [...onlyA, ...onlyB];
            default: return currentStep?.resultItems || [];
        }
    };
    const resultItems = computeResult(activeOp);

    // Region highlights based on active operation
    const highlightLeft = activeOp === 'union' || activeOp === 'difference' || activeOp === 'sym_diff';
    const highlightCenter = activeOp === 'union' || activeOp === 'intersection';
    const highlightRight = activeOp === 'union' || activeOp === 'sym_diff';

    // Which items are "in result" for glow effect
    const isInResult = (item) => resultItems.includes(item);

    // Operation selector buttons for interactive exploration
    const OPS = [
        { id: 'intersection', symbol: '&', label: 'A ∩ B', color: 'emerald' },
        { id: 'union', symbol: '|', label: 'A ∪ B', color: 'cyan' },
        { id: 'difference', symbol: '-', label: 'A − B', color: 'amber' },
        { id: 'sym_diff', symbol: '^', label: 'A △ B', color: 'purple' },
    ];

    // Drag handlers for moving Venn circles
    const handleMouseDown = useCallback((circle, e) => {
        e.preventDefault();
        setDragging(circle);
        const svg = svgRef.current;
        if (!svg) return;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
        dragStart.current = { x: svgPt.x, y: svgPt.y, startOffset: { ...dragOffset } };
    }, [dragOffset]);

    const handleMouseMove = useCallback((e) => {
        if (!dragging || !dragStart.current) return;
        const svg = svgRef.current;
        if (!svg) return;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
        const dx = svgPt.x - dragStart.current.x;
        const dy = svgPt.y - dragStart.current.y;
        if (dragging === 'a') {
            setDragOffset(prev => ({ ...prev, ax: dragStart.current.startOffset.ax + dx, ay: dragStart.current.startOffset.ay + dy }));
        } else {
            setDragOffset(prev => ({ ...prev, bx: dragStart.current.startOffset.bx + dx, by: dragStart.current.startOffset.by + dy }));
        }
    }, [dragging]);

    const handleMouseUp = useCallback(() => {
        setDragging(null);
        dragStart.current = null;
    }, []);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragging, handleMouseMove, handleMouseUp]);

    // Reset drag when example changes
    useEffect(() => {
        setDragOffset({ ax: 0, ay: 0, bx: 0, by: 0 });
    }, [selectedExampleId]);

    // SVG circle centers (base positions)
    const CX_A = 155 + dragOffset.ax;
    const CY_A = 130 + dragOffset.ay;
    const CX_B = 285 + dragOffset.bx;
    const CY_B = 130 + dragOffset.by;
    const R = 110;

    return (
        <div className="space-y-4 text-slate-800">
            {/* ── 1. Clean Structured Header with Full-Width Segmented Presets ────── */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Set Theory Operations & frozenset Visualizer
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md border border-cyan-200/60 shrink-0 hidden sm:inline-block">
                            Interactive Venn Diagram
                        </span>
                    </div>
                </div>

                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    Visualize mathematical set theory operations (Union <code>|</code>, Intersection <code>&</code>, Difference <code>-</code>, and Symmetric Difference <code>^</code>) on an interactive Venn diagram. See why <code>frozenset</code> is hashable and valid as a dictionary key.
                </p>

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
                                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`}>
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
                        badgeText="Venn Engine"
                        fileName="venn_ops.py"
                        accentColor="#0891b2"
                    />
                </div>

                {/* ── Right Column: Interactive Venn Diagram (7 cols) ── */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
                    
                    {/* Operation Selector Row */}
                    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
                        <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <MousePointer2 className="w-3.5 h-3.5" />
                                <span>Click to Explore Operation</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                                {userPickedOp ? 'Manual mode' : codeOperation ? 'From code' : 'Select below'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {OPS.map(op => {
                                const isActive = activeOp === op.id;
                                const colors = {
                                    emerald: isActive ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
                                    cyan: isActive ? 'bg-cyan-600 text-white border-cyan-700 shadow-xs' : 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100',
                                    amber: isActive ? 'bg-amber-600 text-white border-amber-700 shadow-xs' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
                                    purple: isActive ? 'bg-purple-600 text-white border-purple-700 shadow-xs' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
                                };
                                return (
                                    <button
                                        key={op.id}
                                        type="button"
                                        onClick={() => setUserPickedOp(op.id === userPickedOp ? null : op.id)}
                                        className={`flex-1 px-2.5 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${colors[op.color]}`}
                                    >
                                        <span className="font-mono text-sm leading-none">{op.symbol}</span>
                                        <span className="text-[10px] font-medium opacity-80">{op.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Interactive SVG Venn Diagram */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Interactive Venn Diagram
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 italic">Drag circles to move</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border capitalize ${
                                    activeOp === 'intersection' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                    activeOp === 'union' ? 'bg-cyan-50 text-cyan-800 border-cyan-200' :
                                    activeOp === 'difference' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                    activeOp === 'sym_diff' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                    'bg-slate-50 text-slate-700 border-slate-200'
                                }`}>
                                    {activeOp.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        {/* SVG Venn Diagram */}
                        <div className="relative bg-slate-900 rounded-xl overflow-hidden">
                            <svg
                                ref={svgRef}
                                viewBox="0 0 440 260"
                                className="w-full"
                                style={{ cursor: dragging ? 'grabbing' : 'default' }}
                            >
                                <defs>
                                    {/* Animated glow filters */}
                                    <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="6" result="blur" />
                                        <feFlood floodColor="#06b6d4" floodOpacity="0.4" />
                                        <feComposite in2="blur" operator="in" />
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <filter id="glowEmerald" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="8" result="blur" />
                                        <feFlood floodColor="#10b981" floodOpacity="0.5" />
                                        <feComposite in2="blur" operator="in" />
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <filter id="glowAmber" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="6" result="blur" />
                                        <feFlood floodColor="#f59e0b" floodOpacity="0.4" />
                                        <feComposite in2="blur" operator="in" />
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <filter id="glowPurple" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="6" result="blur" />
                                        <feFlood floodColor="#a855f7" floodOpacity="0.4" />
                                        <feComposite in2="blur" operator="in" />
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    {/* Clip paths for overlap regions */}
                                    <clipPath id="clipA">
                                        <circle cx={CX_A} cy={CY_A} r={R} />
                                    </clipPath>
                                    <clipPath id="clipB">
                                        <circle cx={CX_B} cy={CY_B} r={R} />
                                    </clipPath>
                                </defs>

                                {/* Background pattern */}
                                <rect width="440" height="260" fill="#0f172a" rx="12" />

                                {/* Circle A fill (left-only zone) */}
                                <circle
                                    cx={CX_A} cy={CY_A} r={R}
                                    fill={highlightLeft ? 'rgba(6,182,212,0.18)' : 'rgba(51,65,85,0.3)'}
                                    stroke={highlightLeft ? '#06b6d4' : '#475569'}
                                    strokeWidth={highlightLeft ? 2.5 : 1.5}
                                    style={{ transition: 'all 0.4s ease', cursor: 'grab' }}
                                    filter={highlightLeft && !highlightCenter ? 'url(#glowCyan)' : undefined}
                                    onMouseDown={(e) => handleMouseDown('a', e)}
                                    onMouseEnter={() => setHoveredZone('left')}
                                    onMouseLeave={() => setHoveredZone(null)}
                                />

                                {/* Circle B fill (right-only zone) */}
                                <circle
                                    cx={CX_B} cy={CY_B} r={R}
                                    fill={highlightRight ? 'rgba(99,102,241,0.18)' : 'rgba(51,65,85,0.3)'}
                                    stroke={highlightRight ? '#818cf8' : '#475569'}
                                    strokeWidth={highlightRight ? 2.5 : 1.5}
                                    style={{ transition: 'all 0.4s ease', cursor: 'grab' }}
                                    filter={highlightRight && !highlightCenter ? 'url(#glowPurple)' : undefined}
                                    onMouseDown={(e) => handleMouseDown('b', e)}
                                    onMouseEnter={() => setHoveredZone('right')}
                                    onMouseLeave={() => setHoveredZone(null)}
                                />

                                {/* Overlap region highlight (intersection of both circles) */}
                                {highlightCenter && (
                                    <circle
                                        cx={CX_B} cy={CY_B} r={R}
                                        clipPath="url(#clipA)"
                                        fill="rgba(16,185,129,0.3)"
                                        stroke="none"
                                        style={{ transition: 'all 0.4s ease' }}
                                        filter="url(#glowEmerald)"
                                        onMouseEnter={() => setHoveredZone('center')}
                                        onMouseLeave={() => setHoveredZone(null)}
                                    />
                                )}

                                {/* Dashed overlap border */}
                                <circle
                                    cx={CX_B} cy={CY_B} r={R}
                                    clipPath="url(#clipA)"
                                    fill="none"
                                    stroke={highlightCenter ? '#10b981' : '#64748b'}
                                    strokeWidth={highlightCenter ? 2 : 1}
                                    strokeDasharray={highlightCenter ? '0' : '6 4'}
                                    style={{ transition: 'all 0.4s ease' }}
                                />

                                {/* Set A label */}
                                <text
                                    x={CX_A - 50} y={CY_A - R + 20}
                                    fill="#67e8f9" fontSize="11" fontWeight="bold" fontFamily="monospace"
                                    style={{ cursor: 'grab' }}
                                    onMouseDown={(e) => handleMouseDown('a', e)}
                                >
                                    Set A (front)
                                </text>

                                {/* Set B label */}
                                <text
                                    x={CX_B + 10} y={CY_B - R + 20}
                                    fill="#a5b4fc" fontSize="11" fontWeight="bold" fontFamily="monospace"
                                    style={{ cursor: 'grab' }}
                                    onMouseDown={(e) => handleMouseDown('b', e)}
                                >
                                    Set B (back)
                                </text>

                                {/* Only-A items */}
                                {onlyA.map((item, idx) => {
                                    const inResult = isInResult(item);
                                    const y = CY_A - 15 + idx * 22;
                                    const x = CX_A - 40;
                                    return (
                                        <g key={`a-${item}`}
                                            onMouseEnter={() => setHoveredItem(item)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {inResult && (
                                                <rect x={x - 4} y={y - 12} width={item.length * 8 + 24} height={18} rx={4}
                                                    fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1"
                                                >
                                                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                                                </rect>
                                            )}
                                            <text x={x} y={y}
                                                fill={inResult ? '#67e8f9' : hoveredItem === item ? '#e2e8f0' : '#94a3b8'}
                                                fontSize="12" fontFamily="monospace" fontWeight={inResult ? 'bold' : 'normal'}
                                                style={{ transition: 'fill 0.3s ease' }}
                                            >
                                                "{item}"
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Only-B items */}
                                {onlyB.map((item, idx) => {
                                    const inResult = isInResult(item);
                                    const y = CY_B - 15 + idx * 22;
                                    const x = CX_B + 20;
                                    return (
                                        <g key={`b-${item}`}
                                            onMouseEnter={() => setHoveredItem(item)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {inResult && (
                                                <rect x={x - 4} y={y - 12} width={item.length * 8 + 24} height={18} rx={4}
                                                    fill="rgba(129,140,248,0.15)" stroke="#818cf8" strokeWidth="1"
                                                >
                                                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                                                </rect>
                                            )}
                                            <text x={x} y={y}
                                                fill={inResult ? '#a5b4fc' : hoveredItem === item ? '#e2e8f0' : '#94a3b8'}
                                                fontSize="12" fontFamily="monospace" fontWeight={inResult ? 'bold' : 'normal'}
                                                style={{ transition: 'fill 0.3s ease' }}
                                            >
                                                "{item}"
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Shared items (center overlap) */}
                                {sharedItems.map((item, idx) => {
                                    const inResult = isInResult(item);
                                    const midX = (CX_A + CX_B) / 2;
                                    const y = CY_A - 8 + idx * 22;
                                    return (
                                        <g key={`shared-${item}`}
                                            onMouseEnter={() => setHoveredItem(item)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {/* Background pill */}
                                            <rect
                                                x={midX - item.length * 4 - 10} y={y - 13}
                                                width={item.length * 8 + 24} height={20} rx={5}
                                                fill={inResult ? 'rgba(16,185,129,0.25)' : 'rgba(30,41,59,0.8)'}
                                                stroke={inResult ? '#10b981' : '#475569'}
                                                strokeWidth={inResult ? 1.5 : 1}
                                                style={{ transition: 'all 0.3s ease' }}
                                            >
                                                {inResult && (
                                                    <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
                                                )}
                                            </rect>
                                            <text x={midX - item.length * 4 - 2} y={y + 1}
                                                fill={inResult ? '#6ee7b7' : '#94a3b8'}
                                                fontSize="12" fontFamily="monospace" fontWeight="bold"
                                                style={{ transition: 'fill 0.3s ease' }}
                                            >
                                                "{item}"
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Overlap label */}
                                <text
                                    x={(CX_A + CX_B) / 2} y={CY_A + R - 20}
                                    textAnchor="middle"
                                    fill={highlightCenter ? '#6ee7b7' : '#64748b'}
                                    fontSize="9" fontFamily="monospace" fontWeight="bold"
                                    style={{ transition: 'fill 0.3s', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                                >
                                    A ∩ B
                                </text>

                                {/* Hover tooltip */}
                                {hoveredItem && (
                                    <g>
                                        <rect x="10" y="235" width={Math.max(200, hoveredItem.length * 8 + 120)} height="20" rx="4" fill="rgba(15,23,42,0.9)" stroke="#334155" />
                                        <text x="18" y="249" fill="#e2e8f0" fontSize="10" fontFamily="monospace">
                                            "{hoveredItem}" → {
                                                sharedItems.includes(hoveredItem) ? 'in both A ∩ B' :
                                                onlyA.includes(hoveredItem) ? 'only in Set A' : 'only in Set B'
                                            }
                                            {isInResult(hoveredItem) ? ' ✓ in result' : ' ✗ excluded'}
                                        </text>
                                    </g>
                                )}
                            </svg>

                            {/* Reset drag button */}
                            {(dragOffset.ax !== 0 || dragOffset.ay !== 0 || dragOffset.bx !== 0 || dragOffset.by !== 0) && (
                                <button
                                    type="button"
                                    onClick={() => setDragOffset({ ax: 0, ay: 0, bx: 0, by: 0 })}
                                    className="absolute top-2 right-2 px-2 py-1 rounded-md bg-slate-800/80 text-slate-300 text-[10px] font-medium border border-slate-700 hover:bg-slate-700 cursor-pointer transition-colors"
                                >
                                    Reset Position
                                </button>
                            )}
                        </div>

                        {/* Result items pill row */}
                        <div className="pt-2 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">
                                Result ({activeOp.replace('_', ' ')}):
                            </span>
                            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                                {resultItems.length > 0 ? resultItems.map((it, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-2 py-0.5 rounded font-bold border shadow-2xs transition-all ${
                                            hoveredItem === it
                                                ? 'bg-cyan-100 text-cyan-900 border-cyan-400 scale-110'
                                                : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                                        }`}
                                        onMouseEnter={() => setHoveredItem(it)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        "{it}"
                                    </span>
                                )) : (
                                    <span className="text-slate-400 italic">∅ empty set</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Visual 2: frozenset Immutability & Hashability Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
                            <Lock className="w-4 h-4 text-cyan-600" />
                            <span>frozenset: The Immutable Hashable Set</span>
                        </div>
                        <div className="p-3 rounded-lg bg-cyan-50/70 border border-cyan-200 text-xs text-cyan-950 space-y-1.5">
                            <div className="flex items-center justify-between font-bold">
                                <span>Why use frozenset instead of a regular set?</span>
                                <span className="px-2 py-0.5 rounded bg-white text-cyan-800 border border-cyan-300 text-[10px]">
                                    Hashable
                                </span>
                            </div>
                            <p className="text-[11px] text-cyan-800 leading-relaxed">
                                Because regular sets are mutable, they cannot generate fixed hash codes and cannot be used as dictionary keys. A <code>frozenset</code> is strictly write-protected, allowing it to be used as a <strong>hash table key</strong> or nested inside another set.
                            </p>
                        </div>
                    </div>

                    {/* ── 3. Interactive Challenge ── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <HelpCircle className="w-4 h-4 text-purple-600" />
                                <span>Try It Yourself: Set Theory & Venn Prediction</span>
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
                                                : 'bg-white border-slate-200 hover:border-cyan-400 text-slate-800'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 space-y-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                    {selectedAnswer === CHALLENGES[challengeIdx].correct ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                    )}
                                    <span>
                                        {selectedAnswer === CHALLENGES[challengeIdx].correct ? 'Correct!' : 'Incorrect'}
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
                                    className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1 cursor-pointer"
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

