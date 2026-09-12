import React from 'react';
import { Web3HeroAnimated } from '../components/ui/animated-web3-landing-page';

const Landing = () => {
    return (
        <div className="w-full min-h-screen relative flex flex-col pt-0">
            <Web3HeroAnimated />
            {/* Footer */}
            <div className="absolute bottom-0 w-full text-center py-4 z-20">
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    © {new Date().getFullYear()} HiGen Labs. All rights reserved.
                    &nbsp;·&nbsp;
                    <a href="https://automazior.in" target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--accent-green)', textDecoration: 'none', fontWeight: 600 }}>
                        automazior.in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Landing;
