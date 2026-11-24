import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';
import {
    TrendingUp,
    Award,
    BookOpen,
    Clock,
    CheckCircle2,
    Calendar,
    BarChart3,
    GraduationCap
} from 'lucide-react';

const MyProgress = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await api.get('/courses');
                if (res.data.success) {
                    setCourses(res.data.data);
                }
            } catch (err) {
                console.error('Failed to load progress:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    const institutionName = user?.institutionId?.name || user?.orgId?.name || 'Shoolini University';
    const batchName = user?.batchIds?.[0]?.name || 'DSA Training Batch 2026';

    return (
        <div className="space-y-6 animate-fadeInUp pb-12">
            <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '999px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>
                    <TrendingUp size={14} /> Analytics
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
                    My Learning Analytics &amp; Progress
                </h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    Detailed performance tracking across enrolled university batches, quizzes, and coding exams.
                </p>
            </div>

            {/* Profile Overview Card */}
            <div style={{ padding: '24px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '20px', fontWeight: 900, flexShrink: 0, boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
                        {user?.name?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{user?.name || 'Pranshu Pathak'}</h2>
                        <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: '#64748b' }}>
                            <span style={{ color: '#2563eb', fontWeight: 600 }}>{institutionName}</span>
                            <span>•</span>
                            <span style={{ color: '#7c3aed', fontWeight: 600 }}>{batchName}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-center">
                    <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Attendance</span>
                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#16a34a' }}>96.2%</span>
                    </div>
                    <div style={{ width: '1px', height: '36px', background: '#e2e8f0' }} />
                    <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Average Grade</span>
                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#2563eb' }}>A (92.4%)</span>
                    </div>
                </div>
            </div>

            {/* Courses Table / Progress List */}
            <div style={{ padding: '24px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} className="space-y-4">
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Enrolled Curriculum Completion</h3>
                
                <div className="space-y-4">
                    {(courses.length > 0 ? courses : [
                        { _id: 'c1', title: 'Shoolini - Python Programming', overallPercentage: 9, estimatedTotalHours: 35 },
                        { _id: 'c2', title: 'Modern DSA II', overallPercentage: 10, estimatedTotalHours: 45 }
                    ]).map((course) => (
                        <div key={course._id} style={{ padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }} className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{course.title}</h4>
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Est. Duration: {course.estimatedTotalHours || 35} Hours</span>
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb' }}>
                                    {course.overallPercentage || 0}% Complete
                                </span>
                            </div>
                            <div style={{ height: '6px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        width: `${course.overallPercentage || 0}%`,
                                        height: '100%',
                                        background: '#2563eb',
                                        borderRadius: '999px',
                                        transition: 'all 0.3s'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyProgress;
