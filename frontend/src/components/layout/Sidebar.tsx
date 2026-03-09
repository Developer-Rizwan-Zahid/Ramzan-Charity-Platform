'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Heart,
    History,
    User,
    Settings,
    LogOut,
    ChevronRight,
    PlusCircle,
    Users,
    AlertCircle,
    BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
    role: 'Donor' | 'Needy' | 'Admin';
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const donorLinks = [
        { name: 'Overview', href: '/dashboard/donor', icon: LayoutDashboard },
        { name: 'Browse Cases', href: '/cases', icon: Heart },
        { name: 'Donation History', href: '/dashboard/donor/history', icon: History },
        { name: 'Profile', href: '/dashboard/donor/profile', icon: User },
    ];

    const needyLinks = [
        { name: 'Overview', href: '/dashboard/needy', icon: LayoutDashboard },
        { name: 'Request Help', href: '/request-help', icon: PlusCircle },
        { name: 'My Requests', href: '/dashboard/needy/requests', icon: History },
        { name: 'Profile', href: '/dashboard/needy/profile', icon: User },
    ];

    const adminLinks = [
        { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Manage Requests', href: '/dashboard/admin/requests', icon: AlertCircle },
        { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
    ];

    const links = role === 'Admin' ? adminLinks : role === 'Donor' ? donorLinks : needyLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 z-40 hidden lg:block">
            <div className="flex flex-col h-full p-6">
                <div className="mb-10">
                    <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                        <span className="text-secondary">🌙</span> Ramzan
                    </Link>
                </div>

                <nav className="flex-1 space-y-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                                    <span className="text-sm">{link.name}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="w-1.5 h-1.5 rounded-full bg-primary"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
