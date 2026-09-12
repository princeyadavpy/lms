import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    return (
        <div className="neo-panel bg-white border-[#000B1A] overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-6 border-b-2 border-[#000B1A] flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-widest text-[#000B1A]">Platform Settings</h2>
                <button className="neo-button px-4 py-2 text-[10px] uppercase tracking-wider">
                    Save Changes
                </button>
            </div>

            <div className="p-6 flex-1 flex flex-col items-center justify-center">
                {loading ? (
                    <div className="animate-spin rounded-none h-8 w-8 border-b-4 border-[#000B1A]"></div>
                ) : (
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-[#3b82f6] border-2 border-[#000B1A] shadow-[4px_4px_0_0_#000B1A] rounded-none flex items-center justify-center mx-auto mb-4 text-[#000B1A]">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-widest text-[#000B1A] mb-2">Configure environment</h3>
                        <p className="text-[#000B1A]/70 font-bold text-[10px] uppercase tracking-wider">Configure global constraints such as default test language restrictions and strictness for anti-cheat proctoring.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
