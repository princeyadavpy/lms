import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    GraduationCap,
    Plus,
    Building2,
    Users,
    Layers,
    Search,
    Shield,
    CheckCircle2,
    X,
    ExternalLink
} from 'lucide-react';

const AdminInstitutions = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [form, setForm] = useState({
        name: '',
        code: '',
        domain: '',
        type: 'University',
        plan: 'enterprise',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        address: ''
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    const fetchInstitutions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/institutions');
            if (res.data.success) {
                setInstitutions(res.data.data);
            }
        } catch (err) {
            console.error('Failed to load institutions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setCreateError('');
        try {
            const res = await api.post('/institutions', form);
            if (res.data.success) {
                setShowCreateModal(false);
                setForm({
                    name: '',
                    code: '',
                    domain: '',
                    type: 'University',
                    plan: 'enterprise',
                    contactPerson: '',
                    contactEmail: '',
                    contactPhone: '',
                    address: ''
                });
                fetchInstitutions();
            }
        } catch (err) {
            setCreateError(err.response?.data?.msg || 'Failed to create institution');
        } finally {
            setCreateLoading(false);
        }
    };

    const filtered = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeInUp pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-blue-600" />
                        <span>Institution & College Management</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Onboard universities, configure multi-tenant boundaries, and manage academic cohorts.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search colleges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all w-56"
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-xs cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Onboard Institution</span>
                    </button>
                </div>
            </div>

            {/* Institutions Grid */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="hl-spinner" style={{ width: '32px', height: '32px' }} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl p-12 text-center bg-white border border-slate-200">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-800">No institutions found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your search or onboard a new institution above.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((inst) => (
                        <div
                            key={inst._id}
                            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                        {inst.code}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        {inst.type}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-slate-900">{inst.name}</h3>
                                {inst.domain && (
                                    <p className="text-xs font-medium text-slate-500">{inst.domain}</p>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Active Batches</span>
                                        <span className="text-base font-black text-blue-600">{inst.stats?.batchCount || 0}</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Enrolled Students</span>
                                        <span className="text-base font-black text-emerald-600">{inst.stats?.studentCount || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">Contact: {inst.contactPerson || 'Coordinator'}</span>
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal: Onboard New Institution */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                    <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scaleUp">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                <span>Onboard College / Institution</span>
                            </h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {createError && (
                            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
                                {createError}
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Institution Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Shoolini University"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Code / Abbr</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. SHOOLINI"
                                        value={form.code}
                                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 uppercase placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Domain</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. shoolini.edu"
                                        value={form.domain}
                                        onChange={(e) => setForm({ ...form, domain: e.target.value })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Type</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                                    >
                                        <option value="University">University</option>
                                        <option value="College">College</option>
                                        <option value="Institute">Institute</option>
                                        <option value="TrainingPartner">Training Partner</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        placeholder="Dean / Coordinator"
                                        value={form.contactPerson}
                                        onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        placeholder="academics@college.edu"
                                        value={form.contactEmail}
                                        onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
                                    />
                                </div>
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
                                    {createLoading ? 'Saving...' : 'Save Institution'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInstitutions;
