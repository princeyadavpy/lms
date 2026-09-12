import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Web3Background } from '../../components/layout/Web3Background';

const NAV_ITEMS = [
    { to: '/admin', label: 'Dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { to: '/admin/users', label: 'Users', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
    { to: '/admin/tests', label: 'Tests', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
    { to: '/admin/submissions', label: 'Submissions', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
    { to: '/admin/settings', label: 'Settings', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
];

const PAGE_LABELS = {
    '/admin': 'Dashboard',
    '/admin/users': 'Users',
    '/admin/tests': 'Tests',
    '/admin/submissions': 'Submissions',
    '/admin/settings': 'Settings',
};

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => { logout(); navigate('/login'); };

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
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
                        style={{ background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.2)' }}>
                        <img src="/company-logo.png" alt="HiGen Labs" className="w-6 h-6 object-contain" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>HiGen Labs</span>
                        <span className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Admin Console</span>
                    </div>
                </div>

                {/* User card */}
                <div className="mx-3 mt-4 px-3 py-3 rounded-xl" style={{ background: 'rgba(79,142,247,0.07)', border: '1px solid rgba(79,142,247,0.14)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                            style={{ background: 'var(--accent-blue)', color: '#fff' }}>
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Admin'}</p>
                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>System Admin</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Console</p>
                    {NAV_ITEMS.map(({ to, label, icon }) => {
                        const active = isActive(to);
                        return (
                            <Link
                                key={to}
                                to={to}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    color: active ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                    background: active ? 'var(--accent-blue-dim)' : 'transparent',
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

            {/* ── Main Content ────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col overflow-hidden relative z-10">
                <header className="flex justify-between items-center px-8 py-4 shrink-0"
                    style={{ background: 'rgba(10,14,26,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <h1 className="text-lg font-bold capitalize" style={{ color: 'var(--text-primary)' }}>{pageTitle}</h1>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>HiGen Labs — Admin Console</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hl-badge hl-badge-blue">Admin</span>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                            style={{ background: 'var(--accent-blue)', color: '#fff' }}>
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
