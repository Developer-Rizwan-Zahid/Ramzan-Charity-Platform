'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Wallet, Heart, ShieldCheck, Loader2 } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: {
        id: number;
        title: string;
        amountRequested: number;
        amountCollected: number;
    };
}

export default function DonationModal({ isOpen, onClose, request }: DonationModalProps) {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/donations/create-checkout', {
                helpRequestId: request.id,
                amount: parseFloat(amount),
                paymentMethod: paymentMethod
            });

            if (response.data.url) {
                // Redirect to payment gateway
                window.location.href = response.data.url;
            }
        } catch (err: any) {
            setError('Failed to initiate donation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        <div className="p-8 md:p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{request.title}</h2>
                                    <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest">Sadaqah Jariyah</p>
                                </div>
                            </div>

                            <form onSubmit={handleDonate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Donation Amount (PKR)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">Rs.</span>
                                        <input
                                            type="number"
                                            required
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-lg font-black"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Select Payment Method</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <PaymentOption
                                            active={paymentMethod === 'Stripe'}
                                            onClick={() => setPaymentMethod('Stripe')}
                                            icon={CreditCard}
                                            label="Stripe / Card"
                                        />
                                        <PaymentOption
                                            active={paymentMethod === 'JazzCash'}
                                            onClick={() => setPaymentMethod('JazzCash')}
                                            icon={Wallet}
                                            label="JazzCash"
                                        />
                                        <PaymentOption
                                            active={paymentMethod === 'EasyPaisa'}
                                            onClick={() => setPaymentMethod('EasyPaisa')}
                                            icon={Wallet}
                                            label="EasyPaisa"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isLoading || !amount}
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Donation"}
                                </button>

                                <div className="flex items-center justify-center gap-2 py-2">
                                    <ShieldCheck className="w-4 h-4 text-green-600" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure & Encrypted Transaction</span>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function PaymentOption({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${active
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-100'
                }`}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-400'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
    );
}
