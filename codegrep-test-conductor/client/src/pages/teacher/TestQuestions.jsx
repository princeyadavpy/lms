import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

// ── Reusable form state ───────────────────────────────────────────
const emptyForm = () => ({
    title: '', description: '', marks: 10,
    difficulty: 'Medium',
    options: ['', '', '', ''],
    correctAnswer: '',
    testCases: [{ input: '', output: '', isHidden: false }],
    languageRestrictions: [],
});

const formFromQuestion = (q) => ({
    title: q.title || '',
    description: q.description || '',
    marks: q.marks || 10,
    difficulty: q.difficulty || 'Medium',
    options: q.options?.length ? [...q.options, ...Array(4).fill('')].slice(0, 4) : ['', '', '', ''],
    correctAnswer: q.correctAnswer || '',
    testCases: q.testCases?.length ? q.testCases : [{ input: '', output: '', isHidden: false }],
    languageRestrictions: q.languageRestrictions || [],
});

const DifficultyBadge = ({ d }) => {
    const cls = d === 'Easy' ? 'bg-[#10b981] text-[#000B1A]' : d === 'Hard' ? 'bg-[#ef4444] text-[#000B1A]' : 'bg-[#facc15] text-[#000B1A]';
    return d ? <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-none border-2 border-[#000B1A] font-black shadow-[2px_2px_0_0_#000B1A] ${cls}`}>{d}</span> : null;
};

const TestQuestions = () => {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loadingTest, setLoadingTest] = useState(true);
    const [questionType, setQuestionType] = useState('Coding');
    const [form, setForm] = useState(emptyForm());
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // expanded / edit state per question
    const [expandedId, setExpandedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(emptyForm());
    const [editType, setEditType] = useState('Coding');
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState(null);

    // Load test + questions
    useEffect(() => {
        if (!testId) return;
        api.get(`/tests/${testId}`)
            .then(res => {
                if (res.data.success) {
                    const t = res.data.data;
                    setTest(t);
                    setQuestions(t.questions || []);
                }
            })
            .catch(() => setError('Failed to load test.'))
            .finally(() => setLoadingTest(false));
    }, [testId]);

    const handleFormChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditFormChange = e => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // Test case helpers (Add form)
    const addTestCase = () => setForm(p => ({ ...p, testCases: [...p.testCases, { input: '', output: '', isHidden: false }] }));
    const removeTestCase = i => setForm(p => ({ ...p, testCases: p.testCases.filter((_, idx) => idx !== i) }));
    const updateTC = (i, field, val) => setForm(p => {
        const tc = [...p.testCases]; tc[i] = { ...tc[i], [field]: val }; return { ...p, testCases: tc };
    });

    // Test case helpers (Edit form)
    const addEditTestCase = () => setEditForm(p => ({ ...p, testCases: [...p.testCases, { input: '', output: '', isHidden: false }] }));
    const removeEditTestCase = i => setEditForm(p => ({ ...p, testCases: p.testCases.filter((_, idx) => idx !== i) }));
    const updateEditTC = (i, field, val) => setEditForm(p => {
        const tc = [...p.testCases]; tc[i] = { ...tc[i], [field]: val }; return { ...p, testCases: tc };
    });

    // MCQ option helpers
    const updateOption = (i, val) => setForm(p => {
        const opts = [...p.options]; opts[i] = val; return { ...p, options: opts };
    });
    const updateEditOption = (i, val) => setEditForm(p => {
        const opts = [...p.options]; opts[i] = val; return { ...p, options: opts };
    });

    const handleAdd = async e => {
        e.preventDefault();
        setError(null); setSuccessMsg(null);
        if (!form.title.trim()) return setError('Title is required.');
        if (questionType === 'Coding' && form.testCases.some(tc => !tc.input.trim() || !tc.output.trim())) {
            return setError('All test cases need input and expected output.');
        }
        if (questionType === 'MCQ' && !form.correctAnswer.trim()) {
            return setError('Select the correct answer.');
        }

        const payload = {
            type: questionType,
            title: form.title,
            description: form.description,
            marks: Number(form.marks),
            difficulty: form.difficulty,
            ...(questionType === 'MCQ'
                ? { options: form.options.filter(o => o.trim()), correctAnswer: form.correctAnswer }
                : { testCases: form.testCases, languageRestrictions: form.languageRestrictions }
            )
        };

        setSaving(true);
        try {
            const res = await api.post(`/questions/${testId}/add`, payload);
            if (res.data.success) {
                setQuestions(prev => [...prev, res.data.data]);
                setForm(emptyForm());
                setShowForm(false);
                setSuccessMsg(`✅ "${res.data.data.title}" added!`);
                setTimeout(() => setSuccessMsg(null), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add question.');
        } finally { setSaving(false); }
    };

    const handleDelete = async (qId, title) => {
        if (!window.confirm(`Delete "${title}"?`)) return;
        try {
            await api.delete(`/questions/${qId}`);
            setQuestions(prev => prev.filter(q => q._id !== qId));
        } catch { alert('Failed to delete question.'); }
    };

    const startEdit = (q) => {
        setEditingId(q._id);
        setEditType(q.type || 'Coding');
        setEditForm(formFromQuestion(q));
        setEditError(null);
        setExpandedId(null); // close expand when editing
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditError(null);
    };

    const handleUpdate = async (qId) => {
        setEditError(null);
        if (!editForm.title.trim()) return setEditError('Title is required.');
        if (editType === 'Coding' && editForm.testCases.some(tc => !tc.input.trim() || !tc.output.trim())) {
            return setEditError('All test cases need input and expected output.');
        }
        if (editType === 'MCQ' && !editForm.correctAnswer.trim()) {
            return setEditError('Select the correct answer.');
        }

        const payload = {
            type: editType,
            title: editForm.title,
            description: editForm.description,
            marks: Number(editForm.marks),
            difficulty: editForm.difficulty,
            ...(editType === 'MCQ'
                ? { options: editForm.options.filter(o => o.trim()), correctAnswer: editForm.correctAnswer }
                : { testCases: editForm.testCases, languageRestrictions: editForm.languageRestrictions }
            )
        };

        setEditSaving(true);
        try {
            const res = await api.put(`/questions/${qId}`, payload);
            if (res.data.success) {
                setQuestions(prev => prev.map(q => q._id === qId ? res.data.data : q));
                setEditingId(null);
                setSuccessMsg(`✅ "${res.data.data.title}" updated!`);
                setTimeout(() => setSuccessMsg(null), 3000);
            }
        } catch (err) {
            setEditError(err.response?.data?.msg || 'Failed to update question.');
        } finally { setEditSaving(false); }
    };

    if (loadingTest) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
    );

    const TestCaseEditor = ({ testCases, addFn, removeFn, updateFn }) => (
        <div className="border-2 border-[#000B1A] rounded-none bg-white p-4 space-y-3 shadow-[4px_4px_0_0_#000B1A]">
            <div className="flex justify-between items-center">
                <h4 className="font-black text-[#000B1A] uppercase tracking-wider text-sm">Test Cases ({testCases.length})</h4>
                <button type="button" onClick={addFn}
                    className="text-[#000B1A] text-[10px] font-black uppercase tracking-wider bg-white border-2 border-[#000B1A] px-3 py-1.5 rounded-none shadow-[2px_2px_0_0_#000B1A] hover:bg-[#000B1A]/5 transition-colors">
                    + Add Case
                </button>
            </div>
            {testCases.map((tc, i) => (
                <div key={i} className="bg-white rounded-none border-2 border-[#000B1A] p-3 space-y-2 shadow-[4px_4px_0_0_#000B1A]">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest">Case #{i + 1}</span>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={tc.isHidden} onChange={e => updateFn(i, 'isHidden', e.target.checked)} className="w-3.5 h-3.5 text-[#a855f7] border-2 border-[#000B1A] rounded-none bg-white" />
                                <span className="text-xs font-bold text-[#000B1A]/80">🔒 Hidden</span>
                            </label>
                            {testCases.length > 1 && (
                                <button type="button" onClick={() => removeFn(i)}
                                    className="text-[#000B1A] bg-[#ef4444] border-2 border-[#000B1A] text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000B1A] hover:-translate-y-0.5 px-2 py-1 rounded-none transition-transform">Remove</button>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest mb-1">Input (stdin)</label>
                            <textarea value={tc.input} onChange={e => updateFn(i, 'input', e.target.value)}
                                rows={3} placeholder="e.g. 2 7&#10;9"
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm font-mono font-bold shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform resize-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest mb-1">Expected Output</label>
                            <textarea value={tc.output} onChange={e => updateFn(i, 'output', e.target.value)}
                                rows={3} placeholder="e.g. 0 1"
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm font-mono font-bold shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform resize-none" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-5">
            {/* Breadcrumb + test title */}
            <div className="flex items-center gap-3 flex-wrap bg-white neo-panel border-[#000B1A] p-4">
                <Link to="/teacher/my-tests" className="text-[10px] uppercase tracking-widest text-[#000B1A]/70 hover:text-[#000B1A] font-black transition-colors">← My Tests</Link>
                <span className="text-[#000B1A]/60">/</span>
                <h1 className="text-xl font-black text-[#000B1A] uppercase tracking-widest">{test?.title || 'Test'}</h1>
                <span className={`px-2.5 py-1 rounded-none text-[10px] uppercase tracking-wider font-black ml-auto border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] ${test?.published ? 'bg-[#10b981] text-[#000B1A]' : 'bg-[#facc15] text-[#000B1A]'}`}>
                    {test?.published ? '✓ Published' : 'Draft'}
                </span>
                <span className="text-xs font-bold text-[#000B1A]/70">{test?.duration} min • {questions.length} questions</span>
            </div>

            {/* Test Settings section */}
            <div className="neo-panel border-[#000B1A] p-6 flex flex-wrap items-end gap-4 bg-white">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-2">Test Title</label>
                    <input value={test?.title || ''} onChange={e => setTest(p => ({ ...p, title: e.target.value }))}
                        className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-2">Duration (min)</label>
                    <input type="number" value={test?.duration || 0} onChange={e => setTest(p => ({ ...p, duration: e.target.value }))}
                        className="w-24 border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-2">Start Time</label>
                    <input type="datetime-local" value={test?.startTime ? new Date(new Date(test.startTime).getTime() - new Date(test.startTime).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                        onChange={e => setTest(p => ({ ...p, startTime: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                        className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[10px] uppercase font-bold text-[#000B1A] px-3 py-2 shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-2">End Time</label>
                    <input type="datetime-local" value={test?.endTime ? new Date(new Date(test.endTime).getTime() - new Date(test.endTime).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                        onChange={e => setTest(p => ({ ...p, endTime: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                        className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[10px] uppercase font-bold text-[#000B1A] px-3 py-2 shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-2">Max Attempts</label>
                    <input type="number" min="1" max="10" value={test?.config?.maxAttempts || 1}
                        onChange={e => {
                            const val = Number(e.target.value);
                            setTest(p => ({
                                ...p,
                                config: { ...(p.config || {}), maxAttempts: val }
                            }));
                        }}
                        className="w-24 border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                </div>
                <div className="w-full">
                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-2">Restricted Access Emails <span className="text-[#000B1A]/60 font-bold text-[9px]">(comma or newline separated)</span></label>
                    <textarea value={test?.config?.allowedEmails?.join(', ') || ''}
                        onChange={e => {
                            const emails = e.target.value.split(/[\n,]+/).map(em => em.trim()).filter(Boolean);
                            setTest(p => ({
                                ...p,
                                config: { ...(p.config || {}), allowedEmails: emails }
                            }));
                        }}
                        rows={2}
                        placeholder="Leave empty to allow anyone with the code..."
                        className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold resize-none" />
                </div>
                <button
                    onClick={async () => {
                        setSaving(true);
                        setError(null);
                        try {
                            const payload = {
                                title: test.title,
                                duration: Number(test.duration),
                                startTime: test.startTime,
                                endTime: test.endTime,
                                config: test.config
                            };
                            const res = await api.put(`/tests/${testId}`, payload);
                            if (res.data.success) {
                                setSuccessMsg('✅ Test settings updated!');
                                setTimeout(() => setSuccessMsg(null), 3000);
                            }
                        } catch (err) {
                            setError(err.response?.data?.msg || 'Failed to update test settings.');
                        }
                        finally { setSaving(false); }
                    }}
                    disabled={saving}
                    className="neo-button px-5 py-2 text-[10px] uppercase tracking-wider disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Student Attempt Overrides Section */}
            <div className="neo-panel border-[#000B1A] p-6 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-black text-[#000B1A] uppercase tracking-widest">Student Overrides</h3>
                        <p className="text-[10px] text-[#000B1A]/70 font-bold uppercase tracking-wider">Set custom attempt limits for specific students by email.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setTest(p => ({
                                ...p,
                                config: {
                                    ...(p.config || {}),
                                    studentOverrides: [...(p.config?.studentOverrides || []), { email: '', maxAttempts: 1 }]
                                }
                            }));
                        }}
                        className="text-[#000B1A] text-[10px] font-black uppercase tracking-wider bg-white border-2 border-[#000B1A] px-3 py-1.5 rounded-none shadow-[2px_2px_0_0_#000B1A] hover:bg-[#000B1A]/5 transition-colors"
                    >
                        + Add Override
                    </button>
                </div>

                {test?.config?.studentOverrides?.length > 0 && (
                    <div className="space-y-3">
                        {test.config.studentOverrides.map((override, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <input
                                    type="email"
                                    placeholder="student@example.com"
                                    value={override.email}
                                    onChange={e => {
                                        const newOverrides = [...test.config.studentOverrides];
                                        newOverrides[i].email = e.target.value;
                                        setTest(p => ({ ...p, config: { ...p.config, studentOverrides: newOverrides } }));
                                    }}
                                    className="flex-1 border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold"
                                />
                                <input
                                    type="number"
                                    min="1" max="10"
                                    value={override.maxAttempts}
                                    onChange={e => {
                                        const newOverrides = [...test.config.studentOverrides];
                                        newOverrides[i].maxAttempts = Number(e.target.value);
                                        setTest(p => ({ ...p, config: { ...p.config, studentOverrides: newOverrides } }));
                                    }}
                                    className="w-24 border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold"
                                />
                                <button
                                    onClick={() => {
                                        const newOverrides = test.config.studentOverrides.filter((_, idx) => idx !== i);
                                        setTest(p => ({ ...p, config: { ...p.config, studentOverrides: newOverrides } }));
                                    }}
                                    className="text-[#000B1A] bg-[#ef4444] border-2 border-[#000B1A] text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000B1A] hover:-translate-y-0.5 p-2 rounded-none transition-transform"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                        <p className="text-[10px] text-[#facc15] mt-2 font-black uppercase tracking-widest">⚠️ Don't forget to click "Save Settings" above to apply overrides.</p>
                    </div>
                )}
            </div>

            {successMsg && (
                <div className="bg-[#10b981] border-2 border-[#0d0a1c] text-[#000B1A] rounded-none px-4 py-3 text-sm font-black shadow-[4px_4px_0_0_#0d0a1c]">{successMsg}</div>
            )}

            {/* Question list */}
            <div className="neo-panel border-[#000B1A] overflow-hidden bg-white">
                <div className="px-6 py-4 border-b-2 border-[#000B1A] flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-[#000B1A] uppercase tracking-widest">Questions ({questions.length})</h2>
                        <p className="text-[10px] text-[#000B1A]/70 font-bold uppercase tracking-wider mt-0.5">Total marks: {questions.reduce((s, q) => s + (q.marks || 0), 0)} pts</p>
                    </div>
                    <button onClick={() => { setShowForm(f => !f); setError(null); }}
                        className="neo-button px-4 py-2 text-[10px] uppercase tracking-wider">
                        {showForm ? '✕ Cancel' : '+ Add Question'}
                    </button>
                </div>

                {questions.length === 0 && !showForm ? (
                    <div className="flex flex-col items-center justify-center py-16 text-[#000B1A]/70">
                        <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p className="font-black uppercase tracking-wider text-[#000B1A]">No questions yet</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-[#000B1A]/60">Click "+ Add Question" to get started</p>
                    </div>
                ) : (
                    <div className="divide-y-2 divide-white/80">
                        {questions.map((q, i) => (
                            <div key={q._id}>
                                {/* ── Row ── */}
                                <div className="px-6 py-4 flex items-center justify-between hover:bg-[#000B1A]/5 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-7 h-7 rounded-none border-2 border-[#000B1A] bg-[#3b82f6] text-[#000B1A] text-xs font-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_#000B1A]">{i + 1}</span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-[#000B1A] truncate">{q.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border-2 border-[#000B1A] font-black shadow-[2px_2px_0_0_#000B1A] ${q.type === 'Coding' ? 'bg-[#a855f7] text-[#000B1A]' : 'bg-[#3b82f6] text-[#000B1A]'}`}>{q.type}</span>
                                                <span className="text-[10px] font-bold text-[#000B1A]/70 uppercase tracking-wider">{q.marks} pts</span>
                                                <DifficultyBadge d={q.difficulty} />
                                                {q.type === 'Coding' && <span className="text-[10px] font-bold text-[#000B1A]/70 uppercase tracking-wider">{q.testCases?.length ?? 0} test cases</span>}
                                                {q.type === 'MCQ' && <span className="text-[10px] font-bold text-[#000B1A]/70 uppercase tracking-wider">{q.options?.length ?? 0} options</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                        {/* Toggle expand */}
                                        <button
                                            onClick={() => { setExpandedId(expandedId === q._id ? null : q._id); setEditingId(null); }}
                                            className="text-[#000B1A] hover:text-[#000B1A] hover:bg-[#3b82f6] px-3 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-[10px] uppercase tracking-wider font-black transition-colors">
                                            {expandedId === q._id ? '▲ Hide' : '▼ View'}
                                        </button>
                                        <button
                                            onClick={() => startEdit(q)}
                                            className="text-[#000B1A] hover:text-[#000B1A] hover:bg-[#3b82f6] px-3 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-[10px] uppercase tracking-wider font-black transition-colors">
                                            ✏️ Edit
                                        </button>
                                        <button onClick={() => handleDelete(q._id, q.title)}
                                            className="text-[#000B1A] hover:text-[#000B1A] hover:bg-[#ef4444] px-3 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-[10px] uppercase tracking-wider font-black transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* ── Expanded View ── */}
                                {expandedId === q._id && editingId !== q._id && (
                                    <div className="px-6 pb-6 bg-white border-t-2 border-[#000B1A] space-y-4 pt-4">
                                        {q.description && (
                                            <div>
                                                <p className="text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest mb-1">Description</p>
                                                <pre className="text-sm text-[#000B1A] whitespace-pre-wrap font-bold bg-white border-2 border-[#000B1A] rounded-none p-3 shadow-[4px_4px_0_0_#000B1A]">{q.description}</pre>
                                            </div>
                                        )}

                                        {q.type === 'MCQ' && (
                                            <div>
                                                <p className="text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest mb-2">Options</p>
                                                <div className="space-y-1.5">
                                                    {q.options?.map((opt, oi) => (
                                                        <div key={oi} className={`flex items-center gap-2 px-3 py-2 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-sm font-bold ${opt === q.correctAnswer ? 'bg-[#10b981] text-[#000B1A]' : 'bg-white text-[#000B1A]'}`}>
                                                            <span className="font-bold w-5">{String.fromCharCode(65 + oi)}.</span>
                                                            {opt}
                                                            {opt === q.correctAnswer && <span className="ml-auto text-[#000B1A] text-xs font-black uppercase tracking-wider">✓ Correct</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {q.type === 'Coding' && q.testCases?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest mb-2">Test Cases ({q.testCases.length})</p>
                                                <div className="space-y-2">
                                                    {q.testCases.map((tc, ti) => (
                                                        <div key={ti} className="bg-white border-2 border-[#000B1A] rounded-none p-3 shadow-[4px_4px_0_0_#000B1A]">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-xs font-bold text-[#000B1A]/60">Case #{ti + 1}</span>
                                                                {tc.isHidden && <span className="text-[10px] bg-[#f97316] text-[#000B1A] px-2 py-0.5 rounded-none border-2 border-[#000B1A] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000B1A]">🔒 Hidden</span>}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <p className="text-[10px] text-[#000B1A]/70 font-black uppercase tracking-widest mb-1">Input</p>
                                                                    <pre className="text-xs bg-white border-2 border-[#000B1A] rounded-none px-2 py-1.5 font-mono font-bold text-[#000B1A] whitespace-pre-wrap">{tc.input || '(empty)'}</pre>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-[#000B1A]/70 font-black uppercase tracking-widest mb-1">Expected Output</p>
                                                                    <pre className="text-xs bg-white border-2 border-[#000B1A] rounded-none px-2 py-1.5 font-mono font-bold text-[#000B1A] whitespace-pre-wrap">{tc.output || '(empty)'}</pre>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── Inline Edit Form ── */}
                                {editingId === q._id && (
                                    <div className="px-6 pb-6 bg-white border-t-2 border-[#000B1A] space-y-4 pt-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-black uppercase tracking-widest text-[#000B1A] text-sm">✏️ Edit Question</h4>
                                            <button onClick={cancelEdit} className="text-[#000B1A]/70 hover:text-[#000B1A] text-sm font-bold">✕ Cancel</button>
                                        </div>

                                        {editError && <div className="bg-[#ef4444] border-2 border-[#0d0a1c] text-[#000B1A] rounded-none px-4 py-2 text-sm font-black shadow-[4px_4px_0_0_#0d0a1c]">{editError}</div>}

                                        {/* Type selector */}
                                        <div className="flex gap-3">
                                            {['Coding', 'MCQ'].map(type => (
                                                <button key={type} type="button" onClick={() => setEditType(type)}
                                                    className={`flex-1 py-2.5 rounded-none text-sm font-black border-2 border-[#000B1A] shadow-[4px_4px_0_0_#000B1A] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] ${editType === type
                                                        ? (type === 'Coding' ? 'bg-[#a855f7] text-[#000B1A]' : 'bg-[#3b82f6] text-[#000B1A]')
                                                        : 'bg-white text-[#000B1A] hover:bg-[#000B1A]/5'}`}>
                                                    {type === 'Coding' ? '💻 Coding' : '🔤 MCQ'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Title + Marks + Difficulty */}
                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                            <div className="md:col-span-3">
                                                <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Title *</label>
                                                <input name="title" value={editForm.title} onChange={handleEditFormChange}
                                                    className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Marks</label>
                                                <input name="marks" type="number" min="1" value={editForm.marks} onChange={handleEditFormChange}
                                                    className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Difficulty</label>
                                                <select name="difficulty" value={editForm.difficulty} onChange={handleEditFormChange}
                                                    className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                                    {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Description / Problem Statement</label>
                                            <textarea name="description" value={editForm.description} onChange={handleEditFormChange} rows={4}
                                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold resize-none font-mono" />
                                        </div>

                                        {/* MCQ Options */}
                                        {editType === 'MCQ' && (
                                            <div className="border-2 border-[#000B1A] rounded-none bg-white p-4 space-y-3 shadow-[4px_4px_0_0_#000B1A]">
                                                <h4 className="font-black uppercase tracking-wider text-[#000B1A] text-sm">Answer Options</h4>
                                                {editForm.options.map((opt, oi) => (
                                                    <div key={oi} className="flex items-center gap-3">
                                                        <span className="w-7 h-7 rounded-none bg-white border-2 border-[#000B1A] flex items-center justify-center text-sm font-black text-[#000B1A] flex-shrink-0 shadow-[2px_2px_0_0_#000B1A]">{String.fromCharCode(65 + oi)}</span>
                                                        <input value={opt} onChange={e => updateEditOption(oi, e.target.value)}
                                                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                                            className="flex-1 w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                                                    </div>
                                                ))}
                                                <div>
                                                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Correct Answer *</label>
                                                    <select name="correctAnswer" value={editForm.correctAnswer} onChange={handleEditFormChange}
                                                        className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                                        <option value="">-- Select correct answer --</option>
                                                        {editForm.options.filter(o => o.trim()).map((opt, oi) => (
                                                            <option key={oi} value={opt}>{String.fromCharCode(65 + oi)}: {opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* Test Cases */}
                                        {editType === 'Coding' && (
                                            <TestCaseEditor
                                                testCases={editForm.testCases}
                                                addFn={addEditTestCase}
                                                removeFn={removeEditTestCase}
                                                updateFn={updateEditTC}
                                            />
                                        )}

                                        <div className="flex justify-end gap-3 pt-1">
                                            <button type="button" onClick={cancelEdit}
                                                className="px-5 py-2 border-2 border-[#000B1A] rounded-none text-sm font-black text-[#000B1A] shadow-[4px_4px_0_0_#000B1A] hover:bg-[#000B1A]/5 transition-colors">
                                                Cancel
                                            </button>
                                            <button type="button" onClick={() => handleUpdate(q._id)} disabled={editSaving}
                                                className="neo-button px-8 py-2 text-sm disabled:opacity-60">
                                                {editSaving ? 'Saving...' : '✓ Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Question Form (inline, collapsible) */}
            {showForm && (
                <div className="neo-panel border-[#000B1A] overflow-hidden bg-white mt-6">
                    <div className="px-6 py-4 border-b-2 border-[#000B1A]">
                        <h3 className="font-black text-[#000B1A] uppercase tracking-widest text-lg">New Question</h3>
                    </div>
                    <form onSubmit={handleAdd} className="p-6 space-y-5">
                        {error && <div className="bg-[#ef4444] border-2 border-[#0d0a1c] text-[#000B1A] rounded-none px-4 py-3 text-sm font-black shadow-[4px_4px_0_0_#0d0a1c]">{error}</div>}

                        {/* Type selector */}
                        <div className="flex gap-3">
                            {['Coding', 'MCQ'].map(type => (
                                <button key={type} type="button" onClick={() => setQuestionType(type)}
                                    className={`flex-1 py-3 rounded-none text-sm font-black border-2 border-[#000B1A] shadow-[4px_4px_0_0_#000B1A] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] ${questionType === type
                                        ? (type === 'Coding' ? 'bg-[#a855f7] text-[#000B1A]' : 'bg-[#3b82f6] text-[#000B1A]')
                                        : 'bg-white text-[#000B1A] hover:bg-[#000B1A]/5'}`}>
                                    {type === 'Coding' ? '💻 Coding' : '🔤 MCQ'}
                                </button>
                            ))}
                        </div>

                        {/* Title + Marks + Difficulty */}
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Title *</label>
                                <input name="title" value={form.title} onChange={handleFormChange} required
                                    placeholder="e.g. Two Sum"
                                    className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Marks</label>
                                <input name="marks" type="number" min="1" value={form.marks} onChange={handleFormChange}
                                    className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Difficulty</label>
                                <select name="difficulty" value={form.difficulty} onChange={handleFormChange}
                                    className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                    {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Description / Problem Statement</label>
                            <textarea name="description" value={form.description} onChange={handleFormChange} rows={4}
                                placeholder={questionType === 'Coding'
                                    ? 'Problem statement with constraints and examples...'
                                    : 'Full question text...'}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold resize-none font-mono" />
                        </div>

                        {/* MCQ Options */}
                        {questionType === 'MCQ' && (
                            <div className="border-2 border-[#000B1A] rounded-none p-5 space-y-4 bg-white shadow-[4px_4px_0_0_#000B1A]">
                                <h4 className="font-black uppercase tracking-wider text-[#000B1A] text-sm">Answer Options</h4>
                                {form.options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-none border-2 border-[#000B1A] bg-white flex items-center justify-center text-sm font-black text-[#000B1A] flex-shrink-0 shadow-[2px_2px_0_0_#000B1A]">{String.fromCharCode(65 + i)}</span>
                                        <input value={opt} onChange={e => updateOption(i, e.target.value)}
                                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                            className="flex-1 w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Correct Answer *</label>
                                    <select name="correctAnswer" value={form.correctAnswer} onChange={handleFormChange}
                                        className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                        <option value="">-- Select correct answer --</option>
                                        {form.options.filter(o => o.trim()).map((opt, i) => (
                                            <option key={i} value={opt}>{String.fromCharCode(65 + i)}: {opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Test Cases */}
                        {questionType === 'Coding' && (
                            <TestCaseEditor
                                testCases={form.testCases}
                                addFn={addTestCase}
                                removeFn={removeTestCase}
                                updateFn={updateTC}
                            />
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => { setShowForm(false); setError(null); }}
                                className="px-5 py-2.5 border-2 border-[#000B1A] rounded-none text-sm font-black text-[#000B1A] shadow-[4px_4px_0_0_#000B1A] hover:bg-[#000B1A]/5 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={saving}
                                className="neo-button px-8 py-2.5 text-sm disabled:opacity-60">
                                {saving ? 'Adding...' : '+ Add Question'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TestQuestions;
