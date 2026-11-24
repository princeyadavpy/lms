import React, { useState, useEffect, useRef, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';
import {
    Users as UsersIcon,
    UserPlus,
    UploadCloud,
    Zap,
    Search,
    Shield,
    CheckCircle2,
    XCircle,
    Trash2,
    X
} from 'lucide-react';

const ROLES = ['Student', 'Teacher', 'Recruiter', 'Admin'];

const roleBadge = (role, isActive = true) => {
    const colors = {
        Admin: 'bg-red-50 text-red-700 border-red-200',
        Teacher: 'bg-blue-50 text-blue-700 border-blue-200',
        Student: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Recruiter: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    const base = colors[role] || 'bg-slate-50 text-slate-700 border-slate-200';
    return `px-2.5 py-0.5 rounded-full border text-xs font-bold inline-flex items-center gap-1 ${base} ${!isActive ? 'opacity-50' : ''}`;
};

// ── CSV parser (runs client-side) ─────────────────────────────────
function parseCSV(text) {
    const lines = text.trim().split('\n').filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
        return { name: obj.name, email: obj.email, password: obj.password || '', role: obj.role || 'Student' };
    }).filter(u => u.name && u.email);
}

// ── Create User Modal ─────────────────────────────────────────────
function CreateUserModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Student' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await api.post('/admin/users', form);
            if (res.data.success) { onCreated(res.data.data); onClose(); }
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create user');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-[460px] p-6 sm:p-8 shadow-2xl animate-scaleUp">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                    <h3 className="text-slate-900 text-lg font-black tracking-tight flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                        <span>Create New User</span>
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 font-semibold p-3.5 rounded-xl text-xs">
                            {error}
                        </div>
                    )}
                    {[['Full Name', 'name', 'text', 'Jane Smith'], ['Email Address', 'email', 'email', 'jane@company.com'], ['Password', 'password', 'password', 'Min 6 characters']].map(([label, key, type, ph]) => (
                        <div key={key}>
                            <label className="block text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-1">{label}</label>
                            <input
                                value={form[key]}
                                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                type={type}
                                placeholder={ph}
                                required
                                className="w-full px-3.5 py-2.5 border border-slate-300 bg-slate-50 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium placeholder-slate-400"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-1">Account Role</label>
                        <select
                            value={form.role}
                            onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                            className="w-full px-3.5 py-2.5 border border-slate-300 bg-slate-50 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                        >
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all shadow-xs cursor-pointer">
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Bulk Import Modal ─────────────────────────────────────────────
function BulkImportModal({ onClose, onDone }) {
    const [rows, setRows] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const parsed = parseCSV(ev.target.result);
            if (!parsed.length) setError('No valid user rows found. Required headers: name, email');
            else { setRows(parsed); setError(''); }
        };
        reader.readAsText(file);
    };

    const submit = async () => {
        setLoading(true); setError('');
        try {
            const res = await api.post('/admin/users/bulk', { users: rows });
            if (res.data.success) setResult(res.data.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Import failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-[560px] p-6 sm:p-8 shadow-2xl animate-scaleUp">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                    <h3 className="text-slate-900 text-lg font-black tracking-tight flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-blue-600" />
                        <span>Bulk Import Users (CSV)</span>
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 font-semibold p-3.5 rounded-xl text-xs mb-4">{error}</div>}
                {!result ? (
                    <>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Upload a CSV file with columns: <strong>name, email, password, role</strong></p>
                        <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="mb-4 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                        {rows.length > 0 && (
                            <div className="mb-4 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs text-slate-700">
                                <span className="font-bold text-blue-600">{rows.length} users ready to import</span>
                            </div>
                        )}
                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
                            <button onClick={submit} disabled={!rows.length || loading} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs cursor-pointer">
                                {loading ? 'Importing...' : `Import ${rows.length} Users`}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                        <h4 className="text-base font-black text-slate-900 mb-1">Import Complete</h4>
                        <p className="text-xs text-slate-500 mb-4">Successfully processed user list.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                <div className="text-2xl font-black text-emerald-600">{result.created}</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Created</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                <div className="text-2xl font-black text-amber-600">{result.skipped}</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Skipped</div>
                            </div>
                        </div>
                        <button onClick={() => { onDone(); onClose(); }} className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">Done</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Quick Invite Modal ────────────────────────────────────────────
function QuickInviteModal({ onClose, onDone }) {
    const [emails, setEmails] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const submit = async () => {
        setLoading(true); setError('');
        const list = emails.split(/[\n,]+/).map(e => e.trim()).filter(e => e.includes('@'));
        if (!list.length) { setError('Enter at least one valid email.'); setLoading(false); return; }
        try {
            const res = await api.post('/admin/users/quick-invite', { emails: list });
            if (res.data.success) setResult(res.data.data);
        } catch (err) { setError(err.response?.data?.msg || 'Invite failed'); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-[560px] p-6 sm:p-8 shadow-2xl animate-scaleUp">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                    <h3 className="text-slate-900 text-lg font-black tracking-tight flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <span>Quick Invite Students</span>
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 font-semibold p-3.5 rounded-xl text-xs mb-4">{error}</div>}
                {!result ? (
                    <>
                        <div className="mb-4">
                            <label className="block text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2">Student Emails (comma or newline separated)</label>
                            <textarea
                                value={emails}
                                onChange={e => setEmails(e.target.value)}
                                rows={6}
                                placeholder="student1@example.com, student2@example.com&#10;student3@example.com"
                                className="w-full border border-slate-300 rounded-xl bg-slate-50 text-slate-900 px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-mono resize-none"
                            />
                            <p className="text-[11px] text-slate-400 font-medium mt-2">Passwords will be auto-generated. Duplicate emails are skipped.</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
                            <button onClick={submit} disabled={loading} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all shadow-xs cursor-pointer">
                                {loading ? 'Inviting...' : 'Invite Students'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                        <h4 className="text-base font-black text-slate-900 mb-1">Invites Sent</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 mt-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                <div className="text-2xl font-black text-emerald-600">{result.created}</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Created</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                <div className="text-2xl font-black text-amber-600">{result.skipped}</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Skipped (Exists)</div>
                            </div>
                        </div>
                        <button onClick={() => { onDone(); onClose(); }} className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">Done</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main Users Page ───────────────────────────────────────────────
const Users = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRole, setEditingRole] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showBulk, setShowBulk] = useState(false);
    const [showQuickInvite, setShowQuickInvite] = useState(false);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            if (res.data.success) setUsers(res.data.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) { alert(err.response?.data?.msg || 'Failed to delete user'); }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const res = await api.put(`/admin/users/${id}/role`, { role: newRole });
            if (res.data.success) setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
        } catch (err) { alert(err.response?.data?.msg || 'Failed to update role'); }
        finally { setEditingRole(null); }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await api.patch(`/admin/users/${id}/toggle-status`);
            if (res.data.success) {
                setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.data.data.isActive } : u));
            }
        } catch (err) { alert(err.response?.data?.msg || 'Failed'); }
    };

    const filtered = users.filter(u => {
        const matchRole = filterRole === 'All' || u.role === filterRole;
        const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        return matchRole && matchSearch;
    });

    return (
        <div className="space-y-6 animate-fadeInUp pb-12">
            {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={u => { setUsers(prev => [u, ...prev]); }} />}
            {showBulk && <BulkImportModal onClose={() => setShowBulk(false)} onDone={fetchUsers} />}
            {showQuickInvite && <QuickInviteModal onClose={() => setShowQuickInvite(false)} onDone={fetchUsers} />}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <UsersIcon className="w-6 h-6 text-blue-600" />
                        <span>User Management</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        {users.length} total users registered across institutions · {filtered.length} currently shown
                    </p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        onClick={() => setShowQuickInvite(true)}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Quick Invite</span>
                    </button>
                    <button
                        onClick={() => setShowBulk(true)}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
                        <span>Bulk Import</span>
                    </button>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
                {/* Search & Filters */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-600 transition-all font-medium placeholder-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                        {['All', ...ROLES].map(r => (
                            <button
                                key={r}
                                onClick={() => setFilterRole(r)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    filterRole === r
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100/70'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="hl-spinner" style={{ width: '32px', height: '32px' }} />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64 text-red-500 font-bold text-sm">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <th className="py-3 px-6">User</th>
                                    <th className="py-3 px-6">Email</th>
                                    <th className="py-3 px-6">Role</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6">Joined</th>
                                    <th className="py-3 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-12 text-slate-400 font-medium">
                                            No users match your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(user => (
                                        <tr key={user._id} className={`hover:bg-slate-50/70 transition-colors ${!user.isActive ? 'opacity-60' : ''}`}>
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black text-xs shrink-0">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-slate-900">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 font-medium text-slate-600">{user.email}</td>
                                            <td className="py-3.5 px-6">
                                                {editingRole === user._id ? (
                                                    <select
                                                        autoFocus
                                                        defaultValue={user.role}
                                                        onChange={e => handleRoleChange(user._id, e.target.value)}
                                                        onBlur={() => setEditingRole(null)}
                                                        className="border border-blue-500 rounded-xl bg-white text-slate-900 text-xs px-2.5 py-1 focus:outline-none font-bold"
                                                    >
                                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                ) : (
                                                    <button onClick={() => setEditingRole(user._id)} title="Click to change role" className="cursor-pointer">
                                                        <span className={roleBadge(user.role, user.isActive !== false)}>{user.role}</span>
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <button
                                                    onClick={() => handleToggleStatus(user._id)}
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                                                        user.isActive !== false
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}
                                                >
                                                    {user.isActive !== false ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="py-3.5 px-6 text-xs text-slate-400 font-medium whitespace-nowrap">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                            </td>
                                            <td className="py-3.5 px-6 text-right">
                                                <button
                                                    onClick={() => handleDelete(user._id, user.name)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
