'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    Users,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Eye,
    ShieldCheck,
    AlertTriangle,
    FileText,
    Loader2,
    Clock
} from 'lucide-react';
import api from '@/utils/api';

export default function AdminUsersPage() {
    const { user, loading } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/Users');
                setUsers(res.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await api.put(`/Users/verify/${id}`);
            setUsers(users.map(u => u.id === id ? { ...u, isCnicVerified: true, status: 'Active' } : u));
        } catch (error) {
            console.error('Failed to approve user', error);
        }
    };

    const handleReject = async (id: number) => {
        try {
            await api.put(`/Users/block/${id}`);
            setUsers(users.map(u => u.id === id ? { ...u, status: 'Rejected' } : u));
        } catch (error) {
            console.error('Failed to reject user', error);
        }
    };

    const filteredUsers = filter === 'All'
        ? users
        : filter === 'Pending'
            ? users.filter(u => u.status === 'Pending')
            : filter === 'Donors'
                ? users.filter(u => u.role === 'Donor')
                : users.filter(u => u.role === 'Needy');

    if (loading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user || user.role !== 'Admin') return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Admin" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500 mt-1">Approve registrations and verify user identities.</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        {['All', 'Pending', 'Donors', 'Needy'].map(f => (
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

                <div className="glass-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or CNIC..."
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User Details</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">CNIC / Documents</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="pb-4 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    Array(4).fill(0).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={5} className="py-4 px-4">
                                                <div className="h-14 bg-gray-50 animate-pulse rounded-xl w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900">{u.name}</p>
                                                        <p className="text-xs text-gray-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                    u.role === 'Donor' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                {u.cnic ? (
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-xs font-bold text-gray-700 line-clamp-1">{u.cnic}</p>
                                                        <button className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline">
                                                            <FileText className="w-3 h-3" /> View Document
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-medium">N/A</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${u.isCnicVerified ? 'text-green-600' :
                                                        u.status === 'Pending' ? 'text-amber-600' :
                                                            u.status === 'Flagged' || u.status === 'Rejected' ? 'text-red-600' :
                                                                'text-gray-500'
                                                        }`}>
                                                        {u.isCnicVerified && <ShieldCheck className="w-4 h-4" />}
                                                        {!u.isCnicVerified && <Clock className="w-4 h-4" />}
                                                        {u.isCnicVerified ? 'Active' : 'Pending'}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!u.isCnicVerified && (
                                                        <>
                                                            <button onClick={() => handleApprove(u.id)} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors" title="Approve & Verify">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleReject(u.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors" title="Block User">
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button className="p-2 bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                                                <Users className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <h3 className="text-gray-900 font-bold mb-1">No Users Found</h3>
                                            <p className="text-gray-500 text-sm">No users match your current filter.</p>
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
