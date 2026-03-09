'use client';

import { motion } from 'framer-motion';
import HelpRequestCard from './Features';

const DUMMY_CASES = [
    {
        id: 1,
        title: "Medical Assistance for Aisha",
        description: "Aisha is a 10-year-old girl who needs surgery for her heart condition. Every or-...",
        amountRequested: 5000,
        amountCollected: 1250,
        status: 1,
        image: "/images/aisha.png"
    },
    {
        id: 2,
        title: "Scholarship for Bilal",
        description: "Bilal is a bright student who cannot afford his university fees. Help him complete his...",
        amountRequested: 3000,
        amountCollected: 2100,
        status: 1,
        image: "/images/bilal.png"
    },
    {
        id: 3,
        title: "Ramzan Food Ration for 50...",
        description: "Provide essential food items to struggling families this Ramzan. Each pack contains...",
        amountRequested: 10000,
        amountCollected: 4500,
        status: 1,
        image: "/images/ramzan.png"
    }
];

export default function ActiveCases() {
    return (
        <section className="py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
            >
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4 tracking-tighter">Support a <span className="text-primary italic">Soul</span> Today</h2>
                    <p className="text-gray-500 font-medium max-w-lg">Every donation counts. Choose a verified case and help a family in need today.</p>
                </div>
                <button className="px-8 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-100 hover:bg-primary hover:text-white transition-all shadow-sm">
                    View All Cases
                </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {DUMMY_CASES.map((request: any, i) => (
                    <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="h-full flex flex-col"
                    >
                        <HelpRequestCard request={request} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
