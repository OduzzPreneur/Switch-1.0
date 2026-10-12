'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Compass, Layers, ShieldCheck, HelpCircle, LogIn, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import SwitchLogo from '@/components/common/SwitchLogo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentSession, setStudentSession] = useState<{ fullName?: string; email?: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Track student session across localStorage and Supabase
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('switch_student_session');
      if (stored) {
        try {
          setStudentSession(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setStudentSession(null);
      }
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setStudentSession((prev) => prev || { email: session.user.email, fullName: session.user.user_metadata?.full_name });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setStudentSession((prev) => prev || { email: session.user.email, fullName: session.user.user_metadata?.full_name });
        } else if (!localStorage.getItem('switch_student_session')) {
          setStudentSession(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [pathname]);

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

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('switch_student_session');
    }
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setStudentSession(null);
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const isAuthenticated = Boolean(studentSession || pathname === '/dashboard');
  const isDashboard = pathname === '/dashboard';

  const navItems = [
    { label: 'Overview', href: '/', icon: Compass },
    { label: '12 Tracks', href: '/#tracks', icon: Layers },
    { label: 'Eligibility', href: '/#eligibility', icon: ShieldCheck },
    { label: 'FAQs', href: '/#faqs', icon: HelpCircle },
    ...(isAuthenticated
      ? [{ label: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard }]
      : [{ label: 'Portal Login', href: '/login', icon: LogIn }]),
  ];

  return (
    <nav className="bg-switch-dark text-white border-b border-white/10 sticky top-0 z-50 shadow-md backdrop-blur-md bg-switch-dark/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          
          {/* Brand Logo Only */}
          <Link href="/" className="flex items-center group py-1" aria-label="The Switch 1.0 Home">
            <div className="transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(255,94,20,0.25)]">
              <SwitchLogo className="w-10 h-10 sm:w-11 sm:h-11" />
            </div>
          </Link>

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

          {/* Right Action on Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              isDashboard ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs lg:text-sm font-semibold px-4 py-2 rounded-xl transition-all border border-white/10"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 bg-switch-teal hover:bg-switch-teal-700 text-white text-xs lg:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-teal-900/30 transform hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-switch-orange" />
                  <span>My Dashboard</span>
                </Link>
              )
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-switch-orange to-orange-500 hover:from-switch-orange-600 hover:to-orange-600 text-white text-xs lg:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 transform hover:-translate-y-0.5"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Show Register ONLY if guest and NOT in dashboard */}
            {!isAuthenticated && (
              <Link
                href="/register"
                className="bg-switch-orange text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs"
              >
                Register
              </Link>
            )}

            {isAuthenticated && !isDashboard && (
              <Link
                href="/dashboard"
                className="bg-switch-teal text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs"
              >
                Dashboard
              </Link>
            )}

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
          {/* Dimmed Blurred Backdrop Scrim */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 sm:top-[72px] bg-slate-950/75 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
            aria-hidden="true"
          />

          {/* Floating Solid Menu Panel */}
          <div className="absolute top-full left-0 right-0 md:hidden bg-[#071E26] border-b border-white/15 px-4 pt-3 pb-4 space-y-1 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
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

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-300 hover:text-rose-200 hover:bg-white/10 transition-colors pt-2 border-t border-white/10 mt-2 text-left"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out / Lock</span>
              </button>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
