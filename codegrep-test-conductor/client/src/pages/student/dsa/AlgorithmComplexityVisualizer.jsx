import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    Pause,
    RotateCcw,
    SkipForward,
    Clock,
    Cpu,
    Gauge,
    ChevronRight,
    Terminal,
    Copy,
    Check,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Sparkles,
    Layers,
    GitBranch,
    ArrowDown,
    Zap
} from 'lucide-react';

function JargonTip({ term, meaning }) {
    const [open, setOpen] = useState(false);
    return (
        <span className="relative inline-flex items-center">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px] hover:bg-blue-100 transition-colors cursor-pointer"
            >
                <span>{term}</span>
                <HelpCircle size={11} className="shrink-0" />
            </button>
            {open && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 w-56 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] leading-snug shadow-lg pointer-events-none">
                    <strong className="text-blue-300 block mb-0.5">{term}:</strong>
                    {meaning}
                </span>
            )}
        </span>
    );
}

const LANG_OPTIONS = [
    { id: 'cpp', label: 'C++' },
    { id: 'python', label: 'Python' },
    { id: 'js', label: 'JavaScript' }
];

function ReferenceCodeCard({ title, badge, snippets, codeLang, onChangeLang }) {
    const [copied, setCopied] = useState(false);
    const code = snippets?.[codeLang] || snippets?.cpp || '';

    const handleCopy = () => {
        if (!navigator?.clipboard) return;
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        }).catch(() => {});
    };

    return (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <Terminal size={13} className="text-blue-400 shrink-0" />
                    <span className="font-mono text-xs font-semibold text-slate-200">{title}</span>
                    {badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            {badge}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
                        {LANG_OPTIONS.map(lang => (
                            <button
                                key={lang.id}
                                type="button"
                                onClick={() => onChangeLang(lang.id)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                                    codeLang === lang.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            copied
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                    >
                        {copied ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                </div>
            </div>

            <div className="p-4 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed select-text">
                <pre>
                    {code.split('\n').map((line, idx) => (
                        <div key={idx} className="flex items-start hover:bg-slate-900/60 px-1 rounded">
                            <span className="w-6 text-right pr-3 select-none text-slate-600 text-[11px]">{idx + 1}</span>
                            <span className="flex-1 whitespace-pre">{line}</span>
                        </div>
                    ))}
                </pre>
            </div>
        </div>
    );
}

const SECTIONS = [
    { id: 1, title: 'Algorithm Representation', subtitle: '3 Ways to Write the Same Recipe', icon: GitBranch, badge: '1 of 3' },
    { id: 2, title: 'Time & Space Complexity', subtitle: 'Counting Steps & Memory Boxes', icon: Clock, badge: '2 of 3' },
    { id: 3, title: 'Big-O Growth Race', subtitle: 'How Algorithms Slow Down as Input Grows', icon: Gauge, badge: '3 of 3' }
];

const TRACE_LIST = [14, 42, 27, 58, 19];

const REPRESENTATION_STEPS = [
    {
        step: 0,
        english: 'Start and assume the first number (14) is the largest so far.',
        flowNode: 'start',
        pseudoIdx: 0,
        largest: 14,
        checkingIdx: 0,
        decision: null
    },
    {
        step: 1,
        english: 'Check 42: Is 42 > 14? Yes! Update largest to 42.',
        flowNode: 'decision-yes',
        pseudoIdx: 2,
        largest: 42,
        checkingIdx: 1,
        decision: 'Yes (42 > 14)'
    },
    {
        step: 2,
        english: 'Check 27: Is 27 > 42? No. Keep largest as 42.',
        flowNode: 'decision-no',
        pseudoIdx: 1,
        largest: 42,
        checkingIdx: 2,
        decision: 'No (27 <= 42)'
    },
    {
        step: 3,
        english: 'Check 58: Is 58 > 42? Yes! Update largest to 58.',
        flowNode: 'decision-yes',
        pseudoIdx: 2,
        largest: 58,
        checkingIdx: 3,
        decision: 'Yes (58 > 42)'
    },
    {
        step: 4,
        english: 'Check 19: Is 19 > 58? No. Keep largest as 58.',
        flowNode: 'decision-no',
        pseudoIdx: 1,
        largest: 58,
        checkingIdx: 4,
        decision: 'No (19 <= 58)'
    },
    {
        step: 5,
        english: 'All numbers checked! Output the final answer: 58.',
        flowNode: 'end',
        pseudoIdx: 3,
        largest: 58,
        checkingIdx: -1,
        decision: null
    }
];

const PSEUDOCODE_LINES = [
    'SET largest = list[0]        // Start with first item',
    'FOR each num IN list:        // Check items one by one',
    '    IF num > largest: SET largest = num',
    'RETURN largest               // Final answer!'
];

const SECTION1_CODE = {
    cpp: `// Find the largest number in a list
int findLargest(int nums[], int n) {
    int largest = nums[0];       // 1. Assume first is largest
    for (int i = 1; i < n; i++) {
        if (nums[i] > largest)   // 2. Compare each number
            largest = nums[i];   // 3. Update if bigger
    }
    return largest;              // 4. Return final winner
}`,
    python: `# Find the largest number in a list
def find_largest(nums):
    largest = nums[0]        # 1. Assume first is largest
    for num in nums[1:]:     # 2. Check every other number
        if num > largest:    # 3. Compare with current best
            largest = num    # 4. Update if bigger
    return largest           # 5. Return final winner`,
    js: `// Find the largest number in a list
function findLargest(nums) {
    let largest = nums[0];       // 1. Assume first is largest
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > largest)   // 2. Compare each number
            largest = nums[i];   // 3. Update if bigger
    }
    return largest;              // 4. Return final winner
}`
};

const SECTION2_CODE = {
    methodA: {
        cpp: `// Method A: O(1) Time, O(1) Space
int getFirst(int arr[]) {
    int first = arr[0]; // 1 step, 1 fixed memory box
    return first;
}`,
        python: `# Method A: O(1) Time, O(1) Space
def get_first(arr):
    first = arr[0]  # 1 step, 1 fixed memory box
    return first`,
        js: `// Method A: O(1) Time, O(1) Space
function getFirst(arr) {
    const first = arr[0]; // 1 step, 1 fixed memory box
    return first;
}`
    },
    methodB: {
        cpp: `// Method B: O(N) Time, O(N) Space
vector<int> copyAll(vector<int>& arr) {
    vector<int> copy;            // Grows with N!
    for (int x : arr)            // N loop steps
        copy.push_back(x * 2);   // Allocates N memory boxes
    return copy;
}`,
        python: `# Method B: O(N) Time, O(N) Space
def copy_all(arr):
    copy = []              # Grows with N!
    for x in arr:          # N loop steps
        copy.append(x * 2) # Allocates N memory boxes
    return copy`,
        js: `// Method B: O(N) Time, O(N) Space
function copyAll(arr) {
    const copy = [];           // Grows with N!
    for (const x of arr)       // N loop steps
        copy.push(x * 2);      // Allocates N memory boxes
    return copy;
}`
    }
};

const BIG_O_CLASSES = [
    {
        id: 'O1',
        label: 'O(1)',
        name: 'Constant',
        tagline: 'Instant Teleport',
        color: 'emerald',
        barClass: 'bg-emerald-500',
        calcOps: () => 1,
        analogy: 'Grabbing the top card from a deck. Whether the deck has 10 cards or 10 million, it always takes 1 move.',
        code: {
            cpp: `// O(1) Constant: always 1 step
int getFirst(int arr[]) {
    return arr[0]; // Direct jump, ignores N
}`,
            python: `# O(1) Constant: always 1 step
def get_first(arr):
    return arr[0]  # Direct jump, ignores N`,
            js: `// O(1) Constant: always 1 step
function getFirst(arr) {
    return arr[0]; // Direct jump, ignores N
}`
        }
    },
    {
        id: 'OlogN',
        label: 'O(log N)',
        name: 'Logarithmic',
        tagline: 'Cut Problem in Half',
        color: 'blue',
        barClass: 'bg-blue-500',
        calcOps: (n) => Math.max(1, Math.ceil(Math.log2(n))),
        analogy: 'Finding a word in a dictionary by opening to the middle and throwing away the half you do not need.',
        code: {
            cpp: `// O(log N) Logarithmic: Binary Search
while (low <= high) {
    int mid = (low + high) / 2; // Cut search in half!
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
}`,
            python: `# O(log N) Logarithmic: Binary Search
while low <= high:
    mid = (low + high) // 2  # Cut search in half!
    if arr[mid] == target: return mid
    elif arr[mid] < target: low = mid + 1
    else: high = mid - 1`,
            js: `// O(log N) Logarithmic: Binary Search
while (low <= high) {
    const mid = Math.floor((low + high) / 2); // Cut in half!
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
}`
        }
    },
    {
        id: 'ON',
        label: 'O(N)',
        name: 'Linear',
        tagline: 'Check One by One',
        color: 'amber',
        barClass: 'bg-amber-500',
        calcOps: (n) => n,
        analogy: 'Checking every ticket in a pile one by one until you find the winning number.',
        code: {
            cpp: `// O(N) Linear: 1 loop over N items
for (int i = 0; i < n; i++) {
    if (arr[i] == target) return i; // Checks up to N times
}`,
            python: `# O(N) Linear: 1 loop over N items
for i in range(len(arr)):
    if arr[i] == target: return i  # Checks up to N times`,
            js: `// O(N) Linear: 1 loop over N items
for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i; // Checks up to N times
}`
        }
    },
    {
        id: 'ON2',
        label: 'O(N²)',
        name: 'Quadratic',
        tagline: 'Handshake With Everyone',
        color: 'rose',
        barClass: 'bg-rose-500',
        calcOps: (n) => n * n,
        analogy: 'Every person in a room shaking hands with every other person. Double the people = 4x the handshakes!',
        code: {
            cpp: `// O(N^2) Quadratic: nested loop inside a loop
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        compare(arr[i], arr[j]); // Runs N * N times!
    }
}`,
            python: `# O(N^2) Quadratic: nested loop inside a loop
for i in range(len(arr)):
    for j in range(len(arr)):
        compare(arr[i], arr[j])  # Runs N * N times!`,
            js: `// O(N^2) Quadratic: nested loop inside a loop
for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
        compare(arr[i], arr[j]); // Runs N * N times!
    }
}`
        }
    }
];

const QUIZ_QUESTIONS = [
    {
        id: 'q1',
        question: 'Why do programmers write Pseudocode or draw a Flowchart before writing real code?',
        options: [
            'Because computers can only execute Flowcharts',
            'To plan and test the step-by-step logic clearly without worrying about language syntax',
            'To make the program use O(N²) memory',
            'Because Pseudocode runs faster than C++'
        ],
        correctIndex: 1,
        explanation: 'Pseudocode and Flowcharts let you design and verify the recipe in plain human logic before translating it into C++, Python, or JavaScript.'
    },
    {
        id: 'q2',
        question: 'If an algorithm takes 1 step for 10 items and 1 step for 10,000 items, what is its Time Complexity?',
        options: ['O(N²)', 'O(N)', 'O(log N)', 'O(1)'],
        correctIndex: 3,
        explanation: 'O(1) Constant Time means the number of steps stays the same no matter how large the input N grows.'
    }
];

export default function AlgorithmComplexityVisualizer({ onLog }) {
    const [activeSection, setActiveSection] = useState(1);
    const [showAllSections, setShowAllSections] = useState(false);
    const [codeLang, setCodeLang] = useState('cpp');

    // ── SECTION 1 STATE ──────────────────────────────────────────────────
    const [repStep, setRepStep] = useState(0);
    const [autoPlaying, setAutoPlaying] = useState(false);

    useEffect(() => {
        if (!autoPlaying) return;
        const timer = setInterval(() => {
            setRepStep(prev => {
                if (prev >= REPRESENTATION_STEPS.length - 1) {
                    setAutoPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1200);
        return () => clearInterval(timer);
    }, [autoPlaying]);

    const currentRep = REPRESENTATION_STEPS[repStep];

    // ── SECTION 2 STATE ──────────────────────────────────────────────────
    const [inputN, setInputN] = useState(8);
    const [isRunningSec2, setIsRunningSec2] = useState(false);
    const [stepsA, setStepsA] = useState(0);
    const [stepsB, setStepsB] = useState(0);
    const [spaceA, setSpaceA] = useState(0);
    const [spaceB, setSpaceB] = useState(0);
    const [sec2SnippetKey, setSec2SnippetKey] = useState('methodB');
    const sec2TimersRef = useRef([]);

    const clearSec2Timers = () => {
        sec2TimersRef.current.forEach(t => clearTimeout(t));
        sec2TimersRef.current = [];
    };

    useEffect(() => () => clearSec2Timers(), []);

    const resetSec2 = () => {
        clearSec2Timers();
        setIsRunningSec2(false);
        setStepsA(0);
        setStepsB(0);
        setSpaceA(0);
        setSpaceB(0);
    };

    const runSec2Comparison = () => {
        resetSec2();
        setIsRunningSec2(true);

        const tA = setTimeout(() => {
            setStepsA(1);
            setSpaceA(1);
        }, 200);
        sec2TimersRef.current.push(tA);

        for (let i = 1; i <= inputN; i++) {
            const tB = setTimeout(() => {
                setStepsB(i);
                setSpaceB(i);
                if (i === inputN) setIsRunningSec2(false);
            }, i * 160);
            sec2TimersRef.current.push(tB);
        }
        onLog?.(`Time & Space demo run for N = ${inputN}.`);
    };

    // ── SECTION 3 STATE ──────────────────────────────────────────────────
    const [raceN, setRaceN] = useState(32);
    const [raceSpeed, setRaceSpeed] = useState(1); // 0.5 | 1 | 2
    const [selectedBigO, setSelectedBigO] = useState('OlogN');
    const [isRacing, setIsRacing] = useState(false);
    const [raceProgress, setRaceProgress] = useState({ O1: 0, OlogN: 0, ON: 0, ON2: 0 });
    const [raceOpsDone, setRaceOpsDone] = useState({ O1: 0, OlogN: 0, ON: 0, ON2: 0 });
    const [raceRanks, setRaceRanks] = useState({}); // { O1: 1, OlogN: 2, ... }
    const [raceCallouts, setRaceCallouts] = useState({});
    const raceTimerRef = useRef(null);
    const raceStateRef = useRef(null);

    useEffect(() => () => {
        if (raceTimerRef.current) clearInterval(raceTimerRef.current);
    }, []);

    const resetRace = (newN = raceN) => {
        if (raceTimerRef.current) clearInterval(raceTimerRef.current);
        setIsRacing(false);
        setRaceProgress({ O1: 0, OlogN: 0, ON: 0, ON2: 0 });
        setRaceOpsDone({ O1: 0, OlogN: 0, ON: 0, ON2: 0 });
        setRaceRanks({});
        setRaceCallouts({});
        raceStateRef.current = null;
        if (newN !== raceN) setRaceN(newN);
    };

    const fastForwardRace = () => {
        if (raceTimerRef.current) clearInterval(raceTimerRef.current);
        const targets = {
            O1: BIG_O_CLASSES[0].calcOps(raceN),
            OlogN: BIG_O_CLASSES[1].calcOps(raceN),
            ON: BIG_O_CLASSES[2].calcOps(raceN),
            ON2: BIG_O_CLASSES[3].calcOps(raceN)
        };
        setRaceProgress({ O1: 100, OlogN: 100, ON: 100, ON2: 100 });
        setRaceOpsDone(targets);
        setRaceRanks(prev => ({
            O1: prev.O1 || 1,
            OlogN: prev.OlogN || 2,
            ON: prev.ON || 3,
            ON2: prev.ON2 || 4
        }));
        setRaceCallouts({
            O1: 'Finished in 1 Step!',
            OlogN: `Done in ${targets.OlogN} halving steps!`,
            ON: `Scanned all ${targets.ON} items!`,
            ON2: `Completed ${targets.ON2.toLocaleString()} nested ops!`
        });
        setIsRacing(false);
        onLog?.(`Big-O Race fast-forwarded at N = ${raceN}.`);
    };

    const startRace = () => {
        if (raceTimerRef.current) clearInterval(raceTimerRef.current);
        setIsRacing(true);
        const targetOps = {
            O1: 1,
            OlogN: BIG_O_CLASSES[1].calcOps(raceN),
            ON: raceN,
            ON2: raceN * raceN
        };
        const currentOps = { O1: 0, OlogN: 0, ON: 0, ON2: 0 };
        const ranks = {};
        let nextRank = 1;
        let tick = 0;

        // Linear step size keeps N=8..32 slow enough to watch, and N=128..256 ~24 ticks
        const linearStep = raceN <= 32 ? 1 : Math.ceil(raceN / 24);
        // Quadratic uses the exact same ops/tick as Linear so the N^2 slowdown is dramatic
        const quadStep = linearStep;

        setRaceProgress({ O1: 0, OlogN: 0, ON: 0, ON2: 0 });
        setRaceOpsDone({ O1: 0, OlogN: 0, ON: 0, ON2: 0 });
        setRaceRanks({});
        setRaceCallouts({});

        const tickMs = Math.round(200 / raceSpeed);

        raceTimerRef.current = setInterval(() => {
            tick += 1;
            const callouts = {};

            // O(1): Completes in 1 single instant snap on tick 1
            if (currentOps.O1 < 1) {
                currentOps.O1 = 1;
                ranks.O1 = nextRank++;
            }
            callouts.O1 = 'Finished in 1 Step!';

            // O(log N): 1 halving jump per tick (50% -> 75% -> 87.5% -> 100%)
            if (currentOps.OlogN < targetOps.OlogN) {
                currentOps.OlogN += 1;
                const remaining = Math.max(1, Math.ceil(raceN / Math.pow(2, currentOps.OlogN)));
                if (currentOps.OlogN >= targetOps.OlogN) {
                    ranks.OlogN = nextRank++;
                    callouts.OlogN = `Done in ${targetOps.OlogN} halving jumps!`;
                } else {
                    callouts.OlogN = `Cutting remaining items in half! (${remaining} left)`;
                }
            } else {
                callouts.OlogN = `Done in ${targetOps.OlogN} halving jumps!`;
            }

            // O(N): Advances steadily item by item
            if (currentOps.ON < targetOps.ON) {
                currentOps.ON = Math.min(targetOps.ON, currentOps.ON + linearStep);
                if (currentOps.ON >= targetOps.ON) {
                    ranks.ON = nextRank++;
                    callouts.ON = `Scanned all ${raceN} items!`;
                } else {
                    callouts.ON = `Scanning item ${currentOps.ON} of ${raceN}...`;
                }
            } else {
                callouts.ON = `Scanned all ${raceN} items!`;
            }

            // O(N^2): Advances slowly in nested passes
            if (currentOps.ON2 < targetOps.ON2) {
                currentOps.ON2 = Math.min(targetOps.ON2, currentOps.ON2 + quadStep);
                const passNum = Math.min(raceN, Math.floor(currentOps.ON2 / raceN) + 1);
                if (currentOps.ON2 >= targetOps.ON2) {
                    ranks.ON2 = nextRank++;
                    callouts.ON2 = `Completed ${targetOps.ON2.toLocaleString()} nested ops!`;
                } else {
                    callouts.ON2 = `Pass ${passNum} of ${raceN} (${currentOps.ON2.toLocaleString()} / ${targetOps.ON2.toLocaleString()})`;
                }
            } else {
                callouts.ON2 = `Completed ${targetOps.ON2.toLocaleString()} nested ops!`;
            }

            const logPct = currentOps.OlogN >= targetOps.OlogN
                ? 100
                : Math.min(96, Math.round((1 - 1 / Math.pow(2, tick)) * 100));

            setRaceOpsDone({ ...currentOps });
            setRaceRanks({ ...ranks });
            setRaceCallouts(callouts);
            setRaceProgress({
                O1: 100,
                OlogN: logPct,
                ON: Math.round((currentOps.ON / targetOps.ON) * 100),
                ON2: Math.max(1, Math.round((currentOps.ON2 / targetOps.ON2) * 100))
            });

            if (Object.keys(ranks).length === 4) {
                clearInterval(raceTimerRef.current);
                setIsRacing(false);
            }
        }, tickMs);

        onLog?.(`Big-O Growth Race started with N = ${raceN} at ${raceSpeed}x speed.`);
    };

    const activeBigOObj = BIG_O_CLASSES.find(b => b.id === selectedBigO) || BIG_O_CLASSES[1];

    // ── QUIZ STATE ───────────────────────────────────────────────────────
    const [quizAnswers, setQuizAnswers] = useState({});

    const visibleSections = showAllSections ? [1, 2, 3] : [activeSection];

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-6">
            {/* ── TOP-LEVEL SECTION SELECTOR ──────────────────────────────── */}
            <div className="space-y-3 pb-5 border-b border-slate-200/80">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                            Module 1.2 Interactive Visualizations
                        </span>
                        {!showAllSections && (
                            <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                {activeSection} of 3
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAllSections(v => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            showAllSections
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                        <Layers size={13} />
                        <span>{showAllSections ? 'Focused View (1 at a time)' : 'Show All 3 Visualizations'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {SECTIONS.map(sec => {
                        const Icon = sec.icon;
                        const isCurrent = !showAllSections && activeSection === sec.id;
                        return (
                            <button
                                key={sec.id}
                                type="button"
                                onClick={() => {
                                    setShowAllSections(false);
                                    setActiveSection(sec.id);
                                }}
                                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                    isCurrent
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-4 ring-blue-500/15'
                                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    isCurrent ? 'bg-blue-500 text-white' : 'bg-white text-slate-700 border border-slate-200'
                                }`}>
                                    <Icon size={17} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className={`text-[10px] font-mono font-bold uppercase ${isCurrent ? 'text-blue-300' : 'text-blue-600'}`}>
                                        Section {sec.badge}
                                    </span>
                                    <div className="text-xs font-extrabold truncate">{sec.title}</div>
                                    <div className={`text-[11px] truncate ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {sec.subtitle}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ═════════════════════════════════════════════════════════════
                SECTION 1: ALGORITHM REPRESENTATION (SAME LOGIC, 3 FORMATS)
               ═════════════════════════════════════════════════════════════ */}
            {visibleSections.includes(1) && (
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">Section 1 of 3</span>
                            <h3 className="text-base font-extrabold text-slate-900">
                                Algorithm Representation: Find the Largest Number in [14, 42, 27, 58, 19]
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <JargonTip term="Pseudocode" meaning="Plain-English instructions written in a code-like outline so humans can plan logic before coding." />
                            <JargonTip term="Iteration" meaning="Repeating the same step on each item in a list one after another." />
                        </div>
                    </div>

                    {/* Controls & Live Data Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-700 mr-1">List:</span>
                            {TRACE_LIST.map((num, idx) => (
                                <div
                                    key={idx}
                                    className={`w-10 h-10 rounded-xl border font-mono text-xs font-extrabold flex items-center justify-center transition-all ${
                                        currentRep.checkingIdx === idx
                                            ? 'bg-blue-600 text-white border-blue-700 scale-110 ring-4 ring-blue-200'
                                            : 'bg-white text-slate-800 border-slate-200'
                                    }`}
                                >
                                    {num}
                                </div>
                            ))}
                            <span className="ml-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800">
                                largest = {currentRep.largest}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setAutoPlaying(v => !v)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
                            >
                                {autoPlaying ? <Pause size={13} /> : <Play size={13} />}
                                <span>{autoPlaying ? 'Pause' : 'Auto-Play'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAutoPlaying(false); setRepStep(s => Math.min(REPRESENTATION_STEPS.length - 1, s + 1)); }}
                                disabled={repStep >= REPRESENTATION_STEPS.length - 1}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
                            >
                                <SkipForward size={13} />
                                <span>Step Forward</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAutoPlaying(false); setRepStep(0); }}
                                className="p-2 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                                title="Reset"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Synchronized 3-Way View */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* 1. Plain English */}
                        <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                            <div className="text-xs font-extrabold text-slate-900">1. Plain English</div>
                            <div className="space-y-1.5">
                                {REPRESENTATION_STEPS.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded-xl text-xs transition-all border ${
                                            repStep === idx
                                                ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold shadow-2xs'
                                                : 'bg-slate-50 border-transparent text-slate-500'
                                        }`}
                                    >
                                        {idx + 1}. {item.english}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Flowchart */}
                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center gap-2">
                            <div className="text-xs font-extrabold text-slate-900 self-start mb-1">2. Flowchart (Visual Boxes)</div>

                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                currentRep.flowNode === 'start' ? 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-200' : 'bg-white text-slate-700 border-slate-300'
                            }`}>
                                Start: largest = list[0]
                            </div>
                            <ArrowDown size={14} className="text-slate-400" />
                            <div className={`px-4 py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                                currentRep.flowNode === 'decision-yes' || currentRep.flowNode === 'decision-no'
                                    ? 'bg-amber-400 text-slate-900 border-amber-500 ring-4 ring-amber-200'
                                    : 'bg-white text-slate-700 border-slate-300'
                            }`}>
                                Is num &gt; largest?
                                {currentRep.decision && <div className="text-[10px] font-mono mt-0.5">{currentRep.decision}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full pt-1">
                                <div className={`p-2 rounded-xl border text-center text-[11px] font-bold transition-all ${
                                    currentRep.flowNode === 'decision-yes' ? 'bg-blue-600 text-white border-blue-700 scale-105' : 'bg-white text-slate-500 border-slate-200'
                                }`}>
                                    Yes → Update largest
                                </div>
                                <div className={`p-2 rounded-xl border text-center text-[11px] font-bold transition-all ${
                                    currentRep.flowNode === 'decision-no' ? 'bg-slate-800 text-white border-slate-900 scale-105' : 'bg-white text-slate-500 border-slate-200'
                                }`}>
                                    No → Keep current
                                </div>
                            </div>

                            <ArrowDown size={14} className="text-slate-400" />
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                currentRep.flowNode === 'end' ? 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-200' : 'bg-white text-slate-700 border-slate-300'
                            }`}>
                                End: Return {currentRep.largest}
                            </div>
                        </div>

                        {/* 3. Pseudocode */}
                        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 space-y-2.5">
                            <div className="text-xs font-extrabold text-blue-300">3. Pseudocode</div>
                            <div className="font-mono text-xs space-y-1.5">
                                {PSEUDOCODE_LINES.map((line, idx) => (
                                    <div
                                        key={idx}
                                        className={`px-2.5 py-2 rounded-lg transition-all whitespace-pre-wrap ${
                                            currentRep.pseudoIdx === idx
                                                ? 'bg-blue-600/30 text-white border border-blue-400 font-bold'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <ReferenceCodeCard
                        title="Reference Code: Find Largest Number"
                        badge="Section 1"
                        snippets={SECTION1_CODE}
                        codeLang={codeLang}
                        onChangeLang={setCodeLang}
                    />

                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-start gap-2 text-xs text-blue-900">
                            <Sparkles size={15} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>
                                <strong>Takeaway:</strong> Programmers sketch algorithms in Plain English, Flowcharts, or Pseudocode first so the logic is crystal clear before writing syntax.
                            </span>
                        </div>
                        {!showAllSections && (
                            <button
                                type="button"
                                onClick={() => setActiveSection(2)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer ml-auto"
                            >
                                <span>Next Visualization: Time & Space</span>
                                <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* ═════════════════════════════════════════════════════════════
                SECTION 2: TIME & SPACE COMPLEXITY (STEPS VS MEMORY)
               ═════════════════════════════════════════════════════════════ */}
            {visibleSections.includes(2) && (
                <section className={`space-y-4 ${showAllSections ? 'pt-6 border-t border-slate-200' : ''}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">Section 2 of 3</span>
                            <h3 className="text-base font-extrabold text-slate-900">Time & Space Complexity: Counting Steps & Memory Boxes</h3>
                        </div>
                        <JargonTip term="Auxiliary Space" meaning="Extra temporary memory boxes an algorithm creates while running, beyond the original input." />
                    </div>

                    {/* Input Size N Picker + Run Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-700">Input Size (N):</span>
                            {[4, 8, 12, 16].map(n => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => { setInputN(n); resetSec2(); }}
                                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                                        inputN === n
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    N = {n}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={runSec2Comparison}
                                disabled={isRunningSec2}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                            >
                                <Play size={13} />
                                <span>{isRunningSec2 ? 'Running...' : 'Run Both!'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={resetSec2}
                                className="p-2 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Side-by-Side Counters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Method A */}
                        <div
                            onClick={() => setSec2SnippetKey('methodA')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                                sec2SnippetKey === 'methodA' ? 'border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-200' : 'border-slate-200 bg-white'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-extrabold text-emerald-900">Method A: Check First Item</span>
                                    <p className="text-[11px] text-emerald-700">Always 1 step and 1 fixed memory box — O(1)</p>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">O(1)</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={11} /> Time (Steps)</div>
                                    <div className="text-lg font-mono font-extrabold text-emerald-700">{stepsA}</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1"><Cpu size={11} /> Space (Boxes)</div>
                                    <div className="text-lg font-mono font-extrabold text-emerald-700">{spaceA}</div>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-white border border-emerald-100 min-h-[60px] flex items-center gap-2">
                                <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all ${
                                    spaceA > 0 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-100 text-slate-400 border-slate-200'
                                }`}>
                                    first
                                </div>
                                <span className="text-[11px] text-slate-500">Fixed 1 box, even if N = 1,000!</span>
                            </div>
                        </div>

                        {/* Method B */}
                        <div
                            onClick={() => setSec2SnippetKey('methodB')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                                sec2SnippetKey === 'methodB' ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-200' : 'border-slate-200 bg-white'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-extrabold text-amber-900">Method B: Copy Every Item</span>
                                    <p className="text-[11px] text-amber-700">Takes N steps and creates N memory boxes — O(N)</p>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">O(N)</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={11} /> Time (Steps)</div>
                                    <div className="text-lg font-mono font-extrabold text-amber-700">{stepsB} / {inputN}</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1"><Cpu size={11} /> Space (Boxes)</div>
                                    <div className="text-lg font-mono font-extrabold text-amber-700">{spaceB} / {inputN}</div>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-white border border-amber-100 min-h-[60px] flex flex-wrap items-center gap-1.5">
                                {Array.from({ length: inputN }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-7 h-7 rounded-md border font-mono text-[10px] font-bold flex items-center justify-center transition-all ${
                                            idx < spaceB ? 'bg-amber-500 text-white border-amber-600 scale-105' : 'bg-slate-100 text-slate-400 border-slate-200'
                                        }`}
                                    >
                                        {idx}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <ReferenceCodeCard
                        title={sec2SnippetKey === 'methodA' ? 'Reference Code: Method A — O(1) Time & Space' : 'Reference Code: Method B — O(N) Time & Space'}
                        badge={sec2SnippetKey === 'methodA' ? 'O(1)' : 'O(N)'}
                        snippets={SECTION2_CODE[sec2SnippetKey]}
                        codeLang={codeLang}
                        onChangeLang={setCodeLang}
                    />

                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-start gap-2 text-xs text-blue-900">
                            <Sparkles size={15} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>
                                <strong>Summary:</strong> Time = How many steps it takes. Space = How many extra memory boxes it needs.
                            </span>
                        </div>
                        {!showAllSections && (
                            <button
                                type="button"
                                onClick={() => setActiveSection(3)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer ml-auto"
                            >
                                <span>Next Visualization: Big-O Growth Race</span>
                                <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* ═════════════════════════════════════════════════════════════
                SECTION 3: INTERACTIVE BIG-O GROWTH RACE
               ═════════════════════════════════════════════════════════════ */}
            {visibleSections.includes(3) && (
                <section className={`space-y-4 ${showAllSections ? 'pt-6 border-t border-slate-200' : ''}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">Section 3 of 3</span>
                            <h3 className="text-base font-extrabold text-slate-900">Big-O Growth Race: Who Finishes First?</h3>
                        </div>
                        <JargonTip term="Asymptotic" meaning="How an algorithm's speed behaves when the input size N grows huge." />
                    </div>

                    {/* Input Size Presets, Slider, Speed Toggle & Race Controls */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-700 mr-1">Presets:</span>
                                {[
                                    { n: 8, label: 'N = 8 (Tiny)' },
                                    { n: 32, label: 'N = 32 (Medium)' },
                                    { n: 128, label: 'N = 128 (Large)' },
                                    { n: 256, label: 'N = 256 (Huge)' }
                                ].map(p => (
                                    <button
                                        key={p.n}
                                        type="button"
                                        onClick={() => resetRace(p.n)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                                            raceN === p.n
                                                ? 'bg-slate-900 text-white border-slate-900'
                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            {/* Playback Speed Toggle */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-slate-600">Speed:</span>
                                <div className="inline-flex rounded-lg bg-white border border-slate-200 p-0.5">
                                    {[
                                        { v: 0.5, label: '0.5x Slow-Mo' },
                                        { v: 1, label: '1x Normal' },
                                        { v: 2, label: '2x Fast' }
                                    ].map(sp => (
                                        <button
                                            key={sp.v}
                                            type="button"
                                            onClick={() => setRaceSpeed(sp.v)}
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                                                raceSpeed === sp.v ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {sp.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                    <span>Input Size (N):</span>
                                    <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                        N = {raceN} items
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={8}
                                    max={256}
                                    value={raceN}
                                    onChange={e => resetRace(Number(e.target.value))}
                                    className="w-full accent-blue-600 cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={startRace}
                                    disabled={isRacing}
                                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-xs"
                                >
                                    <Zap size={14} />
                                    <span>{isRacing ? 'Racing...' : 'Run Race'}</span>
                                </button>
                                {isRacing && (
                                    <button
                                        type="button"
                                        onClick={fastForwardRace}
                                        className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 hover:bg-amber-200 cursor-pointer"
                                    >
                                        <SkipForward size={13} />
                                        <span>Fast-Forward / Skip</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Race Track */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        <div className="lg:col-span-7 space-y-2.5">
                            {BIG_O_CLASSES.map(item => {
                                const targetOps = item.calcOps(raceN);
                                const opsDone = raceOpsDone[item.id] || 0;
                                const pct = raceProgress[item.id] || 0;
                                const rank = raceRanks[item.id];
                                const callout = raceCallouts[item.id];
                                const isSel = selectedBigO === item.id;
                                const rankLabel = rank === 1 ? '1st Place' : rank === 2 ? '2nd Place' : rank === 3 ? '3rd Place' : rank === 4 ? '4th Place' : null;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedBigO(item.id)}
                                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                                            isSel ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded font-mono font-extrabold text-[11px] ${
                                                    isSel ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                    {item.label}
                                                </span>
                                                <span className="font-bold">{item.name}</span>
                                                {rankLabel && (
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                                        rank === 1
                                                            ? 'bg-emerald-500 text-white'
                                                            : rank === 2
                                                            ? 'bg-blue-500 text-white'
                                                            : rank === 3
                                                            ? 'bg-amber-500 text-slate-900'
                                                            : 'bg-rose-500 text-white'
                                                    }`}>
                                                        {rank === 1 && item.id === 'O1' ? '1st Place — Finished in 1 Step!' : rankLabel}
                                                    </span>
                                                )}
                                                {item.id === 'ON2' && raceN >= 20 && !rankLabel && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                                        Slowing down fast!
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-mono text-xs font-bold">
                                                {opsDone > 0 ? `${opsDone.toLocaleString()} / ` : ''}{targetOps.toLocaleString()} ops
                                            </span>
                                        </div>

                                        <div className={`w-full h-3.5 rounded-full overflow-hidden ${isSel ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <div
                                                className={`h-full rounded-full ${item.id === 'O1' ? 'transition-all duration-150' : 'transition-all duration-100'} ${item.barClass}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>

                                        {callout && (
                                            <div className={`text-[11px] font-medium ${isSel ? 'text-blue-300' : 'text-slate-600'}`}>
                                                {callout}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Real-Life Analogy Card */}
                        <div className="lg:col-span-5 p-5 rounded-2xl border border-amber-200 bg-amber-50/60 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
                                    Real-Life Analogy
                                </span>
                                <span className="px-2 py-0.5 rounded bg-white border border-amber-200 font-mono text-xs font-bold text-amber-900">
                                    {activeBigOObj.label} ({activeBigOObj.name})
                                </span>
                            </div>
                            <p className="text-xs text-amber-950 leading-relaxed font-medium">
                                {activeBigOObj.analogy}
                            </p>
                            <div className="p-3 rounded-xl bg-white/90 border border-amber-200/80 text-[11px] text-slate-700">
                                At <strong>N = {raceN}</strong>, this takes <strong>{activeBigOObj.calcOps(raceN).toLocaleString()}</strong> operation{activeBigOObj.calcOps(raceN) === 1 ? '' : 's'}.
                                Click any Big-O row on the left to inspect its analogy and code!
                            </div>
                        </div>
                    </div>

                    <ReferenceCodeCard
                        title={`Reference Code: ${activeBigOObj.label} ${activeBigOObj.name}`}
                        badge={activeBigOObj.tagline}
                        snippets={activeBigOObj.code}
                        codeLang={codeLang}
                        onChangeLang={setCodeLang}
                    />
                </section>
            )}

            {/* ═════════════════════════════════════════════════════════════
                CHECK YOUR UNDERSTANDING: 2-QUESTION MINI-QUIZ
               ═════════════════════════════════════════════════════════════ */}
            <div className="pt-5 border-t border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Check Your Understanding
                    </h4>
                    {Object.keys(quizAnswers).length > 0 && (
                        <button
                            type="button"
                            onClick={() => setQuizAnswers({})}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                            Reset Quiz
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {QUIZ_QUESTIONS.map((q, qIdx) => {
                        const chosen = quizAnswers[q.id];
                        const isAnswered = chosen !== undefined;
                        const isCorrect = chosen === q.correctIndex;
                        return (
                            <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                                <div className="text-xs font-bold text-slate-900">
                                    Q{qIdx + 1}. {q.question}
                                </div>
                                <div className="space-y-1.5">
                                    {q.options.map((opt, optIdx) => {
                                        const selected = chosen === optIdx;
                                        const rightOpt = optIdx === q.correctIndex;
                                        let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                                        if (isAnswered) {
                                            if (rightOpt) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                                            else if (selected) btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                                        }
                                        return (
                                            <button
                                                key={optIdx}
                                                type="button"
                                                onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                                                className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                                            >
                                                <span>{opt}</span>
                                                {isAnswered && rightOpt && <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />}
                                                {isAnswered && selected && !rightOpt && <XCircle size={14} className="text-rose-500 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                {isAnswered && (
                                    <div className={`p-2.5 rounded-xl text-[11px] leading-snug ${
                                        isCorrect ? 'bg-emerald-100/70 text-emerald-900' : 'bg-amber-50 text-amber-900 border border-amber-200'
                                    }`}>
                                        <strong>{isCorrect ? 'Spot on!' : 'Not quite:'}</strong> {q.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
