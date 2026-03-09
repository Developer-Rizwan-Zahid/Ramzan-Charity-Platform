'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login({ email, password });
            if (!result.success) {
                setError(result.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12 relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                            <span className="text-secondary">🌙</span> Ramzan Platform
                        </h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
                </div>

                <div className="glass-card p-8 rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 block">
                                    Password
                                </label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm font-medium text-primary hover:text-primary/80"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                        <div className="col-span-2 text-center text-sm text-gray-600 mb-2">
                            Don't have an account?
                        </div>
                        <Link
                            href="/auth/register-donor"
                            className="flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all text-center"
                        >
                            Join as Donor
                        </Link>
                        <Link
                            href="/auth/register-needy"
                            className="flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all text-center"
                        >
                            Join as Needy
                        </Link>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <Link
                            href="/auth/register-admin"
                            className="text-xs text-gray-400 hover:text-primary transition-colors inline-block"
                        >
                            Admin Access
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
