'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, CheckCircle2, Shield, HeartHandshake, ArrowRight, Lock } from 'lucide-react';

export default function TokenBreakdownSection() {
  return (
    <section id="token-fee" className="py-20 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Context & Sponsoring Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              Empowerment Subsidy Model
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-switch-dark tracking-tight">
              Why A <span className="text-switch-orange">₦5,000</span> Registration Token?
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Standard professional courses in Web Development, Cybersecurity, Solar Installation, or UI/UX cost between <strong className="text-slate-800">₦150,000 and ₦350,000</strong> across Nigeria. 
            </p>

            <p className="text-slate-600 text-base leading-relaxed">
              Through strategic co-sponsorship by <strong>GOFAMINT Youth Fellowship (GYF)</strong> and partnering technology organizations, tuition is 90% subsidized. The <strong>₦5,000 commitment token</strong> is required solely to filter dedicated candidates and cover operational platform materials.
            </p>

            {/* What is covered list */}
            <div className="space-y-3 pt-2">
              {[
                'Full access to chosen track curriculum & live mentor hours',
                'Personalized Student Portal & progress tracking system',
                'Practical project reviews & graduation assessment',
                'Verifiable Digital Certificate of Completion upon graduation',
                'Post-training alumni network and project showcase opportunities',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Payments are processed securely via Paystack with end-to-end 256-bit encryption.</span>
            </div>
          </div>

          {/* Right Column: Pricing & Commitment Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-gradient-to-br from-switch-teal-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-switch-teal-700/50 overflow-hidden">
              
              <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-switch-orange/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-950/60 border border-orange-500/30 px-3 py-1 rounded-full mb-4">
                  Switch 1.0 Subsidized Pass
                </span>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">₦5,000</span>
                  <span className="text-slate-400 line-through text-lg font-medium">₦185,000</span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold mb-6">
                  97% Off Market Rate · One-time Token Fee
                </p>

                <div className="h-[1px] bg-white/10 my-4" />

                <div className="space-y-3 text-xs text-slate-300 mb-8">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Target Age:</span>
                    <span className="font-bold text-white">15 – 40 Years</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Available Tracks:</span>
                    <span className="font-bold text-white">12 (Tech & Vocational)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Payment Channel:</span>
                    <span className="font-bold text-white">Paystack (Debit Card, Transfer, USSD)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-bold text-emerald-400">Admissions Open</span>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-switch-orange to-orange-500 hover:from-switch-orange-600 hover:to-orange-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/30 text-sm group"
                >
                  <span>Register & Pay ₦5,000 Token</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-center text-[11px] text-slate-400 mt-4">
                  Instant receipt generation & portal onboarding upon confirmation.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
