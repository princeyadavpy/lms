import React, { useState, useEffect, useRef, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';

const ROLES = ['Student', 'Teacher', 'Recruiter', 'Admin'];

const roleBadge = (role, isActive = true) => {
    const colors = {
        Admin: 'bg-[#ef4444] text-[#000B1A]',
        Teacher: 'bg-[#3b82f6] text-[#000B1A]',
        Student: 'bg-[#10b981] text-[#000B1A]',
        Recruiter: 'bg-[#a855f7] text-[#000B1A]',
    };
    const base = colors[role] || 'bg-white text-[#000B1A]';
    return `px-2.5 py-1 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-[10px] uppercase font-black tracking-wider ${base} ${!isActive ? 'opacity-50' : ''}`;
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="neo-panel bg-white border-[#000B1A] w-[90%] max-w-[460px] p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[#000B1A] text-lg font-black uppercase tracking-widest m-0">➕ Create New User</h3>
                    <button onClick={onClose} className="text-[#000B1A] hover:bg-[#000B1A]/5 border-2 border-transparent hover:border-[#000B1A] rounded-none w-8 h-8 flex items-center justify-center transition-colors">✕</button>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    {error && <div className="bg-[#ef4444] border-2 border-[#0d0a1c] text-[#000B1A] font-black p-3 text-sm">{error}</div>}
                    {[['Full Name', 'name', 'text', 'Jane Smith'], ['Email', 'email', 'email', 'jane@company.com'], ['Password', 'password', 'password', 'Min 6 chars']].map(([label, key, type, ph]) => (
                        <div key={key}>
                            <label className="block text-[#000B1A] text-[10px] font-black uppercase tracking-wider mb-1">{label}</label>
                            <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                type={type} placeholder={ph} required className="w-full px-3 py-2 border-2 border-[#000B1A] bg-white text-[#000B1A] text-sm focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold shadow-[4px_4px_0_0_#000B1A]" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-[#000B1A] text-[10px] font-black uppercase tracking-wider mb-1">Role</label>
                        <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full px-3 py-2 border-2 border-[#000B1A] bg-white text-[#000B1A] text-sm focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold shadow-[4px_4px_0_0_#000B1A]">
                            {ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="neo-button w-full mt-2 py-3 text-sm disabled:opacity-60">
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
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
        reader.onload = (ev) => {
            const parsed = parseCSV(ev.target.result);
            setRows(parsed);
            setError(parsed.length === 0 ? 'No valid rows found. Check format.' : '');
        };
        reader.readAsText(file);
    };

    const submit = async () => {
        if (rows.length === 0) return;
        setLoading(true); setError('');
        try {
            const res = await api.post('/admin/users/bulk', { users: rows });
            setResult(res.data.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Import failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="neo-panel bg-white border-[#000B1A] w-[90%] max-w-[560px] p-8">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-[#000B1A] text-lg font-black uppercase tracking-widest m-0">📥 Bulk Import Users (CSV)</h3>
                    <button onClick={onClose} className="text-[#000B1A] hover:bg-[#000B1A]/5 border-2 border-transparent hover:border-[#000B1A] rounded-none w-8 h-8 flex items-center justify-center transition-colors">✕</button>
                </div>

                {/* Format guide */}
                <div className="bg-white border-2 border-[#000B1A] shadow-[4px_4px_0_0_#000B1A] p-4 mb-5">
                    <p className="text-[#000B1A] text-[10px] font-black uppercase tracking-widest mb-1.5">📋 Required CSV Format</p>
                    <code className="text-[#a855f7] font-bold text-xs">name,email,password,role</code>
                    <br />
                    <code className="text-[#000B1A]/70 font-bold text-[10px]">John Doe,john@example.com,Pass@123,Student</code>
                    <p className="text-[#000B1A]/60 font-bold text-[10px] mt-1.5 uppercase tracking-wider">password and role are optional (defaults: auto-generated, Student)</p>
                </div>

                {error && <div className="bg-[#ef4444] border-2 border-[#0d0a1c] text-[#000B1A] font-black p-3 text-sm mb-4">{error}</div>}

                {!result ? (
                    <>
                        <input type="file" accept=".csv" ref={fileRef} onChange={handleFile}
                            className="hidden" />
                        <button onClick={() => fileRef.current.click()}
                            className="w-full bg-white border-2 border-[#000B1A] text-[#000B1A] font-black uppercase tracking-wider py-3 shadow-[4px_4px_0_0_#000B1A] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-transform mb-4">
                            📂 Choose CSV File
                        </button>

                        {rows.length > 0 && (
                            <div className="mb-4">
                                <p className="text-[#10b981] font-black text-[10px] uppercase tracking-wider mb-2">
                                    ✅ {rows.length} valid rows detected — preview:
                                </p>
                                <div className="max-h-40 overflow-y-auto bg-[#000B1A]/5 border-2 border-[#000B1A] p-3 shadow-[4px_4px_0_0_#000B1A]">
                                    {rows.slice(0, 8).map((r, i) => (
                                        <div key={i} className="text-[10px] text-[#000B1A]/80 py-1 border-b border-white/10 font-bold uppercase tracking-wider">
                                            <b className="text-[#000B1A]">{r.name}</b> · {r.email} · <span className="text-[#a855f7]">{r.role}</span>
                                        </div>
                                    ))}
                                    {rows.length > 8 && <p className="text-[#000B1A]/60 font-bold text-[10px] uppercase tracking-wider mt-1.5">...and {rows.length - 8} more</p>}
                                </div>
                                <button onClick={submit} disabled={loading}
                                    className="neo-button w-full mt-4 py-3 text-sm disabled:opacity-60">
                                    {loading ? 'Importing...' : `Import ${rows.length} Users`}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center">
                        <div className="text-5xl mb-3">✅</div>
                        <h4 className="text-[#000B1A] font-black uppercase tracking-widest mb-4">Import Complete</h4>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {[['Created', result.created, '#10b981'], ['Skipped (duplicates)', result.skipped, '#facc15']].map(([l, v, c]) => (
                                <div key={l} className="bg-white border-2 border-[#000B1A] p-4 shadow-[4px_4px_0_0_#000B1A]">
                                    <div style={{ color: c }} className="text-3xl font-black">{v}</div>
                                    <div className="text-[#000B1A]/70 font-bold text-[10px] uppercase tracking-wider">{l}</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => { onDone(); onClose(); }} className="neo-button w-full py-3 text-sm">Done</button>
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
        const emailList = emails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean);
        if (emailList.length === 0) return setError('Please enter at least one email.');
        
        setLoading(true); setError('');
        try {
            const res = await api.post('/admin/users/bulk-quick', { emails: emailList });
            setResult(res.data.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Invite failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="neo-panel bg-white border-[#000B1A] w-[90%] max-w-[560px] p-8">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-[#000B1A] text-lg font-black uppercase tracking-widest m-0">⚡ Quick Invite</h3>
                    <button onClick={onClose} className="text-[#000B1A] hover:bg-[#000B1A]/5 border-2 border-transparent hover:border-[#000B1A] rounded-none w-8 h-8 flex items-center justify-center transition-colors">✕</button>
                </div>

                {error && <div className="bg-[#ef4444] border-2 border-[#0d0a1c] text-[#000B1A] font-black p-3 text-sm mb-4">{error}</div>}

                {!result ? (
                    <>
                        <div className="mb-4">
                            <label className="block text-[#000B1A] text-[10px] font-black uppercase tracking-wider mb-2">Emails (comma or newline separated)</label>
                            <textarea
                                value={emails}
                                onChange={e => setEmails(e.target.value)}
                                rows={6}
                                placeholder="student1@example.com, student2@example.com&#10;student3@example.com"
                                className="w-full border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold resize-none"
                            />
                            <p className="text-[10px] text-[#000B1A]/70 font-bold uppercase tracking-wider mt-2">Passwords will be auto-generated. Duplicate emails are skipped.</p>
                        </div>
                        <button onClick={submit} disabled={loading}
                            className="neo-button w-full mt-2 py-3 text-sm disabled:opacity-60">
                            {loading ? 'Inviting...' : 'Invite Students'}
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="text-5xl mb-3">✅</div>
                        <h4 className="text-[#000B1A] font-black uppercase tracking-widest mb-4">Invite Complete</h4>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {[['Created', result.created, '#10b981'], ['Skipped (exists)', result.skipped, '#facc15']].map(([l, v, c]) => (
                                <div key={l} className="bg-white border-2 border-[#000B1A] p-4 shadow-[4px_4px_0_0_#000B1A]">
                                    <div style={{ color: c }} className="text-3xl font-black">{v}</div>
                                    <div className="text-[#000B1A]/70 font-bold text-[10px] uppercase tracking-wider">{l}</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => { onDone(); onClose(); }} className="neo-button w-full py-3 text-sm">Done</button>
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
        } catch { setError('Failed to load users.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

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
        <>
            {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={u => { setUsers(prev => [u, ...prev]); }} />}
            {showBulk && <BulkImportModal onClose={() => setShowBulk(false)} onDone={fetchUsers} />}
            {showQuickInvite && <QuickInviteModal onClose={() => setShowQuickInvite(false)} onDone={fetchUsers} />}

            <div className="neo-panel bg-white border-[#000B1A] overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b-2 border-[#000B1A] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-widest text-[#000B1A]">User Management</h2>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#000B1A]/70">{users.length} total users · {filtered.length} shown</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setShowQuickInvite(true)}
                            className="bg-white text-[#000B1A] border-2 border-[#000B1A] px-3 py-2 text-[10px] uppercase tracking-wider font-black shadow-[4px_4px_0_0_#000B1A] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5">
                            ⚡ Quick Invite
                        </button>
                        <button onClick={() => setShowBulk(true)}
                            className="bg-white text-[#000B1A] border-2 border-[#000B1A] px-3 py-2 text-[10px] uppercase tracking-wider font-black shadow-[4px_4px_0_0_#000B1A] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5">
                            📥 Bulk Import
                        </button>
                        <button onClick={() => setShowCreate(true)}
                            className="neo-button px-3 py-2 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                            + Add User
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-5 py-3 border-b-2 border-[#000B1A] flex flex-wrap items-center gap-3">
                    <input
                        placeholder="Search by name or email..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="flex-1 min-w-[200px] border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] px-3 py-2 text-sm shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold"
                    />
                    <div className="flex items-center gap-2">
                        {['All', ...ROLES].map(r => (
                            <button key={r} onClick={() => setFilterRole(r)}
                                className={`px-3 py-1.5 rounded-none border-2 shadow-[2px_2px_0_0_#000B1A] text-[10px] font-black uppercase tracking-wider transition-colors hover:-translate-y-0.5 ${filterRole === r ? 'bg-[#3b82f6] text-[#000B1A] border-[#000B1A]' : 'bg-white text-[#000B1A] border-[#000B1A] hover:bg-[#000B1A]/5'}`}>
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-none h-8 w-8 border-b-4 border-[#000B1A]" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64 text-[#ef4444] font-black uppercase tracking-wider">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-[#000B1A] bg-[#000B1A]/5">
                                    {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-4 text-[10px] font-black text-[#000B1A] uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-white/80">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center p-8 text-[#000B1A] font-black uppercase tracking-widest text-sm">No users match your filter.</td></tr>
                                ) : filtered.map(user => (
                                    <tr key={user._id} className={`hover:bg-[#000B1A]/5 transition-colors ${!user.isActive ? 'opacity-60' : ''}`}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-none border-2 border-[#000B1A] bg-[#a855f7] shadow-[2px_2px_0_0_#000B1A] flex items-center justify-center text-[#000B1A] font-black text-sm flex-shrink-0">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-black text-[#000B1A] text-sm">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[#000B1A]/70 font-bold text-sm">{user.email}</td>
                                        <td className="px-5 py-4">
                                            {editingRole === user._id ? (
                                                <select autoFocus defaultValue={user.role}
                                                    onChange={e => handleRoleChange(user._id, e.target.value)}
                                                    onBlur={() => setEditingRole(null)}
                                                    className="border-2 border-[#000B1A] rounded-none bg-white text-[#000B1A] text-sm px-2 py-1.5 shadow-[4px_4px_0_0_#000B1A] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold">
                                                    {ROLES.map(r => <option key={r}>{r}</option>)}
                                                </select>
                                            ) : (
                                                <button onClick={() => setEditingRole(user._id)} title="Click to change role"
                                                    className="hover:-translate-y-0.5 transition-transform">
                                                    <span className={roleBadge(user.role, user.isActive !== false)}>{user.role}</span>
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => handleToggleStatus(user._id)}
                                                className={`px-2.5 py-1 rounded-none border-2 shadow-[2px_2px_0_0_#000B1A] text-[10px] font-black uppercase tracking-wider transition-colors hover:-translate-y-0.5 ${user.isActive !== false ? 'bg-[#10b981] text-[#000B1A] border-[#000B1A]' : 'bg-white text-[#000B1A] border-[#000B1A]'}`}>
                                                {user.isActive !== false ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4 text-[#000B1A]/70 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => handleDelete(user._id, user.name)}
                                                className="text-[#000B1A] hover:text-[#000B1A] hover:bg-[#ef4444] px-3 py-1.5 rounded-none border-2 border-[#000B1A] shadow-[2px_2px_0_0_#000B1A] text-[10px] uppercase tracking-wider font-black transition-colors">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default Users;
