'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ZakatCalculatorPreview() {
    return (
        <section className="py-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gray-900 text-white p-12 md:p-20 rounded-[4rem] relative overflow-hidden group border border-white/5"
            >
              
                <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl text-center md:text-left">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:rotate-12 transition-transform">
                            <Calculator className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">Calculate Your <br /> <span className="text-primary italic">Zakat Al-Mal</span></h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10">
                            Unsure of how much to give? Use our simplified calculator to determine your 2.5% contribution based on your savings and assets.
                        </p>
                        <Link
                            href="/tools/zakat"
                            className="inline-flex items-center px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            Open Calculator <ArrowRight className="w-4 h-4 ml-3" />
                        </Link>
                    </div>

                    <div className="hidden lg:grid grid-cols-2 gap-4 w-1/3">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] aspect-square flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-black mb-1">2.5%</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Savings Rate</span>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] aspect-square flex flex-col items-center justify-center text-center translate-y-8">
                            <span className="text-2xl font-black mb-1">Veri</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Verified Flow</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
