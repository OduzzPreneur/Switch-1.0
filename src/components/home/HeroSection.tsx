'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck, Users, Zap, BookOpen } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-switch-teal-900 via-switch-dark to-slate-950 text-white pt-12 pb-20 sm:pt-16 sm:pb-24">
      {/* Decorative background glow & mesh pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#1A7BAE_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-switch-teal/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-switch-orange/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-switch-orange/15 text-switch-orange-300 border border-switch-orange/30 shadow-inner">
            <Zap className="w-3.5 h-3.5 text-switch-orange" />
            Switch 1.0 Youth Empowerment
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15">
            Ages 15 – 40 Years
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            GOFAMINT Youth Fellowship Backed
          </span>
        </div>

        {/* Hero Main Copy */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-[1.15]">
            Switch Your Career.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-switch-orange to-amber-300">
              12 Tech & Vocational Skills
            </span>
            For a <span className="underline decoration-switch-orange underline-offset-8">₦5,000</span> Commitment Token.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
            A premier nationwide empowerment initiative engineered to train thousands of ambitious youth in high-income tech professions and vital vocational trades. 90% of training overhead is fully sponsored.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-switch-orange to-orange-500 hover:from-switch-orange-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-0.5"
            >
              <span>Enroll for Cohort 1.0</span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded font-mono">₦5,000</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/#tracks"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all"
            >
              <BookOpen className="w-4 h-4 text-switch-orange" />
              <span>Explore the 12 Tracks</span>
            </Link>
          </div>

          {/* Key Metrics / Highlights Pill Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-switch-orange">12</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">Curated Tracks</div>
              <div className="text-[10px] text-slate-400">6 Tech + 6 Vocational</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">₦5,000</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">Subsidized Token</div>
              <div className="text-[10px] text-slate-400">90% Partner Sponsoring</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">15 – 40</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">Target Age Bracket</div>
              <div className="text-[10px] text-slate-400">Youth & Young Adults</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">Empowerment Focused</div>
              <div className="text-[10px] text-slate-400">Hands-on + Mentorship</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
