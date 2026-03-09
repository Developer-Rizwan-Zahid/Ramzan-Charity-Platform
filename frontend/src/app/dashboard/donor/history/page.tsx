'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    History,
    Search,
    Filter,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import api from '@/utils/api';

export default function DonorHistoryPage() {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/donations/my');
                if (response.data) {
                    setDonations(response.data);
                }
            } catch (error) {
                console.error('Error fetching donation history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Donor" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
                        <p className="text-gray-500 mt-1">Review your past contributions and download receipts.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-primary transition-colors shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/20 transition-colors shadow-sm">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                </header>

                <div className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by case or amount..."
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            <button className="px-4 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-bold shadow-sm">All Time</button>
                            <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900 rounded-lg text-xs font-bold transition-colors">This Year</button>
                            <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900 rounded-lg text-xs font-bold transition-colors">This Month</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Case/Cause</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount (Rs)</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Method</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={6} className="py-4 px-4">
                                                <div className="h-10 bg-gray-50 animate-pulse rounded-xl w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : donations.length > 0 ? (
                                    donations.map((donation: any) => (
                                        <tr key={donation.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                            <td className="py-4 px-4 text-xs font-bold text-gray-500">
                                                {new Date(donation.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <History className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">
                                                        {donation.helpRequestTitle || 'General Zakat Fund'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm font-black text-gray-900">
                                                {donation.amount.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4 text-xs font-bold text-gray-500">
                                                {donation.paymentMethod || 'Stripe'}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-wider">Completed</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button className="text-gray-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                                                <History className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <h3 className="text-gray-900 font-bold mb-1">No History Found</h3>
                                            <p className="text-gray-500 text-sm">Your generous donations will appear here.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
