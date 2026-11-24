import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import {
    Users,
    FileCheck2,
    TrendingUp,
    ArrowUpRight,
    Sparkles,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Activity
} from 'lucide-react';

const statusConfig = {
    green: {
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        avatarBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        icon: CheckCircle2
    },
    red: {
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
        avatarBg: 'bg-red-50 text-red-700 border border-red-200',
        icon: XCircle
    },
    orange: {
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        avatarBg: 'bg-amber-50 text-amber-700 border border-amber-200',
        icon: AlertCircle
    },
    blue: {
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        avatarBg: 'bg-blue-50 text-blue-700 border border-blue-200',
        icon: Activity
    },
    default: {
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        avatarBg: 'bg-slate-100 text-slate-700 border border-slate-200',
        icon: Activity
    }
};

const Overview = () => {
    const [stats, setStats] = useState({ totalUsers: 0, activeTests: 0, passRate: 0, activity: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                if (res.data.success) setStats(res.data.data);
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: '#2563eb',
            bgColor: '#eff6ff',
            borderColor: '#bfdbfe',
            badge: 'Platform wide'
        },
        {
            label: 'Active Tests',
            value: stats.activeTests,
            icon: FileCheck2,
            color: '#7c3aed',
            bgColor: '#f5f3ff',
            borderColor: '#ddd6fe',
            badge: 'Live & Published'
        },
        {
            label: 'Pass Rate',
            value: `${stats.passRate}%`,
            icon: TrendingUp,
            color: '#059669',
            bgColor: '#ecfdf5',
            borderColor: '#a7f3d0',
            badge: 'Historical avg'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="hl-spinner" style={{ width: '32px', height: '32px' }} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp pb-12">
            {/* ── Banner ────────────────────────────────────────────── */}
            <div
                className="rounded-3xl p-8 relative overflow-hidden bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f5f3ff 100%)',
                    border: '1px solid #bfdbfe'
                }}
            >
                {/* Ambient glow decoration */}
                <div
                    className="absolute right-0 top-0 w-80 h-80 pointer-events-none rounded-full blur-3xl opacity-60"
                    style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }}
                />

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 mb-3.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100/70 text-blue-700 border border-blue-200">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span>Admin Console</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                        System Overview
                    </h2>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        Monitor platform health, multi-tenant institutions, assessment throughput, and student activity in real time.
                    </p>
                </div>
            </div>

            {/* ── Stat Cards ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {statCards.map(({ label, value, icon: Icon, color, bgColor, borderColor, badge }) => (
                    <div
                        key={label}
                        className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border"
                                style={{ background: bgColor, color: color, borderColor: borderColor }}
                            >
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                                {badge}
                            </span>
                        </div>
                        <p className="text-3xl font-black tracking-tight mb-1" style={{ color: color }}>
                            {value}
                        </p>
                        <p className="text-sm font-bold text-slate-600">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Recent Activity Table ─────────────────────────────── */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <h3 className="font-bold text-base text-slate-900">Recent Activity</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Live platform events</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <th className="py-3 px-6">User</th>
                                <th className="py-3 px-6">Action</th>
                                <th className="py-3 px-6">Date</th>
                                <th className="py-3 px-6 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {stats.activity.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                                        No recent activity recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                stats.activity.map((item, idx) => {
                                    const conf = statusConfig[item.statusColor] || statusConfig.default;
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${conf.avatarBg}`}>
                                                        {item.userInitial}
                                                    </div>
                                                    <span className="font-bold text-slate-900">{item.userName}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 font-medium text-slate-600">
                                                {item.action}
                                            </td>
                                            <td className="py-3.5 px-6 text-xs text-slate-400 font-medium" title={new Date(item.date).toLocaleString()}>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{item.timeAgo}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 text-right">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${conf.badgeClass}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;
