import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = ['C', 'C++', 'Python', 'Java', 'JavaScript'];

const CreateTest = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        duration: 60,
        startTime: '',
        endTime: '',
        type: 'Mixed',
        difficulty: 'Medium',
        tags: '',
        allowedLanguages: [],
        negativeMarking: false,
        randomizeQuestions: false,
        shuffleOptions: false,
        proctorLevel: 0,
        maxTabSwitches: 3,
        maxAttempts: 1,
        allowedEmails: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const toggleLanguage = (lang) => {
        setForm(prev => ({
            ...prev,
            allowedLanguages: prev.allowedLanguages.includes(lang)
                ? prev.allowedLanguages.filter(l => l !== lang)
                : [...prev.allowedLanguages, lang]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return setError('Title is required.');
        if (form.duration < 1) return setError('Duration must be at least 1 minute.');
        setLoading(true); setError(null);
        try {
            const res = await api.post('/tests', {
                title: form.title,
                description: form.description,
                duration: Number(form.duration),
                type: form.type,
                difficulty: form.difficulty,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                startTime: form.startTime || undefined,
                endTime: form.endTime || undefined,
                config: {
                    shuffleQuestions: form.randomizeQuestions,
                    shuffleOptions: form.shuffleOptions,
                    proctorLevel: Number(form.proctorLevel),
                    negativeMarking: form.negativeMarking,
                    maxTabSwitches: Number(form.maxTabSwitches),
                    maxAttempts: Number(form.maxAttempts),
                    allowedLanguages: form.allowedLanguages,
                    allowedEmails: form.allowedEmails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean),
                }
            });
            if (res.data.success) {
                setSuccess(`Test "${res.data.data.title}" created successfully!`);
                setTimeout(() => navigate('/teacher/my-tests'), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create test.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="neo-panel border-[#000B1A] overflow-hidden">
                <div className="p-6 border-b-2 border-[#000B1A] bg-white">
                    <h2 className="text-xl font-black uppercase tracking-widest text-[#000B1A]">Create New Test</h2>
                    <p className="text-sm text-[#000B1A]/70 font-bold mt-0.5">Configure your assessment settings below</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && <div className="bg-[#ef4444] border-2 border-[#0d0a1c] text-[#000B1A] rounded-none px-4 py-3 text-sm font-black shadow-[4px_4px_0_0_#0d0a1c]">{error}</div>}
                    {success && <div className="bg-[#10b981] border-2 border-[#0d0a1c] text-[#000B1A] rounded-none px-4 py-3 text-sm font-black shadow-[4px_4px_0_0_#0d0a1c]">{success}</div>}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Test Title <span className="text-red-500">*</span></label>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. JavaScript Fundamentals Assessment" required
                            className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Instructions or overview for students..."
                            className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold resize-none" />
                    </div>

                    {/* Duration & Times */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Duration (minutes) <span className="text-red-500">*</span></label>
                            <input name="duration" type="number" min="1" value={form.duration} onChange={handleChange}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Start Time</label>
                            <input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">End Time</label>
                            <input name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                        </div>
                    </div>

                    {/* Type, Difficulty, Proctor Level */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Test Type</label>
                            <select name="type" value={form.type} onChange={handleChange}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                <option>MCQ</option>
                                <option>Coding</option>
                                <option>Mixed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Difficulty</label>
                            <select name="difficulty" value={form.difficulty} onChange={handleChange}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">🛡️ Proctor Level</label>
                            <select name="proctorLevel" value={form.proctorLevel} onChange={handleChange}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                <option value={0}>L0 — None</option>
                                <option value={1}>L1 — Tab + Fullscreen Lock</option>
                                <option value={2}>L2 — + AI Webcam (coming soon)</option>
                                <option value={3}>L3 — Full Proctor (enterprise)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">🔄 Max Attempts</label>
                            <input name="maxAttempts" type="number" min="1" max="10" value={form.maxAttempts} onChange={handleChange}
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                            <p className="text-[10px] text-[#000B1A]/70 mt-1 font-bold">Number of times a student can take this test.</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Tags <span className="text-[#000B1A]/60 font-bold text-xs">(comma-separated)</span></label>
                        <input name="tags" value={form.tags} onChange={handleChange}
                            placeholder="e.g. JavaScript, Frontend, Algorithms"
                            className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold" />
                    </div>

                    <div>
                        <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-3">Allowed Languages</label>
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map(lang => (
                                <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                                    className={`px-4 py-2 rounded-none text-sm font-black border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] ${form.allowedLanguages.includes(lang) ? 'bg-[#3b82f6] text-[#000B1A]' : 'bg-white text-[#000B1A] hover:bg-[#000B1A]/5'}`}>
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-[#000B1A]/70 mt-2 font-bold">Click to toggle. None selected = all allowed.</p>
                    </div>

                    {/* Allowed Emails */}
                    <div>
                        <label className="block text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Restricted Access Emails <span className="text-[#000B1A]/60 font-bold text-xs">(comma or newline separated)</span></label>
                        <textarea name="allowedEmails" value={form.allowedEmails} onChange={handleChange} rows={3}
                            placeholder="student1@example.com, student2@example.com&#10;Leave empty to allow anyone with the code."
                            className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] placeholder-gray-500 px-4 py-3 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold resize-none" />
                    </div>

                    {/* Options */}
                    <div className="border-2 border-[#000B1A] rounded-none p-4 space-y-3 bg-white shadow-[4px_4px_0_0_#000B1A]">
                        <h3 className="text-sm font-black text-[#000B1A] uppercase tracking-wider mb-2">Test Options</h3>
                        {[
                            { name: 'negativeMarking', label: 'Enable Negative Marking', desc: 'Deduct marks for wrong MCQ answers (25% by default)' },
                            { name: 'randomizeQuestions', label: 'Randomize Question Order', desc: 'Shuffle questions uniquely for each student' },
                            { name: 'shuffleOptions', label: 'Shuffle MCQ Options', desc: 'Randomize the order of MCQ answer options' },
                        ].map(({ name, label, desc }) => (
                            <label key={name} className="flex items-start space-x-3 cursor-pointer group">
                                <div className="flex-shrink-0 mt-0.5">
                                    <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="w-4 h-4 text-[#3b82f6] border-2 border-[#000B1A] rounded-none bg-white" />
                                </div>
                                <div>
                                    <span className="text-sm font-black text-[#000B1A] group-hover:text-[#3b82f6] transition-colors">{label}</span>
                                    <p className="text-xs text-[#000B1A]/70 font-bold">{desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={() => navigate('/teacher')} className="px-6 py-3 border-2 border-[#000B1A] rounded-none text-sm font-black text-[#000B1A] hover:bg-[#000B1A]/5 transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] shadow-[4px_4px_0_0_#000B1A]">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="neo-button px-8 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? 'Creating...' : 'Create Test'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTest;
