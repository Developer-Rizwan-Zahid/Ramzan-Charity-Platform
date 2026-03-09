'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    FileText,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Eye,
    Clock,
    AlertCircle,
    TrendingUp,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import api from '@/utils/api';

export default function AdminRequestsPage() {
    const { user, loading } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get('/HelpRequests/admin/all');
                // Ensure riskLevel is appended if not provided by backend initially
                const mappedData = res.data.map((r: any) => ({
                    ...r,
                    riskLevel: r.amountRequested > 200000 ? 'High' : 'Low',
                    category: r.category || 'General',
                    applicant: r.userName
                }));
                setRequests(mappedData);
            } catch (error) {
                console.error('Failed to fetch requests', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await api.put(`/HelpRequests/approve/${id}`);
            setRequests(requests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
            setSelectedRequest(null);
        } catch (error) {
            console.error('Failed to approve request', error);
        }
    };

    const handleReject = async (id: number) => {
        try {
            await api.put(`/HelpRequests/reject/${id}`);
            setRequests(requests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
            setSelectedRequest(null);
        } catch (error) {
            console.error('Failed to reject request', error);
        }
    };

    const filteredRequests = filter === 'All'
        ? requests
        : requests.filter(r => r.status === filter);

    if (loading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user || user.role !== 'Admin') return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Admin" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Help Requests Setup</h1>
                        <p className="text-gray-500 mt-1">Review, approve, and manage charity appeals.</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        {['All', 'Pending', 'Approved', 'Completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${filter === f ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className={`xl:col-span-${selectedRequest ? '2' : '3'} transition-all duration-300`}>
                        <div className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="relative max-w-md w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search requests by title or applicant..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-500 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors text-sm font-bold">
                                    <Filter className="w-4 h-4" /> Advanced Filter
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Request & Applicant</th>
                                            <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                            <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Target Amount</th>
                                            <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Risk Level</th>
                                            <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                            <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
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
                                        ) : filteredRequests.length > 0 ? (
                                            filteredRequests.map((r) => (
                                                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedRequest(r)}>
                                                    <td className="py-4 px-4">
                                                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">{r.title}</p>
                                                        <p className="text-xs text-gray-500">by {r.applicant}</p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{r.category}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm font-black text-gray-900">Rs. {r.amountRequested.toLocaleString()}</p>
                                                        {r.amountCollected > 0 && <p className="text-[10px] text-primary font-bold">Rs. {r.amountCollected.toLocaleString()} raised</p>}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${r.riskLevel === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                                                            }`}>
                                                            {r.riskLevel === 'High' && <AlertTriangle className="w-3 h-3" />}
                                                            {r.riskLevel}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${r.status === 'Approved' ? 'text-blue-600' :
                                                                r.status === 'Completed' ? 'text-green-600' :
                                                                    r.status === 'Pending' ? 'text-amber-600' :
                                                                        'text-red-500'
                                                                }`}>
                                                                {r.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button className="p-2 bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="py-16 text-center">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                                                        <FileText className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                    <h3 className="text-gray-900 font-bold mb-1">No Requests Found</h3>
                                                    <p className="text-gray-500 text-sm">No requests match your current filter.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Side Preview Panel */}
                    <AnimatePresence>
                        {selectedRequest && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="xl:col-span-1"
                            >
                                <div className="glass-card bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-8">
                                    <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
                                        <h3 className="text-lg font-bold text-gray-900">Request Review</h3>
                                        <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full p-1">
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">{selectedRequest.category}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedRequest.title}</h4>
                                            <p className="text-sm font-semibold text-gray-500 flex justify-between">Applicant: <span className="text-gray-900">{selectedRequest.applicant}</span></p>
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Target Amount</p>
                                            <p className="text-3xl font-black text-primary">Rs. {selectedRequest.amountRequested.toLocaleString()}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-gray-900 mb-2">Description / Proof</p>
                                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">{selectedRequest.description}</p>
                                        </div>

                                        {selectedRequest.riskLevel === 'High' && (
                                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-bold text-red-900">High Risk Detected</p>
                                                    <p className="text-[10px] text-red-700 mt-1 font-medium">System flagged this request due to unusually high amount for the category. Manual verification of documents is strongly advised.</p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedRequest.status === 'Pending' ? (
                                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                                                <button onClick={() => handleReject(selectedRequest.id)} className="w-full py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors">
                                                    Reject
                                                </button>
                                                <button onClick={() => handleApprove(selectedRequest.id)} className="w-full py-3 bg-green-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-600 hover:scale-105 active:scale-95 transition-all">
                                                    Approve Request
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="pt-4 border-t border-gray-50 text-center">
                                                <p className="text-xs font-bold text-gray-500">This request has already been <span className={selectedRequest.status === 'Approved' ? 'text-primary' : selectedRequest.status === 'Completed' ? 'text-green-600' : 'text-red-600'}>{selectedRequest.status}</span>.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
