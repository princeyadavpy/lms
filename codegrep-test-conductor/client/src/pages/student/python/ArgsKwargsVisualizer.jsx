import React, { useState, useEffect, useRef, useCallback } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from './InteractiveEditorWithArrow';
import {
  Play, RotateCcw, SkipForward, ChevronRight,
  Package, Hash, Settings, AlertCircle, CheckCircle2,
  ArrowDown, ArrowRight, Zap, Layers, Code2, Info, Sparkles
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 1.  COLOUR LEGEND DATA
// ─────────────────────────────────────────────────────────────────────────────
const ARG_TYPES = [
  {
    type: 'positional',
    label: 'Positional',
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    syntax: 'def f(a, b)',
    desc: 'Matched in order from left to right.',
  },
  {
    type: 'default',
    label: 'Default',
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    syntax: 'def f(c=0)',
    desc: 'Fallback value used when omitted by caller.',
  },
  {
    type: 'args',
    label: '*args',
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    syntax: 'def f(*args)',
    desc: 'Packs arbitrary positional arguments into a tuple.',
  },
  {
    type: 'kwargs',
    label: '**kwargs',
    color: '#ef4444',
    bg: '#fef2f2',
    border: '#fecaca',
    syntax: 'def f(**kwargs)',
    desc: 'Packs arbitrary keyword arguments into a dict.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2.  CODE EXAMPLES  (Synchronous single-unit execution)
// ─────────────────────────────────────────────────────────────────────────────
const EXAMPLES = [
  {
    id: 'positional-default',
    label: 'Positional + Defaults',
    icon: Hash,
    accentColor: '#3b82f6',
    code: `def add(a, b, c=0):
    result = a + b + c
    return result

x = add(3, 4)
y = add(3, 4, 5)
print("x =", x)
print("y =", y)`,
    steps: [
      { lineNum: 1, vars: {}, output: [], callInfo: null, detail: 'Define add(a, b, c=0). "c" has fallback default value 0.' },
      { lineNum: 5, vars: {}, output: [], callInfo: { call: 'add(3, 4)', a: 3, b: 4, c: '0 (default applied)' }, detail: 'Calling add(3, 4) — a=3, b=4. Since c is omitted, default 0 is assigned.' },
      { lineNum: 2, vars: { a: 3, b: 4, c: 0 }, output: [], callInfo: { call: 'add(3, 4)', a: 3, b: 4, c: '0 (default)' }, detail: 'Inside body: result = 3 + 4 + 0 = 7' },
      { lineNum: 3, vars: { a: 3, b: 4, c: 0, result: 7 }, output: [], callInfo: { call: 'add(3, 4)', returning: 7 }, detail: 'Return 7 back to caller.' },
      { lineNum: 5, vars: { x: 7 }, output: [], callInfo: null, detail: 'Variable x receives return value 7.' },
      { lineNum: 6, vars: { x: 7 }, output: [], callInfo: { call: 'add(3, 4, 5)', a: 3, b: 4, c: '5 (positional override)' }, detail: 'Calling add(3, 4, 5) — a=3, b=4, c=5. Third argument overrides default.' },
      { lineNum: 2, vars: { a: 3, b: 4, c: 5 }, output: [], callInfo: { call: 'add(3, 4, 5)', a: 3, b: 4, c: 5 }, detail: 'Inside body: result = 3 + 4 + 5 = 12' },
      { lineNum: 3, vars: { a: 3, b: 4, c: 5, result: 12 }, output: [], callInfo: { call: 'add(3, 4, 5)', returning: 12 }, detail: 'Return 12 back to caller.' },
      { lineNum: 6, vars: { x: 7, y: 12 }, output: [], callInfo: null, detail: 'Variable y receives return value 12.' },
      { lineNum: 7, vars: { x: 7, y: 12 }, output: ['x = 7'], callInfo: null, detail: 'print("x =", x) outputs "x = 7".' },
      { lineNum: 8, vars: { x: 7, y: 12 }, output: ['x = 7', 'y = 12'], callInfo: null, detail: 'print("y =", y) outputs "y = 12".' },
    ],
  },
  {
    id: 'args',
    label: '*args (Tuple Packing)',
    icon: Package,
    accentColor: '#f59e0b',
    code: `def tag(*args):
    result = []
    for item in args:
        result.append(item)
    return tuple(result)

tags = tag("python", "code", "fun")
print("Tags:", tags)`,
    steps: [
      { lineNum: 1, vars: {}, output: [], packedArgs: [], detail: 'Define tag(*args). Asterisk * indicates arbitrary positional args pack into a tuple.' },
      { lineNum: 7, vars: {}, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'Calling tag("python", "code", "fun") with 3 positional arguments.' },
      { lineNum: 2, vars: { args: "('python', 'code', 'fun')" }, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'Inside tag(): Python automatically packs all 3 args into args = ("python", "code", "fun").' },
      { lineNum: 3, vars: { args: "('python', 'code', 'fun')", result: '[]' }, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'Loop over packed tuple: 1st iteration item = "python"' },
      { lineNum: 4, vars: { args: "('python', 'code', 'fun')", result: '["python"]', item: '"python"' }, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'result.append("python")' },
      { lineNum: 3, vars: { args: "('python', 'code', 'fun')", result: '["python"]' }, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'Loop over packed tuple: 2nd iteration item = "code"' },
      { lineNum: 4, vars: { args: "('python', 'code', 'fun')", result: '["python", "code"]', item: '"code"' }, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'result.append("code")' },
      { lineNum: 3, vars: { args: "('python', 'code', 'fun')", result: '["python", "code"]' }, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'Loop over packed tuple: 3rd iteration item = "fun"' },
      { lineNum: 4, vars: { args: "('python', 'code', 'fun')", result: '["python", "code", "fun"]', item: '"fun"' }, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'result.append("fun")' },
      { lineNum: 5, vars: { args: "('python', 'code', 'fun')", result: '["python", "code", "fun"]' }, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'Return tuple(result).' },
      { lineNum: 7, vars: { tags: "('python', 'code', 'fun')" }, output: [], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'tags assigned the packed tuple.' },
      { lineNum: 8, vars: { tags: "('python', 'code', 'fun')" }, output: ["Tags: ('python', 'code', 'fun')"], packedArgs: ['"python"', '"code"', '"fun"'], detail: 'print("Tags:", tags) sends output to terminal.' },
    ],
  },
  {
    id: 'kwargs',
    label: '**kwargs (Dict Packing)',
    icon: Settings,
    accentColor: '#ef4444',
    code: `def config(**kwargs):
    for key, val in kwargs.items():
        print(f"{key} = {val}")

config(host="localhost", port=8080, debug=True)`,
    steps: [
      { lineNum: 1, vars: {}, output: [], packedKwargs: {}, detail: 'Define config(**kwargs). Double asterisk ** packs arbitrary keyword arguments into a dictionary.' },
      { lineNum: 5, vars: {}, output: [], packedKwargs: { host: '"localhost"', port: '8080', debug: 'True' }, detail: 'Calling config(host="localhost", port=8080, debug=True).' },
      { lineNum: 2, vars: { kwargs: '{host: "localhost", port: 8080, debug: True}' }, output: [], packedKwargs: { host: '"localhost"', port: '8080', debug: 'True' }, detail: 'Python packs keyword args into dictionary: kwargs = {"host": "localhost", "port": 8080, "debug": True}.' },
      { lineNum: 3, vars: { kwargs: '{...}', key: '"host"', val: '"localhost"' }, output: ['host = localhost'], packedKwargs: { host: '"localhost"', port: '8080', debug: 'True' }, detail: 'Iteration 1: key="host", val="localhost" printed.' },
      { lineNum: 2, vars: { kwargs: '{...}', key: '"port"', val: '8080' }, output: ['host = localhost'], packedKwargs: { host: '"localhost"', port: '8080', debug: 'True' }, detail: 'Iteration 2: key="port", val=8080.' },
      { lineNum: 3, vars: { kwargs: '{...}', key: '"port"', val: '8080' }, output: ['host = localhost', 'port = 8080'], packedKwargs: { host: '"localhost"', port: '8080', debug: 'True' }, detail: 'Print "port = 8080".' },
      { lineNum: 2, vars: { kwargs: '{...}', key: '"debug"', val: 'True' }, output: ['host = localhost', 'port = 8080'], packedKwargs: { host: '"localhost"', port: '8080', debug: 'True' }, detail: 'Iteration 3: key="debug", val=True.' },
      { lineNum: 3, vars: { kwargs: '{...}', key: '"debug"', val: 'True' }, output: ['host = localhost', 'port = 8080', 'debug = True'], packedKwargs: { host: '"localhost"', port: '8080', debug: 'True' }, detail: 'Print "debug = True".' },
    ],
  },
];

export default function ArgsKwargsVisualizer() {
  const [activeTab, setActiveTab] = useState(0);
  const example = EXAMPLES[activeTab];

  const [stepIdx, setStepIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const intervalRef = useRef(null);

  const speedMs = { slow: 1800, normal: 1000, fast: 400 };

  const steps = example.steps;
  const currentStep = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null;
  const transitionInfo = getStepTransitionInfo(steps, stepIdx);

  const changeTab = useCallback((i) => {
    clearInterval(intervalRef.current);
    setActiveTab(i);
    setStepIdx(-1);
    setIsRunning(false);
  }, []);

  const runCode = () => {
    setStepIdx(0);
    setIsRunning(true);
  };

  const stepForward = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setStepIdx(prev => Math.min(prev + 1, steps.length - 1));
  };

  const resetExecution = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setStepIdx(-1);
  };

  // Synchronous auto-run loop as a single unit
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setStepIdx(prev => {
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

  const statusText = stepIdx < 0
    ? 'Ready — press Run Code or Step Forward'
    : stepIdx >= steps.length - 1
    ? '✓ Execution complete'
    : `Step ${stepIdx + 1} / ${steps.length}`;
  const stepCounterText = stepIdx >= 0
    ? `Step ${stepIdx + 1} / ${steps.length}`
    : `Ready (0 / ${steps.length})`;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── 1. Top Bar: Header & Example Presets ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-none">
                Argument Types: *args, **kwargs &amp; Defaults
              </h2>
            </div>
          </div>
          {/* Argument Type Legend Pills */}
          <div className="flex flex-wrap gap-1.5">
            {ARG_TYPES.map(t => (
              <span
                key={t.type}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}` }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex gap-1.5 flex-wrap pt-2 border-t border-slate-100">
          {EXAMPLES.map((ex, i) => {
            const Icon = ex.icon;
            return (
              <button
                key={ex.id}
                onClick={() => changeTab(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === i
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <Icon size={13} />
                <span>{i + 1}. {ex.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT: Interactive Code Editor */}
        <div className="lg:col-span-5 space-y-4">
          <InteractiveEditorWithArrow
            code={example.code}
            setCode={() => {}}
            currentLineNum={currentStep?.lineNum ?? null}
            transitionInfo={transitionInfo}
            isRunning={isRunning}
            runCode={runCode}
            stepForward={stepForward}
            resetExecution={resetExecution}
            speed={speed}
            setSpeed={setSpeed}
            statusText={statusText}
            stepCounterText={stepCounterText}
            terminalLines={currentStep?.output ?? []}
            badgeText="Arguments Engine"
            fileName="args_kwargs.py"
            accentColor={example.accentColor}
          />

          {/* Active Step Explanation */}
          {currentStep && (
            <div className="rounded-xl p-3.5 border border-slate-200 text-xs text-slate-700 bg-white shadow-xs flex items-start gap-2.5">
              <Info size={14} className="mt-0.5 shrink-0" style={{ color: example.accentColor }} />
              <div>
                <div className="font-bold text-slate-900 mb-0.5">Line {currentStep.lineNum}</div>
                <div className="leading-relaxed">{currentStep.detail}</div>
              </div>
            </div>
          )}

          {/* Live Variables in Scope */}
          {currentStep && currentStep.vars && Object.keys(currentStep.vars).length > 0 && (
            <div className="rounded-xl p-3 bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Variables</div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(currentStep.vars).map(([k, v]) => (
                  <span key={k} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
                    <span className="text-blue-600 font-bold">{k}</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-emerald-700 font-semibold">{String(v)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Live Synchronous Argument Dispatch & Packing Visualizer */}
        <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto [scrollbar-width:thin]">
          
          {/* SCENARIO 1: Positional + Defaults Resolution */}
          {activeTab === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    <Hash className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Parameter Binding &amp; Default Fallback Inspector
                  </h3>
                </div>
              </div>

              {/* Function Signature Slot Visualizer */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Target Signature: <code className="text-slate-800 font-bold">add(a, b, c=0)</code>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-blue-200 text-center space-y-1">
                    <div className="text-[10px] uppercase font-bold text-blue-600">Param: a</div>
                    <div className="text-base font-mono font-bold text-slate-900">
                      {currentStep?.callInfo?.a ?? '—'}
                    </div>
                    <div className="text-[9px] text-slate-400">Required positional</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-blue-200 text-center space-y-1">
                    <div className="text-[10px] uppercase font-bold text-blue-600">Param: b</div>
                    <div className="text-base font-mono font-bold text-slate-900">
                      {currentStep?.callInfo?.b ?? '—'}
                    </div>
                    <div className="text-[9px] text-slate-400">Required positional</div>
                  </div>

                  <div className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                    currentStep?.callInfo?.c
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <div className="text-[10px] uppercase font-bold text-emerald-600">Param: c</div>
                    <div className="text-xs font-mono font-bold">
                      {currentStep?.callInfo?.c ?? '0 (default)'}
                    </div>
                    <div className="text-[9px] text-slate-500">Default = 0</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENARIO 2: *args Tuple Packing */}
          {activeTab === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    *args Arbitrary Tuple Packer
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  Tuple Container
                </span>
              </div>

              {/* Live Conveyor Belt into Tuple */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-white space-y-4">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Call Arguments: <code className="text-amber-300 font-bold">tag("python", "code", "fun")</code></span>
                  <span>*args Collector</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {['"python"', '"code"', '"fun"'].map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 bg-slate-900 border border-amber-400 text-amber-300 rounded-lg font-mono text-xs font-bold shadow-xs animate-bounce"
                      style={{ animationDelay: `${idx * 150}ms` }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center text-amber-400">
                  <ArrowDown size={18} className="animate-pulse" />
                </div>

                {/* Packed Tuple Box */}
                <div className="p-4 bg-amber-950/40 border-2 border-amber-400 rounded-xl text-center space-y-2">
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Packed Inside Function: <span className="font-mono">args = tuple</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-200 bg-slate-900/90 py-2 px-3 rounded-lg border border-amber-500/40 inline-block">
                    {`('python', 'code', 'fun')`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENARIO 3: **kwargs Dict Packing */}
          {activeTab === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    **kwargs Arbitrary Dictionary Packer
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                  Dictionary Container
                </span>
              </div>

              {/* Live Conveyor Belt into Dict */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-white space-y-4">
                <div className="text-xs text-slate-400 font-mono">
                  Incoming Keyword Arguments: <code className="text-rose-300 font-bold">config(host="localhost", port=8080, debug=True)</code>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: 'host', v: '"localhost"' },
                    { k: 'port', v: '8080' },
                    { k: 'debug', v: 'True' },
                  ].map((pair, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900 border border-rose-400 rounded-lg text-center font-mono text-xs">
                      <span className="text-rose-300 font-bold">{pair.k}</span>
                      <span className="text-slate-400"> = </span>
                      <span className="text-white">{pair.v}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center text-rose-400">
                  <ArrowDown size={18} className="animate-pulse" />
                </div>

                {/* Packed Dict Box */}
                <div className="p-4 bg-rose-950/40 border-2 border-rose-400 rounded-xl text-center space-y-2">
                  <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">
                    Packed Inside Function: <span className="font-mono">kwargs = dict</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-rose-200 bg-slate-900/90 py-2 px-3 rounded-lg border border-rose-500/40 inline-block">
                    {`{"host": "localhost", "port": 8080, "debug": True}`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Rules Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Python Argument Ordering Rule</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">1. Positional</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold">2. Defaults</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">3. *args</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-bold">4. **kwargs</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
