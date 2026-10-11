'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, HeartHandshake, Mail, MapPin, Phone, Lock } from 'lucide-react';
import { TRACKS } from '@/data/tracks';

export default function Footer() {
  return (
    <footer className="bg-switch-dark text-slate-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Brand & Partnership Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-0.5 border border-white/20">
                <Image
                  src="/logos/switch-logo.jpg"
                  alt="The Switch 1.0"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                />
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

            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TLS 1.3 · Paystack PCI-DSS Level 1 Encrypted</span>
            </div>
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
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Trust Architecture</span>
            </span>
            <span>·</span>
            <span className="text-slate-400">Partnered with GYF (Strong & Able)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
