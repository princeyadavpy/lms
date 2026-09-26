import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Web3Layout } from '../../components/layout/Web3Layout';
import companyLogo from '../../assets/company-logo.png';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(email, password);
            if (res.user.role === 'Admin') navigate('/admin');
            else if (res.user.role === 'Teacher') navigate('/teacher');
            else navigate('/student');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    return (
        <Web3Layout>
            <div className="w-full max-w-md animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                {/* Card */}
                <div className="relative rounded-2xl p-8"
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                    }}>

                    {/* Glow accent */}
                    <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.6), transparent)' }} />

                    {/* Logo + Title */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="relative mb-5">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}>
                                <img src={companyLogo} alt="HiGen Labs" className="w-10 h-10 object-contain" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in to your HiGen Labs account</p>
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
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                                Email Address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                style={inputStyle}
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,170,0.12)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    style={{ ...inputStyle, paddingRight: '44px' }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,170,0.12)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    {showPassword ? (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="hl-btn-primary w-full py-3 mt-2"
                            style={{ fontSize: '15px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? (
                                <>
                                    <span className="hl-spinner" style={{ width: '16px', height: '16px' }} />
                                    Signing in...
                                </>
                            ) : 'Sign In →'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-2">
                            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or continue with</span>
                            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                        </div>

                        {/* Google OAuth */}
                        <a
                            href={`${import.meta.env.VITE_API_URL}/auth/google`}
                            className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl text-sm font-medium transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-primary)',
                                textDecoration: 'none',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </a>

                        {/* Register link */}
                        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--accent-green)', textDecoration: 'none' }}>
                                Register as Student
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
                    © {new Date().getFullYear()} HiGen Labs. All rights reserved.
                </p>
            </div>
        </Web3Layout>
    );
};

export default Login;
