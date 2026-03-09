import React from 'react';
import Link from 'next/link';
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Heart,
    ArrowRight
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-primary text-white pt-24 pb-12 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">

                    {/* Brand Section */}
                    <div className="space-y-8">
                        <div>
                            <Link href="/" className="text-3xl font-black tracking-tighter flex items-center group">
                                <span className="text-white">Ramzan</span>
                                <span className="text-secondary italic ml-1">Charity</span>
                            </Link>
                            <p className="mt-6 text-white/60 text-sm leading-relaxed max-w-xs font-medium">
                                Empowering communities through faith-driven giving. Our mission is to bridge the gap between generosity and necessity during the holy month of Ramzan.
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <SocialIcon icon={Facebook} href="#" />
                            <SocialIcon icon={Twitter} href="#" />
                            <SocialIcon icon={Instagram} href="#" />
                            <SocialIcon icon={Youtube} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-secondary mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/" label="Home" />
                            <FooterLink href="/about" label="How it Works" />
                            <FooterLink href="/cases" label="Donation Cases" />
                            <FooterLink href="/login" label="Donor Login" />
                            <FooterLink href="/register" label="Seek Help" />
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-secondary mb-8">Contact Us</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4 group cursor-pointer text-white/70 hover:text-white transition-colors">
                                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">123 Charity Way, Islamic Complex, Karachi, Pakistan</span>
                            </li>
                            <li className="flex items-center space-x-4 group cursor-pointer text-white/70 hover:text-white transition-colors">
                                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">+92 3131717920</span>
                            </li>
                            <li className="flex items-center space-x-4 group cursor-pointer text-white/70 hover:text-white transition-colors">
                                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">salam@ramzancharity.org</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-secondary mb-8">Newsletter</h4>
                        <p className="text-sm text-white/60 mb-6 font-medium">Subscribe to receive updates on active cases and impact stories.</p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium outline-none focus:border-white/40 focus:bg-white/20 text-white placeholder:text-white/30 transition-all"
                            />
                            <button className="absolute right-2 top-2 p-2 bg-secondary hover:bg-secondary/90 rounded-xl transition-all group-hover:scale-105 active:scale-95 shadow-lg shadow-secondary/20">
                                <ArrowRight className="w-5 h-5 text-primary" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-white/40 font-medium">
                        © {new Date().getFullYear()} Ramzan Charity Platform. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6 text-xs text-white/40 font-bold uppercase tracking-widest">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                    <div className="flex items-center text-xs text-white/40 font-medium">
                        Crafted with <Heart className="w-3 h-3 text-red-500 mx-1 fill-red-500" /> for the Ummah
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon: Icon, href }: { icon: any, href: string }) {
    return (
        <Link
            href={href}
            className="w-10 h-10 bg-white/10 hover:bg-secondary flex items-center justify-center rounded-xl transition-all border border-white/10 hover:border-secondary group shadow-sm hover:shadow-secondary/20"
        >
            <Icon className="w-5 h-5 text-white/70 group-hover:text-primary transition-colors" />
        </Link>
    );
}

function FooterLink({ href, label }: { href: string, label: string }) {
    return (
        <li>
            <Link
                href={href}
                className="text-sm text-white/60 font-medium hover:text-secondary transition-colors flex items-center group"
            >
                <div className="w-1.5 h-1.5 bg-secondary/0 group-hover:bg-secondary rounded-full transition-all mr-0 group-hover:mr-3" />
                {label}
            </Link>
        </li>
    );
}
