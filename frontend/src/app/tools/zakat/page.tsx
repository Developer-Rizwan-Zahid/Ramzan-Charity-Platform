'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Calculator, Info, Wallet, Gem, Landmark, Briefcase, RefreshCcw } from 'lucide-react';

export default function ZakatCalculatorPage() {
    const [assets, setAssets] = useState({
        cash: 0,
        gold: 0,
        silver: 0,
        investments: 0,
        business: 0,
    });

    const [liabilities, setLiabilities] = useState(0);

    const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
    const netAssets = Math.max(0, totalAssets - liabilities);
    const zakatAmount = netAssets * 0.025;

    // Static Nisab thresholds (approximate)
    const nisabGold = 800000; // Example in PKR

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <header className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Calculator className="w-4 h-4" />
                        <span>Financial Tools</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-6">Zakat <span className="text-primary italic">Calculator</span></h1>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">Calculate your Zakat accurately based on your assets and liabilities. Our calculator follows standard 2.5% guidelines.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Input Section */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                                <Wallet className="text-primary w-6 h-6" /> Your Assets
                            </h2>
                            <div className="space-y-6">
                                <CalculatorInput
                                    label="Cash & Bank Balance"
                                    icon={Landmark}
                                    value={assets.cash}
                                    onChange={(v) => setAssets({ ...assets, cash: v })}
                                />
                                <CalculatorInput
                                    label="Gold & Silver Value"
                                    icon={Gem}
                                    value={assets.gold}
                                    onChange={(v) => setAssets({ ...assets, gold: v })}
                                />
                                <CalculatorInput
                                    label="Investments (Shares, Bonds)"
                                    icon={Briefcase}
                                    value={assets.investments}
                                    onChange={(v) => setAssets({ ...assets, investments: v })}
                                />
                                <CalculatorInput
                                    label="Business Assets"
                                    icon={RefreshCcw}
                                    value={assets.business}
                                    onChange={(v) => setAssets({ ...assets, business: v })}
                                />
                            </div>
                        </section>

                        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                                <Info className="text-red-500 w-6 h-6" /> Liabilities
                            </h2>
                            <CalculatorInput
                                label="Debts & Expenses"
                                icon={Info}
                                value={liabilities}
                                onChange={(v) => setLiabilities(v)}
                            />
                        </section>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-primary text-white p-12 rounded-[4rem] shadow-2xl shadow-primary/30 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-full h-full bg-white/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-8">Summary Result</p>

                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center text-white/80">
                                        <span className="font-bold">Total Assets</span>
                                        <span className="font-black text-xl">Rs. {totalAssets.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/80">
                                        <span className="font-bold">Total Liabilities</span>
                                        <span className="font-black text-lg">- Rs. {liabilities.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-6 border-t border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2">Total Zakat Payable</p>
                                        <h3 className="text-6xl font-black tracking-tighter">Rs. {zakatAmount.toLocaleString()}</h3>
                                    </div>
                                </div>

                                <div className={`mt-10 p-6 rounded-3xl text-sm font-medium flex items-center gap-4 ${netAssets > nisabGold ? 'bg-white/10 text-white' : 'bg-red-500/20 text-white'}`}>
                                    <Info className="w-6 h-6 shrink-0" />
                                    <p>
                                        {netAssets > nisabGold
                                            ? "Your assets are above Nisab. Giving Zakat is a beautiful obligation."
                                            : "Your assets are below the typical Nisab threshold. Giving is always rewarded."}
                                    </p>
                                </div>
                            </div>

                            <button className="w-full py-6 bg-gray-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
                                Reset Calculator <RefreshCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

function CalculatorInput({ label, icon: Icon, value, onChange }: { label: string, icon: any, value: number, onChange: (v: number) => void }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{label}</label>
            <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                </div>
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 pl-16 pr-6 text-xl font-black text-gray-900 outline-none focus:bg-white focus:border-primary/20 transition-all"
                />
            </div>
        </div>
    );
}
