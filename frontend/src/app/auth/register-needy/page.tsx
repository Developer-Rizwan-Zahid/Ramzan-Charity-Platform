'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2, ArrowRight, CreditCard } from 'lucide-react';

export default function RegisterNeedyPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cnic: '',
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

        if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
            setError('Invalid CNIC format. Use: 00000-0000000-0');
            return;
        }

        setIsLoading(true);

        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'Needy',
                cnic: formData.cnic
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
        let value = e.target.value;
        if (e.target.name === 'cnic') {
            // Auto-format CNIC: 00000-0000000-0
            value = value.replace(/\D/g, '');
            if (value.length > 5 && value.length <= 12) {
                value = value.slice(0, 5) + '-' + value.slice(5);
            } else if (value.length > 12) {
                value = value.slice(0, 5) + '-' + value.slice(5, 12) + '-' + value.slice(12, 13);
            }
        }
        setFormData({ ...formData, [e.target.name]: value });
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
                    <h2 className="text-2xl font-bold text-gray-900">Request Help</h2>
                    <p className="text-gray-600 mt-2">Register to receive support from our community</p>
                </div>

                <div className="glass-card p-8 rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div className="space-y-1">
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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 block">
                                Email Address
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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 block">
                                CNIC Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    name="cnic"
                                    required
                                    value={formData.cnic}
                                    onChange={handleChange}
                                    maxLength={15}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                    placeholder="00000-0000000-0"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400">CNIC is required for identity verification.</p>
                        </div>

                        <div className="space-y-1">
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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Apply Now <UserPlus className="w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <Link
                                href="/auth/login"
                                className="font-semibold text-primary hover:text-primary/80 flex inline-flex items-center gap-1 group"
                            >
                                Sign In <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
