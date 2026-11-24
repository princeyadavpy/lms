import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
    Play,
    SkipForward,
    RotateCcw,
    Terminal,
    ArrowRight,
    HelpCircle,
    Sliders,
    Sparkles,
    Check
} from 'lucide-react';

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getStepTransitionInfo(steps, currentIdx) {
    if (!steps || currentIdx < 0 || currentIdx >= steps.length) return null;
    const current = steps[currentIdx];
    const prev = currentIdx > 0 ? steps[currentIdx - 1] : null;
    const next = currentIdx < steps.length - 1 ? steps[currentIdx + 1] : null;

    if (!current || !current.lineNum) return null;
    const toLine = current.lineNum;
    const fromLine = prev?.lineNum || null;

    let direction = 'down';
    let isJump = false;
    let reason = '';

    if (!fromLine) {
        direction = 'start';
        reason = `Execution initiated at Line ${toLine} (${current.detail || 'entry point'}).`;
    } else if (toLine < fromLine) {
        direction = 'up';
        isJump = true;
        reason = `Execution looped back UP from Line ${fromLine} to Line ${toLine} to re-evaluate loop iteration with updated state.`;
    } else if (toLine > fromLine + 1) {
        direction = 'down';
        isJump = true;
        reason = `Execution jumped from Line ${fromLine} directly to Line ${toLine} (${current.detail || 'branch jump'}).`;
    } else if (toLine === fromLine) {
        direction = 'same';
        reason = `Continuing execution on Line ${toLine} (${current.detail || 'in-line evaluation'}).`;
    } else {
        direction = 'down';
        reason = `Sequential step from Line ${fromLine} to Line ${toLine} (${current.detail || 'statement executed'}).`;
    }

    return { fromLine, toLine, direction, isJump, reason, nextLine: next?.lineNum || null };
}

export default function InteractiveEditorWithArrow({
    code,
    setCode,
    currentLineNum,
    transitionInfo,
    isRunning,
    runCode,
    stepForward,
    resetExecution,
    speed,
    setSpeed,
    statusText,
    stepCounterText,
    terminalLines = [],
    badgeText = 'Python Engine',
    fileName = 'main.py',
    accentColor = '#3b82f6'
}) {
    // Local editable code state to guarantee real-time editing never crashes even if setCode wasn't passed
    const [editableCode, setEditableCode] = useState(code || '');
    const [isHoverPaused, setIsHoverPaused] = useState(false);
    const scrollContainerRef = useRef(null);
    const prevLineRef = useRef(null);
    const [prevLine, setPrevLine] = useState(null);

    // Keep editableCode in sync if prop code changes (e.g. switching examples)
    useEffect(() => {
        setEditableCode(code || '');
    }, [code]);

    // Compute lines based on the current live editable code
    const activeCode = editableCode || code || '';
    const codeLines = activeCode.split('\n');

    // Detect real-time edited value replacements between default example code and user edits
    const valueReplacements = useMemo(() => {
        if (!code || !editableCode || code === editableCode) return [];
        const origLines = code.split('\n');
        const editLines = editableCode.split('\n');
        const replacements = [];

        origLines.forEach((origLine, idx) => {
            const editLine = editLines[idx];
            if (!editLine || origLine === editLine) return;

            // Detect numbers
            const origNums = origLine.match(/\b\d+(\.\d+)?\b/g) || [];
            const editNums = editLine.match(/\b\d+(\.\d+)?\b/g) || [];
            origNums.forEach((on, nIdx) => {
                const en = editNums[nIdx];
                if (en && on !== en && !replacements.some(r => r.from === on)) {
                    replacements.push({ from: on, to: en });
                }
            });

            // Detect quoted strings
            const origStrs = origLine.match(/["'](.*?)["']/g) || [];
            const editStrs = editLine.match(/["'](.*?)["']/g) || [];
            origStrs.forEach((os, sIdx) => {
                const es = editStrs[sIdx];
                if (es && os !== es) {
                    const cleanO = os.slice(1, -1);
                    const cleanE = es.slice(1, -1);
                    if (cleanO && cleanE && !replacements.some(r => r.from === cleanO)) {
                        replacements.push({ from: cleanO, to: cleanE });
                    }
                }
            });
        });

        return replacements;
    }, [code, editableCode]);

    // Apply real-time value replacements to terminal stdout lines
    const dynamicTerminalLines = useMemo(() => {
        if (!terminalLines || terminalLines.length === 0) return [];
        if (valueReplacements.length === 0) return terminalLines;

        return terminalLines.map(line => {
            let updated = line;
            valueReplacements.forEach(({ from, to }) => {
                if (from && to) {
                    const regex = new RegExp(`\\b${escapeRegExp(from)}\\b`, 'g');
                    updated = updated.replace(regex, to);
                }
            });
            return updated;
        });
    }, [terminalLines, valueReplacements]);

    // Handle code edits cleanly
    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        setEditableCode(newCode);
        if (typeof setCode === 'function') {
            setCode(newCode);
        }
        if (typeof resetExecution === 'function') {
            resetExecution();
        }
    };

    const handleRevertCode = () => {
        setEditableCode(code);
        if (typeof setCode === 'function') {
            setCode(code);
        }
        if (typeof resetExecution === 'function') {
            resetExecution();
        }
    };

    // Arrow geometry constants matching line-height: 1.72rem (27.52px)
    const LINE_HEIGHT = 27.52;
    const PADDING_TOP = 12;
    const PADDING_BOTTOM = 28;

    // Total content height guaranteed to show every line without awkward inner scroll trapping
    const editorHeight = Math.max(220, Math.ceil(codeLines.length * LINE_HEIGHT + PADDING_TOP + PADDING_BOTTOM));

    // Track previous line for transition trajectory
    useEffect(() => {
        if (currentLineNum) {
            setPrevLine(prevLineRef.current);
            prevLineRef.current = currentLineNum;
        } else {
            setPrevLine(null);
            prevLineRef.current = null;
        }
    }, [currentLineNum, stepCounterText]);

    const renderCurvedArrow = () => {
        if (!currentLineNum || currentLineNum < 1 || currentLineNum > codeLines.length) return null;

        const targetLine = currentLineNum;
        const fromLine = transitionInfo?.fromLine || prevLine || null;

        const yTarget = PADDING_TOP + (targetLine - 0.5) * LINE_HEIGHT;
        const yFrom = fromLine ? PADDING_TOP + (fromLine - 0.5) * LINE_HEIGHT : yTarget;

        const isGoingUp = fromLine && (targetLine < fromLine);
        const dy = Math.abs(yTarget - yFrom);

        const startX = 10;
        const endX = 38;

        let pathD = '';
        let midX = 14;
        let midY = yTarget;

        if (fromLine && fromLine !== targetLine) {
            midY = (yFrom + yTarget) / 2;
            if (isGoingUp) {
                // Loop jump back UP: sweep wide left arch
                const curveLeft = Math.max(2, 10 - dy * 0.12);
                pathD = `M ${startX} ${yFrom} C ${curveLeft} ${yFrom - 10}, ${curveLeft} ${yTarget + 10}, ${endX} ${yTarget}`;
                midX = curveLeft;
            } else if (dy > LINE_HEIGHT) {
                // Branch jump DOWN: sweep wide left arch
                const curveLeft = Math.max(2, 10 - dy * 0.12);
                pathD = `M ${startX} ${yFrom} C ${curveLeft} ${yFrom + 10}, ${curveLeft} ${yTarget - 10}, ${endX} ${yTarget}`;
                midX = curveLeft;
            } else {
                // Consecutive step down (from line N to N+1)
                pathD = `M ${startX} ${yFrom} C 4 ${yFrom + 6}, 8 ${yTarget - 6}, ${endX} ${yTarget}`;
                midX = 6;
            }
        } else {
            // First step or continuing on same line: direct straight beam into active line
            pathD = `M 4 ${yTarget} L ${endX} ${yTarget}`;
            midX = 18;
            midY = yTarget;
        }

        const animKey = `exec-arrow-${fromLine || 0}-${targetLine}-${stepCounterText || ''}-${statusText || ''}`;

        return (
            <div className="absolute inset-0 overflow-visible pointer-events-none">
                <svg
                    className="w-full overflow-visible"
                    style={{ height: `${editorHeight}px` }}
                >
                    <defs>
                        <linearGradient id="editorCurvedArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f87171" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                        <filter id="editorCurvedArrowGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#ef4444" floodOpacity="0.8" />
                        </filter>
                    </defs>

                    <g
                        key={animKey}
                        className="cursor-pointer pointer-events-auto group"
                        onMouseEnter={() => setIsHoverPaused(true)}
                        onMouseLeave={() => setIsHoverPaused(false)}
                    >
                        {/* Hit-area for easy hover */}
                        <path d={pathD} fill="none" stroke="transparent" strokeWidth="26" />

                        {/* Dark Outline */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="#060911"
                            strokeWidth="5.5"
                            strokeLinecap="round"
                            pathLength="100"
                            strokeDasharray="100"
                            strokeDashoffset="0"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="100"
                                to="0"
                                dur="0.25s"
                                fill="freeze"
                                calcMode="spline"
                                keySplines="0.25 0.1 0.25 1"
                                keyTimes="0;1"
                            />
                        </path>

                        {/* Red Arrow Glowing Trajectory Stem */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="url(#editorCurvedArrowGrad)"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            filter="url(#editorCurvedArrowGlow)"
                            pathLength="100"
                            strokeDasharray="100"
                            strokeDashoffset="0"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="100"
                                to="0"
                                dur="0.25s"
                                fill="freeze"
                                calcMode="spline"
                                keySplines="0.25 0.1 0.25 1"
                                keyTimes="0;1"
                            />
                        </path>

                        {/* Animated Motion Arrowhead Traveling along the curve into active line */}
                        <g>
                            <animateMotion
                                dur="0.25s"
                                fill="freeze"
                                rotate="auto"
                                path={pathD}
                                calcMode="spline"
                                keySplines="0.25 0.1 0.25 1"
                                keyTimes="0;1"
                            />
                            <polygon
                                points="0,0 -12,-6 -7,0 -12,6"
                                fill="#060911"
                                stroke="#060911"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                            <polygon
                                points="0,0 -11,-5 -6.5,0 -11,5"
                                fill="url(#editorCurvedArrowGrad)"
                                stroke="#fee2e2"
                                strokeWidth="0.8"
                                strokeLinejoin="round"
                            />
                        </g>

                        {/* Persistent Execution Pointer Arrowhead Locked on currentLineNum */}
                        <g transform={`translate(${endX}, ${yTarget})`}>
                            <circle cx="-4" cy="0" r="5" fill="#ef4444" opacity="0.4" className="animate-ping" />
                            <polygon
                                points="3,0 -11,-6 -7,0 -11,6"
                                fill="url(#editorCurvedArrowGrad)"
                                stroke="#ffffff"
                                strokeWidth="1.2"
                                strokeLinejoin="round"
                                filter="url(#editorCurvedArrowGlow)"
                            />
                        </g>

                        {/* Small hover indicator button along trajectory */}
                        {fromLine && fromLine !== targetLine && (
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
                        )}
                    </g>
                </svg>
            </div>
        );
    };

    return (
        <div className="space-y-3 font-sans">
            {/* Editor Container */}
            <div className="bg-[#121620] rounded-2xl border border-slate-800/90 shadow-sm overflow-hidden flex flex-col">
                
                {/* Editor Window Bar */}
                <div className="px-4 py-2.5 bg-[#0d121c] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <span className="text-slate-300 font-medium ml-1">{fileName}</span>
                        <span className="text-[10px] text-emerald-400 font-sans font-semibold bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full hidden sm:inline">
                            Live Editable
                        </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-900 text-slate-300">
                        {badgeText}
                    </span>
                </div>

                {/* Real-time Value Tweaker Notification Banner */}
                {valueReplacements.length > 0 && (
                    <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-300 animate-fadeIn">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="text-slate-400 font-sans font-semibold">Live Values:</span>
                            {valueReplacements.slice(0, 3).map((r, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-[10px]">
                                    {r.from} ➔ <strong className="text-emerald-400">{r.to}</strong>
                                </span>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleRevertCode}
                            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer shrink-0 ml-2"
                        >
                            Reset Values
                        </button>
                    </div>
                )}

                {/* Editor Body – fully visible code with clean natural height without multiple scrollbar traps */}
                <div
                    ref={scrollContainerRef}
                    className="flex relative overflow-x-auto overflow-y-hidden [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700/60 [&::-webkit-scrollbar-thumb]:rounded-full"
                    style={{
                        minHeight: '220px'
                    }}
                >
                    {/* Line Numbers Column */}
                    <div
                        className="bg-[#0d121c]/90 px-2 select-none flex flex-col text-right font-mono text-xs leading-[1.72rem] border-r border-slate-800/80 min-w-[36px] shrink-0 text-slate-500"
                        style={{
                            height: `${editorHeight}px`,
                            paddingTop: `${PADDING_TOP}px`,
                            paddingBottom: `${PADDING_BOTTOM}px`
                        }}
                    >
                        {codeLines.map((_, idx) => {
                            const ln = idx + 1;
                            const isCurrent = currentLineNum === ln;
                            return (
                                <div
                                    key={ln}
                                    className={`h-[1.72rem] flex items-center justify-end gap-1 ${
                                        isCurrent ? 'text-emerald-400 font-bold' : 'text-slate-500'
                                    }`}
                                >
                                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                                    <span>{ln}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* SVG Curved Arrow Lane (44px) */}
                    <div
                        className="relative w-[44px] bg-[#0d121c]/40 border-r border-slate-800/60 shrink-0 select-none overflow-visible"
                        style={{ height: `${editorHeight}px` }}
                    >
                        {renderCurvedArrow()}
                    </div>

                    {/* Code Textarea & Execution Backdrop */}
                    <div className="relative flex-1 min-w-0" style={{ height: `${editorHeight}px` }}>
                        <div
                            className="pointer-events-none absolute left-0 right-0 top-0"
                            aria-hidden="true"
                            style={{
                                height: `${editorHeight}px`,
                                paddingTop: `${PADDING_TOP}px`
                            }}
                        >
                            {codeLines.map((_, idx) => {
                                const ln = idx + 1;
                                const isCurrent = currentLineNum === ln;
                                return (
                                    <div
                                        key={ln}
                                        className={`h-[1.72rem] w-full transition-colors ${
                                            isCurrent ? 'bg-slate-800/60 border-l-2 border-emerald-400' : ''
                                        }`}
                                    />
                                );
                            })}
                        </div>
                        <textarea
                            value={activeCode}
                            onChange={handleCodeChange}
                            spellCheck={false}
                            className="w-full bg-transparent font-mono text-xs sm:text-[13px] leading-[1.72rem] text-slate-200 outline-none resize-none select-text relative z-10 whitespace-pre overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            style={{
                                height: `${editorHeight}px`,
                                paddingTop: `${PADDING_TOP}px`,
                                paddingBottom: `${PADDING_BOTTOM}px`,
                                paddingLeft: '14px',
                                paddingRight: '14px'
                            }}
                        />
                    </div>
                </div>

                {/* Status Bar */}
                <div className="px-4 py-2 bg-[#0d121c] border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="truncate max-w-[280px]">{statusText || 'Ready to execute • edit code or values anytime'}</span>
                    <span className="shrink-0">{stepCounterText || 'Idle'}</span>
                </div>
            </div>

            {/* Hovered Line Transition Explanation Card */}
            {isHoverPaused && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1 shadow-sm animate-fadeIn">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Execution at Line {currentLineNum}{transitionInfo?.fromLine ? ` (from Line ${transitionInfo.fromLine})` : ''}</span>
                    </div>
                    <p className="leading-relaxed font-normal text-amber-800">
                        {transitionInfo?.reason || statusText || 'Statement executed at this line.'}
                    </p>
                </div>
            )}

            {/* Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white rounded-2xl border border-slate-200/80 p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={runCode}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{isRunning ? 'Restart' : 'Run Code'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={stepForward}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                        <SkipForward className="w-3.5 h-3.5 text-slate-500" />
                        <span>Step</span>
                    </button>

                    <button
                        type="button"
                        onClick={resetExecution}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-800 border border-slate-200/90 bg-white hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                        title="Reset Execution"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600 mr-0.5">Speed:</span>
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                        {['slow', 'normal', 'fast'].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setSpeed(s)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize cursor-pointer transition-colors ${
                                    speed === s
                                        ? 'bg-white text-slate-900 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Output Console (stdout) with live dynamic updated values */}
            <div className="bg-[#121620] rounded-2xl border border-slate-800/90 shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 py-2.5 bg-[#0d121c] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-slate-400" />
                        <span>Output Console</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">stdout</span>
                </div>
                <div className="p-3.5 font-mono text-xs min-h-[70px] text-slate-300 space-y-0.5">
                    {dynamicTerminalLines.length > 0 ? (
                        dynamicTerminalLines.map((line, idx) => (
                            <div key={idx} className="text-emerald-400 leading-relaxed whitespace-pre-line">
                                &gt; {line}
                            </div>
                        ))
                    ) : (
                        <span className="text-slate-500 italic">Program stdout will appear here...</span>
                    )}
                </div>
            </div>
        </div>
    );
}
