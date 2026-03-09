'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
    const steps = [
        {
            title: "Verification",
            description: "Our team physically visits residences to verify every single help request before it goes live.",
            icon: ShieldCheck
        },
        {
            title: "100% Transparency",
            description: "Follow your donation's impact with photo proof and receipts delivered to your dashboard.",
            icon: Heart
        },
        {
            title: "Community Driven",
            description: "We connect donors directly with those in need, fostering a spirit of brotherhood and support.",
            icon: Users
        }
    ];

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="pt-40 pb-20 bg-primary text-white text-center relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-white/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <h1 className="text-6xl font-black tracking-tighter mb-8 italic">Changing Lives through <br />Faith & Generosity</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">Ramzan Charity Platform is a digital bridge connecting verified needy families in Pakistan with donors worldwide.</p>
                </div>
            </section>

         
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl transition-all"
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                <step.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">{step.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

        
            <section className="py-32 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-primary font-black uppercase tracking-[0.3em] mb-6">Our Process</p>
                        <h2 className="text-5xl font-black tracking-tighter mb-10 leading-tight">How we ensure your <br /><span className="text-primary italic">Zakat is effective</span></h2>

                        <div className="space-y-8">
                            <ProcessStep number="01" title="Case Submission" text="Applicants submit details including CNIC, bills, and residency proof." />
                            <ProcessStep number="02" title="Physical Verification" text="Our field officers visit the applicant's home to objectively assess the need." />
                            <ProcessStep number="03" title="Funding & Disbursement" text="The case goes live for funding. 100% of collected funds go to the recipient." />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl"
                    >
                        <img src="/images/ramzan.png" alt="Mission" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function ProcessStep({ number, title, text }: { number: string, title: string, text: string }) {
    return (
        <div className="flex gap-8 group">
            <span className="text-4xl font-black text-primary/20 group-hover:text-primary transition-colors italic">{number}</span>
            <div>
                <h4 className="text-xl font-bold mb-2 flex items-center gap-3">
                    {title} <CheckCircle2 className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-gray-500 font-medium leading-relaxed">{text}</p>
            </div>
        </div>
    );
}
