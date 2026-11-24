import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    Plus,
    Clock,
    User,
    CheckCircle2,
    Edit3,
    Trash2,
    Calendar,
    HelpCircle
} from 'lucide-react';

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
        <div className="space-y-6 animate-fadeInUp pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <span>Test & Assessment Management</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        View, monitor, and publish examination assessments across student batches.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                        {tests.length} Total Tests
                    </span>
                    <button
                        onClick={() => navigate('/teacher/create-test')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Test</span>
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="hl-spinner" style={{ width: '32px', height: '32px' }} />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64 text-red-500 font-bold text-sm">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <th className="py-3 px-6">Assessment Title</th>
                                    <th className="py-3 px-6">Author</th>
                                    <th className="py-3 px-6">Duration</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6">Created</th>
                                    <th className="py-3 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {tests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-12 text-slate-400">
                                            <div className="flex flex-col items-center space-y-2">
                                                <FileText className="w-10 h-10 text-slate-300" />
                                                <span className="font-bold text-slate-700">No assessments found</span>
                                                <button
                                                    onClick={() => navigate('/teacher/create-test')}
                                                    className="text-blue-600 text-xs font-bold hover:underline"
                                                >
                                                    + Create your first assessment
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tests.map(test => (
                                        <tr key={test._id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-6 font-bold text-slate-900 max-w-[240px] truncate" title={test.title}>
                                                {test.title}
                                            </td>
                                            <td className="py-3.5 px-6 font-medium text-slate-600">
                                                {test.createdBy?.name || 'Administrator'}
                                            </td>
                                            <td className="py-3.5 px-6 font-medium text-slate-600">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{test.duration} min</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <button
                                                    onClick={() => handleTogglePublish(test)}
                                                    title="Click to toggle publish"
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                                                        test.published
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : test.status === 'Completed'
                                                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}
                                                >
                                                    {test.published ? '✓ Published' : test.status === 'Completed' ? 'Completed' : 'Draft'}
                                                </button>
                                            </td>
                                            <td className="py-3.5 px-6 text-xs text-slate-400 font-medium whitespace-nowrap">
                                                {new Date(test.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="py-3.5 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/teacher/tests/${test._id}/questions`)}
                                                        className="px-3 py-1 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100/70 transition-colors cursor-pointer"
                                                    >
                                                        Manage
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(test._id, test.title)}
                                                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Delete test"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tests;
