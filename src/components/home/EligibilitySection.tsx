'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, Calendar, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function EligibilitySection() {
  const criteria = [
    {
      title: 'Minimum Education: Secondary School Cert (SSCE)',
      desc: 'Applicants must possess a minimum of an SSCE, WAEC, NECO, GCE, or NABTEB certificate. Open to school leavers, undergraduates, polytechnic/university graduates, and working professionals.',
      note: 'Not open to students currently enrolled in secondary school.',
      icon: GraduationCap,
      isAlert: true,
    },
    {
      title: 'Age Requirement: 15 to 40 Years',
      desc: 'Applicants must be between the ages of 15 and 40 years old at the time of enrollment. Designed to empower youth and young adults transitioning into productive economic capacity.',
      note: 'Age bracket verified during onboarding.',
      icon: Calendar,
      isAlert: false,
    },
    {
      title: 'Dedication & Technical Tools',
      desc: 'Applicants must commit 6 to 10 hours weekly. Tech tracks require access to a laptop and internet. Vocational trades require physical availability for scheduled practical workshops.',
      note: 'Hands-on project and attendance commitment required.',
      icon: UserCheck,
      isAlert: false,
    },
  ];

  return (
    <section id="eligibility" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-switch-teal/10 text-switch-teal text-xs font-bold uppercase tracking-wider mb-3">
            Eligibility & Requirements
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-switch-dark tracking-tight">
            Who Can Apply For Switch 1.0?
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Please review the admission prerequisites below before submitting your registration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {criteria.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-switch-teal flex items-center justify-center mb-5 border border-teal-100">
                    <Icon className="w-6 h-6 text-switch-teal" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.note}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-slate-900">
              Meet the requirements and ready to join?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Secure your slot in one of the 12 Tech & Vocational tracks for Cohort 1.0.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-switch-teal hover:bg-switch-teal-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow shrink-0"
          >
            <span>Proceed to Application</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
