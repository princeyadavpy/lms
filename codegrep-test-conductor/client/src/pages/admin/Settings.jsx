import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, ShieldAlert, Cpu, Globe, Key } from 'lucide-react';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="space-y-6 animate-fadeInUp pb-12 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <SettingsIcon className="w-6 h-6 text-blue-600" />
                        <span>Platform Settings & Policies</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Configure global proctoring policies, Judge0 compiler options, and tenant controls.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                    <Save className="w-4 h-4" />
                    <span>{saved ? 'Saved Successfully!' : 'Save Changes'}</span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-200">
                    <div className="hl-spinner" style={{ width: '32px', height: '32px' }} />
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Proctoring Settings Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Anti-Cheat & Proctoring Engine</h3>
                                <p className="text-xs text-slate-500">Configure sensitivity thresholds for browser lockdown and webcam monitors</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-slate-50">
                                <div>
                                    <p className="font-bold text-slate-800">Fullscreen Enforcement</p>
                                    <p className="text-xs text-slate-500">Auto-submit exam if student exits fullscreen more than 3 times</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                            </div>

                            <div className="flex items-center justify-between py-2 border-b border-slate-50">
                                <div>
                                    <p className="font-bold text-slate-800">Tab Switch & Focus Detection</p>
                                    <p className="text-xs text-slate-500">Track timestamped window blur events in proctoring report</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-bold text-slate-800">Copy / Paste Protection</p>
                                    <p className="text-xs text-slate-500">Block clipboard actions inside the Monaco code editor</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Compiler & Sandbox Settings */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Code Execution Sandbox (Judge0)</h3>
                                <p className="text-xs text-slate-500">Configure CPU execution time limits and memory thresholds</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Max Execution Timeout (Seconds)</label>
                                <input type="number" defaultValue={5} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Memory Limit (MB)</label>
                                <input type="number" defaultValue={256} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
