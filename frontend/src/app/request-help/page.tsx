'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    IndianRupee,
    Upload,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
    HelpCircle,
    Clock,
    Banknote,
    ShieldCheck
} from 'lucide-react';
import api from '@/utils/api';
import Navbar from '@/components/layout/Navbar';

export default function RequestHelpPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amountRequested: '',
        category: 'Medical',
        cnic: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await api.post('/HelpRequests', {
                ...formData,
                amountRequested: parseFloat(formData.amountRequested)
            });

            if (response.data.success) {
                setSuccess(true);
            } else {
                setError(response.data.message || 'Failed to submit request.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-32">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Submit Help Request</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">Fill out the form below with accurate details. Your request will be reviewed by our admin team within 24-48 hours.</p>
                </div>

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card bg-white p-12 rounded-[3rem] shadow-xl text-center border border-gray-100"
                    >
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
                        <p className="text-gray-500 mb-8">Your request has been received and is currently under review. You can track its status in your dashboard.</p>
                        <button
                            onClick={() => router.push('/dashboard/needy')}
                            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Go to Dashboard
                        </button>
                    </motion.div>
                ) : (
                    <div className="glass-card bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                        {/* Progress Bar */}
                        <div className="h-2 bg-gray-50">
                            <motion.div
                                initial={{ width: '33.33%' }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                                className="h-full bg-primary"
                            />
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Request Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                                placeholder="e.g. Medical Emergency Support"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Category</label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none"
                                            >
                                                <option>Medical</option>
                                                <option>Food/Ration</option>
                                                <option>Education</option>
                                                <option>Shelter</option>
                                                <option>Debt Relief</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Detailed Description</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                                                placeholder="Please describe your situation in detail..."
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                                        >
                                            Continue <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Banknote className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Financial Requirements</h2>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Requested Amount (PKR)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rs.</span>
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.amountRequested}
                                                    onChange={(e) => setFormData({ ...formData, amountRequested: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                            <p className="text-xs text-amber-700 leading-relaxed font-medium">Please provide an honest estimate of your requirements. Our admin team may ask for evidence (bills, prescriptions, etc.) during the review process.</p>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold border border-gray-100 hover:bg-gray-100 transition-all"
                                            >
                                                <ArrowLeft className="w-4 h-4" /> Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                Continue <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Review & Submit</h2>
                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-4">
                                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</span>
                                                <span className="text-sm font-bold text-gray-900">{formData.title}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</span>
                                                <span className="text-sm font-bold text-gray-900">{formData.category}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target Amount</span>
                                                <span className="text-lg font-black text-primary">Rs. {Number(formData.amountRequested).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">By submitting, you agree that all information provided is true and accurate to the best of your knowledge.</p>
                                        </div>

                                        {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold border border-gray-100 hover:bg-gray-100 transition-all"
                                            >
                                                <ArrowLeft className="w-4 h-4" /> Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                                            >
                                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Request"}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <GuidelineCard title="Quick Review" desc="Verified users get approved faster." icon={Clock} />
                    <GuidelineCard title="Honesty Policy" desc="All claims are strictly verified." icon={ShieldCheck} />
                    <GuidelineCard title="Support 24/7" desc="Our team is here to help you." icon={HelpCircle} />
                </div>
            </div>
        </div>
    );
}

function GuidelineCard({ title, desc, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary border border-gray-50">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
            </div>
        </div>
    );
}
