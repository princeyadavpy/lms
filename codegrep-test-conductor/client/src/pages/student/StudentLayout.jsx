import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LMSNavbar from '../../components/layout/LMSNavbar';

const StudentLayout = () => {
    const location = useLocation();
    const isFullScreenLearn = location.pathname.includes('/courses/') && location.pathname.includes('/learn');

    return (
        <div className="lms-section min-h-screen flex flex-col w-full overflow-x-hidden font-sans" style={{ background: '#f6f8fa', minHeight: '100vh' }}>
            <LMSNavbar />
            {isFullScreenLearn ? (
                <main className="flex-1 w-full flex flex-col p-0 m-0 overflow-hidden">
                    <Outlet />
                </main>
            ) : (
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
                    <Outlet />
                </main>
            )}
        </div>
    );
};

export default StudentLayout;
