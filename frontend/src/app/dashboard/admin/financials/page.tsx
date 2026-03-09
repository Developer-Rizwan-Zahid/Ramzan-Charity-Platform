'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    ArrowRightLeft,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Download,
    Wallet,
    Building2,
    TrendingDown,
    Loader2
} from 'lucide-react';
import api from '@/utils/api';

export default function AdminFinancialsPage() {
    const { user, loading } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState<any>(null);

    useEffect(() => {
        // In a real app, you would fetch from the actual API
        // const fetchTxns = async () => { ... }

        // Mock transaction & payout data
        setTimeout(() => {
            setTransactions([
                { id: 'TXN-001', type: 'Donation', user: 'Rizwan Zahid', case: 'General Fund', amount: 50000, method: 'Stripe', status: 'Completed', date: '2024-03-06 14:30', riskScore: 12 },
                { id: 'TXN-002', type: 'Payout', user: 'Parveen Bibi', case: 'Medical Emergency', amount: 150000, method: 'Bank Transfer', status: 'Pending Approval', date: '2024-03-05 09:15', riskScore: 5 },
                { id: 'TXN-003', type: 'Donation', user: 'Unknown', case: 'Orphan Care', amount: 1000000, method: 'JazzCash', status: 'Flagged', date: '2024-03-06 11:20', riskScore: 89, fraudReason: 'Unusually large anonymous donation from high-risk IP.' },
                { id: 'TXN-004', type: 'Donation', user: 'Ali Khan', case: 'Food Drive', amount: 5000, method: 'EasyPaisa', status: 'Completed', date: '2024-03-04 18:45', riskScore: 2 },
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleApprovePayout = (id: string) => {
        setTransactions(transactions.map(t => t.id === id ? { ...t, status: 'Processing' } : t));
        setShowPayoutModal(false);
    };

    const handleReviewFraud = (id: string, action: 'Clear' | 'Block') => {
        setTransactions(transactions.map(t => t.id === id ? { ...t, status: action === 'Clear' ? 'Completed' : 'Blocked', riskScore: action === 'Clear' ? 10 : 99 } : t));
        setShowPayoutModal(false);
    };

    const filteredTxns = filter === 'All'
        ? transactions
        : filter === 'Flagged'
            ? transactions.filter(t => t.status === 'Flagged')
            : transactions.filter(t => t.type === filter);

    if (loading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user || user.role !== 'Admin') return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Admin" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Financials & Logs</h1>
                        <p className="text-gray-500 mt-1">Manage donations, approve payouts, and monitor fraud.</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        {['All', 'Donation', 'Payout', 'Flagged'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 flex items-center gap-1 rounded-lg text-xs font-bold transition-colors ${filter === f ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {f === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
                                {f}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Financial Metrics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Holding</p>
                            <h3 className="text-2xl font-black text-gray-900">Rs. 8,450,000</h3>
                        </div>
                    </div>
                    <div className="glass-card bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Payouts</p>
                            <h3 className="text-2xl font-black text-gray-900">Rs. 420,000</h3>
                        </div>
                    </div>
                    <div className="glass-card bg-red-50 border border-red-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-red-900 uppercase tracking-widest">Fraud Alerts</p>
                            <h3 className="text-2xl font-black text-red-700">3 Flagged</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search TXN ID, User, or Method..."
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-500 rounded-xl border border-gray-100 hover:text-primary transition-colors text-sm font-bold shadow-sm">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">TXN Details</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Type / Method</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Risk Score</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    Array(4).fill(0).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={6} className="py-4 px-4">
                                                <div className="h-14 bg-gray-50 animate-pulse rounded-xl w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredTxns.length > 0 ? (
                                    filteredTxns.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-gray-900">{t.id}</span>
                                                    <span className="text-[10px] text-gray-500">{t.date} | {t.user}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 flex flex-col gap-1">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest w-max ${t.type === 'Donation' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                                    }`}>
                                                    {t.type}
                                                </span>
                                                <span className="text-xs text-gray-600 font-medium">{t.method}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-sm font-black text-gray-900">Rs. {t.amount.toLocaleString()}</p>
                                                <p className="text-[10px] font-bold text-gray-400 line-clamp-1 max-w-[120px]">{t.case}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${t.riskScore > 75 ? 'bg-red-500' : t.riskScore > 40 ? 'bg-amber-500' : 'bg-green-500'}`}
                                                            style={{ width: `${t.riskScore}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-[10px] font-black ${t.riskScore > 75 ? 'text-red-600' : 'text-gray-500'}`}>{t.riskScore}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${t.status === 'Completed' ? 'text-green-600' :
                                                    t.status === 'Processing' ? 'text-blue-600' :
                                                        t.status === 'Flagged' ? 'text-red-600' :
                                                            t.status === 'Blocked' ? 'text-gray-400 line-through' :
                                                                'text-amber-600'
                                                    }`}>
                                                    {t.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                                                    {(t.status === 'Pending Approval' || t.status === 'Processing') && <Clock className="w-3 h-3" />}
                                                    {t.status === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                {(t.status === 'Pending Approval' || t.status === 'Flagged') ? (
                                                    <button
                                                        onClick={() => { setSelectedTxn(t); setShowPayoutModal(true); }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${t.status === 'Flagged' ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-primary/10 text-primary hover:bg-primary/20'
                                                            }`}
                                                    >
                                                        Review
                                                    </button>
                                                ) : (
                                                    <button className="text-xs font-bold text-gray-400 hover:text-primary transition-colors pr-2">
                                                        Details
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                                                <ArrowRightLeft className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <h3 className="text-gray-900 font-bold mb-1">No Transactions Found</h3>
                                            <p className="text-gray-500 text-sm">No logs match your current filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Modal (Payouts & Fraud Review) */}
                <AnimatePresence>
                    {showPayoutModal && selectedTxn && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                                onClick={() => setShowPayoutModal(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] p-8 z-50 shadow-2xl"
                            >
                                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${selectedTxn.status === 'Flagged' ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'
                                        }`}>
                                        {selectedTxn.status === 'Flagged' ? <AlertTriangle className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {selectedTxn.status === 'Flagged' ? 'Fraud Review' : 'Payout Approval'}
                                        </h2>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedTxn.id}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm font-bold text-gray-500">Amount</p>
                                        <p className="text-2xl font-black text-gray-900">Rs. {selectedTxn.amount.toLocaleString()}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">User / Target</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedTxn.user}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Related Case</p>
                                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{selectedTxn.case}</p>
                                        </div>
                                    </div>

                                    {selectedTxn.status === 'Flagged' && (
                                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-800 leading-relaxed">
                                            <p className="font-bold mb-1 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Detection Reason:</p>
                                            {selectedTxn.fraudReason}
                                        </div>
                                    )}
                                </div>

                                {selectedTxn.status === 'Flagged' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setShowPayoutModal(false)} className="py-3.5 bg-gray-50 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors">
                                            Cancel
                                        </button>
                                        <div className="grid grid-cols-2 gap-2 relative">
                                            <button onClick={() => handleReviewFraud(selectedTxn.id, 'Block')} className="py-3.5 bg-red-50 text-red-600 border border-red-100 shadow-sm font-bold text-sm rounded-xl hover:bg-red-100 transition-colors">
                                                Block
                                            </button>
                                            <button onClick={() => handleReviewFraud(selectedTxn.id, 'Clear')} className="py-3.5 bg-white border border-gray-200 shadow-sm text-green-600 font-bold text-sm rounded-xl hover:bg-green-50 transition-colors">
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setShowPayoutModal(false)} className="py-3.5 bg-gray-50 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors">
                                            Cancel
                                        </button>
                                        <button onClick={() => handleApprovePayout(selectedTxn.id)} className="py-3.5 bg-primary text-white shadow-lg shadow-primary/20 font-bold text-sm rounded-xl hover:scale-105 active:scale-95 transition-all">
                                            Confirm Payout
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
