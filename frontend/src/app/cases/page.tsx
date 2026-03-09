'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HelpRequestCard from '@/components/home/Features';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Wallet, Heart, ShieldCheck, Loader2 } from 'lucide-react';
import DonationModal from '@/components/home/DonationModal';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function CasesPage() {
    const [cases, setCases] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedCase, setSelectedCase] = React.useState<any>(null);
    const [isDonationModalOpen, setIsDonationModalOpen] = React.useState(false);

    React.useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await api.get('/HelpRequests');
                setCases(response.data);
            } catch (error) {
                console.error('Error fetching cases:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCases();
    }, []);

    const handleDonate = (request: any) => {
        setSelectedCase(request);
        setIsDonationModalOpen(true);
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <header className="mb-16">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-6">Active <span className="text-primary italic">Donation Cases</span></h1>
                    <p className="text-gray-500 font-medium max-w-2xl text-lg">Browse through verified help requests and choose where your generosity can make the most impact this Ramadan.</p>
                </header>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : cases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {cases.map((request, i) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <HelpRequestCard request={request as any} onDonate={handleDonate} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No active cases found at the moment.</p>
                    </div>
                )}
            </div>

            {selectedCase && (
                <DonationModal
                    isOpen={isDonationModalOpen}
                    onClose={() => setIsDonationModalOpen(false)}
                    request={selectedCase}
                />
            )}

            <Footer />
        </main>
    );
}
