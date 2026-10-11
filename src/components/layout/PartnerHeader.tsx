'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PartnerHeader() {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Partner Logos & Title */}
          <div className="flex items-center flex-wrap gap-3 sm:gap-5">
            {/* Logo Group */}
            <div className="flex items-center gap-3">
              {/* Switch 1.0 Brand Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white p-0.5">
                  <Image
                    src="/logos/switch-logo.jpg"
                    alt="The Switch 1.0"
                    width={44}
                    height={44}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                    priority
                  />
                </div>
                <div className="hidden xs:block">
                  <span className="block font-black text-switch-teal text-base leading-tight tracking-tight">
                    THE SWITCH <span className="text-switch-orange text-xs font-extrabold uppercase px-1.5 py-0.5 bg-orange-50 rounded border border-orange-200">1.0</span>
                  </span>
                  <span className="block text-[10px] text-slate-500 font-medium">Youth Empowerment</span>
                </div>
              </Link>

              {/* Vertical Divider */}
              <div className="h-7 w-[1px] bg-slate-200" />

              {/* GOFAMINT Youth Fellowship Logo */}
              <div className="flex items-center gap-2" title="GOFAMINT Youth Fellowship (GYF)">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-white p-0.5">
                  <Image
                    src="/logos/gofamint-logo.jpg"
                    alt="GOFAMINT Youth Fellowship - Strong & Able"
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <span className="block text-[11px] font-bold text-slate-800 leading-tight">
                    GOFAMINT YOUTH
                  </span>
                  <span className="block text-[9px] text-slate-500 font-semibold tracking-wide">
                    GYF · Strong & Able
                  </span>
                </div>
              </div>

              {/* Partner Badges */}
              <div className="hidden lg:flex items-center gap-2 pl-2">
                <span className="inline-flex items-center text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  Tech & Vocational Coalition
                </span>
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  Subsidized Token
                </span>
              </div>
            </div>

            {/* Vertical Divider for Programme Title */}
            <div className="hidden md:block h-8 w-[1px] bg-slate-200" />

            {/* Program Title & Subtitle (Modeled after reference Image 1) */}
            <div className="hidden md:block">
              <h1 className="text-xs lg:text-sm font-bold text-switch-teal tracking-tight flex items-center gap-1.5">
                Switch 1.0 Skills Development
              </h1>
              <p className="text-[10px] lg:text-[11px] text-slate-500">
                A 12-Track Empowerment Initiative · Ages 15 to 40
              </p>
            </div>
          </div>

          {/* Right: Cohort Pill & CTA Button */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Cohort 1.0 Status</span>
              <span className="text-xs font-bold text-slate-800">Registration Ongoing</span>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-switch-teal hover:bg-switch-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all group"
            >
              <span>Register Now</span>
              <span className="bg-switch-orange text-white text-[11px] px-1.5 py-0.2 rounded font-mono">₦5,000</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-700 hover:text-switch-teal px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              Portal Login
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
