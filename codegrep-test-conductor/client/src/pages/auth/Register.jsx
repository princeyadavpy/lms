import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import companyLogo from '../../assets/company-logo.png';
import { User, Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';

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

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#f8fafc] text-[#0f172a] relative overflow-hidden font-sans">
            {/* Glow effects */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            {/* Top Navbar */}
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
                    <span className="hidden sm:inline-block text-xs font-semibold text-slate-500">Already have an account?</span>
                    <Link
                        to="/login"
                        className="text-xs font-bold px-4 py-2 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-xs"
                    >
                        Sign In
                    </Link>
                </div>
            </header>

            {/* Form */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-auto">
                <div className="w-full max-w-[460px] bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-10 relative">
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Student Registration</span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                            Create Your Account
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Join HiGen Labs to start your learning & assessments
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Pranshu Pathak"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="student@institution.edu"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="At least 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="Repeat your password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 mt-2 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Complete Registration</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            Already enrolled?{' '}
                            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <footer className="w-full py-4 text-center text-xs text-slate-400 font-medium z-10">
                © {new Date().getFullYear()} HiGen Labs. All rights reserved.
            </footer>
        </div>
    );
};

export default Register;
