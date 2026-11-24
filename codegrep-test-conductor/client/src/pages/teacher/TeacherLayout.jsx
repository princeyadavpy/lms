import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Web3Background } from '../../components/layout/Web3Background';
import companyLogo from '../../assets/company-logo.png';

const NAV_ITEMS = [
    { to: '/teacher', label: 'Overview', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { to: '/teacher/create-test', label: 'Create Test', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4v16m8-8H4" /> },
    { to: '/teacher/add-question', label: 'Add Question', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { to: '/teacher/my-tests', label: 'My Tests', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
    { to: '/teacher/submissions', label: 'Submissions', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { to: '/teacher/monitor', label: 'Live Monitor', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> },
];

const PAGE_LABELS = {
    '/teacher': 'Overview',
    '/teacher/create-test': 'Create Test',
    '/teacher/add-question': 'Add Question',
    '/teacher/my-tests': 'My Tests',
    '/teacher/submissions': 'Submissions',
    '/teacher/monitor': 'Live Monitor',
};

const TeacherLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

    const isActive = (path) => {
        if (path === '/teacher' && location.pathname === '/teacher') return true;
        if (path !== '/teacher' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const pageTitle = PAGE_LABELS[location.pathname] || location.pathname.split('/').pop().replace(/-/g, ' ');

    return (
        <div className="min-h-screen flex relative" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Web3Background />

            {/* ── Sidebar ────────────────────────────────────────────── */}
            <aside className="w-60 flex-col hidden md:flex z-20 shrink-0" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>

                {/* Brand */}
                <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.2)' }}>
                        <img src={companyLogo} alt="HiGen Labs" className="w-6 h-6 object-contain" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>HiGen Labs</span>
                        <span className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Teacher Portal</span>
                    </div>
                </div>

                {/* User card */}
                <div className="mx-3 mt-4 px-3 py-3 rounded-xl" style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.14)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                            style={{ background: 'var(--accent-purple)', color: '#fff' }}>
                            {user?.name?.charAt(0).toUpperCase() || 'T'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Teacher'}</p>
                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.role || 'Teacher'}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Navigation</p>
                    {NAV_ITEMS.map(({ to, label, icon }) => {
                        const active = isActive(to);
                        return (
                            <Link
                                key={to}
                                to={to}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    color: active ? 'var(--accent-purple)' : 'var(--text-secondary)',
                                    background: active ? 'var(--accent-purple-dim)' : 'transparent',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 pb-5" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all"
                        style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                    <p className="text-center mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} HiGen Labs</p>
                </div>
            </aside>

            {/* ── Mobile / Tablet Slide-over Sidebar ───────────────────── */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    <aside className="relative w-68 max-w-[85vw] flex flex-col z-10 h-full shadow-2xl" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.2)' }}>
                                    <img src={companyLogo} alt="HiGen Labs" className="w-6 h-6 object-contain" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>HiGen Labs</span>
                                    <span className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Teacher Portal</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(false)}
                                className="p-2 rounded-xl cursor-pointer"
                                style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none' }}
                                aria-label="Close Teacher Menu"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mx-3 mt-4 px-3 py-3 rounded-xl" style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.14)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                                    style={{ background: 'var(--accent-purple)', color: '#fff' }}>
                                    {user?.name?.charAt(0).toUpperCase() || 'T'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Teacher'}</p>
                                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.role || 'Teacher'}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Navigation</p>
                            {NAV_ITEMS.map(({ to, label, icon }) => {
                                const active = isActive(to);
                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                                        style={{
                                            color: active ? 'var(--accent-purple)' : 'var(--text-secondary)',
                                            background: active ? 'var(--accent-purple-dim)' : 'transparent',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="px-3 pb-5" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all"
                                style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* ── Main Content ────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <header className="flex justify-between items-center gap-3 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 shrink-0"
                    style={{ background: 'rgba(10,14,26,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setMobileSidebarOpen(true)}
                            className="md:hidden p-2 rounded-xl cursor-pointer shrink-0"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                            aria-label="Open Teacher Menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-lg font-bold capitalize truncate" style={{ color: 'var(--text-primary)' }}>{pageTitle}</h1>
                            <p className="hidden sm:block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>HiGen Labs — Teacher Portal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="hl-badge hl-badge-purple">{user?.role || 'Teacher'}</span>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                            style={{ background: 'var(--accent-purple)', color: '#fff' }}>
                            {user?.name?.charAt(0) || 'T'}
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherLayout;
