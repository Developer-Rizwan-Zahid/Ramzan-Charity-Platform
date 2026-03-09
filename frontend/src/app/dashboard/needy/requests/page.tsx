'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    History,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    PlusCircle
} from 'lucide-react';
import api from '@/utils/api';
import Link from 'next/link';

export default function NeedyRequestsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/HelpRequests/my');
                if (response.data) {
                    setRequests(response.data);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Needy" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
                        <p className="text-gray-500 mt-1">Track the status of all your submitted help requests.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-primary transition-colors shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                        <Link
                            href="/request-help"
                            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-transform"
                        >
                            <PlusCircle className="w-4 h-4" /> New Request
                        </Link>
                    </div>
                </header>

                <div className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title or category..."
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            <button className="px-4 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-bold shadow-sm">All</button>
                            <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900 rounded-lg text-xs font-bold transition-colors">Pending</button>
                            <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900 rounded-lg text-xs font-bold transition-colors">Approved</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Request Title</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Goal (Rs)</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Collected</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={6} className="py-4 px-4">
                                                <div className="h-12 bg-gray-50 animate-pulse rounded-xl w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : requests.length > 0 ? (
                                    requests.map((request: any) => (
                                        <RequestTableRow key={request.id} request={request} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                                                <History className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <h3 className="text-gray-900 font-bold mb-1">No Requests Found</h3>
                                            <p className="text-gray-500 text-sm">You haven't submitted any help requests yet.</p>
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

function RequestTableRow({ request }: any) {
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

    const progress = (request.amountCollected / request.amountRequested) * 100;

    return (
        <tr className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
            <td className="py-4 px-4 text-xs font-bold text-gray-500 whitespace-nowrap">
                {new Date(request.createdAt).toLocaleDateString()}
            </td>
            <td className="py-4 px-4">
                <div className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {request.title}
                </div>
            </td>
            <td className="py-4 px-4 text-xs font-bold text-gray-500">
                {request.category || 'General'}
            </td>
            <td className="py-4 px-4 text-sm font-black text-gray-900">
                {request.amountRequested.toLocaleString()}
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">
                        {Math.round(progress)}%
                    </span>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusStyles[status as keyof typeof statusStyles]}`}>
                    <Icon className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-wider">{status}</span>
                </div>
            </td>
        </tr>
    );
}
