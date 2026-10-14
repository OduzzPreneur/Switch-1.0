'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Menu,
  X,
  Compass,
  Layers,
  ShieldCheck,
  HelpCircle,
  LogIn,
  ArrowRight,
  LayoutDashboard,
  LogOut,
  User,
  BookOpen,
  GraduationCap,
  Video,
  FileCheck2,
  CalendarDays,
  Bell,
  Download,
  Lock,
  ChevronRight,
  Shield,
  Briefcase,
} from 'lucide-react';
import SwitchLogo from '@/components/common/SwitchLogo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getOrInitDefaultStudent } from '@/lib/portalState';

function StudentDesktopNav({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const items = [
    { label: 'Overview', href: '/dashboard', tab: 'overview' },
    { label: 'Curriculum', href: '/dashboard?tab=curriculum', tab: 'curriculum' },
    { label: 'Blueprint Courses', href: '/dashboard?tab=blueprint-courses', tab: 'blueprint-courses' },
    { label: 'Session Recordings', href: '/dashboard?tab=session-recordings', tab: 'session-recordings' },
    { label: 'Assessments', href: '/dashboard?tab=assessments', tab: 'assessments' },
    { label: 'Timetable & Venue', href: '/dashboard?tab=timetable', tab: 'timetable' },
  ];

  return (
    <div className="hidden lg:flex items-center space-x-1">
      {items.map((item) => {
        const isOverview = item.tab === 'overview';
        const isActive =
          pathname === '/dashboard' &&
          (isOverview ? !searchParams.get('tab') || currentTab === 'overview' : currentTab === item.tab);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isActive
                ? 'bg-switch-teal text-white shadow-sm ring-1 ring-teal-400/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentSession, setStudentSession] = useState<any | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');
  const isInstructorRoute = pathname.startsWith('/instructor');

  // Track session across localStorage and Supabase
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('switch_student_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // If stored is the auto-seeded mock student and we are on a public route, purge it so it doesn't pollute the general landing page
          if (parsed?.paymentReference === 'PSTK-REF-74651-SWITCH' && !isDashboardRoute) {
            localStorage.removeItem('switch_student_session');
            setStudentSession(null);
          } else {
            setStudentSession(parsed);
          }
        } catch (e) {
          setStudentSession(null);
        }
      } else if (isDashboardRoute) {
        // Fallback demo student ONLY when actively inside the dashboard route for testing
        const student = getOrInitDefaultStudent();
        setStudentSession(student);
      } else {
        setStudentSession(null);
      }
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setStudentSession((prev: any) => ({
            ...prev,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || prev?.fullName,
          }));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setStudentSession((prev: any) => ({
            ...prev,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || prev?.fullName,
          }));
        } else if (!isDashboardRoute) {
          setStudentSession(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [pathname, isDashboardRoute]);

  // Automatically close mobile menu and notifications on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setNotificationsOpen(false);
      }
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

  const studentName = studentSession?.fullName || 'Student Fellow';
  const studentInitial = studentName.charAt(0).toUpperCase();
  const regNo = studentSession?.registrationNumber || 'SW1-2026-74651';

  // 1. STUDENT DASHBOARD NAVIGATION ITEMS (Exactly requested by user)
  const studentNavItems = [
    { label: 'Dashboard Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', href: '/dashboard/profile', icon: User },
    { label: 'Track Curriculum', href: '/dashboard?tab=curriculum', icon: BookOpen },
    { label: 'Blueprint Courses', href: '/dashboard?tab=blueprint-courses', icon: GraduationCap },
    { label: 'Session Recordings', href: '/dashboard?tab=session-recordings', icon: Video },
    { label: 'Assessments', href: '/dashboard?tab=assessments', icon: FileCheck2 },
    { label: 'Timetable & Venue', href: '/dashboard?tab=timetable', icon: CalendarDays },
  ];

  // 2. PUBLIC MARKETING NAVIGATION ITEMS
  const publicNavItems = [
    { label: 'Overview', href: '/', icon: Compass },
    { label: '12 Tracks', href: '/#tracks', icon: Layers },
    { label: 'Eligibility', href: '/#eligibility', icon: ShieldCheck },
    { label: 'FAQs', href: '/#faqs', icon: HelpCircle },
    { label: 'Portal Login', href: '/login', icon: LogIn },
  ];

  return (
    <>
      <nav className="bg-[#071E26] text-white border-b border-white/10 sticky top-0 z-50 shadow-md backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            
            {/* Left: Logo & Portal Label */}
            <div className="flex items-center gap-3">
              {/* If on student dashboard, show hamburger ONLY on mobile & tablet */}
              {isDashboardRoute && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 lg:hidden focus:outline-none transition-colors"
                  aria-label="Open Student Portal Navigation Drawer"
                >
                  <Menu className="w-6 h-6 text-switch-teal" />
                </button>
              )}

              <Link href={isDashboardRoute ? "/dashboard" : "/"} className="flex items-center gap-2.5 group py-1" aria-label="Switch 1.0 Home">
                <div className="transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(255,94,20,0.25)]">
                  <SwitchLogo className="w-9 h-9 sm:w-10 sm:h-10" />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            {!isDashboardRoute ? (
              // Public Navigation (for Landing / Marketing Pages)
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                {publicNavItems.map((item) => {
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
            ) : (
              // In Student Dashboard Desktop: Unified Clean Navigation (All 6 Modules)
              <Suspense fallback={<div className="hidden lg:flex items-center space-x-1" />}>
                <StudentDesktopNav pathname={pathname} />
              </Suspense>
            )}

            {/* Right Action Icons (Messages / Bell / Profile Avatar) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isDashboardRoute ? (
                // Authenticated Student Top Controls
                <>
                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 relative transition-colors"
                      aria-label="View notifications"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-switch-orange animate-pulse" />
                    </button>

                    {/* Notification Dropdown */}
                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Cohort 1.0 Announcements
                          </h4>
                          <span className="text-[10px] bg-teal-50 text-switch-teal font-bold px-2 py-0.5 rounded-full border border-teal-200">
                            2 New
                          </span>
                        </div>
                        <div className="py-2 space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-100 transition-colors">
                            <span className="text-[10px] font-bold text-switch-teal block">Center Allocation</span>
                            <p className="text-slate-700 font-medium mt-0.5">Physical centers and virtual live stream links now populated in Timetable & Venues.</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-100 transition-colors">
                            <span className="text-[10px] font-bold text-switch-orange block">Assessment 1 Released</span>
                            <p className="text-slate-700 font-medium mt-0.5">Course instructor published Practical Lab 1 load audit specifications.</p>
                          </div>
                        </div>
                        <Link
                          href="/dashboard?tab=timetable"
                          onClick={() => setNotificationsOpen(false)}
                          className="block text-center text-[11px] font-bold text-switch-teal hover:underline pt-2 border-t border-slate-100"
                        >
                          View all session updates
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Profile Avatar pill (Links directly to dedicated profile page) */}
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all group"
                    title="Open Dedicated Profile"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-switch-teal to-emerald-400 text-white flex items-center justify-center font-black text-sm shadow-sm ring-1 ring-white/30">
                      {studentInitial}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate max-w-[120px]">
                        {studentName.split(' ')[0]}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        {regNo}
                      </div>
                    </div>
                  </Link>

                  {/* Lock / Sign Out Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors hidden sm:flex items-center justify-center"
                    title="Lock / Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                // Public Header Actions (Landing & Marketing pages)
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-switch-orange to-orange-500 hover:from-switch-orange-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 transform hover:-translate-y-0.5"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Public Mobile Menu Toggle */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 md:hidden focus:outline-none"
                    aria-label="Toggle Navigation Menu"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 1. STUDENT DASHBOARD LEFT DRAWER (3MTT INSPIRED - IMAGE 3 REFERENCE)      */}
      {/* ========================================================================= */}
      {isDashboardRoute && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Dimmed Blurred Backdrop Scrim */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            aria-hidden="true"
          />

          {/* Left Slide-out Solid Drawer */}
          <div className="relative w-full max-w-[320px] bg-[#071E26] text-white flex flex-col h-full shadow-2xl border-r border-white/10 z-50 animate-in slide-in-from-left duration-250">
            
            {/* Top Drawer Header with Student Identity Card */}
            <div className="p-5 border-b border-white/10 bg-slate-900/60">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SwitchLogo className="w-8 h-8" />
                  <span className="font-extrabold text-sm tracking-tight text-white">Switch 1.0 Portal</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student Card Summary */}
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-switch-teal text-white flex items-center justify-center font-black text-xl shadow-inner">
                  {studentInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{studentName}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{regNo}</div>
                  <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 mt-1">
                    <ShieldCheck className="w-2.5 h-2.5 mr-1 text-emerald-400" />
                    Verified Fellow
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Drawer Menu Items (6 Modules + Profile) */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pb-2">
                Student Navigation
              </div>

              {studentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard');
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-switch-teal text-white shadow-md shadow-teal-900/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-switch-orange' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  </Link>
                );
              })}
            </div>

            {/* Bottom Status Card (3MTT Reference Image 3) */}
            <div className="p-4 border-t border-white/10 bg-slate-900/60 space-y-3">
              <div className="p-3 bg-gradient-to-br from-emerald-950/60 to-slate-900 rounded-xl border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white">Your Switch 1.0 Status</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Enrolled participant in Cohort 1.0. All course modules and timetable schedules are active.
                </p>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-1.5 bg-switch-teal/40 hover:bg-switch-teal text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Save Registration Slip</span>
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-900/40 border border-rose-500/20 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out / Lock Portal</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PUBLIC MARKETING MOBILE MENU (Landing pages only)                      */}
      {/* ========================================================================= */}
      {!isDashboardRoute && mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 sm:top-[72px] bg-slate-950/75 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
            aria-hidden="true"
          />

          <div className="absolute top-full left-0 right-0 md:hidden bg-[#071E26] border-b border-white/15 px-4 pt-3 pb-4 space-y-1 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
            {publicNavItems.map((item) => {
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

            <div className="pt-2 border-t border-white/10 mt-2 space-y-1">
              <Link
                href="/instructor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-amber-300 hover:bg-white/10"
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Instructor Portal</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-purple-300 hover:bg-white/10"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Console</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
