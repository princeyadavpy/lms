import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Clock, FileCode, CheckCircle2, AlertCircle, ArrowRight, Upload } from 'lucide-react';

const statusConfig = {
    Submitted:     { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    'Under Review':{ bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    Upcoming:      { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    Overdue:       { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' },
    Evaluated:     { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
};

const AssessmentsPortal = () => {
    const assessments = [
        {
            id: 'a1', title: 'Dynamic Pricing Calculator & Cart Checkout',
            courseName: 'Shoolini – Python Programming', type: 'Coding Assignment',
            status: 'Submitted', score: '95 / 100', submittedAt: 'Yesterday at 4:30 PM',
            feedback: 'Excellent edge-case handling for discount calculation and floating-point roundoff.'
        },
        {
            id: 'a2', title: 'N-Queens State Space Tree Solver',
            courseName: 'Modern DSA II', type: 'Coding Problem',
            status: 'Upcoming', deadline: 'In 4 days (Nov 24, 2026)', maxMarks: 100
        },
        {
            id: 'a3', title: 'Hospital Management System OOP Architecture',
            courseName: 'Modern C++ and Object-Oriented Design', type: 'Project Submission',
            status: 'Under Review', submittedAt: 'Nov 15, 2026', maxMarks: 100
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }}>
            <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '999px', background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>
                    <CheckSquare size={14} /> Assessments
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
                    Centralized Assessments &amp; Practical Submissions
                </h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    Submit technical homework, coding problems, and view grading feedback from instructors.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {assessments.map(ass => {
                    const st = statusConfig[ass.status] || statusConfig.Upcoming;
                    return (
                        <div key={ass.id}
                            style={{ padding: '24px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'border-color 0.15s' }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#bfdbfe'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>

                            {/* Header */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            {ass.type}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>·</span>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{ass.courseName}</span>
                                    </div>
                                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{ass.title}</h3>
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '999px', background: st.bg, color: st.color, border: `1px solid ${st.border}`, flexShrink: 0 }}>
                                    {ass.status}
                                </span>
                            </div>

                            {/* Score + Feedback */}
                            {ass.score && (
                                <div style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', fontSize: '13px' }}>
                                    <div>
                                        <span style={{ color: '#64748b' }}>Awarded Score: </span>
                                        <strong style={{ color: '#16a34a', fontWeight: 700 }}>{ass.score}</strong>
                                    </div>
                                    {ass.feedback && (
                                        <div style={{ color: '#475569', fontStyle: 'italic', maxWidth: '400px', fontSize: '12px' }}>
                                            "{ass.feedback}"
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer */}
                            <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                                <span style={{ color: '#94a3b8' }}>
                                    {ass.submittedAt ? `Submitted: ${ass.submittedAt}` : `Deadline: ${ass.deadline}`}
                                </span>
                                <Link to="/student/courses"
                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, color: '#2563eb', textDecoration: 'none', fontSize: '12px' }}
                                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                                    <span>Go to Problem Workspace</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AssessmentsPortal;
