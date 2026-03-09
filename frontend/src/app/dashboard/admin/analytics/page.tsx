'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    BarChart3,
    TrendingUp,
    Users,
    Wallet,
    Download,
    Calendar,
    Filter,
    PieChart,
    Activity,
    Loader2
} from 'lucide-react';
import api from '@/utils/api';

export default function AdminAnalyticsPage() {
    const { user, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('Month');

    useEffect(() => {
        // Mock loading delay
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user || user.role !== 'Admin') return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Admin" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-gray-500 mt-1">Deep dive into platform growth, donations, and impact metrics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                            {['Week', 'Month', 'Year'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setTimeRange(f)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${timeRange === f ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/10 hover:bg-primary/90 transition-colors">
                            <Download className="w-4 h-4" /> Export Data
                        </button>
                    </div>
                </header>

                {/* High-Level Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <MetricCard title="Total Revenue" value="Rs. 12.4M" icon={Wallet} trend="+18.5%" isPositive={true} />
                    <MetricCard title="Active Donors" value="4,250" icon={Users} trend="+5.2%" isPositive={true} />
                    <MetricCard title="Impacted Lives" value="1,840" icon={TrendingUp} trend="+12.1%" isPositive={true} />
                    <MetricCard title="Conversion Rate" value="64.8%" icon={Activity} trend="-2.4%" isPositive={false} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Donation Trends Chart */}
                    <div className="xl:col-span-2 space-y-8">
                        <section className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Donation Volume Over Time</h2>
                                    <p className="text-xs font-bold text-gray-400 mt-1">Tracking recurring and one-time contributions.</p>
                                </div>
                                <button className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:text-primary transition-colors">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Full Chart Mockup */}
                            <div className="h-72 flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2 border-b border-gray-100">
                                {isLoading ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                                    </div>
                                ) : (
                                    [30, 45, 25, 60, 40, 75, 55, 90, 65, 85, 45, 100, 80, 60, 95].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: `${h}%`, opacity: 1 }}
                                            transition={{ delay: i * 0.03, duration: 0.5 }}
                                            className="flex-1 bg-gradient-to-t from-primary/20 to-primary hover:from-primary hover:to-primary/80 rounded-t-md transition-all group relative cursor-pointer"
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                Rs. {h * 10}k
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Category Breakdown */}
                        <section className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-primary" /> Funds by Category
                            </h2>
                            <div className="space-y-5">
                                <CategoryProgress title="Medical Emergencies" percentage={45} amount="5.5M" color="bg-blue-500" />
                                <CategoryProgress title="Education & Scholarships" percentage={25} amount="3.1M" color="bg-green-500" />
                                <CategoryProgress title="Food & Ration Drives" percentage={20} amount="2.4M" color="bg-amber-500" />
                                <CategoryProgress title="General Sadaqah" percentage={10} amount="1.4M" color="bg-purple-500" />
                            </div>
                        </section>
                    </div>

                    {/* Right Side Stats */}
                    <div className="space-y-6">
                        <section className="glass-card bg-primary text-white rounded-3xl p-6 shadow-xl shadow-primary/20">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" /> Funding Goals
                            </h3>

                            <div className="text-center mb-8">
                                <div className="w-32 h-32 mx-auto border-8 border-white/20 border-t-white rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl font-black">78%</span>
                                </div>
                                <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Ramadan Target Reached</p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <p className="text-xs text-white/70 font-bold mb-1">Target Amount</p>
                                    <p className="text-lg font-black">Rs. 20,000,000</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <p className="text-xs text-white/70 font-bold mb-1">Current Amount</p>
                                    <p className="text-lg font-black">Rs. 15,600,000</p>
                                </div>
                            </div>
                        </section>

                        <section className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Top Donors This Month</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Rizwan Zahid', amount: '500,000' },
                                    { name: 'Anonymous', amount: '250,000' },
                                    { name: 'Ahmed Ali', amount: '120,000' },
                                    { name: 'Sarah Khan', amount: '85,000' }
                                ].map((donor, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                                #{i + 1}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{donor.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900">Rs. {donor.amount}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 py-2.5 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">
                                View Full List
                            </button>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, isPositive }: any) {
    return (
        <div className="glass-card bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                    }`}>
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
            </div>
        </div>
    );
}

function CategoryProgress({ title, percentage, amount, color }: any) {
    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                    <span className="text-[10px] font-bold text-gray-400">Rs. {amount}</span>
                </div>
                <span className="text-sm font-black text-gray-900">{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}
