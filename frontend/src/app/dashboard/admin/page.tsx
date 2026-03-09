'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    Users,
    Heart,
    Wallet,
    AlertTriangle,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    Search,
    MoreVertical,
    Filter,
    BarChart3,
    Calendar,
    Loader2
} from 'lucide-react';
import api from '@/utils/api';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDonations: 0,
        pendingRequests: 0,
        fraudAlerts: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const [usersRes, requestsRes, donationsRes] = await Promise.all([
                    api.get('/Admin/stats'),
                    api.get('/HelpRequests'),
                    api.get('/donations/all')
                ]);

                // This is a mockup of how we might aggregate stats
                setStats({
                    totalUsers: usersRes.data.totalUsers || 1250,
                    totalDonations: donationsRes.data.length || 0,
                    pendingRequests: requestsRes.data.filter((r: any) => r.status === 'Pending').length,
                    fraudAlerts: 2 // Mockup
                });
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === 'Admin') {
            fetchAdminStats();
        }
    }, [user]);

    if (loading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user || user.role !== 'Admin') return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Admin" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
                        <p className="text-gray-500 mt-1">Platform overview and management dashboard.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-primary transition-colors relative">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/10">
                            <BarChart3 className="w-4 h-4" /> Export Report
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers.toLocaleString()}
                        icon={Users}
                        color="primary"
                        trend="+12% weekly"
                    />
                    <StatCard
                        title="Total Donations"
                        value={`Rs. ${stats.totalDonations.toLocaleString()}`}
                        icon={Wallet}
                        color="secondary"
                        trend="Rs. 45k today"
                    />
                    <StatCard
                        title="Pending Requests"
                        value={stats.pendingRequests.toString()}
                        icon={AlertTriangle}
                        color="amber"
                        trend="Needs immediate review"
                    />
                    <StatCard
                        title="Fraud Protection"
                        value="Active"
                        icon={ShieldCheck}
                        color="green"
                        trend="Scanning transactions..."
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Management Section */}
                    <div className="xl:col-span-2 space-y-8">
                        <section className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <h2 className="text-lg font-bold text-gray-900">Platform Performance</h2>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold border border-gray-100">1W</button>
                                    <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/5">1M</button>
                                    <button className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold border border-gray-100">1Y</button>
                                </div>
                            </div>

                            {/* Simplified Chart Mockup */}
                            <div className="h-64 flex items-end justify-between gap-2 px-2">
                                {[40, 65, 45, 90, 55, 75, 85, 30, 45, 60, 95, 80].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex-1 bg-primary/20 hover:bg-primary rounded-t-lg transition-colors group relative"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            Rs. {h}k
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-gray-400">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                                <span>Aug</span>
                                <span>Sep</span>
                                <span>Oct</span>
                                <span>Nov</span>
                                <span>Dec</span>
                            </div>
                        </section>

                        <section className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search TXN..."
                                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none w-48 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">
                                            <th className="px-4 py-3">Donor</th>
                                            <th className="px-4 py-3">Case</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        <TransactionRow name="Rizwan Zahid" caseName="Fatima Health Support" amount="50,000" status="Completed" date="Mar 05" />
                                        <TransactionRow name="Ahmed Ali" caseName="General Sadaqah" amount="15,000" status="Completed" date="Mar 05" />
                                        <TransactionRow name="Sarah Khan" caseName="Orphan Education" amount="12,000" status="Pending" date="Mar 04" />
                                        <TransactionRow name="Unknown" caseName="Food Drive" amount="5,000" status="Flagged" date="Mar 04" />
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Right Action Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card bg-primary rounded-3xl p-6 shadow-xl shadow-primary/20 text-white">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6" /> Platform Health
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/70">Success Rate</span>
                                    <span className="font-bold">98.2%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[98%] h-full bg-white rounded-full"></div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/70">System Load</span>
                                    <span className="font-bold">24%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[24%] h-full bg-secondary rounded-full"></div>
                                </div>
                            </div>
                            <button className="w-full bg-white text-primary mt-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-lg active:scale-95">
                                Audit Logs
                            </button>
                        </div>

                        <div className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                                Requests Queue
                                <span className="w-6 h-6 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-[10px]">{stats.pendingRequests}</span>
                            </h3>
                            <div className="space-y-4">
                                <QueueItem title="Zakat for Widows" user="Parveen Bibi" amount="45k" />
                                <QueueItem title="Dialysis Support" user="Aslam Khan" amount="120k" />
                                <QueueItem title="Book Drive" user="Edhi School" amount="15k" />
                                <button className="w-full py-3 rounded-xl text-primary font-bold text-sm bg-primary/5 hover:bg-primary/10 transition-colors mt-2">
                                    Review All Requests
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
    const colorMap = {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        amber: 'bg-amber-100 text-amber-600',
        green: 'bg-green-100 text-green-600'
    };

    return (
        <div className="glass-card p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${colorMap[color as keyof typeof colorMap]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
                <p className="text-[10px] font-bold text-gray-500 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {trend}
                </p>
            </div>
        </div>
    );
}

function TransactionRow({ name, caseName, amount, status, date }: any) {
    const statusColors = {
        Completed: 'text-green-600 bg-green-50',
        Pending: 'text-amber-600 bg-amber-50',
        Flagged: 'text-red-600 bg-red-50'
    };

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black">{name[0]}</div>
                    <span className="text-sm font-semibold text-gray-900">{name}</span>
                </div>
            </td>
            <td className="px-4 py-4 text-xs text-gray-600 font-medium">{caseName}</td>
            <td className="px-4 py-4 text-sm font-bold text-gray-900">Rs. {amount}</td>
            <td className="px-4 py-4">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${statusColors[status as keyof typeof statusColors]}`}>{status}</span>
            </td>
            <td className="px-4 py-4 text-[10px] text-gray-400 font-bold">{date}</td>
            <td className="px-4 py-4 text-right">
                <button className="text-gray-400 hover:text-primary transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}

function QueueItem({ title, user, amount }: any) {
    return (
        <div className="p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">By {user}</p>
                </div>
                <p className="text-xs font-black text-gray-900">Rs. {amount}</p>
            </div>
        </div>
    );
}
