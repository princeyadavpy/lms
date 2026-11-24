import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Layers,
    Plus,
    Users,
    BookOpen,
    Award,
    Calendar,
    UploadCloud,
    CheckCircle2,
    X,
    Building2,
    FileSpreadsheet
} from 'lucide-react';

const AdminBatches = () => {
    const [batches, setBatches] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedBatchForEnroll, setSelectedBatchForEnroll] = useState(null);

    const [createForm, setCreateForm] = useState({
        name: '',
        code: '',
        institutionId: '',
        description: '',
        assignedCourses: [],
        assignedExams: [],
        maxStudents: 200
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    // Bulk student enroll state
    const [csvInput, setCsvInput] = useState('');
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [enrollResult, setEnrollResult] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bRes, iRes, cRes, tRes] = await Promise.all([
                api.get('/batches'),
                api.get('/institutions'),
                api.get('/courses'),
                api.get('/tests')
            ]);
            if (bRes.data.success) setBatches(bRes.data.data);
            if (iRes.data.success) {
                setInstitutions(iRes.data.data);
                if (iRes.data.data.length > 0 && !createForm.institutionId) {
                    setCreateForm(prev => ({ ...prev, institutionId: iRes.data.data[0]._id }));
                }
            }
            if (cRes.data.success) setCourses(cRes.data.data);
            if (tRes.data.success) setTests(tRes.data.data);
        } catch (err) {
            console.error('Failed to load batch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateBatch = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setCreateError('');
        try {
            const res = await api.post('/batches', createForm);
            if (res.data.success) {
                setShowCreateModal(false);
                setCreateForm({
                    name: '',
                    code: '',
                    institutionId: institutions[0]?._id || '',
                    description: '',
                    assignedCourses: [],
                    assignedExams: [],
                    maxStudents: 200
                });
                fetchData();
            }
        } catch (err) {
            setCreateError(err.response?.data?.msg || 'Failed to create batch');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleBulkEnroll = async (e) => {
        e.preventDefault();
        if (!selectedBatchForEnroll) return;
        setEnrollLoading(true);
        setEnrollResult(null);

        try {
            const lines = csvInput.trim().split('\n').filter(Boolean);
            const students = lines.map(line => {
                const parts = line.split(',').map(p => p.trim());
                return {
                    name: parts[0] || 'Student',
                    email: parts[1] || '',
                    password: parts[2] || undefined
                };
            }).filter(s => s.email && s.email.includes('@'));

            if (students.length === 0) {
                alert('No valid student emails found in the pasted data.');
                setEnrollLoading(false);
                return;
            }

            const res = await api.post(`/batches/${selectedBatchForEnroll._id}/bulk-enroll`, {
                students
            });

            if (res.data.success) {
                setEnrollResult(res.data.data);
                fetchData();
            }
        } catch (err) {
            console.error('Bulk enrollment error:', err);
        } finally {
            setEnrollLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeInUp pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Layers className="w-6 h-6 text-blue-600" />
                        <span>Batch & Student Cohort Management</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Create training batches under institutions, assign learning courses, and bulk enroll students.
                    </p>
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-xs cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Batch</span>
                </button>
            </div>

            {/* Batches Grid */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="hl-spinner" style={{ width: '32px', height: '32px' }} />
                </div>
            ) : batches.length === 0 ? (
                <div className="rounded-2xl p-12 text-center bg-white border border-slate-200">
                    <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-800">No batches created yet</p>
                    <p className="text-xs text-slate-500 mt-1">Click "Create Batch" above to set up a new cohort.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.map((batch) => (
                        <div
                            key={batch._id}
                            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                        {batch.code}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500 truncate max-w-[150px]">
                                        {batch.institutionId?.name || 'Institutional Batch'}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-slate-900">{batch.name}</h3>
                                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                    {batch.description || 'Dedicated cohort for coursework and assessments.'}
                                </p>

                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[10px] text-slate-500 block font-bold uppercase mb-0.5">Students</span>
                                        <span className="text-sm font-black text-slate-900">{batch.studentCount || 0}</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[10px] text-slate-500 block font-bold uppercase mb-0.5">Courses</span>
                                        <span className="text-sm font-black text-blue-600">{batch.courseCount || 0}</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[10px] text-slate-500 block font-bold uppercase mb-0.5">Exams</span>
                                        <span className="text-sm font-black text-purple-600">{batch.examCount || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        setSelectedBatchForEnroll(batch);
                                        setShowEnrollModal(true);
                                        setCsvInput('');
                                        setEnrollResult(null);
                                    }}
                                    className="w-full py-2.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    <span>Bulk Enroll Students</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal: Bulk Student CSV Upload */}
            {showEnrollModal && selectedBatchForEnroll && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                    <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scaleUp">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                                    <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                                    <span>Bulk Student Enrollment</span>
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Enrolling into: <strong>{selectedBatchForEnroll.name}</strong></p>
                            </div>
                            <button onClick={() => setShowEnrollModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {enrollResult && (
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                                <p className="font-bold flex items-center gap-1.5 text-emerald-700">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Enrollment Complete!</span>
                                </p>
                                <p>• Created New Users: <strong>{enrollResult.created}</strong></p>
                                <p>• Mapped Existing Users: <strong>{enrollResult.alreadyExisted}</strong></p>
                                <p>• Total Students Enrolled: <strong>{enrollResult.enrolled}</strong></p>
                            </div>
                        )}

                        <form onSubmit={handleBulkEnroll} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                                    Paste CSV or Excel Rows (Format: Full Name, email@domain.com, OptionalPassword)
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    placeholder={`Aarav Sharma, aarav@shoolini.edu, Pass@123\nDiya Patel, diya@shoolini.edu\nRohan Verma, rohan@shoolini.edu`}
                                    value={csvInput}
                                    onChange={(e) => setCsvInput(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-slate-50 font-mono text-xs border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
                                />
                                <span className="text-[11px] text-slate-500 font-medium block mt-1">
                                    Students will automatically receive credentials and access to all courses assigned to this batch.
                                </span>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowEnrollModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    disabled={enrollLoading}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all cursor-pointer shadow-xs"
                                >
                                    {enrollLoading ? 'Enrolling...' : 'Enroll Students'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Create Batch */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                    <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scaleUp">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-blue-600" />
                                <span>Create Training Batch</span>
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {createError && (
                            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
                                {createError}
                            </div>
                        )}

                        <form onSubmit={handleCreateBatch} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Institution</label>
                                <select
                                    required
                                    value={createForm.institutionId}
                                    onChange={(e) => setCreateForm({ ...createForm, institutionId: e.target.value })}
                                    className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                                >
                                    {institutions.map(i => (
                                        <option key={i._id} value={i._id}>{i.name} ({i.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Batch Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. DSA Training Batch 2026"
                                        value={createForm.name}
                                        onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Batch Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. SHU-DSA-B1"
                                        value={createForm.code}
                                        onChange={(e) => setCreateForm({ ...createForm, code: e.target.value.toUpperCase() })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 uppercase placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    placeholder="Batch objectives and schedule"
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                    className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all cursor-pointer shadow-xs"
                                >
                                    {createLoading ? 'Creating...' : 'Create Batch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBatches;
