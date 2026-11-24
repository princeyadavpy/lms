import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import companyLogo from '../../assets/company-logo.png';
import {
    LayoutDashboard,
    Building2,
    Layers,
    BookOpen,
    Users,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    ExternalLink,
    ShieldCheck,
    Menu,
    X
} from 'lucide-react';

const NAV_ITEMS = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/institutions', label: 'Institutions', icon: Building2 },
    { to: '/admin/batches', label: 'Batches', icon: Layers },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/tests', label: 'Exams & Tests', icon: FileText },
    { to: '/admin/submissions', label: 'Submissions', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const PAGE_LABELS = {
    '/admin': 'Dashboard',
    '/admin/institutions': 'Institutions',
    '/admin/batches': 'Batches',
    '/admin/courses': 'Courses & Curriculum',
    '/admin/users': 'Users',
    '/admin/tests': 'Tests & Exams',
    '/admin/submissions': 'Submissions',
    '/admin/settings': 'Settings',
};

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const pageTitle = PAGE_LABELS[location.pathname] || location.pathname.split('/').pop().replace(/-/g, ' ');
    const initial = user?.name?.charAt(0).toUpperCase() || 'A';

    return (
        <div className="lms-section min-h-screen flex bg-[#f8fafc] text-[#0f172a] font-sans">

            {/* ── Sidebar ────────────────────────────────────────────── */}
            <aside className="w-64 flex-col hidden md:flex shrink-0 bg-white border-r border-slate-200 z-20">

                {/* Brand Header */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2 bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200 shadow-xs">
                        <img src={companyLogo} alt="HiGen Labs" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <div className="flex items-center gap-0.5">
                            <span className="text-base font-black tracking-tight text-slate-900">HiGen</span>
                            <span className="text-base font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Labs</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Admin Console</span>
                    </div>
                </div>

                {/* User card */}
                <div className="mx-4 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 text-white shadow-xs bg-gradient-to-tr from-blue-600 to-indigo-600">
                            {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'System Admin'}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-[11px] font-semibold text-blue-600">Admin</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
                    <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Console</p>
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                        const active = isActive(to);
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    active
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                }`}
                            >
                                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <Link
                        to="/student"
                        className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 border border-slate-200/70 transition-all"
                    >
                        <span>View Student LMS</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
                    >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        <span>Logout</span>
                    </button>
                    <p className="text-center pt-2 text-[11px] text-slate-400 font-medium">© {new Date().getFullYear()} HiGen Labs</p>
                </div>
            </aside>

            {/* ── Mobile / Tablet Slide-over Sidebar ───────────────────── */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    <aside className="relative w-72 max-w-[85vw] flex flex-col bg-white border-r border-slate-200 z-10 h-full shadow-2xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200 shadow-xs">
                                    <img src={companyLogo} alt="HiGen Labs" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <div className="flex items-center gap-0.5">
                                        <span className="text-base font-black tracking-tight text-slate-900">HiGen</span>
                                        <span className="text-base font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Labs</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Admin Console</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(false)}
                                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                                aria-label="Close Menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mx-4 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 text-white shadow-xs bg-gradient-to-tr from-blue-600 to-indigo-600">
                                    {initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'System Admin'}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                        <span className="text-[11px] font-semibold text-blue-600">Admin</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
                            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Console</p>
                            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                                const active = isActive(to);
                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                            active
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-slate-100 space-y-2">
                            <Link
                                to="/student"
                                onClick={() => setMobileSidebarOpen(false)}
                                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 border border-slate-200/70 transition-all"
                            >
                                <span>View Student LMS</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
                            >
                                <LogOut className="w-4 h-4 flex-shrink-0" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* ── Main Content Area ───────────────────────────────────── */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between gap-3 shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setMobileSidebarOpen(true)}
                            className="md:hidden p-2 -ml-1 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
                            aria-label="Open Admin Menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-lg font-black text-slate-900 capitalize tracking-tight truncate">{pageTitle}</h1>
                            <p className="hidden sm:block text-xs text-slate-500 font-medium">HiGen Labs — Admin Console</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            ADMIN
                        </span>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-xs bg-gradient-to-tr from-blue-600 to-indigo-600">
                            {initial}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafc]">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
