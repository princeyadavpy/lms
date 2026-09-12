import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const statusColorMap = {
    blue:   { badge: 'hl-badge-blue',   avatar: { background: 'var(--accent-blue)',   color: '#fff' } },
    green:  { badge: 'hl-badge-green',  avatar: { background: 'var(--accent-green)',  color: '#0a0e1a' } },
    red:    { badge: 'hl-badge-red',    avatar: { background: 'var(--accent-red)',    color: '#fff' } },
    orange: { badge: 'hl-badge-orange', avatar: { background: 'var(--accent-orange)', color: '#0a0e1a' } },
    default:{ badge: 'hl-badge-muted',  avatar: { background: 'rgba(255,255,255,0.1)',color: 'var(--text-primary)' } },
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
            label: 'Total Users', value: stats.totalUsers, accent: 'var(--accent-blue)',
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        },
        {
            label: 'Active Tests', value: stats.activeTests, accent: 'var(--accent-purple)',
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
        },
        {
            label: 'Pass Rate', value: `${stats.passRate}%`, accent: 'var(--accent-green)',
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-60">
                <div className="hl-spinner" style={{ width: '32px', height: '32px' }} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* Banner */}
            <div className="rounded-2xl p-7 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.12), rgba(124,92,252,0.08))', border: '1px solid rgba(79,142,247,0.2)' }}>
                <div className="absolute right-0 top-0 w-72 h-72 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(79,142,247,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(79,142,247,0.15)', color: 'var(--accent-blue)', border: '1px solid rgba(79,142,247,0.2)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
                        Admin Console
                    </div>
                    <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>System Overview</h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Monitor platform health and student activity in real time.</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map(({ label, value, accent, icon }) => (
                    <div key={label} className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: `1px solid ${accent}22` }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, color: accent }}>
                                {icon}
                            </div>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: accent, opacity: 0.4 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                        <p className="text-3xl font-black mb-1" style={{ color: accent }}>{value}</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="hl-table">
                        <thead>
                            <tr>
                                {['User', 'Action', 'Date', 'Status'].map(h => <th key={h}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {stats.activity.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No recent activity found.</td>
                                </tr>
                            ) : stats.activity.map((item, idx) => {
                                const colors = statusColorMap[item.statusColor] || statusColorMap.default;
                                return (
                                    <tr key={idx}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0" style={colors.avatar}>
                                                    {item.userInitial}
                                                </div>
                                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.userName}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{item.action}</td>
                                        <td style={{ color: 'var(--text-muted)' }} title={new Date(item.date).toLocaleString()}>{item.timeAgo}</td>
                                        <td><span className={`hl-badge ${colors.badge}`}>{item.status}</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;
