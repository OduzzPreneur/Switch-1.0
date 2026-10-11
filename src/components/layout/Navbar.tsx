'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, Layers, ShieldCheck, HelpCircle, LogIn, ArrowRight } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/', icon: Compass },
  { label: '12 Tracks', href: '/#tracks', icon: Layers },
  { label: 'Eligibility', href: '/#eligibility', icon: ShieldCheck },
  { label: 'FAQs', href: '/#faqs', icon: HelpCircle },
  { label: 'Portal Login', href: '/login', icon: LogIn },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Automatically close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="bg-switch-dark text-white border-b border-white/10 sticky top-0 z-50 shadow-md backdrop-blur-md bg-switch-dark/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          
          {/* Professional Brand & Partner Logo Cluster */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              {/* Switch Brand Logo Container */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-white p-1 border border-white/20 shadow-sm group-hover:scale-105 transition-transform">
                <Image
                  src="/logos/switch-logo.jpg"
                  alt="The Switch"
                  fill
                  sizes="44px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Typography Wordmark */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-lg tracking-tight text-white leading-none">
                    THE SWITCH
                  </span>
                  <span className="bg-switch-orange text-white text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs font-mono">
                    1.0
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block mt-0.5">
                  Youth Empowerment
                </span>
              </div>
            </Link>

            {/* Subtle Vertical Divider */}
            <div className="h-6 w-[1px] bg-white/20 hidden xs:block" />

            {/* Partner Logo (GOFAMINT Youth Fellowship) */}
            <div className="hidden xs:flex items-center gap-2" title="In partnership with GOFAMINT Youth Fellowship (GYF)">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-white/20 shadow-xs">
                <Image
                  src="/logos/gofamint-logo.jpg"
                  alt="GOFAMINT Youth Fellowship"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="text-[11px] text-slate-300 font-semibold hidden lg:inline">
                GOFAMINT GYF
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-switch-teal text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-switch-orange" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action: Register CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-switch-orange to-orange-500 hover:from-switch-orange-600 hover:to-orange-600 text-white text-xs lg:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 transform hover:-translate-y-0.5"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/register"
              className="bg-switch-orange text-white text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Register
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Floating Overlay Menu & Transparent Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Transparent Backdrop Scrim: clicking the side / outside dismisses the menu */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 sm:top-[72px] bg-slate-950/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            aria-hidden="true"
          />

          {/* Floating Glassmorphic Menu: sits on top of hero section without pushing it down */}
          <div className="absolute top-full left-0 right-0 md:hidden bg-switch-dark/95 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 space-y-1.5 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-switch-teal text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 text-switch-orange" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/10">
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block bg-gradient-to-r from-switch-orange to-orange-500 hover:from-switch-orange-600 hover:to-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md"
              >
                Register for Cohort 1.0
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
