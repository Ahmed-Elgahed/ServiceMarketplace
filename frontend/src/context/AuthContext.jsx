/**
 * NEUX IDENTITY CONTEXT PROVIDER
 * ------------------------------
 * يدير حالة المستخدم بالكامل (Global State Management).
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosEngine from '../api/AxiosEngine';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // التحقق من الجلسة عند فتح الموقع
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const res = await axiosEngine.get('users/me/'); // هنبني الـ View ده
                    setUser(res.data);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error("Auth initialization failed");
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // دالة تسجيل الدخول (The Login Logic)
    const login = async (username, password) => {
        try {
            const res = await axiosEngine.post('token/', { username, password });
            localStorage.setItem('accessToken', res.data.access);
            localStorage.setItem('refreshToken', res.data.refresh);
            
            const userRes = await axiosEngine.get('users/me/');
            setUser(userRes.data);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.detail || "Login Failed" };
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook مخصص للاستخدام السهل فى أى Component
export const useAuth = () => useContext(AuthContext);