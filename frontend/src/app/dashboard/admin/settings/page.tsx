'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import {
    User,
    Settings,
    ShieldCheck,
    Bell,
    Globe,
    Save,
    Loader2,
    KeyRound,
    Mail,
    Smartphone
} from 'lucide-react';

export default function AdminSettingsPage() {
    const { user, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState({ type: '', text: '' });

    const [platformSettings, setPlatformSettings] = useState({
        maintenanceMode: false,
        autoApproveSmallRequests: true,
        maxAutoApproveAmount: 10000,
        emailNotifications: true,
        smsAlerts: false
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user || user.role !== 'Admin') return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="Admin" />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                        <p className="text-gray-500 mt-1">Manage platform configurations, security, and your admin profile.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </header>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                    >
                        <ShieldCheck className="w-5 h-5" />
                        <p className="font-medium">{message.text}</p>
                    </motion.div>
                )}

                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Settings Navigation Sidebar */}
                    <div className="w-full xl:w-64 flex-shrink-0">
                        <div className="glass-card bg-white rounded-3xl p-4 shadow-sm border border-gray-100 sticky top-8 space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <User className="w-5 h-5" /> Admin Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <ShieldCheck className="w-5 h-5" /> Security
                            </button>
                            <button
                                onClick={() => setActiveTab('platform')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'platform' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Globe className="w-5 h-5" /> Platform Config
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Bell className="w-5 h-5" /> Notifications
                            </button>
                        </div>
                    </div>

                    {/* Settings Content Area */}
                    <div className="flex-1 space-y-6">
                        {activeTab === 'profile' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="w-6 h-6 text-primary" /> Administrator Profile
                                </h2>

                                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl relative overflow-hidden group cursor-pointer">
                                        {user.name.charAt(0)}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] text-white uppercase tracking-widest">Edit</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                                        <p className="text-sm font-medium text-gray-500">{user.email}</p>
                                        <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-[10px] font-black uppercase tracking-widest">Super Admin</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                                            <input type="text" defaultValue={user.name} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                                            <input type="email" defaultValue={user.email} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <ShieldCheck className="w-6 h-6 text-primary" /> Security Settings
                                </h2>

                                <div className="space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                                            <div>
                                                <h4 className="font-bold text-gray-900 flex items-center gap-2"><KeyRound className="w-4 h-4 text-gray-400" /> Admin Password</h4>
                                                <p className="text-xs text-gray-500 mt-1">Ensure your account is using a strong, unique password.</p>
                                            </div>
                                            <button className="px-5 py-2.5 bg-white text-gray-800 rounded-xl text-xs font-bold shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
                                                Change Password
                                            </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-gray-900 flex items-center gap-2"><Smartphone className="w-4 h-4 text-gray-400" /> Two-Factor Authentication (2FA)</h4>
                                                <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your admin account.</p>
                                            </div>
                                            <button className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors">
                                                Enable 2FA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'platform' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-primary" /> Platform Configuration
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-900">Maintenance Mode</h4>
                                            <p className="text-xs text-gray-500 mt-1">Temporarily disable public access to the platform.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={platformSettings.maintenanceMode} onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-900">Auto-Approve Small Requests</h4>
                                            <p className="text-xs text-gray-500 mt-1">Automatically approve low-risk help requests under a certain amount.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={platformSettings.autoApproveSmallRequests} onChange={(e) => setPlatformSettings({ ...platformSettings, autoApproveSmallRequests: e.target.checked })} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    {platformSettings.autoApproveSmallRequests && (
                                        <div className="p-5 border border-gray-100 rounded-2xl">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Maximum Auto-Approve Amount (Rs.)</label>
                                            <input
                                                type="number"
                                                value={platformSettings.maxAutoApproveAmount}
                                                onChange={(e) => setPlatformSettings({ ...platformSettings, maxAutoApproveAmount: parseInt(e.target.value) || 0 })}
                                                className="w-full max-w-xs px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold text-gray-900"
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Bell className="w-6 h-6 text-primary" /> Admin Alerts & Notifications
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Email Alerts</h4>
                                                <p className="text-xs text-gray-500 mt-1">Get emails for high-risk fraud alerts and large donations.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={platformSettings.emailNotifications} onChange={(e) => setPlatformSettings({ ...platformSettings, emailNotifications: e.target.checked })} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">SMS Alerts</h4>
                                                <p className="text-xs text-gray-500 mt-1">Receive critical platform downtime alerts via SMS.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={platformSettings.smsAlerts} onChange={(e) => setPlatformSettings({ ...platformSettings, smsAlerts: e.target.checked })} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
