import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    BookOpen,
    Building2,
    Users,
    Plus,
    Search,
    CheckCircle2,
    X,
    Lock,
    Unlock,
    Layers,
    Clock,
    Edit3,
    Trash2,
    AlertCircle,
    UserCheck,
    UserMinus,
    ExternalLink,
    GraduationCap
} from 'lucide-react';

const CATEGORIES = ['ALL', 'DSA', 'ML', 'DL', 'GEN AI', 'AGENTIC AI', 'PYTHON', 'C', 'C++', 'JAVA'];

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [instModalCourse, setInstModalCourse] = useState(null);
    const [selectedInstIds, setSelectedInstIds] = useState([]);
    const [savingInst, setSavingInst] = useState(false);

    const [studentModalCourse, setStudentModalCourse] = useState(null);
    const [studentSearch, setStudentSearch] = useState('');
    const [studentInstFilter, setStudentInstFilter] = useState('ALL');
    const [enrolledStudentIds, setEnrolledStudentIds] = useState(new Set());
    const [savingStudent, setSavingStudent] = useState(false);

    // Form for new course
    const [createForm, setCreateForm] = useState({
        title: '',
        code: '',
        category: 'DSA',
        level: 'Intermediate',
        estimatedTotalHours: 40,
        description: ''
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch courses independently
            try {
                const cRes = await api.get('/courses');
                if (cRes.data.success && Array.isArray(cRes.data.data)) {
                    setCourses(cRes.data.data);
                }
            } catch (cErr) {
                console.error('Failed to load courses:', cErr);
            }

            // Fetch institutions independently
            try {
                const iRes = await api.get('/institutions');
                if (iRes.data.success && Array.isArray(iRes.data.data)) {
                    setInstitutions(iRes.data.data);
                }
            } catch (iErr) {
                console.error('Failed to load institutions:', iErr);
            }

            // Fetch students independently
            try {
                const uRes = await api.get('/admin/users');
                if (uRes.data.success && Array.isArray(uRes.data.data)) {
                    const studentsOnly = uRes.data.data.filter(u => u.role === 'Student');
                    setAllStudents(studentsOnly);
                }
            } catch (uErr) {
                console.error('Failed to load students:', uErr);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ── Open College Allocation Modal ───────────────────────────────
    const openInstAllocation = (course) => {
        setInstModalCourse(course);
        const currentIds = (course.allocatedInstitutions || []).map(i => (i._id || i).toString());
        setSelectedInstIds(currentIds);
    };

    const handleSaveInstAllocation = async () => {
        if (!instModalCourse) return;
        setSavingInst(true);
        try {
            const res = await api.put(`/courses/${instModalCourse._id}/institutions`, {
                institutionIds: selectedInstIds
            });
            if (res.data.success) {
                setInstModalCourse(null);
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to update institution allocations');
        } finally {
            setSavingInst(false);
        }
    };

    // ── Open Student Allocation Modal ───────────────────────────────
    const openStudentAllocation = async (course) => {
        setStudentModalCourse(course);
        setStudentSearch('');
        try {
            const res = await api.get(`/courses/${course._id}/allocations`);
            if (res.data.success) {
                const enrolledIds = new Set((res.data.data.enrolledStudents || []).map(s => s._id.toString()));
                setEnrolledStudentIds(enrolledIds);
            }
        } catch (err) {
            console.error('Failed to load student allocations', err);
        }
    };

    const toggleStudentAccess = async (studentId, currentlyEnrolled) => {
        if (!studentModalCourse) return;
        setSavingStudent(true);
        const action = currentlyEnrolled ? 'remove' : 'enroll';
        try {
            const res = await api.post(`/courses/${studentModalCourse._id}/students`, {
                studentIds: [studentId],
                action
            });
            if (res.data.success) {
                setEnrolledStudentIds(prev => {
                    const next = new Set(prev);
                    if (action === 'enroll') next.add(studentId);
                    else next.delete(studentId);
                    return next;
                });
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to update student access');
        } finally {
            setSavingStudent(false);
        }
    };

    // Bulk enroll/remove filtered students
    const handleBulkStudentAction = async (action) => {
        if (!studentModalCourse) return;
        const targetStudents = filteredModalStudents.map(s => s._id);
        if (targetStudents.length === 0) return;

        setSavingStudent(true);
        try {
            const res = await api.post(`/courses/${studentModalCourse._id}/students`, {
                studentIds: targetStudents,
                action
            });
            if (res.data.success) {
                setEnrolledStudentIds(prev => {
                    const next = new Set(prev);
                    targetStudents.forEach(id => {
                        if (action === 'enroll') next.add(id);
                        else next.delete(id);
                    });
                    return next;
                });
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed bulk update');
        } finally {
            setSavingStudent(false);
        }
    };

    // ── Create New Course ───────────────────────────────────────────
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setCreateError('');
        try {
            const res = await api.post('/courses', createForm);
            if (res.data.success) {
                setShowCreateModal(false);
                setCreateForm({
                    title: '',
                    code: '',
                    category: 'DSA',
                    level: 'Intermediate',
                    estimatedTotalHours: 40,
                    description: ''
                });
                fetchData();
            }
        } catch (err) {
            setCreateError(err.response?.data?.msg || 'Failed to create course');
        } finally {
            setCreateLoading(false);
        }
    };

    // ── Delete Course ───────────────────────────────────────────────
    const handleDeleteCourse = async (courseId, title) => {
        if (!window.confirm(`Delete course "${title}"? This will remove all student enrollments and batch assignments.`)) return;
        try {
            await api.delete(`/courses/${courseId}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to delete course');
        }
    };

    // Filters
    const filteredCourses = courses.filter(c => {
        const catNorm = (c.category || '').toUpperCase();
        const filterNorm = categoryFilter.toUpperCase();
        const matchCat = filterNorm === 'ALL' || catNorm === filterNorm || (filterNorm === 'GEN AI' && catNorm.includes('GEN')) || (filterNorm === 'AGENTIC AI' && catNorm.includes('AGENTIC'));
        const searchNorm = search.trim().toLowerCase();
        const matchSearch = !searchNorm || ((c.title || '') + ' ' + (c.code || '') + ' ' + (c.description || '')).toLowerCase().includes(searchNorm);
        return matchCat && matchSearch;
    });

    const filteredModalStudents = allStudents.filter(s => {
        const matchInst = studentInstFilter === 'ALL' || (s.institutionId?._id || s.institutionId)?.toString() === studentInstFilter;
        const matchSearch = !studentSearch || (s.name + s.email).toLowerCase().includes(studentSearch.toLowerCase());
        return matchInst && matchSearch;
    });

    return (
        <div className="space-y-6 animate-fadeInUp pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <span>Course &amp; Curriculum Management</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Allocate curriculum tracks to partner colleges, manage student-level course enrollment, and publish coursework.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-xs cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Course</span>
                    </button>
                </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                categoryFilter === cat
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search courses or codes..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
            </div>

            {/* Courses Table / Cards */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="hl-spinner" style={{ width: '32px', height: '32px' }} />
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="rounded-2xl p-12 text-center bg-white border border-slate-200">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-800">No courses match your filter</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the filter or create a new curriculum track above.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => {
                        const allocatedInsts = course.allocatedInstitutions || [];
                        const enrolledCount = course.enrolledStudentsCount || 0;

                        return (
                            <div
                                key={course._id}
                                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                            {course.code}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            {course.category}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 leading-snug">{course.title}</h3>
                                        <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                                            {course.description || 'Comprehensive modular curriculum with hands-on practice labs.'}
                                        </p>
                                    </div>

                                    {/* Metrics Pill Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] text-slate-500 block font-bold uppercase mb-0.5">Modules</span>
                                            <span className="text-sm font-black text-slate-900">{course.totalModulesCount || 0}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] text-slate-500 block font-bold uppercase mb-0.5">Lessons</span>
                                            <span className="text-sm font-black text-blue-600">{course.totalLessonsCount || 0}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] text-slate-500 block font-bold uppercase mb-0.5">Hours</span>
                                            <span className="text-sm font-black text-purple-600">{course.estimatedTotalHours || 35}h</span>
                                        </div>
                                    </div>

                                    {/* Allocated Colleges Preview */}
                                    <div className="pt-2 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                                Allocated Colleges:
                                            </span>
                                            <span className="text-xs font-black text-blue-600">
                                                {allocatedInsts.length}
                                            </span>
                                        </div>
                                        {allocatedInsts.length === 0 ? (
                                            <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 block">
                                                Not allocated to any college yet
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {allocatedInsts.slice(0, 3).map(inst => (
                                                    <span
                                                        key={inst._id || inst}
                                                        className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                                                    >
                                                        {inst.code || inst.name || 'College'}
                                                    </span>
                                                ))}
                                                {allocatedInsts.length > 3 && (
                                                    <span className="text-[10px] font-bold text-slate-400 self-center">
                                                        +{allocatedInsts.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Student Allocation Preview */}
                                    <div className="pt-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-emerald-600" />
                                                Enrolled Students:
                                            </span>
                                            <span className="text-xs font-black text-emerald-600">
                                                {enrolledCount} Students
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <button
                                            onClick={() => openInstAllocation(course)}
                                            className="w-full py-2 px-2.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100/70 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                            <Building2 className="w-3.5 h-3.5" />
                                            <span>Allocate Colleges</span>
                                        </button>
                                        <button
                                            onClick={() => openStudentAllocation(course)}
                                            className="w-full py-2 px-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                            <Users className="w-3.5 h-3.5" />
                                            <span>Allocate Students</span>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${course.published !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                            {course.published !== false ? '● Published' : '○ Draft'}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteCourse(course._id, course.title)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                            title="Delete Course"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ══ MODAL 1: Allocate to Colleges / Institutions ══════════ */}
            {instModalCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                    <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scaleUp">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                    <span>Allocate Course to Colleges</span>
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    Course: <strong>{instModalCourse.title}</strong> ({instModalCourse.code})
                                </p>
                            </div>
                            <button onClick={() => setInstModalCourse(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 font-medium">
                            Select the universities and colleges that have curriculum rights to this course. Students enrolled in these colleges will be granted access.
                        </p>

                        <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50/50">
                            {institutions.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-4">No institutions found. Create colleges in the Institutions tab first.</p>
                            ) : (
                                institutions.map(inst => {
                                    const isSelected = selectedInstIds.includes(inst._id.toString());
                                    return (
                                        <label
                                            key={inst._id}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-blue-50/80 border-blue-200 text-slate-900'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={e => {
                                                        const id = inst._id.toString();
                                                        if (e.target.checked) {
                                                            setSelectedInstIds(prev => [...prev, id]);
                                                        } else {
                                                            setSelectedInstIds(prev => prev.filter(x => x !== id));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">{inst.name}</p>
                                                    <span className="text-[10px] font-mono text-slate-500">{inst.code} · {inst.type || 'University'}</span>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {isSelected ? 'Allocated' : 'Not Allocated'}
                                            </span>
                                        </label>
                                    );
                                })
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setInstModalCourse(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveInstAllocation}
                                disabled={savingInst}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all cursor-pointer shadow-xs"
                            >
                                {savingInst ? 'Saving Allocations...' : `Save College Allocations (${selectedInstIds.length})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ MODAL 2: Allocate to Particular Students ══════════════ */}
            {studentModalCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                    <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scaleUp">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-emerald-600" />
                                    <span>Allocate Course to Specific Students</span>
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    Course: <strong>{studentModalCourse.title}</strong> ({studentModalCourse.code})
                                </p>
                            </div>
                            <button onClick={() => setStudentModalCourse(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search & Institution Filter */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search student by name or email..."
                                    value={studentSearch}
                                    onChange={e => setStudentSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                                />
                            </div>
                            <select
                                value={studentInstFilter}
                                onChange={e => setStudentInstFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none font-medium"
                            >
                                <option value="ALL">All Institutions</option>
                                {institutions.map(inst => (
                                    <option key={inst._id} value={inst._id}>{inst.name} ({inst.code})</option>
                                ))}
                            </select>
                        </div>

                        {/* Quick actions bar */}
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-500 font-medium">
                                Showing {filteredModalStudents.length} students · <strong>{enrolledStudentIds.size} allocated</strong>
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleBulkStudentAction('enroll')}
                                    disabled={savingStudent || filteredModalStudents.length === 0}
                                    className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 cursor-pointer"
                                >
                                    + Allocate All Filtered
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleBulkStudentAction('remove')}
                                    disabled={savingStudent || filteredModalStudents.length === 0}
                                    className="text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg border border-red-200 cursor-pointer"
                                >
                                    - Remove All Filtered
                                </button>
                            </div>
                        </div>

                        {/* Student List */}
                        <div className="max-h-80 overflow-y-auto space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50/50">
                            {filteredModalStudents.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-8">No students found matching your search filter.</p>
                            ) : (
                                filteredModalStudents.map(student => {
                                    const isEnrolled = enrolledStudentIds.has(student._id.toString());
                                    return (
                                        <div
                                            key={student._id}
                                            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black text-xs shrink-0">
                                                    {student.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">{student.name}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">
                                                        {student.email} · {student.institutionId?.name || 'HiGen Global'}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleStudentAccess(student._id, isEnrolled)}
                                                disabled={savingStudent}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                                    isEnrolled
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
                                                }`}
                                            >
                                                {isEnrolled ? (
                                                    <>
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>Allocated</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Grant Access</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="flex justify-end pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setStudentModalCourse(null)}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ MODAL 3: Create Course ════════════════════════════════ */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                    <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scaleUp">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <span>Create New Course</span>
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

                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Course Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Advanced DSA & System Design"
                                        value={createForm.title}
                                        onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Course Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. DSA-301"
                                        value={createForm.code}
                                        onChange={e => setCreateForm({ ...createForm, code: e.target.value.toUpperCase() })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 uppercase placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Category</label>
                                    <select
                                        value={createForm.category}
                                        onChange={e => setCreateForm({ ...createForm, category: e.target.value })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none font-medium"
                                    >
                                        {CATEGORIES.filter(c => c !== 'ALL').map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Level</label>
                                    <select
                                        value={createForm.level}
                                        onChange={e => setCreateForm({ ...createForm, level: e.target.value })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none font-medium"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Est. Hours</label>
                                    <input
                                        type="number"
                                        defaultValue={40}
                                        value={createForm.estimatedTotalHours}
                                        onChange={e => setCreateForm({ ...createForm, estimatedTotalHours: Number(e.target.value) })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Course learning goals and overview..."
                                    value={createForm.description}
                                    onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                                    className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all cursor-pointer shadow-xs"
                                >
                                    {createLoading ? 'Creating...' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;

