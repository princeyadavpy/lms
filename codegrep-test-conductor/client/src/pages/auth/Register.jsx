import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Web3Layout } from '../../components/layout/Web3Layout';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
        if (form.password.length < 6) return setError('Password must be at least 6 characters.');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            navigate('/student');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '11px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    const focusStyle = { borderColor: 'var(--accent-green)', boxShadow: '0 0 0 3px rgba(0,212,170,0.12)' };
    const blurStyle  = { borderColor: 'rgba(255,255,255,0.1)', boxShadow: 'none' };

    const fields = [
        { name: 'name',            type: 'text',     placeholder: 'Full Name',         label: 'Full Name' },
        { name: 'email',           type: 'email',    placeholder: 'you@example.com',   label: 'Email Address' },
        { name: 'password',        type: 'password', placeholder: '••••••••',          label: 'Password (min 6 chars)' },
        { name: 'confirmPassword', type: 'password', placeholder: '••••••••',          label: 'Confirm Password' },
    ];

    return (
        <Web3Layout>
            <div className="w-full max-w-md animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <div className="relative rounded-2xl p-8"
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                    }}>

                    {/* Glow top line */}
                    <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,92,252,0.6), transparent)' }} />

                    {/* Logo + Title */}
                    <div className="flex flex-col items-center text-center mb-7">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)' }}>
                            <img src="/company-logo.png" alt="HiGen Labs" className="w-10 h-10 object-contain" />
                        </div>
                        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Create Account</h2>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Join HiGen Labs as a Student</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-lg flex items-center gap-3 text-sm"
                            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(({ name, type, placeholder, label }) => (
                            <div key={name}>
                                <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                                    {label}
                                </label>
                                <input
                                    id={`register-${name}`}
                                    name={name}
                                    type={type}
                                    required
                                    style={inputStyle}
                                    placeholder={placeholder}
                                    value={form[name]}
                                    onChange={handleChange}
                                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                                    onBlur={e => Object.assign(e.target.style, blurStyle)}
                                />
                            </div>
                        ))}

                        <button
                            id="register-submit"
                            type="submit"
                            disabled={loading}
                            className="hl-btn-primary w-full py-3 mt-2"
                            style={{ fontSize: '15px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? (
                                <>
                                    <span className="hl-spinner" style={{ width: '16px', height: '16px' }} />
                                    Creating account...
                                </>
                            ) : 'Create Student Account →'}
                        </button>

                        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold transition-colors" style={{ color: 'var(--accent-green)', textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>

                <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
                    © {new Date().getFullYear()} HiGen Labs. All rights reserved.
                </p>
            </div>
        </Web3Layout>
    );
};

export default Register;
