import React from "react";

export function Web3Background() {
    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes meshFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%  { transform: translate(30px, -20px) scale(1.05); }
                    66%  { transform: translate(-15px, 15px) scale(0.98); }
                }
                @keyframes meshFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%  { transform: translate(-25px, 20px) scale(1.04); }
                    66%  { transform: translate(20px, -10px) scale(0.97); }
                }
                @keyframes meshFloat3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%  { transform: translate(15px, 25px) scale(1.06); }
                }
                @keyframes gridPulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
                .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
                .bg-mesh-1 { animation: meshFloat1 12s ease-in-out infinite; }
                .bg-mesh-2 { animation: meshFloat2 16s ease-in-out infinite; }
                .bg-mesh-3 { animation: meshFloat3 10s ease-in-out infinite; }
                .bg-grid-anim { animation: gridPulse 4s ease-in-out infinite; }
            `}</style>

            <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                {/* Dot grid pattern */}
                <div
                    className="absolute inset-0 bg-grid-anim"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Ambient color blobs */}
                <div
                    className="absolute bg-mesh-1"
                    style={{
                        top: '-10%', left: '-5%',
                        width: '50%', height: '50%',
                        background: 'radial-gradient(ellipse, rgba(0,212,170,0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                    }}
                />
                <div
                    className="absolute bg-mesh-2"
                    style={{
                        bottom: '-10%', right: '-5%',
                        width: '55%', height: '55%',
                        background: 'radial-gradient(ellipse, rgba(79,142,247,0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(50px)',
                    }}
                />
                <div
                    className="absolute bg-mesh-3"
                    style={{
                        top: '30%', left: '40%',
                        width: '40%', height: '40%',
                        background: 'radial-gradient(ellipse, rgba(124,92,252,0.06) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                    }}
                />

                {/* Subtle top-line glow */}
                <div
                    className="absolute top-0 left-0 right-0"
                    style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.3), rgba(79,142,247,0.3), transparent)',
                    }}
                />
            </div>
        </>
    );
}
