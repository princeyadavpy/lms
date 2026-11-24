import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const cached = localStorage.getItem('user');
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });
    // If user is already cached, don't block render with a full-screen loader
    const [loading, setLoading] = useState(() => {
        const token = localStorage.getItem('token');
        const cachedUser = localStorage.getItem('user');
        return !!token && !cachedUser;
    });

    const checkUser = async () => {
        try {
            if (localStorage.getItem('token')) {
                const res = await api.get('/auth/me');
                const userData = res.data.data;
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/auth/register', { name, email, password, role });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
};
