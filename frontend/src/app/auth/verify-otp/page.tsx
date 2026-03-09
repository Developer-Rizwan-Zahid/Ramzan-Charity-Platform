'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

function VerifyOtpContent() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { verifyOtp } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
            router.push('/auth/login');
        }
    }, [email, router]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the full 6-digit code');
            return;
        }

        if (!email) return;

        setError('');
        setIsLoading(true);

        try {
            const result = await verifyOtp({ email, otpCode });
            if (result.success) {
                router.push('/auth/login?verified=true');
            } else {
                setError(result.message || 'Verification failed. Please check the code.');
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
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                    <p className="text-gray-600 mt-2">
                        We've sent a 6-digit code to <span className="font-semibold">{email}</span>
                    </p>
                </div>

                <div className="glass-card p-8 rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
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

                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    autoFocus={index === 0}
                                    className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            ))}
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
                                    Verify Code <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Didn't receive the code?{' '}
                        <button className="font-semibold text-primary hover:text-primary/80">
                            Resend Code
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    );
}
