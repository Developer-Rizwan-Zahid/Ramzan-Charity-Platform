'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "How do you verify help requests?",
            a: "Our field team physically visits each applicant's residence across Pakistan. We verify their CNIC, electricity bills, and current living conditions to ensure genuine need."
        },
        {
            q: "Can I choose which specific case to fund?",
            a: "Yes! Unlike general funds, our platform allows you to pick individual cases. 100% of your donation (minus payment processing fees) goes directly to the case you fund."
        },
        {
            q: "What payment methods are supported?",
            a: "We currently support Bank Transfers, JazzCash, Easypaisa, and major International Credit/Debit cards via Stripe."
        },
        {
            q: "How can I see my donation's impact?",
            a: "Once a case is fully funded, we share real-time proof of delivery (photos/receipts) in your donor dashboard under the 'History' section."
        }
    ];

    return (
        <section className="py-24">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <HelpCircle className="w-4 h-4" />
                        <span>Support Center</span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Frequently Asked <span className="text-primary italic">Questions</span></h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:border-primary/20 transition-all"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                                className="w-full p-8 flex items-center justify-between text-left group"
                            >
                                <span className={`text-xl font-bold transition-colors ${activeIndex === i ? 'text-primary' : 'text-gray-800'}`}>
                                    {faq.q}
                                </span>
                                <div className={`p-2 rounded-xl transition-all ${activeIndex === i ? 'bg-primary text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                    {activeIndex === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-8 pb-8 text-gray-500 font-medium leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
