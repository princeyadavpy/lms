import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const STUB_LANGUAGES = [
    { key: 'python',     label: 'Python',     placeholder: 'def solution(nums: list[int], target: int) -> list[int]:\n    # your code here\n    pass' },
    { key: 'cpp',        label: 'C++',        placeholder: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> solution(vector<int>& nums, int target) {\n    // your code here\n}' },
    { key: 'java',       label: 'Java',       placeholder: 'class Solution {\n    public int[] solution(int[] nums, int target) {\n        // your code here\n        return new int[]{};\n    }\n}' },
    { key: 'javascript', label: 'JS',         placeholder: 'function solution(nums, target) {\n  // your code here\n  return [];\n}' },
    { key: 'c',          label: 'C',          placeholder: '#include <stdio.h>\n\nvoid solution(int* nums, int numsSize, int target) {\n    // your code here\n}' },
    { key: 'typescript', label: 'TS',         placeholder: 'function solution(nums: number[], target: number): number[] {\n  // your code here\n  return [];\n}' },
    { key: 'go',         label: 'Go',         placeholder: 'package main\n\nfunc solution(nums []int, target int) []int {\n    // your code here\n    return []int{}\n}' },
];

const emptyStarter = () => ({ python: '', cpp: '', java: '', javascript: '', c: '', typescript: '', go: '' });

const formFromQuestion = (q) => ({
    title: q.title || '',
    description: q.description || '',
    marks: q.marks || 10,
    difficulty: q.difficulty || 'Medium',
    options: q.options?.length ? [...q.options, ...Array(4).fill('')].slice(0, 4) : ['', '', '', ''],
    correctAnswer: q.correctAnswer || '',
    testCases: q.testCases?.length ? q.testCases : [{ input: '', output: '', isHidden: false }],
    languageRestrictions: q.languageRestrictions || [],
    starterCode: q.starterCode ? Object.fromEntries(Object.entries(q.starterCode)) : emptyStarter(),
});

const DifficultyBadge = ({ d }) => {
    const cls = d === 'Easy' ? 'bg-[#10b981] text-[#000B1A]' : d === 'Hard' ? 'bg-[#ef4444] text-[#000B1A]' : 'bg-[#facc15] text-[#000B1A]';
    return d ? <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-none border-2 border-[#000B1A] font-black shadow-[2px_2px_0_0_#000B1A] ${cls}`}>{d}</span> : null;
};

const AddQuestion = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [questionType, setQuestionType] = useState('Coding');
    const [form, setForm] = useState({
        title: '',
        description: '',
        marks: 10,
        options: ['', '', '', ''],
        correctAnswer: '',
        testCases: [{ input: '', output: '', isHidden: false }],
        languageRestrictions: [],
        starterCode: emptyStarter(),
    });
    const [activeStubLang, setActiveStubLang] = useState('javascript');
    const [editActiveStubLang, setEditActiveStubLang] = useState('javascript');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [existingQuestions, setExistingQuestions] = useState([]);
    // expand / edit state
    const [expandedId, setExpandedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editType, setEditType] = useState('Coding');
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState(null);

    // Fetch teacher's tests
    useEffect(() => {
        api.get('/tests').then(res => {
            if (res.data.success) setTests(res.data.data);
        }).catch(() => { });
    }, []);

    // Fetch questions for selected test
    useEffect(() => {
        if (!selectedTestId) { setExistingQuestions([]); return; }
        api.get(`/questions/${selectedTestId}/questions`)
            .then(res => { if (res.data.success) setExistingQuestions(res.data.data); })
            .catch(() => setExistingQuestions([]));
    }, [selectedTestId]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // ── Test Case Helpers ───────────────────────────────────────────────────
    const addTestCase = () => setForm(prev => ({ ...prev, testCases: [...prev.testCases, { input: '', output: '', isHidden: false }] }));
    const removeTestCase = (i) => setForm(prev => ({ ...prev, testCases: prev.testCases.filter((_, idx) => idx !== i) }));
    const updateTestCase = (i, field, value) => setForm(prev => {
        const updated = [...prev.testCases];
        updated[i] = { ...updated[i], [field]: value };
        return { ...prev, testCases: updated };
    });

    // ── MCQ Option Helpers ──────────────────────────────────────────────────
    const updateOption = (i, value) => setForm(prev => {
        const updated = [...prev.options];
        updated[i] = value;
        return { ...prev, options: updated };
    });

    const handleDeleteQuestion = async (qId) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await api.delete(`/questions/${qId}`);
            setExistingQuestions(prev => prev.filter(q => q._id !== qId));
        } catch (e) { alert('Failed to delete question'); }
    };

    const startEdit = (q) => {
        setEditingId(q._id);
        setEditType(q.type || 'Coding');
        setEditForm(formFromQuestion(q));
        setEditError(null);
        setExpandedId(null);
    };

    const cancelEdit = () => { setEditingId(null); setEditError(null); };

    const handleEditFormChange = e => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const updateEditOption = (i, val) => setEditForm(p => {
        const opts = [...p.options]; opts[i] = val; return { ...p, options: opts };
    });
    const addEditTestCase = () => setEditForm(p => ({ ...p, testCases: [...p.testCases, { input: '', output: '', isHidden: false }] }));
    const removeEditTestCase = i => setEditForm(p => ({ ...p, testCases: p.testCases.filter((_, idx) => idx !== i) }));
    const updateEditTC = (i, field, val) => setEditForm(p => {
        const tc = [...p.testCases]; tc[i] = { ...tc[i], [field]: val }; return { ...p, testCases: tc };
    });

    const handleUpdate = async (qId) => {
        setEditError(null);
        if (!editForm.title.trim()) return setEditError('Title is required.');
        if (editType === 'Coding' && editForm.testCases.some(tc => !tc.input.trim() || !tc.output.trim()))
            return setEditError('All test cases need input and expected output.');
        if (editType === 'MCQ' && !editForm.correctAnswer.trim())
            return setEditError('Select the correct answer.');

        const payload = {
            type: editType,
            title: editForm.title,
            description: editForm.description,
            marks: Number(editForm.marks),
            difficulty: editForm.difficulty,
            ...(editType === 'MCQ'
                ? { options: editForm.options.filter(o => o.trim()), correctAnswer: editForm.correctAnswer }
                : {
                    testCases: editForm.testCases,
                    languageRestrictions: editForm.languageRestrictions,
                    starterCode: Object.fromEntries(
                        Object.entries(editForm.starterCode || {}).filter(([, v]) => v.trim())
                    )
                }
            )
        };
        setEditSaving(true);
        try {
            const res = await api.put(`/questions/${qId}`, payload);
            if (res.data.success) {
                setExistingQuestions(prev => prev.map(q => q._id === qId ? res.data.data : q));
                setEditingId(null);
                setSuccess(`✅ "${res.data.data.title}" updated!`);
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            setEditError(err.response?.data?.msg || 'Failed to update question.');
        } finally { setEditSaving(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); setSuccess(null);
        if (!selectedTestId) return setError('Please select a test first.');
        if (!form.title.trim()) return setError('Question title is required.');
        if (questionType === 'Coding' && form.testCases.some(tc => !tc.input.trim() || !tc.output.trim())) {
            return setError('All test cases must have both input and expected output.');
        }
        if (questionType === 'MCQ' && !form.correctAnswer.trim()) {
            return setError('Please set the correct answer for the MCQ.');
        }

        const payload = {
            type: questionType,
            title: form.title,
            description: form.description,
            marks: Number(form.marks),
            ...(questionType === 'MCQ'
                ? { options: form.options.filter(o => o.trim()), correctAnswer: form.correctAnswer }
                : {
                    testCases: form.testCases,
                    languageRestrictions: form.languageRestrictions,
                    // Only include non-empty stubs
                    starterCode: Object.fromEntries(
                        Object.entries(form.starterCode).filter(([, v]) => v.trim())
                    )
                }
            )
        };

        setLoading(true);
        try {
            const res = await api.post(`/questions/${selectedTestId}/add`, payload);
            if (res.data.success) {
                setSuccess(`Question "${res.data.data.title}" added successfully!`);
                setExistingQuestions(prev => [...prev, res.data.data]);
                setForm({ title: '', description: '', marks: 10, options: ['', '', '', ''], correctAnswer: '', testCases: [{ input: '', output: '', isHidden: false }], languageRestrictions: [], starterCode: emptyStarter() });
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add question.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Existing Questions for selected test */}
            {selectedTestId && (
                <div className="neo-panel border-[#000B1A] overflow-hidden">
                    <div className="px-6 py-4 border-b-2 border-[#000B1A] bg-white flex justify-between items-center">
                        <h3 className="font-black text-[#000B1A] uppercase tracking-widest">Questions in this Test ({existingQuestions.length})</h3>
                    </div>
                    {existingQuestions.length === 0 ? (
                        <p className="text-center text-[#000B1A]/70 py-6 text-sm font-bold">No questions added yet.</p>
                    ) : (
                        <div className="divide-y-2 divide-white/80">
                            {existingQuestions.map((q, i) => (
                                <div key={q._id}>
                                    {/* Row */}
                                    <div className="px-6 py-3 flex items-center justify-between hover:bg-[#000B1A]/5 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="w-7 h-7 rounded-none border-2 border-[#000B1A] bg-[#3b82f6] text-[#000B1A] text-xs font-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_#000B1A]">{i + 1}</span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-[#000B1A] truncate">{q.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border-2 border-[#000B1A] font-black shadow-[2px_2px_0_0_#000B1A] ${q.type === 'Coding' ? 'bg-[#a855f7] text-[#000B1A]' : 'bg-[#3b82f6] text-[#000B1A]'}`}>{q.type}</span>
                                                    <span className="text-xs text-[#000B1A]/70 font-bold">{q.marks} pts</span>
                                                    <DifficultyBadge d={q.difficulty} />
                                                    {q.type === 'Coding' && <span className="text-xs text-[#000B1A]/70 font-bold">{q.testCases?.length ?? 0} test cases</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                            <button onClick={() => { setExpandedId(expandedId === q._id ? null : q._id); setEditingId(null); }}
                                                className="text-[#000B1A] hover:text-[#000B1A] hover:bg-[#3b82f6] px-3 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-sm font-black transition-colors">
                                                {expandedId === q._id ? '▲ Hide' : '▼ View'}
                                            </button>
                                            <button onClick={() => startEdit(q)}
                                                className="text-[#000B1A] hover:text-[#000B1A] hover:bg-[#3b82f6] px-3 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-sm font-black transition-colors">
                                                ✏️ Edit
                                            </button>
                                            <button onClick={() => handleDeleteQuestion(q._id)} className="text-[#000B1A] hover:text-[#000B1A] hover:bg-[#ef4444] px-3 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-sm font-black transition-colors">Delete</button>
                                        </div>
                                    </div>

                                    {/* Expanded View */}
                                    {expandedId === q._id && editingId !== q._id && (
                                        <div className="px-6 pb-5 bg-white border-t-2 border-[#000B1A] space-y-4 pt-3">
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

                                    {/* Inline Edit Form */}
                                    {editingId === q._id && (
                                        <div className="px-6 pb-5 bg-white border-t-2 border-[#000B1A] space-y-4 pt-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-black uppercase tracking-widest text-[#000B1A] text-sm">✏️ Edit Question</h4>
                                                <button onClick={cancelEdit} className="text-[#000B1A]/70 hover:text-[#000B1A] text-sm font-bold">✕ Cancel</button>
                                            </div>
                                            {editError && <div className="bg-[#ef4444] border-2 border-[#0d0a1c] text-[#000B1A] rounded-none px-4 py-2 text-sm font-black shadow-[4px_4px_0_0_#0d0a1c]">{editError}</div>}
                                            <div className="flex gap-3">
                                                {['Coding', 'MCQ'].map(type => (
                                                    <button key={type} type="button" onClick={() => setEditType(type)}
                                                        className={`flex-1 py-2.5 rounded-none text-sm font-black border-2 border-[#000B1A] shadow-[4px_4px_0_0_#000B1A] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] ${editType === type ? (type === 'Coding' ? 'bg-[#a855f7] text-[#000B1A]' : 'bg-[#3b82f6] text-[#000B1A]') : 'bg-white text-[#000B1A] hover:bg-[#000B1A]/5'}`}>
                                                        {type === 'Coding' ? '💻 Coding' : '🔤 MCQ'}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                                <div className="md:col-span-3">
                                                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Title *</label>
                                                    <input name="title" value={editForm.title} onChange={handleEditFormChange} className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Marks</label>
                                                    <input name="marks" type="number" min="1" value={editForm.marks} onChange={handleEditFormChange} className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Difficulty</label>
                                                    <select name="difficulty" value={editForm.difficulty} onChange={handleEditFormChange} className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                                        {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Description</label>
                                                <textarea name="description" value={editForm.description} onChange={handleEditFormChange} rows={3}
                                                    className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold resize-none font-mono" />
                                            </div>
                                            {editType === 'MCQ' && (
                                                <div className="border-2 border-[#000B1A] rounded-none bg-white p-4 space-y-3 shadow-[4px_4px_0_0_#000B1A]">
                                                    <h4 className="font-black uppercase tracking-wider text-[#000B1A] text-sm">Answer Options</h4>
                                                    {editForm.options?.map((opt, oi) => (
                                                        <div key={oi} className="flex items-center gap-3">
                                                            <span className="w-7 h-7 rounded-none bg-white border-2 border-[#000B1A] flex items-center justify-center text-sm font-black text-[#000B1A] flex-shrink-0 shadow-[2px_2px_0_0_#000B1A]">{String.fromCharCode(65 + oi)}</span>
                                                            <input value={opt} onChange={e => updateEditOption(oi, e.target.value)} className="flex-1 w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                                                        </div>
                                                    ))}
                                                    <div>
                                                        <label className="block text-[10px] font-black text-[#000B1A] uppercase tracking-wider mb-1">Correct Answer *</label>
                                                        <select name="correctAnswer" value={editForm.correctAnswer} onChange={handleEditFormChange} className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                                            <option value="">-- Select correct answer --</option>
                                                            {editForm.options?.filter(o => o.trim()).map((opt, oi) => (
                                                                <option key={oi} value={opt}>{String.fromCharCode(65 + oi)}: {opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                            {editType === 'Coding' && (
                                                <div className="border-2 border-[#000B1A] rounded-none bg-white p-4 space-y-3 shadow-[4px_4px_0_0_#000B1A]">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-black text-[#000B1A] uppercase tracking-wider text-sm">Test Cases ({editForm.testCases?.length})</h4>
                                                        <button type="button" onClick={addEditTestCase} className="text-[#000B1A] text-[10px] font-black uppercase tracking-wider bg-white border-2 border-[#000B1A] px-3 py-1.5 rounded-none shadow-[2px_2px_0_0_#000B1A] hover:bg-[#000B1A]/5 transition-colors">+ Add Case</button>
                                                    </div>
                                                    {editForm.testCases?.map((tc, ti) => (
                                                        <div key={ti} className="bg-white rounded-none border-2 border-[#000B1A] p-3 space-y-2 shadow-[4px_4px_0_0_#000B1A]">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest">Case #{ti + 1}</span>
                                                                <div className="flex items-center gap-3">
                                                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                                                        <input type="checkbox" checked={tc.isHidden} onChange={e => updateEditTC(ti, 'isHidden', e.target.checked)} className="w-3.5 h-3.5 text-[#a855f7] border-2 border-[#000B1A] rounded-none bg-white" />
                                                                        <span className="text-xs font-bold text-[#000B1A]/80">🔒 Hidden</span>
                                                                    </label>
                                                                    {editForm.testCases.length > 1 && (
                                                                        <button type="button" onClick={() => removeEditTestCase(ti)} className="text-[#000B1A] bg-[#ef4444] border-2 border-[#000B1A] text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000B1A] hover:-translate-y-0.5 px-2 py-1 rounded-none transition-transform">Remove</button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="block text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest mb-1">Input</label>
                                                                    <textarea value={tc.input} onChange={e => updateEditTC(ti, 'input', e.target.value)} rows={2} className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm font-mono font-bold shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform resize-none" />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest mb-1">Expected Output</label>
                                                                    <textarea value={tc.output} onChange={e => updateEditTC(ti, 'output', e.target.value)} rows={2} className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm font-mono font-bold shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform resize-none" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex justify-end gap-3 pt-1">
                                                <button type="button" onClick={cancelEdit} className="px-5 py-2 border-2 border-[#000B1A] rounded-none text-sm font-black text-[#000B1A] shadow-[4px_4px_0_0_#000B1A] hover:bg-[#000B1A]/5 transition-colors">Cancel</button>
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
            )}

            {/* Add Question Form */}
            <div className="neo-panel border-[#000B1A] overflow-hidden">
                <div className="p-6 border-b-2 border-[#000B1A] bg-white">
                    <h2 className="text-xl font-black uppercase tracking-widest text-[#000B1A]">Add Question to Test</h2>
                    <p className="text-sm text-[#000B1A]/70 font-bold mt-0.5">Select a test, choose type, and configure your question</p>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && <div className="bg-[#ef4444] border-2 border-[#0d0a1c] text-[#000B1A] rounded-none px-4 py-3 text-sm font-black shadow-[4px_4px_0_0_#0d0a1c]">{error}</div>}
                    {success && <div className="bg-[#10b981] border-2 border-[#0d0a1c] text-[#000B1A] rounded-none px-4 py-3 text-sm font-black shadow-[4px_4px_0_0_#0d0a1c]">{success}</div>}

                    {/* Test Selector */}
                    <div>
                        <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Select Test <span className="text-red-500">*</span></label>
                        <select value={selectedTestId} onChange={e => setSelectedTestId(e.target.value)}
                            className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                            <option value="">-- Choose a test --</option>
                            {tests.map(t => <option key={t._id} value={t._id}>{t.title} ({t.status})</option>)}
                        </select>
                    </div>

                    {/* Question Type */}
                    <div>
                        <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Question Type</label>
                        <div className="flex space-x-3">
                            {['Coding', 'MCQ'].map(type => (
                                <button key={type} type="button" onClick={() => setQuestionType(type)}
                                    className={`flex-1 py-3 rounded-none text-sm font-black border-2 border-[#000B1A] shadow-[4px_4px_0_0_#000B1A] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] ${questionType === type ? (type === 'Coding' ? 'bg-[#a855f7] text-[#000B1A]' : 'bg-[#3b82f6] text-[#000B1A]') : 'bg-white text-[#000B1A] hover:bg-[#000B1A]/5'}`}>
                                    {type === 'Coding' ? '💻 Coding Problem' : '🔤 Multiple Choice'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title & Marks */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Question Title <span className="text-red-500">*</span></label>
                            <input name="title" value={form.title} onChange={handleFormChange} placeholder={questionType === 'Coding' ? 'e.g. Two Sum' : 'e.g. What is a closure in JavaScript?'}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Marks</label>
                            <input name="marks" type="number" min="1" value={form.marks} onChange={handleFormChange}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">
                            Description {questionType === 'Coding' && <span className="text-[#000B1A]/60 font-bold ml-1">(Markdown supported)</span>}
                        </label>
                        <textarea name="description" value={form.description} onChange={handleFormChange} rows={5}
                            placeholder={questionType === 'Coding'
                                ? 'Problem statement with constraints, examples...\n\n**Example:**\n- Input: nums = [2,7,11,15], target = 9\n- Output: [0,1]'
                                : 'Full question text...'}
                            className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold resize-none font-mono" />
                    </div>

                    {/* ── MCQ Options ── */}
                    {questionType === 'MCQ' && (
                        <div className="border-2 border-[#000B1A] rounded-none p-5 space-y-4 bg-white shadow-[4px_4px_0_0_#000B1A]">
                            <h4 className="font-black uppercase tracking-wider text-[#000B1A] text-sm">Answer Options</h4>
                            {form.options.map((opt, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <span className="w-8 h-8 rounded-none border-2 border-[#000B1A] bg-white flex items-center justify-center text-sm font-black text-[#000B1A] flex-shrink-0 shadow-[2px_2px_0_0_#000B1A]">{String.fromCharCode(65 + i)}</span>
                                    <input value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                        className="flex-1 w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-4 py-2.5 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                                </div>
                            ))}
                            <div className="pt-2">
                                <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Correct Answer <span className="text-red-500">*</span></label>
                                <select name="correctAnswer" value={form.correctAnswer} onChange={handleFormChange}
                                    className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-4 py-2.5 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                    <option value="">-- Select correct answer --</option>
                                    {form.options.filter(o => o.trim()).map((opt, i) => (
                                        <option key={i} value={opt}>{String.fromCharCode(65 + i)}: {opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* ── Coding: Starter Code Stubs ── */}
                    {questionType === 'Coding' && (
                        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,212,170,0.25)', background: 'rgba(0,212,170,0.04)' }}>
                            <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(0,212,170,0.15)', background: 'rgba(0,212,170,0.06)' }}>
                                <span style={{ color: '#00d4aa', fontSize: '16px' }}>⟨/⟩</span>
                                <div>
                                    <h4 className="text-sm font-semibold" style={{ color: '#e8eaf6' }}>Starter Code Templates</h4>
                                    <p className="text-xs" style={{ color: '#4a5578' }}>Optional — pre-fill the editor for students. They complete the function body.</p>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                {/* Language Tabs */}
                                <div className="flex gap-1 flex-wrap">
                                    {STUB_LANGUAGES.map(lang => (
                                        <button key={lang.key} type="button"
                                            onClick={() => setActiveStubLang(lang.key)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                            style={{
                                                background: activeStubLang === lang.key ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.04)',
                                                color: activeStubLang === lang.key ? '#00d4aa' : '#4a5578',
                                                border: `1px solid ${activeStubLang === lang.key ? 'rgba(0,212,170,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                            }}>
                                            {lang.label}
                                            {form.starterCode[lang.key]?.trim() && <span className="ml-1.5" style={{ color: '#00d4aa' }}>●</span>}
                                        </button>
                                    ))}
                                </div>
                                {/* Code area */}
                                {STUB_LANGUAGES.filter(l => l.key === activeStubLang).map(lang => (
                                    <div key={lang.key}>
                                        <textarea
                                            value={form.starterCode[lang.key] || ''}
                                            onChange={e => setForm(prev => ({ ...prev, starterCode: { ...prev.starterCode, [lang.key]: e.target.value } }))}
                                            rows={8}
                                            placeholder={lang.placeholder}
                                            spellCheck={false}
                                            className="w-full rounded-lg px-4 py-3 text-sm resize-y focus:outline-none"
                                            style={{
                                                fontFamily: 'JetBrains Mono, monospace',
                                                background: '#0d1117',
                                                color: '#e8eaf6',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                caretColor: '#00d4aa',
                                            }}
                                        />
                                        <p className="text-xs mt-1.5" style={{ color: '#4a5578' }}>
                                            Leave blank to use default empty editor for {lang.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Coding Test Cases ── */}
                    {questionType === 'Coding' && (
                        <div className="border-2 border-[#000B1A] rounded-none p-5 space-y-4 bg-white shadow-[4px_4px_0_0_#000B1A]">
                            <div className="flex justify-between items-center">
                                <h4 className="font-black text-[#000B1A] uppercase tracking-wider text-sm">Test Cases <span className="text-[#000B1A]/70 font-bold">({form.testCases.length} total)</span></h4>
                                <button type="button" onClick={addTestCase}
                                    className="text-[#000B1A] text-[10px] font-black uppercase tracking-wider bg-white border-2 border-[#000B1A] px-3 py-1.5 rounded-none shadow-[2px_2px_0_0_#000B1A] hover:bg-[#000B1A]/5 transition-colors">
                                    + Add Case
                                </button>
                            </div>
                            {form.testCases.map((tc, i) => (
                                <div key={i} className="bg-white rounded-none border-2 border-[#000B1A] p-4 space-y-3 shadow-[4px_4px_0_0_#000B1A]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest">Test Case #{i + 1}</span>
                                        <div className="flex items-center space-x-3">
                                            <label className="flex items-center space-x-1.5 cursor-pointer">
                                                <input type="checkbox" checked={tc.isHidden} onChange={e => updateTestCase(i, 'isHidden', e.target.checked)}
                                                    className="w-3.5 h-3.5 text-[#a855f7] border-2 border-[#000B1A] rounded-none bg-white" />
                                                <span className="text-xs font-bold text-[#000B1A]/80">Hidden</span>
                                            </label>
                                            {form.testCases.length > 1 && (
                                                <button type="button" onClick={() => removeTestCase(i)}
                                                    className="text-[#000B1A] bg-[#ef4444] border-2 border-[#000B1A] text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000B1A] hover:-translate-y-0.5 px-2 py-1 rounded-none transition-transform">Remove</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest mb-1">Input (stdin)</label>
                                            <textarea value={tc.input} onChange={e => updateTestCase(i, 'input', e.target.value)}
                                                rows={3} placeholder="e.g. 2 7&#10;9"
                                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm font-mono font-bold shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform resize-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-[#000B1A]/70 uppercase tracking-widest mb-1">Expected Output (stdout)</label>
                                            <textarea value={tc.output} onChange={e => updateTestCase(i, 'output', e.target.value)}
                                                rows={3} placeholder="e.g. 0 1"
                                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm font-mono font-bold shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform resize-none" />
                                        </div>
                                    </div>
                                    {tc.isHidden && (
                                        <div className="flex items-center space-x-2 bg-white border-2 border-[#f97316] rounded-none shadow-[2px_2px_0_0_#f97316] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#f97316]">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                            <span>This test case is hidden — input/output won't be shown to students</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={() => navigate('/teacher')} className="px-6 py-3 border-2 border-[#000B1A] rounded-none text-sm font-black text-[#000B1A] shadow-[4px_4px_0_0_#000B1A] hover:bg-[#000B1A]/5 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading || !selectedTestId}
                            className="neo-button px-8 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? 'Adding...' : '+ Add Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddQuestion;
