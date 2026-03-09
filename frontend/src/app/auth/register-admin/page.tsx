'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterAdminPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'Admin'
            });

            if (result.success) {
                router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`);
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12 relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-blue-600" /> Admin Portal
                        </h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">Platform Administrator</h2>
                    <p className="text-gray-600 mt-2">Register with restricted access privileges</p>
                </div>

                <div className="glass-card p-8 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                                    placeholder="Admin Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                                Admin Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Register Admin <ShieldCheck className="w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link
                            href="/auth/login"
                            className="font-semibold text-blue-600 hover:text-blue-800 flex inline-flex items-center gap-1 group text-sm"
                        >
                            Return to Login <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
