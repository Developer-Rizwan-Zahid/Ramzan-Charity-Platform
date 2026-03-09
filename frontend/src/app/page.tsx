'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroCarousel from '@/components/home/HeroCarousel';
import PlatformStats from '@/components/home/PlatformStats';
import ActiveCases from '@/components/home/ActiveCases';
import VideoSection from '@/components/home/VideoSection';
import ImpactStories from '@/components/home/ImpactStories';
import ZakatCalculator from '@/components/home/ZakatCalculator';
import FAQ from '@/components/home/FAQ';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        {/* Stats Section */}
        <PlatformStats />

        {/* Video Section */}
        <VideoSection />

        {/* Active Cases Section */}
        <ActiveCases />

        {/* Impact Stories Section */}
        <ImpactStories />

        {/* Zakat Calculator Section */}
        <ZakatCalculator />

        {/* FAQ Section */}
        <FAQ />
      </div>

      <Footer />
    </main>
  );
}
