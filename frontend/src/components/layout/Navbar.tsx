'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isHomePage = pathname === '/';

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Admin': return '/dashboard/admin';
      case 'Donor': return '/dashboard/donor';
      case 'Needy': return '/dashboard/needy';
      default: return '/';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Force scrolled state (white bg, dark text) for all pages except the home page
  const displayScrolled = isScrolled || !isHomePage;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${displayScrolled
        ? 'bg-white/80 backdrop-blur-xl border-b border-primary/10 py-4 shadow-xl shadow-primary/5'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black tracking-tighter flex items-center group">
              <span className={`${displayScrolled ? 'text-gray-900' : 'text-white'} transition-colors`}>Ramzan</span>
              <span className="text-primary italic">Charity</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <NavLink href="/" label="Home" active={isHomePage} isScrolled={displayScrolled} />
            <NavLink href="/about" label="How it Works" isScrolled={displayScrolled} />
            <NavLink href="/cases" label="Donation Cases" isScrolled={displayScrolled} />
          </div>

          <div className="flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className={`text-sm font-black uppercase tracking-widest transition-colors ${displayScrolled ? 'text-gray-900 hover:text-primary' : 'text-white hover:text-secondary'
                    }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register-donor"
                  className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95"
                >
                  Join Us
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href={getDashboardLink()}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${displayScrolled
                    ? 'border-primary/20 text-primary hover:bg-primary hover:text-white'
                    : 'border-white/20 text-white hover:bg-white hover:text-black'
                    }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className={`p-2.5 rounded-xl transition-all ${displayScrolled ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-white/40 hover:text-white hover:bg-white/10'
                    }`}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, label, active = false, isScrolled }: { href: string, label: string, active?: boolean, isScrolled: boolean }) {
  return (
    <Link
      href={href}
      className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${isScrolled
        ? (active ? 'text-primary' : 'text-gray-500 hover:text-gray-900')
        : 'text-white/80 hover:text-white'
        }`}
    >
      {label}
      <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </Link>
  );
}
