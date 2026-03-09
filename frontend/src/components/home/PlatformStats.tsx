'use client';

import React from 'react';
import { Users, BookHeart, Handshake, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlatformStats() {
    const stats = [
        { label: "Total Donors", value: "10,000+", icon: Users },
        { label: "Cases Funded", value: "2,500+", icon: BookHeart },
        { label: "Total Raised", value: "$1.2M", icon: Heart },
        { label: "Active Partners", value: "50+", icon: Handshake },
    ];

    return (
        <section className="py-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center group hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{stat.value}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
