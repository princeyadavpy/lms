import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import companyLogo from '../../assets/company-logo.png';
import {
    LayoutDashboard, BookOpen, Code2, CheckSquare, HelpCircle,
    TrendingUp, Bell, ChevronDown, LogOut, User, Shield, Award, Menu, X
} from 'lucide-react';

const LMSNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };
    const currentPath = location.pathname;

    const navLinks = [
        { to: '/student', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { to: '/student/courses', label: 'Learn', icon: BookOpen },
        { to: '/student/labs', label: 'Labs', icon: Code2 },
        { to: '/student/assessments', label: 'Assessments', icon: CheckSquare },
        { to: '/student/quizzes', label: 'Quizzes', icon: HelpCircle },
        { to: '/student/progress', label: 'My Progress', icon: TrendingUp },
    ];

    const isActive = (link) => link.exact ? currentPath === link.to : currentPath.startsWith(link.to);

    return (
        <header className="sticky top-0 z-50 w-full" style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
        }}>
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* ── Logo + Nav Links ─────────────────────────── */}
                    <div className="flex items-center gap-6 xl:gap-8 min-w-0">
                        <Link to="/student" className="flex items-center gap-3 no-underline group shrink-0" style={{ textDecoration: 'none' }}>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                                <img src={companyLogo} alt="HiGen Labs" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <span
                                    className="text-lg sm:text-[22px] font-black tracking-tight leading-none text-slate-950 font-serif truncate"
                                    style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif', letterSpacing: '-0.02em' }}
                                >
                                    HiGen Labs
                                </span>
                                <span className="hidden sm:block text-[11px] font-medium text-slate-500 tracking-normal mt-1 leading-none">
                                    Empowering the Future with AI
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav Links */}
                        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-nowrap">
                            {navLinks.map((link) => {
                                const active = isActive(link);
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        style={{
                                            color: active ? '#0f172a' : '#475569',
                                            background: active ? '#f1f5f9' : 'transparent',
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '7px',
                                            padding: '7px 12px',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: active ? 600 : 500,
                                            transition: 'all 0.15s ease',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!active) {
                                                e.currentTarget.style.background = '#f8fafc';
                                                e.currentTarget.style.color = '#0f172a';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!active) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#475569';
                                            }
                                        }}
                                    >
                                        <Icon style={{ width: '15px', height: '15px', flexShrink: 0, color: active ? '#0f172a' : '#64748b' }} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* ── Right Actions ───────────────────────────── */}
                    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

                        {/* Exam Button */}
                        <Link
                            to="/student/exams"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '7px',
                                padding: '7px 14px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#ffffff',
                                background: '#0f172a',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#1e293b';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#0f172a';
                            }}
                        >
                            <Award style={{ width: '14px', height: '14px' }} />
                            <span>Exam</span>
                        </Link>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                                style={{
                                    position: 'relative',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    color: notifOpen ? '#0f172a' : '#64748b',
                                    background: notifOpen ? '#f1f5f9' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!notifOpen) {
                                        e.currentTarget.style.color = '#0f172a';
                                        e.currentTarget.style.background = '#f8fafc';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!notifOpen) {
                                        e.currentTarget.style.color = '#64748b';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                                aria-label="Notifications"
                            >
                                <Bell style={{ width: '18px', height: '18px' }} />
                                <span style={{
                                    position: 'absolute',
                                    top: '7px',
                                    right: '7px',
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: '#ef4444',
                                    border: '1.5px solid #ffffff'
                                }} />
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 mt-2 animate-fadeInUp max-w-[calc(100vw-2rem)]" style={{
                                    width: '320px', borderRadius: '14px', padding: '16px', zIndex: 100,
                                    background: '#ffffff', border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
                                }}>
                                    <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', margin: 0 }}>Notifications</h4>
                                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', fontWeight: 700, background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' }}>2 New</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                                        {[
                                            { title: 'New Quiz Available', body: 'Quiz – Control Flow is now ready in Python Programming.', time: '15 minutes ago' },
                                            { title: 'Exam Scheduled', body: 'Coding Midterm Examination scheduled for next Monday.', time: '2 hours ago' }
                                        ].map((n, i) => (
                                            <div key={i} style={{ padding: '10px 12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                <p style={{ fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{n.title}</p>
                                                <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px', lineHeight: 1.4 }}>{n.body}</p>
                                                <span style={{ color: '#2563eb', fontSize: '11px', fontWeight: 600 }}>{n.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    paddingLeft: '5px', paddingRight: '12px', paddingTop: '4px', paddingBottom: '4px',
                                    borderRadius: '999px', border: '1px solid #e2e8f0',
                                    background: profileOpen ? '#f1f5f9' : '#ffffff',
                                    cursor: 'pointer', transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            >
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '13px', fontWeight: 700, color: '#ffffff',
                                    background: '#2563eb',
                                    position: 'relative',
                                    flexShrink: 0
                                }}>
                                    {user?.name?.charAt(0).toUpperCase() || 'P'}
                                    {(user?.role === 'Admin' || user?.role === 'SuperAdmin' || user?.role === 'Teacher') && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                bottom: '-1px',
                                                right: '-1px',
                                                width: '13px',
                                                height: '13px',
                                                borderRadius: '50%',
                                                background: '#fef08a',
                                                border: '1.5px solid #ffffff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title={user.role}
                                        >
                                            <Shield style={{ width: '8px', height: '8px', color: '#854d0e' }} />
                                        </span>
                                    )}
                                </div>
                                <div className="hidden sm:flex flex-col text-left">
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user?.name || 'Student'}
                                    </span>
                                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, lineHeight: 1.2 }}>
                                        {user?.role || 'Student'}
                                    </span>
                                </div>
                                <ChevronDown style={{ width: '13px', height: '13px', color: '#64748b', flexShrink: 0 }} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 animate-fadeInUp max-w-[calc(100vw-2rem)]" style={{
                                    width: '260px', borderRadius: '14px', padding: '12px', zIndex: 100,
                                    background: '#ffffff', border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ padding: '10px 12px', borderRadius: '10px', marginBottom: '8px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <div className="flex items-center justify-between">
                                            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{user?.name || 'Student'}</p>
                                            {(user?.role === 'Admin' || user?.role === 'SuperAdmin' || user?.role === 'Teacher') && (
                                                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '999px', fontWeight: 700, background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' }}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                                    </div>

                                    {/* Admin / Teacher Switcher */}
                                    {(user?.role === 'Admin' || user?.role === 'Teacher' || user?.role === 'SuperAdmin') && (
                                        <Link
                                            to={user.role === 'Teacher' ? '/teacher' : '/admin'}
                                            onClick={() => setProfileOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
                                                borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                                                color: '#854d0e', background: '#fef9c3', border: '1px solid #fde047',
                                                textDecoration: 'none', marginBottom: '8px', transition: 'all 0.15s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef08a'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#fef9c3'}
                                        >
                                            <Shield style={{ width: '14px', height: '14px', color: '#a16207', flexShrink: 0 }} />
                                            <span>Switch to {user.role === 'Teacher' ? 'Teacher Portal' : 'Admin Console'}</span>
                                        </Link>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        {[
                                            { to: '/student/profile', Icon: User, label: 'Student Profile' },
                                            { to: '/student/progress', Icon: TrendingUp, label: 'My Progress & Grades' },
                                            { to: '/student/exams', Icon: Award, label: 'Exams & Submissions' }
                                        ].map(item => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                onClick={() => setProfileOpen(false)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
                                                    borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#334155',
                                                    textDecoration: 'none', transition: 'all 0.15s'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                                            >
                                                <item.Icon style={{ width: '14px', height: '14px', color: '#64748b', flexShrink: 0 }} />
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                                    padding: '8px 10px', borderRadius: '8px', fontSize: '13px',
                                                    fontWeight: 500, color: '#dc2626', background: 'transparent',
                                                    border: 'none', cursor: 'pointer', transition: 'all 0.15s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <LogOut style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                style={{
                                    padding: '7px',
                                    borderRadius: '8px',
                                    color: '#475569',
                                    background: mobileMenuOpen ? '#f1f5f9' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                aria-label="Toggle Navigation Menu"
                            >
                                {mobileMenuOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Navigation (Overlay on top of page) */}
                {mobileMenuOpen && (
                    <>
                        <div
                            className="lg:hidden fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-[1px] z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <div
                            className="lg:hidden absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-xl px-4 py-3 flex flex-col gap-1 z-50 animate-fadeIn"
                        >
                            {navLinks.map((link) => {
                                const active = isActive(link);
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            color: active ? '#0f172a' : '#475569',
                                            background: active ? '#f1f5f9' : 'transparent',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px 14px',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: active ? 600 : 500,
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <Icon style={{ width: '17px', height: '17px', color: active ? '#0f172a' : '#64748b' }} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default LMSNavbar;
