import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Web3Layout } from "./../layout/Web3Layout";

const CODE_SNIPPETS = [
    `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i`,
    `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
    `class Solution:
    def maxProfit(self, prices):
        min_p, max_p = float('inf'), 0
        for p in prices:
            min_p = min(min_p, p)
            max_p = max(max_p, p - min_p)
        return max_p`,
];

const STATS = [
    { value: '50K+', label: 'Students Assessed' },
    { value: '2K+',  label: 'Coding Problems' },
    { value: '500+', label: 'Exams Conducted' },
    { value: '99.9%', label: 'Uptime SLA' },
];

const FEATURES = [
    {
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        title: 'Live Code IDE',
        desc: 'Monaco-powered editor with 10+ languages, auto-complete, and real-time execution.',
        color: 'var(--accent-green)',
    },
    {
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'Secure Proctoring',
        desc: 'AI-powered tab detection, fullscreen lock, and VM blocking to ensure exam integrity.',
        color: 'var(--accent-blue)',
    },
    {
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'Instant Analytics',
        desc: 'Detailed submission reports, test-case breakdowns, and performance dashboards.',
        color: 'var(--accent-purple)',
    },
];

export function Web3HeroAnimated() {
    const [isMounted, setIsMounted] = useState(false);
    const [codeIndex, setCodeIndex] = useState(0);
    const [displayedCode, setDisplayedCode] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 80);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const snippet = CODE_SNIPPETS[codeIndex];
        let i = 0;
        setDisplayedCode('');
        setIsTyping(true);

        const type = () => {
            if (i < snippet.length) {
                setDisplayedCode(snippet.slice(0, i + 1));
                i++;
                timeoutRef.current = setTimeout(type, 18);
            } else {
                setIsTyping(false);
                timeoutRef.current = setTimeout(() => {
                    setCodeIndex(prev => (prev + 1) % CODE_SNIPPETS.length);
                }, 2800);
            }
        };
        timeoutRef.current = setTimeout(type, 300);
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [codeIndex]);

    return (
        <Web3Layout>
            {/* ══ HERO ══════════════════════════════════════════════════ */}
            <div className={`w-full max-w-7xl mx-auto px-6 ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>

                {/* Badge */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest"
                        style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)', border: '1px solid rgba(0,212,170,0.25)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
                        Next-Gen Assessment Platform by HiGen Labs
                    </div>
                </div>

                {/* Main Hero Content */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left — Copy */}
                    <div className="text-left">
                        <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
                            Code. Assess.
                            <br />
                            <span className="hl-gradient-text">Excel.</span>
                        </h1>
                        <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
                            The ultimate platform for universities and enterprises to evaluate coding
                            skills through rigorous, secure, browser-based environments — powered by
                            <strong style={{ color: 'var(--text-primary)' }}> HiGen Labs</strong>.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/login" className="hl-btn-primary text-base px-7 py-3">
                                Start an Exam
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link to="/exam/mock" className="hl-btn-secondary text-base px-7 py-3">
                                Try Demo Sandbox
                            </Link>
                        </div>

                        {/* Mini stats */}
                        <div className="flex flex-wrap gap-6 mt-10">
                            {STATS.map(s => (
                                <div key={s.label} className="flex flex-col">
                                    <span className="text-2xl font-black" style={{ color: 'var(--accent-green)' }}>{s.value}</span>
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Animated Code Card */}
                    <div className="relative">
                        <div className="hl-card p-0 overflow-hidden" style={{ border: '1px solid rgba(0,212,170,0.2)', boxShadow: '0 0 40px rgba(0,212,170,0.08)' }}>
                            {/* Editor top bar */}
                            <div className="flex items-center gap-2 px-5 py-3" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border)' }}>
                                <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                                <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                                <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                                <span className="ml-3 text-xs font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>solution.py</span>
                                <div className="ml-auto">
                                    <span className="hl-badge hl-badge-green text-xs">● Running</span>
                                </div>
                            </div>
                            {/* Code content */}
                            <div className="p-6" style={{ background: '#0d1117', minHeight: '200px' }}>
                                <pre className="text-sm leading-relaxed" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    <code>{displayedCode}<span className={`${isTyping ? 'opacity-100' : 'opacity-0'} transition-opacity`} style={{ borderRight: '2px solid var(--accent-green)' }}>&nbsp;</span></code>
                                </pre>
                            </div>
                            {/* Test result bar */}
                            <div className="px-5 py-3 flex items-center gap-4" style={{ background: 'rgba(0,212,170,0.05)', borderTop: '1px solid var(--border)' }}>
                                <span className="text-xs font-medium" style={{ color: 'var(--accent-green)' }}>✓ 3/3 test cases passed</span>
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Runtime: 42ms · Memory: 16.4 MB</span>
                            </div>
                        </div>

                        {/* Decorative glow */}
                        <div className="absolute -inset-px -z-10 rounded-2xl opacity-30" style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,170,0.3), transparent 70%)' }} />
                    </div>
                </div>
            </div>

            {/* ══ FEATURES ═════════════════════════════════════════════ */}
            <div className="w-full max-w-7xl mx-auto px-6 mt-28">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-green)' }}>Why HiGen Labs</p>
                    <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Everything you need to assess code</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {FEATURES.map(f => (
                        <div key={f.title} className="hl-card p-7 group" style={{ cursor: 'default' }}>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                                style={{ background: `rgba(${f.color === 'var(--accent-green)' ? '0,212,170' : f.color === 'var(--accent-blue)' ? '79,142,247' : '124,92,252'},0.15)`, color: f.color }}>
                                {f.icon}
                            </div>
                            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ CTA BANNER ═══════════════════════════════════════════ */}
            <div className="w-full max-w-7xl mx-auto px-6 mt-20 mb-8">
                <div className="rounded-2xl p-10 text-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(79,142,247,0.12))', border: '1px solid rgba(0,212,170,0.2)' }}>
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(0,212,170,0.08) 0%, transparent 70%)' }} />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Ready to get started?</h2>
                        <p className="mb-7" style={{ color: 'var(--text-secondary)' }}>Join thousands of students and educators on HiGen Labs.</p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/register" className="hl-btn-primary px-8 py-3 text-base">Create Free Account</Link>
                            <Link to="/login" className="hl-btn-secondary px-8 py-3 text-base">Sign In →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </Web3Layout>
    );
}
