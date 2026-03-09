'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const slides = [
    {
        id: 'moon',
        image: '/images/hero.png',
        subtitle: 'Ramzan Charity Platform',
        title: 'Give Hope, Give Zakat',
        description: 'Help the Needy This Ramadan',
        buttons: [
            { label: 'Donate Now', type: 'emerald' },
            { label: 'Seek Help', type: 'beige' }
        ]
    },
    {
        id: 'family',
        image: '/images/heroca.png',
        subtitle: 'Sadaqah Jariyah',
        title: 'Share Your Blessings',
        description: 'Feed a Family This Ramadan',
        buttons: [
            { label: 'Donate Now', type: 'terracotta' }
        ]
    },
    {
        id: 'fitr',
        image: '/images/herocar.png',
        subtitle: 'Zakat-ul-Fitr',
        title: 'Spread Eid Joy',
        description: 'Complete Your Fast with Charity',
        buttons: [
            { label: 'Pay Fitrana', type: 'emerald' }
        ]
    }
];

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, []);

    const currentSlide = slides[currentIndex];

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Transitions */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 6, ease: "linear" }}
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${currentSlide.image}')` }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-4 md:left-8 flex items-center z-50">
                <button
                    onClick={prevSlide}
                    className="p-3 md:p-5 rounded-full bg-white/5 backdrop-blur-xl text-white border border-white/10 hover:bg-primary transition-all active:scale-90 group shadow-2xl"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="absolute inset-y-0 right-4 md:right-8 flex items-center z-50">
                <button
                    onClick={nextSlide}
                    className="p-3 md:p-5 rounded-full bg-white/5 backdrop-blur-xl text-white border border-white/10 hover:bg-primary transition-all active:scale-90 group shadow-2xl"
                >
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Slide Content */}
            <div className="relative z-40 h-full w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full flex flex-col items-center justify-center text-center px-4"
                    >
                        {currentSlide.subtitle && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className={`text-lg md:text-2xl font-serif italic mb-6 tracking-wide ${currentSlide.id === 'moon' ? 'text-[#e2c185]' : 'text-[#f5d76e]'}`}
                            >
                                {currentSlide.subtitle}
                            </motion.span>
                        )}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white mb-8 drop-shadow-2xl max-w-[90vw] leading-tight tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                            {currentSlide.title}
                        </h1>
                        <p className={`text-xl md:text-3xl font-medium mb-14 max-w-3xl leading-relaxed ${currentSlide.id === 'moon' ? 'text-[#e2c185]/90' : 'text-white/90'}`}>
                            {currentSlide.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-8">
                            {currentSlide.buttons.map((btn, i) => (
                                <button
                                    key={i}
                                    className={`px-14 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center group active:scale-95 ${btn.type === 'emerald' ? 'bg-[#064e3b] text-white hover:bg-[#053d2e] shadow-emerald-900/40' :
                                            btn.type === 'beige' ? 'bg-[#fdfbf0] text-[#064e3b] hover:bg-white shadow-white/10' :
                                                'bg-[#c0392b] text-white hover:bg-[#a93226] shadow-red-900/40'
                                        }`}
                                >
                                    {btn.label}
                                    {(btn.label.toLowerCase().includes('donate') || btn.label.toLowerCase().includes('pay')) && <Heart className="w-5 h-5 ml-3 fill-current group-hover:scale-125 transition-transform" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center z-50">
                <div className="flex space-x-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-1 transition-all duration-700 rounded-full ${currentIndex === i ? 'w-16 bg-white' : 'w-6 bg-white/20 hover:bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
