'use client'

import Image from "next/image";

export interface HelpRequest {
    id: number;
    title: string;
    description: string;
    amountRequested: number;
    amountCollected: number;
    status: number;
    category?: string;
    image?: string;
}

export default function HelpRequestCard({ request, onDonate }: { request: HelpRequest, onDonate?: (req: any) => void }) {
    const progress = (request.amountCollected / request.amountRequested) * 100;

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full border border-gray-100 group">
            {/* Header Section */}
            <div className="relative h-48 w-full overflow-hidden shrink-0 bg-primary/5 flex items-center justify-center">
                {request.image ? (
                    <Image
                        src={request.image}
                        alt={request.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="text-primary opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                        <Heart className="w-24 h-24" />
                    </div>
                )}
                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-primary shadow-sm uppercase tracking-widest border border-primary/10">
                    {request.category || "General"}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                    {request.title}
                </h3>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                    {request.description}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-50">
                    <div className="flex justify-between items-end mb-2.5">
                        <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                            Collected
                        </span>
                        <span className="text-sm font-black text-primary">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-primary rounded-full"
                        />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">
                                Goal
                            </div>
                            <div className="text-lg font-black text-gray-900">
                                Rs. {request.amountRequested.toLocaleString()}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">
                                Raised
                            </div>
                            <div className="text-lg font-black text-secondary">
                                Rs. {request.amountCollected.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onDonate?.(request)}
                        className="w-full bg-primary text-white hover:bg-primary/95 py-4 rounded-2xl font-black transition-all text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-primary/10 active:scale-95"
                    >
                        Donate Now
                    </button>
                </div>
            </div>
        </div>
    );
}

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
