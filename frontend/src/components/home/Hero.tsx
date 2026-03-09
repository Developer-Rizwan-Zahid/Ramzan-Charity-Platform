'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
            {/* Background Image */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/hero.png')" }}
            ></motion.div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-secondary text-xl lg:text-2xl font-semibold tracking-wide mb-4"
                >
                    Ramzan Charity Platform
                </motion.h2>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
                >
                    Give Hope, Give Zakat
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-lg md:text-2xl text-gray-200 mb-10"
                >
                    Help the Needy This Ramadan
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                    className="flex flex-col sm:flex-row justify-center gap-5"
                >
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition shadow-xl">
                        Donate Now
                    </button>

                    <button className="bg-white text-primary hover:bg-gray-200 px-8 py-4 rounded-full text-lg font-semibold transition shadow-xl border border-white">
                        Seek Help
                    </button>
                </motion.div>
            </div>
        </section>
    );
}