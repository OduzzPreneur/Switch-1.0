'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TRACKS } from '@/data/tracks';
import SwitchLogo from '@/components/common/SwitchLogo';

export default function Footer() {
  const pathname = usePathname();

  // 1. Independent Admin Console Footer (One line)
  if (pathname.startsWith('/admin')) {
    return (
      <footer className="bg-[#05161c] text-slate-400 border-t border-white/10 py-3.5 px-4 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-white font-semibold">
            <SwitchLogo className="w-5 h-5" />
            <span className="text-xs">Switch 1.0 Administration Console</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>© {new Date().getFullYear()} Switch 1.0 Initiative. All rights reserved.</span>
            <span>·</span>
            <span className="text-purple-400 font-medium">Administrative Access</span>
          </div>
        </div>
      </footer>
    );
  }

  // 2. Independent Faculty / Instructor Portal Footer (One line)
  if (pathname.startsWith('/instructor')) {
    return (
      <footer className="bg-[#05161c] text-slate-400 border-t border-white/10 py-3.5 px-4 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-white font-semibold">
            <SwitchLogo className="w-5 h-5" />
            <span className="text-xs">Switch 1.0 Faculty Portal</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>© {new Date().getFullYear()} Switch 1.0 Initiative. All rights reserved.</span>
            <span>·</span>
            <span className="text-amber-400 font-medium">Instructor Workstation</span>
          </div>
        </div>
      </footer>
    );
  }

  // 3. Student Dashboard Portal Footer
  if (pathname.startsWith('/dashboard')) {
    return (
      <footer className="bg-[#071E26] text-slate-400 border-t border-white/10 py-6 px-4 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-white">
            <SwitchLogo className="w-6 h-6" />
            <span className="font-bold text-sm tracking-tight">Switch 1.0 Portal</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
              Cohort 1.0
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-300 text-xs font-semibold">
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
              Dashboard Overview
            </Link>
            <Link href="/dashboard?tab=curriculum" className="hover:text-emerald-400 transition-colors">
              Curriculum
            </Link>
            <Link href="/dashboard?tab=timetable" className="hover:text-emerald-400 transition-colors">
              Timetable & Venue
            </Link>
            <Link href="/dashboard?tab=assessments" className="hover:text-emerald-400 transition-colors">
              Assessments
            </Link>
            <Link href="/dashboard/profile" className="hover:text-emerald-400 transition-colors">
              My Profile
            </Link>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <p>© {new Date().getFullYear()} Switch 1.0 Initiative. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  // 4. Main Public Landing Page Footer
  return (
    <footer className="bg-switch-dark text-slate-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Brand & Partnership Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 drop-shadow-[0_2px_8px_rgba(255,94,20,0.25)]">
                <SwitchLogo className="w-10 h-10" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">
                  THE SWITCH <span className="text-switch-orange text-sm font-extrabold">1.0</span>
                </span>
                <span className="block text-[10px] text-slate-400">Youth Skills Empowerment Initiative</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering Nigerian youth aged 15–40 with high-income tech professions and self-reliant vocational skills. Subsidized in partnership with <strong>GOFAMINT Youth Fellowship (GYF - Strong & Able)</strong>.
            </p>
          </div>

          {/* Col 3: Tech Tracks */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Tech Disciplines
            </h4>
            <ul className="space-y-2 text-xs">
              {TRACKS.filter((t) => t.category === 'Tech').map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/register?track=${t.id}`}
                    className="hover:text-switch-orange transition-colors"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Vocational Trades */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Vocational Trades
            </h4>
            <ul className="space-y-2 text-xs">
              {TRACKS.filter((t) => t.category === 'Vocational').map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/register?track=${t.id}`}
                    className="hover:text-switch-orange transition-colors"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Quick Links & Contact */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Student Registration (₦5,000)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Portal Login
                </Link>
              </li>
              <li>
                <Link href="/#eligibility" className="hover:text-white transition-colors">
                  Eligibility Criteria (15–40 yrs)
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  Program FAQs
                </Link>
              </li>
              <li>
                <Link href="/coming-soon?module=Assessments" className="hover:text-white transition-colors">
                  Assessments Portal (Soon)
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Switch 1.0 Empowerment Initiative. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Partnered with GYF (Strong & Able)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
