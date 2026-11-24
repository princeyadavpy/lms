import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../api/axios';
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
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await api.get('/notifications/my');
            if (res.data?.success) {
                setNotifications(res.data.data || []);
                setUnreadCount(res.data.unreadCount || 0);
            }
        } catch {
            // Keep existing state on network error
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user?._id]);

    const handleMarkRead = async (notif) => {
        if (!notif.isRead) {
            setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            api.patch(`/notifications/${notif._id}/read`).catch(() => {});
        }
        setNotifOpen(false);
        if (notif.link) navigate(notif.link);
    };

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        api.patch('/notifications/read-all').catch(() => {});
    };

    const formatNotifTime = (dateStr) => {
        if (!dateStr) return 'Just now';
        const diffMins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

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
            <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-2 h-16">

                    {/* ── Logo + Nav Links ─────────────────────────── */}
                    <div className="flex items-center gap-2 lg:gap-6 xl:gap-8 min-w-0 flex-1">
                        <Link to="/student" className="flex items-center gap-2 sm:gap-3 no-underline group min-w-0" style={{ textDecoration: 'none' }}>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                                <img src={companyLogo} alt="HiGen Labs" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <span
                                    className="text-base sm:text-[22px] font-black tracking-tight leading-none text-slate-950 font-serif truncate"
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

                        {/* Exam Button (Tablet & Desktop top bar; moved into mobile menu on < sm) */}
                        <Link
                            to="/student/exams"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#0f172a] hover:bg-[#1e293b] shadow-2xs no-underline transition-all shrink-0"
                        >
                            <Award className="w-3.5 h-3.5 shrink-0" />
                            <span>Exam</span>
                        </Link>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    const next = !notifOpen;
                                    setNotifOpen(next);
                                    setProfileOpen(false);
                                    if (next) fetchNotifications();
                                }}
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
                                {unreadCount > 0 && (
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
                                )}
                            </button>

                            {notifOpen && (
                                <div className="fixed left-4 right-4 top-[70px] sm:left-auto sm:top-auto sm:absolute sm:right-0 sm:mt-2 sm:w-[340px] animate-fadeInUp" style={{
                                    borderRadius: '14px', padding: '16px', zIndex: 100,
                                    background: '#ffffff', border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.1)'
                                }}>
                                    <div className="flex items-center justify-between pb-3 mb-3 gap-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <div className="flex items-center gap-2">
                                            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', margin: 0 }}>Notifications</h4>
                                            {unreadCount > 0 && (
                                                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', fontWeight: 700, background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' }}>
                                                    {unreadCount} New
                                                </span>
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={handleMarkAllRead}
                                                className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-72 overflow-y-auto flex flex-col gap-2 text-[13px]">
                                        {notifications.length === 0 ? (
                                            <div className="py-6 text-center text-xs text-slate-500">
                                                No notifications yet. You will be notified when courses or approvals arrive.
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <button
                                                    key={n._id}
                                                    type="button"
                                                    onClick={() => handleMarkRead(n)}
                                                    className="w-full text-left cursor-pointer transition-colors"
                                                    style={{
                                                        padding: '10px 12px',
                                                        borderRadius: '10px',
                                                        background: n.isRead ? '#f8fafc' : '#eff6ff',
                                                        border: n.isRead ? '1px solid #f1f5f9' : '1px solid #bfdbfe'
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                                        <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{n.title}</p>
                                                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                                                    </div>
                                                    <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px', lineHeight: 1.4 }}>{n.body}</p>
                                                    <span style={{ color: '#2563eb', fontSize: '11px', fontWeight: 600 }}>{formatNotifTime(n.createdAt)}</span>
                                                </button>
                                            ))
                                        )}
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
                            <Link
                                to="/student/exams"
                                onClick={() => setMobileMenuOpen(false)}
                                className="sm:hidden mt-1.5 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-[#0f172a] hover:bg-[#1e293b] shadow-2xs no-underline transition-all"
                            >
                                <Award className="w-4 h-4 shrink-0" />
                                <span>Exam</span>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default LMSNavbar;
