'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Bell, CheckCircle2, ArrowLeft, Sparkles, Shield } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  moduleName?: string;
  expectedDate?: string;
  description?: string;
  features?: string[];
  backLink?: string;
  backText?: string;
}

export default function ComingSoon({
  title = 'Feature Under Active Development',
  moduleName = 'Upcoming Module',
  expectedDate = 'Cohort 1.0 Curriculum Rollout',
  description = 'This portal section is currently being finalized by the Switch 1.0 academic and technical committee to ensure an exceptional learning experience.',
  features = [
    'Automated peer code & practical workshop reviews',
    'Curated blueprint resources and industry case studies',
    'Interactive cohort challenge scorecards',
    'Direct mentor office hours appointment booking',
  ],
  backLink = '/dashboard',
  backText = 'Return to Student Portal',
}: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
        
        {/* Subtle decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-switch-teal via-switch-orange to-amber-500" />

        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-switch-orange flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Clock className="w-8 h-8 text-switch-orange animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-switch-orange" />
          {moduleName}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-switch-dark tracking-tight mb-3">
          {title}
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {description}
        </p>

        {/* Expected timeline badge */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-700 font-semibold mb-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Release Target: {expectedDate}</span>
        </div>

        {/* Upcoming features preview */}
        {features.length > 0 && (
          <div className="text-left bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-6 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              What to Expect in this Module
            </div>
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-switch-teal shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}

        {/* Notify Me Form */}
        <div className="mb-6">
          {subscribed ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You will receive an instant notification when this unlocks!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your student email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 bg-switch-teal hover:bg-switch-teal-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notify Me</span>
              </button>
            </form>
          )}
        </div>

        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-switch-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{backText}</span>
        </Link>

      </div>
    </div>
  );
}
