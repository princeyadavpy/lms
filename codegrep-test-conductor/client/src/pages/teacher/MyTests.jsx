import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const statusBadge = (status) => {
    const colors = { Active: 'bg-[#10b981] text-[#000B1A]', Draft: 'bg-[#facc15] text-[#000B1A]', Completed: 'bg-white text-[#000B1A]' };
    return `px-2.5 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-xs font-black uppercase tracking-wider ${colors[status] || 'bg-white text-[#000B1A]'}`;
};

const MyTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState({});
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        api.get('/tests').then(res => {
            if (res.data.success) setTests(res.data.data);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handlePublish = async (id) => {
        setPublishing(prev => ({ ...prev, [id]: true }));
        try {
            const res = await api.patch(`/tests/${id}/publish`);
            if (res.data.success) {
                setTests(prev => prev.map(t => t._id === id ? res.data.data : t));
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to update publish status.');
        } finally {
            setPublishing(prev => ({ ...prev, [id]: false }));
        }
    };

    const copyCode = (code, id) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(id);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    return (
        <div className="neo-panel border-[#000B1A] overflow-hidden">
            <div className="p-6 border-b-2 border-[#000B1A] flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-[#000B1A]">My Tests</h2>
                    <p className="text-sm text-[#000B1A]/70 font-bold mt-0.5">All assessments you have created</p>
                </div>
                <Link to="/teacher/create-test" className="neo-button px-4 py-2 text-sm">
                    + New Test
                </Link>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-none h-7 w-7 border-b-4 border-[#000B1A]"></div></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b-2 border-[#000B1A]">
                                {['Title', 'Duration', 'Status', 'Access Code', 'Questions', 'Created', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-black text-[#000B1A] uppercase tracking-[0.1em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-white/80">
                            {tests.length === 0 ? (
                                <tr><td colSpan="7" className="text-center p-10 text-[#000B1A]/70 font-bold">
                                    No tests yet. <Link to="/teacher/create-test" className="text-[#000B1A] hover:text-[#3b82f6] font-black">Create your first test →</Link>
                                </td></tr>
                            ) : tests.map(test => (
                                <tr key={test._id} className="hover:bg-[#000B1A]/5 transition-colors">
                                    <td className="px-5 py-4 font-bold text-[#000B1A] max-w-[160px] truncate">{test.title}</td>
                                    <td className="px-5 py-4 text-[#000B1A]/80 text-sm font-bold">{test.duration} min</td>
                                    <td className="px-5 py-4"><span className={statusBadge(test.status)}>{test.status}</span></td>
                                    <td className="px-5 py-4">
                                        {test.published && test.accessCode ? (
                                            <div className="flex items-center space-x-1.5">
                                                <span className="font-mono font-black text-[#000B1A] bg-[#3b82f6] border-2 border-[#0d0a1c] px-2.5 py-1 rounded-none text-sm tracking-widest shadow-[2px_2px_0_0_#0d0a1c]">
                                                    {test.accessCode}
                                                </span>
                                                <button
                                                    onClick={() => copyCode(test.accessCode, test._id)}
                                                    title="Copy code"
                                                    className="text-[#000B1A]/70 hover:text-[#000B1A] transition-colors p-1"
                                                >
                                                    {copied === test._id ? (
                                                        <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-[#000B1A]/70 font-bold">Not published</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-[#000B1A]/70 text-sm font-bold">{test.questions?.length ?? 0}</td>
                                    <td className="px-5 py-4 text-[#000B1A]/70 text-sm whitespace-nowrap font-bold">{new Date(test.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handlePublish(test._id)}
                                                disabled={!!publishing[test._id]}
                                                className={`text-xs font-black px-3 py-1.5 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] transition-colors disabled:opacity-60 ${test.published
                                                    ? 'bg-[#f97316] text-[#000B1A]'
                                                    : 'bg-[#10b981] text-[#000B1A]'
                                                    }`}
                                            >
                                                {publishing[test._id] ? '...' : test.published ? 'Unpublish' : 'Publish'}
                                            </button>
                                            <Link
                                                to={`/teacher/tests/${test._id}/questions`}
                                                className="text-xs font-black px-3 py-1.5 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] bg-[#3b82f6] text-[#000B1A] transition-colors"
                                            >
                                                Questions
                                            </Link>
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

export default MyTests;
