'use client';

import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ImpactStories() {
    const stories = [
        {
            name: "Fatima's Journey",
            role: "EDUCATION GRANTEE",
            story: "Thanks to this platform, I was able to complete my nursing degree despite our family's financial crisis during Ramzan.",
            image: "/images/fatima.png"
        },
        {
            name: "Ahmed's Recovery",
            role: "MEDICAL RECIPIENT",
            story: "The community funded my father's surgery in just 3 days. We are forever grateful for the kindness we found here.",
            image: "/images/ahmad.png"
        }
    ];

    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Impact <span className="text-primary italic">Stories</span></h2>
                    <p className="text-gray-500 font-medium max-w-lg">Transforming lives, one donation at a time. See the real difference your generosity makes.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {stories.map((story, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-start relative group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                        >
                            <div className="flex items-start gap-8 mb-8 w-full">
                                <div className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden flex-shrink-0 shadow-lg">
                                    <Image
                                        src={story.image}
                                        alt={story.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="pt-4">
                                    <Quote className="w-12 h-12 text-primary/10" strokeWidth={3} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-gray-600 text-lg font-medium italic leading-relaxed">
                                    "{story.story}"
                                </p>

                                <div>
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight">{story.name}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">
                                        {story.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
