import React, { useState, useMemo } from 'react';
import DSAInteractiveVisualizer from '../dsa/DSAInteractiveVisualizer';
import {
    Binary, Cpu, Layers, Sparkles, Bot, Terminal, Database, Code2,
    Play, RotateCcw, Check, Plus, Trash2, ArrowRight, Zap, RefreshCw, Eye, Shield, Activity
} from 'lucide-react';

/* =========================================================================
   1. DSA VISUALIZER (Data Structures & Algorithms Workbench)
   ========================================================================= */
export const DSAVisualizer = (props) => {
    return <DSAInteractiveVisualizer {...props} />;
};

/* =========================================================================
   2. MACHINE LEARNING & PREDICTIVE MODELING VISUALIZER
   ========================================================================= */
export const MachineLearningVisualizer = () => {
    const [weights, setWeights] = useState(1.8);
    const [bias, setBias] = useState(2.5);
    const [lr, setLr] = useState(0.05);

    const points = useMemo(() => [
        { x: 1, y: 4.2 },
        { x: 2, y: 6.1 },
        { x: 3, y: 7.9 },
        { x: 4, y: 10.3 },
        { x: 5, y: 11.8 },
        { x: 6, y: 14.1 }
    ], []);

    const mse = useMemo(() => {
        const errorSum = points.reduce((acc, p) => {
            const pred = weights * p.x + bias;
            return acc + Math.pow(pred - p.y, 2);
        }, 0);
        return (errorSum / points.length).toFixed(3);
    }, [weights, bias, points]);

    const stepGradient = () => {
        let dw = 0;
        let db = 0;
        points.forEach(p => {
            const pred = weights * p.x + bias;
            const diff = pred - p.y;
            dw += (2 / points.length) * diff * p.x;
            db += (2 / points.length) * diff;
        });
        setWeights(prev => parseFloat((prev - lr * dw).toFixed(2)));
        setBias(prev => parseFloat((prev - lr * db).toFixed(2)));
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Cpu size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Gradient Descent &amp; Cost Function Playground</h3>
                        <p className="text-xs text-slate-500">Tune weight (w) and bias (b) parameters to minimize Mean Squared Error (MSE).</p>
                    </div>
                </div>
                <div className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
                    Loss (MSE): <span className="text-rose-600">{mse}</span>
                </div>
            </div>

            {/* 2D Coordinate Grid Visualizer */}
            <div className="p-6 rounded-2xl bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden h-64 font-mono">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Grid lines */}
                    <line x1="40" y1="170" x2="380" y2="170" stroke="#334155" strokeWidth="1.5" />
                    <line x1="40" y1="20" x2="40" y2="170" stroke="#334155" strokeWidth="1.5" />

                    {/* Data Points */}
                    {points.map((p, idx) => {
                        const cx = 40 + p.x * 50;
                        const cy = 170 - p.y * 10;
                        return (
                            <circle key={idx} cx={cx} cy={cy} r="5" fill="#38bdf8" />
                        );
                    })}

                    {/* Regression Line */}
                    {(() => {
                        const y1 = weights * 0.5 + bias;
                        const y2 = weights * 6.5 + bias;
                        const x1_coord = 40 + 0.5 * 50;
                        const y1_coord = 170 - y1 * 10;
                        const x2_coord = 40 + 6.5 * 50;
                        const y2_coord = 170 - y2 * 10;
                        return (
                            <line
                                x1={x1_coord}
                                y1={Math.max(20, Math.min(180, y1_coord))}
                                x2={x2_coord}
                                y2={Math.max(20, Math.min(180, y2_coord))}
                                stroke="#f43f5e"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        );
                    })()}
                </svg>

                <div className="absolute top-3 left-4 text-xs text-slate-400">
                    Hypothesis: <span className="text-emerald-400 font-bold">ŷ = {weights}x + {bias}</span>
                </div>
            </div>

            {/* Sliders and Gradient Step */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Weight (Slope w)</span>
                        <span className="font-mono text-slate-900">{weights}</span>
                    </div>
                    <input
                        type="range" min="0.5" max="3.5" step="0.05"
                        value={weights} onChange={e => setWeights(parseFloat(e.target.value))}
                        className="w-full accent-slate-900 cursor-pointer"
                    />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Bias (Intercept b)</span>
                        <span className="font-mono text-slate-900">{bias}</span>
                    </div>
                    <input
                        type="range" min="0.0" max="6.0" step="0.1"
                        value={bias} onChange={e => setBias(parseFloat(e.target.value))}
                        className="w-full accent-slate-900 cursor-pointer"
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        onClick={stepGradient}
                        className="w-full h-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Zap size={14} className="text-amber-400 fill-current" />
                        <span>Step 1 Epoch (SGD)</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

/* =========================================================================
   3. DEEP LEARNING & NEURAL NETWORKS VISUALIZER
   ========================================================================= */
export const DeepLearningVisualizer = () => {
    const [activation, setActivation] = useState('ReLU');
    const [hiddenLayers, setHiddenLayers] = useState(2);
    const [epoch, setEpoch] = useState(1);
    const [accuracy, setAccuracy] = useState(88.4);

    const handleForwardPass = () => {
        setEpoch(prev => prev + 1);
        setAccuracy(prev => Math.min(99.6, parseFloat((prev + Math.random() * 1.5).toFixed(1))));
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Layers size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Multi-Layer Perceptron (MLP) Architecture</h3>
                        <p className="text-xs text-slate-500">Inspect forward pass activations, layer dimensions, and classification probability.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                        Accuracy: <strong className="text-emerald-700">{accuracy}%</strong> | Epoch: <strong className="text-slate-900">{epoch}</strong>
                    </div>
                </div>
            </div>

            {/* Neural Network Diagram */}
            <div className="p-8 rounded-2xl bg-slate-950 text-white flex items-center justify-around relative min-h-[220px]">
                {/* Input Layer */}
                <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Input (3)</span>
                    <div className="space-y-3">
                        {['x₁', 'x₂', 'x₃'].map((n, i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xs font-bold font-mono text-sky-400 shadow-md">
                                {n}
                            </div>
                        ))}
                    </div>
                </div>

                <ArrowRight size={18} className="text-slate-600 animate-pulse" />

                {/* Hidden Layer 1 */}
                <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Hidden 1 ({activation})</span>
                    <div className="space-y-2.5">
                        {['h₁', 'h₂', 'h₃', 'h₄'].map((n, i) => (
                            <div key={i} className="w-9 h-9 rounded-full bg-indigo-950 border-2 border-indigo-500 flex items-center justify-center text-xs font-bold font-mono text-indigo-300">
                                {n}
                            </div>
                        ))}
                    </div>
                </div>

                {hiddenLayers >= 2 && (
                    <>
                        <ArrowRight size={18} className="text-slate-600 animate-pulse" />
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Hidden 2</span>
                            <div className="space-y-2.5">
                                {['h₅', 'h₆', 'h₇', 'h₈'].map((n, i) => (
                                    <div key={i} className="w-9 h-9 rounded-full bg-indigo-950 border-2 border-indigo-500 flex items-center justify-center text-xs font-bold font-mono text-indigo-300">
                                        {n}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <ArrowRight size={18} className="text-slate-600 animate-pulse" />

                {/* Output Layer */}
                <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Output (Softmax)</span>
                    <div className="space-y-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-xs font-bold font-mono text-emerald-400">
                            ŷ₁
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-xs font-bold font-mono text-slate-500">
                            ŷ₂
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Activation Function:</span>
                    {['ReLU', 'Sigmoid', 'GELU'].map(fn => (
                        <button
                            key={fn}
                            onClick={() => setActivation(fn)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                activation === fn ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                        >
                            {fn}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleForwardPass}
                    className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <Play size={12} className="fill-current" />
                    <span>Trigger Forward Propagation</span>
                </button>
            </div>
        </div>
    );
};

/* =========================================================================
   4. GENERATIVE AI & LLMS VISUALIZER
   ========================================================================= */
export const GenerativeAIVisualizer = () => {
    const [prompt, setPrompt] = useState('Artificial intelligence will revolutionize modern computing');
    const [temperature, setTemperature] = useState(0.7);

    const tokens = useMemo(() => {
        return prompt.split(/\s+/).filter(Boolean);
    }, [prompt]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Transformer Tokenizer &amp; Self-Attention Radar</h3>
                        <p className="text-xs text-slate-500">Break down natural language sequences into embedding tokens and contextual attention maps.</p>
                    </div>
                </div>
            </div>

            {/* Tokenized Stream */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Input Prompt Sequence:</label>
                <input
                    type="text"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />

                <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Tokenized Vector Stream ({tokens.length} tokens):</span>
                    <div className="flex flex-wrap gap-2">
                        {tokens.map((tok, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white border border-slate-200 shadow-2xs text-slate-800 flex items-center gap-1.5"
                            >
                                <span>{tok}</span>
                                <span className="text-[9px] text-slate-400 font-normal">#{i + 1042}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Temperature Slider */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                    <h4 className="text-xs font-bold text-slate-900">Temperature Sampling: {temperature}</h4>
                    <p className="text-[11px] text-slate-500">Controls generation randomness (lower = deterministic, higher = creative).</p>
                </div>
                <input
                    type="range" min="0.0" max="1.5" step="0.1"
                    value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-40 accent-slate-900 cursor-pointer"
                />
            </div>
        </div>
    );
};

/* =========================================================================
   5. AGENTIC AI & AUTONOMOUS AGENTS VISUALIZER
   ========================================================================= */
export const AgenticAIVisualizer = () => {
    const [step, setStep] = useState(0);

    const reactSteps = [
        { phase: 'Goal Ingestion', desc: 'Agent receives goal: "Fetch real-time stock price and summarize performance."', icon: Target },
        { phase: 'Thought (Reasoning)', desc: 'Reasoning: "I do not have live stock prices in my internal weights. I must invoke the search tool."', icon: BrainIcon },
        { phase: 'Action (Tool Calling)', desc: 'Tool Call: `finance_api.get_quote(symbol="GOOGL")` dispatched to sandbox execution runtime.', icon: Zap },
        { phase: 'Observation', desc: 'Environment returns API JSON: `{ price: 184.20, change: "+2.1%" }`.', icon: Eye },
        { phase: 'Final Synthesis', desc: 'Synthesizing output for user: "Alphabet Inc. (GOOGL) is trading at $184.20 (+2.1%)."', icon: Check }
    ];

    function BrainIcon(props) {
        return <Bot {...props} />;
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Bot size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Autonomous ReAct Decision Loop Visualizer</h3>
                        <p className="text-xs text-slate-500">Inspect the Thought ➔ Action ➔ Observation cycle powering Agentic AI workflows.</p>
                    </div>
                </div>
                <button
                    onClick={() => setStep(prev => (prev + 1) % reactSteps.length)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                    <Play size={12} className="fill-current" />
                    <span>Advance Loop Step</span>
                </button>
            </div>

            {/* Loop Steps Flow */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {reactSteps.map((s, idx) => {
                    const isCurrent = step === idx;
                    const isDone = step > idx;
                    const Icon = s.icon;
                    return (
                        <div
                            key={idx}
                            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                                isCurrent
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-102'
                                    : isDone
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 opacity-60'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Icon size={16} />
                                    <span className="text-[10px] font-mono font-bold">Step {idx + 1}</span>
                                </div>
                                <h4 className="text-xs font-bold mb-1">{s.phase}</h4>
                                <p className={`text-[11px] leading-relaxed ${isCurrent ? 'text-slate-300' : isDone ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    {s.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* =========================================================================
   6. C SYSTEMS & MEMORY VISUALIZER
   ========================================================================= */
export const CSystemsVisualizer = () => {
    const [allocatedBytes, setAllocatedBytes] = useState(16);
    const [isFreed, setIsFreed] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Terminal size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Low-Level Virtual Memory &amp; Heap Allocator</h3>
                        <p className="text-xs text-slate-500">Track pointers, byte addresses, manual malloc/free calls, and memory leaks.</p>
                    </div>
                </div>
            </div>

            {/* Hex Memory Addresses Grid */}
            <div className="p-6 rounded-2xl bg-slate-950 text-white font-mono space-y-3">
                <div className="flex justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <span>Virtual Address</span>
                    <span>Allocation Frame</span>
                    <span>State</span>
                </div>
                {[
                    { addr: '0x7fff5fbff710', seg: 'Stack (main frame)', val: 'int x = 42;', color: 'text-sky-400' },
                    { addr: '0x7fff5fbff718', seg: 'Stack (pointer ptr*)', val: isFreed ? '0x0 (NULL)' : '0x60000020a', color: 'text-indigo-400' },
                    { addr: '0x0060000020a0', seg: 'Heap Block (malloc)', val: isFreed ? '[FREED BUFFER]' : `${allocatedBytes} Bytes (Active)`, color: isFreed ? 'text-rose-400' : 'text-emerald-400' }
                ].map((row, i) => (
                    <div key={i} className="flex justify-between text-xs py-1.5 border-b border-slate-900/60">
                        <span className="text-slate-400">{row.addr}</span>
                        <span className="text-slate-300">{row.seg}</span>
                        <span className={`font-bold ${row.color}`}>{row.val}</span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => { setIsFreed(false); setAllocatedBytes(16); }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                    int* ptr = (int*)malloc(16);
                </button>
                <button
                    onClick={() => setIsFreed(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-bold cursor-pointer"
                >
                    free(ptr);
                </button>
            </div>
        </div>
    );
};

/* =========================================================================
   7. MODERN C++ & RAII VISUALIZER
   ========================================================================= */
export const ModernCppVisualizer = () => {
    const [smartType, setSmartType] = useState('unique'); // 'unique' | 'shared'
    const [refCount, setRefCount] = useState(1);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Terminal size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Modern C++ RAII &amp; Smart Pointers</h3>
                        <p className="text-xs text-slate-500">Automatic destruction, std::unique_ptr move semantics &amp; std::shared_ptr reference counts.</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                        onClick={() => { setSmartType('unique'); setRefCount(1); }}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer ${smartType === 'unique' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
                    >
                        std::unique_ptr
                    </button>
                    <button
                        onClick={() => setSmartType('shared')}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer ${smartType === 'shared' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
                    >
                        std::shared_ptr
                    </button>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-around font-mono">
                {smartType === 'unique' ? (
                    <div className="space-y-2 text-center">
                        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs inline-block">
                            <span className="text-xs font-bold text-slate-900 block">std::unique_ptr&lt;Resource&gt; uptr</span>
                            <span className="text-[10px] text-emerald-600 font-semibold">Exclusive Ownership (No copies allowed)</span>
                        </div>
                        <p className="text-xs text-slate-500">Ownership transfer requires explicit <code className="text-indigo-600">std::move(uptr)</code>.</p>
                    </div>
                ) : (
                    <div className="space-y-3 text-center">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold">shared_ptr A</div>
                            {refCount >= 2 && <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold">shared_ptr B</div>}
                            {refCount >= 3 && <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold">shared_ptr C</div>}
                        </div>
                        <div className="text-xs font-bold text-slate-700">
                            Control Block Ref Count: <span className="text-emerald-600 font-mono text-sm">{refCount}</span>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => setRefCount(prev => Math.min(prev + 1, 4))}
                                className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold cursor-pointer"
                            >
                                + Copy Pointer
                            </button>
                            <button
                                onClick={() => setRefCount(prev => Math.max(prev - 1, 1))}
                                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold cursor-pointer"
                            >
                                - Release Pointer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* =========================================================================
   8. JAVA ENTERPRISE & JVM ARCHITECTURE VISUALIZER
   ========================================================================= */
export const JavaEnterpriseVisualizer = () => {
    const [edenUsage, setEdenUsage] = useState(65);
    const [gcCount, setGcCount] = useState(0);

    const triggerMinorGC = () => {
        setGcCount(prev => prev + 1);
        setEdenUsage(15);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Database size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">JVM Runtime Memory &amp; Garbage Collector</h3>
                        <p className="text-xs text-slate-500">Eden, Survivor spaces (S0/S1), Tenured Old Generation, and Minor GC cycles.</p>
                    </div>
                </div>
                <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                    GC Events Triggered: <strong className="text-slate-900">{gcCount}</strong>
                </div>
            </div>

            {/* JVM Heap Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>Young Gen (Eden)</span>
                        <span>{edenUsage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-slate-900 rounded-full transition-all duration-300" style={{ width: `${edenUsage}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 block">New object allocations (Short-lived)</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>Survivor (S0/S1)</span>
                        <span>30%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-slate-600 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 block">Objects surviving Minor GC cycles</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>Old Gen (Tenured)</span>
                        <span>45%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-slate-700 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 block">Long-lived enterprise beans &amp; pools</span>
                </div>
            </div>

            {/* Trigger GC */}
            <div className="flex items-center justify-between pt-1">
                <button
                    onClick={() => setEdenUsage(prev => Math.min(prev + 20, 100))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold cursor-pointer"
                >
                    + Allocate Objects in Eden
                </button>
                <button
                    onClick={triggerMinorGC}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                    <RefreshCw size={12} />
                    <span>Run Minor Garbage Collection</span>
                </button>
            </div>
        </div>
    );
};

