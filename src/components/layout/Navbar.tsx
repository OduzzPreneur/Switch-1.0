'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, Layers, ShieldCheck, CreditCard, HelpCircle, User, Bell } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/', icon: Compass },
  { label: '12 Tracks', href: '/#tracks', icon: Layers },
  { label: 'Eligibility', href: '/#eligibility', icon: ShieldCheck },
  { label: '₦5,000 Token', href: '/#token-fee', icon: CreditCard },
  { label: 'Announcements', href: '/#announcements', icon: Bell },
  { label: 'FAQs', href: '/#faqs', icon: HelpCircle },
  { label: 'Student Portal', href: '/dashboard', icon: User },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-switch-dark text-white border-b border-white/10 sticky top-[65px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all ${
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

          {/* Quick Status / Cohort Info on Right */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[11px] text-emerald-400 font-semibold tracking-wide">
              COHORT 1.0 ADMISSIONS OPEN
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center justify-between w-full">
            <span className="text-xs font-semibold text-slate-200">
              SWITCH 1.0 MENU
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-switch-dark/95 border-b border-white/10 px-4 pt-2 pb-4 space-y-1 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-switch-orange hover:bg-switch-orange-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
              Apply Now (₦5,000 Token)
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
              Portal Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
