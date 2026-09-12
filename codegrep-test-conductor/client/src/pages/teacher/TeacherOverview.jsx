import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const TeacherOverview = () => {
    const [stats, setStats] = useState({ myTests: 0, activeTests: 0, draftTests: 0 });
    const [recentTests, setRecentTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/tests');
                if (res.data.success) {
                    const tests = res.data.data;
                    setRecentTests(tests.slice(0, 6));
                    setStats({
                        myTests: tests.length,
                        activeTests: tests.filter(t => t.status === 'Active').length,
                        draftTests: tests.filter(t => t.status === 'Draft').length,
                    });
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const statCards = [
        {
            label: 'My Tests', value: stats.myTests, accent: 'var(--accent-purple)',
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
        },
        {
            label: 'Active Tests', value: stats.activeTests, accent: 'var(--accent-green)',
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        },
        {
            label: 'Draft Tests', value: stats.draftTests, accent: 'var(--accent-orange)',
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
        },
    ];

    const getStatusBadge = (status) => {
        const map = {
            'Active': 'hl-badge-green',
            'Draft': 'hl-badge-orange',
            'Closed': 'hl-badge-red',
        };
        return map[status] || 'hl-badge-muted';
    };

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* Welcome Banner */}
            <div className="rounded-2xl p-7 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.12), rgba(79,142,247,0.08))', border: '1px solid rgba(124,92,252,0.2)' }}>
                <div className="absolute right-0 top-0 w-80 h-80 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(124,92,252,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ background: 'rgba(124,92,252,0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(124,92,252,0.2)' }}>
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-purple)' }} />
                            Teacher Portal
                        </div>
                        <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Welcome back, Teacher!</h2>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your tests and track student performance.</p>
                    </div>
                    <Link to="/teacher/create-test" className="hl-btn-purple">
                        + Create New Test
                    </Link>
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
                        </div>
                        <p className="text-3xl font-black mb-1" style={{ color: accent }}>{loading ? '—' : value}</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Tests Table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>My Recent Tests</h3>
                    <Link to="/teacher/my-tests" className="text-sm font-medium transition-colors" style={{ color: 'var(--accent-purple)', textDecoration: 'none' }}>
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="hl-table">
                        <thead>
                            <tr>
                                {['Title', 'Duration', 'Status', 'Published', 'Created'].map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-10"><div className="hl-spinner mx-auto" /></td></tr>
                            ) : recentTests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <p style={{ color: 'var(--text-secondary)' }}>No tests yet.{' '}
                                            <Link to="/teacher/create-test" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}>Create your first test →</Link>
                                        </p>
                                    </td>
                                </tr>
                            ) : recentTests.map(test => (
                                <tr key={test._id}>
                                    <td className="font-semibold" style={{ color: 'var(--text-primary)' }}>{test.title}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{test.duration} min</td>
                                    <td><span className={`hl-badge ${getStatusBadge(test.status)}`}>{test.status}</span></td>
                                    <td><span className={`hl-badge ${test.published ? 'hl-badge-green' : 'hl-badge-muted'}`}>{test.published ? 'Yes' : 'No'}</span></td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(test.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherOverview;
