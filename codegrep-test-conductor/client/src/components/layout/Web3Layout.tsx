import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Web3Background } from "./Web3Background";

export function Web3Layout({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 80);
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
    }, []);

    return (
        <section className="relative isolate min-h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Web3Background />

            {/* ══ NAV ══════════════════════════════════════════════════ */}
            <header
                className="relative w-full z-40 transition-all duration-300"
                style={{
                    background: scrolled ? 'rgba(10,14,26,0.92)' : 'rgba(10,14,26,0.7)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
                }}
            >
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <img src="/company-logo.png" alt="HiGen Labs Logo" className="w-9 h-9 object-contain rounded-lg" />
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,212,170,0.15)', boxShadow: '0 0 12px rgba(0,212,170,0.3)' }} />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>HiGen Labs</span>
                            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Assessment Platform</span>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-8 text-sm font-medium md:flex" style={{ color: 'var(--text-secondary)' }}>
                        <Link className="hover:text-white transition-colors" to="/exam/mock" style={{ color: 'var(--text-secondary)' }}>
                            Demo Sandbox
                        </Link>
                    </nav>

                    <div className="hidden items-center gap-3 md:flex">
                        <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg transition-all" style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            Sign in
                        </Link>
                        <Link to="/register" className="hl-btn-primary text-sm">
                            Get Started →
                        </Link>
                    </div>
                </div>
            </header>

            {/* ══ CONTENT WRAPPER ══════════════════════════════════════ */}
            <main className={`relative z-30 flex-1 flex flex-col justify-center items-center w-full px-4 pb-24 pt-12 ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
                {children}
            </main>

        </section>
    );
}
