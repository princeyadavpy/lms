import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import companyLogo from '../../assets/company-logo.png';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';

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
            setError(err.response?.data?.msg || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#f8fafc] text-[#0f172a] relative overflow-hidden font-sans">
            {/* Subtle background glow elements */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            {/* Top Minimal Brand Navbar */}
            <header className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-12 flex items-center justify-between z-20">
                <Link to="/login" className="flex items-center gap-3 no-underline group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200 group-hover:scale-105 transition-transform shadow-xs">
                        <img src={companyLogo} alt="HiGen Labs" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-0.5">
                            <span className="text-base font-black tracking-tight text-slate-900">HiGen</span>
                            <span className="text-base font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Labs</span>
                        </div>
                        <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">LMS & Assessment</span>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-xs font-semibold text-slate-500">Need an account?</span>
                    <Link
                        to="/register"
                        className="text-xs font-bold px-4 py-2 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all shadow-xs"
                    >
                        Register
                    </Link>
                </div>
            </header>

            {/* Main Login Area */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-auto">
                <div className="w-full max-w-[440px] bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-10 relative">

                    {/* Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>HiGen Labs Learning Portal</span>
                        </div>
                    </div>

                    {/* Header Text */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Sign in to access your curriculum, labs, & examinations
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    id="login-email"
                                    type="email"
                                    required
                                    placeholder="student@institution.edu"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-11 py-3 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 mt-2 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In to LMS</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Google OAuth Button */}
                    <a
                        href={`${import.meta.env.VITE_API_URL}/auth/google`}
                        className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-xs"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>Continue with Google</span>
                    </a>

                    {/* Bottom Links */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            New student?{' '}
                            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-4 text-center text-xs text-slate-400 font-medium z-10">
                © {new Date().getFullYear()} HiGen Labs. All rights reserved.
            </footer>
        </div>
    );
};

export default Login;
