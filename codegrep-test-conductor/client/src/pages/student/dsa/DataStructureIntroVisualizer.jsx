import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Box,
    Eye,
    EyeOff,
    Plus,
    Trash2,
    ArrowRight,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Sparkles,
    HelpCircle,
    Music,
    GitBranch,
    Database,
    Layers,
    ChevronRight,
    Terminal,
    Copy,
    Check
} from 'lucide-react';

// Inline plain-English tooltip badge for beginner-friendly jargon explanation
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

const INITIAL_ITEMS = ['Art', 'Coding', 'History', 'Math', 'Music', 'Physics'];
const EXTRA_ITEMS = ['Biology', 'Cooking', 'Design', 'Robotics'];

const CLASSIFICATION_NODES = {
    root: {
        id: 'root',
        title: 'Data Structures',
        category: 'Overview',
        path: ['root'],
        ruleOfThumb: 'A data structure is a way of organizing data in memory so operations like searching, adding, and deleting are fast and predictable.',
        analogy: 'Like choosing between a binder, a stack of plates, or a family tree depending on what you need to store.'
    },
    primitive: {
        id: 'primitive',
        title: 'Primitive Types',
        category: 'Building Blocks',
        path: ['root', 'primitive'],
        ruleOfThumb: 'Stores a single, simple value directly in memory — no sub-items inside.',
        analogy: 'A single sticky note with just one number or one letter written on it.'
    },
    'non-primitive': {
        id: 'non-primitive',
        title: 'Non-Primitive Structures',
        category: 'Collections',
        path: ['root', 'non-primitive'],
        ruleOfThumb: 'Combines multiple values into one organized container.',
        analogy: 'A folder or organizer that holds many sticky notes in a deliberate pattern.'
    },
    linear: {
        id: 'linear',
        title: 'Linear Data Structures',
        category: 'One After Another',
        path: ['root', 'non-primitive', 'linear'],
        ruleOfThumb: 'Every item sits in a single straight line, with at most one neighbor before and one after.',
        analogy: 'People standing in a single-file line at a ticket counter.'
    },
    'non-linear': {
        id: 'non-linear',
        title: 'Non-Linear Data Structures',
        category: 'Branching & Connected',
        path: ['root', 'non-primitive', 'non-linear'],
        ruleOfThumb: 'Items can branch out or connect to many other items at once instead of staying in one line.',
        analogy: 'A family tree or a map of roads connecting different cities.'
    },
    array: {
        id: 'array',
        title: 'Array',
        category: 'Linear',
        path: ['root', 'non-primitive', 'linear', 'array'],
        ruleOfThumb: 'Stores items side-by-side in numbered slots so you can jump to any slot instantly by its index.',
        analogy: 'Numbered school lockers in a hallway or an egg carton.'
    },
    'linked-list': {
        id: 'linked-list',
        title: 'Linked List',
        category: 'Linear',
        path: ['root', 'non-primitive', 'linear', 'linked-list'],
        ruleOfThumb: 'Each item can live anywhere in memory and carries a pointer arrow to the next item.',
        analogy: 'A treasure hunt where each clue tells you where to find the next clue.'
    },
    stack: {
        id: 'stack',
        title: 'Stack',
        category: 'Linear (LIFO)',
        path: ['root', 'non-primitive', 'linear', 'stack'],
        ruleOfThumb: 'You can only add or remove items from the very top — Last-In, First-Out (LIFO).',
        analogy: 'Your browser Back button or a stack of dinner plates.'
    },
    queue: {
        id: 'queue',
        title: 'Queue',
        category: 'Linear (FIFO)',
        path: ['root', 'non-primitive', 'linear', 'queue'],
        ruleOfThumb: 'New items join at the back and leave from the front — First-In, First-Out (FIFO).',
        analogy: 'A coffee shop line or a printer queue.'
    },
    tree: {
        id: 'tree',
        title: 'Tree',
        category: 'Non-Linear',
        path: ['root', 'non-primitive', 'non-linear', 'tree'],
        ruleOfThumb: 'Starts from one root at the top and branches downward into parent and child nodes.',
        analogy: 'Folders inside folders on your computer, or a family tree.'
    },
    graph: {
        id: 'graph',
        title: 'Graph',
        category: 'Non-Linear',
        path: ['root', 'non-primitive', 'non-linear', 'graph'],
        ruleOfThumb: 'Connects any node to any other node with edges, with no strict top or bottom.',
        analogy: 'Friends connected on a social network or Google Maps routes.'
    }
};

const QUIZ_QUESTIONS = [
    {
        id: 'q1',
        question: 'Which data structure works like a browser "Back" button (the last page you visited is the first one you go back to)?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctIndex: 1,
        explanation: 'A Stack follows Last-In, First-Out (LIFO): the most recently added item on top is always the first one removed.'
    },
    {
        id: 'q2',
        question: 'In an Abstract Data Type (ADT), what stays the same even if you switch from an Array to Linked Nodes inside?',
        options: [
            'The internal memory layout',
            'The user-facing Interface (buttons like Add, Remove, Peek, Size)',
            'The RAM addresses of every item',
            'Nothing — everything changes'
        ],
        correctIndex: 1,
        explanation: 'An ADT separates WHAT it does (the Interface) from HOW it works inside (the Implementation). You can swap the internals without changing the buttons!'
    }
];

const SECTIONS = [
    {
        id: 1,
        title: 'Data Structure Visualization',
        subtitle: 'How Data is Stored & Organized',
        icon: Database,
        badge: '1 of 3'
    },
    {
        id: 2,
        title: 'Classification Visualization',
        subtitle: 'Types of Data Structures',
        icon: GitBranch,
        badge: '2 of 3'
    },
    {
        id: 3,
        title: 'ADT Visualization',
        subtitle: 'Abstract Data Types: What vs. How',
        icon: Box,
        badge: '3 of 3'
    }
];

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

const SECTION1_CODE = {
    cpp: `// 1. Unstructured: separate variables (hard to search!)
string item1 = "Coding", item2 = "Music", item3 = "Physics";
if (item1 == "Physics") cout << "Found 1";
else if (item2 == "Physics") cout << "Found 2";
else if (item3 == "Physics") cout << "Found 3"; // tedious!

// 2. Structured: organized array (instant index access)
string shelf[3] = {"Art", "Coding", "Physics"};
cout << shelf[2]; // Jumps straight to "Physics" in 1 step!`,
    python: `# 1. Unstructured: separate variables (hard to search!)
item1, item2, item3 = "Coding", "Music", "Physics"
if item1 == "Physics": print("Found 1")
elif item2 == "Physics": print("Found 2")
elif item3 == "Physics": print("Found 3")  # tedious!

# 2. Structured: organized list (instant index access)
shelf = ["Art", "Coding", "Physics"]
print(shelf[2])  # Jumps straight to "Physics" in 1 step!`,
    js: `// 1. Unstructured: separate variables (hard to search!)
let item1 = "Coding", item2 = "Music", item3 = "Physics";
if (item1 === "Physics") console.log("Found 1");
else if (item2 === "Physics") console.log("Found 2");
else if (item3 === "Physics") console.log("Found 3"); // tedious!

// 2. Structured: organized array (instant index access)
const shelf = ["Art", "Coding", "Physics"];
console.log(shelf[2]); // Jumps straight to "Physics" in 1 step!`
};

const CLASSIFICATION_CODE = {
    root: {
        cpp: `// Choosing the right structure for the job:
int scores[4] = {10, 20, 30, 40}; // Fast lookup by index
stack<string> history;            // Undo / Back button
queue<string> line;               // Waiting line (FIFO)`,
        python: `# Choosing the right structure for the job:
scores = [10, 20, 30, 40]  # Fast lookup by index
history = []               # Undo / Back button (stack)
line = []                  # Waiting line (queue)`,
        js: `// Choosing the right structure for the job:
const scores = [10, 20, 30, 40]; // Fast lookup by index
const history = [];              // Undo / Back button
const line = [];                 // Waiting line (FIFO)`
    },
    primitive: {
        cpp: `int age = 21;        // Stores one whole number
char grade = 'A';    // Stores one single character
bool passed = true;  // Stores true or false`,
        python: `age = 21       # Stores one whole number (int)
grade = 'A'    # Stores one single character (str)
passed = True  # Stores True or False (bool)`,
        js: `let age = 21;       // Stores one number
let grade = 'A';    // Stores one character
let passed = true;  // Stores true or false`
    },
    'non-primitive': {
        cpp: `// Non-Primitive: groups multiple values together
int numbers[3] = {12, 45, 89}; // Collection of ints`,
        python: `# Non-Primitive: groups multiple values together
numbers = [12, 45, 89]  # Collection of ints`,
        js: `// Non-Primitive: groups multiple values together
const numbers = [12, 45, 89]; // Collection of numbers`
    },
    linear: {
        cpp: `// Linear: items sit in one straight sequence
int row[3] = {1, 2, 3};
for (int i = 0; i < 3; i++) {
    cout << row[i] << " "; // Visit 1st -> 2nd -> 3rd
}`,
        python: `# Linear: items sit in one straight sequence
row = [1, 2, 3]
for item in row:
    print(item)  # Visit 1st -> 2nd -> 3rd`,
        js: `// Linear: items sit in one straight sequence
const row = [1, 2, 3];
for (const item of row) {
    console.log(item); // Visit 1st -> 2nd -> 3rd
}`
    },
    'non-linear': {
        cpp: `// Non-Linear: one node can point to multiple branches
struct Node {
    string name;
    Node* left;   // Branch A
    Node* right;  // Branch B
};`,
        python: `# Non-Linear: one node can point to multiple branches
class Node:
    def __init__(self, name):
        self.name = name
        self.left = None   # Branch A
        self.right = None  # Branch B`,
        js: `// Non-Linear: one node can point to multiple branches
class Node {
    constructor(name) {
        this.name = name;
        this.left = null;  // Branch A
        this.right = null; // Branch B
    }
}`
    },
    array: {
        cpp: `// Contiguous boxes in memory (index 0 to 3)
int nums[4] = {10, 20, 30, 40};
cout << nums[1]; // Instant access -> 20
nums[1] = 25;    // Update slot 1 directly`,
        python: `# Contiguous list slots (index 0 to 3)
nums = [10, 20, 30, 40]
print(nums[1])  # Instant access -> 20
nums[1] = 25    # Update slot 1 directly`,
        js: `// Indexed boxes in memory (index 0 to 3)
const nums = [10, 20, 30, 40];
console.log(nums[1]); // Instant access -> 20
nums[1] = 25;         // Update slot 1 directly`
    },
    'linked-list': {
        cpp: `struct Node {
    char data;   // Value stored in this box
    Node* next;  // Pointer arrow to the next box
};
Node* head = new Node{'A', nullptr};
head->next = new Node{'B', nullptr}; // Link A -> B`,
        python: `class Node:
    def __init__(self, data):
        self.data = data  # Value stored in this box
        self.next = None  # Pointer arrow to next box

head = Node('A')
head.next = Node('B')     # Link A -> B`,
        js: `class Node {
    constructor(data) {
        this.data = data; // Value stored in this box
        this.next = null; // Pointer arrow to next box
    }
}
const head = new Node('A');
head.next = new Node('B'); // Link A -> B`
    },
    stack: {
        cpp: `stack<string> pages;
pages.push("Home");     // Add to top
pages.push("Courses");  // Now on top
pages.pop();            // Removes "Courses" (LIFO)`,
        python: `pages = []
pages.append("Home")     # Push to top
pages.append("Courses")  # Now on top
pages.pop()              # Removes "Courses" (LIFO)`,
        js: `const pages = [];
pages.push("Home");     // Push to top
pages.push("Courses");  // Now on top
pages.pop();            // Removes "Courses" (LIFO)`
    },
    queue: {
        cpp: `queue<string> line;
line.push("Alex");  // Joins at back
line.push("Sam");   // Behind Alex
line.pop();         // Serves "Alex" first (FIFO)`,
        python: `from collections import deque
line = deque()
line.append("Alex")  # Joins at back
line.append("Sam")   # Behind Alex
line.popleft()       # Serves "Alex" first (FIFO)`,
        js: `const line = [];
line.push("Alex"); // Joins at back
line.push("Sam");  // Behind Alex
line.shift();      // Serves "Alex" first (FIFO)`
    },
    tree: {
        cpp: `struct TreeNode {
    string label;
    TreeNode* left;   // Left child
    TreeNode* right;  // Right child
};
// Root branches down into Left and Right`,
        python: `class TreeNode:
    def __init__(self, label):
        self.label = label
        self.left = None   # Left child
        self.right = None  # Right child`,
        js: `class TreeNode {
    constructor(label) {
        this.label = label;
        this.left = null;  // Left child
        this.right = null; // Right child
    }
}`
    },
    graph: {
        cpp: `// Adjacency list: each person stores their friends
unordered_map<string, vector<string>> friends;
friends["You"] = {"Maya", "Leo"}; // Connect You <-> Maya, Leo`,
        python: `# Adjacency list: each person stores their friends
friends = {
    "You": ["Maya", "Leo"],  # Connect You <-> Maya, Leo
    "Maya": ["You"]
}`,
        js: `// Adjacency list: each person stores their friends
const friends = {
    You: ["Maya", "Leo"], // Connect You <-> Maya, Leo
    Maya: ["You"]
};`
    }
};

const ADT_INTERFACE_CODE = {
    cpp: `// Part A: ADT Interface (WHAT you can do)
// Users only see these 4 public buttons:
class PlaylistADT {
public:
    virtual void addSong(string song) = 0; // Enqueue
    virtual string playNext() = 0;         // Dequeue
    virtual string peekNext() = 0;         // Peek
    virtual int size() = 0;                // Size
};`,
    python: `# Part A: ADT Interface (WHAT you can do)
# Users only see these 4 public methods:
class PlaylistADT:
    def add_song(self, song): pass  # Enqueue at back
    def play_next(self): pass       # Dequeue from front
    def peek_next(self): pass       # View front song
    def size(self): pass            # Count songs`,
    js: `// Part A: ADT Interface (WHAT you can do)
// Users only call these 4 public methods:
//   playlist.addSong(song) -> Enqueue at back
//   playlist.playNext()    -> Dequeue from front
//   playlist.peekNext()    -> View front song
//   playlist.size()        -> Count songs`
};

const ADT_IMPL_CODE = {
    array: {
        cpp: `// Part B: Implementation A (Array-Backed)
vector<string> slots; // Contiguous boxes in memory
void addSong(string s) { slots.push_back(s); }
string playNext() {
    string front = slots[0];
    slots.erase(slots.begin()); // Shift boxes left
    return front;
}`,
        python: `# Part B: Implementation A (Array/List-Backed)
class ArrayPlaylist(PlaylistADT):
    def __init__(self): self.slots = []  # Contiguous list
    def add_song(self, s): self.slots.append(s)
    def play_next(self): return self.slots.pop(0)
    def peek_next(self): return self.slots[0]`,
        js: `// Part B: Implementation A (Array-Backed)
class ArrayPlaylist {
    constructor() { this.slots = []; } // Contiguous array
    addSong(s) { this.slots.push(s); }
    playNext() { return this.slots.shift(); }
    peekNext() { return this.slots[0]; }
    size() { return this.slots.length; }
}`
    },
    linked: {
        cpp: `// Part B: Implementation B (Linked-Nodes-Backed)
Node *front = nullptr, *back = nullptr; // Pointer chain
void addSong(string s) {
    Node* n = new Node{s, nullptr};
    if (back) back->next = n; else front = n;
    back = n; // Update back pointer
}`,
        python: `# Part B: Implementation B (Linked-Nodes-Backed)
class LinkedPlaylist(PlaylistADT):
    def __init__(self): self.front = self.back = None
    def add_song(self, s):
        node = Node(s)  # Link new node at back
        if self.back: self.back.next = node
        else: self.front = node
        self.back = node`,
        js: `// Part B: Implementation B (Linked-Nodes-Backed)
class LinkedPlaylist {
    constructor() { this.front = this.back = null; }
    addSong(s) {
        const node = { song: s, next: null }; // Pointer node
        if (this.back) this.back.next = node; else this.front = node;
        this.back = node;
    }
}`
    }
};

export default function DataStructureIntroVisualizer({ onLog }) {
    const [activeSection, setActiveSection] = useState(1);
    const [showAllSections, setShowAllSections] = useState(false);
    const [codeLang, setCodeLang] = useState('cpp');

    // ── SECTION 1: DATA STRUCTURE SANDBOX STATE ──────────────────────────
    const [rawItems, setRawItems] = useState(['Coding', 'Music', 'Art', 'Physics', 'Math', 'History']);
    const [structuredItems, setStructuredItems] = useState([...INITIAL_ITEMS]);
    const [selectedTarget, setSelectedTarget] = useState('Physics');
    const [isAnimating, setIsAnimating] = useState(false);
    const [rawScanIdx, setRawScanIdx] = useState(-1);
    const [rawFoundIdx, setRawFoundIdx] = useState(-1);
    const [rawSteps, setRawSteps] = useState(0);
    const [structFoundIdx, setStructFoundIdx] = useState(-1);
    const [structSteps, setStructSteps] = useState(0);
    const [section1Note, setSection1Note] = useState(
        'Pick an item and click Search, Insert, or Delete to compare unstructured vs. organized memory.'
    );
    const timersRef = useRef([]);

    const clearTimers = () => {
        timersRef.current.forEach(t => clearTimeout(t));
        timersRef.current = [];
    };

    useEffect(() => () => clearTimers(), []);

    const resetHighlights = () => {
        clearTimers();
        setIsAnimating(false);
        setRawScanIdx(-1);
        setRawFoundIdx(-1);
        setRawSteps(0);
        setStructFoundIdx(-1);
        setStructSteps(0);
    };

    const handleSearchOp = () => {
        resetHighlights();
        const rawIdx = rawItems.indexOf(selectedTarget);
        const structIdx = structuredItems.indexOf(selectedTarget);
        if (rawIdx === -1 && structIdx === -1) {
            setSection1Note(`"${selectedTarget}" is not currently in either container. Try inserting it or picking another item.`);
            return;
        }
        setIsAnimating(true);
        const maxRaw = rawIdx === -1 ? rawItems.length - 1 : rawIdx;
        for (let i = 0; i <= maxRaw; i++) {
            const t = setTimeout(() => {
                setRawScanIdx(i);
                setRawSteps(i + 1);
                if (i === rawIdx) {
                    setRawFoundIdx(i);
                    setIsAnimating(false);
                    setSection1Note(
                        `Takeaway: Unstructured memory checked ${i + 1} random slots, while Structured memory jumped straight to Slot [${structIdx}] in 1 step!`
                    );
                } else if (i === maxRaw && rawIdx === -1) {
                    setIsAnimating(false);
                }
            }, (i + 1) * 350);
            timersRef.current.push(t);
        }

        const st = setTimeout(() => {
            if (structIdx !== -1) {
                setStructFoundIdx(structIdx);
                setStructSteps(1);
            }
        }, 350);
        timersRef.current.push(st);
        onLog?.(`Section 1 Search("${selectedTarget}"): Raw=${maxRaw + 1} steps vs Structured=1 step.`);
    };

    const handleInsertOp = () => {
        resetHighlights();
        if (structuredItems.length >= 8) {
            setSection1Note('Containers are full (8 slots max for this demo). Try Delete Item first!');
            return;
        }
        const nextItem = EXTRA_ITEMS.find(x => !structuredItems.includes(x)) || `Item${structuredItems.length + 1}`;
        setRawItems(prev => [...prev, nextItem]);
        const nextSorted = [...structuredItems, nextItem].sort((a, b) => a.localeCompare(b));
        setStructuredItems(nextSorted);
        setSelectedTarget(nextItem);
        const newIdx = nextSorted.indexOf(nextItem);
        setRawFoundIdx(rawItems.length);
        setStructFoundIdx(newIdx);
        setRawSteps(1);
        setStructSteps(1);
        setSection1Note(
            `Inserted "${nextItem}": Raw data tossed it into an open slot; Structured data placed it neatly in sorted Slot [${newIdx}].`
        );
        onLog?.(`Section 1 Insert("${nextItem}") -> Structured Slot [${newIdx}].`);
    };

    const handleDeleteOp = () => {
        resetHighlights();
        if (structuredItems.length <= 1) {
            setSection1Note('Keep at least 1 item in the container so you can search it!');
            return;
        }
        const target = structuredItems.includes(selectedTarget) ? selectedTarget : structuredItems[0];
        const rawIdx = rawItems.indexOf(target);
        setRawItems(prev => prev.filter(x => x !== target));
        const nextSorted = structuredItems.filter(x => x !== target);
        setStructuredItems(nextSorted);
        setSelectedTarget(nextSorted[0]);
        setRawSteps(rawIdx >= 0 ? rawIdx + 1 : 1);
        setStructSteps(1);
        setSection1Note(
            `Deleted "${target}": Unstructured had to scan ${rawIdx >= 0 ? rawIdx + 1 : 1} slots to find it; Structured located Slot [${structuredItems.indexOf(target)}] in 1 step and closed the gap.`
        );
        onLog?.(`Section 1 Delete("${target}").`);
    };

    const handleResetSandbox = () => {
        resetHighlights();
        setRawItems(['Coding', 'Music', 'Art', 'Physics', 'Math', 'History']);
        setStructuredItems([...INITIAL_ITEMS]);
        setSelectedTarget('Physics');
        setSection1Note('Reset complete. Pick an item and click Search, Insert, or Delete!');
    };

    // ── SECTION 2: CLASSIFICATION EXPLORER STATE ─────────────────────────
    const [selectedNodeId, setSelectedNodeId] = useState('array');
    const [primTypeIdx, setPrimTypeIdx] = useState(0);
    const [arrayActiveIdx, setArrayActiveIdx] = useState(1);
    const [linkedActiveIdx, setLinkedActiveIdx] = useState(0);
    const [miniStack, setMiniStack] = useState(['Home', 'Courses']);
    const [miniQueue, setMiniQueue] = useState(['Alex', 'Sam']);
    const [treeHighlight, setTreeHighlight] = useState(0);
    const [graphHighlight, setGraphHighlight] = useState(0);

    const selectedNode = CLASSIFICATION_NODES[selectedNodeId] || CLASSIFICATION_NODES.array;
    const isInPath = (id) => selectedNode.path.includes(id);

    const primExamples = [
        { type: 'int', label: 'age = 21' },
        { type: 'char', label: "grade = 'A'" },
        { type: 'bool', label: 'passed = true' }
    ];

    // ── SECTION 3: ADT BLACK BOX SIMULATOR STATE ─────────────────────────
    const [adtImpl, setAdtImpl] = useState('array'); // 'array' | 'linked'
    const [xrayMode, setXrayMode] = useState(true);
    const [playlist, setPlaylist] = useState(['Lo-Fi Beats', 'Coding Flow', 'Night Drive']);
    const [peekedSong, setPeekedSong] = useState(null);
    const [showSizeBadge, setShowSizeBadge] = useState(false);
    const [adtFeedback, setAdtFeedback] = useState(
        'Press Enqueue / Add, Dequeue / Remove, Peek, or Size — then switch between Array and Linked Nodes!'
    );

    const sampleSongs = ['Focus Mode', 'Synthwave', 'Rainy Cafe', 'Deep Work', 'Chill Hop'];

    const handleAdtAdd = () => {
        if (playlist.length >= 5) {
            setAdtFeedback('Playlist is full (5 songs max for this demo). Try Dequeue / Remove first!');
            return;
        }
        const nextSong = sampleSongs.find(s => !playlist.includes(s)) || `Track #${playlist.length + 1}`;
        setPlaylist(prev => [...prev, nextSong]);
        setPeekedSong(null);
        setShowSizeBadge(false);
        setAdtFeedback(`Enqueue("${nextSong}"): Added to the back! Both Array and Linked Nodes produce the exact same result.`);
        onLog?.(`ADT Enqueue("${nextSong}") using ${adtImpl}.`);
    };

    const handleAdtRemove = () => {
        if (playlist.length === 0) {
            setAdtFeedback('Queue is empty! Nothing to dequeue.');
            return;
        }
        const removed = playlist[0];
        setPlaylist(prev => prev.slice(1));
        setPeekedSong(null);
        setShowSizeBadge(false);
        setAdtFeedback(`Dequeue() -> "${removed}": Removed from the front. Notice the public interface stays identical!`);
        onLog?.(`ADT Dequeue() -> "${removed}" using ${adtImpl}.`);
    };

    const handleAdtPeek = () => {
        if (playlist.length === 0) {
            setAdtFeedback('Queue is empty! Add a song first.');
            return;
        }
        setPeekedSong(playlist[0]);
        setShowSizeBadge(false);
        setAdtFeedback(`Peek(): "${playlist[0]}" is at the front of the queue (nothing was removed).`);
    };

    const handleAdtSize = () => {
        setShowSizeBadge(true);
        setPeekedSong(null);
        setAdtFeedback(`Size(): Currently ${playlist.length} item${playlist.length === 1 ? '' : 's'} in the queue.`);
    };

    // ── QUIZ STATE ───────────────────────────────────────────────────────
    const [quizAnswers, setQuizAnswers] = useState({});

    const visibleSections = showAllSections ? [1, 2, 3] : [activeSection];

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-6">
            {/* ── ALWAYS-VISIBLE TOP-LEVEL SECTION SELECTOR ─────────────────── */}
            <div className="space-y-3 pb-5 border-b border-slate-200/80">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                            Module 1.1 Interactive Visualizations
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
                        const isSelected = showAllSections || activeSection === sec.id;
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
                                        : isSelected
                                        ? 'bg-blue-50/60 text-slate-900 border-blue-200'
                                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    isCurrent ? 'bg-blue-500 text-white' : 'bg-white text-slate-700 border border-slate-200'
                                }`}>
                                    <Icon size={17} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                        <span className={`text-[10px] font-mono font-bold uppercase ${isCurrent ? 'text-blue-300' : 'text-blue-600'}`}>
                                            Section {sec.badge}
                                        </span>
                                    </div>
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
                SECTION 1: DEDICATED DATA STRUCTURE VISUALIZATION
               ═════════════════════════════════════════════════════════════ */}
            {visibleSections.includes(1) && (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">Section 1 of 3</span>
                            <h3 className="text-base font-extrabold text-slate-900">Data Structure Visualization: Raw vs. Structured Memory</h3>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <div className="space-y-1.5">
                            <span className="text-xs font-bold text-slate-700 block">Target Item:</span>
                            <div className="flex flex-wrap gap-1.5">
                                {structuredItems.map(item => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => { setSelectedTarget(item); resetHighlights(); }}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                            selectedTarget === item
                                                ? 'bg-slate-900 text-white border-slate-900'
                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={handleSearchOp}
                                disabled={isAnimating}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-xs"
                            >
                                <Search size={14} />
                                <span>Search Item</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleInsertOp}
                                disabled={isAnimating}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>Insert Item</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteOp}
                                disabled={isAnimating}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                            >
                                <Trash2 size={14} />
                                <span>Delete Item</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleResetSandbox}
                                className="p-2 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                                title="Reset Sandbox"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Side-by-side Memory Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/35 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-extrabold text-rose-900">Raw Unstructured Data</div>
                                    <div className="text-[11px] text-rose-700">Scattered in random memory slots — must check one by one</div>
                                </div>
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 font-mono text-xs font-bold text-rose-700">
                                    Steps: {rawSteps}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 bg-white/90 rounded-xl border border-rose-100 min-h-[120px]">
                                {rawItems.map((item, idx) => {
                                    const isFound = rawFoundIdx === idx;
                                    const isCurrent = rawScanIdx === idx && !isFound;
                                    const isPassed = rawScanIdx > idx && !isFound;
                                    return (
                                        <div
                                            key={`${item}-${idx}`}
                                            className={`px-2 py-2 rounded-xl border text-center transition-all duration-200 ${
                                                isFound
                                                    ? 'bg-emerald-500 text-white border-emerald-600 scale-105 ring-4 ring-emerald-200'
                                                    : isCurrent
                                                    ? 'bg-amber-400 text-slate-900 border-amber-500 scale-105'
                                                    : isPassed
                                                    ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                                                    : 'bg-rose-50 text-rose-900 border-rose-200'
                                            }`}
                                        >
                                            <div className="text-[9px] font-mono opacity-70">0x{(100 + idx * 17).toString(16).toUpperCase()}</div>
                                            <div className="text-xs font-bold truncate">{item}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/35 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-extrabold text-emerald-900">Structured Data (Organized Slots)</div>
                                    <div className="text-[11px] text-emerald-700">Sorted with numbered addresses — predictable & fast</div>
                                </div>
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 font-mono text-xs font-bold text-emerald-700">
                                    Steps: {structSteps}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 bg-white/90 rounded-xl border border-emerald-100 min-h-[120px]">
                                {structuredItems.map((item, idx) => {
                                    const isFound = structFoundIdx === idx;
                                    return (
                                        <div
                                            key={item}
                                            className={`px-2 py-2 rounded-xl border text-center transition-all duration-200 ${
                                                isFound
                                                    ? 'bg-emerald-500 text-white border-emerald-600 scale-105 ring-4 ring-emerald-200'
                                                    : 'bg-slate-50 text-slate-800 border-slate-200'
                                            }`}
                                        >
                                            <div className={`text-[9px] font-mono font-bold ${isFound ? 'text-emerald-100' : 'text-slate-400'}`}>
                                                Slot [{idx}]
                                            </div>
                                            <div className="text-xs font-bold truncate">{item}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <ReferenceCodeCard
                        title="Reference Code: Unstructured vs. Structured"
                        badge="Section 1"
                        snippets={SECTION1_CODE}
                        codeLang={codeLang}
                        onChangeLang={setCodeLang}
                    />

                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-start gap-2 text-xs text-blue-900">
                            <Sparkles size={15} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>{section1Note}</span>
                        </div>
                        {!showAllSections && (
                            <button
                                type="button"
                                onClick={() => setActiveSection(2)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer ml-auto"
                            >
                                <span>Next Visualization: Classification</span>
                                <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* ═════════════════════════════════════════════════════════════
                SECTION 2: DEDICATED CLASSIFICATION VISUALIZATION
               ═════════════════════════════════════════════════════════════ */}
            {visibleSections.includes(2) && (
                <section className={`space-y-4 ${showAllSections ? 'pt-6 border-t border-slate-200' : ''}`}>
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">Section 2 of 3</span>
                        <h3 className="text-base font-extrabold text-slate-900">Classification Visualization: Types of Data Structures</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Left: Clickable Tree Map with Path Highlight */}
                        <div className="lg:col-span-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setSelectedNodeId('root')}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                        isInPath('root')
                                            ? 'bg-slate-900 text-white ring-4 ring-blue-500/20'
                                            : 'bg-white text-slate-800 border border-slate-300'
                                    }`}
                                >
                                    Data Structures
                                </button>
                                <p className="text-[11px] text-slate-500 mt-1">Click any node to highlight its path from the root</p>
                            </div>

                            {/* Branch Level 1 */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedNodeId('primitive')}
                                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                        isInPath('primitive')
                                            ? 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-200'
                                            : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
                                    }`}
                                >
                                    <div className="text-xs font-extrabold">Primitive</div>
                                    <div className={`text-[10px] ${isInPath('primitive') ? 'text-emerald-100' : 'text-slate-500'}`}>
                                        Single values (int, char, bool)
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedNodeId('non-primitive')}
                                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                        isInPath('non-primitive')
                                            ? 'bg-blue-600 text-white border-blue-700 ring-4 ring-blue-200'
                                            : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="text-xs font-extrabold">Non-Primitive</div>
                                    <div className={`text-[10px] ${isInPath('non-primitive') ? 'text-blue-100' : 'text-slate-500'}`}>
                                        Collections of items
                                    </div>
                                </button>
                            </div>

                            {/* Branch Level 2 & Leaves */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedNodeId('linear')}
                                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-extrabold text-left transition-all cursor-pointer ${
                                            isInPath('linear')
                                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                                                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
                                        }`}
                                    >
                                        Linear (Single Line)
                                    </button>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {[
                                            { id: 'array', label: 'Array' },
                                            { id: 'linked-list', label: 'Linked List' },
                                            { id: 'stack', label: 'Stack' },
                                            { id: 'queue', label: 'Queue' }
                                        ].map(n => (
                                            <button
                                                key={n.id}
                                                type="button"
                                                onClick={() => setSelectedNodeId(n.id)}
                                                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                                    selectedNodeId === n.id
                                                        ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-blue-400'
                                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {n.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedNodeId('non-linear')}
                                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-extrabold text-left transition-all cursor-pointer ${
                                            isInPath('non-linear')
                                                ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                                                : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                                        }`}
                                    >
                                        Non-Linear (Branching)
                                    </button>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {[
                                            { id: 'tree', label: 'Tree' },
                                            { id: 'graph', label: 'Graph' }
                                        ].map(n => (
                                            <button
                                                key={n.id}
                                                type="button"
                                                onClick={() => setSelectedNodeId(n.id)}
                                                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                                    selectedNodeId === n.id
                                                        ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-purple-400'
                                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {n.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Visual Stage for Selected Node */}
                        <div className="lg:col-span-6 p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">
                                        {selectedNode.category}
                                    </span>
                                    <h4 className="text-lg font-extrabold text-slate-900">{selectedNode.title}</h4>
                                </div>
                                {selectedNodeId === 'array' && (
                                    <JargonTip term="Contiguous" meaning="Stored right next to each other in memory with zero gaps, like lockers in a row." />
                                )}
                                {selectedNodeId === 'linked-list' && (
                                    <JargonTip term="Pointer" meaning="A stored memory address that acts like an arrow pointing to where the next item lives." />
                                )}
                            </div>

                            {/* Interactive Memory Stage */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 min-h-[135px] flex flex-col items-center justify-center gap-3">
                                {(selectedNodeId === 'root' || selectedNodeId === 'non-primitive') && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50">
                                        {['12', '45', '89'].map((v, i) => (
                                            <div key={i} className="w-10 h-10 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                                                {v}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedNodeId === 'primitive' && (
                                    <>
                                        <div className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-mono text-sm font-bold shadow-xs">
                                            {primExamples[primTypeIdx].label}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setPrimTypeIdx((primTypeIdx + 1) % primExamples.length)}
                                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                                        >
                                            Switch Type ({primExamples[primTypeIdx].type})
                                        </button>
                                    </>
                                )}

                                {selectedNodeId === 'linear' && (
                                    <div className="flex items-center gap-2">
                                        {['1st', '2nd', '3rd'].map((s, i) => (
                                            <React.Fragment key={s}>
                                                <div className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold">{s}</div>
                                                {i < 2 && <ArrowRight size={14} className="text-indigo-400" />}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}

                                {selectedNodeId === 'non-linear' && (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold">Start</div>
                                        <div className="flex items-center gap-6">
                                            <div className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold">Branch A</div>
                                            <div className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold">Branch B</div>
                                        </div>
                                    </div>
                                )}

                                {selectedNodeId === 'array' && (
                                    <>
                                        <div className="flex items-center gap-1">
                                            {['10', '20', '30', '40'].map((val, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setArrayActiveIdx(idx)}
                                                    className={`w-12 h-12 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                                                        arrayActiveIdx === idx
                                                            ? 'bg-blue-600 text-white border-blue-700 scale-105'
                                                            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    <span>{val}</span>
                                                    <span className={`text-[9px] ${arrayActiveIdx === idx ? 'text-blue-100' : 'text-slate-400'}`}>[{idx}]</span>
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-slate-600">Click any box to jump straight to index <strong>[{arrayActiveIdx}]</strong></span>
                                    </>
                                )}

                                {selectedNodeId === 'linked-list' && (
                                    <>
                                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                                            {['A', 'B', 'C'].map((val, idx) => (
                                                <div
                                                    key={val}
                                                    className={`px-3 py-2 rounded-lg border font-mono text-xs font-bold transition-all ${
                                                        linkedActiveIdx === idx
                                                            ? 'bg-cyan-600 text-white border-cyan-700 scale-105'
                                                            : 'bg-white text-slate-800 border-slate-300'
                                                    }`}
                                                >
                                                    {val} | •→
                                                </div>
                                            ))}
                                            <span className="text-xs font-mono text-slate-400">null</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setLinkedActiveIdx((linkedActiveIdx + 1) % 3)}
                                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                                        >
                                            Follow Next Pointer →
                                        </button>
                                    </>
                                )}

                                {selectedNodeId === 'stack' && (
                                    <>
                                        <div className="w-40 border-x-2 border-b-2 border-slate-700 rounded-b-xl p-1.5 flex flex-col-reverse gap-1 bg-white min-h-[82px]">
                                            {miniStack.map((item, i) => (
                                                <div key={i} className={`px-2 py-1 rounded text-center text-xs font-bold ${i === miniStack.length - 1 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => miniStack.length < 4 && setMiniStack(p => [...p, `Page ${p.length + 1}`])} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white cursor-pointer">Push</button>
                                            <button type="button" onClick={() => miniStack.length > 0 && setMiniStack(p => p.slice(0, -1))} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer">Pop (Top)</button>
                                        </div>
                                    </>
                                )}

                                {selectedNodeId === 'queue' && (
                                    <>
                                        <div className="flex items-center gap-1.5 min-h-[42px]">
                                            {miniQueue.length === 0 ? <span className="text-xs text-slate-400">Line is empty</span> : miniQueue.map((person, i) => (
                                                <div key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${i === 0 ? 'bg-teal-600 text-white border-teal-700' : 'bg-white text-slate-700 border-slate-200'}`}>
                                                    {person}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => miniQueue.length < 4 && setMiniQueue(p => [...p, `Guest ${p.length + 1}`])} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white cursor-pointer">Join Back</button>
                                            <button type="button" onClick={() => miniQueue.length > 0 && setMiniQueue(p => p.slice(1))} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 cursor-pointer">Serve Front</button>
                                        </div>
                                    </>
                                )}

                                {selectedNodeId === 'tree' && (
                                    <>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${treeHighlight === 0 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-700 border-slate-300'}`}>Root</div>
                                            <div className="flex gap-6">
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${treeHighlight === 1 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-700 border-slate-300'}`}>Left Child</div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${treeHighlight === 2 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-700 border-slate-300'}`}>Right Child</div>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setTreeHighlight((treeHighlight + 1) % 3)} className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer">
                                            Traverse Nodes
                                        </button>
                                    </>
                                )}

                                {selectedNodeId === 'graph' && (
                                    <>
                                        <div className="flex items-center gap-4">
                                            {['You', 'Maya', 'Leo'].map((name, i) => (
                                                <button
                                                    key={name}
                                                    type="button"
                                                    onClick={() => setGraphHighlight(i)}
                                                    className={`w-12 h-12 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                                                        graphHighlight === i
                                                            ? 'bg-rose-600 text-white border-rose-700 scale-110'
                                                            : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-50'
                                                    }`}
                                                >
                                                    {name}
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-slate-600">Click any person node to highlight it.</span>
                                    </>
                                )}
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                                    <span className="font-extrabold text-slate-900 block mb-0.5">Rule of Thumb:</span>
                                    <span className="text-slate-600">{selectedNode.ruleOfThumb}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                                    <span className="font-extrabold text-amber-900 block mb-0.5">Everyday Analogy:</span>
                                    <span className="text-amber-800">{selectedNode.analogy}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ReferenceCodeCard
                        title={`Reference Code: ${selectedNode.title}`}
                        badge={selectedNode.category}
                        snippets={CLASSIFICATION_CODE[selectedNodeId] || CLASSIFICATION_CODE.array}
                        codeLang={codeLang}
                        onChangeLang={setCodeLang}
                    />

                    {!showAllSections && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setActiveSection(3)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                            >
                                <span>Next Visualization: ADT (What vs. How)</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* ═════════════════════════════════════════════════════════════
                SECTION 3: DEDICATED ADT VISUALIZATION (FRONT PANEL VS INSIDE)
               ═════════════════════════════════════════════════════════════ */}
            {visibleSections.includes(3) && (
                <section className={`space-y-4 ${showAllSections ? 'pt-6 border-t border-slate-200' : ''}`}>
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">Section 3 of 3</span>
                        <h3 className="text-base font-extrabold text-slate-900">ADT Visualization: Front Panel (Interface) vs. Inside the Machine</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                        {/* Front Panel: Public ADT Operations (WHAT you can do) */}
                        <div className="lg:col-span-5 p-4 rounded-2xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                                        <Music size={14} className="text-blue-600" />
                                        Front Panel: Music Playlist Queue ADT
                                    </span>
                                    <JargonTip term="Interface" meaning="The public buttons you are allowed to press, without needing to know how the inside works." />
                                </div>

                                {/* Plain-English Contract Box */}
                                <div className="p-2.5 rounded-xl bg-white/90 border border-blue-100 text-[11px] text-slate-700 space-y-1">
                                    <div className="font-bold text-blue-900">Public Contract (WHAT each button guarantees):</div>
                                    <div>• <strong>Enqueue / Add:</strong> Puts a new song at the end of the line.</div>
                                    <div>• <strong>Dequeue / Remove:</strong> Plays & removes the front song.</div>
                                    <div>• <strong>Peek / Front & Size:</strong> Shows the next song or total count.</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={handleAdtAdd}
                                    className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold cursor-pointer shadow-xs"
                                >
                                    <Plus size={14} />
                                    <span>Enqueue / Add</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAdtRemove}
                                    className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold cursor-pointer shadow-xs"
                                >
                                    <Trash2 size={14} />
                                    <span>Dequeue / Remove</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAdtPeek}
                                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                                >
                                    <Eye size={14} />
                                    <span>Peek / Front</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAdtSize}
                                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                                >
                                    <Layers size={14} />
                                    <span>Size ({playlist.length})</span>
                                </button>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-blue-200 text-[11px] text-slate-700">
                                {adtFeedback}
                                {peekedSong && (
                                    <div className="mt-1 font-bold text-emerald-700">Front Song: "{peekedSong}"</div>
                                )}
                                {showSizeBadge && (
                                    <div className="mt-1 font-bold text-blue-700">Total Songs in Queue: {playlist.length}</div>
                                )}
                            </div>
                        </div>

                        {/* Inside the Machine: Implementation Switcher (HOW it works inside) */}
                        <div className="lg:col-span-7 flex flex-col gap-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-bold text-slate-700">Inside the Machine:</span>
                                    <div className="inline-flex rounded-xl bg-white border border-slate-200 p-1">
                                        <button
                                            type="button"
                                            onClick={() => { setAdtImpl('array'); setAdtFeedback('Switched to Implementation A (Array). Notice the Front Panel buttons stayed 100% identical!'); }}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                                adtImpl === 'array' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            Impl A: Array
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setAdtImpl('linked'); setAdtFeedback('Switched to Implementation B (Linked Nodes). Notice the Front Panel buttons stayed 100% identical!'); }}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                                adtImpl === 'linked' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            Impl B: Linked Nodes
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setXrayMode(v => !v)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                        xrayMode
                                            ? 'bg-blue-600 text-white border-blue-700'
                                            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                                    }`}
                                >
                                    {xrayMode ? <Eye size={13} /> : <EyeOff size={13} />}
                                    <span>Peek Inside (X-Ray): {xrayMode ? 'ON' : 'OFF'}</span>
                                </button>
                            </div>

                            <div className={`flex-1 p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[200px] ${
                                xrayMode ? 'bg-slate-50 border-blue-300' : 'bg-slate-950 border-slate-800 text-white'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-extrabold ${xrayMode ? 'text-slate-900' : 'text-slate-200'}`}>
                                        {adtImpl === 'array' ? 'Implementation A: Array (Contiguous Boxes)' : 'Implementation B: Linked Nodes (Pointer Chain)'}
                                    </span>
                                    {xrayMode && adtImpl === 'array' && (
                                        <JargonTip term="Contiguous" meaning="Items sit side-by-side in one continuous row of memory slots." />
                                    )}
                                    {xrayMode && adtImpl === 'linked' && (
                                        <JargonTip term="Pointer" meaning="Each node stores a link pointing to the next song's location." />
                                    )}
                                </div>

                                {!xrayMode ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-2">
                                        <Box size={36} className="text-blue-400" />
                                        <div className="text-sm font-bold text-white">Hidden Black Box ({playlist.length} songs inside)</div>
                                        <p className="text-xs text-slate-400 max-w-sm">
                                            Internal memory is hidden from the user. Turn on <strong>Peek Inside (X-Ray)</strong> to see how it works!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center py-4">
                                        {playlist.length === 0 ? (
                                            <span className="text-xs font-mono text-slate-400">[ Empty Memory ]</span>
                                        ) : adtImpl === 'array' ? (
                                            <div className="flex flex-wrap items-center justify-center gap-1">
                                                {playlist.map((song, idx) => (
                                                    <div key={idx} className={`px-3 py-2 rounded-lg bg-white border-2 text-center shadow-2xs transition-all ${
                                                        peekedSong === song ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-blue-400'
                                                    }`}>
                                                        <div className="text-[9px] font-mono text-blue-600 font-bold">Slot [{idx}]</div>
                                                        <div className="text-xs font-bold text-slate-800">{song}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                                                {playlist.map((song, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <div className={`px-3 py-2 rounded-lg bg-white border-2 text-center shadow-2xs transition-all ${
                                                            peekedSong === song ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-cyan-500'
                                                        }`}>
                                                            <div className="text-[9px] font-mono text-cyan-700 font-bold">Node</div>
                                                            <div className="text-xs font-bold text-slate-800">{song}</div>
                                                        </div>
                                                        {idx < playlist.length - 1 && <ArrowRight size={14} className="text-cyan-600 shrink-0" />}
                                                    </React.Fragment>
                                                ))}
                                                <span className="text-xs font-mono text-slate-400 ml-1">→ null</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <ReferenceCodeCard
                            title="Part A: ADT Interface (WHAT it does)"
                            badge="Public"
                            snippets={ADT_INTERFACE_CODE}
                            codeLang={codeLang}
                            onChangeLang={setCodeLang}
                        />
                        <ReferenceCodeCard
                            title={`Part B: ${adtImpl === 'array' ? 'Array-Backed' : 'Linked-Nodes-Backed'} (HOW it works)`}
                            badge={adtImpl === 'array' ? 'Impl A' : 'Impl B'}
                            snippets={ADT_IMPL_CODE[adtImpl]}
                            codeLang={codeLang}
                            onChangeLang={setCodeLang}
                        />
                    </div>
                </section>
            )}

            {/* ═════════════════════════════════════════════════════════════
                CHECK YOUR UNDERSTANDING: 2-QUESTION MINI-CHALLENGE
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
