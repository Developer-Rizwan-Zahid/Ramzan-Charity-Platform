'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    isCnicVerified?: boolean;
    cnic?: string;
    phone?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<any>;
    register: (userData: any) => Promise<any>;
    logout: () => void;
    verifyOtp: (data: { email: string; otpCode: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials: any) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);

                // Role-based redirection
                if (data.user.role === 'Admin') router.push('/dashboard/admin');
                else if (data.user.role === 'Donor') router.push('/dashboard/donor');
                else if (data.user.role === 'Needy') router.push('/dashboard/needy');
            }
            return data;
        } catch (error: any) {
            return error.response?.data || { success: false, message: 'Login failed' };
        }
    };

    const register = async (userData: any) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            return data;
        } catch (error: any) {
            return error.response?.data || { success: false, message: 'Registration failed' };
        }
    };

    const verifyOtp = async (otpData: { email: string; otpCode: string }) => {
        try {
            const { data } = await api.post('/auth/verify-otp', otpData);
            return data;
        } catch (error: any) {
            return error.response?.data || { success: false, message: 'OTP verification failed' };
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, verifyOtp }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
