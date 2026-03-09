'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowRight, Heart, Home } from 'lucide-react';
import api from '@/utils/api';
import Navbar from '@/components/layout/Navbar';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const transactionId = searchParams.get('transaction_id');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!transactionId) {
                setStatus('error');
                return;
            }

            try {
                // Wait a moment for better UX
                await new Promise(resolve => setTimeout(resolve, 2000));

                const response = await api.post('/donations/verify-payment', JSON.stringify(transactionId), {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.status === 200) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [transactionId]);

    return (
        <div className="max-w-2xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 text-center relative overflow-hidden"
            >
                {/* Background Sparkles/Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                {status === 'verifying' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto relative">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Verifying Donation...</h2>
                        <p className="text-gray-500 font-medium">Please wait while we confirm your contribution with the bank. This usually takes a few seconds.</p>
                    </div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            >
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-green-100 rounded-full -z-10"
                            />
                        </div>

                        <div>
                            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter italic">Alhamdulillah!</h2>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Donation Successful</h3>
                            <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                                May Allah accept your generosity and reward you tenfold during this blessed month of Ramadan.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <button
                                onClick={() => router.push('/dashboard/donor')}
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                View My Impact <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full sm:w-auto px-8 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold border border-gray-100 hover:bg-white hover:shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" /> Home
                            </button>
                        </div>
                    </motion.div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-red-500 rotate-45" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
                        <p className="text-gray-500">We couldn't verify your payment. If you've been charged, please contact our support team with your Transaction ID.</p>
                        <p className="text-xs font-mono text-gray-400 bg-gray-50 p-2 rounded-lg">ID: {transactionId || 'Unknown'}</p>
                        <button
                            onClick={() => router.push('/cases')}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Quote Card */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-center"
            >
                <div className="inline-block p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm">
                    <Heart className="w-5 h-5 text-secondary mx-auto mb-3" />
                    <p className="text-sm italic font-medium text-gray-600">
                        "The believer's shade on the Day of Resurrection will be their charity."
                    </p>
                    <p className="text-[10px] font-bold text-secondary mt-2 uppercase tracking-widest">
                        - Prophet Muhammad (PBUH) -
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default function DonationSuccessPage() {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <Navbar />
            <div className="pt-32 pb-24">
                <Suspense fallback={
                    <div className="flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                }>
                    <SuccessContent />
                </Suspense>
            </div>
        </main>
    );
}
