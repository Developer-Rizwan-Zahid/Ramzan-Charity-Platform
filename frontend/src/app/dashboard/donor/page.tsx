'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    Heart,
    TrendingUp,
    Users,
    Calendar,
    Wallet,
    ArrowUpRight,
    Clock,
    ExternalLink
} from 'lucide-react';
import api from '@/utils/api';

export default function DonorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalDonated: 0,
        casesImpacted: 0,
        monthlyRank: 'Silver',
        nextBadge: 5000
    });
    const [recentDonations, setRecentDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/donations/my');
                if (response.data) {
                    const total = response.data.reduce((acc: number, curr: any) => acc + curr.amount, 0);
                    const uniqueCases = new Set(response.data.map((d: any) => d.helpRequestId)).size;
                    setStats(prev => ({ ...prev, totalDonated: total, casesImpacted: uniqueCases }));
                    setRecentDonations(response.data.slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Donor" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Assalam-o-Alaikum, {user.name}</h1>
                        <p className="text-gray-500 mt-1">May Allah reward your generosity this Ramadan.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-secondary" />
                            Ramadan 15, 1447
                        </span>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Donated"
                        value={`Rs. ${stats.totalDonated.toLocaleString()}`}
                        icon={Wallet}
                        color="primary"
                        trend="+12% from last month"
                    />
                    <StatCard
                        title="Cases Impacted"
                        value={stats.casesImpacted.toString()}
                        icon={Heart}
                        color="secondary"
                        trend="2 cases this week"
                    />
                    <StatCard
                        title="Supporter Rank"
                        value={stats.monthlyRank}
                        icon={TrendingUp}
                        color="primary"
                        trend="1,240 pts to Gold"
                    />
                    <StatCard
                        title="Active Donors"
                        value="14,280"
                        icon={Users}
                        color="secondary"
                        trend="+240 today"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Activity */}
                    <div className="xl:col-span-2 space-y-8">
                        <section className="glass-card bg-white/70 rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Recent Donations</h2>
                                <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                                    View all <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {isLoading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-2xl" />
                                    ))
                                ) : recentDonations.length > 0 ? (
                                    recentDonations.map((donation: any) => (
                                        <div key={donation.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50/50 transition-colors border border-transparent hover:border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <Heart className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{donation.helpRequestTitle || 'General Fund'}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {new Date(donation.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">Rs. {donation.amount.toLocaleString()}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">Completed</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Heart className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500">No donations yet. Start your journey today!</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="max-w-md">
                                    <h2 className="text-2xl font-bold mb-2">Automate Your Sadaqah</h2>
                                    <p className="text-primary-foreground/80">Never miss a single night of rewards in the last 10 days of Ramadan. Schedule your donations now.</p>
                                </div>
                                <button className="bg-white text-primary px-8 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
                                    Setup Auto-Donation
                                </button>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-50" />
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card bg-white/70 rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Suggested Cases</h2>
                            <div className="space-y-6">
                                <SuggestedCase
                                    title="Medical Support for Fatima"
                                    collected={85000}
                                    goal={150000}
                                    category="Health"
                                />
                                <SuggestedCase
                                    title="Ramadan Food Packs"
                                    collected={1200000}
                                    goal={2000000}
                                    category="Food"
                                />
                                <SuggestedCase
                                    title="Orphan Education Fund"
                                    collected={45000}
                                    goal={100000}
                                    category="Education"
                                />
                                <button className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-medium hover:border-primary hover:text-primary transition-all text-sm">
                                    Browse All Cases
                                </button>
                            </div>
                        </div>

                        <div className="glass-card bg-secondary/5 rounded-3xl p-6 border border-secondary/10 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-secondary-foreground mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" /> Zakat Calculator
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">Calculate your Zakat accurately using our modern calculator.</p>
                                <button className="w-full bg-secondary text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-secondary/20 flex items-center justify-center gap-2 group">
                                    Calculate Now <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
    const isPrimary = color === 'primary';
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100"
        >
            <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${isPrimary ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                <p className={`text-[10px] font-semibold mt-2 ${isPrimary ? 'text-primary' : 'text-secondary'}`}>
                    {trend}
                </p>
            </div>
        </motion.div>
    );
}

function SuggestedCase({ title, collected, goal, category }: any) {
    const progress = (collected / goal) * 100;
    return (
        <div className="group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/5 px-2 py-0.5 rounded-md">
                    {category}
                </span>
            </div>
            <h4 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">{title}</h4>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary rounded-full"
                />
            </div>
            <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-gray-500"><span className="font-bold text-gray-700">Rs. {collected.toLocaleString()}</span> raised</p>
                <p className="text-[10px] font-bold text-primary">{Math.round(progress)}%</p>
            </div>
        </div>
    );
}
