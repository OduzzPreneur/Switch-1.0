'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

  return (
    <nav className="bg-switch-dark text-white border-b border-white/10 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-switch-teal text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 text-switch-orange" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Register Button on Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-switch-orange hover:bg-switch-orange-600 text-white text-xs lg:text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center justify-between w-full">
            <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              Switch 1.0 Menu
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
        <div className="md:hidden bg-switch-dark border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
              className="w-full text-center block bg-switch-orange hover:bg-switch-orange-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
            >
              Register Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
