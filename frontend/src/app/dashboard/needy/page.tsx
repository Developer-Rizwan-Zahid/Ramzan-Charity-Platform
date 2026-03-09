'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    LayoutDashboard,
    PlusCircle,
    History,
    Wallet,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    Download
} from 'lucide-react';
import api from '@/utils/api';
import Link from 'next/link';

export default function NeedyDashboard() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        activeRequests: 0,
        totalCollected: 0,
        verifiedStatus: 'Pending'
    });

    useEffect(() => {
        const fetchMyRequests = async () => {
            try {
                const response = await api.get('/HelpRequests/my');
                if (response.data) {
                    setRequests(response.data);
                    const active = response.data.filter((r: any) => r.status !== 'Completed' && r.status !== 'Rejected').length;
                    const collected = response.data.reduce((acc: number, curr: any) => acc + (curr.amountCollected || 0), 0);
                    setStats(prev => ({ ...prev, activeRequests: active, totalCollected: collected }));
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyRequests();
    }, []);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Needy" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
                        <p className="text-gray-500 mt-1">Track your help requests and updates here.</p>
                    </div>
                    <Link
                        href="/request-help"
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <PlusCircle className="w-5 h-5" /> New Help Request
                    </Link>
                </header>

                {/* Verification Alert */}
                {!user.isCnicVerified && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-amber-900">Identity Verification Required</p>
                                <p className="text-xs text-amber-700">Please upload your CNIC documents to get your account verified and requests approved.</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors">
                            Verify Now
                        </button>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Collected"
                        value={`Rs. ${stats.totalCollected.toLocaleString()}`}
                        icon={Wallet}
                        color="primary"
                    />
                    <StatCard
                        title="Active Requests"
                        value={stats.activeRequests.toString()}
                        icon={Clock}
                        color="secondary"
                    />
                    <StatCard
                        title="Account Status"
                        value={user.isCnicVerified ? 'Verified' : 'Unverified'}
                        icon={CheckCircle2}
                        color={user.isCnicVerified ? 'primary' : 'secondary'}
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main List */}
                    <div className="xl:col-span-2">
                        <section className="glass-card bg-white/70 rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">My Help Requests</h2>
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-gray-100 text-gray-500 rounded-full">All</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {isLoading ? (
                                    Array(2).fill(0).map((_, i) => (
                                        <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl" />
                                    ))
                                ) : requests.length > 0 ? (
                                    requests.map((request: any) => (
                                        <RequestItem key={request.id} request={request} />
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                        <PlusCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">You haven't submitted any requests yet.</p>
                                        <Link href="/request-help" className="text-primary font-bold mt-2 inline-block hover:underline">
                                            Submit Your First Request
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card bg-white/70 rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Withdrawal Option</h2>
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-6">
                                <p className="text-xs text-gray-500 mb-1">Available Balance</p>
                                <p className="text-2xl font-black text-primary">Rs. {stats.totalCollected.toLocaleString()}</p>
                            </div>
                            <button
                                disabled={stats.totalCollected <= 0}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:bg-gray-200 disabled:shadow-none hover:scale-[1.02] active:scale-95 transition-all text-sm mb-4"
                            >
                                Withdraw Funds
                            </button>
                            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Secure Bank Transfer</p>
                        </div>

                        <div className="glass-card bg-white/70 rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Help & Support</h2>
                            <div className="space-y-4">
                                <SupportLink title="How to get verified?" icon={CheckCircle2} />
                                <SupportLink title="Withdrawal Timeline" icon={Clock} />
                                <SupportLink title="Download Guide (PDF)" icon={Download} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    const isPrimary = color === 'primary';
    return (
        <div className="glass-card p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${isPrimary ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
        </div>
    );
}

function RequestItem({ request }: any) {
    const progress = (request.amountCollected / request.amountRequested) * 100;

    const statusStyles = {
        'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'Approved': 'bg-blue-50 text-blue-600 border-blue-100',
        'Completed': 'bg-green-50 text-green-600 border-green-100',
        'Rejected': 'bg-red-50 text-red-600 border-red-100',
    };

    const StatusIcon = {
        'Pending': Clock,
        'Approved': CheckCircle2,
        'Completed': CheckCircle2,
        'Rejected': XCircle,
    };

    const status = request.status || 'Pending';
    //@ts-ignore
    const Icon = StatusIcon[status] || Clock;

    return (
        <div className="p-5 rounded-3xl border border-gray-100 hover:border-primary/20 hover:bg-white transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${statusStyles[status as keyof typeof statusStyles]}`}>
                            {status}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{request.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{request.description}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                    <p className="text-xs text-gray-400">Target: <span className="font-bold text-gray-900">Rs. {request.amountRequested.toLocaleString()}</span></p>
                    <p className="text-lg font-black text-primary">Rs. {request.amountCollected?.toLocaleString() || 0}</p>
                </div>
            </div>

            {status !== 'Rejected' && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-center mb-1.5 text-[10px] font-bold">
                        <span className="text-gray-400">Collection Progress</span>
                        <span className="text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function SupportLink({ title, icon: Icon }: any) {
    return (
        <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{title}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>
    );
}
