import React from 'react';

const LiveMonitor = () => (
    <div className="neo-panel bg-white border-[#000B1A] overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-6 border-b-2 border-[#000B1A]">
            <h2 className="text-xl font-black text-[#000B1A] uppercase tracking-widest">Live Monitor</h2>
            <p className="text-[10px] text-[#000B1A]/70 font-bold uppercase tracking-wider mt-0.5">Real-time invigilation of active exam sessions</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 bg-[#a855f7] border-2 border-[#000B1A] rounded-none flex items-center justify-center mx-auto mb-4 text-[#000B1A] shadow-[4px_4px_0_0_#000B1A]">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </div>
            <h3 className="text-lg font-black text-[#000B1A] uppercase tracking-widest mb-2">Real-Time Proctoring Panel</h3>
            <p className="text-[#000B1A]/70 text-sm font-bold max-w-md">
                The live monitor will display active students, tab-switch alerts, submission timelines, and suspicious behavior logs in real-time via Socket.io — coming in Phase 2.
            </p>
            <div className="mt-6 flex items-center space-x-2 bg-white border-2 border-[#a855f7] px-4 py-3 rounded-none shadow-[4px_4px_0_0_#a855f7]">
                <span className="w-2 h-2 rounded-none border border-[#000B1A] bg-[#a855f7] animate-pulse"></span>
                <span className="text-[10px] text-[#a855f7] font-black uppercase tracking-wider">Planned: Phase 2 — Real-time WebSocket Invigilation</span>
            </div>
        </div>
    </div>
);

export default LiveMonitor;
