import React, { useState, useEffect, useRef, useCallback } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
  Package, Folder, FileCode, ChevronRight, ChevronDown, Play, RotateCcw,
  Download, ArrowRight, ArrowDown, CheckCircle2, Sparkles, Zap, Terminal,
  Search, Box, Globe, Database, Cpu, Layers, Code2, BookOpen, Hash,
  SkipForward, HelpCircle, AlertTriangle, Info
} from 'lucide-react';

// ─── File System Data ──────────────────────────────────────────────────────────
const FILE_TREE = {
  id: 'project',
  name: 'project/',
  type: 'folder',
  children: [
    {
      id: 'main',
      name: 'main.py',
      type: 'file',
      content: `# main.py — Entry point of our project
import math
from utils.math_ops import add, multiply
from utils.string_ops import greet, shout
import utils  # imports utils/__init__.py

result = add(10, 5)
product = multiply(3, 7)
print(f"10 + 5 = {result}")
print(f"3 × 7 = {product}")
print(greet("Alice"))
print(shout("hello"))
print(f"π ≈ {math.pi:.4f}")
print(f"Package version: {utils.__version__}")`,
      imports: ['utils.math_ops', 'utils.string_ops', 'utils']
    },
    {
      id: 'utils',
      name: 'utils/',
      type: 'folder',
      isPackage: true,
      children: [
        {
          id: 'utils_init',
          name: '__init__.py',
          type: 'file',
          content: `# utils/__init__.py
# This file makes "utils" a Python package.
# It runs when you do: import utils

__version__ = "1.0.0"
__author__  = "You!"

# Re-export commonly used names so callers can do:
# from utils import add   (instead of utils.math_ops)
from .math_ops   import add, multiply
from .string_ops import greet, shout

print(f"utils package v{__version__} loaded!")`,
          imports: []
        },
        {
          id: 'math_ops',
          name: 'math_ops.py',
          type: 'file',
          content: `# utils/math_ops.py — custom math utilities

def add(a, b):
    """Return the sum of a and b."""
    return a + b

def multiply(a, b):
    """Return the product of a and b."""
    return a * b

def power(base, exp):
    """Return base raised to exp."""
    return base ** exp

def is_even(n):
    """Return True if n is even."""
    return n % 2 == 0`,
          imports: []
        },
        {
          id: 'string_ops',
          name: 'string_ops.py',
          type: 'file',
          content: `# utils/string_ops.py — string helpers

def greet(name):
    """Return a friendly greeting."""
    return f"Hello, {name}! 👋"

def shout(text):
    """Return text in ALL CAPS with !!!"""
    return text.upper() + "!!!"

def snake_to_camel(s):
    """Convert snake_case → camelCase."""
    parts = s.split("_")
    return parts[0] + "".join(w.title() for w in parts[1:])

def count_vowels(s):
    """Count vowels in a string."""
    return sum(1 for c in s.lower() if c in "aeiou")`,
          imports: []
        }
      ]
    }
  ]
};

// ─── Standard Library Modules ─────────────────────────────────────────────────
const STD_LIB_MODULES = [
  {
    name: 'math',
    icon: '∑',
    color: 'cyan',
    desc: 'Mathematical functions and constants',
    examples: [
      { label: 'math.sqrt(16)', fn: () => `Result: ${Math.sqrt(16)}` },
      { label: 'math.pi', fn: () => `Result: ${Math.PI.toFixed(10)}` },
      { label: 'math.factorial(6)', fn: () => { let f=1; for(let i=2;i<=6;i++) f*=i; return `Result: ${f}`; } }
    ]
  },
  {
    name: 'os',
    icon: '💻',
    color: 'emerald',
    desc: 'Operating system interface (files, paths, env)',
    examples: [
      { label: 'os.getcwd()', fn: () => `Result: /home/user/project` },
      { label: 'os.listdir(".")', fn: () => `Result: ['main.py', 'utils/']` }
    ]
  },
  {
    name: 'sys',
    icon: '⚙️',
    color: 'violet',
    desc: 'System-specific parameters and functions',
    examples: [
      { label: 'sys.version', fn: () => `Result: 3.12.0 (CPython)` },
      { label: 'sys.platform', fn: () => `Result: 'linux'` }
    ]
  },
  {
    name: 'random',
    icon: '🎲',
    color: 'rose',
    desc: 'Generate random numbers and sequences',
    examples: [
      { label: 'random.randint(1,100)', fn: () => `Result: ${Math.floor(Math.random()*100)+1}` },
      { label: 'random.choice(["a","b","c"])', fn: () => `Result: '${['a','b','c'][Math.floor(Math.random()*3)]}'` }
    ]
  },
  {
    name: 'datetime',
    icon: '📅',
    color: 'amber',
    desc: 'Date and time manipulation',
    examples: [
      { label: 'datetime.now()', fn: () => `Result: ${new Date().toISOString().replace('T',' ').substring(0,19)}` },
      { label: 'date.today()', fn: () => `Result: ${new Date().toISOString().substring(0,10)}` }
    ]
  },
  {
    name: 'json',
    icon: '{}',
    color: 'teal',
    desc: 'JSON encode/decode for data interchange',
    examples: [
      { label: 'json.dumps({"a":1})', fn: () => `Result: '{"a": 1}'` },
      { label: 'json.loads(\'{"x":5}\')', fn: () => `Result: {'x': 5}` }
    ]
  },
  {
    name: 're',
    icon: '.*',
    color: 'orange',
    desc: 'Regular expressions for pattern matching',
    examples: [
      { label: 're.findall(r"\\d+", "a1b2c3")', fn: () => `Result: ['1', '2', '3']` },
      { label: 're.match(r"[A-Z]", "Hello")', fn: () => `Result: <Match 'H'>` }
    ]
  },
  {
    name: 'itertools',
    icon: '🔄',
    color: 'indigo',
    desc: 'Efficient iterators for combinatorics & more',
    examples: [
      { label: 'list(permutations([1,2,3]))', fn: () => `Result: 6 permutations` },
      { label: 'list(chain([1,2],[3,4]))', fn: () => `Result: [1, 2, 3, 4]` }
    ]
  }
];

// ─── Example Steps ────────────────────────────────────────────────────────────
const EXAMPLES = [
  {
    id: 'import-math',
    label: 'import math',
    code: `# Example 1: Importing the standard 'math' module
import math

# Access constants and functions via dot notation
print(math.pi)          # 3.141592653589793
print(math.e)           # 2.718281828459045
print(math.sqrt(16))    # 4.0
print(math.factorial(5))# 120
print(math.ceil(4.3))   # 5
print(math.floor(4.9))  # 4`,
    steps: [
      { line: 2, label: 'import', desc: 'Python searches sys.path for a module named "math"' },
      { line: 5, label: 'constant', desc: 'math.pi gives you the π constant (3.14159...)' },
      { line: 6, label: 'constant', desc: 'math.e gives you Euler\'s number' },
      { line: 7, label: 'function', desc: 'math.sqrt(16) calls the C-level sqrt implementation' },
      { line: 8, label: 'function', desc: 'math.factorial(5) = 5! = 120' },
    ]
  },
  {
    id: 'from-datetime',
    label: 'from datetime import',
    code: `# Example 2: Selective import and aliasing
from datetime import datetime, timedelta, date

# 'from X import Y' puts Y directly in local scope
now = datetime.now()
print(f"Now: {now}")

# timedelta for date arithmetic
tomorrow = date.today() + timedelta(days=1)
print(f"Tomorrow: {tomorrow}")

# Aliasing with 'as'
from datetime import datetime as dt
shortcut = dt.now().strftime("%H:%M:%S")
print(f"Time: {shortcut}")`,
    steps: [
      { line: 2, label: 'from import', desc: '"from datetime import datetime" imports only the class you need' },
      { line: 5, label: 'use', desc: 'No "datetime.datetime" prefix needed — just "datetime"' },
      { line: 9, label: 'arithmetic', desc: 'timedelta lets you add/subtract time intervals' },
      { line: 13, label: 'alias', desc: '"as dt" renames datetime to dt in this scope' },
    ]
  },
  {
    id: 'custom-module',
    label: 'Custom module',
    code: `# Example 3: Creating & importing from your own module
# File: utils/math_ops.py  (you created this!)

# In main.py:
from utils.math_ops import add, multiply, power

# Using your own functions just like any library
result  = add(10, 5)        # 15
product = multiply(3, 7)    # 21
squared = power(4, 2)       # 16

print(f"add(10, 5)      = {result}")
print(f"multiply(3, 7)  = {product}")
print(f"power(4, 2)     = {squared}")

# You can also import the whole module:
import utils.math_ops as mo
print(mo.is_even(10))       # True`,
    steps: [
      { line: 5, label: 'from import', desc: 'Python walks the filesystem: project/ → utils/ → math_ops.py' },
      { line: 8, label: 'call', desc: 'add(10, 5) calls YOUR function defined in math_ops.py' },
      { line: 9, label: 'call', desc: 'multiply(3, 7) — your module works exactly like a library!' },
      { line: 16, label: 'alias', desc: '"import utils.math_ops as mo" gives a short alias' },
    ]
  }
];

// ─── Colour helpers ───────────────────────────────────────────────────────────
const COLOR_MAP = {
  cyan:    { bg: 'bg-cyan-900/40',    border: 'border-cyan-500/40',    text: 'text-cyan-300',    glow: 'shadow-cyan-500/30' },
  emerald: { bg: 'bg-emerald-900/40', border: 'border-emerald-500/40', text: 'text-emerald-300', glow: 'shadow-emerald-500/30' },
  violet:  { bg: 'bg-violet-900/40',  border: 'border-violet-500/40',  text: 'text-violet-300',  glow: 'shadow-violet-500/30' },
  rose:    { bg: 'bg-rose-900/40',    border: 'border-rose-500/40',    text: 'text-rose-300',    glow: 'shadow-rose-500/30' },
  amber:   { bg: 'bg-amber-900/40',   border: 'border-amber-500/40',   text: 'text-amber-300',   glow: 'shadow-amber-500/30' },
  teal:    { bg: 'bg-teal-900/40',    border: 'border-teal-500/40',    text: 'text-teal-300',    glow: 'shadow-teal-500/30' },
  orange:  { bg: 'bg-orange-900/40',  border: 'border-orange-500/40',  text: 'text-orange-300',  glow: 'shadow-orange-500/30' },
  indigo:  { bg: 'bg-indigo-900/40',  border: 'border-indigo-500/40',  text: 'text-indigo-300',  glow: 'shadow-indigo-500/30' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TreeNode({ node, depth, selectedFile, setSelectedFile, animatingImport }) {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === 'folder';
  const isSelected = selectedFile === node.id;
  const isAnimating = animatingImport && node.imports && node.imports.length > 0 && isSelected;

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div
        className={`flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer transition-all duration-200
          ${isSelected ? 'bg-cyan-500/20 border border-cyan-500/40' : 'hover:bg-white/5'}
          ${isAnimating ? 'shadow-lg shadow-cyan-400/40 ring-1 ring-cyan-400/60' : ''}
        `}
        onClick={() => {
          if (isFolder) setOpen(o => !o);
          else setSelectedFile(node.id);
        }}
      >
        {isFolder ? (
          <>
            {open ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
            <Folder size={14} className={node.isPackage ? 'text-violet-400' : 'text-amber-400'} />
            <span className={`text-xs font-mono ${node.isPackage ? 'text-violet-300' : 'text-amber-300'}`}>
              {node.name}
            </span>
            {node.isPackage && (
              <span className="ml-1 text-xs bg-violet-500/20 text-violet-400 px-1 rounded border border-violet-500/30">pkg</span>
            )}
          </>
        ) : (
          <>
            <span className="w-3" />
            <FileCode size={14} className={isSelected ? 'text-cyan-400' : 'text-emerald-400'} />
            <span className={`text-xs font-mono ${isSelected ? 'text-cyan-300' : 'text-emerald-300'}`}>
              {node.name}
            </span>
            {node.name === '__init__.py' && (
              <span className="ml-1 text-xs bg-emerald-500/20 text-emerald-400 px-1 rounded border border-emerald-500/30">init</span>
            )}
          </>
        )}
      </div>
      {isFolder && open && node.children && node.children.map(child => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          animatingImport={animatingImport}
        />
      ))}
    </div>
  );
}

function findNode(tree, id) {
  if (tree.id === id) return tree;
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

function FileSystemPanel({ animatingImport, setAnimatingImport }) {
  const [selectedFile, setSelectedFile] = useState('main');

  const selectedNode = findNode(FILE_TREE, selectedFile);

  return (
    <div className="flex gap-3 h-full">
      {/* Tree */}
      <div className="w-48 shrink-0 bg-[#0d1526] border border-white/10 rounded-xl p-3 overflow-auto">
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-semibold uppercase tracking-widest">
          <Folder size={12} /> File Tree
        </div>
        <TreeNode
          node={FILE_TREE}
          depth={0}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          animatingImport={animatingImport}
        />
      </div>

      {/* File content */}
      <div className="flex-1 bg-[#0b101b] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1526] border-b border-white/10">
          <FileCode size={14} className="text-cyan-400" />
          <span className="text-xs font-mono text-cyan-300">
            {selectedNode?.name || 'Select a file'}
          </span>
          {animatingImport && (
            <span className="ml-auto text-xs text-cyan-400 animate-pulse flex items-center gap-1">
              <Zap size={10} /> Import traversal active
            </span>
          )}
        </div>
        <pre className="flex-1 p-4 text-xs font-mono text-gray-300 overflow-auto leading-relaxed whitespace-pre">
          {selectedNode?.content || '# Select a .py file to view its contents'}
        </pre>
      </div>
    </div>
  );
}

// ─── Import Builder ───────────────────────────────────────────────────────────
function ImportBuilderPanel({ onAnimate }) {
  const [style, setStyle] = useState('import');
  const [module, setModule] = useState('math');
  const [symbol, setSymbol] = useState('sqrt');
  const [alias, setAlias] = useState('sq');
  const [executed, setExecuted] = useState(false);
  const [outputLine, setOutputLine] = useState('');

  const moduleOptions = ['math', 'os', 'sys', 'random', 'datetime', 'json', 'utils', 'utils.math_ops', 'utils.string_ops'];
  const symbolMap = {
    math: ['sqrt', 'pi', 'factorial', 'ceil', 'floor'],
    os: ['getcwd', 'listdir', 'path', 'environ'],
    sys: ['argv', 'path', 'version', 'platform'],
    random: ['randint', 'choice', 'shuffle', 'random'],
    datetime: ['datetime', 'date', 'timedelta'],
    json: ['dumps', 'loads'],
    utils: ['add', 'multiply', 'greet'],
    'utils.math_ops': ['add', 'multiply', 'power', 'is_even'],
    'utils.string_ops': ['greet', 'shout', 'snake_to_camel'],
  };
  const symbols = symbolMap[module] || ['symbol'];

  const generatedStatement = (() => {
    if (style === 'import') return `import ${module}`;
    if (style === 'from_import') return `from ${module} import ${symbol}`;
    if (style === 'from_import_as') return `from ${module} import ${symbol} as ${alias}`;
    return '';
  })();

  const handleExecute = () => {
    setExecuted(true);
    onAnimate(true);
    const outputs = {
      'import': `✓ Module '${module}' bound to name '${module}' in local scope`,
      'from_import': `✓ Name '${symbol}' imported from '${module}' into local scope`,
      'from_import_as': `✓ Name '${symbol}' from '${module}' bound as '${alias}'`,
    };
    setOutputLine(outputs[style] || '');
    setTimeout(() => { onAnimate(false); }, 2500);
  };

  return (
    <div className="bg-[#0d1526] border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Code2 size={16} className="text-emerald-400" />
        <h3 className="text-sm font-semibold text-white">Import Statement Builder</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Style picker */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Import style</label>
          <select
            className="w-full bg-[#0b101b] border border-white/10 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/60"
            value={style}
            onChange={e => { setStyle(e.target.value); setExecuted(false); }}
          >
            <option value="import">import X</option>
            <option value="from_import">from X import Y</option>
            <option value="from_import_as">from X import Y as Z</option>
          </select>
        </div>

        {/* Module picker */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Module</label>
          <select
            className="w-full bg-[#0b101b] border border-white/10 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/60"
            value={module}
            onChange={e => { setModule(e.target.value); setExecuted(false); }}
          >
            {moduleOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Symbol (if from import) */}
        {(style === 'from_import' || style === 'from_import_as') && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">Symbol (Y)</label>
            <select
              className="w-full bg-[#0b101b] border border-white/10 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/60"
              value={symbol}
              onChange={e => { setSymbol(e.target.value); setExecuted(false); }}
            >
              {symbols.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {/* Alias (if as) */}
        {style === 'from_import_as' && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">Alias (Z)</label>
            <input
              className="w-full bg-[#0b101b] border border-white/10 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/60"
              value={alias}
              onChange={e => { setAlias(e.target.value); setExecuted(false); }}
              placeholder="alias"
            />
          </div>
        )}
      </div>

      {/* Live preview */}
      <div className="bg-[#0b101b] border border-cyan-500/30 rounded-lg px-4 py-3 mb-4 font-mono text-sm text-cyan-300">
        <span className="text-violet-400">→ </span>{generatedStatement}
      </div>

      <button
        onClick={handleExecute}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20"
      >
        <Play size={12} /> Execute Import
      </button>

      {executed && outputLine && (
        <div className="mt-3 bg-emerald-900/30 border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={12} /> {outputLine}
        </div>
      )}
    </div>
  );
}

// ─── Standard Library Grid ────────────────────────────────────────────────────
function StdLibCard({ mod }) {
  const [result, setResult] = useState(null);
  const [activeEx, setActiveEx] = useState(null);
  const c = COLOR_MAP[mod.color] || COLOR_MAP.cyan;

  const run = (ex, idx) => {
    setActiveEx(idx);
    setResult(ex.fn());
  };

  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-lg hover:${c.glow} transition-all duration-300`}>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-mono ${c.text} w-7 text-center`}>{mod.icon}</span>
        <span className={`font-mono text-sm font-bold ${c.text}`}>{mod.name}</span>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">{mod.desc}</p>
      <div className="flex flex-col gap-1 mt-1">
        {mod.examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => run(ex, i)}
            className={`text-left text-xs font-mono px-2 py-1 rounded transition-all duration-150
              ${activeEx === i ? `${c.bg} ${c.border} border ${c.text}` : 'bg-white/5 hover:bg-white/10 text-gray-300'}
            `}
          >
            {ex.label}
          </button>
        ))}
      </div>
      {result && (
        <div className={`mt-1 text-xs font-mono ${c.text} bg-black/30 rounded px-2 py-1 border ${c.border} truncate`}>
          {result}
        </div>
      )}
    </div>
  );
}

function StdLibPanel() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={16} className="text-cyan-400" />
        <h3 className="text-sm font-semibold text-white">Standard Library Showcase</h3>
        <span className="ml-auto text-xs text-gray-500">Click any example to run it live</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STD_LIB_MODULES.map(mod => <StdLibCard key={mod.name} mod={mod} />)}
      </div>
    </div>
  );
}

// ─── pip Panel ────────────────────────────────────────────────────────────────
function PipPanel() {
  const [pkg, setPkg] = useState('numpy');
  const [phase, setPhase] = useState('idle'); // idle | resolving | downloading | installing | done
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const popularPkgs = ['numpy', 'pandas', 'requests', 'flask', 'django', 'matplotlib', 'scikit-learn', 'fastapi', 'pillow'];

  const simulateInstall = () => {
    if (phase !== 'idle' && phase !== 'done') return;
    setPhase('resolving');
    setProgress(0);
    const phases = [
      { name: 'resolving', dur: 800, end: 20 },
      { name: 'downloading', dur: 1200, end: 65 },
      { name: 'installing', dur: 900, end: 90 },
      { name: 'done', dur: 400, end: 100 },
    ];
    let i = 0;
    const run = () => {
      if (i >= phases.length) return;
      const p = phases[i];
      setPhase(p.name);
      const start = i === 0 ? 0 : phases[i - 1].end;
      const steps = 10;
      let s = 0;
      const interval = setInterval(() => {
        s++;
        setProgress(Math.round(start + (p.end - start) * (s / steps)));
        if (s >= steps) {
          clearInterval(interval);
          i++;
          if (i < phases.length) setTimeout(run, 100);
        }
      }, p.dur / steps);
    };
    run();
  };

  const reset = () => { setPhase('idle'); setProgress(0); };

  const phaseColors = {
    idle: 'text-gray-400',
    resolving: 'text-amber-400',
    downloading: 'text-cyan-400',
    installing: 'text-violet-400',
    done: 'text-emerald-400',
  };

  const steps = [
    { key: 'pypi', label: 'PyPI', icon: Globe, desc: 'Python Package Index', active: ['resolving','downloading','installing','done'] },
    { key: 'download', label: 'pip download', icon: Download, desc: 'Fetches the wheel/tarball', active: ['downloading','installing','done'] },
    { key: 'site', label: 'site-packages', icon: Database, desc: 'Installed in virtualenv', active: ['installing','done'] },
  ];

  return (
    <div className="bg-[#0d1526] border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Package size={16} className="text-violet-400" />
        <h3 className="text-sm font-semibold text-white">pip Universe</h3>
        <span className="text-xs text-gray-500 ml-2">Simulate package installation</span>
      </div>

      {/* Flow diagram */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = step.active.includes(phase);
          return (
            <React.Fragment key={step.key}>
              <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all duration-500
                ${isActive ? 'border-violet-500/50 bg-violet-900/30 shadow-lg shadow-violet-500/20' : 'border-white/10 bg-white/5'}
              `}>
                <Icon size={20} className={isActive ? 'text-violet-300' : 'text-gray-500'} />
                <span className={`text-xs font-semibold ${isActive ? 'text-violet-300' : 'text-gray-500'}`}>{step.label}</span>
                <span className="text-xs text-gray-500 text-center max-w-20">{step.desc}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight size={20} className={`transition-all duration-500 ${step.active.includes(phase) ? 'text-violet-400 animate-pulse' : 'text-gray-600'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Command line */}
      <div className="bg-[#0b101b] border border-white/10 rounded-lg px-4 py-3 mb-4 font-mono text-sm flex items-center gap-2">
        <span className="text-emerald-400">$</span>
        <span className="text-gray-400">pip install</span>
        <span className="text-cyan-300">{pkg}</span>
      </div>

      {/* Package input */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            className="w-full bg-[#0b101b] border border-white/10 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500/60 font-mono"
            value={pkg}
            onChange={e => { setPkg(e.target.value); reset(); }}
            placeholder="package-name"
          />
        </div>
        <button
          onClick={simulateInstall}
          disabled={phase !== 'idle' && phase !== 'done'}
          className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
        >
          <Download size={12} /> Install
        </button>
        <button onClick={reset} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400">
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Popular packages */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {popularPkgs.map(p => (
          <button
            key={p}
            onClick={() => { setPkg(p); reset(); }}
            className={`text-xs px-2 py-0.5 rounded border transition-all ${pkg === p ? 'border-violet-500/60 bg-violet-900/30 text-violet-300' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {phase !== 'idle' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold ${phaseColors[phase]}`}>
              {phase === 'done' ? '✓ Installed successfully' : `${phase}…`}
            </span>
            <span className="text-xs text-gray-400">{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                phase === 'done' ? 'bg-emerald-500' :
                phase === 'installing' ? 'bg-violet-500' :
                phase === 'downloading' ? 'bg-cyan-500' : 'bg-amber-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {phase === 'done' && (
            <div className="mt-3 bg-emerald-900/30 border border-emerald-500/30 rounded-lg px-3 py-2 font-mono text-xs text-emerald-300">
              Successfully installed {pkg}-latest<br />
              <span className="text-gray-500">Location: /usr/local/lib/python3.12/site-packages/{pkg}/</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Challenges ───────────────────────────────────────────────────────────────
const CHALLENGES = [
  {
    code: `from math import sqrt\nresult = sqrt(25)\nprint(result)`,
    question: 'What does "from math import sqrt" put in scope?',
    options: ['Only the sqrt function', 'The entire math module', 'A module called sqrt', 'Nothing — it fails'],
    answer: 0,
    explanation: '"from X import Y" imports only Y into the local namespace, so you can call sqrt() without the math. prefix.'
  },
  {
    code: `import datetime as dt\nnow = dt.datetime.now()`,
    question: 'After "import datetime as dt", how do you access datetime.now()?',
    options: ['dt.datetime.now()', 'datetime.now()', 'dt.now()', 'as.now()'],
    answer: 0,
    explanation: '"as dt" aliases the module, so you still need to navigate into it: dt.datetime.now().'
  },
  {
    code: `# utils/\n#   __init__.py\n#   math_ops.py`,
    question: 'What makes "utils" a Python package (not just a folder)?',
    options: ['The __init__.py file', 'The folder name ending in /', 'Having .py files inside', 'A setup.py in the parent'],
    answer: 0,
    explanation: 'A folder becomes a Python package when it contains an __init__.py file, which runs on import.'
  },
  {
    code: `pip install requests`,
    question: 'Where does pip install packages by default?',
    options: ['site-packages directory', 'The current folder', 'C:/Python', '/usr/bin'],
    answer: 0,
    explanation: 'pip installs into the Python interpreter\'s site-packages directory (or venv/lib/site-packages in a venv).'
  },
];

function QuizPanel() {
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = CHALLENGES[qi];

  const submit = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (qi + 1 >= CHALLENGES.length) { setDone(true); return; }
    setQi(qi + 1);
    setSelected(null);
  };

  const restart = () => { setQi(0); setSelected(null); setScore(0); setDone(false); };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <Sparkles size={40} className="text-cyan-400" />
        <div className="text-2xl font-bold text-white">{score} / {CHALLENGES.length}</div>
        <div className="text-gray-400 text-sm">{score === CHALLENGES.length ? '🎉 Perfect score!' : score >= 2 ? '👍 Good job!' : '💡 Keep studying!'}</div>
        <button onClick={restart} className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-all">
          <RotateCcw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-white">Quiz</span>
        </div>
        <span className="text-xs text-gray-400">Q{qi + 1}/{CHALLENGES.length} • Score: {score}</span>
      </div>

      {/* Code */}
      <div className="bg-[#0b101b] border border-white/10 rounded-lg px-4 py-3 font-mono text-xs text-gray-300 mb-4 whitespace-pre">
        {q.code}
      </div>

      <p className="text-sm text-white mb-3">{q.question}</p>

      <div className="flex flex-col gap-2 mb-4">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isSelected = i === selected;
          const revealed = selected !== null;
          return (
            <button
              key={i}
              onClick={() => submit(i)}
              className={`text-left text-xs px-4 py-3 rounded-lg border transition-all duration-200 font-mono
                ${!revealed ? 'border-white/10 bg-white/5 hover:border-cyan-500/40 hover:bg-cyan-900/20 text-gray-300' :
                  isCorrect ? 'border-emerald-500/60 bg-emerald-900/30 text-emerald-300' :
                  isSelected ? 'border-rose-500/60 bg-rose-900/30 text-rose-300' :
                  'border-white/10 bg-white/5 text-gray-500'}
              `}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className={`text-xs rounded-lg px-3 py-2 mb-4 border ${selected === q.answer ? 'border-emerald-500/30 bg-emerald-900/20 text-emerald-300' : 'border-rose-500/30 bg-rose-900/20 text-rose-300'}`}>
          <Info size={12} className="inline mr-1" />{q.explanation}
        </div>
      )}

      {selected !== null && (
        <button
          onClick={next}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs rounded-lg transition-all"
        >
          {qi + 1 >= CHALLENGES.length ? 'See results' : 'Next question'} <SkipForward size={12} />
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'filesystem', label: 'File Tree', icon: Folder },
  { id: 'stdlib', label: 'Std Library', icon: BookOpen },
  { id: 'pip', label: 'pip & PyPI', icon: Package },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
];

export default function ModulesPackagesVisualizer() {
  const [activeTab, setActiveTab] = useState('filesystem');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [animatingImport, setAnimatingImport] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState('normal');

  const speedMs = { slow: 1500, normal: 800, fast: 300 };

  const example = EXAMPLES[exampleIdx];
  const step = example.steps[stepIdx] ?? example.steps[0];
  const totalSteps = example.steps.length;

  const runCode = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }
    if (stepIdx >= totalSteps - 1) {
      setStepIdx(0);
    }
    setIsRunning(true);
  };

  const stepForward = () => {
    setIsRunning(false);
    setStepIdx(i => Math.min(i + 1, totalSteps - 1));
  };

  const resetExecution = () => {
    setIsRunning(false);
    setStepIdx(0);
  };

  useEffect(() => {
    let t;
    if (isRunning) {
      t = setTimeout(() => {
        if (stepIdx < totalSteps - 1) {
          setStepIdx(i => i + 1);
        } else {
          setIsRunning(false);
        }
      }, speedMs[speed]);
    }
    return () => clearTimeout(t);
  }, [isRunning, stepIdx, speed, totalSteps]);

  const transitionInfo = getStepTransitionInfo(example.steps, stepIdx);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── 1. Top Bar: Header & Example Presets ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-none">
                Modules, Packages &amp; pip Package Manager
              </h2>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold bg-cyan-50 border border-cyan-200 text-cyan-700 px-2 py-0.5 rounded-full">import</span>
            <span className="text-[10px] font-bold bg-violet-50 border border-violet-200 text-violet-700 px-2 py-0.5 rounded-full">packages</span>
            <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">pip install</span>
          </div>
        </div>

        {/* Example selector pills */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 flex-wrap">
          {EXAMPLES.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => { setExampleIdx(i); setStepIdx(0); setIsRunning(false); }}
              className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer
                ${exampleIdx === i
                  ? 'border-cyan-500 bg-cyan-600 text-white shadow-xs'
                  : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}
              `}
            >
              {i + 1}. {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. Main Two-Column View ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT: Code Editor */}
        <div className="lg:col-span-5 space-y-4">
          <InteractiveEditorWithArrow
            code={example.code}
            setCode={() => {}}
            currentLineNum={step.line}
            transitionInfo={transitionInfo}
            isRunning={isRunning}
            runCode={runCode}
            stepForward={stepForward}
            resetExecution={resetExecution}
            speed={speed}
            setSpeed={setSpeed}
            statusText={`${step.label} — ${step.desc}`}
            stepCounterText={`Step ${stepIdx + 1}/${totalSteps}`}
            terminalLines={[]}
            badgeText="Module Runner"
            fileName="main.py"
            accentColor="#06b6d4"
          />

          {/* Step info pill */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Zap size={13} className="text-cyan-600" />
                <span>Line {step.line}: {step.label}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Step {stepIdx + 1} of {totalSteps}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
          </div>
        </div>

        {/* RIGHT: Visualizer Panels */}
        <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
          {/* Sub-tab Navigation */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 flex-1 justify-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
                    ${activeTab === tab.id
                      ? 'bg-white text-cyan-800 shadow-xs border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}
                  `}
                >
                  <Icon size={13} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sub-tab Content Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-h-64">
            {activeTab === 'filesystem' && (
              <div className="space-y-5">
                <div style={{ height: 300 }}>
                  <FileSystemPanel animatingImport={animatingImport} setAnimatingImport={setAnimatingImport} />
                </div>
                <ImportBuilderPanel onAnimate={setAnimatingImport} />
              </div>
            )}
            {activeTab === 'stdlib' && <StdLibPanel />}
            {activeTab === 'pip' && <PipPanel />}
            {activeTab === 'quiz' && (
              <div className="p-2">
                <QuizPanel />
              </div>
            )}
          </div>

          {/* Concept Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: FileCode, title: 'Modules', body: 'Any .py file is a module. import it to reuse code across files. Python resolves modules via sys.path.' },
              { icon: Layers, title: 'Packages', body: 'A directory containing __init__.py is a package. __init__.py runs on import and controls export surface.' },
              { icon: Package, title: 'pip & PyPI', body: 'pip install <name> fetches packages from pypi.org and puts them in site-packages for global access.' },
            ].map(card => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon size={14} className="text-cyan-600" />
                    <span className="text-xs font-bold text-slate-800">{card.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{card.body}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
