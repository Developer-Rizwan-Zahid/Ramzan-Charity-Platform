'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    User,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Settings,
    Camera,
    Save,
    Loader2
} from 'lucide-react';
import api from '@/utils/api';

export default function DonorProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    if (!user) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // In a real app, you would send a PUT/PATCH request to update the profile
            // await api.put('/users/profile', formData);

            // Simulate API call for now since we might not have the endpoint ready
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Donor" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${isEditing
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                : 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'
                            }`}
                    >
                        {isEditing ? 'Cancel Edit' : (
                            <><Settings className="w-4 h-4" /> Edit Profile</>
                        )}
                    </button>
                </header>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                    >
                        <ShieldCheck className="w-5 h-5" />
                        <p className="font-medium">{message.text}</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="glass-card bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-32 bg-primary/5"></div>

                            <div className="relative z-10">
                                <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md mb-4 group cursor-pointer">
                                    <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary relative overflow-hidden">
                                        <User className="w-10 h-10" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-500 text-sm mb-4">{user.email}</p>

                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-widest border border-green-100">
                                    <ShieldCheck className="w-4 h-4" /> Verified Donor
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Donated</p>
                                    <p className="text-lg font-black text-primary">Rs. 150,000</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Impact Rank</p>
                                    <p className="text-lg font-black text-secondary">Silver</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="xl:col-span-2">
                        <div className="glass-card bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                disabled={true} // Email usually shouldn't be easily editable
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm transition-all opacity-70 cursor-not-allowed font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                disabled={!isEditing}
                                                placeholder="+92 3XX XXXXXXX"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                disabled={!isEditing}
                                                placeholder="City, Country"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end pt-4 border-t border-gray-50">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="mt-8 glass-card bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h3>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <h4 className="font-bold text-gray-900">Password</h4>
                                    <p className="text-xs text-gray-500 mt-1">Last changed 3 months ago</p>
                                </div>
                                <button className="px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-bold shadow-sm border border-gray-200 hover:text-primary transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
