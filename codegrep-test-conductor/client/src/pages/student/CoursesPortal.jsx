import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
    BookOpen, Clock, Play, Sparkles, Search, GraduationCap,
    Cpu, Bot, Binary, Terminal, Layers, Code2, Database, CheckCircle2, Lock, X
} from 'lucide-react';

const CATEGORIES = ['ALL', 'DSA', 'ML', 'DL', 'GEN AI', 'AGENTIC AI', 'PYTHON', 'C', 'C++', 'JAVA'];

const CAT_CFG = {
    DSA:        { icon: Binary,   label: 'Data Structures' },
    ML:         { icon: Cpu,      label: 'Machine Learning' },
    DL:         { icon: Layers,   label: 'Deep Learning' },
    'GEN AI':   { icon: Sparkles, label: 'Generative AI' },
    'AGENTIC AI':{ icon: Bot,     label: 'Agentic AI' },
    PYTHON:     { icon: Code2,    label: 'Python' },
    C:          { icon: Terminal, label: 'C Systems' },
    'C++':      { icon: Terminal, label: 'Modern C++' },
    JAVA:       { icon: Database, label: 'Java Backend' },
};

const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80';

const DEFAULT_COURSES = [
    { _id: 'seed-dsa', title: 'Data Structures and Algorithms (DSA)', code: 'DSA-MODERN-2', category: 'DSA', level: 'Intermediate', description: 'Complete curriculum in Data Structures and Algorithms based on ANSI C (C89), GNU/Linux environment, Graphviz, Gnuplot, and classical algorithms literature.', thumbnailUrl: FALLBACK_THUMBNAIL, estimatedTotalHours: 51, totalModulesCount: 9, overallPercentage: 0, isEnrolled: true },
    { _id: 'seed-ml', title: 'Machine Learning & Predictive Modeling', code: 'ML-201', category: 'ML', level: 'Intermediate', description: 'Supervised and unsupervised learning, regression, classification, random forests, clustering with Scikit-Learn.', thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80', estimatedTotalHours: 40, totalModulesCount: 6, overallPercentage: 0, isEnrolled: false },
    { _id: 'seed-dl', title: 'Deep Learning, Neural Networks & PyTorch', code: 'DL-301', category: 'DL', level: 'Advanced', description: 'Multi-layer perceptrons, CNNs for computer vision, RNNs, and transformer architectures using PyTorch.', thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80', estimatedTotalHours: 50, totalModulesCount: 8, overallPercentage: 0, isEnrolled: false },
    { _id: 'seed-genai', title: 'Generative AI, LLMs & Prompt Engineering', code: 'GENAI-401', category: 'GEN AI', level: 'Advanced', description: 'Large Language Models, attention mechanisms, prompt engineering, fine-tuning, and RAG pipelines.', thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80', estimatedTotalHours: 35, totalModulesCount: 5, overallPercentage: 0, isEnrolled: false },
    { _id: 'seed-agentic', title: 'Agentic AI & Autonomous Multi-Agent Systems', code: 'AGNT-501', category: 'AGENTIC AI', level: 'Advanced', description: 'Autonomous decision-making loops (ReAct), multi-agent coordination, tool calling, and LangGraph workflows.', thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', estimatedTotalHours: 42, totalModulesCount: 6, overallPercentage: 0, isEnrolled: false },
    { _id: 'seed-py', title: 'Python Programming Masterclass', code: 'SHU-PY-101', category: 'PYTHON', level: 'Beginner', description: 'Comprehensive 12-module Python curriculum: fundamentals, OOP, Multithreading, Databases, and Data Science with NumPy, Pandas, Matplotlib.', thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', estimatedTotalHours: 48, totalModulesCount: 12, overallPercentage: 9, isEnrolled: true },
    { _id: 'seed-c', title: "Programming in 'C'", code: 'C-SYS-101', category: 'C', level: 'Beginner', description: "Complete C programming curriculum: Tokens, Control Statements, Loops, Arrays, Functions, Pointers, Structures, File Handling, and Dynamic Memory.", thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80', estimatedTotalHours: 40, totalModulesCount: 11, overallPercentage: 0, isEnrolled: false },
    { _id: 'seed-cpp', title: "Programming in 'C++'", code: 'CPP-OOP-201', category: 'C++', level: 'Intermediate', description: "Complete C++ programming curriculum: OOP Concepts, C++ Tokens, Classes & Objects, Overloading, Constructors, Inheritance, Files, and Exception Handling.", thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=80', estimatedTotalHours: 42, totalModulesCount: 9, overallPercentage: 0, isEnrolled: false },
    { _id: 'seed-java', title: 'Java Enterprise & Backend Engineering', code: 'JAVA-ENT-201', category: 'JAVA', level: 'Intermediate', description: 'Core Java, JVM internals, Collections, Multi-threading, Streams API, and Spring Boot microservices.', thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', estimatedTotalHours: 45, totalModulesCount: 7, overallPercentage: 0, isEnrolled: false },
];

const CoursesPortal = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [cat, setCat] = useState('ALL');
    const [lockedModalCourse, setLockedModalCourse] = useState(null);
    const [localProgressMap, setLocalProgressMap] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('higen_student_progress') || '{}');
        } catch {
            return {};
        }
    });

    useEffect(() => {
        api.get('/courses').then(res => {
            if (res.data.success && res.data.data.length > 0) {
                let list = res.data.data;
                const dsaCourses = list.filter(c => (c.category || '').toUpperCase() === 'DSA' || (c.title || '').toLowerCase().includes('data structures'));
                if (dsaCourses.length > 1) {
                    const preferredDsa = dsaCourses.find(c => (c.code || '').toUpperCase() === 'DSA-MODERN-2') || dsaCourses[0];
                    list = list.filter(c => !dsaCourses.includes(c) || c === preferredDsa);
                }
                const apiCodes = new Set(list.map(c => (c.code || '').toUpperCase()));
                const apiCategories = new Set(list.map(c => (c.category || '').toUpperCase()));
                setCourses([
                    ...list,
                    ...DEFAULT_COURSES.filter(d => 
                        !apiCodes.has((d.code || '').toUpperCase()) &&
                        !apiCategories.has((d.category || '').toUpperCase())
                    )
                ]);
            } else {
                setCourses(DEFAULT_COURSES);
            }
        }).catch(() => setCourses(DEFAULT_COURSES)).finally(() => setLoading(false));

        const handleProgressUpdated = (e) => {
            try {
                const stored = JSON.parse(localStorage.getItem('higen_student_progress') || '{}');
                setLocalProgressMap(stored);
                if (e.detail?.courseId && e.detail?.overallPercentage !== undefined) {
                    setCourses(prev => prev.map(c => {
                        const cIdStr = c._id ? c._id.toString() : '';
                        const targetIdStr = e.detail.courseId.toString();
                        if (cIdStr === targetIdStr || c.code === e.detail.courseId) {
                            return { ...c, overallPercentage: e.detail.overallPercentage };
                        }
                        return c;
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        };

        window.addEventListener('course-progress-updated', handleProgressUpdated);
        window.addEventListener('storage', handleProgressUpdated);
        return () => {
            window.removeEventListener('course-progress-updated', handleProgressUpdated);
            window.removeEventListener('storage', handleProgressUpdated);
        };
    }, []);

    const getCourseProgress = (course) => {
        const cId = course._id ? course._id.toString() : '';
        const cCode = course.code;
        if (cId && localProgressMap[cId]?.overallPercentage !== undefined) {
            return localProgressMap[cId].overallPercentage;
        }
        if (cCode && localProgressMap[cCode]?.overallPercentage !== undefined) {
            return localProgressMap[cCode].overallPercentage;
        }
        return course.overallPercentage || 0;
    };

    const filtered = courses.filter(c => {
        const catNorm = (c.category || '').toUpperCase();
        const matchCat = cat === 'ALL' || catNorm === cat || (cat === 'C' && catNorm === 'C') || (cat === 'C++' && (catNorm.includes('C++') || catNorm.includes('CPP'))) || (cat === 'GEN AI' && catNorm.includes('GEN')) || (cat === 'AGENTIC AI' && catNorm.includes('AGENTIC'));
        const matchSearch = !search || (c.title + c.code + c.description).toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="space-y-7 pb-16">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-3">
                        <GraduationCap size={13} className="text-slate-600" />
                        <span>Curriculum Hub</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Courses &amp; Learning Tracks
                    </h1>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
                        Browse all available courses across DSA, Machine Learning, Deep Learning, Gen AI, Python, C, C++, and Java. Access requires administrator or college allocation.
                    </p>
                </div>

                {/* Minimal Search Bar */}
                <div className="relative w-full md:w-64 shrink-0">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search topic, tech, code..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-2xs"
                    />
                </div>
            </div>

            {/* ── Filter Pills (Minimal Monochrome) ────────────────── */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map(c => {
                    const cfg = CAT_CFG[c];
                    const active = cat === c;
                    const Icon = cfg?.icon;
                    return (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shrink-0 transition-all cursor-pointer border ${
                                active
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            {Icon && <Icon size={12} className={active ? 'text-white' : 'text-slate-400'} />}
                            <span>{c}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Courses Grid ────────────────────────────────────── */}
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 mb-2">No courses match your filter.</p>
                    <button
                        onClick={() => { setCat('ALL'); setSearch(''); }}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
                    >
                        Reset filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(course => {
                        const catKey = (course.category || '').toUpperCase();
                        const cfg = CAT_CFG[catKey] || { icon: BookOpen, label: course.category };
                        const Icon = cfg.icon || BookOpen;
                        const isEnrolled = course.isEnrolled !== false;
                        const progress = isEnrolled ? getCourseProgress(course) : 0;

                        return (
                            <div
                                key={course._id}
                                className={`group rounded-2xl overflow-hidden bg-white border transition-all duration-200 flex flex-col justify-between ${
                                    isEnrolled
                                        ? 'border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                                        : 'border-slate-200/80 bg-slate-50/40 opacity-90 hover:opacity-100 hover:border-slate-300'
                                }`}
                            >
                                <div>
                                    {/* Thumbnail + Overlays */}
                                    <div className="h-40 relative overflow-hidden bg-slate-100">
                                        <img
                                            src={course.thumbnailUrl && !course.thumbnailUrl.includes('1516116211227') ? course.thumbnailUrl : FALLBACK_THUMBNAIL}
                                            alt={course.title}
                                            onError={(e) => {
                                                if (e.currentTarget.src !== FALLBACK_THUMBNAIL) {
                                                    e.currentTarget.src = FALLBACK_THUMBNAIL;
                                                } else {
                                                    e.currentTarget.style.display = 'none';
                                                }
                                            }}
                                            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
                                                isEnrolled ? 'opacity-90' : 'opacity-65 grayscale-25'
                                            }`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20" />

                                        {/* Top Category Badge */}
                                        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-slate-800 border border-slate-200/80 text-[11px] font-semibold tracking-wide shadow-2xs">
                                            <Icon size={11} className="text-slate-600" />
                                            <span>{course.category || 'Tech'}</span>
                                        </div>

                                        {/* Enrolled / Locked Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            {isEnrolled ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-emerald-700 border border-emerald-200/80 text-[10px] font-bold tracking-wide shadow-2xs">
                                                    <CheckCircle2 size={11} className="text-emerald-600" />
                                                    Allocated
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-slate-600 border border-slate-200 text-[10px] font-bold tracking-wide shadow-2xs">
                                                    <Lock size={10} className="text-slate-500" />
                                                    Locked
                                                </span>
                                            )}
                                        </div>

                                        {/* Course Code Monospace Tag */}
                                        <div className="absolute bottom-2.5 left-3 text-[10px] font-mono font-medium text-white/95 bg-slate-950/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
                                            {course.code}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 pb-3">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                                                {course.title}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                                            {course.description}
                                        </p>

                                        {/* Meta row */}
                                        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock size={13} className="text-slate-400" />
                                                <span>{course.estimatedTotalHours || 35}h</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <Layers size={13} className="text-slate-400" />
                                                <span>{course.totalModulesCount || 5} Modules</span>
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                                {course.level || 'Intermediate'}
                                            </span>
                                        </div>

                                        {/* Progress Bar / Locked Notice */}
                                        <div className="mt-3.5 mb-1">
                                            {isEnrolled ? (
                                                <div>
                                                    <div className="flex justify-between text-[11px] mb-1.5">
                                                        <span className="text-slate-400 font-medium">
                                                            {progress > 0 ? 'Progress' : 'Not Started'}
                                                        </span>
                                                        <span className="font-bold text-slate-900">{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500 bg-slate-900"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center gap-2">
                                                    <Lock size={11} className="text-slate-400 shrink-0" />
                                                    <span className="text-[11px] text-slate-500 font-medium truncate">
                                                        Requires administrator allocation
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Footer */}
                                <div className="p-5 pt-2">
                                    {isEnrolled ? (
                                        <Link
                                            to={`/student/courses/${course._id}/learn`}
                                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs no-underline"
                                        >
                                            <Play size={11} className="fill-current" />
                                            <span>{progress > 0 ? 'Continue Learning' : 'Start Course'}</span>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => setLockedModalCourse(course)}
                                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors cursor-pointer"
                                        >
                                            <Lock size={11} className="text-slate-500" />
                                            <span>Allocation Required</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Access Restricted Modal ──────────────────────────── */}
            {lockedModalCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-fadeIn">
                    <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-7 space-y-4 animate-scaleUp text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center mx-auto">
                            <Lock className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Course Allocation Required</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                <span className="font-semibold text-slate-700">{lockedModalCourse.title}</span> ({lockedModalCourse.code})
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2 leading-relaxed">
                            <p className="font-semibold text-slate-800">Why is this course locked?</p>
                            <p>
                                HiGen Labs enterprise tracks are curriculum-restricted. Your college or platform administrator must allocate this course to your account before you can open modules and practice labs.
                            </p>
                            <p className="text-slate-500 pt-1 text-[11px]">
                                • Contact your university instructor or program coordinator.
                                <br />• Alternatively, wait for your institution's batch assignment.
                            </p>
                        </div>
                        <button
                            onClick={() => setLockedModalCourse(null)}
                            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesPortal;
