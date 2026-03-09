'use client';

import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoSection() {
    const [isOpen, setIsOpen] = useState(false);
    const videoId = "I5_XH1ikNsw";

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-video rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl shadow-primary/20"
                    onClick={() => setIsOpen(true)}
                >
                    {/* Placeholder Thumbnail (YouTube HQ Thumbnail) */}
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt="Our Mission Video"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-50"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                        </div>
                    </div>
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-primary bg-white/10 backdrop-blur-md px-4 py-2 rounded-full inline-block">Watch Our Journey</p>
                        <h2 className="text-4xl font-black tracking-tight">How your Zakat <span className="italic">Changes Lives</span></h2>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 md:top-10 md:right-10 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all z-[110]"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-6xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
