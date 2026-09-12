import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * OAuth Callback page — receives token from Google redirect and stores it
 * Route: /auth/oauth-callback?token=...&name=...&role=...
 */
export default function OAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { checkUser } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const role = params.get('role');

        if (token) {
            // Store token so AuthContext.checkUser() will pick it up via /auth/me
            localStorage.setItem('token', token);

            checkUser().then(() => {
                const redirectMap = {
                    Admin: '/admin',
                    Teacher: '/teacher',
                    Student: '/student',
                    Recruiter: '/teacher'
                };
                navigate(redirectMap[role] || '/student', { replace: true });
            });
        } else {
            navigate('/login?error=oauth_failed', { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', background: '#0a0a0f', color: '#fff',
            fontFamily: 'Inter, sans-serif', flexDirection: 'column', gap: '16px'
        }}>
            <div style={{
                width: 48, height: 48, border: '3px solid #8B71FF',
                borderTopColor: 'transparent', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: '#a0a0b0', fontSize: 16 }}>Completing sign-in...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
