import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { HelpCircle, CheckCircle2, Lock, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const statusConfig = {
    Completed:  { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: 'Completed' },
    Available:  { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', label: 'Available' },
    Locked:     { bg: '#f8fafc', color: '#94a3b8', border: '#e2e8f0', label: 'Locked' },
    Pending:    { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Pending' },
};

const QuizzesPortal = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

    useEffect(() => {
        api.get('/courses').then(res => {
            if (res.data.success) setCourses(res.data.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    // Extract dynamic quizzes from loaded courses
    const dynamicQuizzes = courses.flatMap(c =>
        (c.quizzes || []).map(q => ({
            id: `${c._id}-${q.moduleId}`,
            title: q.title,
            courseName: c.title,
            courseId: c._id,
            moduleId: q.moduleId,
            status: q.isCompleted ? 'Completed' : (q.isLocked ? 'Locked' : 'Available'),
            score: q.score || 0,
            maxMarks: q.maxMarks || 20,
            percentage: q.percentage || 0,
            attempts: q.attemptsCount || 0,
            timeLimit: q.timeLimit || 15,
            questionsCount: q.questionsCount || 4,
            prerequisite: `Complete all topics in ${q.moduleTitle} to unlock examination`
        }))
    );

    const fallbackQuizzes = [
        { id: 'q1', title: 'Quiz 01: Python Variables and Operations', courseName: 'Programming in Python', courseId: courses[0]?._id, status: 'Completed', score: 20, maxMarks: 20, percentage: 100, attempts: 1, timeLimit: 15 },
        { id: 'q2', title: 'Quiz 02: Control Flow & Branching', courseName: 'Programming in Python', courseId: courses[0]?._id, status: 'Available', maxMarks: 20, attempts: 0, timeLimit: 15 },
        { id: 'q3', title: "Module 01: Programming Fundamentals & C Life Cycle Exam", courseName: "Programming in 'C'", courseId: courses.find(c => c.category === 'C')?._id, status: 'Available', maxMarks: 20, attempts: 0, timeLimit: 15 },
        { id: 'q4', title: "Module 02: 'C' Tokens & Data Types Exam", courseName: "Programming in 'C'", courseId: courses.find(c => c.category === 'C')?._id, status: 'Locked', prerequisite: "Complete all topics in Module 02: 'C' Tokens", maxMarks: 20, attempts: 0, timeLimit: 15 },
    ];

    const displayQuizzes = dynamicQuizzes.length > 0 ? dynamicQuizzes : fallbackQuizzes;

    const filteredQuizzes = displayQuizzes.filter(q => {
        if (selectedCourseFilter !== 'ALL' && q.courseId !== selectedCourseFilter) return false;
        if (selectedStatusFilter !== 'ALL' && q.status !== selectedStatusFilter) return false;
        return true;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }}>
            <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '999px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>
                    <HelpCircle size={14} /> Quizzes
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
                    Centralized Quizzes Portal
                </h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    Review available module checks, test your conceptual knowledge, and unlock subsequent curriculum.
                </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {['ALL', 'Available', 'Completed', 'Locked'].map(st => (
                    <button
                        key={st}
                        onClick={() => setSelectedStatusFilter(st)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: selectedStatusFilter === st ? '#2563eb' : '#e2e8f0',
                            background: selectedStatusFilter === st ? '#2563eb' : '#ffffff',
                            color: selectedStatusFilter === st ? '#ffffff' : '#64748b',
                            transition: 'all 0.15s'
                        }}
                    >
                        {st === 'ALL' ? `All Quizzes (${displayQuizzes.length})` : `${st} (${displayQuizzes.filter(q => q.status === st).length})`}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filteredQuizzes.map(quiz => {
                    const st = statusConfig[quiz.status] || statusConfig.Available;
                    const isCompleted = quiz.status === 'Completed';
                    const isLocked = quiz.status === 'Locked';

                    return (
                        <div key={quiz.id}
                            style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'border-color 0.15s, box-shadow 0.15s', opacity: isLocked ? 0.75 : 1 }}
                            onMouseEnter={(e) => { if (!isLocked) { e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.1)'; } }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}>

                            {/* Top Row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {quiz.courseName}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: st.color }}>
                                    {isCompleted ? <CheckCircle2 size={13} /> : isLocked ? <Lock size={13} /> : <Clock size={13} />}
                                    <span>{isCompleted ? `${quiz.score}/${quiz.maxMarks}` : st.label}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.3 }}>{quiz.title}</h3>
                                {isLocked ? (
                                    <p style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#d97706', margin: 0 }}>
                                        <AlertCircle size={13} style={{ marginTop: '1px', flexShrink: 0 }} />
                                        {quiz.prerequisite}
                                    </p>
                                ) : (
                                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                                        {quiz.timeLimit} mins · Max {quiz.maxMarks} marks · {quiz.attempts}/3 attempts
                                    </p>
                                )}
                            </div>

                            {/* CTA Row */}
                            <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {isLocked ? (
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Complete prerequisites to unlock</span>
                                ) : isCompleted ? (
                                    <Link to={quiz.courseId ? `/student/courses/${quiz.courseId}/learn` : '/student'}
                                        style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                                        Review Solutions <ArrowRight size={13} />
                                    </Link>
                                ) : (
                                    <Link to={quiz.courseId ? `/student/courses/${quiz.courseId}/learn` : '/student'}
                                        style={{ padding: '7px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, background: '#eff6ff', color: '#2563eb', border: '1px solid #2563eb', textDecoration: 'none', transition: 'all 0.15s' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}>
                                        Start Quiz
                                    </Link>
                                )}
                                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px', fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                                    {quiz.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizzesPortal;
