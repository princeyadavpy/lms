import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';
import {
    BookOpen, Code2, HelpCircle, Award, ChevronLeft, ChevronRight,
    BarChart3, GraduationCap, TrendingUp, CheckCircle2, Zap, ArrowRight,
    Flame, Target, Compass
} from 'lucide-react';

const NavBtn = () => (
    <div className="flex items-center gap-1.5">
        {[ChevronLeft, ChevronRight].map((Btn, i) => (
            <button key={i} className="w-8 h-8 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                <Btn size={16} />
            </button>
        ))}
    </div>
);

const OutlineLink = ({ to, children }) => (
    <Link
        to={to}
        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer no-underline whitespace-nowrap"
    >
        {children}
    </Link>
);

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localProgressMap, setLocalProgressMap] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('higen_student_progress') || '{}');
        } catch {
            return {};
        }
    });
    const [backendProgressMap, setBackendProgressMap] = useState({});

    const fetchDashboardData = async () => {
        try {
            const [cRes, lRes, pRes] = await Promise.allSettled([
                api.get('/courses'),
                api.get('/labs'),
                api.get('/courses/progress/my')
            ]);
            if (cRes.status === 'fulfilled' && cRes.value.data.success) {
                setCourses(cRes.value.data.data);
            }
            if (lRes.status === 'fulfilled' && lRes.value.data.success) {
                setLabs(lRes.value.data.data);
            }
            if (pRes.status === 'fulfilled' && pRes.value.data.success) {
                setBackendProgressMap(pRes.value.data.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const handleProgressUpdated = async (e) => {
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
                    // Also refresh backend progress map
                    try {
                        const pRes = await api.get('/courses/progress/my');
                        if (pRes.data.success) setBackendProgressMap(pRes.data.data);
                    } catch {}
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

    const institutionName = user?.institutionId?.name || user?.orgId?.name || 'Shoolini University';
    const batchName = user?.batchIds?.[0]?.name || 'DSA Training Batch 2026';

    const getCourseProgress = (course) => {
        const cId = course._id ? course._id.toString() : '';
        const cCode = course.code;
        // 1. Backend progress (most accurate — from StudentProgress model)
        if (cId && backendProgressMap[cId]?.overallPercentage !== undefined) {
            return backendProgressMap[cId].overallPercentage;
        }
        // 2. LocalStorage (real-time optimistic update)
        if (cId && localProgressMap[cId]?.overallPercentage !== undefined) {
            return localProgressMap[cId].overallPercentage;
        }
        if (cCode && localProgressMap[cCode]?.overallPercentage !== undefined) {
            return localProgressMap[cCode].overallPercentage;
        }
        // 3. API-enriched field from getCourses
        if (course.overallPercentage !== undefined && course.overallPercentage !== null) {
            return course.overallPercentage;
        }
        return 0;
    };

    const enrolledCourses = courses.filter(c => c.isEnrolled !== false);
    const activeCourseList = enrolledCourses.length > 0 ? enrolledCourses : courses;
    const displayCourses = activeCourseList.slice(0, 2);
    const displayLabs = labs.slice(0, 2);

    const upcomingQuizzes = [
        { id: 'q1', title: 'Quiz – Control Flow', courseName: courses[0]?.title || 'Course Quiz', courseId: courses[0]?._id },
        { id: 'q2', title: 'Quiz – Backtracking', courseName: courses[1]?.title || 'Course Quiz', courseId: courses[1]?._id }
    ];
    const avgProgress = activeCourseList.length > 0
        ? activeCourseList.reduce((sum, c) => sum + getCourseProgress(c), 0) / activeCourseList.length
        : 0;

    const stats = [
        { label: 'Active Courses', value: `${activeCourseList.length}`, sub: 'Enrolled Modules', delta: '+1.8%', icon: BookOpen },
        { label: 'Lab Exercises', value: `${labs.length}`, sub: 'Solved Problems', delta: '+12%', icon: Code2 },
        { label: 'Quizzes Passed', value: '6', sub: 'Evaluations', delta: '100%', icon: HelpCircle },
        { label: 'Overall Progress', value: `${Math.round(avgProgress)}%`, sub: 'Curriculum Completion', delta: 'Active', icon: Award },
    ];

    if (loading) {
        return (
            <div className="flex flex-col gap-6 pb-12 font-sans animate-pulse">
                <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200/80">
                    <div className="h-6 w-56 bg-slate-100 rounded-full mb-4" />
                    <div className="h-9 w-72 bg-slate-200 rounded-xl mb-2" />
                    <div className="h-4 w-96 max-w-full bg-slate-100 rounded-lg" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 h-24" />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3.5">
                        <div className="h-28 rounded-2xl bg-white border border-slate-200/80" />
                        <div className="h-28 rounded-2xl bg-white border border-slate-200/80" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="h-44 rounded-2xl bg-white border border-slate-200/80" />
                        <div className="h-44 rounded-2xl bg-white border border-slate-200/80" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 pb-12 font-sans">

            {/* ── Welcome Banner Card ─────────────────────────────────────────── */}
            <div className="relative rounded-2xl p-6 sm:p-8 bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)]">
                <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
                    <div>
                        {/* Institution Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-700 text-xs font-bold mb-3 shadow-2xs">
                            <GraduationCap size={15} className="text-slate-600" />
                            <span>{institutionName}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 font-semibold">{batchName}</span>
                        </div>

                        {/* Greeting */}
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight m-0 font-sans">
                            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl leading-relaxed font-medium">
                            Track your curriculum progression, interactive visual code walk-throughs, and lab exercises with real-time feedback.
                        </p>
                    </div>

                    <Link
                        to="/student/exams"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold no-underline shadow-xs transition-all shrink-0 cursor-pointer"
                    >
                        <Award size={16} />
                        <span>Go to Exam</span>
                    </Link>
                </div>

                {/* Reference Dashboard KPI Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-50 transition-all flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="ref-label text-[10px]">
                                        <Icon size={14} className="text-slate-400" />
                                        <span>{s.label}</span>
                                    </div>
                                    <span className="ref-badge-green text-[10px]">
                                        {s.delta}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                                        {s.value}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                        {s.sub}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── 2 Column: Resume Learning + Recommended Labs ─────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Resume Learning */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="ref-label">
                            <BookOpen size={14} className="text-blue-600" />
                            <span>RESUME LEARNING</span>
                        </div>
                        <NavBtn />
                    </div>
                    <div className="flex flex-col gap-3.5">
                        {displayCourses.map((course, idx) => {
                            const progress = getCourseProgress(course);
                            const grade = progress > 0 ? `${progress}%` : '0%';
                            const cId = course._id ? course._id.toString() : '';
                            const progData = backendProgressMap[cId];
                            const totalMins = progData?.totalTimeSpentMinutes || course.timeSpentMinutes || 0;
                            const timeSpent = totalMins > 0 ? `${Math.floor(totalMins)}min` : '0min';
                            return (
                                <div key={course._id}
                                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-slate-900 mb-1 truncate">
                                                {course.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium">
                                                Course Grade • <strong className="text-slate-900 font-bold">{grade}</strong>
                                                {' '}|{' '}
                                                Time Spent • <strong className="text-slate-900 font-bold">{timeSpent}</strong>
                                            </p>
                                        </div>
                                        <OutlineLink to={`/student/courses/${course._id}/learn`}>Continue</OutlineLink>
                                    </div>
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full bg-slate-900 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 min-w-[32px] text-right font-mono">{progress}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center pt-1">
                        <Link to="/student/courses" className="text-xs font-bold text-slate-900 hover:text-black no-underline inline-flex items-center gap-1.5">
                            <span>View All Courses</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Recommended Labs */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="ref-label">
                            <Code2 size={14} className="text-purple-600" />
                            <span>RECOMMENDED LABS</span>
                        </div>
                        <NavBtn />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {displayLabs.map((lab, idx) => {
                            const score = idx === 0 ? '48.57/50' : '44.29/50';
                            return (
                                <div key={lab._id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 flex flex-col justify-between gap-4 transition-all">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-bold uppercase tracking-wider mb-2.5">
                                            <Code2 size={12} /> LAB
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-900 mb-2 leading-snug line-clamp-2">{lab.title}</h3>
                                        <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                            <BarChart3 size={13} className="text-amber-500" /> Score: {score}
                                        </p>
                                        <p className="text-[11px] text-slate-400 font-medium mb-3">10/10 Questions</p>
                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="w-full h-full bg-emerald-500 rounded-full" />
                                        </div>
                                    </div>
                                    <OutlineLink to={`/student/labs/${lab._id}`}>Continue</OutlineLink>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center pt-1">
                        <Link to="/student/labs" className="text-xs font-bold text-blue-600 hover:text-blue-700 no-underline inline-flex items-center gap-1.5">
                            <span>View All Labs</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Up Next: Quizzes ──────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="ref-label">
                        <HelpCircle size={14} className="text-emerald-600" />
                        <span>UP NEXT FOR YOU</span>
                    </div>
                    <NavBtn />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {upcomingQuizzes.map(quiz => (
                        <div key={quiz.id}
                            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 flex items-center justify-between gap-4 transition-all">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 text-[10px] font-bold uppercase tracking-wider mb-2">
                                    <HelpCircle size={12} /> QUIZ
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mb-1">{quiz.title}</h3>
                                <p className="text-xs text-slate-500 font-medium">{quiz.courseName}</p>
                            </div>
                            <OutlineLink to={quiz.courseId ? `/student/courses/${quiz.courseId}/learn` : '/student/quizzes'}>
                                Take Quiz
                            </OutlineLink>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default StudentDashboard;
