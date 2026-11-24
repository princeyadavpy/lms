import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { User, Mail, Shield, Key, Building2, Layers } from 'lucide-react';

const StudentProfile = () => {
    const { user } = useContext(AuthContext);
    if (!user) return null;

    const initial = user.name?.charAt(0).toUpperCase() || 'S';

    const infoRows = [
        { label: 'Full Name', value: user.name, icon: User },
        { label: 'Email Address', value: user.email, icon: Mail },
        { label: 'Account Role', value: user.role, icon: Shield },
        { label: 'User ID', value: user.id || user._id, mono: true, icon: Key },
    ];

    const institutionName = user?.institutionId?.name || user?.orgId?.name || 'HiGen Labs';
    const batchName = user?.batchIds?.[0]?.name || 'Standard Batch';

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeInUp pb-12">
            {/* Profile Header Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                {/* Banner */}
                <div
                    className="h-36 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)' }}
                >
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                </div>

                {/* Avatar + Info */}
                <div className="px-6 sm:px-8 pb-7 pt-0 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-5">
                        <div className="flex items-end gap-5">
                            <div
                                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0 text-white shadow-xl relative z-20 border-4 border-white"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                            >
                                {initial}
                            </div>
                            <div className="pb-1 relative z-20">
                                <h2 className="text-2xl font-black tracking-tight text-slate-900">{user.name}</h2>
                                <p className="text-sm font-medium text-slate-500">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 pb-1 relative z-20">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                {user.role}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 sm:px-8 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-sm text-slate-900">Account Information</h3>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                    {infoRows.map((row, i) => {
                        const Icon = row.icon;
                        return (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                    <Icon className="w-4 h-4 text-slate-400" />
                                    <span>{row.label}</span>
                                </div>
                                <span className={`text-sm font-bold text-slate-900 ${row.mono ? 'font-mono text-xs' : ''}`}>
                                    {row.value}
                                </span>
                            </div>
                        );
                    })}
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span>Institution</span>
                        </div>
                        <span className="text-sm font-bold text-blue-600">{institutionName}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <Layers className="w-4 h-4 text-slate-400" />
                            <span>Assigned Batch</span>
                        </div>
                        <span className="text-sm font-bold text-purple-600">{batchName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
