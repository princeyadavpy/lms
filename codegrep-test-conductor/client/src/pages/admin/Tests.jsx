import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const statusBadge = (status) => {
    const colors = {
        Active: 'bg-[#10b981] text-[#000B1A]',
        Draft: 'bg-[#facc15] text-[#000B1A]',
        Completed: 'bg-white text-[#000B1A]',
    };
    return `px-2.5 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-[10px] font-black uppercase tracking-wider ${colors[status] || 'bg-white text-[#000B1A]'}`;
};

const Tests = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/tests');
            if (res.data.success) setTests(res.data.data);
        } catch { setError('Failed to load tests.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTests(); }, []);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete test "${title}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/admin/tests/${id}`);
            setTests(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to delete test');
        }
    };

    const handleTogglePublish = async (test) => {
        try {
            const res = await api.put(`/tests/${test._id}`, { published: !test.published });
            if (res.data.success) {
                setTests(prev => prev.map(t => t._id === test._id ? { ...t, published: !t.published } : t));
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to update');
        }
    };

    return (
        <div className="neo-panel bg-white border-[#000B1A] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b-2 border-[#000B1A] flex flex-wrap justify-between items-center gap-3">
                <div>
                    <h2 className="text-xl font-black text-[#000B1A] uppercase tracking-widest">Test Management</h2>
                    <p className="text-[10px] text-[#000B1A]/70 font-bold uppercase tracking-wider mt-0.5">View and manage all platform assessments</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#000B1A] bg-white px-3 py-1 border-2 border-[#000B1A] rounded-none shadow-[2px_2px_0_0_#000B1A] uppercase tracking-wider">{tests.length} tests</span>
                    <button
                        onClick={() => navigate('/teacher/create-test')}
                        className="neo-button px-4 py-2 text-[10px] uppercase tracking-wider"
                    >
                        + Create Test
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-none h-8 w-8 border-b-4 border-[#000B1A]" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-64 text-[#ef4444] font-black uppercase tracking-wider">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-[#000B1A] bg-[#000B1A]/5">
                                {['Title', 'Created By', 'Duration', 'Status', 'Created', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-black text-[#000B1A] uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-white/80">
                            {tests.length === 0 ? (
                                <tr><td colSpan="6" className="text-center p-12 text-[#000B1A]">
                                    <div className="flex flex-col items-center space-y-2">
                                        <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        <span className="font-black uppercase tracking-widest text-sm">No tests found</span>
                                        <button onClick={() => navigate('/teacher/create-test')} className="mt-2 text-[#3b82f6] text-[10px] uppercase font-black tracking-wider hover:text-[#000B1A] transition-colors">
                                            + Create your first test
                                        </button>
                                    </div>
                                </td></tr>
                            ) : tests.map(test => (
                                <tr key={test._id} className="hover:bg-[#000B1A]/5 transition-colors">
                                    <td className="px-5 py-4 font-black text-[#000B1A] text-sm max-w-[180px] truncate" title={test.title}>{test.title}</td>
                                    <td className="px-5 py-4 text-[#000B1A]/70 font-bold text-sm">{test.createdBy?.name || '—'}</td>
                                    <td className="px-5 py-4 text-[#000B1A]/70 font-bold text-sm">{test.duration} min</td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => handleTogglePublish(test)}
                                            title="Click to toggle publish"
                                            className={`px-2.5 py-1 rounded-none border-2 shadow-[2px_2px_0_0_#000B1A] text-[10px] font-black uppercase tracking-wider transition-colors hover:-translate-y-0.5 ${test.published
                                                ? 'bg-[#10b981] text-[#000B1A] border-[#000B1A]'
                                                : test.status === 'Completed'
                                                    ? 'bg-white text-[#000B1A] border-[#000B1A]'
                                                    : 'bg-[#facc15] text-[#000B1A] border-[#000B1A]'
                                                }`}>
                                            {test.published ? '✓ Published' : test.status === 'Completed' ? 'Completed' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 text-[#000B1A]/70 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                        {new Date(test.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            {/* Manage → goes to teacher portal add-question page */}
                                            <button
                                                onClick={() => navigate(`/teacher/tests/${test._id}/questions`)}
                                                className="text-[#000B1A] hover:text-[#000B1A] hover:bg-[#3b82f6] px-3 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-[10px] uppercase tracking-wider font-black transition-colors"
                                            >
                                                Manage
                                            </button>
                                            <button
                                                onClick={() => handleDelete(test._id, test.title)}
                                                className="text-[#000B1A] hover:text-[#000B1A] hover:bg-[#ef4444] px-3 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-[10px] uppercase tracking-wider font-black transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Tests;
